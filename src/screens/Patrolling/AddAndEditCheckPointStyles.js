import {Platform, StyleSheet} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import base from "../../base";

/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-15
 */
const AddAndEditCheckPointStyles = StyleSheet.create({
    container: {
        //height: hp("100%"),
        flex:1,
        backgroundColor: base.theme.colors.white,
        paddingBottom: Platform.OS === 'ios' ? hp('30%') : hp('3%')
    },
    header: {
        alignItems: 'center',
        justifyContent: "center",
        height: hp('10%')
    },
    headerText: {
        fontSize: 15,
        fontFamily: base.theme.fonts.medium,
        color: base.theme.colors.primary
    },
    mapBox: {
        height: hp('50%'),
        width: "90%",
        borderWidth: 1,
        alignSelf: 'center'
    },
    textView: {
        marginTop: 40,
        width: '90%',
        alignSelf: 'center',
        //height:'20%'
    },
    gpsView: {
        marginTop: 20,
        width: '90%',
        marginLeft: "5%",
        borderBottomWidth: 0.6,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: Platform.OS==='ios'?3:0
    },
    gpsIcon: {
        height: Platform.OS === 'ios' ? 24 : 20,
        width: Platform.OS === 'ios' ? 24 : 20,        
    },
    signalIcon: {
        height: Platform.OS === 'ios' ? 30 : 20,
        width: Platform.OS === 'ios' ? 60 : 20,
    },
    gpsButtonView: {
        borderWidth: 1,
        height: "35%",
        width: "35%",
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',

    },
    gpsButton: {
        color: base.theme.colors.primary
    },
    buttonView: {
        marginTop:hp(5),
        borderWidth: 0,
        width: "100%",
        //height: hp('10%'),
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    radioView: {
        //height: "15%",
        //width: "90%",
        alignItems:'center',
        justifyContent:'center',
        alignSelf: 'center',
        //backgroundColor:'yellow',
        marginTop:hp(5),
    },
    radioButtonWrap: {
        marginRight: 5
    },
    radioStyle: {
        paddingRight: 10
    },
    setGPS: {
        borderWidth: 1,
        height: "35%",
        width: "35%",
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gpsLocView: {
        flexDirection: 'row',
        alignItems: 'center'
    },

});

export default AddAndEditCheckPointStyles;
