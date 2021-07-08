import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../Header";
import Loader from "../Loader";
import Tweet from "./Tweet";
import Comment from "../Comment/Comment";
import AddComment from "../Comment/AddComment";
import useUser  from '../../hooks/useUser';
//import resources from "../../utils/resources";
import { TweetContainer } from "../../utils/TweetContainer";
//import { CommentContainer } from "../../utils/CommentContainer";


const Wrapper = styled.div`
  margin-bottom: 7rem;
`;

const MasterTweet = () => {
  const { handle } = useParams();
  const { usersManager } = useUser();
  const [ tweet, setTweet] = useState();
  const [ comments, setComments] = useState();
  const [ tweetNode, setTweetNode] = useState();

  useEffect(() => {
    if(tweet) return;

    (async() => {
      
      const soul = decodeURIComponent(handle);
      const soulElem = soul.split('/');
      const userId = soulElem.shift();
      const userContainer = usersManager.getUserContainerById(userId);
      
      soulElem.shift(); // Shift dpeep
      soulElem.shift(); // Shift tweets
      
      //const dateString = `${soulElem[0]}-${soulElem[1]}-${soulElem[2]}T${soulElem[3]}:${soulElem[4]}:${soulElem[5]}.${soulElem[6]}Z`
      const dateString = soulElem.shift();

      const node = userContainer.node.tweets.get(dateString);
      setTweetNode(node);
      
      const data = await node.then(); 

      const tweet = new TweetContainer(data, soul);
      tweet.setOwner(userContainer);
      
      setTweet(tweet);

      // The comments of the Tweet node, is from the public Gun space without user write restrictions.
      // const commentsTree = new DateTree(node.get(resources.node.names.comments), 'millisecond');

      let list = [];
      // for await (let [ref] of commentsTree.iterate({ order: 1 })) {
      //     let data = await ref.then();
      //     if(!data) continue;

      //     const keys = Object.keys(data).filter( p=> p !== '_')
      //     for(let key of keys) {
      //       const item = await ref.get(key).then();
      //       //const item = data[key];
      //       const container = new CommentContainer(item);
      //       container.setOwner(usersManager.getUserContainerById(container.userId));
      //       list.push(container);
      //     };
      // }

      setComments(list);
    })();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle]);

  if(!tweet) return <Loader />

  return (
    <Wrapper>
      <Header>
        <span>Tweet</span>
      </Header>
        <>
          <Tweet key={tweet.soul} item={tweet} />
          <AddComment tweetNode={tweetNode} />
          {
            (comments) ?
            comments.map((item) => (<Comment key={item.id} item={item} />)) 
            : 
            <p>No comments or in process of loading.</p>
          }
        </>
    </Wrapper>
  );
};

export default MasterTweet;
