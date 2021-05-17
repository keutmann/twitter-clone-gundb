import React from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import TextareaAutosize from "react-textarea-autosize";
//import {  useMutation } from "@apollo/react-hooks";
import useInput from "../../hooks/useInput";
import Button from "../../styles/Button";
import { displayError } from "../../utils";
import AvatarIdenticon from "../AvatarIdenticon";
//import Avatar from "../../styles/Avatar";
// import { TWEET } from "../../queries/tweet";
// import { ADD_COMMENT } from "../../queries/comment";
//import { USER } from "../../queries/client";
//import Loader from "../Loader";
import Loader from "../Loader";
import useUser from "../../hooks/useUser";

const Wrapper = styled.div`
	display: flex;
	padding: 1rem 1rem;
	border-bottom: 1px solid ${(props) => props.theme.tertiaryColor};

	textarea {
		width: 100%;
		background: inherit;
		border: none;
		font-size: 1.23rem;
		font-family: ${(props) => props.theme.font};
		color: ${(props) => props.theme.primaryColor};
		margin-bottom: 1.4rem;
	}

	.add-comment {
		display: flex;
		flex-direction: column;
	}

	.add-comment-action
		display: flex;
		align-items: center;
	}

	@media screen and (max-width: 530px) {
		textarea {
		  font-size: 0.9rem;
		}
	}
`;

const AddComment = ({ id }) => {

  const { user } = useUser();

  const comment = useInput("");

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!comment.value) return toast("Reply something");

    try {
      // await addCommentMutation({
      //   variables: {
      //     id,
      //     text: comment.value,
      //   },
      // });

      toast.success("Your reply has been added");
    } catch (err) {
      return displayError(err);
    }

    comment.setValue("");
  };


  if (!user) return <Loader />;

  return (
    <Wrapper>
      <AvatarIdenticon id={user.id} profile={user.profile} />

      <form onSubmit={handleAddComment}>
        <div className="add-comment">
          <TextareaAutosize
            cols="48"
            placeholder="Tweet your reply"
            type="text"
            value={comment.value}
            onChange={comment.onChange}
          />

          <div className="add-comment-action">
            <Button sm>
              Reply
            </Button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddComment;
