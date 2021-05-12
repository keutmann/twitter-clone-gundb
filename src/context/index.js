import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GunProvider } from './gunContext';
import { UserProvider } from './userContext';

const AppProviders = ({ children }) => {
  return (
    <Router>
      <GunProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </GunProvider>
    </Router>
  );
};

export { AppProviders };
