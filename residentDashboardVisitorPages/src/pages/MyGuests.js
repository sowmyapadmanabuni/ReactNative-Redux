/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from "react";
import {Dimensions, StyleSheet, Text} from "react-native";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import visited from './Visited.js';
import Invited from './Invited.js';
import {createAppContainer} from "react-navigation"
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
//import Header from '../components/common/Header.js';

export default class MyGuests extends Component {
    render() {
        const AppTabNavigator = createMaterialTopTabNavigator({

            Invited: {
                screen: Invited,
                navigationOptions: {
                    tabBarLabel:({focused, tintColor})=> <Text style={{textTransform: 'capitalize', fontSize: hp('2.2%'), color:tintColor}} focused={focused}>Invitation
                        Details</Text>,
                }
            },
            visited: {
                screen: visited,
                navigationOptions: {
                    tabBarLabel:({focused, tintColor})=> <Text style={{textTransform: 'capitalize', fontSize: hp('2.2%'), color:tintColor}} focused={focused}>visited</Text>,

                    //   tabBarIcon: ({ tintColor }) => (
                    //     <View>
                    //       <Image style={{tintColor}} source={require('./Image/ic_map_48px.png')}></Image>
                    //     </View>),

                },
            },

        }, {
            initialRouteName: 'Invited',
            tabBarPosition: 'top',
            tabBarOptions: {
                activeTintColor: '#38BCDB',
                inactiveTintColor: '#000',
                style: {
                    backgroundColor: '#fff',
                    borderTopWidth: 0.5,
                    borderTopColor: '#fff',
                },
                indicatorStyle: {
                    backgroundColor: '#fff',
                    height: 1,
                    marginBottom: 2,
                },
                tabStyle: {
                    width: Dimensions.get('window').width / 2,
                    height: hp('8%')
                },
                showIcon: true,
                lazy: true,
                backBehavior: "history",

            }

        });

        const AppContainer = createAppContainer(AppTabNavigator);
        return <AppContainer/>
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
        color: '#ff8c00',
    },
});
