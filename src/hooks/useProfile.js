import { useState } from 'react';
import useUser from "./useUser";

const useProfile = (userContainer) => {
    const { loadProfile } = useUser();
    const [ profile, setProfile] = useState(userContainer ? loadProfile(userContainer, (profile) => setProfile(profile)) : null);

    // useEffect(() => {
    //   if (!userContainer.profile) {
    //     (async ()=>{
    //       setProfile(await loadProfile(userContainer));
    //     })();
    //   }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [userContainer])
  
    return profile;
  }

export default useProfile;