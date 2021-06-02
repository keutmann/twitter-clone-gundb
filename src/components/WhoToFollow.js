import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "./Loader";
import Header from "./Header";
import useUser from "../hooks/useUser";
import resources from '../utils/resources';
import FollowUser from "./FollowUser";


const Wrapper = styled.div`
	margin-left: 0.4rem;
	width: 350px;
	background: ${props => props.theme.tertiaryColor2};
	border-radius: 10px;

	div:last-child {
		border-bottom: none;
	}
`;


const WhoToFollow = () => {
	const { user, gun, getUserContainerById} = useUser();

	const [ list, setList ] = useState(null);

	useEffect(() => {
		(async () => {
			const availableUsers = await gun.get(resources.node.names.dpeep).get(resources.node.names.userIndex).once(p=>p, {wait:0}).then() || {};
			const userFollows = await user.node.follow.once(p=>p,{wait:0}).then() || {};
			
			const allUsers = Object.keys(availableUsers).filter(key => key !== '_' && key !== user.id && availableUsers[key]).map(key => {
				const keyUser = getUserContainerById(key);
				
				keyUser.isFollowing = !(!userFollows[key]);
				keyUser.isSelf = (key === user.id);

				return keyUser;	
			} );
		
			setList(allUsers || []);
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if(!list) return <Loader />;

	return (
		<Wrapper>
			<Header>Who to follow</Header>
			{
				(list.length > 0) ?
					list.map(followUser => <FollowUser key={followUser.id} followUser={followUser} /> )
					:
					<p>No other users was found</p>
			}
		</Wrapper>
	);
};

export default WhoToFollow;
