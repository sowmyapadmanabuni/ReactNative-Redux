import React, { Component } from "react";
import {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  Alert,
  Image,
  Text,
  TouchableHighlight,
  ActivityIndicator,
  Linking,
  TextInput,
  View,
  PermissionsAndroid,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,BackHandler
} from "react-native";
import { TextField } from "react-native-material-textfield";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import Header from "./Header.js";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
// import OTPInputView from 'react-native-otp-input';
import { Button } from "native-base";
import { connect } from "react-redux";
import { updateUserInfo } from "../src/actions";
import base from "../src/base";

class OTPVerification extends Component {
  static navigationOptions = {
    title: "OTP Verification",
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      Mobilenumber: "",
      OTPNumber: "",
      isLoading: false,
      timer: 180,
      dobTextDMY: "",
      loginTime: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
      isCallLimit:true,
      isSmsLimit:true,
    };

    this.getOTP = this.getOTP.bind(this);
  }


  componentDidUpdate() {
    setTimeout(()=>{
      BackHandler.addEventListener('hardwareBackPress',()=>this.processBackPress())
    },100);
    if (this.state.timer === 1) {
      clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    setTimeout(()=>{
      BackHandler.removeEventListener('hardwareBackPress',()=> this.processBackPress())
    },0)
    
  }

   processBackPress(){
    console.log("Part");
    const {goBack} = this.props.navigation;
    goBack(null);
  }

  componentDidMount() {
    this.interval = setInterval(
        () => this.setState(prevState => ({ timer: prevState.timer - 1 })),
        1000
    );
  }
  handleMobile = mobilenumber => {
    this.setState({ Mobilenumber: mobilenumber });
  };
  handleOTP = otp => {
    this.setState({ OTPNumber: otp });
  };

  verifyOTP = otp_number1 => {
    let otp_number = this.state.OTPNumber;

    //const reg = /^[0]?[789]\d{9}$/;
    if (otp_number == 0) {
      Alert.alert("OTP Number cannot be Empty");
    } else if (otp_number.length < 6) {
      Alert.alert("Enter 6 digit OTP Number");
      return false;
    } else {
      let anu = {
        CountryCode: this.props.MyISDCode,
        MobileNumber: this.props.MyMobileNumber,
        OTPnumber: otp_number
      };

      //http://122.166.168.160/champ/api/v1/account/verifyotp
      url = `http://${this.props.oyeURL}/oyeliving/api/v1/account/verifyotp`;
      console.log("req verifyotp ", JSON.stringify(anu) + " " + url);

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
        },
        body: JSON.stringify(anu)
      })
          .then(response => response.json())
          .then(responseJson => {
            console.log("ravii", responseJson);
            if (responseJson.success) {
              if (responseJson.data == null) {
                this.props.navigation.navigate("RegistrationPageScreen");
              } else {
                const login = moment(new Date()).format("DD-MM-YYYY HH:mm:ss");
                var today = new Date();
                let date =
                    today.getDate() +
                    "/" +
                    parseInt(today.getMonth() + 1) +
                    "/" +
                    today.getFullYear();

                const { updateUserInfo, MyMobileNumber, MyISDCode } = this.props;
                const {
                  acAccntID,
                  acfName,
                  aclName,
                  acEmail
                } = responseJson.data.account;

                updateUserInfo({
                  prop: "MyAccountID",
                  value: acAccntID
                });
                updateUserInfo({ prop: "MyEmail", value: acEmail });
                updateUserInfo({
                  prop: "MyMobileNumber",
                  value: MyMobileNumber
                });
                updateUserInfo({
                  prop: "MyFirstName",
                  value: acfName
                });
                updateUserInfo({
                  prop: "MyLastName",
                  value: aclName
                });
                updateUserInfo({
                  prop: "MyISDCode",
                  value: MyISDCode
                });
                updateUserInfo({ prop: "signedIn", value: true });

                // AsyncStorage.setItem("userId", login);

                global.MyLoginTime = moment(new Date()).format(
                    "DD-MM-YYYY HH:mm:ss"
                );
                this.props.navigation.navigate("ResDashBoard");
              }
            } else {
              console.log("hiii", "failed" + anu);
              alert("Invalid OTP, check Mobile Number and try again");
            }

            console.log("suvarna", "hi");
          })
          .catch(error => {
            console.error("err " + error);
            console.log("Verification", "error " + error);
            alert("OTP Verification failed");
          });
    }
  };

  changeNumber = mobilenumber => {
    this.props.navigation.navigate("MobileReg");
  };

  getOTP(){
    const reg = /^[0]?[6789]\d{9}$/;

   let anu = {
      CountryCode: this.props.MyISDCode,
      MobileNumber: this.props.MyMobileNumber
    };

    console.log('CALL@@@@',anu);


    let url =
        "http://control.msg91.com/api/retryotp.php?authkey=261622AtznpKYJ5c5ab60e&mobile=" +
        this.props.MyISDCode +
        this.props.MyMobileNumber +
        "&retrytype=voice";
    //  http://122.166.168.160/champ/api/v1/Account/GetAccountDetailsByMobileNumber
    // console.log('anu', url + ' ff' + this.props.MyISDCode + this.props.MyMobileNumber);
    this.setState({
      isLoading: true
    });
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //  "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
      },
      body: JSON.stringify(anu)
    })
        .then(response => response.json())
        .then(responseJson => {
          console.log("bf responseJson Account", responseJson,responseJson.type);

          if (responseJson.type=== "success") {
            this.setState({
              loginTime: new Date(),
            });
            console.log("responseJson Account if", this.state.loginTime);
            // this.insert_OTP(mobilenumber, this.props.MyISDCode,'2019-02-03');
            this.setState({
              dobTextDMY: moment(new Date()).format("YYYY-MM-DD")
            });
          } else {
            console.log("responseJson Account else", responseJson.data);
            this.setState({ isCallLimit:false})

           alert("Sorry OTP not sent, Maximum number of attempts are exceeded");
            // this.props.navigation.navigate('CreateOrJoinScreen');
          }
          console.log("suvarna", "hi");
          this.setState({
            isLoading: false
          });
        })
        .catch(error => {
          console.error(error);
          alert(" Failed to Get OTP");
          this.setState({
            isLoading: false
          });
        });
  };
  getOtp1 = mobilenumber => {
    const reg = /^[0]?[6789]\d{9}$/;

    let anu = {
      CountryCode: this.props.MyISDCode,
      MobileNumber: this.props.MyMobileNumber
    };

    /*  db.transaction(tx => {
       tx.executeSql('delete  FROM OTPVerification ', [], (tx, results) => {
         console.log('Results OTPVerification delete ', results.rowsAffected);
       });
     }); */

    let url = `http://${this.props.oyeURL}/oyeliving/api/v1/account/resendotp`;
    //  http://122.166.168.160/champ/api/v1/Account/GetAccountDetailsByMobileNumber
    console.log(
        "anu",
        url + " ff" + this.props.MyISDCode + this.props.MyMobileNumber
    );
    this.setState({
      isLoading: true
    });
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //  "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
      },
      body: JSON.stringify(anu)
    })
        .then(response => response.json())
        .then(responseJson => {
          console.log("bf responseJson Account", responseJson);

          if (responseJson.success) {
            this.setState({
              loginTime: new Date()
            });
            console.log("responseJson Account if", this.state.loginTime);
            // this.insert_OTP(mobilenumber, this.props.MyISDCode,'2019-02-03');
            this.setState({
              dobTextDMY: moment(new Date()).format("YYYY-MM-DD")
            });
          } else {
            console.log("responseJson Account else", responseJson.data);

            this.setState({isSmsLimit:false
            })
            alert("Sorry OTP not sent, Maximum number of attempts are exceeded");
            // this.props.navigation.navigate('CreateOrJoinScreen');
          }
          console.log("suvarna", "hi");
          this.setState({
            isLoading: false
          });
        })
        .catch(error => {
          console.error(error);
          alert(" Failed to Get OTP");
          this.setState({
            isLoading: false
          });
        });
  };

  render() {
    console.log('Count',this.state.count)
    return (
        <View
            style={{ flex: 1, flexDirection: "column", backgroundColor: "#fff" }}
        >
          {/* <TouchableOpacity
          style={{backgroundColor: "white",paddingTop: 2,paddingRight: 2,paddingLeft: 2,alignItems: "center",flexDirection: "row",paddingBottom: 2,borderColor: "#FF8C00",borderRadius: 4,borderWidth: 1,textAlign: "center",marginTop: 30}}
          onPress={()=> this.props.navigation.goBack()} >
          <Image
            source={require("../img/back.png")}
            style={{flex: 1,height: 25,width: 25,margin: 5,alignSelf: "center"}}
          />
          <Text style={{flex: 3,fontSize: 12,paddingLeft: 5,fontSize: 14,color: "black",alignContent: "flex-start",alignSelf: "center"}}>
            Back
          </Text>
          <Text
            style={{flex: 4,fontSize: 12,paddingLeft: 15,fontSize: 14,color: "black",alignSelf: "center",backgroundColor: "white"}}>
            OTP Verification
          </Text>
          <Text
            style={{flex: 4,fontSize: 12,paddingLeft: 15,fontSize: 14,color: "black",alignSelf: "center"}}/>
        </TouchableOpacity>
        <View style={{backgroundColor: "lightgrey",flexDirection: "row",height: 1,width: "100%"}}/> */}

          {/* <Header /> */}

          <SafeAreaView style={{ backgroundColor: "#ff8c00" }}>
            <View style={[styles.viewStyle1, { flexDirection: "row" }]}>
              <View style={styles.viewDetails1}>
                <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('MobileValid');
                    }}
                >
                  <View
                      style={{
                        height: hp("4%"),
                        width: wp("15%"),
                        alignItems: "flex-start",
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
                    source={require("../icons/headerLogo.png")}
                />
              </View>
              <View style={{ flex: 0.2 }}>
                {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
              </View>
            </View>
            <View style={{ borderWidth: 1, borderColor: "#ff8c00" }} />
          </SafeAreaView>

          <KeyboardAwareScrollView>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text
                    style={{
                      color: "#ff8c00",
                      fontSize: hp("2.5%"),
                      marginTop: hp("1.5%"),
                      marginBottom: hp("1.5%")
                    }}
                >
                  Enter OTP
                </Text>
              </View>
              <View>
                <TextInput
                    style={{
                      padding: 5,
                      paddingTop: hp("5%"),
                      textAlign: "center",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      letterSpacing: hp("1.5%"),
                      width: wp("50%"),
                      fontSize: hp("2%"),
                      alignSelf: "center",
                      backgroundColor: "white",
                      borderBottomWidth: 1,
                      borderColor: "#38bcdb",
                      marginBottom: 10
                    }}
                    placeholder="Enter OTP"
                    placeholderTextColor="#474749"
                    onChangeText={this.handleOTP}
                    maxLength={6}
                    allowFontScaling={true}
                    textBreakStrategy="highQuality"
                    returnKeyType="done"
                    keyboardType={"numeric"}
                />
                <View style={{ alignSelf: "center", marginTop: hp("4%") }}>
                      <Button
                          onPress={this.verifyOTP.bind(this, this.state.OTPNumber)}
                          style={{
                            width: wp("30%"),
                            height: hp("4.8%"),
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#ff8c00"
                          }}
                          rounded
                      >
                        <Text style={{ color: "white", fontSize: hp("2%") }}>
                          Submit
                        </Text>
                      </Button>
                </View>
              </View>

              <View>
            {this.state.timer === 1 ? (
                    <Text> </Text>
                ) : (
                    <Text
                        style={{
                          color: "black",
                          margin: "1%",
                          textAlign: "center",
                          marginTop: hp("5%")
                        }}
                    >
                      Resend OTP in {this.state.timer} seconds{" "}
                    </Text>
                )}
                <TouchableOpacity
                    style={[styles.mybutton,{borderColor: this.state.timer === 1 && this.state.isSmsLimit? "#ff8c00":base.theme.colors.grey,
                      backgroundColor:this.state.timer === 1 && this.state.isSmsLimit ?base.theme.colors.primary:base.theme.colors.grey,}]}
                    onPress={this.getOtp1.bind(this, this.state.OTPNumber)}
                    disabled={this.state.timer !== 1 || !this.state.isSmsLimit}
                >
                  <Text style={[styles.submitButtonText,{color:base.theme.colors.white,
                  }]}>
                    Resend OTP <Image />
                  </Text>
                </TouchableOpacity>


                <View style={{ alignSelf: "center", marginTop: hp("4%") }}>
                  <TouchableOpacity
                      style={[styles.mybutton,{borderColor: this.state.timer === 1 && this.state.isCallLimit ? "#ff8c00":base.theme.colors.grey,
                        backgroundColor:this.state.timer === 1 && this.state.isCallLimit ?base.theme.colors.primary:base.theme.colors.grey,}]}
                      onPress={()=>this.getOTP()}
                      disabled={this.state.timer !== 1 || !this.state.isCallLimit}
                  >
                    <Text style={[styles.submitButtonText,{color:base.theme.colors.white,
                    }]}>
                      Receive OTP By Call <Image />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                  style={{
                    width: Dimensions.get("screen").width,
                    alignItems: "center",
                    justifyContent: "center",
                    alignContent: "center",
                    marginTop: hp("5%"),
                    height: hp("35%")
                  }}
              >
                <Image
                    style={styles.image}
                    source={require("../icons/img5.png")}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 23
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: "#7a42f4",
    borderWidth: 1
  },
  input1: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 15,
    height: 40,
    borderColor: "#F2F2F2",
    backgroundColor: "#F2F2F2",
    borderWidth: 1.5,
    borderRadius: 2,
    flexDirection: "row"
  },
  submitButton: {
    backgroundColor: "orange",
    padding: 10,
    margin: 15,
    height: 40
  },
  submitButtonText: {
    textAlign: "center"
  },
  container: {
    flex: 1,
    paddingTop: 100
  },
  image: {
    width: wp("80%"),
    height: hp("30%")
  },
  text: { fontSize: 10, color: "black" },

  mobilenumberverification: {
    width: "100%",
    marginTop: "2%",
    color: "#060606",
    textAlign: "center",
    fontSize: 19 //lineheight: '17px',
  },

  pleaseenteryourmobilenumbe: {
    height: "10%",
    width: "80%",
    color: "#060606",
    textAlign: "center",
    alignSelf: "center",
    fontSize: 15 //lineheight: '13px',
  },
  mybutton1: {
    backgroundColor: "orange",
    width: "50%",
    paddingTop: 8,
    marginTop: "5%",
    marginRight: "25%",
    marginLeft: "25%",
    padding: 4,
    borderColor: "white",
    borderRadius: 0,
    borderWidth: 2,
    textAlign: "center",
    color: "white",
    justifyContent: "center"
  },
  mybutton: {
    alignSelf: "center",
    width: wp("50%"),
    borderRadius: hp("5%"),
    borderWidth: 1,
    justifyContent: "center",
    height: hp("4.5%")
  },
  verifyButton: {
    alignSelf: "center",
    marginTop: 5,
    width: "50%",
    paddingTop: 2,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "orange"
  },
  mybuttonDisable: {
    alignSelf: "center",
    width: wp("50%"),
    backgroundColor: "#fff",
    borderRadius: hp("5%"),
    borderWidth: 1,
    justifyContent: "center",
    borderColor: "#ff8c00",
    height: hp("4.5%")
  },

  ihavereadandacceptthepri: {
    height: "15%",
    width: "80%",
    marginTop: "5%",
    color: "#020202",
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 12 //lineheight: '8px',
  },
  textInput: {
    fontSize: 16,
    height: 40
  },
  inputLayout: {
    marginTop: 8,
    marginHorizontal: 6,
    height: 50
  },
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    margin: 20
  },
  borderStyleBase: {
    width: 30,
    height: 45
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6"
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6"
  },

  viewStyle1: {
    backgroundColor: "#fff",
    height: hp("7%"),
    width: Dimensions.get("screen").width,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    elevation: 2,
    position: "relative"
  },
   image1: {
    width: wp("22%"),
    height: hp("12%"),
    marginRight: hp("3%")
  },

 
  viewDetails1: {
    flex: 0.3,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3
  },
  viewDetails2: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: hp("3%"),
    height: hp("3%"),
    marginTop: 5
    // marginLeft: 10
  },

});

const mapStateToProps = state => {
  return {
    oyeURL: state.OyespaceReducer.oyeURL,
    champBaseURL: state.OyespaceReducer.champBaseURL,
    oye247BaseURL: state.OyespaceReducer.oye247BaseURL,
    oyeBaseURL: state.OyespaceReducer.oyeBaseURL,
    MyISDCode: state.UserReducer.MyISDCode,
    MyMobileNumber: state.UserReducer.MyMobileNumber
  };
};

export default connect(
    mapStateToProps,
    { updateUserInfo }
)(OTPVerification);