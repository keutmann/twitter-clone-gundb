import { DispatcherEvent } from './DispatcherEvent';
import resources from '../utils/resources';
import { UserContainer } from './UserContainer';

export class MessageContainer {

    static sortCompare = (a, b) => a.sortCompare(b);
    static sort = (obj) => Object.entries(obj).map(([key,val], i) => val).sort(MessageContainer.sortCompare);

    constructor(data, soul) {
        this.soul = soul;
        const soulElem = this.soul.split('/');
        this.userId = soulElem.shift(); // Get user ID, should be the same as Owner
        soulElem.shift(); // Just shift dpeep
        this.category = soulElem.shift(); 

        // Based on DateTime UTC format
        //this.id = `${soulElem[0]}-${soulElem[1]}-${soulElem[2]}T${soulElem[3]}:${soulElem[4]}:${soulElem[5]}.${soulElem[6]}Z`
        //this.id = `${soulElem[0]}`
        this.id = soulElem.shift(); 

        this.data = data;
        this.loaded = !(!data);
        //this.confirmedBy = {};
        this.claimBy = [];

        this.scores = [];
        this.score = null;
        this.onScoreChange = new DispatcherEvent("onScoreChange");
        this.state = this.createScore();
        this.onStateChange = new DispatcherEvent("onStateChange");
    }


    addClaim(claim, oldClaim) {
        const owner = claim.owner;

        let event = { change: false, claim, item: this };

        if(oldClaim && oldClaim.degree === claim.degree && oldClaim.action === claim.action)
            return event; // Do nothing.

        if(oldClaim) {
            const oldDegree = oldClaim.degree;

            // Degree has changed!
            if (!this.claimBy[oldDegree]) this.claimBy[oldDegree] = {};
            delete this.claimBy[oldDegree][owner.id];
            this.removeScore(oldClaim, oldDegree);
        }

        // Neutral claim do not get added, as they are null/cancel objects.
        if(claim.action !== resources.node.names.neutral) {
            const degree = claim.owner.degree;

            if (!this.claimBy[degree]) this.claimBy[degree] = {};

            this.claimBy[degree][owner.id] = claim; 
            this.addScore(claim);
        }

        // Only calculate score when the added claim is relevant to the lowest degree.
        // If this.degree is lower or equal to the added claim degree, then the added claim is not relevant for the calculation of score.
        //if(oldDegree !== degree)  // degree is per default always 1 lower than this.degree.
        this.calculateScore(event);

        // if(event.change) {
        //     this.processEvent(event);
        // }
                

        return event;
    }

    // There is no processing of the event!?
    // processEvent(event) {

    //     this.onStateChange.fire(event);
    // }

    emptyScoreObj() {
        return {
            confirm: 0,
            reject: 0,
            neutral: 0
            }
    };


    // Degree parameter is the source user's degree. 
    addScore(claim) {
        const degree = claim.owner.degree;
        if(!this.scores[degree]) 
            this.scores[degree] = this.emptyScoreObj();

        this.scores[degree][claim.action] += 1;
        this.onScoreChange.fire({user:this, degree, claim });
    }

    removeScore(claim, degree) {
        if(!this.scores[degree]) 
            return;

        this.scores[degree][claim.action] -= 1;
        this.onScoreChange.fire({user:this, degree, action:claim.action, score:this.scores[degree] });
    }

    createScore (val) {
        return Object.assign({ score: 0, weight:0, color: "", action:resources.node.names.neutral }, val);
    }

    // Scores takes precendence in following order: trust, follow, mute, block.
    // E.g. Are the score equally between one or more scores, then the precendence order kicks in.
    getStates(score) {
        let states = [
            { score: score.confirm, weight:score.confirm+0.2, color: "green", action: resources.node.names.confirm },
            { score: score.reject, weight:score.reject+0.1, color: "red", action: resources.node.names.reject },
            { score: score.neutral, weight:0,  color: "", action: resources.node.names.neutral }
        ];
        return states;
    }

    getReduceClaimBy() {
        const find = (arr, element, index) => {
            arr.push({ index, element });
            return arr;
        }
        return this.claimBy.reduce(find, []);
    }

    getScoreClaims() {
        let index = 0;
        while (!this.claimBy[index] && index < this.claimBy.length) index++;
        return [this.claimBy[index], index];
    }

    calculateScore(event) {
        //let event = { user: this, change: false };

        const findScores = (a, e, i) => {
            a.push({ i, e });
            return a;
        }
        let tempList = this.scores.reduce(findScores, []);

        let firstScore = tempList.find(x=> x !== undefined && x.e !== undefined && (x.e.confirm > 0 || x.e.reject > 0));
        if(firstScore) {
            let states = this.getStates(firstScore.e);
            let firstState = states.sort((a, b) => b.weight - a.weight)[0];
            if(firstState.action !== this.state.action || firstScore.i+1 !== this.degree ) {
                this.score = firstScore.e;
                this.degree = firstScore.i+1; // The item degree is always one higher than the lowest degree of claims.
                event.previousState = this.state;
                event.change = true;
                this.state = firstState;
                this.onStateChange.fire(event);
            }
        } else {
            this.score = this.emptyScoreObj();
            this.degree = UserContainer.MAX_DEGREE;
            event.previousState = this.state;
            event.change = true;
            this.state = this.createScore();
            this.onStateChange.fire(event);
        }

        return event;
    }


    setOwner(owner) {
        this.owner = owner;
    }


    get node() {
        return this._node ?? (this._node = this.owner.node.tweets.get(this.id));
    }
    
    set node(node) {
        this._node = node;
    }


    sortCompare(target) {
        return this.id > target.id ? -1 : 1;
    }
}