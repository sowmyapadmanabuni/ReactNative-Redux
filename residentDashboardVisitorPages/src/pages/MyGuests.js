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
  Image ,
  Dimensions
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import visited from './Visited.js';
import Invited from './Invited.js';
import { createMaterialTopTabNavigator, createAppContainer } from "react-navigation"
import Header from '../components/common/Header.js';

export default class MyGuests extends Component {
  render() {
    const AppTabNavigator = createMaterialTopTabNavigator({
      
      Invited: { screen: Invited,  
        navigationOptions:{  
            tabBarLabel:<Text style={{ textTransform: 'capitalize',fontSize:20,marginBottom:10}}>Invited</Text>, 
        }  
    },  
    visited : { screen: visited,  
      navigationOptions:{  
          tabBarLabel:<Text style={{ textTransform: 'capitalize',fontSize:20,marginBottom:10}}>visited</Text>, 
          
        //   tabBarIcon: ({ tintColor }) => (  
        //     <View>  
        //       <Image style={{tintColor}} source={require('./Image/ic_map_48px.png')}></Image>
        //     </View>),  
            
      }  ,
  },  
          
    }, {
      initialRouteName: 'Invited',
      tabBarPosition:'top',
      tabBarOptions:{
        activeTintColor:'#ff8c00',
        inactiveTintColor:'#000',  
          style:{
          backgroundColor:'#fff',
          borderTopWidth:0.5,
          borderTopColor:'#fff',
          height:hp('10%')
          },
          indicatorStyle: {
              backgroundColor: '#fff',
              height:1,
              marginBottom:2,
          },
          tabStyle: {
              width: Dimensions.get('window').width / 2,
          },
          showIcon:true

    }
      
    });

    const AppContainer = createAppContainer(AppTabNavigator)
    return <AppContainer />
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
    marginBottom: hp("1.6%"),
    color:'#ff8c00',
  },
});
