import React, { useEffect, useState} from "react";
import styled from "styled-components";
import Loader from "../Loader";
import Tweet from "../Tweet/Tweet";
import CustomResponse from "../CustomResponse";
import useUser from "../../hooks/useUser";
import { Policy } from "../../utils/Policy";
import { TweetContainer } from "../../utils/TweetContainer";


const Wrapper = styled.div`
  margin-bottom: 7rem;
`;

const ProfileFeed = ({ user }) => {

  const { getUserContainerById, user: loggedInUser } = useUser(); 

  const [feed, setFeed] = useState(undefined);
  // Start the effect on page load
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    setFeed(undefined); // Reset feed, in case of old data.

    const tweets = user.node.tweets;
    (async () => {
      let data = [];
      // A naive implementation would have close to a billion
      // nodes and would take forever to iterate.
      // This takes only a second to iterate the first items:
      
      // TODO: Limit the number items loaded. This may be move to a load initialy and then more items. 
      for await (let [node] of tweets.iterate({ order: -1 })) {
          let tweet = await node.then();

          if(!tweet) continue;
          const item = new TweetContainer(tweet, getUserContainerById);
          item.node = node;

          if(Policy.addTweet(item, loggedInUser, null)) // Check with the policy before adding to feed.
            data.push(item);
      }

      setFeed(data);
    })();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

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
