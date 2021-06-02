import React, { useContext } from "react";
import MenuButton from "../../styles/MenuButton";
import { ThemeContext } from "../../context/ThemeContext";
import { BlockIcon } from "../Icons";
import useProfile from '../../hooks/useProfile';
import useBlock from "../../hooks/useBlock";
import useUser from "../../hooks/useUser";

const BlockUser = ({ user }) => {
  const { user: loggedInUser } = useUser();
  const profile = useProfile(user);
  const { theme } = useContext(ThemeContext);
  const [isBlocked, setBlock] = useBlock(user);

  if(loggedInUser.id === user.id) 
    return null; // Ignore myself

  const { handle } = profile;

  return (
    <MenuButton onClick={setBlock}>
      <BlockIcon sm color={theme.accentColor} />
      <p>{isBlocked ? "Unblock" : "Block" } - @{handle}</p>
    </MenuButton>
  );
};

export default BlockUser;
