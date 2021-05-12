// import React, { useEffect, useState } from 'react';
// import { GunContext, } from '../context/gunContext';
// import resources from '../utils/resources';
// import sea from 'gun/sea';
// import { useUserNode } from './useUserNode';
// import { sha256, objectHashSha256 } from '../utils/crypto';

// import "gun/lib/then";
// //import { node } from 'gun';
// //import { then } from 'gun/lib/then'

// const useTweet = () => {


//     const { user: gunUser, isLoggedIn, userKeys, gun } = React.useContext(GunContext);

//     const { node: tweetsNode } = useUserNode(null, resources.node.names.tweets, gun, isLoggedIn);
//     const { node: followingNode } = useUserNode(null, resources.node.names.following, gun, isLoggedIn);

//   const [ tweets, setTweets ] = useState(null);
//   const [ profiles, setProfiles ] = useState({});
  
//   // Build up tweets collection
//   useEffect(() => {
//     console.log("useTweet useEffect");
//     if(!isLoggedIn || !tweetsNode || !followingNode) return;


//     if(tweets == null) {
//       let list = {};


//       const addTweet = (value, key, _msg, _ev) => {
//         list[value.id] = value; // Make sure not to add the same object more than once to the list.
//       }
//       const addProfile =(value, key, _msg, _ev) => {
//         profiles[key] = value; // Make sure not to add the same object more than once to the list.
//       }

//       // Subscribe to one self
//       tweetsNode.get(resources.node.names.latest).on(addTweet);

//       // Subscribe to tweets from all
//       followingNode.map().on(addProfile).get(resources.node.names.dpeep).get(resources.node.names.tweets).get(resources.node.names.latest).on(addTweet);

//       setTweets(list);
//     }


//   }, [tweetsNode, followingNode, isLoggedIn, tweets, profiles]);

//   // Create a tweet on Gun
//   const create = React.useCallback(async (tweet) => {
//     if(!isLoggedIn) return;

//     const tweetHash = objectHashSha256(tweet);

//     //const datastring = JSON.stringify(tweet);
//     //const tweetHash = await sha2562(datastring);  // Base64 encoded
//     const tweetId = await sha256(gunUser.is.epub + tweetHash); // Base64 encoded

//     console.log(`Tweet ID: ${tweetId}`);

//     const latestNode = tweetsNode.get(resources.node.names.latest);
//     const nodeData = Object.assign(tweet, resources.node.envelope); // Merge all properties from envelope to a tweet
//     nodeData._id = tweetId;
//     nodeData._sig = await sea.sign(tweetId, userKeys);
//     nodeData._createdAt = new Date().toISOString(); // Converts a date to a string following the ISO 8601 Extended Format.
//     //nodeData.__.nextTweet = latestNode;
    
//     const tn = tweetsNode.get(tweetId).put(nodeData); // Save tweet on users tweet collection
//     tn._['#'] = tweetId;
//     latestNode.put(tn); 


//     }, [isLoggedIn, gunUser, userKeys, tweetsNode]);
  
//    return { tweets, setTweets, create };

// }

// export default useTweet;

//     //let envelope = Object.assign(tweetsNode, createdAt: Date() }, resources.node.envelope);
//     //   return await new Promise((resolve, reject) =>
//     //     (node == null) ? reject("node not initialized"): node.put(newdata, (ack) => ack.err ? reject(ack.err) : resolve())
//     //   );


//       //(async () => {
//         //   const getLatestTweets = async (node) => {
//     //     let result = []; 
//     //     let nodeData = await node.once(p => p).then();
    
//     //     let promises = Object.keys(nodeData).map(async (v, i, a) => {
//     //       if(v === "_") return;
//     //       if(!nodeData[v]["#"]) return;
    
//     //       let element = await node.get(v).get(resources.node.names.tweets).get(resources.node.names.latest).once().then();
//     //       result[v] = element; // Make sure to only add the same element once
//     //     });
    
//     //     await Promise.all(promises);
    
//     //     return Object.values(result); // To array of objects
//     //    }

//     //let latestTweets = await getLatestTweets(followingNode);

//       //let element = await tweetsNode.get(resources.node.names.latest).once().then();
//       //result[v] = element; // Make sure to only add the same element once

//       // Add yourself to the list
//       // Do some sorting by CreatedAt
//       // Do some checking on the signature of the tweets
      

//       //setTweets(latestTweets);
//     //})();
