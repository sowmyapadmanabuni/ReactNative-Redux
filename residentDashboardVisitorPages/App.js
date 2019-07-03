import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image ,
  Dimensions
} from "react-native";
// import Header from './src/components/common/Header';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import FirstTab from './FirstTab.js';
//import QRCodeGeneration from './src/pages/QRCodeGeneration.js';

import { createStackNavigator, createAppContainer } from "react-navigation";

// export default class App extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Header/>
//         <Text style={styles.titleOfScreen}>Visitors</Text>
//         <FirstTab/>
                
//       </View>
//     );
//   }
// }

const Header = props => {
  return (
    <SafeAreaView style={{ backgroundColor: "orange" }}>
      <View style={[styles.viewStyle, { flexDirection: "row" }]}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Image
            style={[styles.image]}
            source={require("./src/icons/headerLogo.png")}
          />
        </View>
      </View>
      <View style={{ borderWidth: 1, borderColor: "orange" }} />
    </SafeAreaView>
  );
};
const MainNavigator = createStackNavigator({
  FirstTab:{screen: FirstTab},
  // QRCodeGeneration: {screen: QRCodeGeneration}
},
{
  // defaultNavigationOptions: {
  //   headerTintColor: '#fff',
  //   headerStyle:{
  //     backgroundColor:'#b83227'
  //   },
  //   headerTitleStyle:{
  //     color:'#fff'
  //   }

  // }
}
);

const AppContainer = createAppContainer(MainNavigator);
export default AppContainer;

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  titleOfScreen: {
    marginTop: hp("1.6%"),
    textAlign: "center",
    fontSize: hp("2%"),
    fontWeight: "bold",
    color: "black",
    marginBottom: hp("1.6%"),
    color:'#ff8c00',
  },
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
});
