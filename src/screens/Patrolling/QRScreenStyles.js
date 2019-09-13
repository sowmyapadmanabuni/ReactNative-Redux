import {StyleSheet} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import base from "../../base";

/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-15
 */

const QRScreenStyles = StyleSheet.create({
    container: {
        height: hp('100%'),
        width: wp("100%")
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
    qrView: {
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor:'white'
    },
    cpTextView: {
        borderWidth: 2,
        height: hp('8%'),
        width: wp('90%'),
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: base.theme.colors.grey
    },
    cpTextStyle: {
        color: base.theme.colors.grey,
        fontFamily: base.theme.fonts.bold
    }
});

export default QRScreenStyles;