/** @format */
import React, {Component} from 'react';
import {AppRegistry, View,StatusBar,Platform} from 'react-native';
import {Provider} from 'react-redux';
import App from './App';
import store from './src/store';
import {name as appName} from './app.json';
import FlashMessage from "react-native-flash-message";
import $ from 'logdecor';
import CheckInternet from "./src/base/services/CheckInternet"
import base from "./src/base";
// import firebase from 'firebase';
// import {firebaseDetails} from './constant';
//
//
// let config = {
//     databaseURL: firebaseDetails.databaseURL,
//     projectID: firebaseDetails.projectID
// };
//
// firebase.initializeApp(config);
import {StatusBarPlaceHolder}from '../ReactNative-Redux/src/components/StatusBar'



class RootApp extends Component {


    render() {
        $.logTitle("O Y E S P A C E - R E S I D E N T");
        return (
            <Provider store={store}>
                <CheckInternet/>
                <StatusBarPlaceHolder/>
                <App/>
                <FlashMessage position="top" duration={5000}/>
            </Provider>
        )
    }
}

AppRegistry.registerComponent(appName,() => RootApp);
