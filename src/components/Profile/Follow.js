import React from "react";
import Button from "../../styles/Button";
import useFollow from "../../hooks/useFollow";

const Follow = ({ user, sm = false, relative = false }) => {

  const [followState, setFollow] = useFollow(user);

  return (
    <Button outline={!followState} sm={sm} relative={relative} onClick={setFollow}>
      {followState ? "Following" : "Follow"}
    </Button>
  );
};

export default Follow;
