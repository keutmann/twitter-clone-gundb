import React, { useContext } from "react";
//import { useApolloClient } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { UserIcon } from "../Icons";
import { ThemeContext } from "../../context/ThemeContext";
import { Wrapper } from "../ToggleTheme";
//import Gun from 'gun/gun';
//import 'gun/sea';
//import gun from "../../gundb";
import useUser from '../../hooks/useUser';


const Logout = () => {
	const { theme } = useContext(ThemeContext);
	const { logoutUser } = useUser();

	const handleLogout = () => {
		logoutUser();
		toast.success("You are logged out");
	};

	return (
		<Wrapper onClick={handleLogout}>
			<UserIcon sm color={theme.accentColor} />
			<p>Logout</p>
		</Wrapper>
	);
};

export default Logout;
