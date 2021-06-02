import React, { useEffect, useState, createContext } from 'react';
import resources from '../utils/resources';
import Gun from 'gun/gun';
import sea from 'gun/sea';
// import 'gun/lib/radix';
// import 'gun/lib/radisk';
// import 'gun/lib/store';
// import 'gun/lib/rindexed';
import 'gun/lib/then';
// import Rad from 'gun/lib/radisk'; 
// import Radix from 'gun/lib/radix'; 

//import { createTweetContainer } from '../utils';
import { DateTree } from 'gun-util';

import { sha256 } from '../utils/crypto';



const dpeepUserKeys = 'dpeepUserKeys';
const serverpeers = ['http://localhost:8765/gun'];


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

      

    const [gun] = useState(Gun({ peers: serverpeers, isValid: isValidUser })); //{ peers: serverpeers, localStorage: false }{peers: ["http://server-ip-or-hostname:8080/gun"]}
    const [gunUser, setGunUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const [authenticate, setAuthenticate] = useState(false);
    const [signedUp, setSignedUp] = useState(false);
    const [user, setUser] = useState(null);
    const [users] = useState({});
    const [usersBan] = useState({}); // An index of users that are banned to access the local database, avoiding unwanted content.

    // The feed is global, so its available for build up in the background
    const [feed, setFeed] = useState(null);
    const [feedIndex, setFeedIndex] = useState({});
    const [feedReady] = useState({});
    const [messageReceived, setMessageReceived] = useState(null);


    // Verify that a user is not banned from adding data into local database.
    function isValidUser(msg) {
        let userId = Object.keys(msg.put).filter(k => k[0] === '~').map(k => k.split('/').shift()).shift();
        if(userId && usersBan[userId])
            return false;

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
        setFeed([]);
        setFeedIndex({});
        setAuthenticate(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gunUser]);


    const getUserContainer = React.useCallback(
        (gunUser) => {

            const pubId = (gunUser.is) ? '~'+gunUser.is.pub : gunUser["_"]["soul"];
            const dpeep = gunUser.get(resources.node.names.dpeep);
            const profile = dpeep.get(resources.node.names.profile);
            // The DateTree root has to be clean of other properties not related to DateTree. Or iteration will fail etc.
            const tweets = new DateTree(dpeep.get(resources.node.names.tweets), 'millisecond'); 
            const tweetsMetadata = dpeep.get(resources.node.names.tweetsMetadata);

            const follow = dpeep.get(resources.node.names.follow);
            const trust = dpeep.get(resources.node.names.trust);
            const confirm  = dpeep.get(resources.node.names.confirm);
            const comments = new DateTree(dpeep.get(resources.node.names.comments), 'millisecond');

            // Options
            // ---------------
            // Trust- x levels
            //  - Users
            //  - Tweets
            //  - Comments
            // Distrust
            //  - (Repeat categories.. etc )
            // Confirm
            //  - (Repeat categories.. etc )
            // Reject
            // Follow - x levels Users only
            // Block - single
            // Mute - single

            //const treeRoot = tweets.get('treeRoot');
            
            const node = { 
                user: gunUser, 
                tweets, 
                tweetsMetadata,
                profile, 
                follow, 
                dpeep,
                trust,
                confirm,
                comments
             };
            const container = { id: pubId, node, trust: {}, distrust: {}, confirm: {}, reject: {} };
            users[pubId] = Object.assign({}, users[pubId], container);

            return users[pubId];
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [users]
    );

    const getUserContainerById = React.useCallback(
        (pubId) => {
            const user = users[pubId]; 
            if (user && user.node) return user; // Just return an exiting container is exist and node is set

            const gunUser = gun.user(pubId);

            return getUserContainer(gunUser); // Create a new one
        },
        [gun, users, getUserContainer]
    );

    const createContainer =  React.useCallback( (data) => {
        const soul = Gun.node.soul(data);
        const soulElem = soul.split('/');

        const userId = soulElem.shift();
        soulElem.shift(); // Just shift to next element
        const category = soulElem.shift();
        const itemId = soulElem.join('/');

        const ownerContainer = getUserContainerById(userId);

        const item = {
            soul: soul,
            id: itemId,
            category: category,
            data: data,
            owner: ownerContainer,
            confirmedBy: {}
        }
        return item;
        },
        [getUserContainerById]
    );
    

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

    const followUser = React.useCallback(async (pubId) => {
        if (!isLoggedIn || user === null) return;

        user.followNode.get(pubId).put(gun.user(pubId));

    }, [isLoggedIn, user, gun]);

    const loadProfile = React.useCallback(
        (user, cb) => {

            if(!user.profile) {
                const preProfile = {
                    handle: `${user.id.substring(1, 5)}...${user.id.substring(user.id.length - 4, user.id.length)}`,
                    username: 'Anonymous',
                    auto: true
                };

                user.profile = Object.assign({}, resources.node.profile, preProfile);
            }
            if(cb && user.profile.auto) {
                user.profile.auto = false;
                user.node.profile.once((val) => {
                    user.profile = Object.assign({}, user.profile, val);
                    cb(user.profile);
                });
            }
            return user.profile;
        },
        []
    );



    // Methods ----------------------------------------------------------------------
    const addFeed = React.useCallback(data => {
        if(!data) // Data is null, we need to remove it from feed!? But what id?
            return;

        const item = createContainer(data);
        if(feedIndex[item.soul])
            return true;

        feedIndex[item.soul] = item; // Use index, so the data only gets added to the feed once.
        feedReady[item.soul] = item;
        setMessageReceived(item.soul);
        return true;

    }, [createContainer, feedIndex, feedReady]); // User here is the viewer

    const removeFromFeed = React.useCallback((soul, key) => {
        if(!soul) // Data is null, we need to remove it from feed!? But what id?
            return false;

        if(!feedIndex[soul])
            return false;

        delete feedIndex[soul];
        delete feedReady[soul];
        setMessageReceived(soul);

        return true;

    }, [feedReady, feedIndex]); // User here is the viewer


    const initializeFeed = (userContainer) => {
        console.log("Subscribing to users feed - GUN Style");
        const userFound = {}; // Make sure only to process the user once.

        function loadFeed(currentUser, currentLevel) 
        {
            userFound[currentUser.id] = true;

            const latest = currentUser.node.tweets.latest();
            latest?.then((arr) => {
                let [latestRef] = arr;
                latestRef.then( item => {
                    addFeed(item);
                });
            })

            currentUser.node.tweetsMetadata.get(resources.node.names.latest).on(addFeed);
            //currentUser.node.commentsMetadata.get(resources.node.names.latest).on(addFeed);
            //currentUser.node.tweets.get(resources.node.names.delete).on(removeFromFeed);

            if(--currentLevel < 0)
                return;  

            currentUser.node.follow.map().on((value, key) => {
                if(key && userFound[key])
                    return; // Do not process the same user twice.

                // Use value.level to check if follow should be done. Advanced version.

                const followUser = getUserContainerById(key);
                loadFeed(followUser, currentLevel);
            });
        }

        loadFeed(userContainer, 1); // Follow max one level out
    };

    function initializeTrust(userContainer, maxlevel = 1) {
        console.log(`Subscribing to users Trust - GUN Style`);
        const userFound = {}; // Make sure only to process the user once.

        const getUser = (key) => users[key] ||  
        (user[key] = Object.assign({}, users[key], 
            { id: key, trust: {}, trustedBy: {}, confirm: {}, confirmedBy: {} }));
        
        const getItem = (key) => feedIndex[key] || (feedIndex[key] = { confirmedBy: {} });

        function load(currentUser, currentLevel) 
        {
            userFound[currentUser.id] = true;
            
            if(--currentLevel < 0)
                return;  
            
            if(!currentUser.node)
                currentUser = getUserContainerById(currentUser.id);

            currentUser.node.trust.map().on((data, key) => {
                const localUser = getUser(key);
                localUser.trustedBy[currentUser.id] = data;
                //localUser.trustCount = (localUser.trustCount) ? localUser.trustCount + 1 : 1;
                //currentUser.trust[key] = localUser; // Do we need this one?

                if(!userFound[key])
                    load(localUser, currentLevel);
            });

            currentUser.node.confirm.map().on((data, soul) => {
                const item = getItem(soul);
                item.confirmedBy[currentUser.id] = data;
                //currentUser.confirm[soul] = item;
            });
        }

        load(userContainer, maxlevel); // Follow max one level out
    }


    const resetFeedReady = React.useCallback(() => {
        Object.keys(feedReady).forEach(p=> delete feedReady[p]);
        setMessageReceived(null);
    }, [feedReady]);


    
    const onAuth = React.useCallback(() => {
        setIsLoggedIn(true);
        const user = gun.user();
        setGunUser(user);

        const userContainer = getUserContainer(user); // Load currently loggin user
        // Load the profile on to dpeepUser
        loadProfile(userContainer);
        setUser(userContainer);
        initializeFeed(userContainer);
        initializeTrust(userContainer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setIsLoggedIn, setGunUser, getUserContainer, loadProfile, setUser, initializeFeed ]);


    const loadFeed = React.useCallback(() => {
        let temp = feed || [];
  
        const items = Object.values(feedReady);
        if(items.length > 0) {
          setFeed([...items, ...temp]); // Simply copy ready feed, more advanced sorting on date etc. may be implemented.
          resetFeedReady();
          return true;
        }
  
        if(feed)  // No new messages but we have a feed already
          return true;
  
        return false;
    }, [feed, feedReady, setFeed, resetFeedReady]);

    // UseEffects --------------------------------------------------------------------------------------------

    gun.on('auth', async () => {
        setAuthenticate(true);
    });


    useEffect(()=> {
        if(authenticate)
            onAuth();
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
        if(keysString && keysString.length > 2) {
          const keys = JSON.parse(keysString);
          if(keys)
            login(keys);
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    const value = React.useMemo(
        () => ({
            user, users, gun, isLoggedIn, feed, feedIndex, feedReady, messageReceived, userSignUp, loginPassword, 
            logout, setFeed, getUserContainerById,
            loadProfile, followUser, setMessageReceived, resetFeedReady, loadFeed,
            createContainer
        }),
        [
            user, users, gun, isLoggedIn, feed, feedIndex, feedReady, messageReceived, 
            userSignUp, loginPassword, logout, setFeed, getUserContainerById, 
            loadProfile, followUser, setMessageReceived, resetFeedReady, loadFeed,
            createContainer
        ]
    );

    return <UserContext.Provider value={value} {...props} />;
};

export { UserProvider, UserContext };

