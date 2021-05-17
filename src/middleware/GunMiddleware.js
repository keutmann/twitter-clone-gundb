// import Signup from "../components/Auth/Signup";
// import gun, { IsLoggedInOnGun, PROFILE } from '../gundb';
// import 'gun/gun';
// import 'gun/sea';
// import then from 'gun/lib/then';
// //import { PROFILE } from "../../queries/profile";


// export const ProcessRequest = async (operation) => {
//   switch(operation.operationName)   {
//     // case "signup": return SignupGun(gun, operation.variables); break;
//     // case "login": return LoginGun(gun, operation.variables); break;
//     // //case "userLoggedIn": return await UserLoggedInGun(gun, operation.variables); break;
//     // case "user": return userGun(gun, operation.variables); break;
//     case PROFILE : return GetProfile(operation.variables, gun); break;
//     case 'users' : return GetUsers(operation.variables, gun); break;
//   }
// }


// const GetProfile = async ({ handle }, gun) => {
//     let profile = await gun.user(handle).get(PROFILE).once(p => p);

//     return { profile: profile };
// }

// const GetUsers = async (gun) => {
//     //let profile = await gun.user(handler).get(PROFILE).once(p => p);

//     return {};
// }


// // const SignupGun = async (gun, user) => {

// //     async function signup(handle, pass) {
// //         return  new Promise(function(resolve, reject) {
// //           gun.user().create(handle, pass, async function(ack) {
// //             if(ack.err) {
// //               reject(ack);
// //               return;
// //             }
// //             gun.user().auth(handle, pass, () => resolve(ack));
// //           });
// //         });
// //       }
      
// //     var ack = await signup(user.handle, user.password);

// //     if(ack.err) {
// //         throw ack.err;
// //     }
    
    
// //     user.id = gun.user().is.pub;
// //     gun.user().get(PROFILE).put(user);

// //     var result = { signup : {
// //         token: user.id,
// //         user
// //     }};


// //     return result;
// // };

// // const LoginGun = async (gun, user) => {

// //   async function authenticate(handle, password) {
// //     return  new Promise(function(resolve, reject) {
// //       gun.user().auth(handle, password, async function(ack) {
// //         if(ack.err) {
// //           reject(ack);
// //           return;
// //         }
// //         resolve(ack);
// //       });
// //     });
// //   }
      
// //   var ack = await authenticate(user.email, user.password);

// //   if(ack.err) {
// //       throw ack.err;
// //   }

// //   var result = {
// //       token: gun.user().is.pub,
// //       user
// //   };

// //   return result;
// // };

// // const UserLoggedInGun = async (gun, user) => {

// //   var loggedIn = (gun.user().is) ? true : false;

// //   var result = {
// //         isLoggedIn: loggedIn,
// //   };

// //   return result;
// // };

// // const userGun = async (gun, user) => {
// //   var result = {
// //     user: {
// //       firstname: '',
// //       handle: '',
// //     },
// //   };


// //   if(gun.user().is) {

// //     async function getUserData(pub, propName) {
// //       return new Promise(function(resolve, reject) {
// //           gun.user(pub).get(propName).once(function(p) {
// //               resolve(p);
// //           });
// //         });
// //       }

// //       let profile = await getUserData(gun.user().is.pub, PROFILE);
// //       result.user = profile || result.user;
// //     }

// //   return result;
// // };
