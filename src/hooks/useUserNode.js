import React, { useEffect, useState, useRef } from 'react';
import resources from '../utils/resources';

export const useUserNode = (pubId, nodeName, gun, isLoggedIn = true) => {

  const handler = useRef(null);
  const [ data, putData ] = useState(null);
  const [ node, putNode ] = useState(null);
  
  useEffect(() => {
    console.log("useUserNode useEffect");
    if(isLoggedIn) {
      const onHandler = async (field, nodeID, message, event) => {
        putData(field);

        if (!handler.current) 
          handler.current = event;
      }

      let userNode = (pubId) ? gun.user(pubId) : gun.user();
      let localNode = userNode.get(resources.node.names.dpeep).get(nodeName);
      localNode.on(onHandler);
      putNode(localNode);
    }
    return () => {
        //cleanup gun .on listener
        if (handler.current) 
          handler.current.off();
    };
  }, [isLoggedIn, pubId, nodeName, gun]);

  const put = React.useCallback(async (newdata) => {
      return await new Promise((resolve, reject) =>
        (node == null) ? reject("node not initialized"): node.put(newdata, (ack) => ack.err ? reject(ack.err) : resolve())
      );
    }, [node]);
  
  return { data, put, node, gun };
}