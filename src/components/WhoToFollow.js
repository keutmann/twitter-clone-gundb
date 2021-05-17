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
	const { user: userContainer, gun, getUserContainerById} = useUser();

	const [ list, setList ] = useState(null);

	useEffect(() => {
		if(!userContainer) return; // User context has not loaded yet. No Gun object available.
		if(list) return;

		(async () => {
			const availableUsers = await gun.get(resources.node.names.dpeep).get(resources.node.names.userIndex).once(p=>p, {wait:0}).then() || {};
			const userFollows = await userContainer.node.follow.once(p=>p,{wait:0}).then() || {};
			
			const allUsers = Object.keys(availableUsers).filter(key => key !== '_' && key !== userContainer.id && availableUsers[key]).map(key => {
				const keyUser = getUserContainerById(key);
				
				keyUser.isFollowing = !(!userFollows[key]);
				keyUser.isSelf = (key === userContainer.id);

				return keyUser;	
			} );
		
			setList(allUsers || []);
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userContainer]);

	if(!list) return <Loader />;
	console.log("WhoToFollow Render");

	return (
		<Wrapper>
			<Header>Who to follow</Header>
			{
				list.map(followUser => <FollowUser key={followUser.id} followUser={followUser} /> )
			}
		</Wrapper>
	);
};

export default WhoToFollow;
