import React, { useEffect, useState, createContext } from 'react';
import resources from '../utils/resources';

import { sha256 } from '../utils/crypto';
// import { UserContainer } from '../utils/UserContainer';
// import { Policy } from '../utils/Policy';
// import { MessageContainer } from '../lib/MessageContainer';
// import moment from 'moment';
import { UsersManager } from '../lib/UsersManager';
import { FeedManager } from '../lib/FeedManager';
import useGun from '../hooks/useGun';
import sea from 'gun/sea';




const dpeepUserKeys = 'dpeepUserKeys';


const UserContext = createContext(null);
UserContext.displayName = 'userContext';


const UserProvider = (props) => {


    const opt = { isValid: isValidUser };

    const { gun, authenticate, setAuthenticate } = useGun(opt);
      
    const [gunUser, setGunUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const [signedUp, setSignedUp] = useState(false);
    const [user, setUser] = useState(null);
    const [usersManager] = useState(new UsersManager(gun));

    // The feed is global, so its available for build up in the background
    const [feedManager] = useState(new FeedManager(usersManager));


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

    // Methods ----------------------------------------------------------------------

    const onAuth = React.useCallback(async () => {
        setIsLoggedIn(true);
        const user = gun.user();
        setGunUser(user);

        const loggedInUser = usersManager.getUserContainer(user); // Load currently loggin user
        // Load the profile on to dpeepUser
        loggedInUser.loadProfile(); // Init a profile call
        setUser(loggedInUser);

        feedManager.loadUser(loggedInUser);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setIsLoggedIn, setGunUser, feedManager, setUser]); //, initializeFeed


    // UseEffects --------------------------------------------------------------------------------------------

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
            user, gun, isLoggedIn, feedManager,  userSignUp, loginPassword,
            logout, usersManager,
        }),
        [
            user, gun, isLoggedIn, feedManager, 
            userSignUp, loginPassword, logout, usersManager,
        ]
    );

    return <UserContext.Provider value={value} {...props} />;
};

export { UserProvider, UserContext };