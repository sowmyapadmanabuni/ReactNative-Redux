/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-06-24
 */


import React from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Dimensions} from 'react-native';
import base from "../../base";
import {widthPercentageToDP} from "react-native-responsive-screen";
import {connect} from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";


class MyFamilyHeader extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        const {goBack} = this.props.navigation;
        return (
            // <View style={styles.container}>
            //     <TouchableOpacity
            //         onPress={() => goBack(null)}
            //         style={styles.buttonView}>
            //         <Image
            //             style={styles.backButton}
            //             source={require('../../../icons/arrowBack.png')}
            //         />
            //     </TouchableOpacity>
            //     <View style={styles.logoView}>
            //         <Image
            //             resizeMode={'cover'}
            //             style={styles.logo}
            //             source={require('../../../icons/headerLogo.png')}
            //         />
            //     </View>

            //    {/* <TouchableOpacity onPress={() => this.onNextButtonClick()}
            //                               style={styles.scheduleReport}>
            //                 <Text style={styles.scheduleTextStyle}>Next</Text>
            //     </TouchableOpacity>*/}
            // </View>
            <View style={styles.container}>
                <SafeAreaView style={{backgroundColor: "#ff8c00"}}>
            <View style={[styles.viewStyle, {flexDirection: "row"}]}>
              <View style={styles.viewDetails1}>
                <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('ResDashBoard');
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
                {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
              </View>
            </View>
            <View style={{borderWidth: 1, borderColor: "#ff8c00"}}/>
          </SafeAreaView>
          <Text style={styles.titleOfScreen}> Visitors </Text>

            </View>
            
        )
    }
    onNextButtonClick() {
       console.log('NextButtonClick',this.props)
    }

}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
    backgroundColor: '#fff',
    },
    buttonView: {
        width: "17%",
        justifyContent: 'center',
        height: "90%",
        paddingTop: 3,
        alignItems:'center'
    },
    backButton: {
        height: "30%",
        width:"30%"
    },
    logoView: {
        height: 40,
        width: widthPercentageToDP('60%'),
        backgroundColor: base.theme.colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20
    },
    logo: {
        height: 50,
        width: 100,
        alignSelf: 'center'
    },
    scheduleReport: {
        borderWidth: 1,
        height: "40%",
        width: widthPercentageToDP("15%"),
        borderRadius: 10,
        marginRight: widthPercentageToDP('35%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'orange'
    },
    scheduleTextStyle: {
        color: 'orange',
        textAlign: 'center',
        width: widthPercentageToDP('20%'),
        fontFamily: base.theme.fonts.medium
    },
    reportImage: {height: "50%",width: widthPercentageToDP("20%")},

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

      titleOfScreen: {
        marginTop:hp("1.6%"),
        textAlign: 'center',
        fontSize: hp('2%'),
        fontWeight:'bold',
        color:'#ff8c00',
        marginBottom: hp("1.6%"),
      },
});


export default MyFamilyHeader;

