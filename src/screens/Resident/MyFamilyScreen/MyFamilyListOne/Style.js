import { Dimensions, StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';

const Style = StyleSheet.create({
  progressViewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewStyle: {
    backgroundColor: '#fff',
    height: 60,
    width: Dimensions.get('screen').width,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  },
  image: {
    width: 100,
    height: 45
  },
  emptyViewStyle: {
    flex: 1
  },

  mainView: {
    flex: 1
  },
  containerViewStyle: {
    height: hp('90%'),
    width: wp('100%')
  },

  titleOfScreenStyle: {
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
    textAlign: 'center',
    fontSize: hp('2.3%'),
    fontWeight: '500',
    color: '#FF8C00'
  },
  searchTextStyle: {
    height: hp('5.5%'),
    borderWidth: hp('0.2%'),
    borderRadius: hp('3%'),
    borderColor: '#f4f4f4',
    marginHorizontal: hp('1%'),
    marginBottom: hp('2%'),
    paddingLeft: hp('3%'),
    fontSize: hp('1.8%'),
    backgroundColor: '#f4f4f4'
  },
  lineAboveAndBelowFlatList: {
    backgroundColor: 'lightgray',
    height: hp('0.1%')
  },
  floatButton: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
    width: hp('6.5%'),
    position: 'absolute',
    bottom: hp('5%'),
    right: hp('3.5%'),
    height: hp('6.5%'),
    backgroundColor: '#FF8C00',
    borderRadius: hp('4.5%'),
    // shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 0.6
  },
 
  plusTextStyle: {
    fontSize: hp('4%'),
    color: '#fff',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: hp('0.5%')
  },
  tableView: {
    flexDirection: 'column'
  },
  cellView: {
    flexDirection: 'row',
    marginLeft: wp('3%'),
    marginRight: wp('4%'),
    marginVertical: hp('0.8%'),
    justifyContent: 'flex-start'
  },
  imageContainerViewStyle: {
    height: '20%',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  mainCardItemImage: {
    height: wp('20%'),
    width: wp('20%'),
    borderRadius: wp('20%') / 2,
    borderColor: 'orange',
    borderWidth: hp('0.1%')
  },
  mainCardItemImage01: {
    height: wp('80%'),
    width: wp('80%')
  },
  mainCardItemZoomImage: {
    height: wp('40%'),
    width: wp('40%'),
    borderRadius: wp('40%') / 2,
    borderColor: 'orange',
    borderWidth: hp('0.3%')
  },
  middleFlexBlockForMemberDetailsViewContainer: {
    flex: 5,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: hp('1%')
  },
  familyMemberNameTextStyle: {
    fontSize: hp('2.2%'),
    fontWeight: '500',
    marginTop: hp('0.4%'),
    marginBottom: hp('0.6%')
  },
  memberDetailFlexViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginTop: hp('0.4%')
  },
  memberDetailIconImageStyle: {
    width: wp('3.4%'),
    height: wp('3.4%')
  },
  memberDetailsTextStyle: {
    fontSize: hp('1.8%'),
    color: '#909091',
    marginLeft: wp('2%')
  },
  editAndCallIconsFlexStyle: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    //alignSelf: "center",
    justifyContent: 'space-between'
  },
  editAndCallButtonIconImageStyle: {
    height: wp('6%'),
    width: wp('6%')
    //margin: hp("1%")
  },
  inputItem: {
    marginTop: wp('1%'),
    marginLeft: wp('4%'),
    marginRight: wp('4%'),
    //borderColor: "#909091"
    borderColor: '#000000',
    width: '90%'
  },
  placeholderImage: {
    height: wp('20%'),
    width: wp('20%'),
    borderRadius: wp('20%') / 2,
    borderColor: 'orange',
    borderWidth: hp('0.1%')
  },
  threeBtnStyle: {
    // borderColor: "gray",
    // borderWidth: hp("0.03%"),
    width: hp('3%'),
    height: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center'
  },
  formSearch: {
    marginBottom: hp('1%')
  },
  icon: {
    marginRight: hp('1.6%')
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
  image1: {
    width: wp('34%'),
    height: hp('18%'),
    marginRight: hp('3%')
  },

  viewDetails1: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 3
  },
  centerEmptySet: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  viewDetails2: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: hp('3%'),
    height: hp('3%'),
    marginTop: 5
    // marginLeft: 10
  }
});

export default Style;
