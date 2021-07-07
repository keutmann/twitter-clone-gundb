import React, { useState } from 'react';
import Gun from 'gun/gun';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/lib/then';

//const serverpeers = ['http://localhost:8765/gun'];
const serverpeers = [];


const useGun = (opt) => {

  Gun.on('opt', function (context) {
    if (context.once)
      return

    // Pass to subsequent opt handlers
    this.to.next(context)

    const { isValid } = context.opt

    if (isValid) {
      // Check all incoming traffic
      context.on('in', function (msg) {
        if (msg.put && !isValid(msg))
          return;

        this.to.next(msg)
      })
    }
  });


  //{ peers: serverpeers, localStorage: false }{peers: ["http://server-ip-or-hostname:8080/gun"]}
  const localopt = Object.assign({ peers: serverpeers, localStorage: false }, opt);
  const [gun] = useState(Gun(localopt));
  const [authenticate, setAuthenticate] = useState(false);

  gun.on('auth', function (...args) {
    // Do work
    setAuthenticate(true);
    // Allow other on('auth') listeners to receive a callback:
    // @ts-ignore: Ignore TypeScript scope shadowing error
    this.to.next(...args);
  });


  const value = React.useMemo(
    () => ({
      gun, authenticate, setAuthenticate

    }),
    [
      gun, authenticate, setAuthenticate
    ]
  );
  return value;

}

export default useGun;