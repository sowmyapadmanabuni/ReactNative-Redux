import React, { Component, Fragment } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Dimensions
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
// import Spinner from 'react-native-spinkit';

export default class SplashScreen extends Component {
  static navigationOptions = {
    title: "Mobile",
    header: null
  };

  render() {
    return (
      <Fragment>
        <SafeAreaView style={{ flex: 0, backgroundColor: "#ff8c00" }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          <View style={styles.container}>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <View style={styles.ImageContainer}>
                <Image
                  source={require("../icons/headerLogo.png")}
                  style={styles.topImageLogo}
                />
              </View>
              <View style={styles.activityIndicatorContainer}>
                {/* <ActivityIndicator size="large" color="orange" style/> */}
                {/* <Spinner isVisible={true} color={'orange'} size={50} type={'Circle'}  /> */}
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Your safety is priceless</Text>
              </View>
              <View style={styles.footerImageContainer}>
                <Image
                  source={require("../icons/img4.jpg")}
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
    fontSize: hp("3%")
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
