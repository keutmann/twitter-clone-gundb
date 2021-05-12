import React, { useContext } from "react";
import { toast } from "react-toastify";
import { UserIcon } from "../Icons";
import { ThemeContext } from "../../context/ThemeContext";
import { Wrapper } from "../ToggleTheme";
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
