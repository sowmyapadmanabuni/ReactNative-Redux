import React, {Component} from "react"
import {
    Alert,
    Dimensions,
    Image,
    Keyboard,
    PixelRatio,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Platform
} from "react-native"

import {Button, Form, Input, Item, Label} from "native-base";

import {connect} from 'react-redux';

import ImagePicker from "react-native-image-picker"
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view"
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"
import axios from "axios"
import CountryPicker from "react-native-country-picker-modal"
import base from "../src/base";

const RNFS = require('react-native-fs');

class EditProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            FirstName: "",
            LastName: "",

            MobileNumber: "",
            AlternateMobileNumber: "",
            cca2: "",
            cca3: "",
            callingCode: "",
            callingCode1: "",
            countryName1: "",

            Email: "",
            AlternateEmail: "",

            Image: "",
            countryName: "",

            // cca2: "",
            // callingCode: "",
            data1: [],
            photo: null,
            photoDetails: null,
            isPhotoAvailable: false,
            filePath: '',
            imagePath: ''
        }

        console.log("Props in Edit profile:", this.props);

        this.selectPhotoTapped = this.selectPhotoTapped.bind(this);

    }


    FName = firstName => {
        this.setState({FirstName: firstName})
    }

    LName = lastName => {
        this.setState({LastName: lastName})
    }

    MNumber = mobileNumber => {
        this.setState({MobileNumber: mobileNumber})
    }

    AMNumber = alternateMobileNumber => {
        this.setState({AlternateMobileNumber: alternateMobileNumber})
    }
    CCode = callingCode => {
        this.setState({callingCode: callingCode})
    }
    Ccca2 = cca2 => {
        this.setState({cca2: cca2})
    }
    Ccca3 = cca3 => {
        this.setState({cca3: cca3})
    }

    CCode1 = callingCode1 => {
        this.setState({CallingCode1: callingCode1})
    }

    FEmail = fEmail => {
        this.setState({Email: fEmail})
    }

    AEmail = aEmail => {
        this.setState({AlternateEmail: aEmail})
    }

    myEditProfile = () => {
        firstname = this.state.FirstName
        lastname = this.state.LastName
        callingCode = this.state.callingCode

        mobilenumber = this.state.MobileNumber

        email = this.state.Email

        cca2 = this.state.cca2
        alternatemobilenumber = this.state.AlternateMobileNumber
        alternateemail = this.state.AlternateEmail
        cca3 = this.state.cca3
        callingCode1 = this.state.callingCode1

        photo = this.state.photo

        const regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const reg = /^[0]?[6789]\d{9}$/
        const OyeFullName = /^[a-zA-Z ]+$/
        const oyeNonSpecialRegex = /[^0-9A-Za-z ,]/

        if (firstname.length == 0) {
            Alert.alert("First name cannot not be empty")
        } else if (oyeNonSpecialRegex.test(firstname) === true) {
            Alert.alert("First name should not contain special characters")
        } else if (firstname.length < 3) {
            Alert.alert("First name should be more than 3 characters")
        } else if (firstname > 50) {
            Alert.alert("First name should be less than 50 characters")
        } else if (lastname.length == 0) {
            Alert.alert("Last name should not be empty")
        } else if (oyeNonSpecialRegex.test(lastname) === true) {
            Alert.alert("Last name should not contain special characters")
        } else if (lastname.length < 3) {
            Alert.alert("Last name should be more than 3 characters")
        } else if (lastname > 50) {
            Alert.alert("Last name should be less than 50 characters")
        } else if (cca2.length == 0) {
            Alert.alert("Please select country")
        } else if (mobilenumber.length == 0) {
            Alert.alert("Primary mobile number cannot be empty")
        } else if (mobilenumber.length < 10) {
            Alert.alert("Primary mobile number should contain 10 numerics.")
        } else if (reg.test(mobilenumber) === false) {
            Alert.alert(
                "Primary mobile number should not contain special characters."
            )
        } else if (email.length == 0) {
            Alert.alert("Primary email cannot be empty")
        } else if (regemail.test(email) === false) {
            Alert.alert("Enter valid primary email id")
            //"Please check your email-id"
        } else if (this.state.photo == null) {
            Alert.alert("Upload photo")
        } else if (!alternatemobilenumber.length == 0) {
            this.alternateMobile()
            return
        } else if (!alternateemail.length == 0) {
            this.alternateEmail()
            return
        } else {
            this.editProfileUpdate()
        }
    }

    alternateMobile = () => {
        alternatemobilenumber = this.state.AlternateMobileNumber

        cca3 = this.state.cca3
        callingCode1 = this.state.callingCode1

        const reg = /^[0]?[6789]\d{9}$/;
        if (cca3.length == 0) {
            Alert.alert("Please select country")
            return
        } else if (alternatemobilenumber.length == 0) {
            Alert.alert("Alternate mobile number cannot be empty.")
            return
        } else if (alternatemobilenumber.length < 10) {
            Alert.alert("Alternate mobile number should contain 10 numerics.")
            return
        } else if (!this.alternateEmail.length == 0) {
            this.alternateEmail()
            return
        } else {
            this.editProfileUpdate()
            return
        }
    }

    alternateEmail = () => {
        alternateemail = this.state.AlternateEmail
        const regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (alternateemail.length == 0) {
            Alert.alert("Alternate email cannot be empty")
            return
        } else if (regemail.test(alternateemail) === false) {
            Alert.alert("Enter valid alternative email id.")
            return
        } else {
            this.editProfileUpdate();
            return
        }
    }

    async editProfileUpdate() {
        const {
            profileDataSourceFirstName,
            profileDataSourceLastName,
            profileDataSourceIsdCode,
            profileDataSourceIsdCode1,
            profileDataSourceCca2,
            profileDataSourceCca3,
            profileDataSourceMobileNumber,
            profileDataSourceAlternateMobileNum,
            profileDataSourceEmail,
            profileDataSourceAlternateEmail,
            profileDataSourceImageName
        } = this.props.navigation.state.params;
        firstname = this.state.FirstName;
        lastname = this.state.LastName;
        callingCode = this.state.callingCode;
        mobilenumber = this.state.MobileNumber;
        email = this.state.Email;
        cca2 = this.state.cca2;
        alternatemobilenumber = this.state.AlternateMobileNumber;
        alternateemail = this.state.AlternateEmail;
        cca3 = this.state.cca3;
        callingCode1 = this.state.callingCode1;
        let countryName = this.state.countryName === "" ? 'IN' : this.state.countryName;
        let countryName1 = this.state.countryName1;

        // photo = this.state.photo
        // console.log(data)
        // console.log("Image will show", photo.fileName)
        const {photo} = this.state
        const data = new FormData();

        console.log("DKNKJF:", this.state.photoDetails, this.state.photo);

        let statForMediaUpload = "";

        if (this.state.photoDetails === null) {
            statForMediaUpload = this.state.photo;
        } else {
            let imgObj = {
                name: (this.state.photoDetails.fileName !== undefined) ? this.state.photoDetails.fileName : "XXXXX.jpg",
                uri: this.state.photoDetails.uri,
                type: (this.state.photoDetails.type !== undefined || this.state.photoDetails.type != null) ? this.state.photoDetails.type : "image/jpeg"
            };

            data.append('oyespace', imgObj);
            console.log("Form Data:", data);
            statForMediaUpload = await base.services.MediaUploadApi.uploadRelativeImage(data);
            console.log("Stat in Media Upload:", statForMediaUpload);
        }


        let payloadData = {
            ACFName:
                firstname.length <= 0 ? profileDataSourceFirstName : firstname,
            ACLName: lastname.length <= 0 ? profileDataSourceLastName : lastname,
            ACMobile:
                mobilenumber.length <= 0
                    ? profileDataSourceMobileNumber
                    : mobilenumber,
            ACEmail: email.length <= 0 ? profileDataSourceEmail : email,
            ACISDCode:
                callingCode.length <= 0
                    ? profileDataSourceIsdCode + profileDataSourceCca2
                    : callingCode + cca2,
            ACMobile1:
                alternatemobilenumber.length <= 0
                    ? profileDataSourceAlternateMobileNum
                    : alternatemobilenumber,
            ACISDCode1:
                callingCode1.length <= 0
                    ? profileDataSourceIsdCode1 + profileDataSourceCca3
                    : callingCode1 + cca3,
            ACMobile2: null,
            ACISDCode2: null,
            ACMobile3: null,
            ACISDCode3: null,
            ACMobile4: null,
            ACISDCode4: null,
            ACEmail1:
                alternateemail.length <= 0
                    ? profileDataSourceAlternateEmail
                    : alternateemail,
            ACEmail2: null,
            ACEmail3: null,
            ACEmail4: null,
            ACImgName: statForMediaUpload,
            ACAccntID: 1,
            acCrtyCode: countryName,
            acCrtyCode1: countryName1

        };


        this.updateProfile(payloadData);


    };

    async updateProfile(payloadData) {
        console.log("payload Data:", payloadData);
        const {
            profileDataSourceFirstName,
            profileDataSourceLastName,
            profileDataSourceIsdCode,
            profileDataSourceIsdCode1,
            profileDataSourceCca2,
            profileDataSourceCca3,
            profileDataSourceMobileNumber,
            profileDataSourceAlternateMobileNum,
            profileDataSourceEmail,
            profileDataSourceAlternateEmail,
        } = this.props.navigation.state.params;

        let firstname = this.state.FirstName;
        let lastname = this.state.LastName;
        let callingCode = this.state.callingCode;
        let mobilenumber = this.state.MobileNumber;
        let email = this.state.Email;
        let cca2 = this.state.cca2;
        let alternatemobilenumber = this.state.AlternateMobileNumber;
        let alternateemail = this.state.AlternateEmail;
        let cca3 = this.state.cca3;
        let callingCode1 = this.state.callingCode1;
        let countryName = this.state.countryName === "" ? "IN" : this.state.countryName;

        axios
            .post(
                `http://${this.props.oyeURL}/oyeliving/api/v1/AccountDetails/Update`,
                {
                    ACFName:
                        firstname.length <= 0 ? profileDataSourceFirstName : firstname,
                    ACLName: lastname.length <= 0 ? profileDataSourceLastName : lastname,
                    ACMobile:
                        mobilenumber.length <= 0
                            ? profileDataSourceMobileNumber
                            : mobilenumber,
                    ACEmail: email.length <= 0 ? profileDataSourceEmail : email,
                    ACISDCode:
                        callingCode.length <= 0
                            ? profileDataSourceIsdCode + profileDataSourceCca2
                            : callingCode,
                    ACMobile1:
                        alternatemobilenumber.length <= 0
                            ? profileDataSourceAlternateMobileNum
                            : alternatemobilenumber,
                    ACISDCode1:
                        callingCode1.length <= 0
                            ? profileDataSourceIsdCode1 + profileDataSourceCca3
                            : callingCode1,
                    ACMobile2: null,
                    ACISDCode2: null,
                    ACMobile3: null,
                    ACISDCode3: null,
                    ACMobile4: null,
                    ACISDCode4: null,
                    ACEmail1:
                        alternateemail.length <= 0
                            ? profileDataSourceAlternateEmail
                            : alternateemail,
                    ACEmail2: null,
                    ACEmail3: null,
                    ACEmail4: null,
                    ACImgName: payloadData.ACImgName,
                    ACAccntID: this.props.MyAccountID,
                    acCrtyCode: countryName,
                    acCrtyCode1: payloadData.acCrtyCode1
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
                    }
                }
            )

            .then(response => {
                if (Platform.OS === 'android') {
                    this.deleteImage();
                }
                this.props.navigation.goBack();
                console.log("Respo:", response, payloadData.acCrtyCode1);
            })
            .catch(error => {
                console.log(error)
            })

    }

     deleteImage() {
        let file = this.state.photo.split('///').pop();
        const filePath = file.substring(0, file.lastIndexOf('/'));
        console.warn("File Path: " + filePath);
        console.warn("File to DELETE: " + file);
        RNFS.readDir(filePath).then(files => {
          for(let t of files) {
            RNFS.unlink(t.path);
          }
  
        })
        .catch(err => {
          console.error(err)
        });
    }

    static navigationOptions = {
        title: "My Profile",
        header: null
    }

    componentWillMount() {
        this.setState({
            FirstName: this.props.navigation.state.params.profileDataSourceFirstName
                ? this.props.navigation.state.params.profileDataSourceFirstName
                : ""
        })

        this.setState({
            LastName: this.props.navigation.state.params.profileDataSourceLastName
                ? this.props.navigation.state.params.profileDataSourceLastName
                : ""
        })
        this.setState({
            callingCode: this.props.navigation.state.params.profileDataSourceIsdCode
                ? this.props.navigation.state.params.profileDataSourceIsdCode
                : ""
        })
        this.setState({
            callingCode1: this.props.navigation.state.params.profileDataSourceIsdCode1
                ? this.props.navigation.state.params.profileDataSourceIsdCode1
                : ""
        })
        this.setState({
            cca2: this.props.navigation.state.params.profileDataSourceCca2
                ? this.props.navigation.state.params.profileDataSourceCca2
                : ""
        })
        this.setState({
            cca3: this.props.navigation.state.params.profileDataSourceCca3
                ? this.props.navigation.state.params.profileDataSourceCca3
                : ""
        })
        this.setState({
            MobileNumber: this.props.navigation.state.params
                .profileDataSourceMobileNumber
                ? this.props.navigation.state.params.profileDataSourceMobileNumber
                : ""
        })
        this.setState({
            AlternateMobileNumber: this.props.navigation.state.params
                .profileDataSourceAlternateMobileNum
                ? this.props.navigation.state.params.profileDataSourceAlternateMobileNum
                : ""
        })

        this.setState({
            Email: this.props.navigation.state.params.profileDataSourceEmail
                ? this.props.navigation.state.params.profileDataSourceEmail
                : ""
        })
        this.setState({
            AlternateEmail: this.props.navigation.state.params
                .profileDataSourceAlternateEmail
                ? this.props.navigation.state.params.profileDataSourceAlternateEmail
                : ""
        });
        this.setState({
            countryName: this.props.navigation.state.params.profileDataSourceCountryName
        });
        this.setState({
            countryName1: this.props.navigation.state.params.profileDataSourceCountryName1
        });

        this.setState({
            photo: this.props.navigation.state.params.profileDataSourceImageName
        });
    }

    selectPhotoTapped() {
        const options = {
            quality: 0.5,
            maxWidth: 250,
            maxHeight: 250,
            cameraRoll: false,
            storageOptions: {
                skipBackup: true,
                path: 'tmp_files'
              },
        };
        //showImagePicker
        ImagePicker.showImagePicker(options, response => {
            //console.log("Response = ", response)

            if (response.didCancel) {
                console.log("User cancelled photo picker")
            } else if (response.error) {
                console.log("ImagePicker Error: ", response.error)
            } else if (response.customButton) {
                console.log("User tapped custom button: ", response.customButton)
            } else {
                // You can also display the image using data:
                // let source = { uri: "data:image/jpeg;base64," + response.data };
                let source = {uri: response.uri};

                // CameraRoll.saveToCameraRoll(data.uri)

                this.setState({
                    photo: response.uri,
                    photoDetails: response,
                    isPhotoAvailable: true,
                    imagePath: response.path
                });
                console.log(response)
                //this.setState({ photo: response })
            }
        })
    }

    render() {
        //const { navigate } = this.props.navigation
        const {photo} = this.state;
        console.log("State:", this.state);

        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss()
                }}
            >
                <View style={styles.mainViewStyle}>
                    <SafeAreaView style={{backgroundColor: "#ff8c00"}}>
                        <View style={[styles.viewStyle, {flexDirection: "row"}]}>
                            <View
                                style={{
                                    width:'30%',
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
                                        resizeMode="contain"
                                        source={require("../icons/backBtn.png")}
                                        style={styles.viewDetails2}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View
                                style={{
                                    width:'30%',
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <Image
                                    style={[styles.image]}
                                    source={require("../icons/headerLogo.png")}
                                />
                            </View>
                            <View style={styles.emptyViewStyle}/>
                        </View>
                        <View style={{borderWidth: 1, borderColor: "#ff8c00"}}/>
                    </SafeAreaView>
                    <KeyboardAwareScrollView>
                        <View style={styles.mainContainer}>
                            <View style={styles.textWrapper}>
                                <View style={styles.myProfileFlexStyle}>
                                    <View style={styles.emptyViewStyle}/>
                                    <View style={styles.viewForMyProfileText}>
                                        <Text style={styles.myProfileTitleStyle}>Edit Profile</Text>
                                    </View>
                                    <View style={styles.emptyViewStyle}/>
                                </View>

                                <ScrollView>
                                    <TouchableOpacity
                                        onPress={()=>this.selectPhotoTapped()}
                                    >
                                    <View style={styles.containerView_ForProfilePicViewStyle}>
                                          <View style={styles.viewForProfilePicImageStyle}>
                                                {this.props.navigation.state.params
                                                    .profileDataSourceImageName !== null && !this.state.isPhotoAvailable ? (
                                                    <Image
                                                        style={styles.profilePicImageStyle}
                                                        source={{
                                                            uri:
                                                                "http://mediaupload.oyespace.com/" +
                                                                this.props.navigation.state.params
                                                                    .profileDataSourceImageName
                                                        }}
                                                    />
                                                ) : (
                                                    <Image
                                                        style={styles.profilePicImageStyle}
                                                        source={{uri: photo}}
                                                    />
                                                )}
                                            </View>

                                            <View style={styles.imagesmallCircle}>
                                                <Image
                                                    style={[styles.smallImage]}
                                                    source={require("../icons/cam_with_gray_bg.png")}
                                                />
                                            </View>
                                    </View>
                                    </TouchableOpacity>

                                    <View
                                        style={{alignItems: "center", marginBottom: hp("4%")}}
                                    >
                                        <Text style={styles.itemTextValues1}>
                                            {this.props.navigation.state.params
                                                .profileDataSourceFirstName
                                                ? this.props.navigation.state.params
                                                    .profileDataSourceFirstName
                                                : ""}
                                        </Text>
                                    </View>

                                    <Form>
                                        {/* <Text style={{ marginLeft: hp("2.5%"), color: "#909091" }}>
                      First Name
                    </Text> */}
                                        <Item style={styles.inputItem} stackedLabel>
                                            <Label style={{marginRight: hp("0.6%")}}>
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
                                                // underlineColorAndroid="orange"
                                                autoCorrect={false}
                                                autoCapitalize="words"
                                                keyboardType="default"
                                                maxLength={50}
                                                defaultValue={
                                                    this.props.navigation.state.params
                                                        .profileDataSourceFirstName
                                                        ? this.props.navigation.state.params
                                                            .profileDataSourceFirstName
                                                        : ""
                                                }
                                                // onChangeText={FirstName =>
                                                //   this.setState({ FirstName: FirstName })
                                                // }
                                                value={this.state.FName}
                                                onChangeText={this.FName}
                                                // value={this.state.FirstName}
                                            />
                                        </Item>

                                        {/* <Text style={{ marginLeft: hp("2.5%"), color: "#909091" }}>
                      Last Name
                    </Text> */}
                                        <Item style={styles.inputItem} stackedLabel>
                                            <Label style={{marginRight: hp("0.6%")}}>
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
                                                // underlineColorAndroid="orange"
                                                autoCorrect={false}
                                                autoCapitalize="words"
                                                keyboardType="default"
                                                maxLength={50}
                                                defaultValue={
                                                    this.props.navigation.state.params
                                                        .profileDataSourceLastName
                                                        ? this.props.navigation.state.params
                                                            .profileDataSourceLastName
                                                        : ""
                                                }
                                                onChangeText={this.LName}
                                                value={this.state.LName}
                                            />
                                        </Item>

                                        <View style={styles.number}>
                                            <View
                                                style={{
                                                    flex: 0.1,
                                                    flexDirection: "row",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <CountryPicker
                                                    hideAlphabetFilter={true}
                                                    onChange={value => {
                                                        console.log("CCA:", value);
                                                        this.setState({
                                                            cca2: value.cca2,
                                                            callingCode: "+" + value.callingCode,
                                                            countryName: value.cca2
                                                        })
                                                    }}
                                                    //cca2={this.state.cca2}
                                                    cca2={this.state.countryName === "" ? 'IN' : this.state.countryName}
                                                    flag={this.state.countryName === "" ? 'IN' : this.state.countryName}
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
                                                <Text style={{color: "black", fontSize: hp("2%")}}>
                                                    {this.state.callingCode}
                                                </Text>
                                            </View>

                                            <Item style={styles.inputItem1} stackedLabel>
                                                {/* <Label style={{ marginRight: hp("0.6%") }}>
                          {" "}
                          Mobile Number
                        </Label> */}

                                                <Input
                                                    marginBottom={hp("-1%")}
                                                    //marginTop={hp("-0.5%")}
                                                    placeholder="Mobile Number"
                                                    autoCorrect={false}
                                                    keyboardType="number-pad"
                                                    maxLength={20}
                                                    defaultValue={
                                                        this.props.navigation.state.params
                                                            .profileDataSourceMobileNumber
                                                            ? this.props.navigation.state.params
                                                                .profileDataSourceMobileNumber
                                                            : ""
                                                    }
                                                    onChangeText={this.MNumber}
                                                    value={this.state.MNumber}
                                                />
                                            </Item>
                                        </View>

                                        <View style={styles.number}>
                                            <View
                                                style={{
                                                    flex: 0.1,
                                                    flexDirection: "row",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <CountryPicker
                                                    hideAlphabetFilter={true}
                                                    onChange={value => {
                                                        console.log("CCA11:", value);
                                                        this.setState({
                                                            cca3: value.cca2,
                                                            callingCode1: "+" + value.callingCode,
                                                            countryName1: value.cca2
                                                        })
                                                    }}
                                                    cca2={this.state.countryName1 === "" ? 'IN' : this.state.countryName1}
                                                    flag={this.state.countryName1 === "" ? 'IN' : this.state.countryName1}
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
                                                <Text style={{color: "black", fontSize: hp("2%")}}>
                                                    {this.state.countryName1 === "" ? "91" : this.state.callingCode1}
                                                </Text>
                                            </View>

                                            <Item style={styles.inputItem1} stackedLabel>
                                                <Input
                                                    marginTop={hp("-0.5%")}
                                                    placeholder="Alternate Mobile Number"
                                                    autoCorrect={false}
                                                    keyboardType="number-pad"
                                                    maxLength={20}
                                                    defaultValue={
                                                        this.props.navigation.state.params
                                                            .profileDataSourceAlternateMobileNum
                                                            ? this.props.navigation.state.params
                                                                .profileDataSourceAlternateMobileNum
                                                            : ""
                                                    }
                                                    onChangeText={this.AMNumber}
                                                    value={this.state.AMNumber}
                                                />
                                            </Item>
                                        </View>

                                        <Item style={styles.inputItem} stackedLabel>
                                            <Label style={{marginRight: hp("0.6%")}}>
                                                {" "}
                                                Email ID
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
                                                placeholder="Email ID"
                                                autoCorrect={false}
                                                keyboardType="email-address"
                                                maxLength={50}
                                                defaultValue={
                                                    this.props.navigation.state.params
                                                        .profileDataSourceEmail
                                                        ? this.props.navigation.state.params
                                                            .profileDataSourceEmail
                                                        : ""
                                                }
                                                onChangeText={this.FEmail}
                                                value={this.state.FEmail}
                                            />
                                        </Item>

                                        <Item style={styles.inputItem} stackedLabel>
                                            <Label style={{marginRight: hp("0.6%")}}>
                                                Alternate Email ID
                                            </Label>
                                            <Input
                                                marginBottom={hp("-1%")}
                                                placeholder="Alternate Email ID"
                                                autoCorrect={false}
                                                keyboardType="email-address"
                                                maxLength={50}
                                                defaultValue={
                                                    this.props.navigation.state.params
                                                        .profileDataSourceAlternateEmail
                                                        ? this.props.navigation.state.params
                                                            .profileDataSourceAlternateEmail
                                                        : ""
                                                }
                                                onChangeText={this.AEmail}
                                                value={this.state.AEmail}
                                            />
                                        </Item>
                                    </Form>

                                    <View style={styles.viewForPaddingAboveAndBelowButtons}>
                                        <Button
                                            bordered
                                            dark
                                            style={styles.buttonFamily}
                                            onPress={() => {
                                                this.props.navigation.goBack()
                                            }}
                                        >
                                            <Text style={styles.textFamilyVehicle}>Cancel</Text>
                                        </Button>
                                        <Button
                                            bordered
                                            dark
                                            style={styles.buttonVehicle}
                                            onPress={() => this.myEditProfile()}
                                        >
                                            <Text style={styles.textFamilyVehicle}>Update</Text>
                                        </Button>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>

                        {/* </View> */}
                    </KeyboardAwareScrollView>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    textWrapper: {
        height: hp("85%"),
        width: wp("95%")
    },
    viewStyle: {
        backgroundColor: "#fff",
        height: hp("8%"),
        width:'100%',
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
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
    mainViewStyle: {
        flex: 1
    },
    mainContainer: {
        flex: 1,
        marginTop: 0,
        paddingHorizontal: hp("1.4%"),
        // paddingBottom: 10,
        backgroundColor: "#fff",
        flexDirection: "column"
    },

    myProfileFlexStyle: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: hp("2%"),
        marginBottom: 0
    },

    viewForMyProfileText: {
        flex: 4,
        justifyContent: "center",
        alignSelf: "center"
    },
    myProfileTitleStyle: {
        textAlign: "center",
        fontSize: hp("2.5%"),
        fontWeight: "500",
        color: "#ff8c00"
    },

    containerView_ForProfilePicViewStyle: {
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
        marginTop: hp("4%"),
        marginBottom: hp("2%"),
        marginLeft: hp("4%")
    },
    profilePicImageStyle: {
        //backgroundColor: "yellow",
        width: 110,
        height: 110,
        borderColor: "orange",
        borderRadius: 55,
        borderWidth: hp("0.2%") / PixelRatio.get()
    },

    imagesmallCircle: {
        alignItems: "flex-end",
        justifyContent: "flex-start",
        width: 10,
        height: 10,
        marginTop: hp("6%"),
        marginLeft: hp("3%"),
        borderRadius: 5
    },
    smallImage: {
        width: wp("8%"),
        height: hp("4%"),
        justifyContent: "flex-start",
        alignItems: "flex-end"
        //alignItems: center
    },
    viewForPaddingAboveAndBelowButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: hp("4%"),
        marginBottom: hp("2%"),
        marginHorizontal: hp("2%")
    },
    buttonFamily: {
        width: wp("25%"),
        height: hp("4%"),
        borderRadius: hp("2.5%"),
        borderWidth: hp("0.2%"),
        borderColor: "#EF3939",
        backgroundColor: "#EF3939",
        justifyContent: "center"
    },
    textFamilyVehicle: {
        color: "white",
        fontWeight: "600",
        fontSize: hp("2%")
    },
    buttonVehicle: {
        width: wp("25%"),
        height: hp("4%"),
        borderRadius: hp("2.5%"),
        borderWidth: hp("0.2%"),
        borderColor: "orange",
        backgroundColor: "orange",
        justifyContent: "center"
    },
    itemTextValues1: {
        fontSize: hp("2.2%"),
        fontWeight: "500",
        paddingTop: hp("0.8%"),
        paddingHorizontal: 0,

        alignItems: "flex-start",
        justifyContent: "flex-start",
        color: "#474749"
    },
    inputItem: {
        marginTop: wp("2%"),
        marginLeft: wp("4%"),
        marginRight: wp("4%"),
        borderColor: "#909091"
    },
    inputItem1: {
        flex: 0.65,
        marginTop: wp("2%"),
        marginLeft: wp("3%"),
        marginRight: wp("4%"),
        borderColor: "#909091"
    },
    number: {
        flexDirection: "row",
        width: Dimensions.get("screen").width,
        justifyContent: "center",
        alignItems: "center"
    },
    viewDetails2: {
        alignItems: "flex-start",
        justifyContent: "center",
        width: hp("2.5%"),
        height: hp("2.5%"),
        marginTop: 5
        // marginLeft: 10
    }
});

const mapStateToProps = state => {``
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        MyAccountID: state.UserReducer.MyAccountID,
        viewImageURL: state.OyespaceReducer.viewImageURL,
        imageUrl: state.OyespaceReducer.imageUrl,
        SelectedAssociationID: state.UserReducer.SelectedAssociationID,
    }
};
export default connect(mapStateToProps)(EditProfile);
