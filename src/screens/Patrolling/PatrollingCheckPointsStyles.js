/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-15
 */
import {Platform, StyleSheet} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import base from "../../base";


const PatrollingCheckPointsStyles = StyleSheet.create({
    container: {
        height: hp("100%"),
        width: '100%',
        backgroundColor: base.theme.colors.white
    },
    header: {
        alignItems: 'center',
        justifyContent: "center",
        height: "10%"
    },
    headerText: {
        fontSize: 15,
        fontFamily: base.theme.fonts.medium,
        color: base.theme.colors.primary
    },
    flatListView: {
        height: hp('75%'),
        flexDirection: 'row',
        justifyContent: 'center'
    },
    checkBoxView: {
        height: Platform.OS === 'ios' ? hp('20%') : hp('17%'),
        width: "98%",
        borderBottomWidth: 1,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    checkBoxStyle: {
        flex: 1,
        padding: 10
    },
    mapImage: {
        height: "80%",
        width: wp("20%")
    },
    mapImage1: {
        height: hp('20%'),
        width: wp("15%"),
        position: "absolute",
        alignSelf: 'flex-end'
    },
    centerView: {
        height: '70%',
        width: wp("40%"),
        alignSelf: 'center',
        marginLeft: wp('4%')
    },
    centerTextView: {
        height: hp('3%'),
        justifyContent: 'center',
        width: hp('40%')
    },
    centerTextStyle: {
        fontFamily: base.theme.fonts.bold,
        fontSize: 15,
        left:6
    },
    locationView: {
        flexDirection: 'row',
        height: hp('4%'),
        width: wp('38%'),
        alignItems: 'center',
    },
    locationImageStyle: {
        height: hp('3%'),
        width: hp('3%')
    },
    locationText: {
        width: wp('35%'),
        fontFamily: base.theme.fonts.thin
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
    map: {
        height: hp('50%'),
        alignSelf: 'center',
        width: wp('90%'),
    },
    mapViewModal: {
        flex: 1,
        backgroundColor: base.theme.colors.transparent,
        height: 50,
        alignSelf: 'center',
        width: wp('90%'),
    },
    modalView: {
        height: hp("50%"),
        justifyContent: 'flex-start',
        backgroundColor: base.theme.colors.white,
    },
    modalTouchable: {
        height: hp('7%'),
        justifyContent: 'center',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        width: wp('20%'),
        left: 50
    },
    modalText: {
        alignSelf: 'center',
        color: base.theme.colors.primary,
        fontFamily: base.theme.fonts.medium
    },
    marker: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkPoint: {
        width: '10%'
    }
});

export default PatrollingCheckPointsStyles;