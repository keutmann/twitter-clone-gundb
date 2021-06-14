import React, { useContext, useRef } from "react";
import Popup from 'reactjs-popup';
import styled from "styled-components";
import { ThemeContext } from "styled-components";
import Form from "../../styles/Form";
import TextareaAutosize from "react-textarea-autosize";
import Button from "../../styles/Button";
import useInput from "../../hooks/useInput";

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

        div.note-wrapper {
            background: ${props => props.theme.tertiaryColor2};
            margin-bottom: 1.4rem;
            border-bottom: 1px solid ${props => props.theme.accentColor};
            padding: 0.5rem;

            label {
                color: ${props => props.theme.secondaryColor2};
                margin-bottom: 0.4rem;
            }

            textarea {
                font-size: 1rem;
                width: 100%;
                background: ${props => props.theme.tertiaryColor2};
                border: none;
                font-family: ${props => props.theme.font};
                color: ${props => props.theme.primaryColor};
            }
        }
  }
`;

//const Wrapper = styled.div`

// .modal {
//     font-size: 12px;
//   }
//   .modal > .header {
//     width: 100%;
//     border-bottom: 1px solid gray;
//     font-size: 18px;
//     text-align: center;
//     padding: 5px;
//   }
//   .modal > .content {
//     width: 100%;
//     padding: 10px 5px;
//   }

//`;

const NoteModal = (props) => {

    const theme = useContext(ThemeContext);

    const ref = useRef();

    const note = useInput("");

    const handleSubmit = () => {
        if (props.saveModal)
            props.saveModal({ note: note.value });
    }

    const contentStyle = {
        width: "460px",
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
                <Form lg onSubmit={handleSubmit}>
                    <div className="modal">
                        <button className="close" onClick={close}>&times;</button>
                        <div className="header">{props.header}</div>
                        <div className="content">
                            <div className="note-wrapper">
                                <label className="note" htmlFor="note">Note</label>
                                <TextareaAutosize
                                    id="note"
                                    ref={ref}
                                    placeholder="Write your reason here..."
                                    value={note.value}
                                    onChange={note.onChange}
                                    
                                />
                            </div>
                        </div>
                        <div className="actions">
                            <Button outline type="submit">{props.saveTitle}</Button>
                        </div>
                    </div>
                </Form>
            )}
        </StyledPopup>);
}

export default NoteModal;