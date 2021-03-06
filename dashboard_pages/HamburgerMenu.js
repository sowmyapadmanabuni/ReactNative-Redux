/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createSwitchNavigator,createDrawerNavigator,createAppContainer } from 'react-navigation';
//import HomeScreen from './pages/HomeScreen';
//import NavDrawer2 from '../pages/NavDrawer2';

//import ResidentDashBoard from '../dashboard_pages/ResidentDashBoard';
import MainScreen from '../dashboard_pages/MainScreen';
import SideMenu from '../dashboard_pages/SideMenu'

//import DrawerNavigator from '../dashboard_pages/DrawerNavigator';
//import NavDrawer from './assocition_pages/NavDrawer';

 import associationlist from '../assocition_pages/associationlist';
 import CreateAssociation from '../assocition_pages/CreateAssociation';
 //import EditAssociation from '../assocition_pages/EditAssociation';
 import unitlist from '../assocition_pages/unitlist';

 import guardlist from '../assocition_pages/guardlist';
 import ViewmembersList from '../assocition_pages/ViewmembersList';
 import EachServiceProvider from  '../assocition_pages/IndivisualServiceProviderReport';
 import PatrollingList from '../assocition_pages/PatrollingList';

 import SecurityDailyReport from '../assocition_pages/SecurityDailyReport';
 import AllServiceProvider from '../assocition_pages/ServiceProvideReport';
 import CreateUnitsPotrait from '../assocition_pages/CreateUnitsPotrait';
import CreateWorker from '../assocition_pages/CreateWorker';
import EditWorker from '../assocition_pages/EditWorker'; 

 import EditCheckPoint from '../assocition_pages/EditCheckPoint';
 import Subscription from '../assocition_pages/Subscription';
// import EditCheckPointMap from '../assocition_pages/EditCheckPointMap';
// import CreateCheckPointMap from '../assocition_pages/CheckPointMap';
// import CreateCheckPointListMap from '../assocition_pages/CheckPointListMap';
 import CreateCheckPoint from '../assocition_pages/CreateCheckPoint';

// import MapForGPS from '../assocition_pages/MapForGPS';
// import EditUnitsPotrait from '../assocition_pages/EditUnitsPotrait';
 import CheckPointList from '../assocition_pages/CheckPointList';
// import CreateOrJoin from '../assocition_pages/CreateOrJoin';
// import CreateAssnMember from '../assocition_pages/CreateAssnMember';

import ViewIncidentList from '../resident_pages/ViewIncidentList';
import ViewFamilyMembersList from '../resident_pages/ViewFamilyMembersList';
 import AddVehicles from '../resident_pages/AddVehicles';
 import QRCodeGeneration from '../resident_pages/QRCodeGeneration';
 import AdminSettings from '../resident_pages/AdminSettings';
 import AddFamilyMember from '../resident_pages/AddFamilyMember';
 import AssignTask from '../resident_pages/AssignTask';
 import HamburgerMenu from '../dashboard_pages/HamburgerMenu'

 import ViewVisitorsList from '../my_unit_pages/ViewVisitorsList';
 //import UpdateDetails from '../my_unit_pages/UpdateDetails';
 import RaiseIncident from '../my_unit_pages/RaiseIncident';
 import InviteGuestScreen from '../my_unit_pages/InviteGuest'; 
 import InvitedGuestList from '../my_unit_pages/InvitedGuestList';

 import EditFamilyMember from '../my_unit_pages/EditFamilyMember';
 import EditProfile from '../my_unit_pages/EditProfile';
 import AddRegularVisitor from '../my_unit_pages/AddRegularVisitor';
 import ViewRegularVisitor from '../my_unit_pages/ViewRegularVisitor';
 import EditRegularVisitor from '../my_unit_pages/EditRegularVisitor';

import WorkerShiftDetails from '../workers_pages/WorkerShiftDetails';
import CreateWorkerShift from '../workers_pages/CreateWorkerShift';
import Communications from 'react-native-communications';
import VersionNumber from 'react-native-version-number';

// import CountryCodePicker from '../registration_pages/CountryCodePicker';
// import NotificationScreen from '../dashboard_pages/NotificationScreen';
// import NotificationScreen2 from '../dashboard_pages/NotificationScreen2';

 import SelectMyRole from '../registration_pages/SelectMyRole';

 import ViewAllVisitorsList from '../assocition_pages/ViewAllVisitorsList';

// import BottomNavigation from '../my_unit_pages/BottomNavigation';
// import UploadImage from '../my_unit_pages/UploadImage';

console.disableYellowBox = true;
import ShareQRCode from '../my_unit_pages/ShareQRCode';


