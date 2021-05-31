import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//import { useQuery } from 'react-query'
import styled from "styled-components";
import Header from "../Header";
// import { TWEET } from "../../queries/tweet";
import Loader from "../Loader";
import Tweet from "./Tweet";
import Comment from "../Comment/Comment";
import AddComment from "../Comment/AddComment";
//import { sortFn } from "../../utils";
//import CustomResponse from "../CustomResponse";
import useUser  from '../../hooks/useUser';
//import Gun from 'gun';
import resources from "../../utils/resources";
//import { createContainer } from '../../utils';

const Wrapper = styled.div`
  margin-bottom: 7rem;
`;

const MasterTweet = () => {
  const { handle, tweetId } = useParams();
  const { getUserContainerById, createContainer } = useUser();



  const [ tweetContainer, setTweetContainer] = useState();
  const [ comments, setComments] = useState();

  useEffect(() => {
    if(tweetContainer) return;

    (async() => {
      const userContainer = getUserContainerById(handle);
      const tweetNode = userContainer.node.tweets.get(tweetId);

      const tweet = await tweetNode.once(p=>p, {wait:0}).then();
      const item = createContainer(tweet);
      
      setTweetContainer(item);

      const commentsData = await tweetNode.get(resources.node.names.comments).once(p=>p, {wait:0}).then();

      const arr = Object.keys(commentsData).filter(p=> p !== '_').map(p=> p);
      setComments(arr);
    })();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle, tweetId, createContainer]);


  // const comments =
  //   data && data.tweet && data.tweet.comments && data.tweet.comments.length
  //     ? data.tweet.comments
  //     : [];
  // comments.sort(sortFn);

  if(!tweetContainer) return <Loader />

  console.log("MasterTweet Render");

  return (
    <Wrapper>
      <Header>
        <span>Tweet</span>
      </Header>
        <>
          <Tweet key={tweetContainer.soul} item={tweetContainer} />
          <AddComment id={tweetContainer.id} />
          {
            (comments) ?
            comments.map((comment) => (<Comment key={comment} comment={comment} />)) 
            : 
            <Loader />
          }
        </>
    </Wrapper>
  );
};

export default MasterTweet;
