import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import TextareaAutosize from "react-textarea-autosize";
import useInput from "../../hooks/useInput";
import Button from "../../styles/Button";
import TweetFile from "../../styles/TweetFile";
import { UploadFileIcon } from "../Icons";
import { displayError } from "../../utils";
import AvatarIdenticon from "../AvatarIdenticon";
import { uploadImage } from "../../utils";
import Loader from "../Loader";
import useUser  from '../../hooks/useUser';

const Wrapper = styled.div`
  display: flex;
  padding: 1rem 1rem;
  border-bottom: 7px solid ${(props) => props.theme.tertiaryColor};

  textarea {
    width: 100%;
    background: inherit;
    border: none;
    font-size: 1.23rem;
    font-family: ${(props) => props.theme.font};
    color: ${(props) => props.theme.primaryColor};
    margin-bottom: 1.4rem;
  }

  .new-tweet {
    display: flex;
    flex-direction: column;
  }

  .new-tweet-action {
    display: flex;
    align-items: center;
  }

  svg {
    width: 24px;
    height: 24px;
    fill: ${(props) => props.theme.accentColor};
    margin-right: 2rem;
    cursor: pointer;
  }

  button {
    position: relative;
  }
`;

// const Avatar = styled(Identicon)`
//   height: ${(props) => (props.lg ? "130px" : "40px")};
//   width: ${(props) => (props.lg ? "130px" : "40px")};
//   object-fit: cover;
//   border-radius: 50%;
//   margin-right: 1rem;
//   margin-bottom: 1rem;

//   @media screen and (max-width: 530px) {
//     height: ${(props) => (props.lg ? "110px" : "40px")};
//     width: ${(props) => (props.lg ? "110px" : "40px")};
//   }
// `;


const NewTweet = () => {
  const [tweetFiles, setTweetFiles] = useState([]);
  const tweet = useInput("");

  const { user, createTweet } = useUser();


  if (!user) return <Loader />;

  const handleNewTweet = async (e) => {
    e.preventDefault();

    if (!tweet.value) return toast("Write something");

    const tags = tweet.value.split(" ").filter((str) => str.startsWith("#")).join(', ');

    try {
      let tweetdata = { "text" : tweet.value, "tags": tags };
      createTweet(tweetdata);

      //toast.success("Your tweet has been posted");
    } catch (err) {
      return displayError(err);
    }

    tweet.setValue("");
    setTweetFiles([]);
  };

  const handleTweetFiles = async (e) => {
    const imageUrl = await uploadImage(e.target.files[0]);
    setTweetFiles([...tweetFiles, imageUrl]);
  };



  return (
    <Wrapper>

      <AvatarIdenticon id={user.id} profile={user.profile} />
      {/* <Identicon string={user.id} size="32" /> */}
      {/* <Avatar src={profile && profile.avatar} alt="avatar" /> */}
      <form onSubmit={handleNewTweet}>
        <div className="new-tweet">
          <TextareaAutosize
            cols="48"
            placeholder="What's happening?"
            type="text"
            value={tweet.value}
            onChange={tweet.onChange}
          />

          {tweetFiles[0] && (
            <TweetFile newtweet src={tweetFiles[0]} alt="preview" />
          )}

          <div className="new-tweet-action">
            <div className="svg-input">
              <label htmlFor="file-input">
                <UploadFileIcon />
              </label>
              <input id="file-input" accept="image/*" type="file" onChange={handleTweetFiles} />
            </div>
            <Button sm disabled={false}>
              Tweet
            </Button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default NewTweet;
