import React, {Component} from "react";
import {ActivityIndicator, Image, Text, View} from "react-native";
import {connect} from "react-redux";
import {createAppContainer, createStackNavigator, createSwitchNavigator} from "react-navigation";
import {mystyles} from "./pages/styles";
import RegisterUser from "./pages/RegisterUser";
import UpdateUser from "./pages/UpdateUser";
import ViewUser from "./pages/ViewUser";
import ViewAllUser from "./pages/ViewAllUser";
import DeleteUser from "./pages/DeleteUser";

import MobileValid from "./registration_pages/MobileValid";
import OTPVerification from "./registration_pages/OTPVerification";
import SelectMyRole from "./registration_pages/SelectMyRole";
import RegistrationPage from "./registration_pages/RegistrationPage";

import ResApp from "./dashboard_pages/ResApp";
import associationlist from "./assocition_pages/associationlist";
import CreateAssociation from "./assocition_pages/CreateAssociation";
import unitlist from "./assocition_pages/unitlist";
import CreateOrJoin from "./assocition_pages/CreateOrJoin";
import addmembers from "./assocition_pages/addmembers";
import CreateUnitsPotrait from "./assocition_pages/CreateUnitsPotrait";
import store from "./src/store";
import {persistStore} from "redux-persist";
import SchedulePatrolling from "./src/screens/Patrolling/SchedulePatrolling";
import CommonHeader from "./src/components/NavigationalHeaders/CommonHeader";
import PatrollingCheckPoints from "./src/screens/Patrolling/PatrollingCheckPoints";
import AddCheckPoints from "./src/screens/Patrolling/AddCheckPoints";


const AuthStack = createStackNavigator(
    {
        MobileValid: {
            screen: MobileValid,
            navigationOptions: {
                title: "Sign In",
                headerStyle: {backgroundColor: "#f05555"},
                headerTintColor: "#000000"
            }
        },

        RegistrationPageScreen: {
            screen: RegistrationPage,
            navigationOptions: {
                title: "Registration ",
                headerStyle: {backgroundColor: "#f05555"},
                headerTintColor: "#000000"
            }
        },

        SelectMyRoleScreen: {
            screen: SelectMyRole,
            navigationOptions: {
                title: "Syncing ",
                headerStyle: {backgroundColor: "#f05555"},
                headerTintColor: "#000000"
            }
        },

        OTPVerificationScreen: {
            screen: OTPVerification,
            navigationOptions: {
                title: "OTP Verification",
                headerStyle: {backgroundColor: "#f05555"},
                headerTintColor: "#ffffff"
            }
        }
    },
    {
        headerMode: "none"
    }
);

