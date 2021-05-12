import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './userContext';

const AppProviders = ({ children }) => {
  return (
    <Router>
        <UserProvider>
          {children}
        </UserProvider>
    </Router>
  );
};

export { AppProviders };
