import React, { useContext } from "react";
import styled from "styled-components";
import { SettingsIcon } from "../Icons";
import { ThemeContext } from "../../context/ThemeContext";
import { NavLink } from "react-router-dom";

export const Wrapper = styled.div`
  display: flex;
  align-items: baseline;
  margin-left: 0.7rem;
  margin-bottom: 1rem;
  cursor: pointer;

  p {
    margin-left: 0.4rem;
  }
`;

const SettingsMenuButton = () => {
	const { theme } = useContext(ThemeContext);

	return (
		<NavLink activeClassName="" to="/settings">
			<Wrapper>
				<SettingsIcon sm color={theme.accentColor} />
				<p>Settings</p>
			</Wrapper>
		</NavLink>
	);
};

export default SettingsMenuButton;
