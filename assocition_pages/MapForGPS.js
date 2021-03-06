/**
* Sample React Native App
* https://github.com/facebook/react-native
*
* @format
* @flow
*/

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View,  Button,Dimensions,FlatList, ActivityIndicator,TouchableOpacity,ToastAndroid } from 'react-native';
import MapView from 'react-native-maps';

export default class MapForGPS extends Component {

  state={
    userLocation:{
      latitude: 12.8467558, 
      longitude: 77.6480553,
      latitudeDelta: 0.0622,
      longitudeDelta: 0.0421,

    },
    lat:12.8467558,
    long:777.6480553

  }
  static navigationOptions = {
    title: 'Map',
    headerStyle:{
        backgroundColor:'#FA9917',
    },
    headerTitleStyle:{
        color:'#fff',
    }
  };
  
  componentDidMount=()=>{
   
    console.log('MapForGPS ','button')
    
    navigator.geolocation.getCurrentPosition(position=>{
      this.setState({
        userLocation:{
          latitude:position.coords.latitude,
          longitude:position.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }
    
      });
      this.setState({lat:position.coords.latitude,long:position.coords.longitude
      });

      console.log('map',this.state.lat+','+this.state.long+','+position.coords.latitude);
   
    },err=>console.log( 'suva'+err+ 'hihoho'))
   
     }

render() {
    
        console.log('MapForGPS ',this.state.userLocation);
        const { navigate } = this.props.navigation;
       return (
         <View style={styles.container}>
         <Button title="Get Location" onPress={()=> navigate('CreateCheckPointScreen', {cat:this.state.lat,cat1:this.state.long})}/> 
          <MapView 
            initialRegion={{
                latitude: 12.972442,  longitude: 77.580643,
                latitudeDelta: 0.0922, longitudeDelta: 0.0421,
              }}
              region={this.state.userLocation}
              style={styles.map}>   
              <MapView.Marker coordinate={this.state.userLocation}/>
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
  mapContainer:{
    width:'100%',
    height:200
},
map:{
    width:'100%',
    height:300
}
});
