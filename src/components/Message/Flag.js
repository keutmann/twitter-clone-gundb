import React, { useEffect, useState } from "react";
import { FlagFill } from 'react-bootstrap-icons';
import resources from "../../utils/resources";

const Flag = ({ item }) => {

    const [event, setEvent] = useState({ item });

    useEffect(() => {
    

        item.onStateChange.registerCallback(setEvent);
    
        return () => {
          item.onStateChange.unregisterCallback(setEvent);
        };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
    
    if(event.item?.state?.action === resources.node.names.neutral)
      return null;
      
    const color = event.item?.state?.color || "";

    return (
        <FlagFill color={color}></FlagFill>
      );
    }
    
export default Flag;
    