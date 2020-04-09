import {Platform, StyleSheet} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import base from "../../base";

/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-15
 */

const PatrollingReportStyles = StyleSheet.create({
    container: {
        height: hp('100%'),
        width: wp('100%'),
        color: base.theme.colors.white
    },
    header: {
        alignItems: 'center',
        justifyContent: "center",
        height: "10%"
    },
    headerText: {
        fontSize: 15,
        fontFamily: base.theme.fonts.medium,
        color: base.theme.colors.black
    },
    dropdownView: {
        width: wp('90%'),
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: base.theme.colors.grey,
        justifyContent: 'center',
        //alignItems:'center',
        //backgroundColor:'gray',
    },
    pickerStyles: {
        width: wp('80%'),
        alignSelf: 'center',
        marginLeft: 15,
        bottom: Platform.OS === 'ios' ? 13 : 0,
        //backgroundColor:'yellow'
    },
    viewStyle: {
        height: hp('85%'),
        width: wp('100%'),
    },
    slotDetail: {
        borderWidth: 0,
        width: wp('50%'),
        height: hp('12%'),
        flexDirection: 'row',
        alignItems: 'center',
        left: 20
    },
    slotText: {
        flexDirection: 'column',
        left: 10
    },
    slotName: {
        fontSize: 20,
        fontFamily: base.theme.fonts.bold,

    },
    slotTime: {
        fontSize: 18,
        color: base.theme.colors.themeColor,
        top: 3
    },
    calender: {
        borderWidth: 0,
        alignSelf: 'center',
        width: wp('90%'),
        height: hp('12%'),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    time: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        width: wp('30%')
    },
    timeText: {
        fontFamily: base.theme.fonts.medium
    },
    radioView: {
        borderWidth: 0,
        alignSelf: 'center',
        justifyContent: 'center',
        width: wp('90%'),
        height: hp('20%'),
    },
    radioView1: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'},
    radioView_1: {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around'},
    radioView2: {
        height: hp('4%'),
        width: hp('4%'),
        borderRadius: hp('2%'),
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: base.theme.colors.grey
    },
    selType: {
        left: 10,
        fontSize: 15,
        fontFamily: base.theme.fonts.medium
    },
    buttonView: {},
    ModalMainView: {
        flex: 1,
        backgroundColor: base.theme.colors.transparent,
        height: hp('50%'),
        width: wp('50%'),
        alignSelf: 'center',
        alignItems: 'center'
    },
    modalView: {
        backgroundColor: base.theme.colors.primary,
        height: 50,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalText: {
        fontFamily: base.theme.fonts.medium,
        fontSize: 18,
        color: base.theme.colors.white,
        alignSelf: 'center'
    },
    entryTimeIcon: {
        height: hp('5%'),
        width: hp('5%')
    },
    calenderIcon: {
        borderWidth: 0,
        // height: hp('5%'),
        // width: wp('5%')
    },
    radioButtonView: {
        height: hp('3%'),
        width: hp('3%'),
        borderRadius: hp('1.5%'),
    }
});

export default PatrollingReportStyles;