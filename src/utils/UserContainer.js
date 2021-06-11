import { DateTree } from "gun-util";
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
        const tweets = new DateTree(dpeep.get(resources.node.names.tweets), 'millisecond');
        const tweetsMetadata = dpeep.get(resources.node.names.tweetsMetadata);

        const relationships = dpeep.get(resources.node.names.relationships);
        const relationshipsMetadata = dpeep.get(resources.node.names.relationshipsMetadata);

        const claims = new DateTree(dpeep.get(resources.node.names.claims), 'month'); // Combine all claims into one month batch, estimated best performance. 
        const claimsMetadata = dpeep.get(resources.node.names.claimsMetadata);
        this.node = {
            user: gunUser,
            tweets,
            tweetsMetadata,
            profile,
            dpeep,
            // people,
            // peopleMetadata,
            relationships,
            relationshipsMetadata,
            claims,
            claimsMetadata
        };

        this.relationshipBy = [];
        this.relationships = {};
        this.localState = { score: 0, color: "", name: "neutral", degree: 0 };
        this.relationshipChanged = 0;
        this.score = this.scoreInit();
        this.onChange = new DispatcherEvent("onChange");
        this.onProfileChange = new DispatcherEvent("onProfileChange");
    }

    scoreInit() {
        return {
            trust: 0,
            follow: 0,
            neutral: 0,
            mute: 0,
            block: 0
            }
    };

    getColors() {
        let colors = [
            { score: this.score.neutral, color: "", name: "neutral", degree: 0 },
            { score: this.score.trust, color: "purple", name: "trust", degree: 0 },
            { score: this.score.follow, color: "green", name: "follow", degree: 0 },
            { score: this.score.mute, color: "yellow", name: "mute", degree: 0 },
            { score: this.score.block, color: "black", name: "block", degree: 0 }
        ];
        return colors;
    }

    calculateScore() {
        this.score = this.scoreInit(); // Reset score


        const findDegrees = (a, e, i) => {
            a.push({ index: i, data: e });
            return a;
        }
        let degrees = this.relationshipBy.reduce(findDegrees, []);
        let localStateDegree = 0;

        for (const degree of degrees) {
            let entries = Object.entries(degree.data);
            // eslint-disable-next-line no-unused-vars
            for (const [key, value] of entries) {
                //console.log(`${key}: ${value}`);
                this.score[value.action] += 1;
            }
            if (entries.length > 0) {
                localStateDegree = degree.index;
                break; // We found relationships, do not continue to the next of level of degree.
            }
        }
        return localStateDegree;
    }

    calculateState() {
        let degree = this.calculateScore();

        let colors = this.getColors();
        this.localState = colors.sort((a, b) => b.score - a.score)[0];
        this.localState.degree = degree;
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
            this.profile.loaded = true;
            this.node.profile.once((val) => {
                this.profile = Object.assign({}, this.profile, val); // Create a new object, that will trigger rerender on React
                cb(this.profile);
            });
        }
        return this.profile;

    }

    setAction(targetUser, action) {
        //this.node.relationships.get(targetUser.nodeId).get('action').put(action.name);
        this.node.relationships.get('~'+targetUser.id).put(action);
    }

}