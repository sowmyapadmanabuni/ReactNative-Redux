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
    Platform
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
// import simpleContacts from "react-native-simple-contacts"

//import Contacts from "react-native-contacts"
//import ContactsWrapper from "react-native-contacts-wrapper"

//import Contacts from "react-native-contacts"

//var radio_props = [{ label: "Yes", value: 0 }, { label: "No", value: 1 }]

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

class MyFamily extends Component {
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
            minor: false
        }
        //this.arrayholder = []
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
        fname = this.state.Family_Name
        fage = this.state.Age
        fmobilenum = this.state.Mobile_No
        frelation = this.state.Relation
        //fimage = this.state.ImageSource
        callingCode = this.state.callingCode
        cca2 = this.state.cca2
        photo = this.state.photo
        //validations

        // console.log(data, "787878787878788788778");
        console.log(photo, "787878787878788788778")

        const reg = /^[0]?[6789]\d{9}$/
        const OyeFullName = /^[a-zA-Z ]+$/

        if (fname.length == 0) {
            Alert.alert("Name should not be empty")
        } else if (OyeFullName.test(fname) === false) {
            alert("Enter valid First Name")
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
                                                keyboardType='ascii-capable'
                                                maxLength={50}
                                                textAlign={"justify"}
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
                                                placeholder="Enter Last Name"
                                                multiline={false}
                                                autoCorrect={false}
                                                autoCapitalize="words"
                                                keyboardType='ascii-capable'
                                                maxLength={50}
                                                textAlign={"justify"}
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
                                            <Item style={Style.inputItemMobile} stackedLabel>
                                                <Label style={{ marginRight: hp("0.6%") }}>
                                                    Guardian's Name
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
                                                    placeholder="Enter guardian's Name"
                                                    multiline={false}
                                                    autoCorrect={false}
                                                    autoCapitalize="words"
                                                    keyboardType='ascii-capable'
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
                                                    value={this.state.FMobileNum}
                                                />
                                                {/* <TouchableOpacity
                          onPress={() => {
                            this.onPressPhoneBook()
                          }}
                        > */}
                                                {/* <Image
                            source={require("../../../../../icons/phone-book.png")}
                            style={{
                              width: 20,
                              height: 20,
                              marginTophp: hp("-0.5%")
                            }}
                          /> */}
                                                {/* </TouchableOpacity> */}
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