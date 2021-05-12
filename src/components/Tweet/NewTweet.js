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
import moment from 'moment'
import resources from '../../utils/resources';


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

const NewTweet = () => {
  const [tweetFiles, setTweetFiles] = useState([]);
  const tweet = useInput("");

  const { user, gun } = useUser();

  // Create a tweet on Gun
  const createTweet = async (tweet) => {
    // Timestamp the tweet automatically, this will enable time search on the users Tweets node.
    const tweetId = moment().toISOString();
    tweet.createdAt = tweetId;

    const tweetNode = user.tweetsNode.get(tweetId);
    const tweetData = await tweetNode.put(tweet);

    // Chain up tweets
    const previousTweetData = await user.tweetsNode.get(resources.node.names.latest).once().then();
    if(previousTweetData)
        tweetNode.get('next').put(previousTweetData);

    user.tweetsNode.get('latest').put(tweetData);

    // Add comments object from the Gun root, as this is writeable for everone.
    const commentsID = user.id+tweetId;
    const commentsData = await gun.get(resources.node.names.dpeep).get(resources.node.names.comments).get(commentsID).put({}).once().then();
    tweetNode.get(resources.node.names.comments).put(commentsData);
  }

  const handleNewTweet = async (e) => {
    e.preventDefault();

    if (!tweet.value) return toast("Write something");

    const tags = tweet.value.split(" ").filter((str) => str.startsWith("#")).join(', ');

    try {
      let tweetdata = { "text" : tweet.value, "tags": tags };
      
      await createTweet(tweetdata);

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

  if (!user) return <Loader />;

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
