import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../Header";
import Loader from "../Loader";
import Tweet from "./Tweet";
import Comment from "../Comment/Comment";
import AddComment from "../Comment/AddComment";
import useUser  from '../../hooks/useUser';
import resources from "../../utils/resources";


const Wrapper = styled.div`
  margin-bottom: 7rem;
`;

const MasterTweet = () => {
  const { handle } = useParams();
  const { getUserContainerById, createContainer } = useUser();
  const [ tweetContainer, setTweetContainer] = useState();
  const [ comments, setComments] = useState();

  useEffect(() => {
    if(tweetContainer) return;

    (async() => {
      
      const soul = decodeURIComponent(handle);
      const soulElem = soul.split('/');
      const userId = soulElem.shift();
      soulElem.shift(); // Just shift to next element
      soulElem.shift();
      const userContainer = getUserContainerById(userId);

      const dateString = `${soulElem[0]}-${soulElem[1]}-${soulElem[2]}T${soulElem[3]}:${soulElem[4]}:${soulElem[5]}.${soulElem[6]}Z`

      const tweetNode = userContainer.node.tree.get(dateString);
      const tweet = await tweetNode.then(); 

      const item = createContainer(tweet);
      
      setTweetContainer(item);

      //const commentsData = await tweetNode.get(resources.node.names.comments).once(p=>p, {wait:0}).then();
      const commentsData = await tweetNode.get(resources.node.names.comments).then();

      const arr = Object.keys(commentsData).filter(p=> p !== '_').map(p=> p);
      setComments(arr);
    })();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle, createContainer]);


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
