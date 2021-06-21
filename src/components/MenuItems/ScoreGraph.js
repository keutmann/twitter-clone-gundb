import React, { useContext, useState } from "react";
import MenuButton from "../../styles/MenuButton";
import { ThemeContext } from "../../context/ThemeContext";
import { Diagram2 } from 'react-bootstrap-icons';
import useUser from "../../hooks/useUser";
import ScoreGraphModal from "../Analyse/ScoreGraphModal";

const ScoreGraph = ({ user, popupClose }) => {

  const { user: loggedInUser } = useUser();
  const { theme } = useContext(ThemeContext);

  const [open, setOpen] = useState(false);
  const openModal = () => {
    setOpen(true);
  }
  const closeModal = () => {
    setOpen(false);
    popupClose();
  }
  const saveModal = (obj) => { 
      console.log(obj); 
      closeModal();
    }

  if(loggedInUser.id === user.id) 
    return null; // Ignore myself

  return (
    <MenuButton onClick={openModal}>
      <Diagram2 color={theme.accentColor} />
      <p>Score Graph</p>
      <ScoreGraphModal open={open} onClose={closeModal} saveModal={saveModal} 
      header={"Score Graph"} saveTitle={"Save"} user={user} />
    </MenuButton>
  );
};

export default ScoreGraph;
