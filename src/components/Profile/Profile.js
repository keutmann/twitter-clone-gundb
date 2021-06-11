import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../Header";
import ProfileInfo from "./ProfileInfo";
import Loader from "../Loader";
import useUser from "../../hooks/useUser";
import ProfileTabs from "./ProfileTabs";

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
  const { isLoggedIn, user, getUserContainerById } = useUser();
  const { handle } = useParams(); 
  const [ viewedUser, setViewedUser] = useState(null);
  const [ profile, setProfile] = useState(null);
  const [ userNotFound, setUserNotFound] = useState(false);

  
  useEffect(() => {
    const userContainer = getUserContainerById(handle);
    if(!userContainer) {
      setUserNotFound(true);
      return;
    }
    setViewedUser(userContainer);
    setProfile(userContainer.loadProfile((profile) => setProfile(profile))); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle])

  if (!profile) 
    return <Loader />;

  if(userNotFound)
    return <p>User not found</p>;

  const isSelf = (isLoggedIn) ? handle === user.id : false;

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
      <ProfileInfo user={viewedUser} profile={profile} isSelf={isSelf} />
      {/* {profile && profile.tweets && profile.tweets.length
        ? profile.tweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} />
          ))
        : null} */}
      <ProfileTabs user={viewedUser} />
    </Wrapper>
  );
};

export default Profile;
