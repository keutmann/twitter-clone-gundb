import React, { useContext } from "react";
import MenuButton from "../../styles/MenuButton";
import { ThemeContext } from "../../context/ThemeContext";
import { TrashIcon } from "../Icons";
import useUser from "../../hooks/useUser";

const DeleteTweetMenuItem = ({ item }) => {

  const { user: loggedInUser } = useUser();
  const { theme } = useContext(ThemeContext);

  const handleClick = () => {

  }

  const user = item.owner;

  if(loggedInUser.id !== user.id) 
    return null; // Ignore myself

  return (
    <MenuButton onClick={handleClick}>
      <TrashIcon color={theme.accentColor} />
      <p>DeleteTweet</p>
    </MenuButton>
  );
};

export default DeleteTweetMenuItem;
