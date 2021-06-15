import React, { useContext } from "react";
import Popup from 'reactjs-popup';
import styled from "styled-components";
import { ThemeContext } from "styled-components";
import RelationshipGraph from "./RelationshipGraph";

const StyledPopup = styled(Popup)`
  // use your custom style for ".popup-overlay"
//   &-overlay {
//     ...;
//   }
  // use your custom style for ".popup-content"
   &-content {
        .modal > .close {
            cursor: pointer;
            position: absolute;
            display: block;
            padding: 2px 5px;
            line-height: 20px;
            right: -10px;
            top: -10px;
            font-size: 24px;
            background: #ffffff;
            border-radius: 18px;
            border: 1px solid #cfcece;
            }

        .modal > .actions {
            width: 100%;
            padding: 10px 5px;
            margin: auto;
            text-align: center;
        }          
  }
`;

const RelationshipGraphModal = (props) => {

    const theme = useContext(ThemeContext);

    // const ref = useRef();


    // const handleSubmit = () => {
    //     if (props.saveModal)
    //         props.saveModal({ note: note.value });
    // }

    const contentStyle = {
        width: "660px",
        background: theme.background,
        borderRadius: "6px",
        border: `1px solid ${theme.tertiaryColor}`,
        boxShadow: theme.bs1,
    };

    const overlayStyle = {
        background: "none",
    };


    return (

        <StyledPopup

            open={props.open}
            onClose={props.onClose}
            nested
            modal
            position="top center"
            contentStyle={contentStyle}
            overlayStyle={overlayStyle}

        >
            {close => (
                <div className="modal">
                    <button className="close" onClick={close}>&times;</button>
                    <div className="header">{props.header}</div>
                    <div className="content">
                        <RelationshipGraph user={props.user} />
                    </div>
                </div>
            )}
        </StyledPopup>);
}

export default RelationshipGraphModal;