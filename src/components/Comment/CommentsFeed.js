import React, { useEffect, useState} from "react";
import styled from "styled-components";
import Loader from "../Loader";
import Comment from "./Comment";
import CustomResponse from "../CustomResponse";
import useUser from "../../hooks/useUser";
import { CommentContainer } from "../../utils/CommentContainer";


const Wrapper = styled.div`
  margin-bottom: 7rem;
`;

const CommentsFeed = ({ user }) => {
  const { getUserContainerById } = useUser(); 
  const [feed, setFeed] = useState();

  // Start the effect on page load
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    if(feed) 
      return; // The feed has been loaded, do not reload
    let list = [];

    const comments = user.node.comments;
    comments.map().on((data,k) => {
      const item = new CommentContainer(data, getUserContainerById);
      list.push(item);
    });

    // setTimeout(()=> {
  
    // }, 1000)
    // (async () => {
    //   let list = [];
    //   for await (let [ref] of comments.iterate({ order: -1 })) {
    //       let data = await ref.then();
    //       if(!data) continue;
    //       const item = new CommentContainer(data, getUserContainerById);
    //       list.push(item);
    //   }
    setTimeout(setFeed(list), 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(!feed) return <Loader />; // Wait for the feed to be loaded

  return (
    <Wrapper>
      {feed.length ? (
          feed.map(item => 
            <Comment key={item.id} item={item} />
          )
      ) : (
        <CustomResponse text="There is nothing - white some content" />
      )}
    </Wrapper>
  );
};

export default CommentsFeed;
