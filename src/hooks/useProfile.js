import { useState } from 'react';
import useUser from "./useUser";

const useProfile = (userContainer) => {

    function loader () {
        if(userContainer) 
          return loadProfile(userContainer, (profile) => setProfile(profile));
        return null;
    }

    const { loadProfile } = useUser();
    const [ profile, setProfile] = useState(loader);

    return profile;
  }

export default useProfile;