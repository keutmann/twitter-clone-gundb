import { useState } from 'react';
//import useUser from "./useUser";

const useBlock = (user) => {

//  const { user: loggedInUser, getUserContainerById } = useUser();

  const [blockState, setBlockState] = useState((user.isBlocked));

  const setBlock = () => {
    if (blockState) {
      setBlockState(false);
      // Unfollow
      //loggedInUser.node.follow.get(userId).put(null);
    } else {
      setBlockState(true);
      //const blockUser = getUserContainerById(userId);
      //loggedInUser.node.follow.get(userId).put(blockUser.node.user);
    }
  };

  return [blockState, setBlock];
}

export default useBlock;