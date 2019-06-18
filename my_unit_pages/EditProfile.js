import React, { Component } from "react"
import {
  AppRegistry,
  View,
  ImageBackground,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  PixelRatio,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  Dimensions,
  SafeAreaView
} from "react-native"
import { Card, Item, Input, Button } from "native-base"
import { TextInput } from "react-native-gesture-handler"
import ImagePicker from "react-native-image-picker"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"
import {connect} from 'react-redux';

class EditProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      FirstName: "",
      LastName: "",
      Email: "",
      AlternateEmail: "",
      Image: "",
      ImageSource: "",
      data1: []
    }
  }

  FName = firstName => {
    this.setState({ FirstName: firstName })
  }

  LName = lastName => {
    this.setState({ LastName: lastName })
  }

  FEmail = fEmail => {
    this.setState({ Email: fEmail })
  }

  AEmail = aEmail => {
    this.setState({ AlternateEmail: aEmail })
  }
  FImage = image => {
    this.setState({ Image: image })
  }
  myEditProfile = () => {
    firstname = this.state.FirstName
    lastname = this.state.LastName
    email = this.state.Email
    alternateemail = this.state.AlternateEmail
    fimage = this.state.Image

    
    const regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const reg = /^[0]?[6789]\d{9}$/
    const OyeFullName = /^[a-zA-Z ]+$/

    if (firstname.length == 0) {
      Alert.alert("First Name should not be empty")
    } else if (OyeFullName.test(firstname) === false) {
      alert("Enter valid First name")
      return false
    } else if (firstname.length < 3) {
      Alert.alert("First name should be more than 3 Characters")
    } else if (lastname.length == 0) {
      Alert.alert("Last Name should not be empty")
    } else if (OyeFullName.test(lastname) === false) {
      alert("Enter valid Last name")
      return false
    } else if (lastname.length < 3) {
      Alert.alert("Last Name should be more than 3 Characters")
    } else if (regemail.test(email) === false)  {

       Alert.alert("Enter valid  Email id")
    }
    else if (regemail.test(alternateemail) == false && !alternateemail.length == "")  {

      Alert.alert("Enter valid Alternate Email id")
   }
    // else if (alternateemail.length == 0) {
    //   Alert.alert("Enter valid primary mail id");
    // }
    // else if (regemail.test(alternateemail) === false) {
    //   Alert.alert("Enter valid alternative email id.");
    // }
    else {
      fetch(
        `http://${this.props.oyeURL}/oyeliving/api/v1/AccountDetails/Update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
          },
          body: JSON.stringify({
            ACFName: firstname,
            ACLName: lastname,
            ACMobile: this.props.MyMobileNumber,
            ACEmail: email,
            ACISDCode:  this.props.MyISDCode,
            ACMobile1: null,
            ACISDCode1: null,
            ACMobile2: null,
            ACISDCode2: null,
            ACMobile3: null,
            ACISDCode3: null,
            ACMobile4: null,
            ACISDCode4: null,
            ACEmail1: alternateemail,
            ACEmail2: null,
            ACEmail3: null,
            ACEmail4: null,
            ACImgName: fimage.length <= 0 ? this.state.ImageSource : fimage,
            ACAccntID: this.props.MyAccountID
          })
        }
      )
        .then(responseData => responseData.json())
        .then(responseJson => {
          // Alert.alert("Saved");
          this.props.navigation.goBack()
          // this.setState({
          //   datasource: responseJson

          // })
        })
        .catch(error => {
          console.log(error)
          Alert.alert("Upload Fail")
        })
    }
  }

  static navigationOptions = {
    title: "My Profile",
    header: null
  }
  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 250,
      maxHeight: 250,
      storageOptions: {
        skipBackup: true
      }
    }
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
      Email: this.props.navigation.state.params.profileDataSourceEmail
        ? this.props.navigation.state.params.profileDataSourceEmail
        : ""
    })

    this.setState({
      AlternateEmail: this.props.navigation.state.params
        .profileDataSourceAlternateEmail
        ? this.props.navigation.state.params.profileDataSourceAlternateEmail
        : ""
    })
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 250,
      maxHeight: 250,
      storageOptions: {
        skipBackup: true
      }
    }

    //launch camera
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response)

      if (response.didCancel) {
        console.log("User cancelled photo picker")
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error)
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton)
      } else {
        let source = { uri: response.uri }

        // You can also display the image using data:
        // let source = { uri: "data:image/jpeg;base64," + response.data };

        this.setState({
          ImageSource: source
        })
      }
    })
  }

  render() {
    const { navigate } = this.props.navigation

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss()
        }}
      >
        <View style={styles.mainViewStyle}>
          {/* <Header /> */}
          <SafeAreaView style={{ backgroundColor: "orange" }}>
          <View style={[styles.viewStyle1, { flexDirection: "row" }]}>
            <View style={styles.viewDetails1}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("MyProfileScreen");
                }}
              >
                <View
                  style={{
                    height: hp("4%"),
                    width: wp("15%"),
                    alignItems: 'flex-start',
                    justifyContent: "center"
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={require("../icons/back.png")}
                    style={styles.viewDetails2}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={[styles.image1]}
                source={require("../icons/OyeSpace.png")}
              />
            </View>
            <View style={{ flex: 0.2 }}>
              {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
            </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: "orange" }} />
        </SafeAreaView>
        <KeyboardAwareScrollView>
            <View style={styles.mainContainer}>
              <View style={styles.textWrapper}>
                <View style={styles.myProfileFlexStyle}>
                  <View style={styles.emptyViewStyle} />
                  <View style={styles.viewForMyProfileText}>
                    <Text style={styles.myProfileTitleStyle}>Edit Profile</Text>
                  </View>
                  <View style={styles.emptyViewStyle} />
                </View>

                <ScrollView>
                  <View style={styles.containerView_ForProfilePicViewStyle}>
                    <TouchableOpacity
                      onPress={this.selectPhotoTapped.bind(this)}
                    >
                      <View style={styles.viewForProfilePicImageStyle}>
                        {this.state.ImageSource === null ? (
                          <Image
                            style={styles.profilePicImageStyle}
                            source={require("../icons/camwithgradientbg.png")}
                          />
                        ) : (
                          <Image
                            style={styles.profilePicImageStyle}
                            source={this.state.ImageSource}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={this.selectPhotoTapped.bind(this)}
                    >
                      <View style={styles.imagesmallCircle}>
                        <Image
                          style={[styles.smallImage]}
                          source={require("../icons/cam_with_gray_bg.png")}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View>
                    <Card style={styles.myProfileCardsStyle}>
                      {/* <Item stackedLabel style={styles.cardItemsStyle}> */}
                      <Text style={styles.itemTextTitles}>First Name:</Text>
                      {/* <View style={styles.underlineStyle}> */}
                      <Input
                        style={styles.itemTextValues}
                        autoCorrect={false}
                        autoCapitalize="words"
                        multiline={false}
                        maxLength={24}
                        
                        keyboardType="default"
                        placeholder="Enter First Name Here"
                        defaultValue={
                          this.props.navigation.state.params
                            .profileDataSourceFirstName
                            ? this.props.navigation.state.params
                                .profileDataSourceFirstName
                            : ""
                        }
                        onChangeText={this.FName}
                      />
                      {/* </View> */}
                      {/* </Item> */}
                    </Card>
                  </View>

                  <View>
                    <Card style={styles.myProfileCardsStyle}>
                      {/* <Item stackedLabel style={styles.cardItemsStyle}> */}
                      <Text style={styles.itemTextTitles}>Last Name:</Text>
                      <Input
                        style={styles.itemTextValues}
                        autoCorrect={false}
                        autoCapitalize="words"
                        multiline={false}
                        maxLength={30}
                        keyboardType="default"
                        placeholder="Enter Last Name Here"
                        defaultValue={
                          this.props.navigation.state.params
                            .profileDataSourceLastName
                            ? this.props.navigation.state.params
                                .profileDataSourceLastName
                            : ""
                        }
                        onChangeText={this.LName}
                      />
                      {/* </Item> */}
                    </Card>
                  </View>

                  <View>
                    <Card style={styles.myProfileCardsStyle}>
                      {/* <Item stackedLabel style={styles.cardItemsStyle}> */}
                      <Text style={styles.itemTextTitles}>Email:</Text>
                      <Input
                        style={styles.itemTextValues}
                        autoCorrect={false}
                        autoCapitalize="words"
                        multiline={false}
                        maxLength={30}
                        keyboardType="email-address"
                        placeholder="Enter Primary Email Here"
                        defaultValue={
                          this.props.navigation.state.params
                            .profileDataSourceEmail
                            ? this.props.navigation.state.params
                                .profileDataSourceEmail
                            : ""
                        }
                        onChangeText={this.FEmail}
                      />
                      {/* </Item> */}
                    </Card>
                  </View>

                  <View>
                    <Card style={styles.myProfileCardsStyle}>
                      {/* <Item stackedLabel style={styles.cardItemsStyle}> */}
                      <Text style={styles.itemTextTitles}>
                        Alternate Email:
                      </Text>
                      <Input
                        style={styles.itemTextValues}
                        autoCorrect={false}
                        autoCapitalize="words"
                        multiline={false}
                        maxLength={30}
                        keyboardType="email-address"
                        placeholder="Enter Aternate Email here"
                        defaultValue={
                          this.props.navigation.state.params
                            .profileDataSourceAlternateEmail
                            ? this.props.navigation.state.params
                                .profileDataSourceAlternateEmail
                            : ""
                        }
                        onChangeText={this.AEmail}
                      />
                      {/* </Item> */}
                    </Card>
                  </View>
                  {/* <View style={styles.viewForPaddingAboveAndBelowUpdateButtons}>
                    <Button
                      bordered
                      warning
                      style={styles.buttonUpdateStyle}
                      onPress={() => this.myEditProfile()}
                    >
                      <Text style={styles.textInUpdateButtonStyle}>Update</Text>
                    </Button>
                  </View> */}
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
    image1: {
        width: wp("17%"),
        height: hp("12%"),
        marginRight: hp("3%")
      },
    viewDetails2: {
        alignItems: "flex-start",
        justifyContent: "center",
        width: hp("3%"),
        height: hp("3%"),
        marginTop: 5
        // marginLeft: 10
      },
    viewStyle1: {
        backgroundColor: "#fff",
        height: hp("7%"),
        width: Dimensions.get("screen").width,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
        position: "relative"
      },
      viewDetails1: {
        flex: 0.3,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 3
      },
  textWrapper: {
    height: hp("85%"),
    width: wp("95%")
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
  emptyViewStyle: {
    flex: 1
  },
  viewForMyProfileText: {
    flex: 4,
    justifyContent: "center",
    alignSelf: "center"
  },
  myProfileTitleStyle: {
    textAlign: "center",
    fontSize: hp("2.5%"),
    fontWeight: "500"
  },
  editButtonViewStyle: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  editButtonImageStyle: {
    width: wp("4.5%"),
    height: hp("4.5%")
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
    marginBottom: hp("8%"),
    marginLeft: hp("4%")
  },
  profilePicImageStyle: {
    width: 110,
    height: 110,
    borderColor: "orange",
    borderRadius: 55,
    borderWidth: hp("0.2%") / PixelRatio.get()
  },
  myProfileCardsStyle: {
    marginTop: hp("0.5%"),
    paddingHorizontal: hp("2%"),
    paddingVertical: hp("0.3%"),
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: hp("7%")
  },
  cardItemsStyle: {
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  itemTextTitles: {
    fontSize: hp("1.6%"),
    fontWeight: "300",
    // fontStyle: "italic",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    color: "#909091",
    paddingLeft: hp("0.8%")
  },
  itemTextValues: {
    
    fontSize: hp("2%"),
    fontWeight: "300",
    paddingTop: hp("0.3%"),
    paddingHorizontal: hp("0.5%"),
    paddingBottom: hp("0.2%"),
    width:wp('90%'),
    // alignItems: "flex-start",
    // justifyContent: "flex-start",
    color: "#474749"
  },

//   underlineStyle: {
//       flex:1,
//       marginLeft:hp('2%')
//   },
  viewForPaddingAboveAndBelowUpdateButtons: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp("4%"),
    marginBottom: hp("2%"),
    marginHorizontal: hp("2%")
  },
  buttonUpdateStyle: {
    width: wp("28%"),
    height: hp("5%"),
    borderRadius: hp("2.5%"),
    borderWidth: hp("0.2%"),
    borderColor: "orange",
    backgroundColor: "orange",
    justifyContent: "center"
  },
  textInUpdateButtonStyle: {
    color: "white",
    fontWeight: "600",
    fontSize: hp("2%")
  },
  imagesmallCircle: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    width: 10,
    height: 10,
    marginTop: hp("5%"),
    marginLeft: hp("2%"),
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
    justifyContent: "space-between",
    marginTop: hp("4%"),
    marginBottom: hp("2%"),
    marginHorizontal: hp("2%")
  },
  buttonFamily: {
    width: wp("32%"),
    height: hp("5%"),
    borderRadius: hp("2.5%"),
    borderWidth: hp("0.2%"),
    borderColor: "#C3C3C3",
    backgroundColor: "#C3C3C3",
    justifyContent: "center"
  },
  textFamilyVehicle: {
    color: "white",
    fontWeight: "600",
    fontSize: hp("2%")
  },
  buttonVehicle: {
    width: wp("32%"),
    height: hp("5%"),
    borderRadius: hp("2.5%"),
    borderWidth: hp("0.2%"),
    borderColor: "orange",
    backgroundColor: "orange",
    justifyContent: "center"
  }
})

const mapStateToProps = state => {
  return {
      oyeURL: state.OyespaceReducer.oyeURL,
      MyAccountID: state.UserReducer.MyAccountID,
      MyMobileNumber: state.UserReducer.MyMobileNumber,
      MyISDCode: state.UserReducer.MyISDCode,
      // viewImageURL: state.OyespaceReducer.viewImageURL
  }
}

export default connect(mapStateToProps)(EditProfile);

