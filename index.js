/** @format */
import React, { Component } from 'react';
import { AppRegistry, AsyncStorage, AppState } from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import store from './src/store';
import { name as appName } from './app.json';
import $ from 'logdecor';
import CheckInternet from './src/base/services/CheckInternet';
//firebase.initializeApp(config);
import { StatusBarPlaceHolder } from './src/components/StatusBar';
import NotificationPopUp from './src/base/services/NotificationPopUp';
// import firebase from 'firebase';
// import {firebaseDetails} from './constant';

// let config = {
//     databaseURL: firebaseDetails.databaseURL,
//     projectID: firebaseDetails.projectID
// };
// var firebaseConfig = {
//   apiKey: "AIzaSyAHw662K_LOVs6DW76D1HRu05PxjpOgyQw",
//   authDomain: "oyespace-b7e2d.firebaseapp.com",
//   databaseURL: "https://oyespace-b7e2d.firebaseio.com",
//   projectId: "oyespace-b7e2d",
//   storageBucket: "oyespace-b7e2d.appspot.com",
//   messagingSenderId: "194451632723",
//   appId: "1:194451632723:web:55842a54e3f70d54"
// };

var Fabric = require('react-native-fabric');

var { Crashlytics } = Fabric;

Crashlytics.setString("version", "Production");


class RootApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
    }
  }

  componentDidMount() {
   // AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
   // AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    console.log('App has come to the:',nextAppState);
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
    }else{
      console.log('App has come to the background!');
    }
    this.setState({appState: nextAppState});
  };

  // async componentWillUpdate() {
  //   try{}
  //   let data = await JSON.parse(AsyncStorage.getItem('isSOSUpdatePending'));
  //   console.log('isSOSUpdatePending:', data);
  // }

  render() {
    $.logTitle('O Y E S P A C E - R E S I D E N T');
    return (
      <Provider store={store}>
        <CheckInternet />
        {/* <NotificationPopUp /> */}
        <StatusBarPlaceHolder />
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent(appName, () => RootApp);
