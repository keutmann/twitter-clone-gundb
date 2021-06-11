import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import useProfile from '../../hooks/useProfile';
import MenuButton from "../../styles/MenuButton";
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import useUser from "../../hooks/useUser";
import useUserAction from "../../hooks/useUserAction";
import resources from "../../utils/resources";


const MuteUser = ({ user }) => {

  const { user: loggedInUser } = useUser();
  const profile = useProfile(user);
  const { theme } = useContext(ThemeContext);
  const [actionState, setAction] = useUserAction(user, loggedInUser, resources.node.names.mute);


  if(loggedInUser.id === user.id) 
    return null; // Ignore myself

  const { handle } = profile;

  return (
    <MenuButton onClick={setAction}>
      {actionState ?
        <React.Fragment>
          <Eye color={theme.accentColor} />
          <p>Unmute - @{handle}</p>
        </React.Fragment>
      : 
        <React.Fragment>
          <EyeSlash color={theme.accentColor} />
          <p>Mute - @{handle}</p>
        </React.Fragment>
      }
    </MenuButton>
  );
};

export default MuteUser;
