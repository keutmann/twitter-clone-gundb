import React, { useState } from "react";
import { CheckCircle, CheckCircleFill } from 'react-bootstrap-icons';

const Confirm = ({ id, isConfirmed, confirmCount }) => {
  const [confirmed, setLiked] = useState(isConfirmed);
  const [confirmedCountState, setLikesCount] = useState(confirmCount);

  const handleToggleLike = () => {
    setLiked(!confirmed);
    if (confirmed) {
      setLikesCount(confirmedCountState - 1);
    } else {
      setLikesCount(confirmedCountState + 1);
    }
    // TODO: Add to Gun
  };

  return (
    <span>
      {confirmed ? (
        <CheckCircleFill color="#E0245E" onClick={handleToggleLike} />
      ) : (
        <CheckCircle onClick={handleToggleLike} />
      )}
      {confirmedCountState ? confirmedCountState : null}
    </span>
  );
};

export default Confirm;
