import React, { useState } from "react";
import styled from "styled-components";
import { CheckCircle, CheckCircleFill, XCircle, XCircleFill } from 'react-bootstrap-icons';
import useUser from "../../hooks/useUser";


const Wrapper = styled.div`
    display: flex;
    align-items: center;

    div {
      margin-right: 4rem;
      color: ${(props) => props.theme.secondaryColor};
    }

    svg {
      margin-right: 0.5rem;
    }

    span {
      display: flex;
      align-items: center;
    }
`;


const ConfirmReject = ({ id, item }) => {
  const { user } = useUser();

  const [confirmed, setConfirmed] = useState(item.confirmed || false);
  const [confirmedCountState, setConfirmedCount] = useState(item.confirmCount);
  const [rejected, setRejected] = useState(item.rejected || false);
  const [rejectedCountState, setRejectedCount] = useState(item.rejectCount);

  const handleToggleConfirmed = () => {
    setConfirmed(!confirmed);
    if (confirmed) {
      setConfirmedCount(confirmedCountState - 1);
    } else {
      setConfirmedCount(confirmedCountState + 1);
      user.node.confirm.get(item.soul).put({ value: 1});
    }



    if(rejected) 
      handleToggleRejected();
    // TODO: Add to Gun
  };

  const handleToggleRejected = () => {
    setRejected(!rejected);
    if (rejected) {
      setRejectedCount(rejectedCountState - 1);
    } else {
      setRejectedCount(rejectedCountState + 1);
      user.node.confirm.get(item.soul).put({ value: -1});
    }

    if(confirmed)
      handleToggleConfirmed();
    // TODO: Add to Gun
  };

  // useEffect(() => {

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [item])

  return (
    <Wrapper>
      <div>
      <span title="Confirm">
        {confirmed ? (
          <CheckCircleFill color="#17BF63" onClick={handleToggleConfirmed} />
        ) : (
          <CheckCircle onClick={handleToggleConfirmed} />
        )}
        {confirmedCountState ? confirmedCountState : null}
      </span>
      </div>
      <div>
      <span title="Reject">
        {rejected ? (
          <XCircleFill color="#E0245E" onClick={handleToggleRejected} />
        ) : (
          <XCircle onClick={handleToggleRejected} />
        )}
        {rejectedCountState ? rejectedCountState : null}
      </span>
      </div>
    </Wrapper>
  );
};

export default ConfirmReject;
