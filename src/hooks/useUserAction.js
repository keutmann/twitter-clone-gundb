import { useState } from 'react';
import resources from '../utils/resources';
//import useUserChanged from './useUserChanged';

const useUserAction = (targetUser, loggedInUser, actionName) => {

  //const [changed,] = useUserChanged(targetUser); // This one gives memory leak problems when used in a popup menu.

  const [actionState, setActionState] = useState((targetUser.localState.name === actionName));

  // useEffect(() => {
  //   setActionState(targetUser.localState.name === actionName);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [changed]);

  const setAction = () => {
    if (actionState) {
      setActionState(false);
      // Unfollow
      loggedInUser.setAction(targetUser, { name: resources.node.names.neutral });
    } else {
      setActionState(true);
      loggedInUser.setAction(targetUser, { action: actionName, note: "Cool user, best friend." });
    }
  };

  return [actionState, setAction];
}

export default useUserAction;