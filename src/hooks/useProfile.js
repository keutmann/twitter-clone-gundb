import { useState, useEffect } from 'react';

const useProfile = (user) => {

    const [ profile, setProfile] = useState(user.loadProfile());

    useEffect(() => {

      // Update if something has changed.
      setProfile(user.loadProfile()); 
      
      user.onProfileChange.add(setProfile);

      return () => {
        user.onProfileChange.remove(setProfile);
      };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return profile;
  }

export default useProfile;