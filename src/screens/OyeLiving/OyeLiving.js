import React, { Component } from 'react';
import { Dimensions, Text ,View} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    createAppContainer,
    createMaterialTopTabNavigator,
    createStackNavigator
} from 'react-navigation';

//Screens
import Expenses from './Expenses';
import BudgetProjection from './BudgetProjection';
import PurchaseOrder from './PurchaseOrder';
import Vendors from './Vendors';
import Invoices from './Invoices';
import Receipts from './Receipts';
import AddExpense from "./Expenses/AddExpense";
import MyFamilyHeader from "../../components/NavigationalHeaders/MyFamilyHeader";
import OyeLivingHeader from "../../components/NavigationalHeaders/OyeLivingHeader";
import base from "../../base";




class OyeLiving extends React.Component {

    render() {
        const OtherScreens = createStackNavigator( {
            addExpenseScreen: {
                screen: AddExpense,
                navigationOptions: {
                    header: props => <OyeLivingHeader isOther={true} isOyeLiving={true} {...props} />
                }
            }, } );
        /*const FeedStack = createStackNavigator({
            addExpenseScreen: {
                screen: AddExpense,
                navigationOptions: {
                    header: props => <MyFamilyHeader isOyeLiving={true} {...props} />
                }
            },
            /!* any other route you want to render under the tab bar *!/
        });
        FeedStack.navigationOptions = ({ navigation }) => {
            let tabBarVisible = true;
            if (navigation.state.index > 0) {
                tabBarVisible = false;
            }

            return {
                tabBarVisible,
            };
        };*/

        const AppTabNavigator = createMaterialTopTabNavigator({
                expenses: {
                screen: Expenses,
                navigationOptions: {
                    tabBarLabel: (
                        <Text
                            style={{ textTransform: 'capitalize', fontSize: hp('2%'),paddingBottom:15 }}
                        >
                            Expenses
                      </Text>
                    )
                },
            },
            budgetProjection: {
                screen: BudgetProjection,
                navigationOptions: {
                    tabBarLabel: (
                        <Text
                            style={{ textTransform: 'capitalize', fontSize: hp('2%'),paddingBottom:15 }}
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
                            style={{ textTransform: 'capitalize', fontSize: hp('2%'),paddingBottom:15 }}
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
                            style={{ textTransform: 'capitalize', fontSize: hp('2%'),paddingBottom:15 }}
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
                            style={{ textTransform: 'capitalize', fontSize: hp('2%') ,paddingBottom:15}}
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
                            style={{ textTransform: 'capitalize', fontSize: hp('2%'),paddingBottom:15 }}
                        >Receipts
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
                        backgroundColor: base.theme.colors.primary,
                        height:3,
                        width:Dimensions.get('window').width /2.9,
                        borderRadius:5,
                    },
                    tabStyle: {
                        width: Dimensions.get('window').width / 2.9,
                        height: hp('6%'),
                        alignItems:'center'
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
