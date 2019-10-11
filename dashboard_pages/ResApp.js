/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Platform } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import associationlist from '../assocition_pages/associationlist';
import WholeAssociationList from '../assocition_pages/WholeAssociationList';

import CreateAssociation from '../assocition_pages/CreateAssociation';
import unitlist from '../assocition_pages/unitlist';

import ViewmembersList from '../assocition_pages/ViewmembersList';

import CreateUnitsPotrait from '../assocition_pages/CreateUnits';

import EditCheckPoint from '../assocition_pages/EditCheckPoint';
import CreateCheckPoint from '../assocition_pages/CreateCheckPoint';

import ViewAlllVisitorsPage from '../my_unit_pages/ViewAlllVisitorsPage';

import EditFamilyMember from '../my_unit_pages/EditFamilyMember';

import MyProfile from '../my_unit_pages/MyProfile.js';
import EditProfile from '../my_unit_pages/EditProfile';
import BlockDetail from '../assocition_pages/BlockDetails';
import CreateBlock from '../assocition_pages/CreateBlock';
import CreateOrJoin from '../assocition_pages/CreateOrJoin';
import EditBlock from '../assocition_pages/EditBlock.js';
import RegisterUser from '../pages/RegisterUser';
import RegisterToUnit from '../assocition_pages/register';

import ViewAllVisitorsList from '../assocition_pages/ViewAllVisitorsList';
import NotificationScreen from '../src/screens/NotificationScreen/NotificationScreen';
import NotificationDetailScreen from '../src/screens/NotificationScreen/NotificationDetailScreen';
import MyVehicleListScreen from '../resident_pages/MyVehicleListScreen.js';
import AddVehicles from '../resident_pages/AddVehicles';
import EditVehicles from '../resident_pages/EditVehicles';

import adminfunction from '../dashboard_pages/adminfunction.js';
import CreatePatrollingShift from '../assocition_pages/CreatePatrollingShift.js';
import Blockwise from '../assocition_pages/BlockwiseUnits';
import AddUnit from '../assocition_pages/AddUnit.js';
import EditUnit from '../assocition_pages/EditUnit.js';
import SchedulePatrolling from '../src/screens/Patrolling/PatrolSchedule';
import PatrolSchedule from '../src/screens/Patrolling/PatrolSchedule';
import PatrollingCommonHeader from '../src/components/NavigationalHeaders/PatrollingCommonHeader';
import PatrollingCheckPoints from '../src/screens/Patrolling/PatrollingCheckPoints';
import AddAndEditCheckPoints from '../src/screens/Patrolling/AddAndEditCheckPoints';
import SchedulePatrol from '../src/screens/Patrolling/SchedulePatrol';
import CreateSOS from '../src/screens/SOS/CreateSOS';
import QRScreen from '../src/screens/Patrolling/QRScreen';
import PatrollingReport from '../src/screens/Patrolling/PatrollingReport';
import ReportScreen from '../src/screens/Patrolling/ReportScreen';
import MyFamilyList from '../src/screens/Resident/MyFamilyScreen/MyFamilyListOne/MyFamilyList';
import MyFamily from '../src/screens/Resident/MyFamilyScreen/MyFamilyAdd/MyFamily';
import MyFamilyEdit from '../src/screens/Resident/MyFamilyScreen/MyFamilyEditOne/MyFamilyEdit';

import Dashboard from '../src/screens/Resident/Dashboard/Dashboard';
import DashBoardHeader from '../src/components/dashBoardHeader/DashBoardHeader';
import FirstTab from '../residentDashboardVisitorPages/FirstTab';
import MyFamilyHeader from '../src/components/NavigationalHeaders/MyFamilyHeader';
import OyeLivingHeader from '../src/components/NavigationalHeaders/OyeLivingHeader'

import City from '../assocition_pages/City.js';
import SubscriptionManagement from '../src/screens/Subscription/SubscriptionManagement';
import PatrolShuffling from '../src/screens/Patrolling/PatrolShuffling';
import OyeLiving from '../src/screens/OyeLiving/OyeLiving';

import Announcement from '../assocition_pages/announcement.js';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu'
});

const NotificationStack = createStackNavigator({
  NotificationScreen: {
    screen: NotificationScreen,
    navigationOptions: {
      title: 'Notifications',
      header: null
    }
  },
  NotificationDetailScreen: {
    screen: NotificationDetailScreen,
    navigationOptions: {
      title: 'Notification Details',
      header: null
    }
  }
});

