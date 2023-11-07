/* eslint-disable import/prefer-default-export */
import firebase from "firebase/app";
import "firebase/messaging";
let messaging = null;
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyA3q7GkPzd_r-BcybdqQqk1Mvtp7rrGRt8",
  authDomain: "ikarus-nest-demo.firebaseapp.com",
  projectId: "ikarus-nest-demo",
  storageBucket: "ikarus-nest-demo.appspot.com",
  messagingSenderId: "466161040020",
  appId: "1:466161040020:web:f474195957f0b662185281",
  // measurementId: "G-ZHTH5477XZ"
};

// export const firebaseInit = () => {
//   console.log("in initialize");
//   firebase.initializeApp(firebaseConfig);
//   messaging = firebase.messaging();
// };

// if(firebase!==undefined){
if (
  typeof window !== "undefined" &&
  typeof window !== "undefined" &&
  !firebase.apps.length
) {
  console.log("in initialize");
  try {
    firebase.initializeApp(firebaseConfig);
    messaging = firebase.messaging();
  } catch (e) {
    console.log("firebase_error: ", e);
  }
}
// } else {
//   firebase.app(); // if already initialized, use that one
// }
// }

export const getToken = async (setTokenFound) => {
  let currentToken = "";
  try {
    currentToken = await messaging?.getToken({
      vapidKey:
        "BLYo5bAZbUKfUPT7Yu4JH0EGc24LTXjpg4wINzqgHBar_Do7XGgfqjLkiOO_WbX6gI20ZeFiKAI_aEa_JHdl2bk",
    });
    if (currentToken) {
      setTokenFound(true);
    } else {
      setTokenFound(false);
    }
  } catch (error) {
    console.log("An error occurred while retrieving token.", error);
  }
  return currentToken;
};

export const onMessageListener = () =>
//  try{
  new Promise((resolve) => {
    messaging?.onMessage((payload) => {
      resolve(payload);
    });
  }
  
  );
//  }
//  catch(e){
 
//  }

 
