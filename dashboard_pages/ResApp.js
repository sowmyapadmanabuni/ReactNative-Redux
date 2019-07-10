/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import {Platform} from "react-native";
import {createAppContainer, createStackNavigator} from "react-navigation";
//import ResidentDashBoard from '../dashboard_pages/ResidentDashBoard';
import MainScreen from "../dashboard_pages/MainScreen";
import SideMenu from "../dashboard_pages/SideMenu";
import associationlist from "../assocition_pages/associationlist";
import CreateAssociation from "../assocition_pages/CreateAssociation";
//import EditAssociation from '../assocition_pages/EditAssociation';
import unitlist from "../assocition_pages/unitlist";

import guardlist from "../assocition_pages/guardlist";
import ViewmembersList from "../assocition_pages/ViewmembersList";
import EachServiceProvider from "../assocition_pages/IndivisualServiceProviderReport";
import PatrollingList from "../assocition_pages/PatrollingList";

import SecurityDailyReport from "../assocition_pages/SecurityDailyReport";
import AllServiceProvider from "../assocition_pages/ServiceProvideReport";
import CreateUnitsPotrait from "../assocition_pages/CreateUnits";
import CreateWorker from "../assocition_pages/CreateWorker";
import EditWorker from "../assocition_pages/EditWorker";

import EditCheckPoint from "../assocition_pages/EditCheckPoint";
//  import Subscription from '../assocition_pages/Subscription';
// import EditCheckPointMap from '../assocition_pages/EditCheckPointMap';
// import CreateCheckPointMap from '../assocition_pages/CheckPointMap';
// import CreateCheckPointListMap from '../assocition_pages/CheckPointListMap';
import CreateCheckPoint from "../assocition_pages/CreateCheckPoint";
// import MapForGPS from '../assocition_pages/MapForGPS';
// import EditUnitsPotrait from '../assocition_pages/EditUnitsPotrait';
import CheckPointList from "../assocition_pages/CheckPointList";
import ViewIncidentList from "../resident_pages/ViewIncidentList";
import ViewFamilyMembersList from "../resident_pages/ViewFamilyMembersList";
import QRCodeGeneration from "../resident_pages/QRCodeGeneration";
import AddFamilyMember from "../resident_pages/AddFamilyMember";
import AssignTask from "../resident_pages/AssignTask";
import HamburgerMenu from "../dashboard_pages/HamburgerMenu";

import ViewVisitorsList from "../my_unit_pages/ViewVisitorsList";
//import UpdateDetails from '../my_unit_pages/UpdateDetails';
import RaiseIncident from "../my_unit_pages/RaiseIncident";
import InviteGuestScreen from "../my_unit_pages/InviteGuest";
import InvitedGuestList from "../my_unit_pages/InvitedGuestList";

import EditFamilyMember from "../my_unit_pages/EditFamilyMember";

import MyProfile from "../my_unit_pages/MyProfile.js";
import EditProfile from "../my_unit_pages/EditProfile";

import AddRegularVisitor from "../my_unit_pages/AddRegularVisitor";
import ViewRegularVisitor from "../my_unit_pages/ViewRegularVisitor";
import EditRegularVisitor from "../my_unit_pages/EditRegularVisitor";

import WorkerShiftDetails from "../workers_pages/WorkerShiftDetails";
import CreateWorkerShift from "../workers_pages/CreateWorkerShift";
import BlockDetail from "../assocition_pages/BlockDetails";
import CreateBlock from "../assocition_pages/CreateBlock";
import CreateOrJoin from "../assocition_pages/CreateOrJoin";
import EditBlock from "../assocition_pages/EditBlock.js";
import RegisterUser from "../pages/RegisterUser";
import RegisterToUnit from "../assocition_pages/register";
import ViewAllVisitorsList from "../assocition_pages/ViewAllVisitorsList";
import NotificationScreen from "../src/screens/NotificationScreen/NotificationScreen";
import NotificationDetailScreen from "../src/screens/NotificationScreen/NotificationDetailScreen";
import MyVehicleListScreen from "../resident_pages/MyVehicleListScreen.js";
import AddVehicles from "../resident_pages/AddVehicles";
import EditVehicles from "../resident_pages/EditVehicles";
import ShareQRCode from "../my_unit_pages/ShareQRCode";