const ResApp = createStackNavigator({
  ResDashBoard: {
    screen: Dashboard,
    navigationOptions: {
      title: 'Dashboard',
      header: props => <DashBoardHeader {...props} />
    }
  },
  firstTab: {
    screen: FirstTab,
    navigationOptions: ({ navigation }) => ({
      title: 'Tabs Visitors',
      header: props => <MyFamilyHeader isVisitors={true} {...props} />
    })
  },
  oyeLiving: {
    screen: OyeLiving,
    navigationOptions: ({ navigation }) => ({
      title: 'Tabs Visitors',
      header: props => <OyeLivingHeader isVisitors={true} {...props} />
    })
  },
  MyProfileScreen: {
    screen: MyProfile,
    navigationOptions: {
      title: 'My Profile',
      header: null
    }
  },
  EditProfileScreen: {
    screen: EditProfile,
    navigationOptions: {
      title: 'Edit Profile',
      header: null
      //headerStyle: { backgroundColor: '#FA9917' },
      // headerTintColor: '#ffffff',
    }
  },

  NotificationStack: {
    screen: NotificationStack,
    navigationOptions: {
      header: null
      // title: 'Notifications',
      //  headerStyle: { backgroundColor: '#f05555' },
      //  headerTintColor: '#ffffff',
    }
  },

  MyFamilyList: {
    screen: MyFamilyList,
    navigationOptions: {
      title: 'My Family List'
      // headerStyle: { backgroundColor: "#f05555"},
      // headerTintColor:  "#ffffff"
    }
  },
  MyFamily: {
    screen: MyFamily,
    navigationOptions: {
      header: null
      //header:props => <MyFamilyHeader  {...props}/>
    }
  },
  MyFamilyEdit: {
    screen: MyFamilyEdit,
    navigationOptions: {
      title: 'My Family Edit',
      header: null
      // headerStyle: { backgroundColor: "#f05555"},
      // headerTintColor:  "#ffffff"
    }
  },

  ViewAlllVisitorsPage: {
    screen: ViewAlllVisitorsPage,
    navigationOptions: {
      title: 'My Visitors',
      header: null
    }
  },
  AssnListScreen: {
    screen: associationlist,
    navigationOptions: {
      title: 'Association List',
      header: null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff'
    }
  },
  //WholeAssociationList
  WholeAssociationList: {
    screen: WholeAssociationList,
    navigationOptions: {
      title: 'Association List',
      header: null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff'
    }
  },
  City: {
    screen: City,
    navigationOptions: {
      title: 'City',
      header: null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff'
    }
  },

  CreateOrJoinScreen: {
    screen: CreateOrJoin,
    navigationOptions: {
      title: 'Association'
      // headerStyle: { backgroundColor: '#FA9917' },
      // headerTintColor: '#ffffff',
    }
  },

  CreateAssnScreen: {
    screen: CreateAssociation,
    navigationOptions: {
      title: 'Create Association',
      header: null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff'
    }
  },

  BlockDetailScreen: {
    screen: BlockDetail,
    navigationOptions: {
      title: 'Block Detail',
      header: null
    }
  },
  CreateBlockScreen: {
    screen: CreateBlock,
    navigationOptions: {
      title: 'Create Block',
      header: null
    }
  },

  AdminFunction: {
    screen: adminfunction,
    navigationOptions: {
      title: 'SOS',
      header: null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff'
    }
  },

  CreatePatrollingShift: {
    screen: CreatePatrollingShift,
    navigationOptions: {
      title: 'Patrolling Shift Schedule',
      header: null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff'
    }
  },
  Register: {
    screen: RegisterUser,
    navigationOptions: {
      title: 'Register User',
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff'
    }
  },

  RegisterUser: {
    screen: RegisterToUnit,
    header: null,
    navigationOptions: {
      title: 'Register User',
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff',
      header: null
    }
  },

  ViewAllVisitorsScreen: {
    screen: ViewAllVisitorsList,
    navigationOptions: {
      title: 'View All Visitors ',
      header: null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff'
    }
  },

  Unit: {
    screen: unitlist,
    navigationOptions: {
      title: 'Unit List',
      header: null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff'
    }
  },

  MyVehicleListScreen: {
    screen: MyVehicleListScreen,
    navigationOptions: {
      title: 'My Vehicle',
      header: null
      // headerStyle: { backgroundColor: '#FA9917' },
      // headerTintColor: '#ffffff',
    }
  },

  AddVehiclesScreen: {
    screen: AddVehicles,
    navigationOptions: {
      title: 'Add Vehicles',
      header: null
      // headerStyle: { backgroundColor: '#FA9917' },
      // headerTintColor: '#ffffff',
    }
  },
  EditVehiclesScreen: {
    screen: EditVehicles,
    navigationOptions: {
      title: 'Edit Vehicle',
      header: null
      // headerStyle: { backgroundColor: '#FA9917' },
      // headerTintColor: '#ffffff',
    }
  },

  EditBlockScreen: {
    screen: EditBlock,
    navigationOptions: {
      title: 'Add Vehicles',
      header: null
      // headerStyle: { backgroundColor: '#FA9917' },
      // headerTintColor: '#ffffff',
    }
  },

  BlockWiseUnitListScreen: {
    screen: Blockwise,
    navigationOptions: {
      title: 'Association List',
      header: null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff'
    }
  },
  AddUnit: {
    screen: AddUnit,
    navigationOptions: {
      title: 'Edit Unit',
      header: null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff'
    }
  },
  EditUnit: {
    screen: EditUnit,
    navigationOptions: {
      title: 'Edit Unit',
      header: null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff'
    }
  },

  EditCheckPointScreen: {
    screen: EditCheckPoint,
    navigationOptions: {
      title: 'Edit Check Point',
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff',
      header: null
    }
  },

  CreateCheckPointScreen: {
    screen: CreateCheckPoint,
    navigationOptions: {
      title: 'Create Check Point ',
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff',
      header: null
    }
  },

  CreateUnitsScreen: {
    screen: CreateUnitsPotrait, //CreateUnits,
    navigationOptions: {
      title: 'Create Units',
      header: null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff'
    }
  },

  EditFamilyMemberScreen: {
    screen: EditFamilyMember,
    navigationOptions: {
      title: 'Edit Family Members ',
      header: null
      // headerStyle: { backgroundColor: '#FA9917' },
      // headerTintColor: '#ffffff',
    }
  },

  ViewmembersScreen: {
    screen: ViewmembersList,
    navigationOptions: {
      title: 'View Members ',
      header: null,
      headerStyle: { backgroundColor: '#FA9917' },
      headerTintColor: '#ffffff'
    }
  },
  schedulePatrolling: {
    screen: SchedulePatrolling,
    navigationOptions: {
      title: 'Schedule Patrolling',
      header: props => (
        <PatrollingCommonHeader
          isReportVisible={true}
          isHidden={false}
          isReshuffling={false}
          {...props}
        />
      )
    }
  },
  patrollingCheckPoint: {
    screen: PatrollingCheckPoints,
    navigationOptions: {
      title: 'Patrolling Check Points',
      header: props => (
        <PatrollingCommonHeader
          isReportVisible={false}
          isHidden={false}
          isReshuffling={true}
          {...props}
        />
      )
    }
  },
  reshufflePatrol: {
    screen: PatrolShuffling,
    navigationOptions: {
      title: 'Re-Shuffle Check Points',
      header: props => (
        <PatrollingCommonHeader
          isReportVisible={false}
          isHidden={false}
          isReshuffling={false}
          {...props}
        />
      )
    }
  },
  addCheckPoint: {
    screen: AddAndEditCheckPoints,
    navigationOptions: {
      title: 'Add Checkpoints',
      header: props => (
        <PatrollingCommonHeader
          isReportVisible={false}
          isShareVisible={false}
          isHidden={true}
          isReshuffling={false}
          {...props}
        />
      )
    }
  },
  schPatrolling: {
    screen: SchedulePatrol,
    navigationOptions: {
      header: props => (
        <PatrollingCommonHeader
          isReportVisible={false}
          isShareVisible={false}
          isHidden={true}
          isReshuffling={false}
          {...props}
        />
      )
    }
  },
  qrScreen: {
    screen: QRScreen,
    navigationOptions: {
      header: props => (
        <PatrollingCommonHeader
          isReportVisible={true}
          isShareVisible={true}
          isHidden={false}
          isReshuffling={false}
          {...props}
        />
      )
    }
  },
  patrollingReport: {
    screen: PatrollingReport,
    navigationOptions: {
      header: props => (
        <PatrollingCommonHeader
          isReportVisible={false}
          isShareVisible={false}
          isHidden={true}
          isReshuffling={false}
          {...props}
        />
      )
    }
  },
  reportScreen: {
    screen: ReportScreen,
    navigationOptions: {
      header: props => (
        <PatrollingCommonHeader
          isReportVisible={false}
          isShareVisible={false}
          isHidden={true}
          isReshuffling={false}
          {...props}
        />
      )
    }
  },
  PatrolSchedule: {
    screen: PatrolSchedule,
    navigationOptions: {
      header: props => (
        <PatrollingCommonHeader
          isReportVisible={false}
          isShareVisible={false}
          isHidden={true}
          isReshuffling={false}
          {...props}
        />
      )
    }
  },
  sosScreen: {
    screen: CreateSOS,
    navigationOptions: {
      header: null
    }
  },
  //Announcement
  Announcement: {
    screen: Announcement,
    navigationOptions: {
      header: null
    }
  },
  subscriptionManagement: {
    screen: SubscriptionManagement,
    navigationOptions: {
      header: props => <MyFamilyHeader isSub={true} {...props} />
    }
  }
});

export default createAppContainer(ResApp);
