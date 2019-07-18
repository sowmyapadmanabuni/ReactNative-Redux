import React, { Component } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform
} from "react-native"

import { Card, Form, Input, Button, Item, Label } from "native-base"
import ImagePicker from "react-native-image-picker"
import { Dropdown } from "react-native-material-dropdown"

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { RadioGroup, RadioButton } from "react-native-flexi-radio-button"

import Style from "./Style"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"
import CountryPicker, {
  getAllCountries
} from "react-native-country-picker-modal"
import RNFetchBlob from "rn-fetch-blob"
import base from "../../../../base"
import { connect } from "react-redux";

let data = [
  {
    value: "Parents",
    id: 1
  },
  {
    value: "Siblings",
    id: 2
  },
  {
    value: "Child",
    id: 3
  },
  {
    value: "Relative ",
    id: 4
  },
  {
    value: "Other",
    id: 5
  }
]

class MyFamilyEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Family_Name: "",
      Mobile_No: "",
      Relation: "",
      Age: "",
      Image: "",
      ImageSource: null,
      data1: [],
      Fmid: "",

      cca2: "",
      callingCode: "",
      photo: null,
      photoDetails: null,
      minor: false
    }
  }

  FName = family_name => {
    this.setState({ Family_Name: family_name })
  }

  FMobileNum = mobile_no => {
    this.setState({ Mobile_No: mobile_no })
  }

  FRelations = relation => {
    this.setState({ Relation: relation })
  }

  FAge = age => {
    this.setState({ Age: age })
  }

  FMid = fmid => {
    this.setState({ Fmid: fmid })
  }

  FCallingCode = callingcode => {
    this.setState({ callingCode: callingcode })
  }

  FCca2 = cca2 => {
    this.setState({ cca2: cca2 })
  }

  async myFamilyUpdate() {
    const {
      myFamilyName,
      myFamilyMobileNo,
      myFamilyAge,
      myFamilyRelation,
      myFamilyFmid,
      myFamilyCallingcode,
      myFamilyCca2
    } = this.props.navigation.state.params

    fname = this.state.Family_Name
    fage = this.state.Age
    fmobilenum = this.state.Mobile_No
    frelation = this.state.Relation
    fmid = this.state.Fmid
    callingCode = this.state.callingCode
    cca2 = this.state.cca2

    const { photo } = this.state
    const data = new FormData()

    data.append("photo", {
      name: photo.fileName,
      type: photo.type,

      uri:
        Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
    })
    //validations
    const reg = /^[0]?[6789]\d{9}$/
    const OyeFullName = /^[a-zA-Z ]+$/

    if (fname.length == 0) {
      Alert.alert("Name should not be empty")
    } else if (OyeFullName.test(fname) === false) {
      alert("Enter valid Name")
      return false
    } else if (fname.length < 3) {
      Alert.alert("Name should be more than 3 letters")
    } else if (fmobilenum.length == 0) {
      Alert.alert("MobileNumber cannot be empty")
    } else if (fmobilenum.length < 10) {
      Alert.alert("MobileNumber Should be 10 digits")
    } else if (reg.test(fmobilenum) === false) {
      alert("Enter valid Mobile Number")
      return false
    } else if (frelation.length == 0) {
      Alert.alert("Relation should not be empty")
    } else if (fage.length == 0) {
      Alert.alert("Age should not be empty")
    } else if (fage < 1) {
      Alert.alert("Age cannot be less than 1")
    } else if (fage > 150) {
      Alert.alert("Age cannot be grater than 150")
    } else {
      let input = {
        FMName: fname.length <= 0 ? myFamilyName : fname,
        FMMobile:
          "+" + callingCode + fmobilenum.length <= 0
            ? myFamilyMobileNo
            : callingCode + fmobilenum,
        FMISDCode: callingCode.length <= 0 ? myFamilyCallingcode : callingCode,
        MEMemID: 2,
        UNUnitID: this.props.dashBoardReducer.uniID,
        FMRltn: frelation.length <= 0 ? myFamilyRelation : frelation,
        FMImgName: photo.fileName,

        FMAge: fage.length <= 0 ? myFamilyAge : fage,
        FMID: fmid <= 0 ? myFamilyFmid : fmid,
        FMFlag: cca2.length <= 0 ? myFamilyCca2 : cca2
      }

      let editFamilyMember = await base.services.OyeSafeApiFamily.myFamilyEditMember(
        input
      )
      console.log("Edit Family Member", editFamilyMember)

      try {
        if (editFamilyMember) {
          this.props.navigation.goBack()

          RNFetchBlob.config({
            trusty: true
          })
            .fetch(
              "POST",
              "http://mediaupload.oyespace.com/oyeliving/api/V1/association/upload",
              {
                "Content-Type": "multipart/form-data",
                "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
              },

              [
                {
                  name: "oyespace",
                  filename: this.state.photoDetails.fileName,
                  type: this.state.photoDetails.type,
                  data: this.state.photoDetails.data // this is a base 64 string
                }
              ]
            )

            .catch(err => {
              console.log("RNFetchBlob err = ", err)
            })
        }
      } catch {}
    }
  }

  componentWillMount() {
    this.setState({
      Family_Name: this.props.navigation.state.params.myFamilyName
        ? this.props.navigation.state.params.myFamilyName
        : ""
    })

    this.setState({
      Mobile_No: this.props.navigation.state.params.myFamilyMobileNo
        ? this.props.navigation.state.params.myFamilyMobileNo
        : ""
    })

    this.setState({
      Relation: this.props.navigation.state.params.myFamilyRelation
        ? this.props.navigation.state.params.myFamilyRelation
        : ""
    })

    this.setState({
      Age: this.props.navigation.state.params.myFamilyAge
        ? this.props.navigation.state.params.myFamilyAge
        : ""
    })
    this.setState({
      callingCode: this.props.navigation.state.params.myFamilyCallingcode
        ? this.props.navigation.state.params.myFamilyCallingcode
        : ""
    })
    this.setState({
      cca2: this.props.navigation.state.params.myFamilyCca2
        ? this.props.navigation.state.params.myFamilyCca2
        : ""
    })
  }

  selectPhotoTapped() {
    const options = {
      quality: 0.5,
      maxWidth: 250,
      maxHeight: 250,
      storageOptions: {
        skipBackup: true
      }
    }

    ImagePicker.launchImageLibrary(options, response => {
      console.log("Response = ", response)

      if (response.didCancel) {
        console.log("User cancelled photo picker")
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error)
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton)
      } else {
        // You can also display the image using data:
        // let source = { uri: "data:image/jpeg;base64," + response.data };
        let source = { uri: response.uri }

        this.setState({ photo: response, photoDetails: response })
        //this.setState({ photo: response })
      }
    })
  }

  onSelect(index, value) {
    // this.setState({
    //   text: `${value}`
    // })
    if (value === "Yes") {
      this.setState({ minor: true })
    } else {
      this.setState({ minor: false })
    }
  }

  render() {
    const { photo } = this.state
    console.log("photo_____")
    return (
      <View style={{ flex: 1 }}>
        {/* <Header /> */}

        <SafeAreaView style={{ backgroundColor: "orange" }}>
          <View style={[Style.viewStyle, { flexDirection: "row" }]}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginLeft: 20
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack()
                }}
              >
                <Image
                  source={require("../../../../../icons/backBtn.png")}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flex: 3,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={[Style.image]}
                source={require("../../../../../icons/headerLogo.png")}
              />
            </View>
            <View style={Style.emptyViewStyle} />
          </View>
          <View style={{ borderWidth: 1, borderColor: "orange" }} />
        </SafeAreaView>
        <KeyboardAwareScrollView>
          <View style={Style.contaianer}>
            <View style={Style.textWrapper}>
              <Text style={Style.myFamilyTitleOfScreen}>
                {" "}
                Edit Family Member{" "}
              </Text>
              <ScrollView style={Style.scrollViewStyle}>
                <View style={Style.containerImageView}>
                  <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                    <View style={Style.viewForProfilePicImageStyle}>
                      {this.state.photo == null ? (
                        <Image
                          style={Style.ImageContainer}
                          source={require("../../../../../icons/camwithgradientbg.png")}
                        />
                      ) : (
                        <Image
                          style={Style.ImageContainer}
                          source={{ uri: photo.uri }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                    <View style={Style.imagesmallCircle}>
                      <Image
                        style={[Style.smallImage]}
                        source={require("../../../../../icons/cam_with_gray_bg.png")}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={Style.familyDetailsView}>
                  <Text style={Style.familyDetailsFont}>Family Details</Text>
                </View>

                <Form>
                  <Item style={Style.inputItem} stackedLabel>
                    <Dropdown
                      containerStyle={{
                        flex: 1,
                        width: wp("90%"),
                        //marginLeft: hp("2%"),
                        height: hp("3%")
                        //marginRight: hp("2%")
                      }}
                      //placeholder={hp("3.2%")}
                      dropdownPosition={-6}
                      // defaultIndex={-1}
                      //label="Select Account Type"
                      placeholder="Relationship *"
                      labelHeight={hp("4%")}
                      style={{ fontSize: hp("2.2%") }}
                      //value={data.vlaue}

                      textColor="#3A3A3C"
                      data={data}
                      inputContainerStyle={{
                        borderBottomColor: "transparent"
                      }}
                      onChangeText={this.FRelations}
                      value={this.state.Relation}
                    />
                  </Item>

                  <Item style={Style.inputItem} stackedLabel>
                    <Label style={{ marginRight: hp("0.6%") }}>
                      First Name
                      <Text
                        style={{
                          fontSize: hp("2.2%"),
                          textAlignVertical: "center",
                          color: "red"
                        }}
                      >
                        *
                      </Text>
                    </Label>
                    <Input
                      marginBottom={hp("-1%")}
                      placeholder="First Name"
                      multiline={false}
                      autoCorrect={false}
                      autoCapitalize="words"
                      keyboardType="default"
                      maxLength={50}
                      textAlign={"justify"}
                      defaultValue={
                        this.props.navigation.state.params.myFamilyName
                          ? this.props.navigation.state.params.myFamilyName
                          : ""
                      }
                      value={this.state.FName}
                      onChangeText={this.FName}
                    />
                  </Item>

                  <Item style={Style.inputItem} stackedLabel>
                    <Label style={{ marginRight: hp("0.6%") }}>
                      Last Name
                      <Text
                        style={{
                          fontSize: hp("2.2%"),
                          textAlignVertical: "center",
                          color: "red"
                        }}
                      >
                        *
                      </Text>
                    </Label>
                    <Input
                      marginBottom={hp("-1%")}
                      placeholder="Last Name"
                      multiline={false}
                      autoCorrect={false}
                      autoCapitalize="words"
                      keyboardType="default"
                      maxLength={50}
                      textAlign={"justify"}
                      defaultValue={
                        this.props.navigation.state.params.myFamilyName
                          ? this.props.navigation.state.params.myFamilyName
                          : ""
                      }
                      value={this.state.FName}
                      onChangeText={this.FName}
                    />
                  </Item>

                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "space-around",
                      flexDirection: "row",
                      marginTop: hp("0.5%"),
                      marginBottom: hp("0.5%"),
                      height: hp("5%")
                    }}
                  >
                    <Text
                      style={{
                        fontSize: hp("2.2%"),
                        textAlignVertical: "center"
                      }}
                    >
                      Minor
                    </Text>
                    <RadioGroup
                      style={{ flexDirection: "row" }}
                      onSelect={(index, value) => this.onSelect(index, value)}
                    >
                      <RadioButton value={"Yes"}>
                        <Text>Yes</Text>
                      </RadioButton>

                      <RadioButton value={"No"}>
                        <Text>No</Text>
                      </RadioButton>
                    </RadioGroup>
                  </View>

                  {this.state.minor == true ? (
                    <Item style={Style.inputItem} stackedLabel>
                      <Label style={{ marginRight: hp("0.6%") }}>
                        Gardien's Name
                        <Text
                          style={{
                            fontSize: hp("2.2%"),
                            textAlignVertical: "center",
                            color: "red"
                          }}
                        >
                          *
                        </Text>
                      </Label>
                      <Input
                        marginBottom={hp("-1%")}
                        placeholder="Enter Gardien's Name"
                        multiline={false}
                        autoCorrect={false}
                        autoCapitalize="words"
                        keyboardType="default"
                        maxLength={50}
                        textAlign={"justify"}
                        value={this.state.FName}
                        onChangeText={this.FName}
                        defaultValue={
                          this.props.navigation.state.params.myFamilyName
                            ? this.props.navigation.state.params.myFamilyName
                            : ""
                        }
                      />
                    </Item>
                  ) : (
                    <Text />
                  )}

                  <View style={Style.number}>
                    <View
                      style={{
                        flex: 0.1,
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <CountryPicker
                        onChange={value => {
                          this.setState({
                            cca2: value.cca2,
                            callingCode: "+" + value.callingCode
                          })
                        }}
                        //cca2={this.state.cca2}
                        cca2={this.state.cca2}
                        translation="eng"
                      />
                    </View>

                    <View
                      style={{
                        flex: 0.15,
                        flexDirection: "row",
                        marginLeft: hp("0.5%"),
                        alignItems: "center",
                        marginBottom: hp("-0.8%")
                      }}
                    >
                      <Text style={{ color: "black", fontSize: hp("2%") }}>
                        {this.state.callingCode}
                      </Text>
                    </View>

                    <Item style={Style.inputItem1} stackedLabel>
                      {/* <Label style={{ marginRight: hp("0.6%") }}>
                          {" "}
                          Mobile Number
                        </Label> */}
                      <Input
                        marginTop={hp("-0.5%")}
                        placeholder="Mobile Number"
                        autoCorrect={false}
                        keyboardType="number-pad"
                        maxLength={20}
                        onChangeText={this.FMobileNum}
                        value={this.state.FMobileNum}
                        defaultValue={
                          this.props.navigation.state.params.myFamilyMobileNo
                            ? this.props.navigation.state.params
                                .myFamilyMobileNo
                            : ""
                        }
                      />
                      {/* <Text
                          style={{
                            fontSize: hp("2.2%"),
                            textAlignVertical: "center",
                            color: "red"
                          }}
                        >
                          *
                        </Text> */}
                    </Item>
                  </View>
                </Form>

                <View style={Style.viewForPaddingAboveAndBelowButtons}>
                  <Button
                    bordered
                    dark
                    style={Style.buttonFamily}
                    onPress={() => {
                      this.props.navigation.navigate("MyFamilyLsit")
                    }}
                  >
                    <Text style={Style.textFamilyVehicle}>Cancel</Text>
                  </Button>
                  <Button
                    bordered
                    dark
                    style={Style.buttonVehicle}
                    onPress={() => {
                      this.myFamilyUpdate()
                    }}
                  >
                    <Text style={Style.textFamilyVehicle}>Save</Text>
                  </Button>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    associationid: state.DashboardReducer.associationid,
    selectedAssociation: state.DashboardReducer.selectedAssociation,
    oyeURL: state.OyespaceReducer.oyeURL,
    dashBoardReducer:state.DashboardReducer
  };
};

export default connect(mapStateToProps)(MyFamilyEdit);