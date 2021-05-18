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

  const { feedReady, messageReceived, loadFeed } = useUser(); 

  const [ messageCount, setMessageCount] = useState(0);
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    const items = Object.values(feedReady);
    setMessageCount(items.length);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageReceived])

  
  if(messageCount === 0) return null;
  console.log("FeedStatus render");

  return (
    <Wrapper>
        <NavLink to='/' onClick={loadFeed}>
        New messages: {messageCount}
        </NavLink>
    </Wrapper>
  );
};

export default FeedStatus;
