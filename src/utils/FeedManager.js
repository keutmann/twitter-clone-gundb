import moment from "moment";
import { DispatcherEvent } from "./DispatcherEvent";
import { Policy } from "./Policy";
import resources from "./resources";
import { TweetContainer } from "./TweetContainer";
//import { UsersManager } from "./UsersManager";


export class FeedManager {

    constructor(usersManager) {
        this.users = usersManager;

        this.reset();
    }

    reset() {
        this.end = moment();
        this.start = moment();

        // 2021-07-05T15:12:21Z
        // Find all before 2 month of now.
        this.followSearch = {'.': {'>': this.start.add(-2, "month").format("YYYY-MM") }}


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

    }

    update() {
        let feedNew = TweetContainer.sort(this.stagingNew);
        let feedOld = TweetContainer.sort(this.stagingOld);
        this.feed = [...feedNew, ...this.feed, ...feedOld];
        // this.start = feedNew[0].date;
        // this.end = feedOld[0].date;
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
            //this.end = feedOld[0].date;
            this.stagingOld = {};
            this.stagingOldCount = 0;

            this.onFeedUdated.fire(this.feed);
        }
        this.loadNextBatch();
    }

    // Loads old tweets from end date
    loadNextBatch() {

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
        
        //setMessageReceived(soul);

        return true;
    }


    addFeed(data, key, _msg, _ev) {
        if (!data) // Data is null, we need to remove it from feed!? But what id?
            return;

        const item = new TweetContainer(data);
        item.setOwner(this.users.getUserContainerById(item.userId));

        if (Policy.addTweet(item, this.loggedInUser, null)) // Check with the policy before adding to feed.
        {
            if (this.index[item.soul])
                return true;

            this.index[item.soul] = item; // Use index, so the data only gets added to the feed once.
            this.stagingNew[item.soul] = item;
            this.stagingNewCount ++;
            this.onNewTweetAdded.fire(item);
        }
        else {
            // The policy is to exclude the tweet, therefore remove it if already exist.
            this.removeFromFeed(item.soul, null);
        }

        //setMessageReceived(item.soul);
        return true;
    }

    // Get a slim user object and not the full container 
    getItem(key) {
        return this.index[key] || (this.index[key] = { claimedBy: {} });
    }

    addClaim(claim, key, user, localDegree) {
        const item = this.getItem(key);
        claim.localDegree = localDegree;
        item.claimedBy[user.id] = claim;
        user.claims[key] = claim;
    }

    // TODO: The cascading effect of Trust and Untrust, needs to be done.
    unloadClaims(targetUser) {

        // Remove the trust from TargetUser on all items.
        for (const [key,] of Object.entries(this.loggedInUser.claims)) {
            let item = this.getItem(key);
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
    //             this.addClaim(claim, key, targetUser, targetUser.degree);
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

        let search = {'.': {'>': '2021-07-06T08:10:40.786Z'}, '%': 50000, '-': 1};

        targetUser.node.tweets.get(search).map().once((data, key, _msg, _ev) => {
            this.addFeed(data,key, _msg, _ev);
        }); // Load the latest tweet from the user.
    }

    unfollowUser(targetUser) {
        targetUser.node.tweets.map(this.followSearch).off(); // Unfollow target user.
    }

    trustUser(targetUser) {
        this.followUser(targetUser);

        targetUser.node.claims.map(this.followSearch).on((v, k) => this.addClaim(v, k, targetUser, targetUser.degree)); // Load the latest tweet from the user.

        this.load(targetUser);
    }

    untrustUser(targetUser) {
        this.unfollowUser(targetUser);

        targetUser.node.claims.map(this.followSearch).off();
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