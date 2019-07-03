/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image 
} from "react-native";
// import Header from '../components/common/Header.js'';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

// import { createMaterialTopTabNavigator, createAppContainer } from "react-navigation"

export default class Staff extends Component {
  render() {
    return (
      <View>
        {/* <Header/> */}
      <View style={styles.container}>
        
        <Text>Staff</Text>
        
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {  
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  titleOfScreen: {
    marginTop: hp("1.6%"),
    textAlign: "center",
    fontSize: hp("2%"),
    fontWeight: "bold",
    color: "black",
    marginBottom: hp("1.6%"),
    color:'#ff8c00',
  },
});
