import {Dimensions, Platform, StyleSheet} from 'react-native';
import base from '../../../../base';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

const Style = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        alignItems: 'center'
    },
    headerStyles: {
        height: '8%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 1,
        borderColor: base.theme.colors.primary,
        borderBottomWidth: 1.5,
        marginTop: Platform.OS === 'ios' ? 20 : 0
    },
    backIcon: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: hp('2%'),
        height: hp('2%'),
        marginLeft: 10
    },
    nextView: {
        width: '30%',
        alignItems: 'flex-end'
    },
    nextButton: {
        height: '40%',
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: base.theme.colors.primary,
        borderRadius: 10,
        marginRight: 10,
        borderWidth: 1
    },
    nextText: {
        fontSize: 10,
        color: base.theme.colors.primary
    },
    addFamilyMem: {
        height: '5%',
        width: '100%',
        alignItems: 'center',
        marginTop: 10
    },
    addFamilyText: {
        fontSize: 18,
        color: base.theme.colors.primary
    },
    subContainer: {
        height: '15%',
        width: '100%',
        alignItems: 'center',
        marginTop: 20
    },
    relativeImgView: {
        height: 90,
        width: 90,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: base.theme.colors.primary,
        backgroundColor: base.theme.colors.lightgrey,
        alignItems: 'center',
        justifyContent: 'center'
    },
    famTextView: {
        height: '4%',
        width: '100%',
        alignItems: 'center',
        marginTop: 40
    },
    famText: {
        fontSize: 16,
        color: base.theme.colors.themeColor
    },
    subMainView: {
        height: '64%',
        width: '100%',
        alignItems: 'center',
        marginBottom: 100
    },
    textInputView: {
        height: '15%',
        width: '90%',
        marginTop: 20
    },
    mobNumView: {
        height: '10%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titleOfScreen: {
        marginTop: hp('1.6%'),
        textAlign: 'center',
        fontSize: hp('2%'),
        fontWeight: 'bold',
        // color: '#B51414',
        marginBottom: hp('1.6%')
    },
    viewStyle1: {
        backgroundColor: '#fff',
        height: hp('7%'),
        width: Dimensions.get('screen').width,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        elevation: 2,
        position: 'relative'
    },
    image1: {
        // width: wp('34%'),
        // height: hp('18%'),
        marginRight: hp('3%')
    },

    viewDetails1: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 3
    },
    viewDetails2: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        // width: hp('3%'),
        // height: hp('3%'),
        marginTop: 5
        // marginLeft: 10
    }
});

export default Style;
