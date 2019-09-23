/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-18
 */


import {Platform, StyleSheet} from "react-native";
import {
    heightPercentageToDP,
    heightPercentageToDP as hp,
    widthPercentageToDP,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";
import base from "../../base";


const CreateSOSStyles = StyleSheet.create({
    container: {
        //height: hp("100%"),
        backgroundColor: base.theme.colors.white,
        paddingBottom: Platform.OS === 'ios' ? hp('80%') : hp('70%')
    },
    header: {
        justifyContent: "center",
        height: hp('6%'),
        alignSelf: 'center'
    },
    headerText: {
        textAlign: 'center',
        fontSize: 15,
        fontFamily: base.theme.fonts.medium,
        color: base.theme.colors.primary
    },
    mapBox: {
        alignSelf: 'center',
        borderWidth: 1.5,
        borderColor: base.theme.colors.primary
    },
    map: {
        height: hp('30%'),
        alignSelf: 'center',
        width: wp('90%'),
    },
    detailBox: {
        height: hp('15%'),
        width: wp('90%'),
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    imageStyle: {
        height: heightPercentageToDP('12%'),
        width: heightPercentageToDP('12%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageView: {
        height: heightPercentageToDP('12%'),
        width: heightPercentageToDP('12%'),
    },
    guardView: {
        flexDirection: 'column', height: heightPercentageToDP('15%'),
        width: heightPercentageToDP('30%'), justifyContent: 'center'
    },
    guardHeadingView: {height: 30},
    guardHeading: {
        color: base.theme.colors.primary,
        fontFamily: base.theme.fonts.medium
    },
    emergencyDetailBox: {
        height: hp('15%'),
        width: wp('90%'),
        alignSelf: 'center',
        justifyContent: 'center'
    },
    emergency: {
        height: hp('3%')
    },
    emergencyHeader: {
        textAlign: 'center',
        fontSize: 15,
        fontFamily: base.theme.fonts.medium,
        color: base.theme.colors.primary
    },
    cardView: {
        height: "80%",
        width: "28%",
        borderRadius: 10,
        backgroundColor: base.theme.colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        borderColor: base.theme.colors.lightgrey,
        borderWidth: 0.5,
        shadowColor: base.theme.colors.darkgrey,
        shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 2},
        shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.8,
        shadowRadius: 2,
    },

    subCardView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    subView: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '65%',
    },
    imageStyles: {
        height: 28,
        width: 28,
        alignSelf: 'center',
        marginBottom: 2
    },
    imageStyles1: {
        height: 15,
        width: 15,
        alignSelf: 'center',
        marginBottom: 2, right: 5
    },
    count: {
        fontSize: 10,
        color: base.theme.colors.black,
    },
    cardText: {
        fontSize: 10,
        color: base.theme.colors.black,
    },
    stopSOSView: {
        height: heightPercentageToDP('10%'),
        width: widthPercentageToDP('90%'),
        top: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    stopSOSTextView: {
        height: heightPercentageToDP('4%'),
        width: widthPercentageToDP('30%'),
        borderRadius: heightPercentageToDP('10%'),
        backgroundColor: base.theme.colors.red,
        justifyContent: 'center',
        alignItems: 'center'
    },
    stopSOSText: {
        color: base.theme.colors.white
    }
});


export default CreateSOSStyles;