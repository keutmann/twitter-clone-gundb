import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import useProfile from '../../hooks/useProfile';
import useFollow from "../../hooks/useFollow";
import MenuButton from "../../styles/MenuButton";
import { PersonPlus, PersonDash } from 'react-bootstrap-icons';

const FollowUser = ({ user }) => {

  const profile = useProfile(user);
  const { theme } = useContext(ThemeContext);
  const [followState, setFollow] = useFollow(user);

  const { handle } = profile;

  return (
    <MenuButton onClick={setFollow}>
      {followState ?
        <React.Fragment>
          <PersonDash sm color={theme.accentColor} />
          <p>Unfollow - @{handle}</p>
        </React.Fragment>
      : 
        <React.Fragment>
          <PersonPlus sm color={theme.accentColor} />
          <p>Follow - @{handle}</p>
        </React.Fragment>
      }
    </MenuButton>
  );
};

export default FollowUser;
