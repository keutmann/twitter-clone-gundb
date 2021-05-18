import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import CoverPhoto from "../../styles/CoverPhoto";
import Button from "../../styles/Button";
import Follow from "./Follow";
import { DobIcon, LocationIcon, LinkIcon } from "../Icons";
import CustomResponse from "../CustomResponse";
import AvatarIdenticon from "../AvatarIdenticon";

const Wrapper = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.tertiaryColor};
  padding-bottom: 1rem;

  .avatar {
    margin-left: 1.4rem;
    margin-top: -4rem;
  }

  .profile-name-handle {
    display: flex;
    flex-direction: column;
    margin-left: 1.4rem;
    position: relative;
    top: -16px;

    span.fullname {
      font-weight: bold;
    }

    span.handle {
      margin-top: 0.1rem;
      color: ${(props) => props.theme.secondaryColor};
    }
  }

  .profile-info {
    padding-left: 1.4rem;

    .bio {
      width: 90%;
    }
  }

  div.loc-dob-web {
    display: flex;
    color: ${(props) => props.theme.secondaryColor};
    margin: 0.6rem 0;

    span {
      margin-right: 1.5rem;
    }

    svg {
      margin-right: 0.2rem;
      position: relative;
      top: 3px;
    }
  }

  div.follow-following {
    color: ${(props) => props.theme.secondaryColor};
    span {
      margin-right: 1.3rem;
    }
  }

  @media screen and (max-width: 530px) {
    div.loc-dob-web {
      display: flex;
      flex-direction: column;

      span {
        margin-bottom: 0.7rem;
      }
    }
  }
`;

const ProfileInfo = ({ userid, profile, isSelf }) => {
  if (!profile) {
    return (
      <CustomResponse text="Oops, you are trying to visit a profile which seems to be doesn't exist. Make sure the profile handle exists" />
    );
  }

  const {
    id,
    coverPhoto,
    bio,
    location,
    website,
    dob,
    isFollowing,
    followersCount,
    followingCount,
    handle,
    displayname,
  } = profile;

  
  return (
    <Wrapper>
      <CoverPhoto src={coverPhoto || '/tropical_paradise_204378.jpg'} alt="cover" />
      <div className="avatar">
        <AvatarIdenticon id={userid} profile={profile} />
      </div>

      {isSelf ? (
        <Link to="/settings/profile">
          <Button relative outline className="action-btn">
            Edit Profile
          </Button>
        </Link>
      ) : (
        <Follow
          relative
          className="action-btn"
          isFollowing={isFollowing}
          id={id}
        />
      )}

      <div className="profile-name-handle">
        <span className="fullname">{displayname}</span>
        <span className="handle">{`@${handle}`}</span>
      </div>

      <div className="profile-info">
        <p className="bio">{bio}</p>

        {!location && !website && !dob ? null : (
          <div className="loc-dob-web">
            {location ? (
              <span>
                <LocationIcon /> {location}
              </span>
            ) : null}

            {website ? (
              <span>
                <LinkIcon /> {website}
              </span>
            ) : null}

            {dob ? (
              <span>
                <DobIcon />
                {dob}
              </span>
            ) : null}
          </div>
        )}

        <div className="follow-following">
          <span>
            {followersCount ? `${followersCount} followers` : "No followers"}
          </span>
          <span>
            {followingCount
              ? `${followingCount} following`
              : "Not following anyone"}
          </span>
        </div>
      </div>
    </Wrapper>
  );
};

export default ProfileInfo;
