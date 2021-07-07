//import { DateTree } from "gun-util";
import { DispatcherEvent } from "./DispatcherEvent";
import resources from "./resources";

export class UserContainer {

    constructor(gunUser) {

        let pub = (gunUser.is) ? gunUser.is.pub : gunUser["_"]["soul"];
        this.id = (pub[0] === '~') ? pub.substring(1) : pub;
        this.nodeId = (pub[0] !== '~') ?  '~'+pub : pub;

        const dpeep = gunUser.get(resources.node.names.dpeep);
        const profile = dpeep.get(resources.node.names.profile);
        // The DateTree root has to be clean of other properties not related to DateTree. Or iteration will fail etc.
        //const tweets = new DateTree(dpeep.get(resources.node.names.tweets), 'millisecond');
        const tweets = dpeep.get(resources.node.names.tweets);
        //tweets.put({});
        const tweetsIndex = dpeep.get(resources.node.names.tweetsIndex);

        //const comments = new DateTree(dpeep.get(resources.node.names.comments), 'millisecond');
        const comments = dpeep.get(resources.node.names.comments);
        const commentsIndex = dpeep.get(resources.node.names.commentsMetadata);

        const relationships = dpeep.get(resources.node.names.relationships);
        const relationshipsIndex = dpeep.get(resources.node.names.relationshipsIndex);

        //const claims = new DateTree(dpeep.get(resources.node.names.claims), 'month'); // Combine all claims into one month batch, estimated best performance (It's a guess). 
        const claims = dpeep.get(resources.node.names.claims);
        const claimsIndex = dpeep.get(resources.node.names.claimsIndex);

        this.node = {
            user: gunUser,
            tweets,
            tweetsIndex: tweetsIndex,
            comments,
            commentsIndex: commentsIndex,
            profile,
            dpeep,
            relationships,
            relationshipsIndex: relationshipsIndex,
            claims,
            claimsIndex: claimsIndex
        };

        this.claims = {}; // Referece to loaded claims from gun.
        this.relationshipBy = [];
        this.relationships = {};
        this.relationshipChanged = 0;
        this.scores = [];
        this.score = null;
        this.onScoreChange = new DispatcherEvent("onScoreChange");
        this.state = this.createScore();
        this.onStateChange = new DispatcherEvent("onStateChange");
        this.onChange = new DispatcherEvent("onChange");
        this.onProfileChange = new DispatcherEvent("onProfileChange");
        this.degree = UserContainer.MAX_DEGREE; // The degree relative to the current user.
    }

    static MAX_DEGREE = 99; // Make the degree high, so when a relationship is added it will get lower. 

    emptyScoreObj() {
        return {
            trust: 0,
            follow: 0,
            neutral: 0,
            mute: 0,
            block: 0
            }
    };


    // Degree parameter is the source user's degree. 
    addScore(relationship, degree) {
        if(!this.scores[degree]) 
            this.scores[degree] = this.emptyScoreObj();

        this.scores[degree][relationship.action] += 1;
        this.onScoreChange.fire({user:this, degree, relationship });

        // if(this.degree > degree) // Only calculate score when the added relationship is relevant to the lowest degree.
        //     this.calculateScore();
    }

    removeScore(relationship, degree) {
        if(!this.scores[degree]) 
            return;

        this.scores[degree][relationship.action] -= 1;
        this.onScoreChange.fire({user:this, degree, action:relationship.action, score:this.scores[degree] });

        // if(this.degree > degree) // Only calculate score when the removed relationship is relevant to the lowest degree.
        //     this.calculateScore();
    }

    createScore (val) {
        return Object.assign({ score: 0, weight:0, color: "", action:resources.node.names.neutral }, val);
    }

    // Scores takes precendence in following order: trust, follow, mute, block.
    // E.g. Are the score equally between one or more scores, then the precendence order kicks in.
    getStates(score) {
        let states = [
            { score: score.trust, weight:score.trust+0.4, color: "purple", action: resources.node.names.trust },
            { score: score.follow, weight:score.follow+0.3, color: "green", action: resources.node.names.follow },
            { score: score.mute, weight:score.mute+0.2, color: "yellow", action: resources.node.names.mute },
            { score: score.block, weight:score.block+0.1, color: "black", action: resources.node.names.block },
            { score: score.neutral, weight:0,  color: "", action: resources.node.names.neutral }
        ];
        return states;
    }

