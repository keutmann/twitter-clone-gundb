import { useState } from 'react';
import useUser from "./useUser";

const useFollow = (user) => {

  const { user: loggedInUser, getUserContainerById } = useUser();

  const [followState, setFollowState] = useState((user.isFollowing));

  const setFollow = () => {
    if (followState) {
      setFollowState(false);
      // Unfollow
      loggedInUser.node.follow.get(user.id).put(null);
    } else {
      setFollowState(true);
      const followuser = getUserContainerById(user.id); // Make sure that the user has been loaded properly
      loggedInUser.node.follow.get(user.id).put(followuser.node.user);
    }
  };

  return [followState, setFollow];
}

export default useFollow;