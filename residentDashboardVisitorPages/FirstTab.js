import React, { Component } from 'react';
import {BackHandler, Dimensions, Text, Platform} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MyGuests from './src/pages/MyGuests.js';
import Deliveries from './src/pages/Deliveries.js';
import Staff from '../src/screens/Resident/Visitors/Staff/Staff';
import SendingMsgToGate from '../my_unit_pages/SendingMsgToGate.js';
import StaffLeaveWithVendor from '../src/screens/Resident/Visitors/Staff/staffLeaveWithVendor.js';

import {
  createAppContainer
} from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import GetStaffReport from '../src/screens/Resident/Visitors/Staff/GetStaffReport';

class FirstTab extends Component {

  render() {
    const AppTabNavigator = createMaterialTopTabNavigator(
      {
        MyGuests: {
          screen: MyGuests,
          navigationOptions: {
            tabBarLabel: (
              <Text
                style={{ textTransform: 'capitalize', fontSize: hp('2.2%'),height: Platform.OS=='ios'?42:hp('8%') }}
              >
                My Guests
              </Text>
            )
          }
        },
        Deliveries: {
          screen: Deliveries,
          navigationOptions: {
            tabBarLabel: (
              <Text
                style={{ textTransform: 'capitalize', fontSize: hp('2.2%'),height: Platform.OS=='ios'?42:hp('8%') }}
              >
                Deliveries
              </Text>
            )
          }
        },
        Staff: {
          screen: Staff,
          navigationOptions: {
            tabBarLabel: (
              <Text
                style={{ textTransform: 'capitalize', fontSize: hp('2.2%'),height: Platform.OS=='ios'?42:hp('8%') }}
              >
                Staff
              </Text>
            ),
            title: 'Staff Tab'
          }
        },
        getStaffReports: {
          screen: GetStaffReport,
          navigationOptions: {
            title: 'Staff Report'
          }
        },
        StaffLeaveWithVendor: {
          screen: StaffLeaveWithVendor,
          navigationOptions: {
            title: 'StaffLeaveWithVendor'
          }
        },
        SendingMsgToGate: {
          screen: SendingMsgToGate,
          navigationOptions: {
            title: 'SendingMsgToGate'
          }
        },
        
      },
      {
        initialRouteName: 'MyGuests',
        tabBarPosition: 'top',
        tabBarOptions: {
          activeTintColor: '#000',
          inactiveTintColor: '#000',
          style: {
            backgroundColor: '#F4F4F4',
            borderTopColor: '#F4F4F4'
          },
          indicatorStyle: {
            backgroundColor: '#ff8c00',
            height: 1,
            marginBottom: 2
          },
          tabStyle: {
            width: Dimensions.get('window').width / 3,
            height: Platform.OS=='ios'?42:hp('8%')
          },
          showIcon: true
        },
        lazy: true,
        backBehavior: 'history'
      }
    );

    const AppContainer = createAppContainer(AppTabNavigator);
    return <AppContainer />;
  }
}

export default FirstTab;
