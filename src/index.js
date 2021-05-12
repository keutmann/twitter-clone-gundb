import React from "react";
import { render } from "react-dom";
import App from "./App";
import { AppProviders } from './context';
import { ThemeProvider } from "./context/ThemeContext";

const RootApp = () => (
  <AppProviders>
     <ThemeProvider>
       <App />
     </ThemeProvider>
  </AppProviders>
);
render(<RootApp />, document.getElementById("root"));
