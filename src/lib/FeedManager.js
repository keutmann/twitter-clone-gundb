import { DispatcherEvent } from "../lib/DispatcherEvent";
import { Policy } from "../utils/Policy";
import resources from "../utils/resources";
import Gun from 'gun/gun';
import MessageManager from "./MessageManager";
import MessageContainer from "../lib/MessageContainer";
//import { UsersManager } from "./UsersManager";


export class FeedManager {

    constructor(usersManager) {
        this.users = usersManager;

        this.serius = 'hyECQHwSo7fgr2MVfPyakvayPeixxsaAWVtZ';
        this.ck = 'GA5U8Xwh6Kpx206nuC9jqbdffny4PtbyL0ZJV2WDR20';
    
        this.reset();
    }

    reset() {
        this.end = undefined;
        this.start = undefined;

        this.feed = [];
        this.feedIndex = new Map();

        this.claimsIndex = new Map();

        this.onFeedUdated = new DispatcherEvent("onFeedUdated");
        this.onNewMessageAdded = new DispatcherEvent("onNewMessageAdded");

        this.loggedInUser = null;
        this.maxDegree = 2;
        this.initialLoading = true; // The feed is still loading the initial messages.


        // From dPeepFeed
        //this.state = {sortedMessages:[], countOld: 0, countNew: 0, loading: true }; // The list of messages displayed.
        this.eventListeners = new Map();
        this.userFound = new Map(); 

        this.messagesLoading = []; // Batch of messages currently loading.

        //this.toDate = undefined;  // null is start value, to indicate always latest. Then used in the roll of batches.
        this.fromDate = new Date(); // fromDate < toDate 
        this.fromDate.setMonth(this.fromDate.getMonth() - 1);// TODO: For now, use -1 month per batch, as the amount of feed available in the system is limited.

        this.batchSize = 10;
        this.callloading = 0;

        this.loading = false;

        this.gunLoadSize = 1024*50;

        //this.eventQueque = []; // Seems to have no effect

    }


    // eslint-disable-next-line no-unused-vars
    // removeFromFeed(soul, key) {
    //     if (!soul) // Data is null, we need to remove it from feed!? But what id?
    //         return false;

    //     if (!this.index[soul])
    //         return false;

    //     delete this.index[soul];
    //     delete this.stagingNew[soul];
    //     delete this.stagingOld[soul];

    //     return true;
    // }

    // getMessageContainer(opt) {
    //     let item = this.feedIndex.get(opt.key);
    //     if(!item) {
    //         item = new MessageContainer(opt);
    //         this.feedIndex.set(opt.key, item);
    //     }

    //     if(opt.err)
    //         item.err = opt.err;

    //     if(opt.message) {
    //         item.message = opt.message;
    //         item.loaded = true;
    //     }

    //     // if(!item.owner)
    //     //     item.setOwner(this.users.getUserContainerById(item.userId));

    //     return item;
    // }




    addFeed(data, key, owner, category) {
        if (!data) // Data is null, we need to remove it from feed!? But what id?
            return false;

        let soul = Gun.node.soul(data);
        
        let item = this.feedIndex.get(soul); 
        if(item && item.loaded) return; // The message already exist and loaded

        // Build the message container
        let opt = Object.assign(MessageManager.splitKey(key), { soul, category, owner, data });
        if(!item) {
            item = new MessageContainer(opt);
            this.feedIndex.set(soul, item);
        }
        if(!item.loaded)
            item.init(opt)
        
        if (Policy.addTweet(item, this.loggedInUser, null)) // Check with the policy before adding to feed.
        {
            this.messagesLoading.push(item); // Use only key for easy sorting
            owner.pushToDate(item.date); // Make the current massage the latest toDate.
            this.onNewMessageAdded.fire(item);
        }
        else {
            //TODO: The policy is to exclude the tweet, therefore remove it if already exist.
            //this.removeFromFeed(item.key, null);
        }

        return true;
    }

