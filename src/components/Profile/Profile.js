import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../Header";
import ProfileInfo from "./ProfileInfo";
//import Tweet from "../Tweet/Tweet";
import Loader from "../Loader";
import useUser from "../../hooks/useUser";
//import resources from "../../utils/resources";

const Wrapper = styled.div`
	padding-bottom: 5rem;

  .profile-top {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;

    span.tweetsCount {
      margin-top: 0.1rem;
      color: ${(props) => props.theme.secondaryColor};
      font-size: 0.9rem;
    }
  }
`;

const Profile = () => {
  const { isLoggedIn, users, user, loadProfile } = useUser();
  const { handle } = useParams(); 
  const [ profile, setProfile] = useState(null);

  console.log("Profile handle: "+handle)

  useEffect(() => {
    const viewedUser = users[handle];
    if(!viewedUser) return;
    (async ()=>{
      setProfile(await loadProfile(viewedUser));
    })();
  }, [loadProfile, users, user, handle])

  if (!profile) {
    return <Loader />;
  }

  const isSelf = (isLoggedIn) ? handle === user.gunUser.is.pub : false;

  return (
    <Wrapper>
      <Header>
        <div className="profile-top">
          <span>{profile.handle}</span>
          {/* <span className="tweetsCount">
            {profile && profile.tweetsCount
              ? `${profile.tweetsCount} Tweets`
              : "No Tweets"}
          </span> */}
        </div>
      </Header>
      <ProfileInfo profile={profile} isSelf={isSelf} />
      {/* {profile && profile.tweets && profile.tweets.length
        ? profile.tweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} />
          ))
        : null} */}
    </Wrapper>
  );
};

export default Profile;
