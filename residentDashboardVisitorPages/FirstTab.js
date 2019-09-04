import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image ,
  Dimensions,BackHandler
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import MyGuests from './src/pages/MyGuests.js';
import Deliveries from './src/pages/Deliveries.js';
import Staff from '../src/screens/Resident/Visitors/Staff/Staff';
import { createMaterialTopTabNavigator, createAppContainer, TabNavigatorConfig } from "react-navigation"
import Header from './src/components/common/Header.js';
import GetStaffReport from "../src/screens/Resident/Visitors/Staff/GetStaffReport";

class FirstTab extends Component {

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log("Back KSCNJND")
      this.props.navigation.goBack(null); // works best when the goBack is async
      return true;
    });
  }

  componentWillUnmount(){
    this.backHandler.remove();
  }
    render() {

    const AppTabNavigator = createMaterialTopTabNavigator({
      MyGuests: {
        screen: MyGuests,
        navigationOptions: {
          tabBarLabel: <Text style={{ textTransform: 'capitalize', fontSize: hp('2.2%') }}>My Guests</Text>,
        }
      },
      Deliveries: {
        screen: Deliveries,
        navigationOptions: {
          tabBarLabel: <Text style={{ textTransform: 'capitalize', fontSize: hp('2.2%') }}>Deliveries</Text>,
        },

      },
      Staff: {
        screen: Staff,
        navigationOptions: {
          tabBarLabel: <Text style={{ textTransform: 'capitalize', fontSize: hp('2.2%') }}>Staff</Text>,
          title: "Staff Tab",
        }
      },
      getStaffReports: {
        screen: GetStaffReport,
        navigationOptions: {
          title: "Staff Report",
        }
      },

    }, {
        initialRouteName: 'MyGuests',
        tabBarPosition: 'top',
        tabBarOptions: {
          activeTintColor: "#000",
          inactiveTintColor: "#000",
          style: {
            backgroundColor: '#F4F4F4',
            borderTopColor: '#F4F4F4',
            
          },
          indicatorStyle: {
            backgroundColor: '#ff8c00',
            height: 1,
            marginBottom: 2
          },
          tabStyle: {
            width: Dimensions.get('window').width / 3,
            height: hp('8%'),  
          },
          showIcon: true
        },
        lazy: true,
        backBehavior: "history",
      });

    const AppContainer = createAppContainer(AppTabNavigator)
    return <AppContainer />
  }
}

export default FirstTab;