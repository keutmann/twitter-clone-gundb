import { useState, useEffect } from 'react';
import useUser from "./useUser";
//import resources from '../utils/resources';
//import Gun from 'gun/gun';
import 'gun/lib/promise';
import 'gun/lib/not';



// function GetItemIds(data) {
//   if(!data || !data["_"])
//     return undefined;

//   const soul = Gun.node.soul(data);
//   const soulElem = soul.split('/');
//   const userId = soulElem.shift();
//   soulElem.shift(); // Just shift to next element
//   const category = soulElem.shift();
//   if(category === "relationships") {
//     const year = soulElem.shift(); // Just shift to next element
//     const month = soulElem.shift(); // Just shift to next element
//     const date =new Date(year, month, 1);
//     const targetUserId = soulElem.shift();
//     return { userId, category, date, targetUserId };
//   }
//   const itemId = soulElem.join('/');

//   return { userId, category, itemId};

// }

const useFollow = (user) => {

  const { user: loggedInUser } = useUser();

  const [followState, setFollow] = useState(null);
  const [node, setNode] = useState(null);


  useEffect(() => {

    console.log("useFollow -> useEffect called");
    if(!user) return;
    // Load relationship, even that is may be in the users relationshipBy, but because of race condition load it from Gun. 
    const relationshipNode = loggedInUser.node.relationships.get('~'+user.id);
    setNode(relationshipNode);

    relationshipNode.once((data, key) => {
      setFollow((data && data["action"]) || "neutral"); // Fail safe for missing action property
    }, {wait: 100});

    // Default setup
    relationshipNode.not(function(key) { 
      setFollow("neutral");
    });
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFollowState = async () => {

    let state = (followState === "neutral") ? "follow" : "neutral";

    node.get("action").put(state);

    setFollow(state);
  };


  return [followState, setFollowState];
}

export default useFollow;