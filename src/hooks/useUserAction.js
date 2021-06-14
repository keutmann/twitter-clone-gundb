import { useState } from 'react';
import resources from '../utils/resources';

const useUserAction = (targetUser, loggedInUser, actionName) => {

  const [actionState, setActionState] = useState((targetUser.localState.name === actionName));

  const setAction = (data) => {

    let an = resources.node.names.neutral;
    if (actionState) {
      setActionState(false);
    } else {
       an = actionName;
       setActionState(true);
    }
    const actionData = Object.assign({ action: an }, data);

    loggedInUser.setAction(targetUser, actionData);
  };

  return [actionState, setAction];
}

export default useUserAction;