import React from "react";
import Button from "../../styles/Button";
import useFollow from "../../hooks/useFollow";


const Follow = ({ user, sm = false, relative = false }) => {

  const [followState, setFollowState] = useFollow(user);

  const isFollowing =  followState === "trust" || followState === "follow";

  return (
    <Button outline={!isFollowing} sm={sm} relative={relative} onClick={setFollowState}>
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
};

export default Follow;
