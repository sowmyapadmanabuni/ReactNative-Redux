import { StyleSheet } from 'react-native';
import base from '../../../../base';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';

const StaffStyle = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center'
  },
  dropDownView: {
    height: '5%',
    width: '90%',
    marginTop: 20,
    marginBottom: 10
  },
  detailsMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '15%',
    width: '90%',
    marginTop: 20,
    justifyContent: 'space-between'
  },
  detailsLeftView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%'
  },
  textView: {
    marginLeft: 10,
    width: '28%'
  },
  textView1: {
    marginLeft: 10,
    width: hp('10%')
  },
  staffText: {
    fontSize: 15,
    color: base.theme.colors.black,
    marginRight: 2
  },
  staffText1: {
    fontSize: 15,
    color: base.theme.colors.black
  },
  desigText: {
    fontSize: 12,
    color: base.theme.colors.darkgrey
  },
  staffImg: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignSelf: 'center'
  },
  detailsRightView: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center'
  },
  shareImg: {
    height: 20,
    width: 20,
    alignSelf: 'center'
  },
  datePickerMainView: {
    height: '10%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 5
  },
  datePickerSubView: {
    width: '40%',
    borderBottomWidth: 0.5,
    height: '90%',
    borderColor: base.theme.colors.black
  },
  radioButtonView: {
    height: '15%',
    width: '95%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 35
  },
  noStaffDataText: {
    fontSize: 14,
    color: base.theme.colors.black
  },
  noStaffData: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default StaffStyle;
