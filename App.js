import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  AppState,StatusBar,Platform,BackHandler
} from "react-native";
import {connect, Provider} from "react-redux";
import SplashScreen from "./splash_screen_pages/SplashScreen";
import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from "react-navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

import { mystyles } from "./pages/styles";
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
import { persistStore } from "redux-persist";

import Spinner from "react-native-spinkit";
import PrivacyPolicy from "./src/screens/Policy/PrivacyPolicy";
import TermsAndConditions from "./src/screens/Policy/TermsAndConditions";
import MyFamilyHeader from "./src/components/NavigationalHeaders/MyFamilyHeader";
import base from "./src/base";

const AuthStack = createStackNavigator(
    {
      MobileValid: {
        screen: MobileValid,
        navigationOptions: {
          title: "Sign In",
          headerStyle: { backgroundColor: "#f05555" },
          headerTintColor: "#000000"
        }
      },

      RegistrationPageScreen: {
        screen: RegistrationPage,
        navigationOptions: {
          title: "Registration ",
          headerStyle: { backgroundColor: "#f05555" },
          headerTintColor: "#000000"
        }
      },

      SelectMyRoleScreen: {
        screen: SelectMyRole,
        navigationOptions: {
          title: "Syncing ",
          headerStyle: { backgroundColor: "#f05555" },
          headerTintColor: "#000000"
        }
      },

      OTPVerificationScreen: {
        screen: OTPVerification,
        navigationOptions: {
          title: "OTP Verification",
          headerStyle: { backgroundColor: "#f05555" },
          headerTintColor: "#ffffff"
        }
      },
      privacyPolicy: {
        screen: PrivacyPolicy,
        navigationOptions: {
          header: null
        }
      },
      termsAndConditions: {
        screen: TermsAndConditions,
        navigationOptions: {
          header: null
        }
      },
    },

    {
      headerMode: "none"
    }
);

const DashStack = createStackNavigator(
    {
      AssnListScreen: {
        screen: associationlist,
        navigationOptions: {
          title: "Association List",
          headerStyle: { backgroundColor: "#f05555" },
          headerTintColor: "#ffffff"
        }
      },
      CreateAssnScreen: {
        screen: CreateAssociation,
        navigationOptions: {
          title: "Create Association",
          header: null,
          headerStyle: { backgroundColor: "#f05555" },
          headerTintColor: "#ffffff"
        }
      },
      Unit: {
        screen: unitlist,
        navigationOptions: {
          title: "Units List",
          headerStyle: { backgroundColor: "#FA9917" },
          headerTintColor: "#ffffff"
        }
      },
      CreateUnitsScreen: {
        screen: CreateUnitsPotrait, //CreateUnits,
        navigationOptions: {
          title: "Create Units",
          headerStyle: { backgroundColor: "#FA9917" },
          headerTintColor: "#ffffff"
        }
      },
      View: {
        screen: ViewUser,
        navigationOptions: {
          title: "View User",
          headerStyle: { backgroundColor: "#f05555" },
          headerTintColor: "#ffffff"
        }
      },

      ViewAll: {
        screen: ViewAllUser,
        navigationOptions: {
          title: "View All User",
          headerStyle: { backgroundColor: "#f05555" },
          headerTintColor: "#ffffff"
        }
      },

      Update: {
        screen: UpdateUser,
        navigationOptions: {
          title: "Update User",
          headerStyle: { backgroundColor: "#f05555" },
          headerTintColor: "#ffffff"
        }
      },

      Register: {
        screen: RegisterUser,
        navigationOptions: {
          title: "Register User",
          headerStyle: { backgroundColor: "#f05555" },
          headerTintColor: "#ffffff"
        }
      },

      Delete: {
        screen: DeleteUser,
        navigationOptions: {
          title: "Delete User",
          headerStyle: { backgroundColor: "#f05555" },
          headerTintColor: "#ffffff"
        }
      },

      ResDashBoard: {
        screen: ResApp,
        navigationOptions: {
          title: "ResidentDashBoard Drawer ",
          headerStyle: { backgroundColor: "#f05555" },
          headerTintColor: "#ffffff"
          // header:null
        }
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
    this.onBackPress.bind(this)
  }

  componentDidMount() {
    persistStore(store, null, () => {
      const { signedIn } = this.props;
      this.props.navigation.navigate(signedIn ? "App" : "Auth");

    });
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress () {   
    this.props.navigation.goBack(null);
  }



  render() {
      StatusBar.setBackgroundColor(base.theme.colors.primary,true)
    return (
        <Fragment>
          <SafeAreaView style={{ flex: 0, backgroundColor: "#ff8c00" }} />
          <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={styles.container}>
                <View style={{ flex: 1, flexDirection: "column" }}>
                <View style={styles.ImageContainer}>
                  <Image
                      source={require("./icons/headerLogo.png")}
                      style={styles.topImageLogo}
                  />
                </View>
                <View style={styles.activityIndicatorContainer}>
                  {/* <ActivityIndicator size="large" color="orange" /> */}
                  <Spinner
                      isVisible={true}
                      color={"orange"}
                      size={50}
                      type={"Circle"}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.text}>Your safety is priceless</Text>
                </View>
                <View style={styles.footerImageContainer}>
                  <Image
                      source={require("./icons/img4.jpg")}
                      style={styles.bottomImage}
                  />
                </View>
              </View>
            </View>
          </SafeAreaView>
        </Fragment>
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

const AppNavigator = createAppContainer(
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

import NavigatorService from './navigator';

class App extends React.Component{


  render(){
    return(
      <AppNavigator
      ref={navigatorRef => {
        NavigatorService.setContainer(navigatorRef);
      }}
      />
    )
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  containers: {},
  ImageContainer: {
    //   backgroundColor:'yellow',
    width: Dimensions.get("screen").width,
    height: hp("30%"),
    alignItems: "center",
    justifyContent: "center"
  },
  topImageLogo: {
    height: hp("20%"),
    width: wp("60%")
    // backgroundColor:'yellow'
  },
  activityIndicatorContainer: {
    width: Dimensions.get("screen").width,
    height: hp("15%"),
    //   backgroundColor:'red',
    justifyContent: "center",
    alignItems: "center"
  },
  textContainer: {
    // backgroundColor:'blue',
    height: hp("15%"),
    width: Dimensions.get("screen").width,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  text: {
    fontWeight: "500",
    fontSize: hp("3%"),
    color:'#000',

  },
  footerImageContainer: {
    // backgroundColor:'green',
    alignItems: "center",
    justifyContent: "center",
    height: hp("40%"),
    width: Dimensions.get("screen").width
  },
  bottomImage: {
    width: Dimensions.get("window").width,
    height: wp("80%")
  }
});