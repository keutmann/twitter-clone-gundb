import { useEffect, useState } from 'react';
import "../lib/DispatcherEvent";


const useUserChanged = (user) => {

    const [changed, setChanged] = useState(user.relationshipChanged);

    useEffect(() => {
        user.onChange.registerCallback(setChanged);

        return () => {
            user.onChange.unregisterCallback(setChanged);
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once

    return [changed, setChanged];
}

export default useUserChanged;