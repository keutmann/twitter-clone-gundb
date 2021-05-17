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

  const { feed, feedReady, setFeed, resetFeedReady, messageReceived } = useUser();
  //const [ items, setItems ] = useState();

// eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const items = Object.values(feedReady);
    if(!feed) {
      setFeed([...items]); // Simply copy ready feed, more advanced sorting on date etc. may be implemented.
      resetFeedReady();
      console.log("FeedList Initialized");
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[messageReceived]);


  // // eslint-disable-next-line react-hooks/rules-of-hooks
  // useEffect(() => {
  //   const items = Object.values(feedReady);
  //   if(feed && items.length > 0) {
  //     setFeed([...items, ...feed]); // Simply copy ready feed, more advanced sorting on date etc. may be implemented.
  //     resetFeedReady();
  //     console.log("FeedList setFeed");
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

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
