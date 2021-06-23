import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import moment from "moment";
import AvatarIdenticon from "../AvatarIdenticon";
import DeleteComment from "./DeleteComment";
//import useUser  from '../../hooks/useUser';
import Confirm from "../Message/Confirm";
import useProfile from '../../hooks/useProfile';

const Wrapper = styled.div`
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.tertiaryColor};
  padding: 1.5rem 1rem 1rem 1rem;

  .comment-info-user {
    display: flex;

    svg {
      margin-left: 0.6rem;
      position: relative;
      top: 3px;
    }
  }

  .comment-info-user span.username {
    font-weight: 500;
  }

  .comment-info-user span.secondary {
    padding-left: 0.5rem;
    color: ${(props) => props.theme.secondaryColor};
  }

  @media screen and (max-width: 430px) {
    flex-direction: column;

    .comment-info-user {
      font-size: 0.83rem;
    }

    .avatar {
      display: none;
    }

    .username {
      display: none;
    }

    .comment-info-user span.secondary {
      padding-left: 0;

      :first-child {
        padding-right: 0.6rem;
      }
    }
  }
`;

const Comment = ({ item }) => {

  const profile = useProfile(item.owner);

  const { handle, displayname } = profile;

  const { id, data, isCommentMine, owner } = item;

  return (
    <Wrapper>
      <Link to={`/${owner.id}`}>
        <AvatarIdenticon id={owner.id} profile={profile} />
      </Link>
      <div className="comment-info">
        <div className="comment-info-user">
          <span className="username">{displayname}</span>
          <Link to={`/${handle}`}>
            <span className="secondary">{`@${handle}`}</span>
            <span className="secondary">{moment(item.data.createdAt).fromNow()}</span>
          </Link>
          <span>{isCommentMine ? <DeleteComment id={id} /> : null}</span>
        </div>

        <p>{data.text}</p>
      </div>
      <div>
          <Confirm id={item.id} isConfirmed={item.confirmed || false} confirmCount={0} />
      </div>

    </Wrapper>
  );
};

export default Comment;
