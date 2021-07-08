import moment from "moment";
import { DispatcherEvent } from "./DispatcherEvent";
import { Policy } from "./Policy";
import resources from "./resources";
import { TweetContainer } from "./TweetContainer";
import Gun from 'gun/gun';
//import { UsersManager } from "./UsersManager";


export class FeedManager {

    constructor(usersManager) {
        this.users = usersManager;

        this.reset();
    }

    reset() {
        this.end = undefined;
        this.start = undefined;

        this.feed = [];
        this.index = {}
        this.stagingNew = {};
        this.stagingNewCount = 0;
        this.stagingOld = {};
        this.stagingOldCount = 0;

        this.onFeedUdated = new DispatcherEvent("onFeedUdated");
        this.onNewTweetAdded = new DispatcherEvent("onNewTweetAdded");
        this.onOldTweetAdded = new DispatcherEvent("onOldTweetAdded");

        this.loggedInUser = null;
        this.maxDegree = 2;
        this.initialLoading = true; // The feed is still loading the initial messages.

    }

    getDate(dateString) {
        return moment.utc(dateString);
    }

    update() {
        let feedNew = TweetContainer.sort(this.stagingNew);
        let feedOld = TweetContainer.sort(this.stagingOld);
        this.feed = [...feedNew, ...this.feed, ...feedOld];
        if(this.feed.length > 0) {
            this.start = this.getDate(this.feed[0].id);
            this.end = this.getDate(this.feed[this.feed.length-1].id);
        } else {
            this.start = undefined;
            this.end = undefined;
        }
        this.stagingNew = {};
        this.stagingNewCount = 0;
        this.stagingOld = {};
        this.stagingOldCount = 0;

        this.onFeedUdated.fire(this.feed);
    }

    rollNext() {
        let feedOld = TweetContainer.sort(this.stagingOld);
        if (this.stagingOldCount > 0) {
            this.feed = [...this.feed, ...feedOld];
            this.end = (this.feed.length > 0) ? this.getDate(this.feed[this.feed.length-1].id) : undefined;
            this.stagingOld = {};
            this.stagingOldCount = 0;

            this.onFeedUdated.fire(this.feed);
        }
        this.loadNextBatch();
    }

    // When the feed has not been loaded yet.
    initialFeedLex() {
        const start = this.start || moment();
        const end =  this.end || moment(start);
        end.add(-1, 'month'); // For now, use 1 month, as the amount of feed available in the system is limited.
        //, , '>': end.toISOString() 
        let lex = {'.': { '>': end.toISOString() }, '%': 50000, '-': 1}; // The 50k limit has to be defined otherwise the lex do not work properly! The minus 1 makes the ordering correct.
        return lex;
    }

    // When looking for old messages after the feed has been loaded.
    rollFeedLex() {

        const start = this.end || moment();

        //TODO: Do not work!
        const lex = {'.': {'<': start.toISOString() }, '%': 50000, '-': 1}; // Just load 50k, and see where we end.
        return lex;
    }

    // Only get new messages from start date. 
    // When the feed has been loaded and new users are followed.
    // Basically this lex ensures that only new events are called.
    subscribeFeedLex() {
        const start = this.start || moment();

        let lex = {'.': {'>': start.toISOString() }, '%': 50000, '-': 1}; // The 50k limit has to be defined otherwise the lex do not work properly! The minus 1 makes the ordering correct.
        return lex;
    }

    // Loads old tweets from end date
    loadNextBatch() {
        for(var key of Object.keys(this.loggedInUser.relationships))
        {
            let localUser = this.users.getUserContainerById(key);
            if(localUser && localUser.isFollow()) {
                const search = this.rollFeedLex();
                
                localUser.node.tweets.get(search).once().map().once((data, key) => {
                    this.addFeedOld(data,key, localUser);
                }); // Load the latest tweet from the user.
            }
        }
    }



    // eslint-disable-next-line no-unused-vars
    removeFromFeed(soul, key) {
        if (!soul) // Data is null, we need to remove it from feed!? But what id?
            return false;

        if (!this.index[soul])
            return false;

        delete this.index[soul];
        delete this.stagingNew[soul];
        delete this.stagingOld[soul];
        
        return true;
    }

    getTweetContainerBySoul(soul) {
        return this.index[soul] ||  (this.index[soul] = new TweetContainer(null, soul));
    }