    addMessages() {
        console.log("addMessages: "+this.messagesLoading.length);

        // The sort function is in reverse()
        this.messagesLoading.sort(function(a, b) {
            if (a.date > b.date) return -1;
            if (a.date < b.date) return 1;
            // dates must be equal
            return 0;
          });

        let list = this.messagesLoading.splice(0, this.batchSize*10);

        this.feed = [...this.feed, ...list]

        this.onFeedUdated.fire(this.feed);
    }


    loadNextBatch() {

        if(this.loading) return;

        if (this.messagesLoading.length > this.batchSize) {
            this.addMessages();
            return;
        }

        this.loading = true; // Block new calls
        // Load new messages
        this.unsubscribe(); // Will ensure that new events can be attached to nodes.

        this.fromDate.setMonth(this.fromDate.getMonth() - 1);// TODO: For now, use -1 month per batch, as the amount of feed available in the system is limited.
        console.log(`loadNextBatch: From ${this.fromDate?.toISOString()}`);

        this.loadFromMem(this.loggedInUser);

        this.loadWaiter(this.loadNextBatch);
    }

    // Loads old tweets from end date
    loadFromMem(user) {
        //console.log("Load Next user: "+key);
        this.followUser(user);

        for(let [key,] of user.relationships)
        {
            if(this.userFound.has(key)) continue;
            this.userFound.set(key, true);

            
            let localUser = this.users.getUserContainerById(key);
            if (localUser.degree > this.maxDegree)
                continue; // Exit as the search ends here

            if(localUser && localUser.isFollow()) {
                this.loadFromMem(localUser);
            }
        }
    }

    loadWaiter(batchSize) {
        console.log("set timeout for loading new messages.");
        let time = 0;
        let elapse = 200;

        // Load messages and only show them when there are more than batchSize. Has to be more than batchSize becuase not to trigger a new event call.
        // eslint-disable-next-line no-var
        var timerId = setInterval(() => {
          time += elapse;
          console.log(`setInterval called: ${time} - Messages: ${this.messagesLoading.length}`)

          // When will there be enough messages to sort on?
          if(!batchSize || this.messagesLoading.length < batchSize) return;
          clearInterval(timerId);
          this.addMessages();  

        }, elapse);

        // Make sure to stop the interval, and load messages on screen if needed.
        // This case may occur when the messages found are less than 10 or the system is slow.
        setTimeout(() => {
          clearInterval(timerId);
          console.log("setTimeout called");
          if(this.messagesLoading.length > 0) {
            this.addMessages();
          } else {
              this.loading = false;
          }
        }, 5000);
    }


    unsubscribe() {
        // Unsubscribing exiting events enables new subscription on the same node.
        // for (let value of this.eventListeners.values()){
        //     value.off();
        // }
        //this.eventListeners = new Map();
        this.userFound = new Map();
    }

    // hash of the claim is the id of the message.
    addClaim(owner, gunClaim, key, _msg, _ev) { 
        owner.claimsEvent = _ev; // Reference to Event enabling unsubscribtion.

        let [, soul] = key.splitKey("#"); // key = isodate#soul
        if(!soul) return;

        let item = this.feedIndex.get(soul); 
        if(!item) {
            item = new MessageContainer({ soul });
            this.feedIndex.set(soul, item);
        }

        // Copy claim as the gunClaim changes as with gun automatically, making it not possible to detect the change.
        const newClaim = Object.assign({}, gunClaim);
        //if (!newClaim.degree) // Store the current degree, as when the owner changes the degree, its detectable
        newClaim.degree = owner.degree;
        newClaim.owner = owner;

        const oldClaim = owner.claims.get(soul);

        item.addClaim(newClaim, oldClaim);

        owner.claims.set(soul, newClaim);
    }

