import React from "react";
import styled from "styled-components";
import FeedList from "../components/FeedList";
import NewTweet from "../components/Tweet/NewTweet";
import FeedStatus from "../components/FeedStatus";
import Header from "../components/Header";

const Wrapper = styled.div``;

const Home = () => {
	return (
		<Wrapper>
			<Header>
				<span>Home</span>
			</Header>
			<NewTweet />
			<FeedStatus />
			<FeedList />
		</Wrapper>
	);
};

export default Home;