    getTweetContainerByData(data) {
        const soul = Gun.node.soul(data);

        const item = this.getTweetContainerBySoul(soul);
        item.data = data;
        if(!item.owner)
            item.setOwner(this.users.getUserContainerById(item.userId));

        return item;
    }


    addFeed(data, key, _msg, _ev) {
        if (!data) // Data is null, we need to remove it from feed!? But what id?
            return false;

        const item = this.getTweetContainerByData(data);

        if (Policy.addTweet(item, this.loggedInUser, null)) // Check with the policy before adding to feed.
        {
            if(this.stagingNew[item.soul]) // Item has already been added
                return true;

            this.stagingNew[item.soul] = item;
            this.stagingNewCount ++;
            this.onNewTweetAdded.fire(item);
        }
        else {
            // The policy is to exclude the tweet, therefore remove it if already exist.
            this.removeFromFeed(item.soul, null);
        }

        return true;
    }


    addFeedOld(data, key, owner) {
        if (!data) // Data is null, we need to remove it from feed!? But what id?
            return;

        const item = this.getTweetContainerByData(data);

        if (Policy.addTweet(item, this.loggedInUser, null)) // Check with the policy before adding to feed.
        {
            if(this.stagingOld[item.soul]) // Item has already been added
                return true;

            this.stagingOld[item.soul] = item;
            this.stagingOldCountCount ++;
            this.onOldTweetAdded.fire(item);
        }
        else {
            // The policy is to exclude the tweet, therefore remove it if already exist.
            this.removeFromFeed(item.soul, null);
        }

        return true;
    }

    
    addClaim(owner, gunClaim, soul, _msg, _ev) {
        const item = this.getTweetContainerBySoul(soul);
        item._ev = _ev; // Reference to Event enabling unsubscribtion.

        // Copy claim as the gunClaim changes by gun on change.
        const claim = Object.assign({}, gunClaim);
        if(!claim.degree) // Store the current degree, as when the owner changes the degree, its detectable
            claim.degree = owner.degree; 

        claim.owner = owner; 
        const oldClaim = owner.claims[soul];

        item.addClaim(claim, oldClaim);

        owner.claims[soul] = claim;

    }

    // TODO: The cascading effect of Trust and Untrust, needs to be done.
    unloadClaims(targetUser) {

        // Remove the trust from TargetUser on all items.
        for (const [key,] of Object.entries(this.loggedInUser.claims)) {
            let item = this.getTweetContainerBySoul(key);
            delete item.claimedBy[targetUser.id];
            item.claimsChanged = true;
        }; // Remove all claims

        // TODO: Subscibetion should be recorded, so its possible to unsubscribe again.
        // Current month and last month. 
        // var search = {
        //     gte: moment().add(-2, 'month').format("YYYY-MM-DD"),
        //     lt: moment().add(1, 'month').format("YYYY-MM-DD"),
        //     order: -1
        // }

        // const claimTree = targetUser.node.claims; // relationships is of Type DateTree

        // for await (let [month] of claimTree.iterate(search)) {
        //     month.off();
        // }
    }

    // // Most tweets are only looked at within a few days.
    // // This makes it unnecessary to load all claims from a single user from all time.
    // // The claims can be added on the month node and on a tweet based node. 
    // async loadClaims(targetUser) {
    //     const claimTree = targetUser.node.claims; // relationships is of Type DateTree

    //     // Current month and last month.
    //     var search = {
    //         gte: moment().add(-2, 'month').format("YYYY-MM-DD"),
    //         lt: moment().add(1, 'month').format("YYYY-MM-DD"),
    //         order: -1
    //     }

    //     for await (let [month] of claimTree.iterate(search)) {
    //         month.map().on((claim, key) => {
    //             this.addClaim(targetUser, claim, key);
    //         });
    //     }
    // }


    


    isTrust(event) {
        return event.previousState.action !== resources.node.names.trust
            && event.user.state.action === resources.node.names.trust;
    }

    isUntrust(event) {
        return event.previousState.action === resources.node.names.trust
            && event.user.state.action !== resources.node.names.trust;
    }

    isFollow(event) {
        return event.previousState.action !== resources.node.names.follow
            && event.user.state.action === resources.node.names.follow;
    }

    isUnfollow(event) {
        return event.previousState.action === resources.node.names.follow
            && event.user.state.action !== resources.node.names.follow;
    }

    isMute(event) {
        return event.previousState.action !== resources.node.names.mute
            && event.user.state.action === resources.node.names.mute;
    }

