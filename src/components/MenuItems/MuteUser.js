import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import useProfile from '../../hooks/useProfile';
import useMute from "../../hooks/useMute";
import MenuButton from "../../styles/MenuButton";
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import useUser from "../../hooks/useUser";


const MuteUser = ({ user }) => {

  const { user: loggedInUser } = useUser();
  const profile = useProfile(user);
  const { theme } = useContext(ThemeContext);
  const [isMuteed, setMute] = useMute(user);

  if(loggedInUser.id === user.id) 
    return null; // Ignore myself

  const { handle } = profile;

  return (
    <MenuButton onClick={setMute}>
      {isMuteed ?
        <React.Fragment>
          <Eye sm color={theme.accentColor} />
          <p>Unmute - @{handle}</p>
        </React.Fragment>
      : 
        <React.Fragment>
          <EyeSlash sm color={theme.accentColor} />
          <p>Mute - @{handle}</p>
        </React.Fragment>
      }
    </MenuButton>
  );
};

export default MuteUser;
