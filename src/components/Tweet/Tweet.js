import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import DeleteTweet from "./DeleteTweet";
import ConfirmReject from "../Message/ConfirmReject";
import Retweet from "./Retweet";
import { CommentIcon } from "../Icons";
import AvatarIdenticon from "../AvatarIdenticon";
import useProfile from '../../hooks/useProfile';
import Degree from "../Buttons/Degree";
import useUserChanged from "../../hooks/useUserChanged";
import TweetMenu from "./TweetMenu";
import resources from "../../utils/resources";

const Wrapper = styled.div`
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.tertiaryColor};
  padding: 1.5rem 1rem 1rem 1rem;

  .tweet-info-user {
    display: flex;
  }

  .tweet-info-user span.username {
    font-weight: 500;
  }

  .tweet-info-user span.secondary {
    padding-left: 0.5rem;
    color: ${(props) => props.theme.secondaryColor};
  }

  .tweet-info-user div.menu {
    float: right;
    padding-left: 20px;
  }


  .tags {
    display: flex;
  }

  span.tag {
    color: ${(props) => props.theme.accentColor};
    margin-right: 0.4rem;
  }

  div.tweet-stats {
    display: flex;
    margin-top: 0.5rem;
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

    span.comment {
      svg {
        position: relative;
        top: 4px;
      }
    }
  }

  @media screen and (max-width: 470px) {
    div.tweet-stats {
      div {
        margin-right: 2.5rem;
      }
    }
  }

  @media screen and (max-width: 430px) {
    flex-direction: column;

    .username {
      display: none;
    }

    .avatar {
      display: none;
    }

    .tweet-info-user span.secondary {
      padding-left: 0;
      padding-right: 0.7rem;
    }
  }
`;

const Tweet = ({ item }) => {

  const [,] = useUserChanged(item.owner);

  const profile = useProfile(item.owner);

  const userid = item.owner.id;
  const { handle, displayname } = profile;

  const itemUri = encodeURIComponent(item.soul);

  if(item.owner.state.action === resources.node.names.block || item.owner.state.action === resources.node.names.mute)
    return null;
  
  return (
    <Wrapper>
      <Link to={`/${userid}`}>
        <AvatarIdenticon id={userid} profile={profile} />
      </Link>

      <div className="tweet-info">
        <div className="tweet-info-user">
          <Link to={`/${userid}`}>
            <span className="username">{displayname}</span>
            <span className="secondary">{`@${handle}`}</span>
            <span className="secondary">- {moment(item.data.createdAt).fromNow()}</span>
          </Link>
          <div className="menu">
            <Degree user={item.owner}></Degree>
          </div>
          <div className="menu">
            <TweetMenu item={item} />
          </div>
        </div>

        <Link to={`/tweet/${ itemUri }`}>
          <p>{item.data.text}</p>
        </Link>

        {/* <div className="tags">
          {tags.length
            ? tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))
            : null}
        </div> */}

        {/* <Link to={`/${handle}/time/${id}`}>
          {files && files.length && files[0] ? (
            <TweetFile src={files[0].url} alt="tweet-file" />
          ) : null}
        </Link> */}

        <div className="tweet-stats">
          <div>
            <span className="comment">
              <Link to={`/tweet/${ itemUri }`}>
                <CommentIcon />
                {0 ? 0 : null}
              </Link>
            </span>
          </div>

          <div>
            <Retweet
              id={item.id}
              isRetweet={true}
              retweetsCount={0}
            />
          </div>

          <div>
            <ConfirmReject id={item.id} item={item} />
          </div>

          <div>
            <span>{true ? <DeleteTweet item={item} /> : null}</span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Tweet;
