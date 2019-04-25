/**
* Sample React Native App
* https://github.com/facebook/react-native
*
* @format
* @flow
*/

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Dimensions, FlatList, ActivityIndicator, TouchableOpacity, ToastAndroid } from 'react-native';
import MapView from 'react-native-maps';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class EditCheckPoint extends Component {

  state = {
    userLocation: {
      latitude: 12.8467558,
      longitude: 77.6480553,
      latitudeDelta: 0.0622,
      longitudeDelta: 0.0421,

    },
    lat: 12.8467558,
    long: 777.6480553

  }
  static navigationOptions = {
    title: 'Map',
    headerStyle: {
      backgroundColor: '#FA9917',
    },
    headerTitleStyle: {
      color: '#fff',
    }
  };

  componentDidMount = () => {

    console.log('EditCheckPointMap componentDidMount', 'button')

    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }

      });
      this.setState({
        lat: position.coords.latitude, long: position.coords.longitude
      });

      console.log('EditCheckPointMap map', this.state.lat + ',' + this.state.long + ',' + position.coords.latitude);

    }, err => console.log('EditCheckPointMap suva' + err + 'hihoho'))

  }

  render() {

    console.log('EditCheckPointMap fffff74', this.state.userLocation);
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Button title="Get Location" onPress={() => navigate('EditCheckPointScreen', { cat: this.state.lat, cat1: this.state.long })} />

        <MapView
          region={this.state.userLocation}
          style={styles.map}>
          <MapView.Marker coordinate={this.state.userLocation} />
        </MapView>
      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  mapContainer: {
    width: '100%',
    height: 200
  },
  map: {
    width: '100%',
    height: 300
  }
});