/* 
import ViewAllVisitorsList from '../assocition_pages/ViewAllVisitorsList';

import ViewmembersList from '../assocition_pages/ViewmembersList';
import ViewVisitorsList from '../my_unit_pages/ViewVisitorsList';
import UpdateDetails from '../my_unit_pages/UpdateDetails';

import PatrollingList from '../assocition_pages/PatrollingList';

import ResolveIncident from '../resident_pages/ResolveIncident';


import ShareQRCode from '../my_unit_pages/ShareQRCode';

import CreateOrJoin from '../assocition_pages/CreateOrJoin';
import CreateAssnMember from '../assocition_pages/CreateAssnMember';
import ResNavDrawerMenu from '../dashboard_pages/ResNavDrawerMenu';
import MapForGPS from '../assocition_pages/MapForGPS';
import CreateUnits from '../assocition_pages/CreateUnits';
import EditUnitsPotrait from '../assocition_pages/EditUnitsPotrait';
import NotificationScreen from '../dashboard_pages/NotificationScreen';
import NotificationScreen2 from '../dashboard_pages/NotificationScreen2';

import CreateWorker from '../assocition_pages/CreateWorker';
import EditWorker from '../assocition_pages/EditWorker';
import SelectMyRole from '../registration_pages/SelectMyRole';

import BottomNavigation from '../my_unit_pages/BottomNavigation';


import UploadImage from '../my_unit_pages/UploadImage';

import EditCheckPointMap from '../assocition_pages/EditCheckPointMap';
import CreateCheckPointMap from '../assocition_pages/CheckPointMap';
import CreateCheckPointListMap from '../assocition_pages/CheckPointListMap';

import Securityattendance from '../assocition_pages/Securityattendance';
import AllServiceProvider from '../assocition_pages/ServiceProvideReport';


import
EachServiceProvider from
  '../assocition_pages/IndivisualServiceProviderReport'; */

