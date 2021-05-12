import Gun from 'gun/gun';
import 'gun/sea';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';

//import crypto from 'crypto';

//import then from 'gun/lib/then';
//import client from "./apollo/client";
//import { USER_LOGGED_IN, USER } from "./queries/client";


export const DPEEP = "dpeep";
export const PEOPLE = "people";
export const PEEPS = "peeps";
export const PREVIUOS_MESSAGE = "PM";
export const LATEST_MESSAGE = "LM";
export const REPLIES = "RL";
export const PROFILE = "profile";

const gun = Gun({
    localStorage: false,
    peers: ['http://127.0.0.1:8765/gun']
});

export default gun;

export const CurrentUserPub = () => {
    if(gun.user().is)
        return gun.user().is.pub;

    return null;
}

export const SignupGun = async (user, rememberMe) => {

    async function signup(handle, pass, remember) {
        return  new Promise(function(resolve, reject) {
            gun.user().create(handle, pass, async function(ack) {
                if(ack.err) {
                    reject(ack);
                    return;
                }
                LoginGun(handle, pass, remember, () => UpdateUserProfile(user)).then(p=>resolve(p));
            });
        });
        }
        
    var ack = await signup(user.handle, user.password, rememberMe);

    if(ack.err) {
        throw ack.err;
    }
    return ack;
};

export const UpdateUserProfile = (user) => {
    user.id = gun.user().is.pub;
    user.password = "";
    gun.get(DPEEP).get(PEOPLE).get(user.id).get(PROFILE).put(user);
}

export const LoginGun = async (handle, password, rememberMe, cb) => {

    async function authenticate(handle, password) {
        return  new Promise(function(resolve, reject) {
            gun.user().auth(handle, password, async function(ack) {
            if(ack.err) {
                reject(ack);
                return;
            }
            resolve(ack);
            });
        });
    }
        
    var ack = await authenticate(handle, password);
    if(ack.err) {
        throw ack.err;
    }

    if (rememberMe) {
        localStorage.setItem("dpeepAlias", handle);
        localStorage.setItem("dpeepPassword", password);
    } else {
        localStorage.setItem("dpeepAlias", "");
        localStorage.setItem("dpeepPassword", "");
    }
    //gun.user().recall({sessionStorage: true});

    if(cb)
        cb();

    let profile = await GetGunProfile();

    return profile;
};

export const AutoLoginGun = async () => {

    if(IsUserLoggedInGun()) return true;

    const handle = localStorage.getItem("dpeepAlias");
    const password = localStorage.getItem("dpeepPassword");

    if(handle && password) {
        await LoginGun(handle, password, true);
        return true;
    }
    return false;
}

// export const LogUserInGraphQL = async () => {
//     let profile = await GetGunProfile();

//     localStorage.setItem("profile",JSON.stringify(profile));
//     var user = {
//         id : profile.id,
//         handle: profile.handle,
//         avatar: profile.avatar,
//         fullname: profile.fullname,
//     };

//     return profile;
// }

export const IsUserLoggedInGun = () => {

    var loggedIn = (gun.user().is) ? true : false;

    return loggedIn;
};

export const GetGunProfile = async () => {
    var user = {
        id : '',
        handle: '',
        avatar: '',
        fullname: '',
    };

    const profile = JSON.parse(localStorage.getItem("profile"));
    if(profile)
        return profile;

    if(gun.user().is) {

        async function getUserData(pub, propName) {
            return new Promise(function(resolve, reject) {
                gun.user(pub).get(propName).once(function(p) {
                    resolve(p);
                });
            });
        }

        let profile = await getUserData(gun.user().is.pub, PROFILE);
        user = profile || user;
        user.id = gun.user().is.pub;
    }

    return user;
};


// function addUserMessage({ user, collection, message, replyEnabled }) {
//     let messageId = Sha256(JSON.stringify(message));

//     let gunMessage = collection.get(messageId);
//     gunMessage.put(message);
//     gunMessage.get(PREVIUOS_MESSAGE).put(collection.get(LATEST_MESSAGE));
//     collection.get(LATEST_MESSAGE).put(gunMessage);

//     // if(message.repliesEnabled) {
//     //     var openRepliesCollection = dpeep.get(REPLIES);
//     //     let openReplies = openRepliesCollection.get(messageId);
//     //     gunMessage.get(REPLIES).put(openReplies);
//     // }
//     return gunMessage;
// }

// function Sha256(message) {
// let hash = crypto
// .createHash("sha256")
//     .update(message)
//     .digest("hex");
// return hash;
// }
