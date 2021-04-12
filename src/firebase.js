import firebase from "firebase";

const config = {
  apiKey: "AIzaSyDHA0Lm-ANBdBAPJgl3g9mTYAN5llpoKCU",
  authDomain: "survey-2021.firebaseapp.com",
  projectId: "survey-2021",
  storageBucket: "survey-2021.appspot.com",
  messagingSenderId: "291454197131",
  appId: "1:291454197131:web:95028f7e56b425da82238e",
  measurementId: "G-Z3NY1W7ZKX",
};

firebase.initializeApp(config);

export default firebase;

export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const store = firebase.firestore();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
