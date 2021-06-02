import { useState } from 'react';
//import useUser from "./useUser";

const useMute = (user) => {

//  const { user: loggedInUser, getUserContainerById } = useUser();

  const [muteState, setMuteState] = useState((user.isMuteed));

  const setMute = () => {
    if (muteState) {
      setMuteState(false);
      // Unfollow
      //loggedInUser.node.follow.get(userId).put(null);
    } else {
      setMuteState(true);
      //const blockUser = getUserContainerById(userId);
      //loggedInUser.node.follow.get(userId).put(blockUser.node.user);
    }
  };

  return [muteState, setMute];
}

export default useMute;