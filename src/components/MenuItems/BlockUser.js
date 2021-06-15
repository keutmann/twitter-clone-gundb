import React, { useContext, useState } from "react";
import MenuButton from "../../styles/MenuButton";
import { ThemeContext } from "../../context/ThemeContext";
import { BlockIcon } from "../Icons";
import useProfile from '../../hooks/useProfile';
import useUser from "../../hooks/useUser";
import useUserAction from "../../hooks/useUserAction";
import resources from "../../utils/resources";
import NoteModal from "./NoteModal";


const BlockUser = ({ user, popupClose }) => {
  const { user: loggedInUser } = useUser();
  const profile = useProfile(user);
  const { theme } = useContext(ThemeContext);
  const [actionState, setAction] = useUserAction(user, loggedInUser, resources.node.names.block);
  const [open, setOpen] = useState(false);

  if(loggedInUser.id === user.id) 
    return null; // Ignore myself

  const openModal = () => {
      setOpen(true);
    }
    const closeModal = () => {
      setOpen(false);
      popupClose();
    }
    const saveModal = (obj) => { 
        setAction(obj);
        closeModal();
      }
  

  const { handle } = profile;
  const text = actionState ? "Unblock" : "Block";

  return (
    <MenuButton onClick={openModal}>
      <BlockIcon color={theme.accentColor} />
      <p>{text} - @{handle}</p>
      <NoteModal open={open} onClose={closeModal} saveModal={saveModal} header={text+" user"} saveTitle={text} />
    </MenuButton>
  );
};

export default BlockUser;
