import sea from 'gun/sea';

export const sha256 = async (data) => await sea.work(data, undefined, undefined, { name: 'SHA-256' });

export const sha256_Of_Object = async (data) => {

    const sortedData = JSON.stringify(data, Object.keys(data).filter(key => key[0] !== '_').sort());

    return await sha256(sortedData);
} 

