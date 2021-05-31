import React, { useState } from "react";
import { XCircle, XCircleFill } from 'react-bootstrap-icons';

const Reject = ({ id, isRejected, rejectCount }) => {
  const [rejected, setRejected] = useState(isRejected);
  const [rejectedCountState, setRejectedCount] = useState(rejectCount);

  const handleToggleLike = () => {
    setRejected(!rejected);
    if (rejected) {
      setRejectedCount(rejectedCountState - 1);
    } else {
      setRejectedCount(rejectedCountState + 1);
    }
    // TODO: Add to Gun
  };

  return (
    <span>
      {rejected ? (
        <XCircleFill color="#E0245E" onClick={handleToggleLike} />
      ) : (
        <XCircle onClick={handleToggleLike} />
      )}
      {rejectedCountState ? rejectedCountState : null}
    </span>
  );
};

export default Reject;
