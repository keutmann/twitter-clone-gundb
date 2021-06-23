import { useState, useEffect } from 'react';

const useProfile = (user) => {

    const [ profile, setProfile] = useState(user.loadProfile());

    useEffect(() => {

      if(!user.profile.loaded) {
        user.loadProfile(setProfile);
      } else {
        setProfile(profile);
      }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setProfile]);

    return profile;
  }

export default useProfile;