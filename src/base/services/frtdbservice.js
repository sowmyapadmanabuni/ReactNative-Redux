import * as firebase from 'firebase';
var config = {
  apiKey: "AIzaSyAHw662K_LOVs6DW76D1HRu05PxjpOgyQw",
  authDomain: "oyespace-b7e2d.firebaseapp.com",
  databaseURL: "https://oyespace-b7e2d.firebaseio.com",
  projectId: "oyespace-b7e2d",
  storageBucket: "oyespace-b7e2d.appspot.com",
  messagingSenderId: "194451632723",
  appId: "1:194451632723:web:55842a54e3f70d54"
};
firebase.initializeApp(config);
var frtdbservice = firebase.database();
module.exports = frtdbservice;