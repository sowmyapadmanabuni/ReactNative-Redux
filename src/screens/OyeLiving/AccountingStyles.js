import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import base from '../../base';
const WIDTH = Dimensions.get('screen').width - 20;
const HEIGHT = Dimensions.get('screen').height;

const AccountingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column'
  },
  viewStyle1: {
    backgroundColor: '#fff',
    height: hp('7%'),
    width: Dimensions.get('screen').width,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
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
    width: hp('3%'),
    height: hp('3%'),
    marginTop: 5
    // marginLeft: 10
  },
  image1: {
    // width: wp('34%'),
    // height: hp('18%'),
    marginRight: hp('3%')
  },
  titleOfScreen: {
    marginTop: hp('1.6%'),
    textAlign: 'center',
    fontSize: 18,
    color: '#ff8c00',
    marginBottom: hp('4%')
  },
  card: {
    width: WIDTH,
    alignSelf: 'center',
    height: HEIGHT
  },
  accountingDetails: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: base.theme.colors.primary,
    height: hp('5%')
  },
  accountingDetailsText: {
    color: base.theme.colors.white,
    fontSize: hp('2%'),
    fontWeight: 'bold'
  },
  dropDownView: {
    height: '5%',
    alignSelf: 'center',
    width: '90%',
    marginBottom: hp('2%')
  },
  inputItem: {
    marginLeft: wp('5%'),
    marginRight: wp('5%'),
    borderColor: base.theme.colors.text
  },
  selectRateStyle: {
    alignSelf: 'center',
    width: '90%',
    marginTop: hp('1.5%')
  },
  text: {
    fontSize: hp('1.6%'),
    // fontWeight: '400',
    color: base.theme.colors.text
  },
  datePickerBox: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: hp('4%'),
    padding: 0
  },
  calView: {
    width: hp('3%'),
    height: hp('3%'),
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewDatePickerImageStyle: {
    width: wp('4.5%'),
    height: hp('3%'),
    marginRight: hp('0.2%')
  }
});

export default AccountingStyles;
