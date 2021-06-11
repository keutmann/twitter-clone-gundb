import React, { useContext } from "react";
import MenuButton from "../../styles/MenuButton";
import { ThemeContext } from "../../context/ThemeContext";
import { BlockIcon } from "../Icons";
import useProfile from '../../hooks/useProfile';
import useUser from "../../hooks/useUser";
import useUserAction from "../../hooks/useUserAction";
import resources from "../../utils/resources";

const BlockUser = ({ user }) => {
  const { user: loggedInUser } = useUser();
  const profile = useProfile(user);
  const { theme } = useContext(ThemeContext);
  const [actionState, setAction] = useUserAction(user, loggedInUser, resources.node.names.block);

  if(loggedInUser.id === user.id) 
    return null; // Ignore myself

  const { handle } = profile;

  return (
    <MenuButton onClick={setAction}>
      <BlockIcon color={theme.accentColor} />
      <p>{actionState ? "Unblock" : "Block" } - @{handle}</p>
    </MenuButton>
  );
};

export default BlockUser;
