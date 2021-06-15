import React, { useContext, useState } from "react";
import MenuButton from "../../styles/MenuButton";
import { ThemeContext } from "../../context/ThemeContext";
import { Diagram2 } from 'react-bootstrap-icons';
import RelationshipGraphModal from "../Analyse/RalationshipGraphModal";

const AnalyseGraph = ({ user, popupClose }) => {

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


  return (
    <MenuButton onClick={openModal}>
      <Diagram2 color={theme.accentColor} />
      <p>Analyse connections</p>
      <RelationshipGraphModal open={open} onClose={closeModal} saveModal={saveModal} header={"Analyse user"} saveTitle={"Save"} user={user} />
    </MenuButton>
  );
};

export default AnalyseGraph;
