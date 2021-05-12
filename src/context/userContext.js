import React, { useEffect, useState, createContext } from 'react';
import { GunContext } from './gunContext';
//import sea from 'gun/sea';
//import { useUserNode } from '../hooks/useUserNode'
import resources from '../utils/resources';
//import { DateTree } from 'gun-util';
import 'gun/lib/then';
import moment from 'moment'



const UserContext = createContext(null);
UserContext.displayName = 'userContext';


const UserProvider = (props) => {
    const { user: gunUser, isLoggedIn, signup, gun, logout: gunLogout, loginPassword } = React.useContext(GunContext);
    //const { fields: profile, put: setProfile } = useGunState(user.get(dpeepRootName).get(profileName), { appKeys: null, sea });

    //const { data: profile, put: setProfile, node: profileNode } = useUserNode(null, resources.node.names.profile, gun, isLoggedIn); //node: profileNode
    const [signedUp, setSignedUp ] = useState(false);

    //const { node: tweetsNode } = useUserNode(null, resources.node.names.tweets, gun, isLoggedIn);
    //const { node: followNode } = useUserNode(null, resources.node.names.follow, gun, isLoggedIn);

    const [ user, setUser ] = useState(null);
    const [ users ] = useState({});

    // The feed is global, so its available for build up in the background
    const [ feed, setFeed ] = useState([]);
    const [ feedIndex, setFeedIndex ] = useState({});
  

    const getUserContainer = React.useCallback(
        (user) => {

            const pubId = (user.is) ? user.is.pub : user["_"]["soul"].substring(1);
            const dpeepNode = user.get(resources.node.names.dpeep);
            const profileNode = dpeepNode.get(resources.node.names.profile);
            const tweetsNode = dpeepNode.get(resources.node.names.tweets);
            const followsNode = dpeepNode.get(resources.node.names.follow);
            
            //const tree = new DateTree(tweetsNode, 'millisecond'); // Do not work properly, events do not get fired and data not stored.
            //const tree = tweetsNode;

            const container = { id: pubId, gunUser: user, tweetsNode:  tweetsNode, profileNode: profileNode, followsNode: followsNode};
            users[pubId] = Object.assign(users[pubId] || {}, container);

            return container;
        },
        [users]
    );

    const getUserContainerById = React.useCallback(
        (pubId) => {
            const container = users[pubId]; // Just return an exiting container is exist
            if(container) return container;

            const user = gun.user(pubId); 

            return getUserContainer(user); // Create a new one
        },
        [gun, users, getUserContainer]
    );

    const userSignUp = React.useCallback(
        async (signedUpData) => {
            if(isLoggedIn)
                return;

            signup(signedUpData.handle, signedUpData.password);
            signedUpData.password = null;

            setSignedUp(true);
            //setSignedUpData(signedUpData); // Save data for when ready to update the user profile.
        },
        [isLoggedIn, signup, setSignedUp]
    );

    // Create a tweet on Gun
    const createTweet = React.useCallback(async (tweet) => {
        if(!isLoggedIn) return;

        // Timestamp the tweet automatically
        
        //tweet._id = "test";

        //const tweetHash = await objectHashSha256(tweet);
        //const tweetId = await sha256(user.gunUser.is.epub + tweetHash); // Base64 encoded
    
        //console.log(`Tweet ID: ${tweet._id}`);
        
        //let data = Object.assign(tweet, resources.node.envelope); // Merge all properties from envelope to a tweet
        //data._id = tweetId;
        //data._sig = await sea.sign(tweetId, userKeys);
        const tweetId = moment().toISOString();
        tweet.createdAt = tweetId;
        //tweet.createdAt = tweetId; // Converts a date to a string following the ISO 8601 Extended Format.//const tweetId = new Date().toISOString();
        // console.log('Tweet ID : '+tweetId);

        const dataNode = user.tweetsNode.get(tweetId);
        const data = await dataNode.put(tweet);
        const previousTweet = await user.tweetsNode.get(resources.node.names.latest).once().then();
        if(previousTweet)
            dataNode.get('next').put(previousTweet);
            //data['next'] = previousTweet;

        user.tweetsNode.get('latest').put(data);

        // // Add comments object from the Gun root, as this is writeable for everone.
        // let commentsNode = gun.get(resources.node.names.dpeep).get(resources.node.names.comments).get(tweetId).put({});
        // let commentsData = await commentsNode.once().then();
        // tweetNode.get(resources.node.names.comments).put(commentsData);
    
    }, [isLoggedIn, user]);

    const followUser = React.useCallback(async (pubId) => {
        if(!isLoggedIn || user === null) return;
      
        user.followNode.get(pubId).put(gun.user(pubId));
    
    }, [isLoggedIn, user, gun]);

    const setProfile = React.useCallback(
        async (profileData) => {
            if(!isLoggedIn) return;

            user.profileNode.put(profileData);
        },
        [isLoggedIn, user]
    );

    const loadProfile = React.useCallback(
        async (userNode) => {

            if(!userNode.profile) {
                const preProfile = {
                    handle :`${userNode.id.substring(0,4)}...${userNode.id.substring(userNode.id.length - 4, userNode.id.length)}`,
                    username : 'Anonymous'
                };
                
                const loadedProfile = await userNode.profileNode.once().then();

                userNode.profile = Object.assign(resources.node.profile, preProfile, loadedProfile);
            }
            return userNode.profile;
        },
        []
    );
    
    const logoutUser = React.useCallback(() => {
        console.log('logout');
        gunLogout();
        setUser(null);
        setFeed([]);
        setFeedIndex({});
      }, [setUser, gunLogout]);
    

    // UseEffects --------------------------------------------------------------------------------------------

    // Signup effect, register at the userIndex that we exist.
    useEffect(() => {
        if(!signedUp || !isLoggedIn || !user) return;

        gun.get(resources.node.names.dpeep).get(resources.node.names.userIndex).get(user.id).put(user.gunUser);

      }, [signedUp, isLoggedIn, user, gun]);
    
    
    // Load profile of   
    useEffect(() => {
            if(!isLoggedIn) {
                return;
            } 

            if(!gunUser) return;

            (async function() {
                const dpeepUser = getUserContainer(gunUser); // Load currently loggin user

                // Load the profile on to dpeepUser
                await loadProfile(dpeepUser);

                setUser(dpeepUser);
            })()
        }, [isLoggedIn, setUser, getUserContainer, gunUser, loadProfile]);


    const value = React.useMemo(
        () => ({ 
            user, users, gun, isLoggedIn, feed, feedIndex, userSignUp, loginPassword, logoutUser, setProfile, getUserContainerById, loadProfile, createTweet, followUser
        }),
        [
            user, users, gun, isLoggedIn, feed, feedIndex, userSignUp, loginPassword, logoutUser, setProfile, getUserContainerById, loadProfile, createTweet, followUser
        ]
      );
    
    return <UserContext.Provider value={value} {...props} />;
};

export { UserProvider, UserContext };
