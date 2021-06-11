import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import useProfile from '../../hooks/useProfile';
import MenuButton from "../../styles/MenuButton";
import useUser from "../../hooks/useUser";
import useUserAction from "../../hooks/useUserAction";
import { NeutralIcon, TrustIcon } from "../Icons";
import resources from "../../utils/resources";

const TrustUser = ({ user }) => {

  const { user: loggedInUser } = useUser();
  const profile = useProfile(user);
  const { theme } = useContext(ThemeContext);
  const [actionState, setAction] = useUserAction(user, loggedInUser,  resources.node.names.trust);

  if(loggedInUser.id === user.id) 
    return null; // Ignore myself

  const { handle } = profile;

  return (
    <MenuButton onClick={setAction}>
      {actionState ?
        <React.Fragment>
          <NeutralIcon color={theme.accentColor} />
          <p>Untrust - @{handle}</p>
        </React.Fragment>
      : 
        <React.Fragment>
          <TrustIcon color={theme.accentColor} />
          <p>Trust - @{handle}</p>
        </React.Fragment>
      }
    </MenuButton>
  );
};

export default TrustUser;
