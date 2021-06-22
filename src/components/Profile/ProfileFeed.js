import React, { useEffect, useState} from "react";
import styled from "styled-components";
import Loader from "../Loader";
import Tweet from "../Tweet/Tweet";
import CustomResponse from "../CustomResponse";
import useUser from "../../hooks/useUser";
import { Policy } from "../../utils/Policy";


const Wrapper = styled.div`
  margin-bottom: 7rem;
`;

const ProfileFeed = ({ user }) => {

  const { createContainer, user: loggedInUser } = useUser(); 

  const [feed, setFeed] = useState();
  // Start the effect on page load
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    if(feed) 
      return; // The feed has been loaded, do not reload

    const tweets = user.node.tweets;
    (async () => {
      let data = [];
      // A naive implementation would have close to a billion
      // nodes and would take forever to iterate.
      // This takes only a second:
      for await (let [node] of tweets.iterate({ order: -1 })) {
          let tweet = await node.then();

          if(!tweet) continue;
          const item = createContainer(tweet);
          item.node = node;

          if(Policy.addTweet(item, loggedInUser, null)) // Check with the policy before adding to feed.
            data.push(item);
      }

      setFeed(data);
      // Output:
      // Sat Jan 21 1995 14:02:00 GMT+0000 event: good times
      // Sun Aug 23 2015 23:45:00 GMT+0000 event: ultimate
      // Thu Jan 16 2020 05:45:00 GMT+0000 event: earlybird
    })();


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(!feed) return <Loader />; // Wait for the feed to be loaded

  return (
    <Wrapper>
      {feed.length ? (
          feed.map(item => 
            <Tweet key={item.soul} item={item} />
          )
      ) : (
        <CustomResponse text="There is nothing - white some content" />
      )}
    </Wrapper>
  );
};

export default ProfileFeed;
