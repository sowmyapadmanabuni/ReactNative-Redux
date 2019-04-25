/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Platform , TextInput, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

import SplashScreen from './splash_screen_pages/SplashScreen';
import { createStackNavigator ,createSwitchNavigator, createAppContainer } from 'react-navigation';
//import HomeScreen from './pages/HomeScreen';
import RegisterUser from './pages/RegisterUser';
import UpdateUser from './pages/UpdateUser';
import ViewUser from './pages/ViewUser';
import ViewAllUser from './pages/ViewAllUser';
import DeleteUser from './pages/DeleteUser';
//import NavDrawer from './assocition_pages/NavDrawer';

import MobileValid from './registration_pages/MobileValid';
import OTPVerification from './registration_pages/OTPVerification';
import SelectMyRole from './registration_pages/SelectMyRole';
import RegistrationPage from './registration_pages/RegistrationPage';



import ResApp from './dashboard_pages/ResApp';
import associationlist from './assocition_pages/associationlist';
import CreateAssociation from './assocition_pages/CreateAssociation';
import unitlist from './assocition_pages/unitlist';
import CreateOrJoin from './assocition_pages/CreateOrJoin';
import addmembers from './assocition_pages/addmembers';
import CreateUnitsPotrait from './assocition_pages/CreateUnitsPotrait';


const App = createSwitchNavigator({
  SplashScreen: {
    screen: SplashScreen,
    navigationOptions: {
      title: 'OYE SAFE',
       headerStyle: { backgroundColor: '#f05555' },
       headerTintColor: '#ffffff',
    },
  },
  
  AssnListScreen: {
    screen: associationlist,
    navigationOptions: {
      title: 'Association List',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  },
  CreateAssnScreen: {
    screen: CreateAssociation,
    navigationOptions: {
      title: 'Create Association',
      header:null,
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  }, 
  
  Unit: { screen: unitlist ,
    navigationOptions: {
      title: 'Units List',
       headerStyle: { backgroundColor: '#FA9917' },
       headerTintColor: '#ffffff',
    },
  },
  
  CreateUnitsScreen: {
    screen: CreateUnitsPotrait,//CreateUnits,
    navigationOptions: {
      title: 'Create Units',
       headerStyle: { backgroundColor: '#FA9917' },
       headerTintColor: '#ffffff',
    },
  },

  OTPVerificationScreen: {
    screen: OTPVerification,
    navigationOptions: {
      title: 'OTP Verification',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  },
  MobileValid: {
    screen: MobileValid,
    navigationOptions: {
      title: 'Sign In',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#000000',
    },
  },
  RegistrationPageScreen: {
    screen: RegistrationPage,
    navigationOptions: {
      title: 'Registration ',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#000000',
    },
  },
  SelectMyRoleScreen: {
    screen: SelectMyRole,
    navigationOptions: {
      title: 'Syncing ',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#000000',
    },
  },
  View: {
    screen: ViewUser,
    navigationOptions: {
      title: 'View User',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  },
  ViewAll: {
    screen: ViewAllUser,
    navigationOptions: {
      title: 'View All User',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  },
  Update: {
    screen: UpdateUser,
    navigationOptions: {
      title: 'Update User',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  },
  Register: {
    screen: RegisterUser,
    navigationOptions: {
      title: 'Register User',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  },
  Delete: {
    screen: DeleteUser,
    navigationOptions: {
      title: 'Delete User',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  },
 
   ResDashBoard: {
    screen: ResApp,
    navigationOptions: {
      title: 'ResidentDashBoard Drawer ',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
      header:null
    },
  }, 
 /*  ViewmembersScreen: {
    screen: ViewmembersList,
    navigationOptions: {
      title: 'View Members ',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  }, 
  ViewVisitorsScreen: {
    screen: ViewVisitorsList,
    navigationOptions: {
      title: 'View Visitors ',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  }, 
  ViewIncidentsScreen: {
    screen: ViewIncidentList,
    navigationOptions: {
      title: 'View Incidents ',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  },  
  
    Unit : { screen : unitlist },

  */
  CreateOrJoinScreen: {
    screen: CreateOrJoin,
    navigationOptions: {
      title: 'Association',
      // headerStyle: { backgroundColor: '#f05555' },
      // headerTintColor: '#ffffff',
    },
  }, 
  addmembersScreen: {
    screen: addmembers,
    navigationOptions: {
      title: 'Association',
      // headerStyle: { backgroundColor: '#f05555' },
      // headerTintColor: '#ffffff',
    },
  }, 
});
//export default App;
const App2 = createAppContainer(App);
export default App2;
