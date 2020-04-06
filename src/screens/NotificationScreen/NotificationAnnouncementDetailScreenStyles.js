import { StyleSheet, Dimensions } from 'react-native';
import base from '../../base';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import { ratio, screenWidth } from './Styles.js';

const Styles = StyleSheet.create({
  container: {
    flex: 1
  },
  activityindicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  progress: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  //   safeareaBackcolor: '#ff8c00',
  viewStyle1: {
    backgroundColor: base.theme.colors.white,
    height: hp('7%'),
    width: '100%',
    shadowColor: base.theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative',
    flexDirection: 'row'
  },
  innerview: {
    height: hp('4%'),
    width: wp('15%'),
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  viewDetails1: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10
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
    // height: hp('18%')
  },

  mainview: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp('2%')
  },
  maintext: {
    color: base.theme.colors.primary,
    fontSize: hp('2%')
  },
  card: {
    width: Dimensions.get('window').width - 80,
    //height: hp('30%'),
    height: hp('17%'),
    alignSelf: 'center',
    borderRadius: hp('2%'),

    // zIndex: 1000,
    // elevation: 1000,
    shadowColor: '#867F7F',
    shadowOffset: {
      height: 6
    },
    shadowOpacity: 0.2
  },
  outerview: {
    width: Dimensions.get('window').width - 80,
    height: hp('60%')
  },
  firstview: {
    height: hp('14%'),
    margin: hp('1.4%')
  },
  textview: {
    width: '100%',
    height: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: { color: base.theme.colors.grey, fontSize: hp('2%') },
  image: {
    height: hp('10%'),
    width: hp('10%'),
    borderRadius: hp('1%'),
    margin: hp('1%')
  },

  viewPlayer: {
    marginTop: 8 * ratio,
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  viewBarWrapper: {
    marginTop: 1 * ratio,
    marginHorizontal: 25 * ratio,
    alignSelf: 'stretch'
  },
  viewBar: {
    backgroundColor: base.theme.colors.playprogressbar,
    height: 4 * ratio,
    alignSelf: 'stretch'
  },
  viewBarPlay: {
    backgroundColor: 'white',
    height: 4 * ratio,
    width: 0
  },

  secondview: {
    flexDirection: 'row',
    width: '100%',
    marginTop: hp('2%'),
  },
  mic: {
    width: hp('5%'),
    height: hp('5%'),
    marginLeft: hp('1%')
  },
  playcardstyle: {
    width: hp('5%'),
    height: hp('5%'),
    marginLeft: hp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp('1%')
  },
  thirdview: {},
  message: { marginHorizontal: hp('5%'), marginTop: hp('3 %') },
  messages: {
    fontWeight: 'bold',
    fontSize: hp('1.8%')
  },
  textbox: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: Dimensions.get('window').width - 100,
    padding: hp('2%'),
    margin: hp('2%'),
    borderRadius: hp('1.5%'),
    borderWidth: hp('0.1%'),
    borderColor: base.theme.colors.primary
  },
  notes: {}
});

export default Styles;
