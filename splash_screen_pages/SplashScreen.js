/*Home Screen With buttons to navigate to diffrent options*/
import React from "react";
import {
  View,
  NetInfo,
  StyleSheet,
  Button,
  Alert,
  Image,
  Text,
  AppState,
  ActivityIndicator
} from "react-native";
import { NavigationActions } from "react-navigation";
import { mystyles } from "../pages/styles";
import { connect } from "react-redux";
import { updateUserInfo } from "../src/actions";

console.disableYellowBox = true;
// global.DB_NAME = "UserDatabase1.db";

class SplashScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    // this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
    global.constantAdmin = 1;
    global.constantOwner = 2;
    global.constantTenant = 3;
    global.constantMember = 4;

    //9450041258
    // global.oyeURL = "apidev.oyespace.com";
    // global.oyeURL = 'apiuat.oyespace.com';
    //  global.oyeURL = 'api.oyespace.com';
    //apiuat.oyespace.com
    global.champBaseURL = "https://" + global.oyeURL + "/oyeliving/api/v1/";
    global.oye247BaseURL = "https://" + global.oyeURL + "/oye247/api/v1/";
    global.oyeBaseURL = "mediaupload.oyespace.com";
    global.viewImageURL = "http://" + global.oyeBaseURL + "/Images/";
    global.uploadImageURL =
      "http://" + global.oyeBaseURL + "/oyeliving/api/v1/association/upload";
    //http://122.166.168.160/Images/assigned_task_orange.png
    //http://122.166.168.160/oyeliving/api/V1/association/upload
    //192.168.0.188:80 & 81
    //  "X-OYE247-APIKey"it: "7470AD35-D51C-42AC-BC21-F45685805BBE",
    // "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
    global.oyeMobileRegex = /^[0]?[456789]\d{9}$/;

    global.oyeNonSpecialRegex = /[^0-9A-Za-z ,]/;
    global.oyeNonSpecialNameRegex = /[^0-9A-Za-z .]/;
    global.oyeEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/;

    const regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    global.OyeFullName = /^[a-zA-Z ]+$/;
    const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  }

  onRegister(token) {
    console.log(token);
    this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  onNotif(notif) {
    console.log(notif);
    Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    Alert.alert("Permissions", JSON.stringify(perms));
  }

  state = {
    appState: AppState.currentState,
    netConnectionState: "start",
    snackIsVisible: false,
    //Setting up the starting visible state of snackbar
    distance: 0
  };

  componentDidMount() {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      this.setState({ netConnectionState: connectionInfo.type });
      console.log(
        "Initial, type: " +
          connectionInfo.type +
          ", effectiveType: " +
          connectionInfo.effectiveType +
          "|" +
          this.state.netConnectionState +
          "|" +
          this.state.appState
      );
    });

    NetInfo.addEventListener(
      "connectionChange",
      this.handleFirstConnectivityChange.bind(this)
    );
  }

  _onRemoteNotification(notification) {}

  // navigateAfterFinish = screen => {
  //   const resetAction = NavigationActions.reset({
  //     index: 0,
  //     actions: [NavigationActions.navigate({ routeName: screen })]
  //   });
  //   this.props.navigation.dispatch(resetAction);
  // };

  handleFirstConnectivityChange(connectionInfo) {
    this.setState({ netConnectionState: connectionInfo.type });
    console.log(
      "First change, type: " +
        connectionInfo.type +
        ", effectiveType: " +
        connectionInfo.effectiveType +
        "|" +
        this.state.netConnectionState +
        "|" +
        this.state.appState
    );
    if (
      this.state.netConnectionState == "cellular" ||
      this.state.netConnectionState == "wifi"
    ) {
    } else {
      alert("No net Connected");
    }
  }

  render() {
    // var n = global.MyVar + " SQLite Example " + this.state.netConnectionState;
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
            source={require("../pages/assets/images/OyespaceRebrandingLogo.png")}
            style={{ width: 150, height: 130, alignSelf: "center" }}
          />
        </View>
        <ActivityIndicator />
        <Text style={{ fontSize: 8, color: "black", alignSelf: "center" }}>
          {" "}
          Data is loading..
        </Text>

        {/*         <Text style={mystyles.splashHeadline}> OYE SAFE</Text>*/}
        <Text style={mystyles.yourSafetyIsPriceless}>
          {" "}
          Your Safety is Priceless
        </Text>
        <Image
          source={require("../pages/assets/images/building_complex.png")}
          style={{ width: "100%", height: "35%", alignSelf: "center" }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});

const mapStateToProps = state => {
  return {};
};

export default connect(
  mapStateToProps,
  { updateUserInfo }
)(SplashScreen);
