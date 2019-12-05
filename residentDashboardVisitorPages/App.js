import React from "react";
import {Dimensions, Image, SafeAreaView, StyleSheet, View} from "react-native";
// import Header from './src/components/common/Header';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import FirstTab from './FirstTab.js';
import {createAppContainer, createStackNavigator} from "react-navigation";
//import QRCodeGeneration from './src/pages/QRCodeGeneration.js';

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
        <SafeAreaView style={{backgroundColor: "#ff8c00"}}>
            <View style={[styles.viewStyle1, {flexDirection: "row"}]}>
                <View style={styles.viewDetails1}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}
                    >
                        <View
                            style={{
                                height: hp("4%"),
                                width: wp("15%"),
                                alignItems: 'flex-start',
                                justifyContent: "center"
                            }}
                        >
                            <Image
                                resizeMode="contain"
                                source={require("../icons/back.png")}
                                style={styles.viewDetails2}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Image
                        style={[styles.image1]}
                        source={require("../icons/headerLogo.png")}
                    />
                </View>
                <View style={{flex: 0.2}}>
                    {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                </View>
            </View>
            <View style={{borderWidth: 1, borderColor: "orange"}}/>
        </SafeAreaView>

    );
};
const MainNavigator = createStackNavigator({
        FirstTab: {screen: FirstTab},
    }
);

const AppContainer = createAppContainer(MainNavigator);
export default AppContainer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    titleOfScreen: {
        marginTop: hp("1.6%"),
        textAlign: "center",
        fontSize: hp("2%"),
        fontWeight: "bold",
        //color: "black",
        marginBottom: hp("1.6%"),
        color: '#ff8c00',
    },
    viewStyle: {
        backgroundColor: "#fff",
        height: hp("7%"),
        width: Dimensions.get("screen").width,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        elevation: 2,
        position: "relative"
    },
    image: {
        width: wp("22%"),
        height: hp("12%")
    },

    viewStyle1: {
        backgroundColor: "#fff",
        height: hp("7%"),
        width: Dimensions.get("screen").width,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        elevation: 2,
        position: "relative"
    },
    image1: {
        width: wp("22%"),
        height: hp("12%"),
        marginRight: hp("3%")
    },


    viewDetails1: {
        flex: 0.3,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 3
    },
    viewDetails2: {
        alignItems: "flex-start",
        justifyContent: "center",
        width: hp("3%"),
        height: hp("3%"),
        marginTop: 5
        // marginLeft: 10
    },
});
