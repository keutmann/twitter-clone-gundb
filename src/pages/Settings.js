import React from "react";
import styled from "styled-components";
import KeyPair from "../components/Settings/KeyPair";
import Header from "../components/Header";

const Wrapper = styled.div``;

const Settings = () => {
	return (
		<Wrapper>
			<Header>
				<span>My Settings</span>
			</Header>
			<KeyPair />
		</Wrapper>
	);
};

export default Settings;
