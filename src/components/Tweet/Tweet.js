import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
//import DeleteTweet from "./DeleteTweet";
import LikeTweet from "./LikeTweet";
import Retweet from "./Retweet";
import { CommentIcon } from "../Icons";
//import TweetFile from "../../styles/TweetFile";
import useUser from "../../hooks/useUser";
import AvatarIdenticon from "../AvatarIdenticon";


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

  const { loadProfile } = useUser();

  const [ profile, setProfile] = useState(null);

  useEffect(() => {
    if (item.user.profile) {
      setProfile(item.user.profile);
    } else {
      (async ()=>{
        setProfile(await loadProfile(item.user));
      })();
    }
  }, [loadProfile, setProfile, item])

  const userid = item.user.id;
  const handle = (profile && profile.handle) || `${userid.substring(0,4)}...${userid.substring(userid.length - 4, userid.length)}`;
  const displayname =(profile &&  profile.displayname) || "Anonymous";

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
            <span className="secondary">- {moment(item.createdAt).fromNow()}</span>
          </Link>
        </div>

        <Link to={`/${userid}/status/${item.id}`}>
          <p>{item.tweet.text}</p>
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

        {/* <Link to={`/${handle}/status/${id}`}>
          {files && files.length && files[0] ? (
            <TweetFile src={files[0].url} alt="tweet-file" />
          ) : null}
        </Link> */}

        <div className="tweet-stats">
          <div>
            <span className="comment">
              <Link to={`/${userid}/status/${item.id}`}>
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
            <LikeTweet id={item.id} isLiked={false} likesCount={0} />
          </div>

          {/* <div>
            <span>{isTweetMine ? <DeleteTweet id={id} /> : null}</span>
          </div> */}
        </div>
      </div>
    </Wrapper>
  );
};

export default Tweet;
