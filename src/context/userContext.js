import React, { useEffect, useState, createContext } from 'react';
import resources from '../utils/resources';
import Gun from 'gun/gun';
import sea from 'gun/sea';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/lib/then';
import moment from 'moment'

import { sha256 } from '../utils/crypto';



const dpeepUserKeys = 'dpeepUserKeys';


const UserContext = createContext(null);
UserContext.displayName = 'userContext';


const UserProvider = (props) => {

    const [gun] = useState(Gun()); // { peers: serverpeers }
    const [gunUser, setGunUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const [signedUp, setSignedUp] = useState(false);
    const [user, setUser] = useState(null);
    const [users] = useState({});

    // The feed is global, so its available for build up in the background
    const [feed, setFeed] = useState([]);
    const [feedIndex, setFeedIndex] = useState({});
    const [feedUpdated, setFeedUpdated] = useState(null);


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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gunUser]);

    gun.on('auth', async () => {
        setIsLoggedIn(true);
        const user = gun.user();
        setGunUser(user);

        const dpeepUser = getUserContainer(user); // Load currently loggin user
        // Load the profile on to dpeepUser
        await loadProfile(dpeepUser);
        setUser(dpeepUser);
        initializeFeed(dpeepUser);
    });


    const getUserContainer = React.useCallback(
        (user) => {

            const pubId = (user.is) ? user.is.pub : user["_"]["soul"].substring(1);
            const dpeepNode = user.get(resources.node.names.dpeep);
            const profileNode = dpeepNode.get(resources.node.names.profile);
            const tweetsNode = dpeepNode.get(resources.node.names.tweets);
            const followsNode = dpeepNode.get(resources.node.names.follow);

            //const tree = new DateTree(tweetsNode, 'millisecond'); // Do not work properly, events do not get fired and data not stored.
            //const tree = tweetsNode;

            const container = { id: pubId, gunUser: user, tweetsNode: tweetsNode, profileNode: profileNode, followsNode: followsNode };
            users[pubId] = Object.assign(users[pubId] || {}, container);

            return users[pubId];
        },
        [users]
    );

    const getUserContainerById = React.useCallback(
        (pubId) => {
            const container = users[pubId]; // Just return an exiting container is exist
            if (container) return container;

            const user = gun.user(pubId);

            return getUserContainer(user); // Create a new one
        },
        [gun, users, getUserContainer]
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

    const setProfile = React.useCallback(
        async (profileData) => {
            if (!isLoggedIn) return;

            user.profileNode.put(profileData);
        },
        [isLoggedIn, user]
    );

    const loadProfile = React.useCallback(
        async (userNode) => {

            if (!userNode.profile) {
                const preProfile = {
                    handle: `${userNode.id.substring(0, 4)}...${userNode.id.substring(userNode.id.length - 4, userNode.id.length)}`,
                    username: 'Anonymous'
                };

                const loadedProfile = await userNode.profileNode.once().then();

                userNode.profile = Object.assign(resources.node.profile, preProfile, loadedProfile);
            }
            return userNode.profile;
        },
        []
    );


    // Methods ----------------------------------------------------------------------
    const addFeed = React.useCallback((data, date, sourceUser) => {
        const soul = Gun.node.soul(data);
        const id = soul.split('/').pop();
        if (feedIndex[soul]) // Do tweet already exit in feed?
            return false; // No need re-update

        const item = {
            soul: soul,
            id: id,
            tweet: data,
            user: sourceUser,
            createdAt: date
        }

        feed.unshift(item); // Make sure not to add the same object more than once to the list.
        feedIndex[soul] = item; // Use index, so the data only gets added to the feed once.
        return true;

    }, [feed, feedIndex]); // User here is the viewer

    const addLatestTweet = React.useCallback(async (user) => {
        //let [latestNode, latestDate] = await user.tweetsNode.latest();
        const latest = await user.tweetsNode.get(resources.node.names.latest).once().then();
        if (latest) {
            const date = moment(latest.createdAt);
            addFeed(latest, date, user);
        }
    }, [addFeed]);

    const subscribeTweets = React.useCallback((user) => {
        user.tweetsNode.get(resources.node.names.latest).on((tweet, key) => {
            const date = moment(tweet.createdAt);
            addFeed(tweet, date, user);
        });
    }, [addFeed]);


    // Build up users collection, needs refactoring, as it gets called multiple times.
    const initializeFeed = async (userContainer) => {
        console.log("Subscribing to users feed");
        await addLatestTweet(userContainer);
        subscribeTweets(userContainer);

        const followData = await userContainer.followsNode.once().then() || {};

        const addLatestTweets = Object.keys(followData).filter(key => key !== '_' && key !== userContainer.id && followData[key]).map(key => {

            const followUser = getUserContainerById(key);

            subscribeTweets(followUser);
            return addLatestTweet(followUser);
        });

        await Promise.all(addLatestTweets);
        setFeedUpdated('all');
    };

    // UseEffects --------------------------------------------------------------------------------------------

    // Signup effect, register at the userIndex that we exist.
    useEffect(() => {
        if (!signedUp || !isLoggedIn || !user) return;

        gun.get(resources.node.names.dpeep).get(resources.node.names.userIndex).get(user.id).put(user.gunUser);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signedUp, isLoggedIn]);


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
            user, users, gun, isLoggedIn, feed, feedIndex, feedUpdated, userSignUp, loginPassword, logout, setProfile, getUserContainerById, loadProfile, followUser
        }),
        [
            user, users, gun, isLoggedIn, feed, feedIndex, feedUpdated, userSignUp, loginPassword, logout, setProfile, getUserContainerById, loadProfile, followUser
        ]
    );

    return <UserContext.Provider value={value} {...props} />;
};

export { UserProvider, UserContext };
