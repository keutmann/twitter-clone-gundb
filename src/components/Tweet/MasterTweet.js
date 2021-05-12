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

const Wrapper = styled.div`
  margin-bottom: 7rem;
`;

const MasterTweet = () => {
  const { handle, tweetId } = useParams();
  const { getUserContainerById } = useUser();



  const [ tweet, setTweet] = useState();
  const [ comments, setComments] = useState();

  useEffect(() => {
    if(tweet) return;

    (async() => {
      const userContainer = getUserContainerById(handle);
      const tweet = await userContainer.tweetsNode.get(tweetId).once().then();

      setTweet(tweet);
      //tweet.soul = Gun.node.soul(tweet);
      //tweet.id = tweet.soul.split('/').pop();

      const commentsData = await tweet.get(resources.node.names.comments).once().then();

      const arr = Object.keys(commentsData).filter(p=> p !== '_').map(p=> p);
      setComments(arr);
    })();

  }, [tweet, handle, tweetId, getUserContainerById, setTweet, setComments]);


  // const comments =
  //   data && data.tweet && data.tweet.comments && data.tweet.comments.length
  //     ? data.tweet.comments
  //     : [];
  // comments.sort(sortFn);

  if(!tweet) return <Loader />

  return (
    <Wrapper>
      <Header>
        <span>Tweet</span>
      </Header>
        <>
          <Tweet tweet={tweet} />
          <AddComment id={tweet.id} />
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
