import { StyleSheet, Dimensions, PixelRatio } from "react-native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"

const Style = StyleSheet.create({
  scrollViewStyle: {
    flex: 1
  },
  viewStyle: {
    backgroundColor: "#fff",
    height: hp("8%"),
    width: Dimensions.get("screen").width,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: "relative"
  },
  image: {
    width: wp("24%"),
    height: hp("10%")
  },
  emptyViewStyle: {
    flex: 1
  },
  contaianer: {
    flex: 1,
    paddingHorizontal: hp("1.4%"),
    backgroundColor: "#fff",
    flexDirection: "column"
  },

  containerImageView: {
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "white",
    alignSelf: "center",
    flexDirection: "row",
    borderColor: "orange"
  },
  viewForProfilePicImageStyle: {
    width: wp("15%"),
    height: hp("15%"),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
    marginLeft: hp("4%")
  },
  ImageContainer: {
    width: 110,
    height: 110,
    borderColor: "orange",
    borderRadius: 55,
    borderWidth: hp("0.2%") / PixelRatio.get()
  },
  smallImage: {
    width: 30,
    height: 30,
    justifyContent: "flex-start",
    alignItems: "flex-end"
    //alignItems: center
  },
  imagesmallCircle: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    width: 10,
    height: 10,
    marginTop: 50,
    marginLeft: hp("2.8%")
  },

  myFamilyTitleOfScreen: {
    marginTop: hp("2%"),
    marginBottom: hp("2%"),
    textAlign: "center",
    fontSize: hp("2.5%"),
    fontWeight: "500",
    color: "#FF8C00"
  },

  familyDetailsView: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("1.5%"),
    marginTop: hp("3%")
  },
  familyDetailsFont: {
    fontSize: hp("2.1%"),
    color: "orange",
    fontWeight: "400"
  },

  inputItem: {
    marginTop: wp("2%"),
    marginLeft: wp("4%"),
    marginRight: wp("4%"),
    borderColor: "#909091"
  },
  inputItemMobile: {
    marginBottom: wp("0.2%"),
    marginLeft: wp("4%"),
    marginRight: wp("4%"),
    borderColor: "#909091"
  },

  relationshipAndAgeView: {
    flexDirection: "row"
  },
  countryPickerandMobileView: {
    flexDirection: "row"
  },
  myFamilyMobileView: {
    width: "70%"
  },
  myFamilyCountryCodeView: {
    width: "30%"
  },
  myFamilyRelationshipView: {
    width: "60%"
  },
  myFamilyAgeView: {
    width: "40%"
  },
  myFamilyName: {
    height: hp("7%")
  },
  myFamilyMobileNo: {
    height: hp("7.5%")
  },
  editProfileCardEmail: {
    height: hp("7.5%")
  },
  editProfileCardAlternateEmail: {
    height: hp("7.5%")
  },
  fontForLabel: {
    fontSize: hp("2%"),
    marginBottom: hp("3%"),
    fontWeight: "300",
    color: "#909091"
  },
  viewForPaddingAboveAndBelowButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: hp("6%"),
    marginBottom: hp("2%"),
    marginHorizontal: hp("2%")
  },
  buttonFamily: {
    width: wp("25%"),
    height: hp("5%"),
    borderRadius: hp("2.5%"),
    borderWidth: hp("0.2%"),
    borderColor: "#EF3939",
    backgroundColor: "#EF3939",
    justifyContent: "center"
  },
  textFamilyVehicle: {
    color: "white",
    fontWeight: "600",
    fontSize: hp("2.2%")
  },
  buttonVehicle: {
    width: wp("25%"),
    height: hp("5%"),
    borderRadius: hp("2.5%"),
    borderWidth: hp("0.2%"),
    borderColor: "orange",
    backgroundColor: "orange",
    justifyContent: "center"
  },
  myProfileCardsStyle: {
    marginTop: hp("0.6%"),
    paddingHorizontal: hp("1.5%"),
    paddingVertical: hp("0.3%"),
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: hp("7%")
  },
  itemTextTitles: {
    fontSize: hp("1.8%"),
    fontWeight: "300",
    // fontStyle: "italic",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: hp("0.2%"),
    color: "#474749"
    // paddingLeft: hp("0.8%")
  },
  itemTextValues: {
    fontSize: hp("2%"),
    fontWeight: "400",
    paddingTop: hp("0.3%"),
    paddingHorizontal: hp("0.2%"),
    paddingBottom: hp("0.2%"),
    alignItems: "flex-start",
    justifyContent: "flex-start",
    color: "#000000"
  },
  countryForm: {
    alignItems: "center",
    justifyContent: "center"
  },
  countryPickerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("1.5%")
  },
  callingCodeView: {
    marginLeft: hp("2%"),
    justifyContent: "center",
    alignItems: "center"
  },
  callingCodeText: {
    color: "black",
    fontSize: hp("2%"),
    marginLeft: hp("0.2%")
  },
  dropdownView: {
    paddingLeft: hp("0.5%"),
    marginTop: hp("-1.8%"),
    paddingRight: hp("0.5%"),
    marginBottom: hp("1%")
  },
  number: {
    flexDirection: "row",
    width: Dimensions.get("screen").width,
    justifyContent: "center",
    alignItems: "center"
  },
  inputItem1: {
    flex: 0.65,
    flexDirection: "row",
    marginTop: wp("2%"),
    marginLeft: wp("3%"),
    marginRight: wp("4%"),
    borderColor: "#909091"
  }
})

export default Style
