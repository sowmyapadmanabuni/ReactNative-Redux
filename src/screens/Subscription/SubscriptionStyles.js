import {Platform, StyleSheet} from "react-native";
import base from '../../base'

const SubscriptionStyles = StyleSheet.create({
    container: {height: '100%', width: '100%'},
    headerView: {
        width: '100%',
        alignItems: 'center', backgroundColor: base.theme.colors.white,
        elevation: 2,
        shadowColor: base.theme.colors.shadedWhite,
        shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 4},
        shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.8,
        shadowRadius: 5,

    },
    headerText: {
        fontSize: 18, color: base.theme.colors.primary, marginTop: 5, marginBottom: 15
    },
    planView: {
        width: '100%', alignItems: 'center',
    },
    planText: {
        fontSize: 18, color: base.theme.colors.black, marginTop: 10, marginBottom: 20
    },
    safeHeader: {
        height: 40,
        width: '95%',
        alignSelf: 'center',
        backgroundColor: base.theme.colors.primary,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkBoxMargin: {
        marginLeft: 20
    },
    checkBoxImage: {
        height: 30, width: 30
    },
    safeText: {
        fontSize: 18, color: base.theme.colors.white, marginLeft: 10
    },
    safeSubText: {
        fontSize: 14, color: base.theme.colors.black,
    },
    safeMainView: {
        width: '90%',
        borderWidth: 1,
        alignSelf: 'center',
        borderColor: base.theme.colors.shadedWhite,
        alignItems: 'center'
    },
    safeSubView: {
        height: 350, width: '100%', borderRadius: 20, alignItems: 'center',
    },
    existSubView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 10
    },
    extText: {
        fontSize: 14, color: base.theme.colors.primary
    },
    validText: {
        fontSize: 14, color: base.theme.colors.black,
    },
    subFontSize: {
        fontSize: 14
    },
    subPrimary: {
        color: base.theme.colors.primary
    },
    safeTableHead: {
        width: '98%', flexDirection: 'row', height: '8%',
        backgroundColor: base.theme.colors.lightgrey,
    },
    devView: {
        width: '25%',
        height: '100%',
        borderRightWidth: 1,
        borderColor: base.theme.colors.greyHead,
        alignItems: 'center',
        justifyContent: 'center'
    },
    priceView: {
        width: '50%', height: '100%', alignItems: 'center', justifyContent: 'center',
        borderRightWidth: 1, borderColor: base.theme.colors.shadedWhite,
    },
    safeTableSub: {
        width: '98%', flexDirection: 'row', height: '7%',
    },
    platView: {
        width: '25%',
        height: '100%',
        borderRightWidth: 1,
        borderColor: base.theme.colors.shadedWhite,
        flexDirection: 'row',
        alignItems: 'center',

    },
    checkBoxMarginSub: {
        marginLeft: 5
    },
    checkBoxImageSub: {height: 15, width: 15},
    platText: {
        marginLeft: 5,
        fontSize: 12,
        color: base.theme.colors.hyperLink,
        textDecorationLine: 'underline'
    },
    flexDir: {
        flexDirection: 'row'
    },
    rupeeText: {
        fontSize: 12,
        color: base.theme.colors.black
    },
    devPlatCount: {
        width: '25%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    alignImage: {
        alignSelf: 'center'
    },
    flatListView: {
        width: '100%', marginTop: 25
    },
    subTotalView: {
        width: '100%', borderWidth: 1, borderColor: base.theme.colors.lightgrey, height: '10%',
        alignItems: 'center', justifyContent: 'space-around', marginTop: 10, flexDirection: 'row'
    },
    subViewWidth: {
        width: '50%',
    },
    subHeadText: {
        fontSize: 15, color: base.theme.colors.black
    },
    gstText: {
        fontSize: 14, color: base.theme.colors.mediumGrey
    },
    grandTotalView: {
        width: '100%', alignItems: 'center'
    },
    grandText: {
        fontSize: 18,
    },
    payNow: {
        height: 70,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    payNowClr: {
        color: base.theme.colors.white
    }


})
export default SubscriptionStyles;
