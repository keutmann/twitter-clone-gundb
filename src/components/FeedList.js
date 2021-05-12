import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "./Loader";
import Tweet from "./Tweet/Tweet";
import CustomResponse from "./CustomResponse";
import useUser from "../hooks/useUser";
import Gun from 'gun';
import moment from 'moment'
import resources from '../utils/resources';


const Wrapper = styled.div`
  margin-bottom: 7rem;
`;

const FeedList = () => {

  const { feed, feedIndex, user: userContainer, getUserContainerById, isLoggedIn } = useUser();

  const [ feedUpdated, setFeedUpdated ] = useState(null);

  // Methods ----------------------------------------------------------------------
  const addFeed = React.useCallback((data, date, sourceUser) => {
      const soul = Gun.node.soul(data);
      const id = soul.split('/').pop();
      if(feedIndex[soul]) // Do tweet already exit in feed?
          return false; // No need re-update

      const item = {
          soul: soul,
          id: id,
          tweet: data,
          user: sourceUser,
          createdAt: date
      }

      feed.unshift(item); // Make sure not to add the same object more than once to the list.
      feedIndex[soul] = item; // Use index, so the data only gets added to the feed once.
      setFeedUpdated(id);
      return true;

  }, [feed, feedIndex, setFeedUpdated]); // User here is the viewer

  const addLatestTweet = React.useCallback(async (user) => {
      //let [latestNode, latestDate] = await user.tweetsNode.latest();
      const latest = await user.tweetsNode.get(resources.node.names.latest).once().then();
      if(latest) {
          const date = moment(latest.createdAt);
          addFeed(latest, date, user);
      }
  }, [addFeed]);

  const subscribeTweets = React.useCallback((user) => {
      user.tweetsNode.get(resources.node.names.latest).on((tweet, key) => {
          const date = moment(tweet.createdAt);
          addFeed(tweet, date, user);
      });
  }, [addFeed]);

  
  // Build up users collection, needs refactoring, as it gets called multiple times.
  useEffect(() => {
    if(!isLoggedIn || !userContainer) return;

    (async function() {
        console.log("Subscribing to users feed");
        await addLatestTweet(userContainer);
        subscribeTweets(userContainer);
        
        const followData = await userContainer.followsNode.once().then() || {};

        const addLatestTweets = Object.keys(followData).filter(key => key !== '_' && key !== userContainer.id && followData[key]).map(key => {

            const followUser = getUserContainerById(key);
            
            subscribeTweets(followUser);
            return addLatestTweet(followUser);
        });

        await Promise.all(addLatestTweets);

    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, userContainer]);

  if(!feed && !feedUpdated) return <Loader />;
 
  return (
    <Wrapper>
      {feed.length ? (
          feed.map((item) => <Tweet key={item.soul} item={item} />)
      ) : (
        <CustomResponse text="Follow some people to get some feed updates" />
      )}
    </Wrapper>
  );
};

export default FeedList;
