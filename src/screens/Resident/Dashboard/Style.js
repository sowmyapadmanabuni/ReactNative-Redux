import { StyleSheet } from 'react-native';
import base from '../../../base';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: hp('2.8%'),
    backgroundColor:'white'
  },
  dropDownContainer: {
    // flex:1,
    height: '7.5%',
    marginLeft: 10,
    width: '95%',
    flexDirection: 'row'
  },
  leftDropDown: {
    width: '70%'
  },
  rightDropDown: {
    width: '30%'
  },
  bottomCards: {
    height: '13%',
    width: '95%',
    borderRadius:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
    alignItems: 'center',
    backgroundColor:"#FFFFFF"
  },
  supportContainer: {
    height: '6%',
    width: '90%',
    alignItems: 'center',
    backgroundColor: base.theme.colors.white,
    borderColor: base.theme.colors.primary,
    borderWidth: 1,
    bottom: hp('4'),
    justifyContent: 'center',
    flexDirection: 'row'
  },
  supportIcon: {
    height: 30,
    width: 30,
    alignSelf: 'center'
  },
  elevatedView: {
    alignItems: 'center',
    height: '30%',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  elevatedViewSub: {
    marginTop: 30,
    height: '20%',
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: '65%',
    alignSelf: 'center'
  },
  mainElevatedView: {
    alignSelf:'center',
    height: '50%',
    width: '95%',
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 15,
    backgroundColor: base.theme.colors.transparent
  },
  invoiceCardView: {
    height: '95%',
    width: '95%',
    borderRadius: 5,
    margin: 10,
    marginTop:'10%',
    backgroundColor: base.theme.colors.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: base.theme.colors.lightgrey
  },
  invoiceHeadingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    margin: 5,
    marginBottom: 12,
    marginTop: 8
  },
  invoiceText: {
    color: base.theme.colors.black,
    fontSize: 14
  },
  viewMoreText: {
    color: base.theme.colors.blue,
    fontSize: 14
  },
  invoiceView: {
    width: '100%',
    height: 70,
    backgroundColor: base.theme.colors.cardBackground,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6
  },
  invoiceSubView: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  subSupportView: {
    height: '100%',
    width: '45%',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    top:hp('2')
  },
  invoiceNumberText: {
    fontSize: 14,
    color: base.theme.colors.black
  },
  dueDate: {
    fontSize: 14,
    color: base.theme.colors.themeColor
  },
  rupeeIcon: {
    fontSize: 18,
    color: base.theme.colors.themeColor
  },
  billText: {
    fontSize: 18,
    color: base.theme.colors.black,
    fontWeight: 'bold'
  },
  inVoiceFlatList: {
    height: '100%',
    width: '100%'
  },
  scrollView: {
    height: '80%',
    width: '95%'
  },
  noDataMsg: {
    fontSize: 18,
    color: base.theme.colors.grey
  },
  noDataView: {
    height: '80%',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Style;
