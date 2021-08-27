import React, { useEffect, useState} from "react";
import styled from "styled-components";
import useUser from "../hooks/useUser";
import { NavLink } from "react-router-dom";


const Wrapper = styled.div`
    text-align: justify;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const FeedStatus = () => {

  const { feedManager } = useUser(); 

  const [messageCount, setMessageCount] = useState(0);
  
  const update = () => feedManager.update();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    const setCountCallback = (item) => {
      setMessageCount(feedManager.stagingNewCount);
    };

    feedManager.onFeedUdated.registerCallback(setCountCallback);
    feedManager.onNewMessageAdded.registerCallback(setCountCallback);
   
    return () => {
      feedManager.onFeedUdated.unregisterCallback(setCountCallback);
      feedManager.onNewMessageAdded.unregisterCallback(setCountCallback);
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  
  if(messageCount === 0) return null;
  console.log("FeedStatus render");

  return (
    <Wrapper>
       <NavLink to='/' onClick={update}>
        New messages: {messageCount}
        </NavLink>
    </Wrapper>
  );
};

export default FeedStatus;
