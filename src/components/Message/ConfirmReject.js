import React, { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";
import styled from "styled-components";
import { CheckCircle, CheckCircleFill, XCircle, XCircleFill } from 'react-bootstrap-icons';
import Flag from "./Flag";
import resources from "../../utils/resources";


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
  const { user:logginInUser } = useUser();

  //const [action, setAction] = useState(item.state.action);
  const [event, setEvent] = useState({ item });

  function setClaim(action) {
    //setAction(action);
    logginInUser.node.claims.get(item.soul).get("action").put(action);
  }


  useEffect(() => {
  
      item.onStateChange.registerCallback(setEvent);
  
      return () => {
        item.onStateChange.unregisterCallback(setEvent);
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const action = event.item.state.action;
  
  return (
    <Wrapper>
      <div>
      <span title="Confirm">
        {action === resources.node.names.confirm ? (
          <CheckCircleFill color="#17BF63" onClick={() => setClaim(resources.node.names.neutral)} />
        ) : (
          <CheckCircle onClick={() => setClaim(resources.node.names.confirm)} />
        )}
        {item.score && item.score.confirm > 0 ? item.score.confirm : null}
      </span>
      </div>
      <div>
      <span title="Reject">
        {action === resources.node.names.reject ? (
          <XCircleFill color="#E0245E" onClick={() => setClaim(resources.node.names.neutral)} />
        ) : (
          <XCircle onClick={() => setClaim(resources.node.names.reject)} />
        )}
        {item.score && item.score.reject > 0 ? item.score.reject : null}
      </span>
      </div>
      <div>
        <Flag id={item.id} item={item} />
      </div>
    </Wrapper>
  );
};

export default ConfirmReject;
