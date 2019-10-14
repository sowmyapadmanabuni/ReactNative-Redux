import React, { Component } from 'react';
import { Dimensions, Text } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    createAppContainer,
    createMaterialTopTabNavigator
} from 'react-navigation';

//Screens
import Expenses from './Expenses';
import BudgetProjection from './BudgetProjection';
import PurchaseOrder from './PurchaseOrder';
import Vendors from './Vendors';
import Invoices from './Invoices';
import Receipts from './Receipts';




class OyeLiving extends React.Component {


    render() {
        const AppTabNavigator = createMaterialTopTabNavigator({
            expenses: {
                screen: Expenses,
                navigationOptions: {
                    tabBarLabel: (
                        <Text
                            style={{ textTransform: 'capitalize', fontSize: hp('2%') }}
                        >
                            Expenses
                      </Text>
                    )
                }
            },
            budgetProjection: {
                screen: BudgetProjection,
                navigationOptions: {
                    tabBarLabel: (
                        <Text
                            style={{ textTransform: 'capitalize', fontSize: hp('2%') }}
                        >
                            Budget Projection
                      </Text>
                    )
                }
            },
            purchaseOrder: {
                screen: PurchaseOrder,
                navigationOptions: {
                    tabBarLabel: (
                        <Text
                            style={{ textTransform: 'capitalize', fontSize: hp('2%') }}
                        >
                            Purchase Order
                      </Text>
                    )
                }
            },
            vendors: {
                screen: Vendors,
                navigationOptions: {
                    tabBarLabel: (
                        <Text
                            style={{ textTransform: 'capitalize', fontSize: hp('2%') }}
                        >
                            Vendors
                      </Text>
                    )
                }
            },
            invoices: {
                screen: Invoices,
                navigationOptions: {
                    tabBarLabel: (
                        <Text
                            style={{ textTransform: 'capitalize', fontSize: hp('2%') }}
                        >
                            Invoices
                      </Text>
                    )
                }
            },
            receipts: {
                screen: Receipts,
                navigationOptions: {
                    tabBarLabel: (
                        <Text
                            style={{ textTransform: 'capitalize', fontSize: hp('2%') }}
                        >
                            Receipts
                      </Text>
                    )
                }
            },
        },
            {
                initialRouteName: 'expenses',
                tabBarPosition: 'top',
                tabBarOptions: {
                    scrollEnabled:true,
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
            })
        const AppContainer = createAppContainer(AppTabNavigator);
        return <AppContainer />;
    }
}


export default OyeLiving;