    // TODO: The cascading effect of Trust and Untrust, needs to be done.
    unloadClaims(targetUser) {

        // Remove the trust from TargetUser on all items.
        for (const [key,] of Object.entries(this.loggedInUser.claims)) {
            let item = this.feedIndex.get(key);
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

    // Most messages are only looked at within a few days.
    // This makes it unnecessary to load all claims from a single user from all time.
    // The claims can be added on the month node and on a tweet based node. 
    loadClaims(targetUser) {

        //TODO: Need a lex search for the claims, for now, load all in one go.
        //Using the "on" event, as claims can change offen.
        targetUser.node.claims.map((v, k, m, e) => this.addClaim(targetUser, v, k, m, e)); // Load the latest tweet from the user.

        // Add ClaimsDate Node to reference claims in a date order.
    }


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

    // eslint-disable-next-line no-var
    buildLex(to, from) {
        let toDate = (to) ? to.toISOString() : '\uffff';
        let fromDate = (from) ? from.toISOString() : '';

        let lex = {
            '.': {
                '>': fromDate,
                '<': toDate, // Use \uffff in lesser than
                '-': 1
            }, // The 1 makes the ordering reverse.
            '%': this.gunLoadSize
        }; // The this.gunLoadSize limit has to be defined otherwise the lex only returns 1 result. 
        return lex;
    }
    

    followUser(targetUser) {

        targetUser.fromDate = this.fromDate;

        const search = this.buildLex(targetUser.toDate, targetUser.fromDate);

        targetUser.followEvent?.off();

        if(targetUser.id.indexOf(this.serius) === 0 ) {
            console.log("Serius: ");
            console.log(JSON.stringify(search));
        }
        targetUser.followEvent?.off();

        targetUser.node.tweets
            .get(search)
            .once(undefined, { wait: 5000 }) // Get the result once!
            .map((data, key, _msg, _ev) => {
            this.addFeed(data, key, targetUser, "messages");
            targetUser.followEvent = _ev;
            return this;
        }, { wait: 5000 }); // Load the latest tweet from the user.
    }



    unfollowUser(targetUser) {
        targetUser.followEvent?.off();
    }

    trustUser(targetUser) {
        this.followUser(targetUser);
       
        this.loadClaims(targetUser);
        this.loadRelationship(targetUser);
    }

    untrustUser(targetUser) {
        this.unfollowUser(targetUser);

        targetUser.node.claims.map().off();
        targetUser.processed = false;
        this.unloadClaims(targetUser);
    }

    processEvent(event) {
        let targetUser = event.user;
        let currentUser = event.sourceUser;

        if (this.isUnfollow(event)) {
            this.unfollowUser(targetUser);
        }

        if (this.isFollow(event)) {
            this.followUser(targetUser);
            this.loadRelationship(targetUser);
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


    loadRelationship(currentUser) {
        if (currentUser.degree > this.maxDegree)
            return; // Exit as the search ends here

        if (this.userFound.has(currentUser.id))
            return; // Exit as the current user already has its relationships processed.

        this.userFound.set(currentUser.id, true);

        // Load relationships - map() automatically subscibes to changes in the relationship node
        currentUser.node.relationships.map((relationshipGun, key) => {
            if (key[0] !== '~') return this; // Ignore noise data from the relationships node, only process users.

            // Copy the relationship, as the source object is updated automatically by Gun on change, making detecting changes impossible.
            const relationship = Object.assign({}, relationshipGun);

            const targetUser = this.users.getUserContainerById(key);

            const event = targetUser.addRelationship(relationship, currentUser, undefined);
            currentUser.relationships[targetUser.id] = relationship; // Save the relationship to the current user as well.

            if (event.change) {  // Something new happened, lets check it out.
                this.processEvent(event, targetUser, currentUser);
            }
            return this;
        });
    }

    // Max degree is the number of degrees out the trust will be followed
    // First degree, people that loggedInUser is trusting. 
    // Second degree is people of trusted people that loggedInUser is trusting.
    loadUser(loggedInUser) {

        //this.loading = true; // Block new calls

        this.loggedInUser = loggedInUser;

        // Subscribe to one self and start loading the web of trust network
        this.loggedInUser.degree = 0; // logginInUser is always zero degree as the focus point.
        this.trustUser(this.loggedInUser);

        console.log("initialLoad");

        this.loadWaiter();
      }
}
