import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import useProfile from '../../hooks/useProfile';
import MenuButton from "../../styles/MenuButton";
import { PersonPlus, PersonDash } from 'react-bootstrap-icons';
import useUser from "../../hooks/useUser";
import useUserAction from "../../hooks/useUserAction";
import resources from "../../utils/resources";

const FollowUser = ({ user }) => {

  const { user: loggedInUser } = useUser();
  const profile = useProfile(user);
  const { theme } = useContext(ThemeContext);
  const [actionState, setAction] = useUserAction(user, loggedInUser, resources.node.names.follow);

  if(loggedInUser.id === user.id) 
    return null; // Ignore myself

  const { handle } = profile;

  return (
    <MenuButton onClick={setAction}>
      {actionState ?
        <React.Fragment>
          <PersonDash color={theme.accentColor} />
          <p>Unfollow - @{handle}</p>
        </React.Fragment>
      : 
        <React.Fragment>
          <PersonPlus color={theme.accentColor} />
          <p>Follow - @{handle}</p>
        </React.Fragment>
      }
    </MenuButton>
  );
};

export default FollowUser;
