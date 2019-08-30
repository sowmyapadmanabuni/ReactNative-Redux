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

import {
    updateUserInfo,
  } from '../src/actions'

const RNFS = require('react-native-fs');

class EditProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName:"",
            lastName:"",
            primaryMobNum:"",
            primeCCode:"",
            primeCName:"",
            primaryEmail:"",
            alterEmail:"",
            myProfileImage:"",
            imageUrl:"",
            primeCca:"",
            alterCca:"",
            alterCName:"",
            alterMobNum:"",
            alterCCode:"",
            profileName:"",
            isPhotoAvailable: false,

        }
        this.selectPhotoTapped = this.selectPhotoTapped.bind(this);

    }



    validation = () => {

        if (base.utils.validate.isBlank(this.state.firstName)) {
            Alert.alert("Please Enter First name")
        } else if (! base.utils.validate.alphabetValidation(this.state.firstName)) {
            Alert.alert("First name should not contain special characters")
        } else if (this.state.firstName.length < 3) {
            Alert.alert("First name should be minimum 2 characters (eg. OM)")
        } else if (this.state.firstName.length > 20) {
            Alert.alert("Maximum limit should be 20 characters")
        } else if (base.utils.validate.isBlank(this.state.lastName)) {
            Alert.alert("Please Enter Last Name")
        } else if (! base.utils.validate.alphabetValidation(this.state.lastName)) {
            Alert.alert("Last name should not contain special characters")
        } else if (this.state.lastName.length < 3) {
            Alert.alert("Last name should be minimum 2 characters (eg. OM)")
        } else if (this.state.lastName.length > 20) {
            Alert.alert("Maximum limit should be 20 characters")
        }  else if (base.utils.validate.isBlank(this.state.primaryMobNum)) {
            Alert.alert("Please Enter Primary mobile number")
        } else if (this.state.primaryMobNum.length < 10) {
            Alert.alert("Please enter a valid (10 digit) Mobile no")
        } else if (!base.utils.validate.mobileNumberValidation(this.state.primaryMobNum)) {
            Alert.alert(
                "Primary mobile number should not contain special characters."
            )
        } else if (!base.utils.validate.isBlank(this.state.alterMobNum) && !base.utils.validate.mobileNumberValidation(this.state.alterMobNum)) {
            Alert.alert(
                "Enter valid alternate mobile number"
            )
        }
        else if(Number(this.state.primaryMobNum) === Number(this.state.alterMobNum)){
            Alert.alert("Primary and alternate mobile number should be different")
        }
        else if (base.utils.validate.isBlank(this.state.primaryEmail)) {
            Alert.alert("Primary email cannot be empty")
        } else if (!base.utils.validate.validateEmailId(this.state.primaryEmail)) {
            Alert.alert("Please Enter a Valid Email Id")
        }   else if (!base.utils.validate.isBlank(this.state.alterEmail) && !base.utils.validate.validateEmailId(this.state.alterEmail)) {
            Alert.alert("Please Enter a Valid alternate Email Id")
        }
         else {
            this.updateProfile()
        }
    }

    async uploadImage(response) {
        let self = this;
        let source = (Platform.OS === 'ios') ? response.uri : response.uri;
        const form = new FormData();
        let imgObj = {
            name: (response.fileName !== undefined) ? response.fileName : "XXXXX.JPG",
            uri: source,
            type: (response.type !== undefined || response.type != null) ? response.type : "image/jpeg"
        };
        form.append('image', imgObj)
        console.log("Image upload before",response)
        let stat = await base.services.MediaUploadApi.uploadRelativeImage(form);
        console.log('Photo upload response', stat,response)
        if (stat) {
            try {
                self.setState({
                    myProfileImage:response.uri,
                    imageUrl:stat,
                    isPhotoAvailable:true
                })
            } catch (err) {
                console.log('err', err)
            }
        }

    }


    async updateProfile() {
        console.log("Alternate data",this.state,this.props)

        axios
            .post(
                `http://${this.props.oyeURL}/oyeliving/api/v1/AccountDetails/Update`,
                {
                    ACFName:this.state.firstName,
                    ACLName:this.state.lastName,
                    ACMobile:this.state.primaryMobNum,
                    ACEmail:this.state.primaryEmail,
                    ACISDCode:this.state.primeCCode,
                    ACMobile1:this.state.alterMobNum,
                    ACISDCode1:this.state.alterCCode,
                    ACMobile2: null,
                    ACISDCode2: null,
                    ACMobile3: null,
                    ACISDCode3: null,
                    ACMobile4: null,
                    ACISDCode4: null,
                    ACEmail1:this.state.alterEmail,
                    ACEmail2: null,
                    ACEmail3: null,
                    ACEmail4: null,
                    ACImgName:this.state.imageUrl,
                    ACAccntID:this.props.MyAccountID,
                    acCrtyCode:this.state.primeCName,
                    acCrtyCode1:this.state.alterCName
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
                    }
                }
            )

            .then(response => {
                console.log("Respo1111:", response);

             if(this.state.isPhotoAvailable){
                    if (Platform.OS === 'android') {
                        this.deleteImage();
                    }
                }
                console.log("Respo22222:", response);

                updateUserInfo({ prop: "MyEmail", value: this.state.primaryEmail });
                updateUserInfo({
                  prop: "MyMobileNumber",
                  value: this.state.primaryMobNum
                });
                updateUserInfo({
                  prop: "MyFirstName",
                  value: this.state.firstName
                });
                updateUserInfo({
                  prop: "MyLastName",
                  value: this.state.lastName
                });
                
                this.props.navigation.goBack();
            })
            .catch(error => {
                console.log("Crash in profile",error)
            })

    }

     deleteImage() {
        let file = this.state.myProfileImage.split('///').pop();
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

        console.log("Data in the myProfile@@@@@###", this.props.navigation.state.params)
      this.setState({
          firstName:this.props.navigation.state.params.firstName,
          lastName:this.props.navigation.state.params.lastName,
          primaryMobNum:this.props.navigation.state.params.primaryMobNum,
          primeCCode:this.props.navigation.state.params.primeCCode,
          primeCName:this.props.navigation.state.params.primeCName,
          alterMobNum:this.props.navigation.state.params.alterMobNum,
          alterCCode:this.props.navigation.state.params.alterCCode,
          alterCName:this.props.navigation.state.params.alterCName,
          primaryEmail:this.props.navigation.state.params.primaryEmail,
          alterEmail:this.props.navigation.state.params.alterEmail,
          myProfileImage:this.props.navigation.state.params.myProfileImage !==""?
              "https://mediaupload.oyespace.com/" +this.props.navigation.state.params.myProfileImage:"",
          imageUrl:this.props.navigation.state.params.myProfileImage,
          alterCca:this.props.navigation.state.params.alterCca,
          primeCca:this.props.navigation.state.params.primeCca,
          profileName:this.props.navigation.state.params.firstName,
      })


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
                this.uploadImage(response)
            }
        })
    }

    render() {

        console.log('AGHGHGHGH',this.state,this.state.myProfileImage,this.props)
        console.log("My Account Id", this.props.MyAccountID)
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
                                              <Image
                                                  style={styles.profilePicImageStyle}
                                                  source={{uri:this.state.myProfileImage !== "" ? this.state.myProfileImage :base.utils.strings.staffPlaceHolder}}
                                              />
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
                                        <Text style={styles.itemTextValues1}>{this.state.profileName}
                                        </Text>
                                    </View>

                                    <Form>

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
                                                keyboardType='ascii-capable'
                                                maxLength={50}
                                                value={this.state.firstName}
                                                onChangeText={(text)=>this.setState({firstName:text})}
                                            />
                                        </Item>

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
                                                keyboardType='ascii-capable'
                                                maxLength={50}
                                                onChangeText={(text)=>this.setState({
                                                    lastName:text
                                                })}
                                                value={this.state.lastName}
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
                                                            primeCca:value.cca2,
                                                            primeCCode:"+" + value.callingCode,
                                                            primeCName:value.cca2,
                                                        })
                                                    }}
                                                    //cca2={this.state.cca2}
                                                    cca2={this.state.primeCName === "" ? 'IN' : this.state.primeCName}
                                                    flag={this.state.primeCName === "" ? 'IN' : this.state.primeCName}
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
                                                    {this.state.primeCCode}
                                                </Text>
                                            </View>

                                            <Item style={styles.inputItem1} stackedLabel>
                                                <Input
                                                    marginBottom={hp("-1%")}
                                                    placeholder="Mobile Number"
                                                    autoCorrect={false}
                                                    keyboardType="phone-pad"
                                                    maxLength={20}
                                                    onChangeText={(value)=>{
                                                        let num = value.replace(".", '');
                                                        if (isNaN(num)) {
                                                        // Its not a number
                                                    } else {
                                                        this.setState({primaryMobNum:num})
                                                    }}}
                                                    value={this.state.primaryMobNum}
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
                                                            alterCca:value.cca2,
                                                            alterCCode: "+" + value.callingCode,
                                                            alterCName:value.cca2
                                                        })
                                                    }}
                                                    cca2={this.state.alterCName === "" ? 'IN' : this.state.alterCName}
                                                    flag={this.state.alterCName === "" ? 'IN' : this.state.alterCName}
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
                                                    {this.state.alterCName === "" ? "+91" : this.state.alterCCode}
                                                </Text>
                                            </View>

                                            <Item style={styles.inputItem1} stackedLabel>
                                                <Input
                                                    marginTop={hp("-0.5%")}
                                                    placeholder="Alternate Mobile Number"
                                                    autoCorrect={false}
                                                    keyboardType="phone-pad"
                                                    maxLength={20}
                                                    onChangeText={(value)=>{
                                                        let num = value.replace(".", '');
                                                        if (isNaN(num)) {
                                                            // Its not a number
                                                        } else {
                                                            this.setState({alterMobNum:num})
                                                        }}}
                                                    value={this.state.alterMobNum}
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
                                                onChangeText={(text)=>this.setState({primaryEmail:text})}
                                                value={this.state.primaryEmail}
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
                                                onChangeText={(text)=>this.setState({alterEmail:text})}
                                                value={this.state.alterEmail}
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
                                            onPress={() => this.validation()}
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
        mediaupload: state.OyespaceReducer.mediaupload,

    }
};
export default connect(mapStateToProps)(EditProfile);
