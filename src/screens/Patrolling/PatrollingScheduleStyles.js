import {StyleSheet} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import base from "../../base";

/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-15
 */

const PatrollingScheduleStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    subtitle: {
        color: 'orange', fontSize: 20,marginVertical:8
    },
    childView: {
        justifyContent: 'center',
        width: "98%",
        alignSelf: 'center',
        height: hp('85%')
    },
    flatListView: {
        height: hp('19%'),
        width: "98%",
        borderBottomWidth: 1,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    mapImage: {
        height: "80%",
        width: wp("22%")
    },
    mapImage1: {
        height: hp('10%'),
        width: wp("10%"),
        position: "absolute",
        alignSelf: 'center',
        right: 20,
        top: 50
    },
    centerView: {
        height: '70%',
        width: wp("50%"),
        alignSelf: 'center',
        marginLeft: wp('2%')
    },
    centerTextView: {
        height: hp('5%'),
        justifyContent: 'center'
    },
    centerTextStyle: {
        fontFamily: base.theme.fonts.bold,
        fontSize: 18
    },
    locationView: {
        flexDirection: 'row',
        height: hp('8%'),
        width: wp('50%'),
        alignItems: 'center',
    },
    locationImageStyle: {
        height: hp('3%'),
        width: hp('3%')
    },
    locationText: {
        width: wp('55%'),
        fontFamily: base.theme.fonts.light,
        color: base.theme.colors.black,
        fontSize: hp('2%'),
        marginLeft: wp('1%')
    },
    rightView: {
        height: "85%",
        width: wp('20%'),
        alignSelf: 'center',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    rightImageStyle: {
        height: hp('4%'),
        width: hp('4%')
    },
    noSlotTextView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    deviceView: {
        flexDirection: 'row',
        marginTop: hp('1%')
    },
    alarmView: {
        flexDirection: 'row',
        marginTop: hp('1%')
    },
    alarmText: {
        fontFamily: base.theme.fonts.medium,
        color: base.theme.colors.black,
        fontSize: hp('2%'),
        marginLeft: wp('1%')
    },
    marqueeText: {
        width: wp('45%'),
        fontFamily: base.theme.fonts.light,
        color: base.theme.colors.black,
        fontSize: hp('2%'),
    },
    mapModal: {
        flex: 1,
        backgroundColor: base.theme.colors.transparent,
        alignSelf: 'center',
        width: wp('90%'),
    },
    mapModalView: {
        height: hp("65%"),
        justifyContent: 'flex-start',
        backgroundColor: base.theme.colors.white,
    },
    mapTouchableView: {
        height: hp('7%'),
        justifyContent: 'center',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        width: wp('20%'),
    },
    closeText: {
        alignSelf: 'center',
        color: base.theme.colors.primary,
        fontFamily: base.theme.fonts.medium
    },
    slotView: {
        borderWidth: 0,
        height: hp('12%'),
        width: wp('85%'),
        alignSelf: 'center'
    },
    shareView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    shareImageView: {
        width: wp('30%'),
        alignItems: 'flex-end'
    },
    shareIcon: {
        height: hp('3%'),
        width: hp('3%')
    },
    marqView: {
        fontSize: 12,
        textAlign: "center",
        alignSelf: 'center',
        top: 1,
        width: wp('45%')
    },
    markerView: {
        height: hp('2%'),
        width: hp('2%'),
        borderRadius: hp('1%'),
        backgroundColor: base.theme.colors.green
    }

});

export default PatrollingScheduleStyles;