const DashStack = createStackNavigator(
    {
        // SplashScreen: {
        //   screen: SplashScreen,
        //   navigationOptions: {
        //     title: "OYE SAFE",
        //     headerStyle: { backgroundColor: "#f05555" },
        //     headerTintColor: "#ffffff"
        //   }
        // },

        AssnListScreen: {
            screen: associationlist,
            navigationOptions: {
                title: "Association List",
                headerStyle: {backgroundColor: "#f05555"},
                headerTintColor: "#ffffff"
            }
        },

        CreateAssnScreen: {
            screen: CreateAssociation,
            navigationOptions: {
                title: "Create Association",
                header: null,
                headerStyle: {backgroundColor: "#f05555"},
                headerTintColor: "#ffffff"
            }
        },

        Unit: {
            screen: unitlist,
            navigationOptions: {
                title: "Units List",
                headerStyle: {backgroundColor: "#FA9917"},
                headerTintColor: "#ffffff"
            }
        },

        CreateUnitsScreen: {
            screen: CreateUnitsPotrait, //CreateUnits,
            navigationOptions: {
                title: "Create Units",
                headerStyle: {backgroundColor: "#FA9917"},
                headerTintColor: "#ffffff"
            }
        },

        // SelectMyRoleScreen: {
        //   screen: SelectMyRole,
        //   navigationOptions: {
        //     title: "Syncing ",
        //     headerStyle: { backgroundColor: "#f05555" },
        //     headerTintColor: "#000000"
        //   }
        // },

        View: {
            screen: ViewUser,
            navigationOptions: {
                title: "View User",
                headerStyle: {backgroundColor: "#f05555"},
                headerTintColor: "#ffffff"
            }
        },

        ViewAll: {
            screen: ViewAllUser,
            navigationOptions: {
                title: "View All User",
                headerStyle: {backgroundColor: "#f05555"},
                headerTintColor: "#ffffff"
            }
        },

        Update: {
            screen: UpdateUser,
            navigationOptions: {
                title: "Update User",
                headerStyle: {backgroundColor: "#f05555"},
                headerTintColor: "#ffffff"
            }
        },

        Register: {
            screen: RegisterUser,
            navigationOptions: {
                title: "Register User",
                headerStyle: {backgroundColor: "#f05555"},
                headerTintColor: "#ffffff"
            }
        },

        Delete: {
            screen: DeleteUser,
            navigationOptions: {
                title: "Delete User",
                headerStyle: {backgroundColor: "#f05555"},
                headerTintColor: "#ffffff"
            }
        },

        ResDashBoard: {
            screen: ResApp,
        },

        CreateOrJoinScreen: {
            screen: CreateOrJoin,
            navigationOptions: {
                title: "Association"
            }
        },

        addmembersScreen: {
            screen: addmembers,
            navigationOptions: {
                title: "Association"
            }
        },
        schedulePatrolling: {
            screen: SchedulePatrolling,
            navigationOptions: {
                title: "Schedule Patrolling",
                header: props => <CommonHeader {...props}/>,
            }
        },
        patrollingCheckPoint: {
            screen: PatrollingCheckPoints,
            navigationOptions: {
                title: "Patrolling Check Points",
                header: props => <CommonHeader {...props}/>
            }
        },
        addCheckPoint: {
            screen: AddCheckPoints,
            navigationOptions: {
                title: "Add Checkpoints",
                header: props => <CommonHeader isHidden={true} {...props}/>
            }
        }
    },
    {
        headerMode: "none",
        initialRouteName: "ResDashBoard"
    }
);

class Loading extends Component {

    constructor(props) {
        super(props);
    }

    // componentDidUpdate() {
    //   const { signedIn } = this.props;
    //   setTimeout(() => {
    //     this.props.navigation.navigate(signedIn ? "App" : "Auth");
    //   }, 2000);
    // }

    componentDidMount() {
        persistStore(store, null, () => {
            const {signedIn} = this.props;
            this.props.navigation.navigate(signedIn ? "App" : "Auth");
            // setTimeout(() => {
            //   this.props.navigation.navigate(signedIn ? "App" : "Auth");
            // }, 1000);
        })
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: "column",
                    backgroundColor: "#fff"
                }}
            >
                <View
                    style={{
                        width: "100%",
                        height: "45%",
                        alignContent: "flex-end",
                        justifyContent: "flex-end"
                    }}
                >
                    <Image
                        source={require("./pages/assets/images/OyespaceRebrandingLogo.png")}
                        style={{width: 150, height: 130, alignSelf: "center"}}
                    />
                </View>
                <ActivityIndicator/>
                <Text style={{fontSize: 8, color: "black", alignSelf: "center"}}>
                    {" "}
                    Data is loading now..
                </Text>

                {/*         <Text style={mystyles.splashHeadline}> OYE SAFE</Text>*/}
                <Text style={mystyles.yourSafetyIsPriceless}>
                    {" "}
                    Your Safety is Priceless
                </Text>
                <Image
                    source={require("./pages/assets/images/building_complex.png")}
                    style={{width: "100%", height: "35%", alignSelf: "center"}}
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        signedIn: state.UserReducer.signedIn,
        OyespaceReducer: state.OyespaceReducer,
        UserReducer: state.UserReducer
    };
};

const LoadingConnect = connect(mapStateToProps)(Loading);

const App = createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: LoadingConnect,
            App: DashStack,
            Auth: AuthStack
        },
        {
            initialRouteName: "AuthLoading"
        }
    )
);

export default App;
