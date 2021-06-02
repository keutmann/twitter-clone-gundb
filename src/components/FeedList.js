import React, { useEffect} from "react";
import styled from "styled-components";
import Loader from "./Loader";
import Tweet from "./Tweet/Tweet";
import CustomResponse from "./CustomResponse";
import useUser from "../hooks/useUser";


const Wrapper = styled.div`
  margin-bottom: 7rem;
`;

const FeedList = () => {

  const { feed, feedReady, setFeed, resetFeedReady } = useUser(); 

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

    const loadFeed = () => {
      let temp = feed || [];

      const items = Object.values(feedReady);
      if(items.length > 0) {
        setFeed([...items, ...temp]); // Simply copy ready feed, more advanced sorting on date etc. may be implemented.
        resetFeedReady();
        console.log("FeedList setFeed");
        return true;
      }

      if(feed)  // No new messages but we have a feed already
        return true;

      return false;
    }

    if(loadFeed()) // Check now for messages
      return;

    // We have an null feed and no messages, wait 5 seconds for messages.
    let count = 5;
    let timerId = setInterval(() => {
      console.log("LoadFeed interval " + count);
      
      if(loadFeed()) { // Load new messages
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
