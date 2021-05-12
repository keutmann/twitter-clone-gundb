import React from "react";
//import { useParams } from "react-router-dom";
//import { useQuery } from 'react-query'
import styled from "styled-components";
import Header from "../Header";
// import { TWEET } from "../../queries/tweet";
import Loader from "../Loader";
import Tweet from "./Tweet";
import Comment from "../Comment/Comment";
import AddComment from "../Comment/AddComment";
import { sortFn } from "../../utils";
import CustomResponse from "../CustomResponse";
//import useUser  from '../../hooks/useUser';

const Wrapper = styled.div`
  margin-bottom: 7rem;
`;

const MasterTweet = () => {
  //const { tweetId } = useParams();

  //const { data, loading } = useQuery(TWEET, { variables: { id: tweetId } });

  const data = null;
  const loading = true;

  const comments =
    data && data.tweet && data.tweet.comments && data.tweet.comments.length
      ? data.tweet.comments
      : [];
  comments.sort(sortFn);

  return (
    <Wrapper>
      <Header>
        <span>Tweet</span>
      </Header>
      {loading ? (
        <Loader />
      ) : (
        <>
          {data && data.tweet && data.tweet.id ? (
            <Tweet tweet={data && data.tweet} />
          ) : (
            <CustomResponse text="Oops, the tweet you are looking for doesn't seem to be exist." />
          )}
          {data && data.tweet && data.tweet.id ? (
            <AddComment id={data.tweet.id} />
          ) : null}
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </>
      )}
    </Wrapper>
  );
};

export default MasterTweet;
