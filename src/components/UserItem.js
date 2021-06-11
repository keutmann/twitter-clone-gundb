import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Button from "../styles/Button";
import AvatarIdenticon from "./AvatarIdenticon";
import useProfile from '../hooks/useProfile';
import Degree from './Buttons/Degree';
import ProfileMenu from './Profile/ProfileMenu'


const UserWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 1rem 1rem;
	border-bottom: 1px solid ${props => props.theme.tertiaryColor};
	font-size: 0.9rem;

	button {
		align-self: flex-start;
	}

	.avatar-handle {
		display: flex;

		img {
			margin-right: 1rem;
		}
	}

	.handle-fullname {
		display: flex;
		flex-direction: column;

		span:first-child {
			font-weight: 500;
		}

		span.secondary {
			color: ${props => props.theme.secondaryColor};
		}
	}
`;

const UserItem = ({ id, user }) => {


	const profile = useProfile(user);

	const userid = user.id;
	const { handle, displayname } = profile;
	  
    return (
	<UserWrapper>
		<div className="avatar-handle">
            <Link to={`/${userid}`}>
                <AvatarIdenticon id={userid} profile={profile} />
            </Link>
			<div className="handle-fullname">
                <Link to={`/${userid}`}>
                    <span className="username">{displayname}</span>
                </Link>
                <span className="secondary">{`@${handle}`}</span>
			</div>
		</div>

		{!user.isSelf ? (
			<React.Fragment>
				<span>{user.localState.name}</span>
				<Degree user={user}></Degree>
				<ProfileMenu user={user}></ProfileMenu>

			</React.Fragment>
		) : (
			<Link to="/settings/profile">
				<Button sm outline className="action-btn">
					Edit Profile
				</Button>
			</Link>
		)}
	</UserWrapper>);
};

export default UserItem;