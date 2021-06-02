import React, { useContext } from "react";
import { SettingsIcon } from "../Icons";
import { ThemeContext } from "../../context/ThemeContext";
import { NavLink } from "react-router-dom";
import MenuButton from "../../styles/MenuButton";


const SettingsMenuButton = () => {
	const { theme } = useContext(ThemeContext);

	return (
		<NavLink activeClassName="" to="/settings">
			<MenuButton>
				<SettingsIcon sm color={theme.accentColor} />
				<p>Settings</p>
			</MenuButton>
		</NavLink>
	);
};

export default SettingsMenuButton;