console.disableYellowBox = true;

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const ResApp = createDrawerNavigator({
  
    ResDashBoard:  {
        screen: MainScreen,
        navigationOptions: {
          title: 'Dashboard',
        },
      },

  EditProfileScreen: {
    screen: EditProfile,
    navigationOptions: {
      title: 'My Profile',
       //headerStyle: { backgroundColor: '#FA9917' },
      // headerTintColor: '#ffffff',
    },
  },
  SideMenu:  {
    screen: SideMenu,
    navigationOptions: {
      title: 'Menu',
      header: null,
      //title: 'ResidentDashBoard Drawer ',
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff',
    },
  },
  SubscriptionScreen:  {
    screen: Subscription,
    navigationOptions: {
      title: 'Subscription',
      header: null,
      //title: 'ResidentDashBoard Drawer ',
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff',
    },
  },
  ViewVisitorsScreen: {
    screen: ViewVisitorsList,
    navigationOptions: {
    title: 'My Visitors',
    },
    },
  AssnListScreen: {
    screen: associationlist,
    navigationOptions: {
      title: 'Association List',
      header:null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff',
    },
  },


  CreateAssnScreen: {
    screen: CreateAssociation,
    navigationOptions: {
      title: 'Create Association',
      header:null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff',
    },
  },
  InviteGuestScreen: {
    screen: InviteGuestScreen,
    navigationOptions: {
      title: 'Create Association',
      header:null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff',
    },
  },

RaiseIncidentScreen: {
  screen: RaiseIncident,
  navigationOptions: {
    title: 'Raise Incidents ',
    header: null,
   headerStyle: { backgroundColor: '#FA9917' },
   headerTintColor: '#ffffff',
  },
},

InvitedGuestListScreen: {
  screen: InvitedGuestList,
  navigationOptions: {
    title: 'My Guest ',
    header: null,
   headerStyle: { backgroundColor: '#FA9917' },
    headerTintColor: '#ffffff',
  },
},
ViewRegularVisitorScreen: {
  screen: ViewRegularVisitor,
  navigationOptions: {
    title: 'View Regular Visitor',
    header:null,
    headerStyle: { backgroundColor: '#FA9917' },
    // headerTintColor: '#ffffff',
  },
},
ShareQRCode:  {
  screen: ShareQRCode,
  navigationOptions: {
    title: 'Menu',
    header: null,
    //title: 'ResidentDashBoard Drawer ',
    headerStyle: { backgroundColor: '#FA9917' },
    headerTintColor: '#ffffff',
  },
},

  ViewAllVisitorsScreen: {
  screen: ViewAllVisitorsList,
  navigationOptions: {
  title: 'View All Visitors ',
  header:null,
  headerStyle: { backgroundColor: '#FA9917' },
  headerTintColor: '#ffffff',
  },
  },

ViewIncidentsScreen: {
  screen: ViewIncidentList,
  navigationOptions: {
    title: 'View Incidents ',
    header:null,
    headerStyle: { backgroundColor: '#FA9917' },
    headerTintColor: '#ffffff',
  },
},
Unit: { screen: unitlist ,
  navigationOptions: {
    title: 'Unit List',
    header:null,
     headerStyle: { backgroundColor: '#FA9917' },
     headerTintColor: '#ffffff',
  },},
  CheckPointListScreen: {
    screen: CheckPointList,
    navigationOptions: {
      title: 'View Check Point ',
      header:null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff',
    },
  },

  ViewFamilyMembersListScreen: {
    screen: ViewFamilyMembersList,
    navigationOptions: {
      title: 'Family Members List ',
      header:null,
       headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff',
    },
  },
  AddVehiclesScreen: {
    screen: AddVehicles,
    navigationOptions: {
      title: 'Add Vehicles',
      header:null,
      // headerStyle: { backgroundColor: '#FA9917' },
      // headerTintColor: '#ffffff',
    },
  },

  AdminSettingsScreen: {
    screen: AdminSettings,
    navigationOptions: {
      title: 'Admin Settings ',
      header:null,
      headerStyle: { backgroundColor: '#FA9917' },
       headerTintColor: '#ffffff',
    },
  },

  AddFamilyMemberScreen: {
    screen: AddFamilyMember,
    navigationOptions: {
      title: 'Create Family Member',
      header:null,
       headerStyle: { backgroundColor: '#FA9917' },
       headerTintColor: '#ffffff',
    },
  },

  AssignTask: {
    screen: AssignTask,
    navigationOptions: {
      title: 'Assign Task ',
      header:null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff',
    },
  },
  SecurityDailyReportScreen: {
    screen:     SecurityDailyReport,
    navigationOptions: {
      title:     'Security Attendance Report',
      header:null,
      headerStyle: {    backgroundColor: '#FA9917'    },
      headerTintColor:       '#ffffff',
    },
  },

 EachServiceProviderReportScreen: {

   screen: 
  EachServiceProvider,
  
   navigationOptions: {
  
   title: 
   'Service provider Attendance Report',
  
   headerStyle: { 
   backgroundColor: '#f05555' },
  
   headerTintColor: 
   '#ffffff',
  
  },
  
  },
ServiceProviderReportScreen: {

screen: 
AllServiceProvider,

navigationOptions: {

title: 
'Service provider Attendance Report',

headerStyle: { 
backgroundColor: '#f05555' },

headerTintColor: 
'#ffffff',

},

},
WorkerShiftDetailsScreen:{
    
  screen: WorkerShiftDetails,
  navigationOptions: {
    title: 'Worker Shift Details',
    headerStyle: { backgroundColor: '#FA9917' },
    headerTintColor: '#ffffff',
  },
},
CreateWorkerShiftScreen:{
  screen: CreateWorkerShift,
  navigationOptions: {
    title: 'Create Worker Shift',
    headerStyle: { backgroundColor: '#FA9917' },
    headerTintColor: '#ffffff',
  },
},

EditCheckPointScreen: {
    screen: EditCheckPoint,
   navigationOptions: {
     title: 'Edit Check Point',
    headerStyle: { backgroundColor: '#FA9917' },
     headerTintColor: '#ffffff',
 },
},
  
  PatrollingListScreen: {
    screen: PatrollingList,
    navigationOptions: {
      title: 'Patrolling List',
      header:null,
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  },

  CreateCheckPointScreen: {
    screen: CreateCheckPoint,
    navigationOptions: {
      title: 'Create Check Point ',
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff',
    },
  },

   
  QRCodeGenScreen: {
    screen: QRCodeGeneration,
    navigationOptions: {
      title: 'QR Code',
      // headerStyle: { backgroundColor: '#FA9917' },
      // headerTintColor: '#ffffff',
    },
  },

  CreateUnitsScreen: {
    screen: CreateUnitsPotrait,//CreateUnits,
    navigationOptions: {
      title: 'Create Units',
      header:null,
       headerStyle: { backgroundColor: '#FA9917' },
       headerTintColor: '#ffffff',
    },
  },
  CreateWorkerScreen: {
    screen: CreateWorker,
    navigationOptions: {
      title: 'Create Worker',
      // headerStyle: { backgroundColor: '#f05555' },
      // headerTintColor: '#ffffff',
    },
  },
  EditWorkerScreen: {
    screen: EditWorker,
    navigationOptions: {
      title: 'Edit Worker',
      // headerStyle: { backgroundColor: '#f05555' },
      // headerTintColor: '#ffffff',
    },
  },

  
  EditFamilyMemberScreen: {
    screen: EditFamilyMember,
    navigationOptions: {
      title: 'Edit Family Members ',
      // headerStyle: { backgroundColor: '#FA9917' },
      // headerTintColor: '#ffffff',
    },
  },
  

  
  AddRegularVisitorScreen: {
    screen: AddRegularVisitor,
    navigationOptions: {
      title: 'Add Regular Visitor',
      // headerStyle: { backgroundColor: '#FA9917' },
      // headerTintColor: '#ffffff',
    },
  },
  EditRegularVisitorScreen: {
    screen: EditRegularVisitor,
    navigationOptions: {
      title: 'Edit Regular Visitor',
      // headerStyle: { backgroundColor: '#FA9917' },
      // headerTintColor: '#ffffff',
    },
  },
  GuardListScreen: {
    screen: guardlist,
    navigationOptions: {
      title: 'Guard List',
      header:null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff',
    },
  },
  ViewmembersScreen: {
    screen: ViewmembersList,
    navigationOptions: {
      title: 'View Members ',
      header:null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff',
    },
  },



});



export default createAppContainer(ResApp);


