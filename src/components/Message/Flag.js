import React, { useEffect, useState } from "react";
import { FlagFill } from 'react-bootstrap-icons';
import resources from "../../utils/resources";
import ClaimGraphModal from "../Analyse/ClaimGraphModal";

const Flag = ({ item }) => {

  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState({ item });

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  useEffect(() => {
    item.onStateChange.registerCallback(setEvent);

    return () => {
      item.onStateChange.unregisterCallback(setEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if (event.item?.state?.action === resources.node.names.neutral)
    return null; // Do not show flag for a neutral score

  const color = event.item?.state?.color || "";

  return (
    <React.Fragment>
      <FlagFill color={color} onClick={openModal}></FlagFill>
      <ClaimGraphModal open={open} onClose={closeModal} saveModal={closeModal} header={"Item Graph"} saveTitle={"Save"} item={item} />
    </React.Fragment>
  );
}

export default Flag;
