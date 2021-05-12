import { useState, useEffect } from 'react';
import { AutoLoginGun, GetGunProfile } from "../gundb";

export const useLoggedIn = ({ setUser }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        // if(isLoggedIn === undefined) {
        //     AutoLoginGun().then(p => {
        //       setIsLoggedIn(p)
        //       if(p == true) {
        //         GetGunProfile().then((profile) => {
        //             setUser(profile);
        //         });
        //       }
        //     });
        //   }
     });

    if (isLoggedIn === null) 
        return { userloading : true, isLoggedIn: false };
 
    return { userloading : false, isLoggedIn: isLoggedIn, setIsLoggedIn };
}