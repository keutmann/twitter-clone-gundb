import React, { useEffect, useState} from "react";
import styled from "styled-components";
import Loader from "./Loader";
import Tweet from "./Tweet/Tweet";
import CustomResponse from "./CustomResponse";
import useUser from "../hooks/useUser";


const Wrapper = styled.div`
  margin-bottom: 7rem;
`;

const FeedList = () => {

  const { feedManager } = useUser(); 

  const [feed, setFeed] = useState();

  // Events
  // Page load, effect run
  // Message comes in
  // result : empty list
  // Want: Waiting loader.... for 5 secords.

  // Solution timeout!
  // Run effect - result empty, then rerun 5 times 1 sec interval.

  // Start the effect on page load
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const callback = (data) => (data.length > 0) ? setFeed(data): true;
    feedManager.onFeedUdated.registerCallback(callback);

    if(feedManager.feed.length > 0) { // we have data
      feedManager.update(); // Ensure to get the latest tweets 
    } else {
      // We have an null feed and no messages, wait 5 seconds for messages.
      let count = 5;
      let timerId = setInterval(() => {
        console.log("LoadFeed interval " + count);
        
        if(feedManager.stagingNewCount > 0) {
          feedManager.update();
          clearInterval(timerId);
          return;
        }

        count--;
        if(count === 0) { // Feed is null, and no messages found, make empty feed.
          setFeed([]);
          clearInterval(timerId);
          return;
        }

      }, 1000);
    }
    return () => {
      feedManager.onFeedUdated.unregisterCallback(callback);
    };


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(!feed) return <Loader />;

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
