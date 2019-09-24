import * as firebase from 'firebase';
import strings from '../utils/strings'

firebase.initializeApp(strings.firebaseconfig);
var frtdbservice = firebase.database();
module.exports = frtdbservice;