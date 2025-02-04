import { sha256_Of_Object } from '../utils/crypto';
import MessageContainer from './MessageContainer';

export default class MessageManager {
    // constructor() {
    // }

    static async createId(message) {
        const hash = await MessageManager.getHash(message);
        const date = new Date();
        const id = date.toISOString()+"#"+hash;
        return id;
    }

    static createMessage(text) {
        return { text };
    }

    static async getHash(message) {
        return await sha256_Of_Object(message);
    }


    static splitKey(key) {
        const arr = key.split('#');

        return {
            key: key,
            date: arr[0],
            hash: (arr.length > 1) ? arr[1] : null
        };
    }

    static create(params) {
        let ko = MessageManager.splitKey(params.key);
        let opt = Object.assign(ko, params);
        return new MessageContainer(opt)
    }
 
}
