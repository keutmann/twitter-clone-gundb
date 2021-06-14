import React, { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import useProfile from '../../hooks/useProfile';
import MenuButton from "../../styles/MenuButton";
import useUser from "../../hooks/useUser";
import useUserAction from "../../hooks/useUserAction";
import { NeutralIcon, TrustIcon } from "../Icons";
import resources from "../../utils/resources";
import NoteModal from "./NoteModal";

const TrustUser = ({ user, popupClose }) => {

  const { user: loggedInUser } = useUser();
  const profile = useProfile(user);
  const { theme } = useContext(ThemeContext);
  const [actionState, setAction] = useUserAction(user, loggedInUser,  resources.node.names.trust);
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
      setAction(obj);
      closeModal();
    }


  if(loggedInUser.id === user.id) 
    return null; // Ignore myself

  const { handle } = profile;

  return (
    <React.Fragment>
      <MenuButton onClick={openModal}>
        {actionState ?
          <React.Fragment>
            <NeutralIcon color={theme.accentColor} />
            <p>Untrust - @{handle}</p>
            <NoteModal open={open} onClose={closeModal} saveModal={saveModal} header={"Untrust user"} saveTitle={"Untrust"} />
          </React.Fragment>
        : 
          <React.Fragment>
            <TrustIcon color={theme.accentColor} />
            <p>Trust - @{handle}</p>
            <NoteModal open={open} onClose={closeModal} saveModal={saveModal} header={"Trust user"} saveTitle={"Trust"} />
          </React.Fragment>
        }
      </MenuButton>
    </React.Fragment>
  );
};

export default TrustUser;