import SOS from "../assocition_pages/SOS.js";
import adminfunction from "../dashboard_pages/adminfunction.js";
import CreatePatrollingShift from "../assocition_pages/CreatePatrollingShift.js";
import Securityattendance from "../assocition_pages/Securityattendance";
import Blockwise from "../assocition_pages/BlockwiseUnits";
import AddUnit from "../assocition_pages/AddUnit.js";
import EditUnit from "../assocition_pages/EditUnit.js";
import SchedulePatrolling from "../src/screens/Patrolling/PatrolSchedule";
import PatrollingCommonHeader from "../src/components/NavigationalHeaders/PatrollingCommonHeader";
import PatrollingCheckPoints from "../src/screens/Patrolling/PatrollingCheckPoints";
import AddAndEditCheckPoints from "../src/screens/Patrolling/AddAndEditCheckPoints";
import SchedulePatrol from "../src/screens/Patrolling/SchedulePatrol";
import QRScreen from "../src/screens/Patrolling/QRScreen";
import PatrollingReport from '../src/screens/Patrolling/PatrollingReport'
import ReportScreen from "../src/screens/Patrolling/ReportScreen";
//import HomeScreen from './pages/HomeScreen';
//import NavDrawer2 from '../pages/NavDrawer2';

//import DrawerNavigator from '../dashboard_pages/DrawerNavigator';
//import NavDrawer from './assocition_pages/NavDrawer';
// import CreateOrJoin from '../assocition_pages/CreateOrJoin';
// import CreateAssnMember from '../assocition_pages/CreateAssnMember';
//import AdminSettingScreen from "../src/screens/AdminSetting/AdminSettingScreen";
// import CountryCodePicker from '../registration_pages/CountryCodePicker';
// import NotificationScreen from '../dashboard_pages/NotificationScreen';
// import NotificationScreen2 from '../dashboard_pages/NotificationScreen2';

//  import SelectMyRole from '../registration_pages/SelectMyRole';

// import BottomNavigation from '../my_unit_pages/BottomNavigation';
// import UploadImage from '../my_unit_pages/UploadImage';

console.disableYellowBox = true;

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
    ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
    android:
        "Double tap R on your keyboard to reload,\n" +
        "Shake or press menu button for dev menu"
});

const NotificationStack = createStackNavigator({
    NotificationScreen: {
        screen: NotificationScreen,
        navigationOptions: {
            title: "Notifications",
            header: null
        }
    },
    NotificationDetailScreen: {
        screen: NotificationDetailScreen,
        navigationOptions: {
            title: "Notification Details",
            header: null
        }
    }
});