    isUnmute(event) {
        return event.previousState.action === resources.node.names.mute
            && event.user.state.action !== resources.node.names.mute;
    }

    isBlock(event) {
        return event.previousState.action !== resources.node.names.block
            && event.user.state.action === resources.node.names.block;
    }

    isUnblock(event) {
        return event.previousState.action === resources.node.names.block
            && event.user.state.action !== resources.node.names.block;
    }

    followUser(targetUser) {

        targetUser.node.tweets.map().once((data, key, _msg, _ev) => {
            console.log(data);
        }); // Load the latest tweet from the user.

        // let search = {'.': {'>': '2021-07-06T08:10:40.786Z'}, '%': 50000, '-': 1};
        // console.log(search);
        const search2 = (this.initialLoading) ? this.initialFeedLex() : this.subscribeFeedLex();

        targetUser.node.tweets.get(search2).map().once((data, key, _msg, _ev) => {
            console.log(data);
        }); // Load the latest tweet from the user.

        //console.log(search2);
        targetUser.node.tweets.get(search2).map().once((data, key, _msg, _ev) => {
            this.addFeed(data,key, _msg, _ev);
        }); // Load the latest tweet from the user.
    }

    unfollowUser(targetUser) {
        targetUser.node.tweets.map(this.followSearch).off(); // Unfollow target user.
    }

    trustUser(targetUser) {
        this.followUser(targetUser);

        //TODO: Need a lex search for the claims, for now, load all in one go.
        //Using the "on" event, as claims can change offen.
        targetUser.node.claims.map().on((v, k, m, e) => this.addClaim(targetUser, v, k, m, e)); // Load the latest tweet from the user.

        this.load(targetUser);
    }

    untrustUser(targetUser) {
        this.unfollowUser(targetUser);

        targetUser.node.claims.map().off();
        targetUser.processed = false;
        this.unloadClaims(targetUser);
    }

    processEvent(event, targetUser, currentUser) {
        if (this.isUnfollow(event)) {
            this.unfollowUser(targetUser);
        }

        if (this.isFollow(event)) {
            this.followUser(targetUser);
        }

        if (this.isTrust(event)) {
            this.trustUser(targetUser);
        }

        if (this.isUntrust(event)) {
            this.untrustUser(targetUser);
        }

        if (this.isUnmute(event)) {
            if (this.loggedInUser.id === currentUser.id) // Only unblock user, if the mute is from the logginInUser.
                delete this.users.block[targetUser.id];
        }

        if (this.isMute(event)) {
            if (this.loggedInUser.id === currentUser.id) // Only block user, if the mute is from the logginInUser.
                this.users.block[targetUser.id] = true;
        }

        if (this.isUnblock(event)) {
            delete this.users.block[targetUser.id];
        }

        if (this.isBlock(event)) {
            this.users.block[targetUser.id] = true;
        }
    }

    load(currentUser) {
        console.log("load: " + currentUser.id);

        if (currentUser.degree > this.maxDegree)
            return; // Exit as the search ends here

        if (currentUser.processed)
            return; // Exit as the current user already has its relationships processed.

        currentUser.processed = true; // Do not processed this user next time

        // Load relationships - map() automatically subscibes to changes in the relationship node
        currentUser.node.relationships.map().on((relationshipGun, key) => {
            if (key[0] !== '~') return; // Ignore noise data from the relationships node, only process users.

            // Copy the relationship, as the source object is updated automatically by Gun on change, making detecting changes impossible.
            const relationship = Object.assign({}, relationshipGun);

            const targetUser = this.users.getUserContainerById(key);

            const event = targetUser.addRelationship(relationship, currentUser, undefined);
            currentUser.relationships[targetUser.id] = relationship; // Save the relationship to the current user as well.

            if (event.change) {  // Something new happened, lets check it out.
                this.processEvent(event, targetUser, currentUser);
            }
        });
    }

    // Max degree is the number of degrees out the trust will be followed
    // First degree, people that loggedInUser is trusting. 
    // Second degree is people of trusted people that loggedInUser is trusting.
    loadUser(loggedInUser) {
        this.loggedInUser = loggedInUser;

        // Subscribe to one self and start loading the web of trust network
        this.loggedInUser.degree = 0; // logginInUser is always zero degree as the focus point.
        this.trustUser(this.loggedInUser);
    }

}