
import React from "react";
import { Text, View, SafeAreaView, Dimensions, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

const Header = props => {
  return (
    <SafeAreaView style={{ backgroundColor: "#ff8c00" }}>
      <View style={[styles.viewStyle, { flexDirection: "row" }]}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            style={[styles.image]}
            source={require("../icons/headerLogo.png")}
          />
        </View>
      </View>
      <View style={{ borderWidth: 1, borderColor: "#ff8c00" }} />
    </SafeAreaView>
  );
};

const styles = {
  viewStyle: {
    backgroundColor: "#fff",
    height: hp("7%"),
    width: Dimensions.get("screen").width,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: "relative"
  },
  image: {
    width: wp("22%"),
    height: hp("12%")
  }
};

export default Header;
