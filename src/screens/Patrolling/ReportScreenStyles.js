import {StyleSheet} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import base from "../../base";

/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-15
 */

const ReportScreenStyles = StyleSheet.create({
    container: {
        height: hp('100%'),
        width: wp('100%'),
        color: base.theme.colors.white,
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
    headRow: {height: 40, width: wp('100%'), backgroundColor: base.theme.colors.primary},
    textRow: {
        fontSize: 11,
        color: base.theme.colors.white,
        borderWidth: 0,
    },
    text: {fontSize: 10, textAlign: 'left'},
    row: {
        height: 40,
        width: wp('100%'),
        backgroundColor: base.theme.colors.white,
        borderColor: base.theme.colors.grey,
        borderWidth: 1
    },
    entryTimeView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: hp('10%')
    },
    entryIcon: {
        height: hp('5%'),
        width: wp('10%')
    },
    slotTimeView: {
        flexDirection: 'column',
        width: wp('80%'),
        marginLeft: 5
    },
    shareIconView: {
        borderWidth: 0,
        alignItems: 'flex-end'
    },
    shareIcon: {
        height: hp('5%'),
        width: wp('5%')
    }
});

export default ReportScreenStyles;