import React, { useState } from "react";
import Button from "../../styles/Button";
import { displayError } from "../../utils";
import useUser from "../../hooks/useUser";

const Follow = ({ isFollowing, id, sm = false, relative = false }) => {

  const { user: loggedInUser, getUserContainerById } = useUser();

  const [followState, setFollowState] = useState(isFollowing);


  const handleFollow = async () => {
    if (followState) {
      setFollowState(false);
      try {
        // Unfollow
        loggedInUser.node.follow.get(id).put(null);
      } catch (err) {
        displayError(err);
      }
    } else {
      setFollowState(true);
      try {
        const followuser = getUserContainerById(id);
        loggedInUser.node.follow.get(id).put(followuser.node.user);
      } catch (err) {
        displayError(err);
      }
    }
  };

  return (
    <Button outline={!followState} sm={sm} relative={relative} onClick={handleFollow}>
      {followState ? "Following" : "Follow"}
    </Button>
  );
};

export default Follow;
