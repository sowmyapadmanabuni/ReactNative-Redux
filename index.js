/** @format */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import {AppRegistry} from 'react-native';
import App from './App';
import store from './src/store';
import {name as appName} from './app.json';
import FlashMessage from "react-native-flash-message";

class RootApp extends Component {

    render() {
        return (
            <Provider store={store}>
                <App />
                <FlashMessage position="top" duration={5000} />
            </Provider>
        )
    }
}

AppRegistry.registerComponent(appName, () => RootApp);
