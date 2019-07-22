import React, { Component } from "react"
import {
    AppRegistry,
    View,
    ImageBackground,
    StyleSheet,
    Text,
    Image,
    TouchableHighlight,
    KeyboardAvoidingView,
    TouchableOpacity,
    PixelRatio,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    Dimensions,
    SafeAreaView,
    Platform, TextInput
} from "react-native"

import { Card, Form, Item, Input, Label, Button, CardItem } from "native-base"
import ImagePicker from "react-native-image-picker"
import { Dropdown } from "react-native-material-dropdown"
import axios from "axios"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { NavigationEvents } from "react-navigation"
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

import { RadioGroup, RadioButton } from "react-native-flexi-radio-button"

//import Contacts from "react-native-contacts"
import ContactsWrapper from "react-native-contacts-wrapper"

import Contacts from "react-native-contacts"
import RadioForm, {RadioButtonInput, RadioButtonLabel} from "react-native-simple-radio-button";

//var radio_props = [{ label: "Yes", value: 0 }, { label: "No", value: 1 }]


let data = [
    {
        value:"Spouse",
        id:0
    },
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

class backup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Family_Name: "",
            Mobile_No: "",
            Relation: "",
            Age: "",
            Image: "",
            // ImageSource: null,
            data1: [],
            cca2: "IN",
            callingCode: "91",
            //data: null,
            photo: null,
            photoDetails: null,
            dataSource: [],
            dataSource1: "",
            minor: false,
            phoneNumbersList:[],
            fName:'',
            lName:'',
            mobileNumber:''
        }
        //this.arrayholder = []
        this.getTheContact = this.getTheContact.bind(this);


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

    FImage = image => {
        this.setState({ Image: image })
    }
    FCallingCode = callingcode => {
        this.setState({ callingCode: callingcode })
    }
    FCca2 = cca2 => {
        this.setState({ cca2: cca2 })
    }

    myFamilySendData = () => {
        let fname = this.state.Family_Name
        let fage = this.state.Age
        let fmobilenum = this.state.Mobile_No
        let frelation = this.state.Relation
        //fimage = this.state.ImageSource
        let callingCode = this.state.callingCode
        let  cca2 = this.state.cca2
        let photo = this.state.photo
        //validations

        // console.log(data, "787878787878788788778");
        console.log(photo, "787878787878788788778")

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
        }
        // else if (fage.length == 0) {
        //   Alert.alert("Age should not be empty")
        // } else if (fage < 1) {
        //   Alert.alert("Age cannot be less than 1")
        // } else if (fage > 150) {
        //   Alert.alert("Age cannot be grater than 150")
        // }
        else if (photo === null) {
            alert("Upload photo")
            return false
        } else {
            this.mobileNumber()
            return
        }
    }
    //this.arrayholder = responseJson.data.familyMembers.fmMobile

    async myFamilyPostData() {
        let input = {
            // myFamilyName,
            FMImgName: photo.fileName,
            //this.state.photoDetails.fileName,

            FMName: fname,
            FMAge: fage,
            FMMobile: fmobilenum,
            FMISDCode: "+" + callingCode,
            UNUnitID: this.props.dashBoardReducer.uniID,
            // FMImgName:
            //   fimage.length <= 0 ? this.state.ImageSource : fimage,
            FMRltn: frelation,
            ASAssnID: this.props.dashBoardReducer.assId,
            FMFlag: cca2
        }

        let addFamilyMember = await base.services.OyeSafeApiFamily.myFamilyAddMember(
            input
        )
        console.log("My Family", addFamilyMember)

        try {
            if (addFamilyMember) {
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

    async mobileNumber() {
        let myFamilyList = await base.services.OyeSafeApiFamily.myFamilyList(4, 2)
        try {
            if (myFamilyList && myFamilyList.data) {
                let Mobile_No = "+" + this.state.callingCode + this.state.Mobile_No
                var count = Object.keys(responseJson.data.familyMembers).length
                for (var i = 0; i < count; i++) {
                    if (Mobile_No === responseJson.data.familyMembers[i].fmMobile) {
                        alert("Mobile Number already used")
                        return
                    }
                }
                this.myFamilyPostData()
            }
        } catch (error) {
            base.utils.logger.log(error)
        }
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
        //showImagePicker
        ImagePicker.launchImageLibrary(options, response => {
            // console.log("Response = ", response);

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

                // CameraRoll.saveToCameraRoll(data.uri)

                this.setState({ photo: response, photoDetails: response })
                console.log(this.state.photoDetails)
                //this.setState({ photo: response })
            }
        })
    }

    // onPressPhoneBook = () => {
    //   // Get all contacts
    //   simpleContacts.getContacts().then(contacts => {
    //     // Do something with the contacts
    //     console.log(contacts)
    //   })
    // }

    // onContactSelect() {
    //   ContactsWrapper.getContact()
    //     .then(contact => {
    //       this.setState({
    //         importingContactInfo: true,
    //         guest: contact.name,
    //         email: contact.email,
    //         phone: contact.phone
    //       })
    //     })
    //     .catch(error => {
    //       console.log("ERROR CODE: ", error.code)
    //       console.log("ERROR MESSAGE: ", error.message)
    //     })
    // }

    // openContactPicker = () => {
    //   let number = "8008883210" //replace with any number
    //   let newPerson = {
    //     phoneNumbers: [
    //       {
    //         label: "mobile",
    //         number: number
    //       }
    //     ]
    //   }

    //   Contacts.openContactForm(newPerson, err => {
    //     if (err) console.warn(err)
    //     // form is open
    //   })
    // }
    onSelect(index, value) {
        if (value === "Yes") {
            this.setState({ minor: true })
        } else {
            this.setState({ minor: false })
        }
    }

    render() {
        const { navigate } = this.props.navigation
        const { photo } = this.state
        console.log("photo_____111")
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss()
                }}
            >
                <View style={{ flex: 1 }}>
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
                                    Add Family Member
                                </Text>
                                <ScrollView style={Style.scrollViewStyle}>
                                    <View style={Style.containerImageView}>
                                        <TouchableOpacity
                                            onPress={this.selectPhotoTapped.bind(this)}
                                        >
                                            <View style={Style.viewForProfilePicImageStyle}>
                                                {this.state.photo === null ? (
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

                                        <TouchableOpacity
                                            onPress={this.selectPhotoTapped.bind(this)}
                                        >
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
                                            />
                                        </Item>
                                        {/* <Text style={{ marginLeft: hp("2.5%"), color: "#909091" }}>
                      First Name
                    </Text> */}
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
                                                placeholder="Enter First Name"
                                                multiline={false}
                                                autoCorrect={false}
                                                autoCapitalize="words"
                                                keyboardType="default"
                                                maxLength={50}
                                                textAlign={"justify"}
                                                value={this.state.fName}
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
                                                placeholder="Enter Last Name"
                                                multiline={false}
                                                autoCorrect={false}
                                                autoCapitalize="words"
                                                keyboardType="default"
                                                maxLength={50}
                                                textAlign={"justify"}
                                                value={this.state.lName}
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
                                            <Item style={Style.inputItemMobile} stackedLabel>
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
                                                />
                                            </Item>
                                        ) : (
                                            <Text />
                                        )}
                                        {/* <RadioForm
                      radio_props={radio_props}
                      initial={0}
                      formHorizontal={true}
                      labelHorizontal={true}
                      buttonColor={"orange"}
                      labelColor={"orange"}
                      animation={true}
                      onPress={value => {
                        this.setState({ value: value })
                      }}
                    /> */}

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
                                                    +{this.state.callingCode}
                                                </Text>
                                            </View>

                                            <Item style={Style.inputItem1} stackedLabel>
                                                {/* <Label style={{ marginRight: hp("0.6%") }}>
                          {" "}
                          Mobile Number
                        </Label> */}
                                                <Input
                                                    //marginTop={hp("-0.5%")}
                                                    placeholder="Mobile Number"
                                                    autoCorrect={false}
                                                    keyboardType="number-pad"
                                                    maxLength={20}
                                                    onChangeText={this.FMobileNum}
                                                    value={this.state.mobileNumber}
                                                />
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.getTheContact()
                                                    }}
                                                >
                                                    <Image
                                                        source={require("../../../../../icons/phone-book.png")}
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            marginTophp: hp("-0.5%")
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </Item>
                                        </View>
                                    </Form>

                                    <View style={Style.viewForPaddingAboveAndBelowButtons}>
                                        <Button
                                            bordered
                                            dark
                                            style={Style.buttonFamily}
                                            onPress={() => {
                                                this.props.navigation.goBack()
                                            }}
                                        >
                                            <Text style={Style.textFamilyVehicle}>Cancel</Text>
                                        </Button>
                                        <Button
                                            bordered
                                            dark
                                            style={Style.buttonVehicle}
                                            onPress={() => this.myFamilySendData()}
                                        >
                                            <Text style={Style.textFamilyVehicle}>Update</Text>
                                        </Button>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    getTheContact() {
        console.log('Get details')

        ContactsWrapper.getContact()
            .then((contact) => {
                // Replace this code
                console.log('get Selected',contact);
                let name=contact.name.split(" ")
                console.log('Fname::',name)
                let mobNum=contact.phone.match(/\d+/)
                console.log('GGGGG',mobNum)
                this.setState({
                    fName:name[0],
                    lName:name[1] !==""? name[1]:'',
                    mobileNumber:contact.phone
                })
            })
            .catch((error) => {
                console.log("ERROR CODE: ", error.code);
                console.log("ERROR MESSAGE: ", error.message);
            });
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

export default connect(mapStateToProps)(MyFamily);


/* myFamilySendData = () => {

  }

  async myFamilyPostData() {
    let input = {
      // myFamilyName,
      FMImgName: photo.fileName,
      //this.state.photoDetails.fileName,

      FMName: fname,
      FMAge: fage,
      FMMobile: fmobilenum,
      FMISDCode: "+" + callingCode,
      UNUnitID: this.props.dashBoardReducer.uniID,
      // FMImgName:
      //   fimage.length <= 0 ? this.state.ImageSource : fimage,
      FMRltn: frelation,
      ASAssnID: this.props.dashBoardReducer.assId,
      FMFlag: cca2
    }

    let addFamilyMember = await base.services.OyeSafeApiFamily.myFamilyAddMember(
      input
    )
    console.log("My Family", addFamilyMember)

    try {
      if (addFamilyMember) {
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

  async mobileNumber() {
    let myFamilyList = await base.services.OyeSafeApiFamily.myFamilyList(4, 2)
    try {
      if (myFamilyList && myFamilyList.data) {
        let Mobile_No = "+" + this.state.callingCode + this.state.Mobile_No
        var count = Object.keys(responseJson.data.familyMembers).length
        for (var i = 0; i < count; i++) {
          if (Mobile_No === responseJson.data.familyMembers[i].fmMobile) {
            alert("Mobile Number already used")
            return
          }
        }
        this.myFamilyPostData()
      }
    } catch (error) {
      base.utils.logger.log(error)
    }
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
    //showImagePicker
    ImagePicker.launchImageLibrary(options, response => {
      // console.log("Response = ", response);

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

        // CameraRoll.saveToCameraRoll(data.uri)

        this.setState({ photo: response, photoDetails: response })
        console.log(this.state.photoDetails)
        //this.setState({ photo: response })
      }
    })
  }

  // onPressPhoneBook = () => {
  //   // Get all contacts
  //   simpleContacts.getContacts().then(contacts => {
  //     // Do something with the contacts
  //     console.log(contacts)
  //   })
  // }

  // onContactSelect() {
  //   ContactsWrapper.getContact()
  //     .then(contact => {
  //       this.setState({
  //         importingContactInfo: true,
  //         guest: contact.name,
  //         email: contact.email,
  //         phone: contact.phone
  //       })
  //     })
  //     .catch(error => {
  //       console.log("ERROR CODE: ", error.code)
  //       console.log("ERROR MESSAGE: ", error.message)
  //     })
  // }

  // openContactPicker = () => {
  //   let number = "8008883210" //replace with any number
  //   let newPerson = {
  //     phoneNumbers: [
  //       {
  //         label: "mobile",
  //         number: number
  //       }
  //     ]
  //   }

  //   Contacts.openContactForm(newPerson, err => {
  //     if (err) console.warn(err)
  //     // form is open
  //   })
  // }
  onSelect(index, value) {
    if (value === "Yes") {
      this.setState({ minor: true })
    } else {
      this.setState({ minor: false })
    }
    const { navigate } = this.props.navigation
    const { photo } = this.state


  }*/

{/*<TouchableWithoutFeedback*/}
{/*    onPress={() => {*/}
{/*        Keyboard.dismiss()*/}
{/*    }}*/}
{/*>*/}
{/*    <View style={{ flex: 1 }}>*/}
{/*        <KeyboardAwareScrollView>*/}
{/*            <View style={Style.contaianer}>*/}
{/*                <View style={Style.textWrapper}>*/}
{/*                    <Text style={Style.myFamilyTitleOfScreen}>*/}
{/*                        Add Family Member*/}
{/*                    </Text>*/}
{/*                    <ScrollView style={Style.scrollViewStyle}>*/}
{/*                        <View style={Style.containerImageView}>*/}
{/*                            <TouchableOpacity*/}
{/*                                onPress={this.selectPhotoTapped.bind(this)}*/}
{/*                            >*/}
{/*                                <View style={Style.viewForProfilePicImageStyle}>*/}
{/*                                    {this.state.photo === null ? (*/}
{/*                                        <Image*/}
{/*                                            style={Style.ImageContainer}*/}
{/*                                            source={require("../../../../../icons/camwithgradientbg.png")}*/}
{/*                                        />*/}
{/*                                    ) : (*/}
{/*                                        <Image/>*/}
{/*                                    )}*/}
{/*                                </View>*/}
{/*                            </TouchableOpacity>*/}

{/*                            <TouchableOpacity*/}
{/*                                onPress={this.selectPhotoTapped.bind(this)}*/}
{/*                            >*/}
{/*                                <View style={Style.imagesmallCircle}>*/}
{/*                                    <Image*/}
{/*                                        style={[Style.smallImage]}*/}
{/*                                        source={require("../../../../../icons/cam_with_gray_bg.png")}*/}
{/*                                    />*/}
{/*                                </View>*/}
{/*                            </TouchableOpacity>*/}
{/*                        </View>*/}

{/*                        <View style={Style.familyDetailsView}>*/}
{/*                            <Text style={Style.familyDetailsFont}>Family Details</Text>*/}
{/*                        </View>*/}

{/*                        <Form>*/}
{/*                            <Item style={Style.inputItem} stackedLabel>*/}
{/*                                <Dropdown*/}
{/*                                    value={this.state.relationName}*/}
{/*                                    data={this.state.relationList}*/}
{/*                                    textColor={base.theme.colors.black}*/}
{/*                                    inputContainerStyle={{*/}
{/*                                        borderBottomColor: "transparent"*/}
{/*                                    }}*/}
{/*                                    containerStyle={{*/}
{/*                                        flex: 1,*/}
{/*                                        width: wp("90%"),*/}
{/*                                        height: hp("3%")*/}
{/*                                    }}                          rippleOpacity={0}*/}
{/*                                    dropdownOffset={{top: 10, left: 0,}}*/}
{/*                                    onChangeText={(value, index) =>*/}
{/*                                        this.changeFamilyMember(value, index)*/}
{/*                                    }*/}

{/*                                    dropdownPosition={-6}*/}
{/*                                    placeholder="Relationship *"*/}
{/*                                    labelHeight={hp("4%")}*/}
{/*                                    style={{ fontSize: hp("2.2%") }}*/}
{/*                                />*/}
{/*                            </Item>*/}
{/*                             <Text style={{ marginLeft: hp("2.5%"), color: "#909091" }}>*/}
{/*                      First Name*/}
{/*                    </Text> */}
{/*                            <Item style={Style.inputItem} stackedLabel>*/}
{/*                                <Label style={{ marginRight: hp("0.6%") }}>*/}
{/*                                    First Name*/}
{/*                                    <Text*/}
{/*                                        style={{*/}
{/*                                            fontSize: hp("2.2%"),*/}
{/*                                            textAlignVertical: "center",*/}
{/*                                            color: "red"*/}
{/*                                        }}*/}
{/*                                    >*/}
{/*                                        **/}
{/*                                    </Text>*/}
{/*                                </Label>*/}
{/*                                <Input*/}
{/*                                    marginBottom={hp("-1%")}*/}
{/*                                    placeholder="Enter First Name"*/}
{/*                                    multiline={false}*/}
{/*                                    autoCorrect={false}*/}
{/*                                    autoCapitalize="words"*/}
{/*                                    keyboardType="default"*/}
{/*                                    maxLength={50}*/}
{/*                                    textAlign={"justify"}*/}
{/*                                    value={this.state.fName}*/}
{/*                                    onChangeText={this.FName}*/}
{/*                                />*/}
{/*                            </Item>*/}

{/*                            <Item style={Style.inputItem} stackedLabel>*/}
{/*                                <Label style={{ marginRight: hp("0.6%") }}>*/}
{/*                                    Last Name*/}
{/*                                    <Text*/}
{/*                                        style={{*/}
{/*                                            fontSize: hp("2.2%"),*/}
{/*                                            textAlignVertical: "center",*/}
{/*                                            color: "red"*/}
{/*                                        }}*/}
{/*                                    >*/}
{/*                                        **/}
{/*                                    </Text>*/}
{/*                                </Label>*/}
{/*                                <Input*/}
{/*                                    marginBottom={hp("-1%")}*/}
{/*                                    placeholder="Enter Last Name"*/}
{/*                                    multiline={false}*/}
{/*                                    autoCorrect={false}*/}
{/*                                    autoCapitalize="words"*/}
{/*                                    keyboardType="default"*/}
{/*                                    maxLength={50}*/}
{/*                                    textAlign={"justify"}*/}
{/*                                    value={this.state.lName}*/}
{/*                                    onChangeText={this.FName}*/}
{/*                                />*/}
{/*                            </Item>*/}

{/*                            {this.state.isMinor?*/}
{/*                                <View*/}
{/*                                    style={{*/}
{/*                                        alignItems: "center",*/}
{/*                                        justifyContent: "space-around",*/}
{/*                                        flexDirection: "row",*/}
{/*                                        marginTop: hp("0.5%"),*/}
{/*                                        marginBottom: hp("0.5%"),*/}
{/*                                        height: hp("5%")*/}
{/*                                    }}*/}
{/*                                >*/}
{/*                                    <Text*/}
{/*                                        style={{*/}
{/*                                            fontSize: hp("2.2%"),*/}
{/*                                            textAlignVertical: "center"*/}
{/*                                        }}*/}
{/*                                    >*/}
{/*                                        Minor*/}
{/*                                    </Text>*/}
{/*                                    <RadioGroup*/}
{/*                                        style={{ flexDirection: "row" }}*/}
{/*                                        onSelect={(index, value) => this.onSelect(index, value)}*/}
{/*                                    >*/}
{/*                                        <RadioButton value={"Yes"}>*/}
{/*                                            <Text>Yes</Text>*/}
{/*                                        </RadioButton>*/}

{/*                                        <RadioButton value={"No"}>*/}
{/*                                            <Text>No</Text>*/}
{/*                                        </RadioButton>*/}
{/*                                    </RadioGroup>*/}
{/*                                </View>*/}
{/*                                :*/}
{/*                                <View/>}*/}

{/*                            <View style={Style.number}>*/}
{/*                                <View*/}
{/*                                    style={{*/}
{/*                                        flex: 0.1,*/}
{/*                                        flexDirection: "row",*/}
{/*                                        alignItems: "center"*/}
{/*                                    }}*/}
{/*                                >*/}
{/*                                    <CountryPicker*/}
{/*                                        onChange={value => {*/}
{/*                                            this.setState({*/}
{/*                                                cca2: value.cca2,*/}
{/*                                                callingCode:value.callingCode*/}
{/*                                            })                          }}*/}

{/*                                        //cca2={this.state.cca2}*/}
{/*                                        cca2={this.state.cca2}*/}
{/*                                        translation="eng"*/}
{/*                                    />*/}
{/*                                </View>*/}

{/*                                <View*/}
{/*                                    style={{*/}
{/*                                        flex: 0.15,*/}
{/*                                        flexDirection: "row",*/}
{/*                                        marginLeft: hp("0.5%"),*/}
{/*                                        alignItems: "center",*/}
{/*                                        marginBottom: hp("-0.8%")*/}
{/*                                    }}*/}
{/*                                >*/}
{/*                                    <Text style={{ color: "black", fontSize: hp("2%") }}>*/}
{/*                                        +{this.state.callingCode}*/}
{/*                                    </Text>*/}
{/*                                </View>*/}

{/*                                <Item style={Style.inputItem1} stackedLabel>*/}
{/*                                     <Label style={{ marginRight: hp("0.6%") }}>*/}
{/*                          {" "}*/}
{/*                          Mobile Number*/}
{/*                        </Label> */}
{/*                                    <Input*/}
{/*                                        //marginTop={hp("-0.5%")}*/}
{/*                                        placeholder="Mobile Number"*/}
{/*                                        autoCorrect={false}*/}
{/*                                        keyboardType="number-pad"*/}
{/*                                        maxLength={20}*/}
{/*                                        onChangeText={this.FMobileNum}*/}
{/*                                        value={this.state.mobileNumber}*/}
{/*                                    />*/}
{/*                                    <TouchableOpacity*/}
{/*                                        onPress={() => {*/}
{/*                                            this.getTheContact()*/}
{/*                                        }}*/}
{/*                                    >*/}
{/*                                        <Image*/}
{/*                                            source={require("../../../../../icons/phone-book.png")}*/}
{/*                                            style={{*/}
{/*                                                width: 20,*/}
{/*                                                height: 20,*/}
{/*                                                marginTophp: hp("-0.5%")*/}
{/*                                            }}*/}
{/*                                        />*/}
{/*                                    </TouchableOpacity>*/}
{/*                                </Item>*/}
{/*                            </View>*/}
{/*                        </Form>*/}

{/*                        <View style={Style.viewForPaddingAboveAndBelowButtons}>*/}
{/*                            <Button*/}
{/*                                bordered*/}
{/*                                dark*/}
{/*                                style={Style.buttonFamily}*/}
{/*                                onPress={() => {*/}
{/*                                    this.props.navigation.goBack()*/}
{/*                                }}*/}
{/*                            >*/}
{/*                                <Text style={Style.textFamilyVehicle}>Cancel</Text>*/}
{/*                            </Button>*/}
{/*                            <Button*/}
{/*                                bordered*/}
{/*                                dark*/}
{/*                                style={Style.buttonVehicle}*/}
{/*                                onPress={() => this.myFamilySendData()}*/}
{/*                            >*/}
{/*                                <Text style={Style.textFamilyVehicle}>Update</Text>*/}
{/*                            </Button>*/}
{/*                        </View>*/}
{/*                    </ScrollView>*/}
{/*                </View>*/}
{/*            </View>*/}
{/*        </KeyboardAwareScrollView>*/}
{/*    </View>*/}
{/*</TouchableWithoutFeedback>*/}


/*
/getTheContact() {
console.log('Get details')

ContactsWrapper.getContact()
    .then((contact) => {
        // Replace this code
        console.log('get Selected',contact);
        let name=contact.name.split(" ")
        console.log('Fname::',name)
        let mob2=contact.phone.split(" ")
        console.log('mob',mob2)
        let mob3=mob2[0].match('/+/')
        console.log('mob#',mob3)
        let mobNum=contact.phone.replaceAll(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,'')
        console.log('GGGGG',mobNum)
        this.setState({
            fName:name[0],
            lName:name[1] !==""? name[1]:'',
            mobileNumber:contact.phone,
            cCode:'+91'
        })

    })
    .catch((error) => {
        console.log("ERROR CODE: ", error.code);
        console.log("ERROR MESSAGE: ", error.message);
    });
}

changeFamilyMember(value,index){
    console.log('New Details',value,index)
    this.setState({
        relationName:value
    })
    if(value==='Child'){
        this.setState({
            isMinor:true
        })
    }
    else{
        this.setState({
            isMinor:false
        })
    }
}*/
/*
renderIos() {

    let mobPlaceHolder = this.state.isMinor && this.state.isMinorSelected === 0 ? "Guardian's Number" : "Mobile Number"
    return (
        <SafeAreaView style={{height: '100%', width: '100%',alignItems:'center'}}>
            <View style={{
                height: '8%',
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                elevation: 1,
                borderColor: base.theme.colors.primary,
                borderBottomWidth: 1.5,
                marginTop: Platform.OS === 'ios' ? 20 : 0,
            }}>
                <TouchableOpacity style={{width: '30%'}} onPress={() => {
                    this.props.navigation.goBack()
                }}>
                    <Image source={require("../../../../../icons/backBtn.png")}
                           style={{width: 15, height: 15, marginLeft: 10}}/>
                </TouchableOpacity>
                <View style={{width: '30%', alignItems: 'center'}}>
                    <Image source={require("../../../../../icons/headerLogo.png")}
                           style={{width: 50, height: 50}}/>
                </View>
                <View style={{width: '30%', alignItems: 'flex-end'}}>
                    <TouchableOpacity style={{
                        height: '40%', width: '40%', alignItems: 'center', justifyContent: 'center',
                        borderColor: base.theme.colors.primary, borderRadius: 10, marginRight: 10,
                        borderWidth: 1
                    }} onPress={() => this.validation()}>
                        <Text style={{fontSize: 10, color: base.theme.colors.primary}}>NEXT</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <View style={{height: '7%', width: '100%', alignItems: 'center', marginTop: 10}}>
                <Text style={{fontSize: 18, color: base.theme.colors.primary}}>Add Family Member</Text>
            </View>
            <ScrollView style={{width:'100%',height:'80%'}}>
                <View style={{height: '20%', width: '100%', alignItems: 'center', marginTop: 20,}}>
                    <TouchableOpacity style={{
                        height: 90,
                        width: 90,
                        borderRadius: 45,
                        borderWidth: 2,
                        borderColor: base.theme.colors.primary,
                        backgroundColor: base.theme.colors.lightgrey,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} onPress={() => this.setImage()}>
                        {this.state.relativeImage === '' ?
                            <Image style={{height: 40, width: 40, alignSelf: 'center'}}
                                   source={require('../../../../../icons/camera.png')}
                            />
                            :
                            <Image style={{height: 90, width: 90, borderRadius: 45, alignSelf: 'center'}}
                                   source={{uri: this.state.relativeImage}}/>
                        }
                    </TouchableOpacity>
                </View>
                <View style={{height: '8%', width: '100%', alignItems: 'center', marginTop: 25,}}>
                    <Text style={{fontSize: 16, color: base.theme.colors.primary}}>Family Details</Text>
                </View>
                <View style={{height: '150%', width: '100%', alignItems: 'center'}}>
                    <Dropdown
                        value={this.state.relationName}
                        data={this.state.relationList}
                        textColor={base.theme.colors.black}
                        inputContainerStyle={{}}
                        placeholder="Relationship*"
                        labelHeight={hp("4%")}
                        containerStyle={{
                            flex: 0.2, width: wp("90%"),
                            height: hp("1%"),
                        }}
                        rippleOpacity={0}
                        dropdownPosition={-6}
                        dropdownOffset={{top: 0, left: 0,}}
                        style={{fontSize: hp("2.2%")}}
                        onChangeText={(value, index) => this.changeFamilyMember(value, index)}
                    />
                    <View style={{height: '10%', width: '90%', marginTop: 10,}}>
                        <Text style={{fontSize: 14, color: base.theme.colors.grey, textAlign: 'left'}}>First Name
                            <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                        <TextInput
                            style={{height: 50, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey}}
                            onChangeText={(text) => this.setState({firstName: text})}
                            value={this.state.firstName}
                            placeholder="First Name"
                            placeholderTextColor={base.theme.colors.black}
                        />
                    </View>
                    <View style={{height: '10%', width: '90%', marginTop: 10}}>
                        <Text style={{fontSize: 14, color: base.theme.colors.grey, textAlign: 'left'}}>Last Name
                            <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                        <TextInput
                            style={{height: 50, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey}}
                            onChangeText={(text) => this.setState({lastName: text})}
                            value={this.state.lastName}
                            placeholder="Last Name"
                            placeholderTextColor={base.theme.colors.black}
                            keyboardType={'default'}
                        />
                    </View>
                    {this.state.isMinor ?
                        <View style={{
                            flexDirection: 'row',
                            height: '4%',
                            width: '90%',
                            justifyContent: 'flex-start',
                            marginTop: 10,
                        }}>
                            <Text style={{fontSize: 14, color: base.theme.colors.black}}>Minor</Text>
                            <RadioForm formHorizontal={true} animation={true}>
                                {this.state.minorProps.map((obj, i) => {
                                    let onPress = (value, index) => {
                                        this.setState({
                                            isMinorSelected: value
                                        })
                                    };
                                    return (
                                        <RadioButton labelHorizontal={true} key={i.toString()}>
                                            <RadioButtonInput
                                                obj={obj}
                                                index={i.toString()}
                                                isSelected={this.state.isMinorSelected === i}
                                                onPress={onPress}
                                                buttonInnerColor={base.theme.colors.primary}
                                                buttonOuterColor={base.theme.colors.primary}
                                                buttonSize={10}
                                                buttonStyle={{borderWidth: 0.7}}
                                                buttonWrapStyle={{marginLeft: 40}}
                                            />
                                            <RadioButtonLabel
                                                obj={obj}
                                                index={i.toString()}
                                                onPress={onPress}
                                                labelStyle={{color: base.theme.colors.black}}
                                                labelWrapStyle={{marginLeft: 10}}
                                            />
                                        </RadioButton>
                                    )
                                })}
                            </RadioForm>
                        </View>
                        : <View/>}
                    {this.state.isMinor && this.state.isMinorSelected === 0 ?
                        <View style={{height: '10%', width: '90%', marginTop: 10,}}>
                            <Text style={{fontSize: 14, color: base.theme.colors.grey, textAlign: 'left'}}>Guardian's
                                Name
                                <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                            <TextInput
                                style={{height: 30, borderBottomWidth: 1, borderColor: base.theme.colors.lightgrey}}
                                onChangeText={(text) => this.setState({guardianName: text})}
                                value={this.state.guardianName}
                                placeholder="Guardian's Name"
                                placeholderTextColor={base.theme.colors.black}
                                keyboardType={'default'}
                            />
                        </View>
                        : <View/>}
                    <View style={{
                        height: '10%',
                        width: '90%',
                        marginTop: 10,
                        borderBottomWidth: 1,
                        borderColor: base.theme.colors.lightgrey,
                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: base.theme.colors.grey,
                            textAlign: 'left'
                        }}>{mobPlaceHolder}
                            <Text style={{color: base.theme.colors.primary, fontSize: 14}}>*</Text></Text>
                        <View style={{
                            height: '10%',
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <TextInput
                                style={{height: 30, width: '90%'}}
                                onChangeText={(text) => this.setState({mobileNumber: text})}
                                value={this.state.mobileNumber}
                                placeholder={mobPlaceHolder}
                                placeholderTextColor={base.theme.colors.black}
                                keyboardType={'phone-pad'}
                            />
                            <TouchableOpacity onPress={() => {
                                this.getTheContact()
                            }}>
                                <Image source={require("../../../../../icons/phone-book.png")}
                                       style={{width: 25, height: 25, alignSelf: 'center'}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
*/
