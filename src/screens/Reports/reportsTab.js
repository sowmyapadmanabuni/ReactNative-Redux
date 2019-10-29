import React, { Component } from 'react';
import { Dimensions, Text } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  createAppContainer,
  createMaterialTopTabNavigator
} from 'react-navigation';

//Screens
import BalanceSheet from './BalanceSheet';
import CustomerStatement from './CustomerStatement';
import GeneralLedger from './GeneralLedger';
import Journal from './Journal';
import Patrolling from './Patrolling';
import ProfitAndLoss from './ProfitAndLoss';
import SupplierStatement from './SupplierStatement';
import Visitors from './Visitors';

class reportTab extends React.Component {
  render() {
    const AppTabNavigator = createMaterialTopTabNavigator(
      {
        Visitors: {
          screen: Visitors,
          navigationOptions: {
            tabBarLabel: (
              <Text style={{ textTransform: 'capitalize', fontSize: hp('2%') }}>
                Visitors
              </Text>
            )
          }
        },
        Patrolling: {
          screen: Patrolling,
          navigationOptions: {
            tabBarLabel: (
              <Text style={{ textTransform: 'capitalize', fontSize: hp('2%') }}>
                Patrolling
              </Text>
            )
          }
        },
        Journal: {
          screen: Journal,
          navigationOptions: {
            tabBarLabel: (
              <Text style={{ textTransform: 'capitalize', fontSize: hp('2%') }}>
                Journal
              </Text>
            )
          }
        },
        GeneralLedger: {
          screen: GeneralLedger,
          navigationOptions: {
            tabBarLabel: (
              <Text style={{ textTransform: 'capitalize', fontSize: hp('2%') }}>
                General Ledger
              </Text>
            )
          }
        },
        ProfitAndLoss: {
          screen: ProfitAndLoss,
          navigationOptions: {
            tabBarLabel: (
              <Text style={{ textTransform: 'capitalize', fontSize: hp('2%') }}>
                Profit And Loss
              </Text>
            )
          }
        },
        BalanceSheet: {
          screen: BalanceSheet,
          navigationOptions: {
            tabBarLabel: (
              <Text style={{ textTransform: 'capitalize', fontSize: hp('2%') }}>
                Balance Sheet
              </Text>
            )
          }
        },
        CustomerStatement: {
          screen: CustomerStatement,
          navigationOptions: {
            tabBarLabel: (
              <Text style={{ textTransform: 'capitalize', fontSize: hp('2%') }}>
                Customer Statement
              </Text>
            )
          }
        },
        SupplierStatement: {
          screen: SupplierStatement,
          navigationOptions: {
            tabBarLabel: (
              <Text style={{ textTransform: 'capitalize', fontSize: hp('2%') }}>
                Supplier Statement
              </Text>
            )
          }
        }
      },
      {
        initialRouteName: 'Visitors',
        tabBarPosition: 'top',
        tabBarOptions: {
          scrollEnabled: true,
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
            width: Dimensions.get('window').width / 2.9,
            height: hp('8%')
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

export default reportTab;
