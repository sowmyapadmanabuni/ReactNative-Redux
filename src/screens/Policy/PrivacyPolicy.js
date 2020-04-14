import React from 'react';
import {BackHandler, Dimensions, Image, SafeAreaView, StyleSheet, TouchableOpacity, View, } from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import { WebView } from 'react-native-webview';


const {width, height} = Dimensions.get('window');

class PrivacyPolicy extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        BackHandler.addEventListener("hardwareBackPress", () => {
            this.goBack();
            return true;
        })
    }

    goBack() {
        this.props.navigation.goBack();
    }


    render() {
        console.log('GET THE PROPS DATA',this.props)
        return (

            <View style={styles.container}>

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
                                        source={require("../../../icons/back.png")}
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
                                source={require("../../../icons/headerLogo.png")}
                            />
                        </View>
                        <View style={{flex: 0.2}}>
                            {/* <Imrage source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                        </View>
                    </View>
                    <View style={{borderWidth: 1, borderColor: '#EBECED'}}/>
                </SafeAreaView>
                <WebView
                    source={{uri: "https://www.oyespace.com/privacy"}}
                //   source={{html:this.props.navigation.state.params.htmlCode}}
                 //  onLoadEnd={this.props.navigation.navigate('')}

                    style={{height: height, width: width}}
                />
            </View>

        )
    }


}

export default PrivacyPolicy;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        // width: hp("3%"),
        // height: hp("3%"),
        marginTop: 5
        // marginLeft: 10
    },


});
