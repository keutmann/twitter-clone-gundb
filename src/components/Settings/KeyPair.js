import React from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import TextareaAutosize from "react-textarea-autosize";
import useInput from "../../hooks/useInput";
import Button from "../../styles/Button";
//import AvatarIdenticon from "../AvatarIdenticon";
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

  .new-keypair {
    display: flex;
    flex-direction: column;
  }

  .new-keypair-action {
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

const KeyPair = () => {
  const keyPair = useInput("");


  const { user } = useUser();
  //const [ user, setUser ] = useState(null);

  // useEffect(() => {
  //   if(!userContainer) return;

  //   setUser(userContainer);
  //   keyPair.value = JSON.stringify(userContainer.node.user.is, null, 2);
  // },[userContainer, keyPair]);

  if (!user) return <Loader />;

  keyPair.value = JSON.stringify(user.node.user.is, null, 2);

  const handleNewKeyPair = async (e) => {
    e.preventDefault();

    if (!keyPair.value) return toast("Write something");

  //   const tags = keyPair.value.split(" ").filter((str) => str.startsWith("#")).join(', ');

  //   try {
  //     let tweetdata = { "text" : keyPair.value, "tags": tags };
  //     createTweet(tweetdata);

  //     //toast.success("Your tweet has been posted");
  //   } catch (err) {
  //     return displayError(err);
  //   }

  //   keyPair.setValue("");
  //   setTweetFiles([]);
  // };

  // const handleTweetFiles = async (e) => {
  //   const imageUrl = await uploadImage(e.target.files[0]);
  //   setTweetFiles([...tweetFiles, imageUrl]);
  };

  return (
    <Wrapper>

      
      <form onSubmit={handleNewKeyPair}>
        <div className="new-keypair">Key pair</div>
        <div className="new-keypair">
          <TextareaAutosize
            cols="48"
            placeholder="Add key pair"
            type="text"
            value={keyPair.value}
            onChange={keyPair.onChange}
          />

          <div className="new-keypair-action">
            <Button sm disabled={false}>
              Update key pair
            </Button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default KeyPair;