    getReduceRelationshipBy() {
        const find = (arr, element, index) => {
            arr.push({ index, element });
            return arr;
        }
        return this.relationshipBy.reduce(find, []);
    }

    calculateScore() {
        let event = { user: this, change: false };

        const findScores = (a, e, i) => {
            a.push({ i, e });
            return a;
        }
        let tempList = this.scores.reduce(findScores, []);

        let firstScore = tempList.find(x=> x !== undefined && x.e !== undefined && (x.e.trust > 0 || x.e.follow > 0 || x.e.mute > 0 || x.e.block > 0));
        if(firstScore) {
            let states = this.getStates(firstScore.e);
            let firstState = states.sort((a, b) => b.weight - a.weight)[0];
            if(firstState.action !== this.state.action || firstScore.i+1 !== this.degree ) {
                this.score = firstScore.e;
                this.degree = firstScore.i+1; // The user degree is always one higher than the lowest degree of relationships.
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


    // oldDegree is the sourcesUser's old degree if changed from the current one, this is used to remove the old relationship.
    addRelationship(relationship, sourceUser, oldDegree) {
        let event = { change: false };
        //let rcopy = Object.assign({}, relationship); // Copy the relationship to avoid binding to GUN
        const degree = (oldDegree) ? oldDegree : sourceUser.degree; // Find source users degree for removing relationship
        if (!this.relationshipBy[degree]) this.relationshipBy[degree] = {};

        let oldRelationship = this.relationshipBy[degree][sourceUser.id];

        if(oldRelationship === relationship) 
            return event;

        if(oldRelationship) {
            delete this.relationshipBy[degree][sourceUser.id];
            this.removeScore(oldRelationship, degree);
        }

        // Neutral relationship do not get added, as they are null/cancel objects.
        if(relationship.action !== resources.node.names.neutral) {
            this.relationshipBy[sourceUser.degree][sourceUser.id] = relationship; 
            this.addScore(relationship, sourceUser.degree);
        }

        // Only calculate score when the added relationship is relevant to the lowest degree.
        // If this.degree is lower or equal to the added relationship degree, then the added relationship is not relevant for the calculation of score.
        if(this.degree > degree)  // degree is per default always 1 lower than this.degree.
            event = this.calculateScore();

        return event;

    }

    static getDefaultProfile(userid, profile) {
        const handle = (profile && profile.handle) || `${userid.substring(0,4)}...${userid.substring(userid.length - 4, userid.length)}`;
        const displayname =(profile &&  profile.displayname) || "Anonymous";
        return { userid, handle, displayname, loaded: false };
      }

    loadProfile(cb) {

        if (!this.profile) {
            const preProfile = UserContainer.getDefaultProfile(this.id, null);
            this.profile = Object.assign({}, resources.node.profile, preProfile);
        }

        if (cb && !this.profile.loaded) {
            this.node.profile.once((val) => {
                this.profile = Object.assign({}, this.profile, val); // Create a new object, that will trigger rerender on React
                this.profile.loaded = true;
                cb(this.profile);
            });
        }
        return this.profile;

    }

    setAction(targetUser, action) {
        //this.node.relationships.get(targetUser.nodeId).get('action').put(action.name);
        this.node.relationships.get('~'+targetUser.id).put(action);
    }

    loadProfile2(cb) {

        let profile = this._profile;

        return profile;

    }

    isFollow() {
        return (this.state && 
            (this.state.action === resources.node.names.trust || this.state.action === resources.node.names.follow));
    }

    isTrust() {
        return this.state && this.state.action === resources.node.names.trust;
    }

    // get profile2() {
    //     if (!this._profile) {
    //         const preProfile = UserContainer.getDefaultProfile(this.id, null);
    //         this._profile = Object.assign({}, resources.node.profile, preProfile);
    //     }

    //     if (this._profile.loaded < 1) { // No gun call have been made yet.
    //         this.node.profile.once((val) => {
    //             this._profile = Object.assign({}, this._profile, val); // Create a new object, that will trigger rerender on React
    //             this._profile.loaded = 2;
    //         });
    //     }
        
    //     return this._profile;
    // }
    
    // set profile2(profile) {
    //     this._profile = profile;
    // }


}