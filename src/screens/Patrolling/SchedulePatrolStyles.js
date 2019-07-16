import {StyleSheet} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import base from "../../base";

/**
 * Created by Sarthak Mishra at Synclovis Systems Pvt. Ltd. on 2019-07-15
 */
const SchedulePatrolStyles = StyleSheet.create({
    container: {
        height: hp("30%"),
        width: '100%',
        backgroundColor: base.theme.colors.white,
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
        height: hp('17%'),
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
        height: "70%",
        width: wp("20%")
    },
    centerView: {
        height: '70%',
        width: wp("40%"),
        alignSelf: 'center',
        marginLeft: wp('4%')
    },
    centerTextView: {
        height: hp('5%'),
        justifyContent: 'center'
    },
    centerTextStyle: {
        fontFamily: base.theme.fonts.bold,
        fontSize: 15
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
    startTimeView:{
        flexDirection: 'column',
        height: hp('18%'),
        borderBottomWidth: 1
    },
    startText:{
        fontFamily: base.theme.fonts.medium,
        fontSize: 17,
        paddingLeft: 10
    },
    timeText:{
        height: hp('8%'),
        width: '25%',
        marginTop: hp('2%'),
        borderWidth: 1.5,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: base.theme.colors.primary
    },
    endTimeView:{
        flexDirection: 'column',
        height: hp('17%'),
        borderBottomWidth: 1,
        marginTop: hp('4%')
    },
    endText:{
        fontFamily: base.theme.fonts.medium,
        fontSize: 17,
        paddingLeft: 10
    },
    endTimeText:{
        height: 50,
        width: '25%',
        marginTop: hp('2%'),
        borderWidth: 1.5,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: base.theme.colors.primary
    },
    flatListMainView:{
        height: hp('17%'),
        borderBottomWidth: 1,
        justifyContent: 'center',
        marginTop: hp('4%')
    },
    flatList:{
        width: wp('95%'),
        alignSelf: 'center'
    },
    repeatTextView:{
        height: hp('10%'),
        width: wp('22%'),
        justifyContent: 'center',
        alignItems: 'center',
       // justifySelf: 'flex-end'
    },
    slotMainView:{
        height: hp('12%'),
        alignSelf: 'center',
        width: wp('100%'),
        borderBottomWidth: 1,
        marginTop: hp('4%')
    },
    slotSubView:{
        width: wp('27%'),
        justifyContent: 'center',
        alignItems: 'center',
        //justifySelf: 'flex-end'
    },
    textInputView:{
        height: hp('10%'),
        width: wp('90%'),
        borderWidth: 0,
        alignSelf: 'center'
    },
    selectDevMainView:{
        height: hp('12%'),
        alignSelf: 'center',
        width: wp('100%'),
        borderBottomWidth: 1,
        marginTop: hp('4%')
    },
    selectDevView:{
        width: wp('32%'),
        justifyContent: 'center',
        alignItems: 'center',
       // justifySelf: 'flex-end'
    },
    picker:{
        width: wp('90%'),
        height: hp('5%'),
        alignSelf: 'center',
        marginTop: hp('2%'),
        marginLeft: wp('60%'),
    },
    snozeMainView:{
        height: hp('8%'),
        width: wp('100%'),
        justifyContent: 'space-around',
        flexDirection: 'row',
        borderBottomWidth: 1,
        marginTop: hp('4%')
    },
    osButtonView:{
        height: hp('12%'),
        width: wp('100%'),
        justifyContent: 'space-around',
        flexDirection: 'row',
        marginTop: hp('4%')
    },
    dataWeekView:{
        height: 40,
        width: 40,
        borderRadius: 20,
        borderWidth: 1,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinModal:{
        flex: 1,
        backgroundColor: base.theme.colors.transparent,
        height: 50,
        alignSelf: 'center',
        width: wp('90%'),
    },
    spinMainView:{
        height: hp("50%"),
        justifyContent: 'flex-start',
        backgroundColor: base.theme.colors.white,
    },
    closeTextView:{
        height: hp('7%'),
        justifyContent: 'center',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        width: wp('20%'),
    },
    closeText:{
        alignSelf: 'center',
        color: base.theme.colors.primary,
        fontFamily: base.theme.fonts.medium
    }
});

export default SchedulePatrolStyles;