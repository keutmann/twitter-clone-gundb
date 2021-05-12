import React, { useState, useEffect } from 'react';
import Gun from 'gun/gun';
import sea from 'gun/sea';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';

import { useGun } from '@altrx/gundb-react-hooks'; // , useGunKeys, useGunKeyAuth
//import { instantiateNewGun } from '../utils/index.js';
import { sha256 } from '../utils/crypto';


const dpeepUserKeys = 'dpeepUserKeys';
//const serverpeers = ['https://gun-us.herokuapp.com/gun'];
//const serverpeers = ['http://localhost:8765/gun'];

const GunContext = React.createContext();
GunContext.displayName = 'GunContext';

const GunProvider = (props) => {
  //const [isReadyToAuth, setReadyToAuth] = useState(false);

  // const spawnNewGun = instantiateNewGun(Gun, {
  //   peers: serverpeers,
  // });

  //const [gun] = useGun(Gun, { peers: serverpeers });
  const [gun] = useGun(Gun);
  //const [userKeys, setUserKeys] = useGunKeys(sea, () => null);
  //const [user, isLoggedIn] = useGunKeyAuth(gun, userKeys, isReadyToAuth);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  gun.on('auth', () => {
    setIsLoggedIn(true);
    setUser(gun.user());
  });

  const login = React.useCallback(
    async (keys) => {
      gun.user().auth(keys);
      sessionStorage.setItem(dpeepUserKeys, JSON.stringify(keys));

      return { sucess: true, msg: 'Is authenticating', keyPair: keys};
    },
    [gun]
  );

  const loginPassword = React.useCallback(
    async (username, password) => {

      const passwordString = username+password;
      const keyHash = await sha256(passwordString);
      const encryptedstring = localStorage.getItem(keyHash);

      if(!encryptedstring) 
        return { success: false, msg: 'Unknown user or missing key pair. Try signup.' };

      const keyPair = await sea.decrypt(encryptedstring, passwordString);
      if(!keyPair) 
        return { success: false, msg: 'Decryption of key pair failed' };
      
      return await login(keyPair);
    },
    [login]
  );

  const signup = React.useCallback(
    async (username, password) => {

      // Check first if the user already exist, and then auto login 
      const ack = await loginPassword(username, password);
      if(ack.sucess) // Login success, now return keypair 
        return ack;
      
      // There is no user, therefore create a new keyPair
      const passwordString = username+password;
      const keyHash = await sha256(passwordString);
      const keyPair = await sea.pair();
      const encryptedString = await sea.encrypt(JSON.stringify(keyPair), passwordString);
      localStorage.setItem(keyHash, encryptedString);
    
      return login(keyPair);
    },
    [login, loginPassword]
  );

  const logout = React.useCallback(() => {
    user.leave();

    sessionStorage.setItem(dpeepUserKeys, '');
    setUser(null);
    setIsLoggedIn(false);
  }, [user, setUser, setIsLoggedIn]);

  const value = React.useMemo(
    () => ({ user, login, loginPassword, signup, logout, isLoggedIn, gun }),
    [user, login, loginPassword, signup, logout, isLoggedIn, gun]
  );


  useEffect(() => {
    if (isLoggedIn) {
      console.log(`User loggedIn`);
      return;
    }

    //if(user && user.is) return;

    const keysString = sessionStorage.getItem(dpeepUserKeys);
    if(keysString && keysString.length > 2) {
      const keys = JSON.parse(keysString);
      login(keys);
    }
  }, [isLoggedIn, gun, login]);


  return <GunContext.Provider value={value} {...props} />;
};

export { GunProvider, GunContext };
