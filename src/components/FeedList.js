import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "./Loader";
import Tweet from "./Tweet/Tweet";
import CustomResponse from "./CustomResponse";
import useUser from "../hooks/useUser";


const Wrapper = styled.div`
  margin-bottom: 7rem;
`;

const FeedList = () => {

  const { feed, feedUpdated } = useUser();

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
