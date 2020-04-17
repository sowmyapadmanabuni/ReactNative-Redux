/** @format */
import 'react-native-get-random-values'
import React, { Component } from 'react';
import { AppRegistry, AsyncStorage, AppState } from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import store from './src/store';
import { name as appName } from './app.json';
import $ from 'logdecor';
import CheckInternet from './src/base/services/CheckInternet';
import { StatusBarPlaceHolder } from './src/components/StatusBar';
import NotificationPopUp from './src/base/services/NotificationPopUp';

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
        
        <StatusBarPlaceHolder />
        <App />
        <NotificationPopUp />
      </Provider>
    );
  }
}

AppRegistry.registerComponent(appName, () => RootApp);
