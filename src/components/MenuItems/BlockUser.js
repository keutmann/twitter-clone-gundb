import React, { useContext } from "react";
import MenuButton from "../../styles/MenuButton";
import { ThemeContext } from "../../context/ThemeContext";
import { BlockIcon } from "../Icons";
import useProfile from '../../hooks/useProfile';
import useBlock from "../../hooks/useBlock";

const BlockUser = ({ user }) => {

  const profile = useProfile(user);
  const { theme } = useContext(ThemeContext);
  const [isBlocked, setBlock] = useBlock(user);

  const { handle } = profile;

  return (
    <MenuButton onClick={setBlock}>
      <BlockIcon sm color={theme.accentColor} />
      <p>{isBlocked ? "Unblock" : "Block" } - @{handle}</p>
    </MenuButton>
  );
};

export default BlockUser;
