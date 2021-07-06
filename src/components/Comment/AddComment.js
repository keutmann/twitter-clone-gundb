import React from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import TextareaAutosize from "react-textarea-autosize";

import useInput from "../../hooks/useInput";
import Button from "../../styles/Button";
import { displayError } from "../../utils";
import AvatarIdenticon from "../AvatarIdenticon";

import Loader from "../Loader";
import useUser from "../../hooks/useUser";
import resources from '../../utils/resources';


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

const AddComment = ({ tweetNode }) => {

  const { user } = useUser();

  const comment = useInput("");

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!comment.value) return toast("Reply something");

    try {


      const date = new Date();
      //const tweetId = moment().toISOString();
      const commentId = date.toISOString();
  
      const data = {
        text: comment.value,
        createdAt: commentId
      }
      
      const commentNode = user.node.comments.get(commentId);
      const commentData = await commentNode.put(data).then(); // Add Comment to DateTree and wait for the Gun data object.
      commentNode.get(resources.node.names.tweet).put(tweetNode); // Add a reference to the Tweet object

      tweetNode.get(resources.node.names.comments).get(commentId+user.id).put(commentData);
      // const tweetCommentsTree = new DateTree(tweetNode.get(resources.node.names.comments), 'millisecond');
      // tweetCommentsTree.get(date).get(user.id).put(commentData);

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
