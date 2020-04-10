
import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, Button,
  Dimensions, FlatList, ActivityIndicator, TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import MapView from 'react-native-maps';

export default class CheckPointMap extends Component {

  state = {

    userLocation: {
      latitude: 12.8467558,
      longitude: 77.6480553,
      latitudeDelta: 0.00522,
      longitudeDelta: Dimensions.get("window").width / Dimensions.get("window").height * 0.00522
    },

    lat: this.props.navigation.state.params.gps,
    long: 777.6480553
  }

  static navigationOptions = {
    title: 'Map',
    headerStyle: {
      backgroundColor: '#696969',
    },
    headerTitleStyle: {
      color: '#fff',
    }

  };

  componentDidMount = () => {

    str = this.props.navigation.state.params.gps;
    var latlong = str.split(',');

    for (var i = 0; i < latlong.length; i++) {
      // Trim the excess whitespace.
      latlong[i] = latlong[i].replace(/^\s*/, "").replace(/\s*$/, "");
      this.state.lat = latlong[0];
      this.state.long = latlong[1];
      // Add additional code here, such as:
      alert(latlong[i] + 'hii' + parseFloat(this.state.lat) + "hello" + parseFloat(this.state.long));

    }

    console.log('props', latlong + ',' + str);

    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        userLocation: {
          latitude: parseFloat(this.state.lat),
          longitude: parseFloat(this.state.long),
          latitudeDelta: this.state.userLocation.latitudeDelta * 10,
          longitudeDelta: this.state.userLocation.longitudeDelta * 10
        }

      });

      this.map.animateToRegion(this.state.userLocation, 100);
      this.setState({
        lat: parseFloat(this.state.lat), long: parseFloat(this.state.long)

      });
      // this.map.animateToRegion(this.userLocation, 100);
      console.log('map', this.state.lat + ',' + this.state.long + ',' + position.coords.latitude);

    }, err => console.log('suva' + err + 'hihoho'))

  }

  render() {

    console.log('fffff74', this.state.userLocation);
    const { navigate } = this.props.navigation;
    return (

      <View style={styles.container}>
        {/* <Button title="Get Location" onPress={()=> navigate('CheckPointListScreen', {cat:this.state.lat,cat1:this.state.long})}/> */}
        <MapView
          ref={ref => { this.map = ref; }}
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
    height: '100%'
  },

  map: {
    width: '100%',
    height: '100%'
  }
});