import React from "react";
import styled from "styled-components";
import Avatar from "../styles/Avatar";
import Identicon from 'react-identicons';

const StyledIdenticon = styled(Identicon)`
  height: ${(props) => (props.lg ? "130px" : "40px")};
  width: ${(props) => (props.lg ? "130px" : "40px")};
  object-fit: cover;
  border-radius: 50%;
  margin-right: 1rem;
  margin-bottom: 1rem;

  @media screen and (max-width: 530px) {
    height: ${(props) => (props.lg ? "110px" : "40px")};
    width: ${(props) => (props.lg ? "110px" : "40px")};
  }
`;

const AvatarIdenticon = ({id, profile}) => (profile && profile.avatar) ?
  <Avatar src={profile.avatar} alt="avatar" /> 
  :
  <StyledIdenticon string={id} size="40" />
  ;

export default AvatarIdenticon;
