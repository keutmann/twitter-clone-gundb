import React, { useEffect, useState, createContext } from 'react';
import resources from '../utils/resources';
import Gun from 'gun/gun';
import sea from 'gun/sea';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/lib/then';
// import Rad from 'gun/lib/radisk'; 
// import Radix from 'gun/lib/radix'; 

import { sha256 } from '../utils/crypto';
// import { UserContainer } from '../utils/UserContainer';
// import { Policy } from '../utils/Policy';
// import { TweetContainer } from '../utils/TweetContainer';
// import moment from 'moment';
import { UsersManager } from '../utils/UsersManager';
import { FeedManager } from '../utils/FeedManager';




const dpeepUserKeys = 'dpeepUserKeys';
//const serverpeers = ['http://localhost:8765/gun'];
const serverpeers = [];


const UserContext = createContext(null);
UserContext.displayName = 'userContext';


const UserProvider = (props) => {

    Gun.on('opt', function (context) {
        if (context.once)
            return

        // Pass to subsequent opt handlers
        this.to.next(context)

        const { isValid } = context.opt

        if (isValid) {
            // Check all incoming traffic
            context.on('in', function (msg) {
                if (msg.put && !isValid(msg))
                    return;

                this.to.next(msg)
            })
        }
    });



    const [gun] = useState(Gun({localStorage: false, peers: serverpeers, isValid: isValidUser })); //{ peers: serverpeers, localStorage: false }{peers: ["http://server-ip-or-hostname:8080/gun"]}
    const [gunUser, setGunUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const [authenticate, setAuthenticate] = useState(false);
    const [signedUp, setSignedUp] = useState(false);
    const [user, setUser] = useState(null);
    const [usersManager] = useState(new UsersManager(gun));
    //const [usersBlock] = useState({}); // An index of users that are banned to access the local database, avoiding unwanted content.

    // The feed is global, so its available for build up in the background
    //const [feed, setFeed] = useState(null);
    const [feedManager] = useState(new FeedManager(usersManager));
    //const [feedIndex, setFeedIndex] = useState({});
    //const [feedReady] = useState({});
    const [messageReceived, setMessageReceived] = useState(null);


    // Verify that a user is not banned from adding data into local database.
    function isValidUser(msg) {
        // let userId = Object.keys(msg.put).filter(k => k[0] === '~').map(k => k.split('/').shift()).shift();
        // if (userId && usersBlock[userId])
        //     return false;

        return true;
    }



    // // Clear out the content from a user in the local Database, avoiding unwanted content.
    // const removeUserFromLocalDB = React.useCallback(
    //     async (userId) => {
    //         var rad = Rad();
    //         rad(userId, function(err, tree, info){
    //           Radix.map(tree, function(value, key){
    //             rad(key, null);
    //           });
    //         });
    //     },
    //     []
    // );

    const login = React.useCallback(
        async (keys) => {
            gun.user().auth(keys);
            sessionStorage.setItem(dpeepUserKeys, JSON.stringify(keys));

            return { success: true, msg: 'Is authenticating', keyPair: keys };
        },
        [gun]
    );

    const loginPassword = React.useCallback(
        async (username, password) => {

            const passwordString = username + password;
            const keyHash = await sha256(passwordString);
            const encryptedstring = localStorage.getItem(keyHash);

            if (!encryptedstring)
                return { success: false, msg: 'Unknown user or missing key pair. Try signup.' };

            const keyPair = await sea.decrypt(encryptedstring, passwordString);
            if (!keyPair)
                return { success: false, msg: 'Decryption of key pair failed' };

            return await login(keyPair);
        },
        [login]
    );

    const signup = React.useCallback(
        async (username, password) => {

            // Check first if the user already exist, and then auto login 
            const ack = await loginPassword(username, password);
            if (ack.sucess) // Login success, now return keypair 
                return ack;

            // There is no user, therefore create a new keyPair
            const passwordString = username + password;
            const keyHash = await sha256(passwordString);
            const keyPair = await sea.pair();
            const encryptedString = await sea.encrypt(JSON.stringify(keyPair), passwordString);
            localStorage.setItem(keyHash, encryptedString);

            return login(keyPair);
        },
        [login, loginPassword]
    );

    const logout = React.useCallback(() => {
        gunUser.leave();

        sessionStorage.setItem(dpeepUserKeys, '');
        setGunUser(null);
        setIsLoggedIn(false);
        setUser(null);
        feedManager.reset();
        setAuthenticate(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gunUser]);





    // const getUserContainer = React.useCallback(
    //     (gunUser) => {

    //         let userContainer = new UserContainer(gunUser);

    //         let pubId = userContainer.id;
    //         users[pubId] = userContainer;

    //         return userContainer;
    //     },
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     [users]
    // );

    // const getUserContainerById = React.useCallback(
    //     (pubId) => {
    //         if (pubId[0] === '~')
    //             pubId = pubId.substring(1);

    //         const user = users[pubId];
    //         if (user && user.node) return user; // Just return an exiting container is exist and node is set

    //         const gunUser = gun.user(pubId);

    //         return getUserContainer(gunUser); // Create a new one
    //     },
    //     [gun, users, getUserContainer]
    // );


    const userSignUp = React.useCallback(
        async (signedUpData) => {
            if (isLoggedIn)
                return;

            signup(signedUpData.handle, signedUpData.password);
            signedUpData.password = null;

            setSignedUp(true);
            //setSignedUpData(signedUpData); // Save data for when ready to update the user profile.
        },
        [isLoggedIn, signup, setSignedUp]
    );

    // const followUser = React.useCallback(async (pubId) => {
    //     if (!isLoggedIn || user === null) return;

    //     user.followNode.get(pubId).put(gun.user(pubId));

    // }, [isLoggedIn, user, gun]);

    // const loadProfile = React.useCallback(
    //     (user, cb) => {

    //         if (!user.profile) {
    //             const preProfile = {
    //                 handle: `${user.id.substring(0, 4)}...${user.id.substring(user.id.length - 4, user.id.length)}`,
    //                 username: 'Anonymous',
    //                 auto: true
    //             };

    //             user.profile = Object.assign({}, resources.node.profile, preProfile);
    //         }
    //         if (cb && user.profile.auto) {
    //             user.profile.auto = false;
    //             user.node.profile.once((val) => {
    //                 user.profile = Object.assign({}, user.profile, val);
    //                 cb(user.profile);
    //             });
    //         }
    //         return user.profile;
    //     },
    //     []
    // );

    // On call back,  data, key,


    // Methods ----------------------------------------------------------------------

    // eslint-disable-next-line no-unused-vars
    // const removeFromFeed = React.useCallback((soul, key) => {
    //     if (!soul) // Data is null, we need to remove it from feed!? But what id?
    //         return false;

    //     if (!feedIndex[soul])
    //         return false;

    //     delete feedIndex[soul];
    //     delete feedReady[soul];
    //     setMessageReceived(soul);

    //     return true;

    // }, [feedReady, feedIndex]); // User here is the viewer


    // const addFeed = React.useCallback((data, key, _msg, _ev) => {
    //     if (!data) // Data is null, we need to remove it from feed!? But what id?
    //         return;

    //     const item = new TweetContainer(data, getUserContainerById);

    //     if(Policy.addTweet(item, user, null)) // Check with the policy before adding to feed.
    //     {
    //         if (feedIndex[item.soul])
    //             return true;

    //         feedIndex[item.soul] = item; // Use index, so the data only gets added to the feed once.
    //         feedReady[item.soul] = item;
    //     }
    //     else {
    //         // The policy is to exclude the tweet, therefore remove it if already exist.
    //         removeFromFeed(item.soul, null);
    //     }

    //     setMessageReceived(item.soul);
    //     return true;

    // }, [feedIndex, feedReady, getUserContainerById, removeFromFeed, user]); // User here is the viewer

    // // Max degree is the number of degrees out the trust will be followed
    // // First degree, people that loggedInUser is trusting. 
    // // Second degree is people of trusted people that loggedInUser is trusting.
    // async function initializeRelationships(loggedInUser, maxDegree = 2) {
    //     console.log(`Subscribing to users Trust - GUN Style`);
    //     //const userFound = {}; // Make sure only to process the user once.

    //     console.log("initializeRelationships: " + loggedInUser.id);
    //     // Get a slim user object and not the full container 
    //     const getItem = (key) => feedIndex[key] || (feedIndex[key] = { claimedBy: {} });

    //     function addClaim(claim, key, user, localDegree) {
    //         const item = getItem(key);
    //         claim.localDegree = localDegree;
    //         item.claimedBy[user.id] = claim;
    //         user.claims[key] = claim;
    //     }

    //     // TODO: The cascading effect of Trust and Untrust, needs to be done.
    //     async function unloadClaims(targetUser) {

    //         // Remove the trust from TargetUser on all items.
    //         for (const [key,] of Object.entries(user.claims)) {
    //             let item = getItem(key);
    //             delete item.claimedBy[targetUser.id];
    //             item.claimsChanged = true;
    //         }; // Remove all claims

    //         // TODO: Subscibetion should be recorded, so its possible to unsubscribe again.
    //         // Current month and last month. 
    //         var search = {
    //             gte: moment().add(-2, 'month').format("YYYY-MM-DD"),
    //             lt: moment().add(1, 'month').format("YYYY-MM-DD"),
    //             order: -1
    //         }

    //         const claimTree = targetUser.node.claims; // relationships is of Type DateTree

    //         for await (let [month] of claimTree.iterate(search)) {
    //             month.off();
    //         }
    //     }

    //     // Most tweets are only looked at within a few days.
    //     // This makes it unnecessary to load all claims from a single user from all time.
    //     // The claims can be added on the month node and on a tweet based node. 
    //     async function loadClaims(targetUser) {
    //         const claimTree = targetUser.node.claims; // relationships is of Type DateTree

    //         // Current month and last month.
    //         var search = {
    //             gte: moment().add(-2, 'month').format("YYYY-MM-DD"),
    //             lt: moment().add(1, 'month').format("YYYY-MM-DD"),
    //             order: -1
    //         }

    //         for await (let [month] of claimTree.iterate(search)) {
    //             month.map().on((claim, key) => {
    //                 addClaim(claim, key, targetUser, targetUser.degree);
    //             });
    //         }
    //     }



    //     function isTrust(event) {
    //         return event.previousState.action !== resources.node.names.trust
    //             && event.user.state.action === resources.node.names.trust;
    //     }

    //     function isUntrust(event) {
    //         return event.previousState.action === resources.node.names.trust
    //             && event.user.state.action !== resources.node.names.trust;
    //     }

    //     function isFollow(event) {
    //         return event.previousState.action !== resources.node.names.follow
    //             && event.user.state.action === resources.node.names.follow;
    //     }

    //     function isUnfollow(event) {
    //         return event.previousState.action === resources.node.names.follow
    //             && event.user.state.action !== resources.node.names.follow;
    //     }

    //     function isMute(event) {
    //         return event.previousState.action !== resources.node.names.mute
    //             && event.user.state.action === resources.node.names.mute;
    //     }

    //     function isUnmute(event) {
    //         return event.previousState.action === resources.node.names.mute
    //             && event.user.state.action !== resources.node.names.mute;
    //     }

    //     function isBlock(event) {
    //         return event.previousState.action !== resources.node.names.block 
    //             && event.user.state.action === resources.node.names.block;
    //     }

    //     function isUnblock(event) {
    //         return event.previousState.action === resources.node.names.block
    //             && event.user.state.action !== resources.node.names.block;
    //     }

    //     function followUser(targetUser) {
    //         targetUser.node.tweetsMetadata.get(resources.node.names.latest).on(addFeed); // Load the latest tweet from the user.
    //     }

    //     function unfollowUser(targetUser) {
    //         targetUser.node.tweetsMetadata.get(resources.node.names.latest).off(); // Unfollow target user.
    //     }

    //     function trustUser(targetUser) {
    //         followUser(targetUser);

    //         targetUser.node.claimsMetadata.get(resources.node.names.latest).on((v, k) => addClaim(v, k, targetUser, targetUser.degree)); // Load the latest tweet from the user.
    //         // Load claims first async!
    //         loadClaims(targetUser);

    //         load(targetUser);
    //     }

    //     function untrustUser(targetUser) {
    //         unfollowUser(targetUser);

    //         targetUser.node.claimsMetadata.get(resources.node.names.latest).off();
    //         targetUser.processed = false;
    //         unloadClaims(targetUser);
    //     }

    //     function processEvent(event, targetUser, currentUser) {
    //         if(isUnfollow(event)) {
    //             unfollowUser(targetUser);
    //         }

    //         if(isFollow(event)) {
    //             followUser(targetUser);
    //         }
            
    //         if(isTrust(event)) {
    //             trustUser(targetUser);
    //         }
            
    //         if(isUntrust(event)) {
    //             untrustUser(targetUser);
    //         }

    //         if(isUnmute(event)) {
    //             if(loggedInUser.id === currentUser.id) // Only unblock user, if the mute is from the logginInUser.
    //                 delete usersBlock[targetUser.id]; 
    //         }

    //         if(isMute(event)) {
    //             if(loggedInUser.id === currentUser.id) // Only block user, if the mute is from the logginInUser.
    //                 usersBlock[targetUser.id] = true; 
    //         }

    //         if(isUnblock(event)) {
    //             delete usersBlock[targetUser.id];
    //         }

    //         if(isBlock(event)) {
    //             usersBlock[targetUser.id] = true; 
    //         }
    //     }

    //     async function load(currentUser) {
    //         console.log("initializeRelationships - load: " + currentUser.id);

    //         if (currentUser.degree > maxDegree)
    //             return; // Exit as the search ends here

    //         if(currentUser.processed)
    //             return; // Exit as the current user already has its relationships processed.

    //         currentUser.processed = true; // Do not processed this user next time

    //         // Load relationships - map() automatically subscibes to changes in the relationship node
    //         currentUser.node.relationships.map().on((relationshipGun, key) => {
    //             if (key[0] !== '~') return; // Ignore noise data from the relationships node, only process users.

    //             // Copy the relationship, as the source object is updated automatically by Gun on change, making detecting changes impossible.
    //             const relationship = Object.assign({}, relationshipGun); 

    //             const targetUser = getUserContainerById(key);

    //             const event = targetUser.addRelationship(relationship, currentUser, undefined);
    //             currentUser.relationships[targetUser.id] = relationship; // Save the relationship to the current user as well.

    //             if(event.change) {  // Something new happened, lets check it out.
    //                 processEvent(event, targetUser, currentUser);
    //             }
    //         });
    //     }

    //     // Subscribe to one self and start loading the web of trust network
    //     loggedInUser.degree = 0; // logginInUser is always zero degree as the focus point.
    //     trustUser(loggedInUser);
    // }


    // const resetFeedReady = React.useCallback(() => {
    //     Object.keys(feedReady).forEach(p => delete feedReady[p]);
    //     setMessageReceived(null);
    // }, [feedReady]);



    const onAuth = React.useCallback(async () => {
        setIsLoggedIn(true);
        const user = gun.user();
        setGunUser(user);

        const loggedInUser = usersManager.getUserContainer(user); // Load currently loggin user
        // Load the profile on to dpeepUser
        loggedInUser.loadProfile();
        setUser(loggedInUser);

        feedManager.loadUser(loggedInUser);


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setIsLoggedIn, setGunUser, feedManager, setUser]); //, initializeFeed


    // const loadFeed = React.useCallback(() => {
    //     let temp = feed || [];

    //     const items = Object.values(feedReady);
    //     if (items.length > 0) {
    //         setFeed([...items, ...temp]); // Simply copy ready feed, more advanced sorting on date etc. may be implemented.
    //         resetFeedReady();
    //         return true;
    //     }

    //     if (feed)  // No new messages but we have a feed already
    //         return true;

    //     return false;
    // }, [feed, feedReady, setFeed, resetFeedReady]);

    // UseEffects --------------------------------------------------------------------------------------------

    gun.on('auth', async () => {
        setAuthenticate(true);
    });


    useEffect(() => {
        if (authenticate) {
            (async () => {
                onAuth();
            })();

        
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authenticate])


    // Signup effect, register at the userIndex that we exist.
    useEffect(() => {
        if (!signedUp || !isLoggedIn || !user) return;

        gun.get(resources.node.names.dpeep).get(resources.node.names.userIndex).get(user.id).put(user.node.user);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signedUp, isLoggedIn, user]);


    // One time only effect 
    useEffect(() => {
        if (isLoggedIn) {
            console.log(`User loggedIn`);
            return;
        }

        // Auto signin the user if keys exist in sessionStorage
        const keysString = sessionStorage.getItem(dpeepUserKeys);
        if (keysString && keysString.length > 2) {
            const keys = JSON.parse(keysString);
            if (keys)
                login(keys);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = React.useMemo(
        () => ({
            user, gun, isLoggedIn, feedManager, messageReceived, userSignUp, loginPassword,
            logout, usersManager,
            setMessageReceived, 
            
        }),
        [
            user, gun, isLoggedIn, feedManager, messageReceived,
            userSignUp, loginPassword, logout, usersManager,
             setMessageReceived, 
             
        ]
    );

    return <UserContext.Provider value={value} {...props} />;
};

export { UserProvider, UserContext };