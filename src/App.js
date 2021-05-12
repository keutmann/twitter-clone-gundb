import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import { ThemeContext } from "./context/ThemeContext";
import Router from "./Route";
import Auth from "./components/Auth/Auth";
import useUser from './hooks/useUser';


const App = () => {

  const { isLoggedIn } = useUser();

  const { theme } = useContext(ThemeContext);

  return (
      <StyledThemeProvider theme={theme}>
        <GlobalStyle />
        <ToastContainer
          toastClassName="toast-style"
          autoClose={2000}
          closeButton={false}
          draggable={false}
        />
        {isLoggedIn ? <Router /> : <Auth />}
      </StyledThemeProvider>
  );
};


export default App;