const ResApp = createStackNavigator({

    ResDashBoard: {
        screen: MainScreen,
        navigationOptions: {
            //header:props => <DashBoardHeader {...props}/>
            header: null
        },
    },

    MyProfileScreen: {
        screen: MyProfile,
        navigationOptions: {
            title: "My Profile",
            header: null
            //headerStyle: { backgroundColor: '#FA9917' },
            // headerTintColor: '#ffffff',
        }
    },
    EditProfileScreen: {
        screen: EditProfile,
        navigationOptions: {
            title: "Edit Profile",
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

    SideMenu: {
        screen: SideMenu,
        navigationOptions: {
            title: "Menu",
            header: null,
            //title: 'ResidentDashBoard Drawer ',
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    // SubscriptionScreen:  {
    //   screen: Subscription,
    //   navigationOptions: {
    //     title: 'Subscription',
    //     header: null,
    //     //title: 'ResidentDashBoard Drawer ',
    //     headerStyle: { backgroundColor: '#FA9917' },
    //     headerTintColor: '#ffffff',
    //   },
    // },
    ViewVisitorsScreen: {
        screen: ViewVisitorsList,
        navigationOptions: {
            title: "My Visitors",
            header: null
        }
    },
    AssnListScreen: {
        screen: associationlist,
        navigationOptions: {
            title: "Association List",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    HamburgerMenu: {
        screen: HamburgerMenu,
        navigationOptions: {
            title: "HamburgerMenu",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    CreateOrJoinScreen: {
        screen: CreateOrJoin,
        navigationOptions: {
            title: "Association"
            // headerStyle: { backgroundColor: '#FA9917' },
            // headerTintColor: '#ffffff',
        }
    },

    CreateAssnScreen: {
        screen: CreateAssociation,
        navigationOptions: {
            title: "Create Association",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    InviteGuestScreen: {
        screen: InviteGuestScreen,
        navigationOptions: {
            title: "Create Association",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },

    BlockDetailScreen: {
        screen: BlockDetail,
        navigationOptions: {
            title: "Block Detail",
            header: null
        }
    },
    CreateBlockScreen: {
        screen: CreateBlock,
        navigationOptions: {
            title: "Create Block",
            header: null
        }
    },

    Securityattendance: {
        screen: Securityattendance,
        navigationOptions: {
            title: "Security Attendance",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    RaiseIncidentScreen: {
        screen: RaiseIncident,
        navigationOptions: {
            title: "Raise Incidents ",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },

    SOS: {
        screen: SOS,
        navigationOptions: {
            title: "SOS",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    AdminFunction: {
        screen: adminfunction,
        navigationOptions: {
            title: "SOS",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },

    CreatePatrollingShift: {
        screen: CreatePatrollingShift,
        navigationOptions: {
            title: "Patrolling Shift Schedule",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },

    InvitedGuestListScreen: {
        screen: InvitedGuestList,
        navigationOptions: {
            title: "My Guest ",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    ViewRegularVisitorScreen: {
        screen: ViewRegularVisitor,
        navigationOptions: {
            title: "View Regular Visitor",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"}
            // headerTintColor: '#ffffff',
        }
    },

    Register: {
        screen: RegisterUser,
        navigationOptions: {
            title: "Register User",
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },

    RegisterUser: {
        screen: RegisterToUnit,
        header: null,
        navigationOptions: {
            title: "Register User",
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff",
            header: null
        }
    },

    ShareQRCode: {
        screen: ShareQRCode,
        navigationOptions: {
            title: "Menu",
            header: null,
            //title: 'ResidentDashBoard Drawer ',
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },

    ViewAllVisitorsScreen: {
        screen: ViewAllVisitorsList,
        navigationOptions: {
            title: "View All Visitors ",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },

    ViewIncidentsScreen: {
        screen: ViewIncidentList,
        navigationOptions: {
            title: "View Incidents ",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    Unit: {
        screen: unitlist,
        navigationOptions: {
            title: "Unit List",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    CheckPointListScreen: {
        screen: CheckPointList,
        navigationOptions: {
            title: "View Check Point ",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },

    ViewFamilyMembersListScreen: {
        screen: ViewFamilyMembersList,
        navigationOptions: {
            title: "Family Members List ",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    MyVehicleListScreen: {
        screen: MyVehicleListScreen,
        navigationOptions: {
            title: "My Vehicle",
            header: null
            // headerStyle: { backgroundColor: '#FA9917' },
            // headerTintColor: '#ffffff',
        }
    },

    AddVehiclesScreen: {
        screen: AddVehicles,
        navigationOptions: {
            title: "Add Vehicles",
            header: null
            // headerStyle: { backgroundColor: '#FA9917' },
            // headerTintColor: '#ffffff',
        }
    },
    EditVehiclesScreen: {
        screen: EditVehicles,
        navigationOptions: {
            title: "Edit Vehicle",
            header: null
            // headerStyle: { backgroundColor: '#FA9917' },
            // headerTintColor: '#ffffff',
        }
    },

    EditBlockScreen: {
        screen: EditBlock,
        navigationOptions: {
            title: "Add Vehicles",
            header: null
            // headerStyle: { backgroundColor: '#FA9917' },
            // headerTintColor: '#ffffff',
        }
    },
    // EditBlock
    // AdminSettingsScreen: {
    //   screen: AdminSettingScreen,
    //   navigationOptions: {
    //     title: "Admin Settings ",
    //     header: null,
    //     headerStyle: { backgroundColor: "#FA9917" },
    //     headerTintColor: "#ffffff"
    //   }
    // },

    AddFamilyMemberScreen: {
        screen: AddFamilyMember,
        navigationOptions: {
            title: "Create Family Member",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },

    AssignTask: {
        screen: AssignTask,
        navigationOptions: {
            title: "Assign Task ",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    SecurityDailyReportScreen: {
        screen: SecurityDailyReport,
        navigationOptions: {
            title: "Security Attendance Report",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },

    BlockWiseUnitListScreen: {
        screen: Blockwise,
        navigationOptions: {
            title: "Association List",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    AddUnit: {
        screen: AddUnit,
        navigationOptions: {
            title: "Edit Unit",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    EditUnit: {
        screen: EditUnit,
        navigationOptions: {
            title: "Edit Unit",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    EachServiceProviderReportScreen: {
        screen: EachServiceProvider,

        navigationOptions: {
            title: "Service provider Attendance Report",

            headerStyle: {
                backgroundColor: "#f05555"
            },

            headerTintColor: "#ffffff"
        }
    },
    ServiceProviderReportScreen: {
        screen: AllServiceProvider,

        navigationOptions: {
            title: "Service provider Attendance Report",

            headerStyle: {
                backgroundColor: "#f05555"
            },

            headerTintColor: "#ffffff"
        }
    },
    WorkerShiftDetailsScreen: {
        screen: WorkerShiftDetails,
        navigationOptions: {
            title: "Worker Shift Details",
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff",
            header: null
        }
    },
    CreateWorkerShiftScreen: {
        screen: CreateWorkerShift,
        navigationOptions: {
            title: "Create Worker Shift",
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff",
            header: null
        }
    },

    EditCheckPointScreen: {
        screen: EditCheckPoint,
        navigationOptions: {
            title: "Edit Check Point",
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff",
            header: null
        }
    },

    PatrollingListScreen: {
        screen: PatrollingList,
        navigationOptions: {
            title: "Patrolling List",
            header: null,
            headerStyle: {backgroundColor: "#f05555"},
            headerTintColor: "#ffffff"
        }
    },

    CreateCheckPointScreen: {
        screen: CreateCheckPoint,
        navigationOptions: {
            title: "Create Check Point ",
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff",
            header: null
        }
    },

    QRCodeGenScreen: {
        screen: QRCodeGeneration,
        navigationOptions: {
            title: "QR Code",
            header: null
            // headerStyle: { backgroundColor: '#FA9917' },
            // headerTintColor: '#ffffff',
        }
    },

    CreateUnitsScreen: {
        screen: CreateUnitsPotrait, //CreateUnits,
        navigationOptions: {
            title: "Create Units",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    CreateWorkerScreen: {
        screen: CreateWorker,
        navigationOptions: {
            title: "Create Worker",
            header: null
            // headerStyle: { backgroundColor: '#f05555' },
            // headerTintColor: '#ffffff',
        }
    },
    EditWorkerScreen: {
        screen: EditWorker,
        navigationOptions: {
            title: "Edit Worker",
            header: null
            // headerStyle: { backgroundColor: '#f05555' },
            // headerTintColor: '#ffffff',
        }
    },

    EditFamilyMemberScreen: {
        screen: EditFamilyMember,
        navigationOptions: {
            title: "Edit Family Members ",
            header: null
            // headerStyle: { backgroundColor: '#FA9917' },
            // headerTintColor: '#ffffff',
        }
    },

    AddRegularVisitorScreen: {
        screen: AddRegularVisitor,
        navigationOptions: {
            title: "Add Regular Visitor"
            // headerStyle: { backgroundColor: '#FA9917' },
            // headerTintColor: '#ffffff',
        }
    },
    EditRegularVisitorScreen: {
        screen: EditRegularVisitor,
        navigationOptions: {
            title: "Edit Regular Visitor"
            // headerStyle: { backgroundColor: '#FA9917' },
            // headerTintColor: '#ffffff',
        }
    },
    GuardListScreen: {
        screen: guardlist,
        navigationOptions: {
            title: "Guard List",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    ViewmembersScreen: {
        screen: ViewmembersList,
        navigationOptions: {
            title: "View Members ",
            header: null,
            headerStyle: {backgroundColor: "#FA9917"},
            headerTintColor: "#ffffff"
        }
    },
    schedulePatrolling: {
        screen: SchedulePatrolling,
        navigationOptions: {
            title: "Schedule Patrolling",
            header: props => <PatrollingCommonHeader isReportVisible={true} isHidden={false}
                                                     isShareVisible={false} {...props}/>,
        }
    },
    patrollingCheckPoint: {
        screen: PatrollingCheckPoints,
        navigationOptions: {
            title: "Patrolling Check Points",
            header: props => <PatrollingCommonHeader isReportVisible={false} isHidden={false}
                                                     isShareVisible={false} {...props}/>
        }
    },
    addCheckPoint: {
        screen: AddAndEditCheckPoints,
        navigationOptions: {
            title: "Add Checkpoints",
            header: props => <PatrollingCommonHeader isReportVisible={false} isShareVisible={false}
                                                     isHidden={true} {...props}/>
        }
    },
    schPatrolling: {
        screen: SchedulePatrol,
        navigationOptions: {
            header: props => <PatrollingCommonHeader isReportVisible={false} isShareVisible={false}
                                                     isHidden={true} {...props}/>
        }
    },
    qrScreen: {
        screen: QRScreen,
        navigationOptions: {
            header: props => <PatrollingCommonHeader isReportVisible={true} isShareVisible={true}
                                                     isHidden={false} {...props}/>
        }
    },
    patrollingReport: {
        screen: PatrollingReport,
        navigationOptions: {
            header: props => <PatrollingCommonHeader isReportVisible={false} isShareVisible={false}
                                                     isHidden={true} {...props}/>
        }
    },
    reportScreen: {
        screen: ReportScreen,
        navigationOptions: {
            header: props => <PatrollingCommonHeader isReportVisible={false} isShareVisible={false}
                                                     isHidden={true} {...props}/>
        }
    },
}, {
    initialRouteName: "ResDashBoard",
    headerMode: "screen"
});

export default createAppContainer(ResApp);