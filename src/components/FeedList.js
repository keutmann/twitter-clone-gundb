import React, { useEffect } from "react";
import styled from "styled-components";
import Loader from "./Loader";
import Tweet from "./Tweet/Tweet";
import CustomResponse from "./CustomResponse";
import useUser from "../hooks/useUser";


const Wrapper = styled.div`
  margin-bottom: 7rem;
`;

const FeedList = () => {

  const { feed, feedReady, setFeed, setFeedReady, messageReceived } = useUser();

// eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if(!feed && feedReady.size > 0) {
      setFeed([...feedReady.values()]); // Simply copy ready feed, more advanced sorting on date etc. may be implemented.
      setFeedReady(new Map());
      console.log("FeedList Initialized");
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[messageReceived]);

  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if(feed && feedReady && feedReady.size > 0) {
      setFeed([...feedReady.values(), ...feed]); // Simply copy ready feed, more advanced sorting on date etc. may be implemented.
      setFeedReady(new Map());
        console.log("FeedList setFeed");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(!feed) return <Loader />;
  console.log("FeedList render");

  return (
    <Wrapper>
      {feed.length ? (
          feed.map(item => 
            <Tweet key={item.soul} item={item} />
          )
      ) : (
        <CustomResponse text="Follow some people to get some feed updates" />
      )}
    </Wrapper>
  );
};

export default FeedList;
