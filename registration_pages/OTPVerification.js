import React, { Component } from 'react';
import {
  AppRegistry, AsyncStorage,StyleSheet, Alert, Image, Button, Text, TouchableHighlight, ActivityIndicator,
  TouchableOpacity, Linking, TextInput, View,PermissionsAndroid,KeyboardAvoidingView
} from 'react-native';
// import { TextInputLayout } from 'rn-textinputlayout';
import { openDatabase } from 'react-native-sqlite-storage';
import { Fonts } from '../pages/src/utils/Fonts';
import PhoneInput from "react-native-phone-input";
import moment from 'moment';
import SMSVerifyCode from 'react-native-sms-verifycode';
import { connect } from 'react-redux';
import { updateUserInfo } from '../src/actions';

var db = openDatabase({ name: global.DB_NAME });
var Otp_auto;
console.disableYellowBox = true;


class OTPVerification extends Component {
  constructor(props) {
    super(props);
   // this.SMSReadSubscription = {};
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='LoginTime'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {

            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS LoginTime(Logintime VARCHAR(50))',
              []
            );

          }
        }
      );
    });
    db.transaction(txMyMem => {
      txMyMem.executeSql('SELECT * FROM OTPVerification', [], (txMyMem, resultsMyMem) => {
        console.log('Results OTPVerification ', resultsMyMem.rows.length + ' ');
      });
    });

    console.log('start screen OTPVerification ', global.MyISDCode + ' ' + global.MyMobileNumber);
  }

  componentDidMount() {
    this.interval = setInterval(
      () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
      1000
    );
  }

  componentWillUnmount() {
    //remove listener
   // this.SMSReadSubscription.remove();
  }
  
  componentDidUpdate() {
    if (this.state.timer === 1) {
      clearInterval(this.interval);
    }
  }
  // this.state ={ timer: 30}
  state = {
    Mobilenumber: '',
    OTPNumber: '',
    isLoading: false,
    timer: 60,
    dobTextDMY: '',
    loginTime: moment(new Date()).format('DD-MM-YYYY HH:mm:ss'),
  }

  static navigationOptions = {
    title: 'Registration',
    headerStyle: {
      backgroundColor: '#696969',
    },
    headerTitleStyle: {
      color: '#fff',
    }
  };

  handleMobile = (mobilenumber) => {
    this.setState({ Mobilenumber: mobilenumber })
  }
  
  handleOTP = (otp) => {
    this.setState({ OTPNumber: otp })
  }

  verifyAutoOTP = (Auto_OTP_Number) => {
    const { updateUserInfo } = this.props;
    //const reg = /^[0]?[789]\d{9}$/;
    console.log('ravii', Auto_OTP_Number.length+' '+' ');
      anu = {
        "CountryCode"  : global.MyISDCode,
        "MobileNumber" : global.MyMobileNumber,
        "OTPnumber" : Auto_OTP_Number
      }
      
      //http://122.166.168.160/champ/api/v1/account/verifyotp
      url = global.champBaseURL +'account/verifyotp';
      console.log('req verifyotp ', JSON.stringify(anu)+ ' '+url);
      this.setState({
        isLoading: true
      })
      fetch(url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
          },
          body: JSON.stringify(anu)
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('raviiqq', responseJson);
          console.log('hiii', 'bbbf33');
          if (responseJson.success) {

            if (responseJson.data == null) {
              this.props.navigation.navigate('RegistrationPageScreen');

            } else {

              this.insert_Accounts(
                responseJson.data.account.acAccntID,
                responseJson.data.account.acfName,
                responseJson.data.account.aclName,
                global.MyMobileNumber, 
                global.MyISDCode,
                responseJson.data.account.acEmail);
              this.props.navigation.navigate('App');
            }
          }  else {
            console.log('hiii', 'failed'+anu);
            alert('Invalid OTP, check Mobile Number and try again');
          }

          console.log('suvarna', 'hi');
        })
        .catch((error) => {
          console.error('err '+error);
          console.log('Verification', 'error '+error);
          alert('OTP Verification failed');

        });

  }

  verifyOTP = (otp_number1) => {
    otp_number = this.state.OTPNumber;

    //const reg = /^[0]?[789]\d{9}$/;
    console.log('ravii', otp_number.length + ' ' + ' ');
    if (otp_number == 0) {
      alert('OTP Number cannot be Empty');
    } else if (otp_number.length < 6) {
      alert('Enter 6 digit OTP Number');
      return false;
    } else {
      anu = {
        "CountryCode": global.MyISDCode,
        "MobileNumber": global.MyMobileNumber,
        "OTPnumber": otp_number
      }

      //http://122.166.168.160/champ/api/v1/account/verifyotp
      url = global.champBaseURL + 'account/verifyotp';
      console.log('req verifyotp ', JSON.stringify(anu) + ' ' + url);

      fetch(url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
          },
          body: JSON.stringify(anu)
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('ravii', responseJson);
          if (responseJson.success) {

            if (responseJson.data == null) {
              this.props.navigation.navigate('RegistrationPageScreen');
            } else {
              console.log('hiii', 'bbbf');

              this.insert_Accounts(responseJson.data.account.acAccntID,
                responseJson.data.account.acfName,
                responseJson.data.account.aclName,
                global.MyMobileNumber, global.MyISDCode,responseJson.data.account.acEmail);
                db.transaction(tx => {
                  tx.executeSql('delete  FROM LoginTime ', [], (tx, results) => {
                    console.log('Results OTPVerification delete ', results.rowsAffected);
                  });
                });
                const login=moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
                this.insertLoginTime(login)
                var today = new Date();
                date=today.getDate() + "/"+ parseInt(today.getMonth()+1) +"/"+ today.getFullYear();
                    // AsyncStorage.setItem('userId', login);
                    // console.log('nanu',login);
                   
             
                // console.log(date);
                    // global.MyLoginTime = moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
                          // console.log('logintime',global.MyLoginTime);
              this.props.navigation.navigate('App');
            }
          } else {
            console.log('hiii', 'failed' + anu);
            alert('Invalid OTP, check Mobile Number and try again');
          }

          console.log('suvarna', 'hi');
        })
        .catch((error) => {
          console.error('err ' + error);
          console.log('Verification', 'error ' + error);
          alert('OTP Verification failed');

        });

    }
  }

  changeNumber = (mobilenumber) => {
    db.transaction(tx => {
      tx.executeSql('delete  FROM OTPVerification ', [], (tx, results) => {
        console.log('Results OTPVerification delete ', results.rowsAffected);
      });
    });
    this.props.navigation.navigate('MobileValid');
  }

  getOtp = (mobilenumber) => {
    const reg = /^[0]?[6789]\d{9}$/;

    anu = {
      "CountryCode": global.MyISDCode,
      "MobileNumber": global.MyMobileNumber

    }

    /*  db.transaction(tx => {
       tx.executeSql('delete  FROM OTPVerification ', [], (tx, results) => {
         console.log('Results OTPVerification delete ', results.rowsAffected);
       });
     }); */

    url = global.champBaseURL + 'account/sendotp';
    //  http://122.166.168.160/champ/api/v1/Account/GetAccountDetailsByMobileNumber
    console.log('anu', url + ' ff' + global.MyISDCode + global.MyMobileNumber);
    this.setState({
      isLoading: true
    })
    fetch(url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //  "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
          "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
        },
        body: JSON.stringify(anu)
      })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log('bf responseJson Account', responseJson);

        if (responseJson.success) {
          // this.setState({
          //   loginTime : new Date()
          // })
          console.log('responseJson Account if', this.state.loginTime);
          this.insert_OTP(mobilenumber, global.MyISDCode,'2019-02-03');
    // this.setState({
    //   dobTextDMY:moment(new Date()).format('YYYY-MM-DD')
    // });


        } else {
          console.log('responseJson Account else', responseJson.data);

          alert('OTP not Sent');
          // this.props.navigation.navigate('CreateOrJoinScreen');
        }
        console.log('suvarna', 'hi');
        this.setState({
          isLoading: false
        })
      })
      .catch((error) => {
        console.error(error);
        alert(' Failed to Get OTP');
        this.setState({
          isLoading: false
        })
      });


  }

  getAcctDetails(cc, mobilenumber) {
    anu = {
      "ACISDCode": global.MyISDCode,
      "ACMobile": mobilenumber
    }

    url = global.champBaseURL + 'Account/GetAccountDetailsByMobileNumber';
    //  http://122.166.168.160/champ/api/v1/Account/GetAccountDetailsByMobileNumber
    console.log('anu', url + ' ff' + global.MyISDCode + mobilenumber);
    this.setState({
      isLoading: true
    })
    fetch(url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //  "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
          "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
        },
        body: JSON.stringify(anu)
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('bf responseJson Account', responseJson);

        if (responseJson.success) {
          console.log('responseJson Account if', responseJson.data);

          if (responseJson.data == null) {
            console.log('Account not a Registered', responseJson.data);
            this.props.navigation.navigate('RegistrationPageScreen');
            alert('You are not a Registered User');

          } else {

              console.log('Account Registered', responseJson.data);

            this.insert_Accounts(responseJson.data.accountByMobile[0].acAccntID,
              responseJson.data.accountByMobile[0].acfName,
              responseJson.data.accountByMobile[0].aclName,
              mobilenumber, global.MyISDCode,responseJson.data.accountByMobile[0].acEmail);

            this.props.navigation.navigate('SplashScreen');

          }

        } else {
          console.log('responseJson Account else', responseJson.data);

          alert('You are not a Member of any Association');
          // this.props.navigation.navigate('CreateOrJoinScreen');
        }

        console.log('suvarna', 'hi');
      })
      .catch((error) => {
        console.error(error);
        alert(' Failed to Get');
      });
  }

  insert_OTP(mobile_number, isd_code,logon) {
    console.log('INSERT logon ', logon);
    db.transaction(function (tx) {
      //ID INTEGER,  OTPVerified boolean ,'
      // + '  MobileNumber VARCHAR(20),   '+ ' ISDCode VARCHAR(20)
      tx.executeSql(
        'INSERT INTO OTPVerification ( MobileNumber, ISDCode, Time ' +
        '  ) VALUES (?,?,?)',
        [mobile_number, isd_code,logon],
        (tx, results) => {
          console.log('INSERT OTPVerification ', results.rowsAffected + ' ' + mobile_number + ' ' + isd_code+' '+logon);
        }
      );
    });
  }

  insertLoginTime(login_time) {
    

    db.transaction(function (tx) {
      //Account( AccountID INTEGER,  FirstName VARCHAR(50) ,LastName VARCHAR(50), '
      //  + '  MobileNumber VARCHAR(20), Email VARCHAR(50),  '+ ' ISDCode VARCHAR(20))
      tx.executeSql(
        'INSERT INTO LoginTime (Logintime) VALUES (?)',
        [login_time],
        (tx, results) => {
          console.log('INSERT LoginTime ', results.rowsAffected + ' ' + login_time);

        }
      );
    });
  }

  insert_Accounts(account_id, first_name, last_name, mobile_number, isd_code,email) {

    const { updateUserInfo } = this.props;

    updateUserInfo({ prop: 'MyAccountID', value: account_id })
    updateUserInfo({ prop: 'MyEmail', value: email })
    updateUserInfo({ prop: 'MyMobileNumber', value: mobile_number })
    updateUserInfo({ prop: 'MyFirstName', value: first_name })
    updateUserInfo({ prop: 'MyLastName', value: last_name })
    updateUserInfo({ prop: 'MyISDCode', value: isd_code })
    updateUserInfo({ prop: 'signedIn', value: true })

    // console.log('bf_account',   ' ' + account_id);

    // db.transaction(function (tx) {
    //   //Account( AccountID INTEGER,  FirstName VARCHAR(50) ,LastName VARCHAR(50), '
    //   //  + '  MobileNumber VARCHAR(20), Email VARCHAR(50),  '+ ' ISDCode VARCHAR(20))
    //   tx.executeSql(
    //     'INSERT INTO Account (AccountID, FirstName, LastName, MobileNumber, ISDCode , Email  ' +
    //     '  ) VALUES (?,?,?,?,?,?)',
    //     [account_id, first_name, last_name, mobile_number, isd_code,email],
    //     (tx, results) => {
    //       console.log('INSERT Account ', results.rowsAffected + ' ' + account_id);

    //     }
    //   );
    // });
  }

  insert_OTP(mobile_number, isd_code,logon) {

    db.transaction(function (tx) {
      //ID INTEGER,  OTPVerified boolean ,'
      // + '  MobileNumber VARCHAR(20),   '+ ' ISDCode VARCHAR(20)
      tx.executeSql(
        'INSERT INTO OTPVerification ( MobileNumber, ISDCode,Time  ' +
        '  ) VALUES (?,?,?)',
        [mobile_number, isd_code,logon],
        (tx, results) => {
          console.log('INSERT OTPVerification ', results.rowsAffected + ' ' + mobile_number + ' ' + isd_code+logon);

        }
      );
    });
  }

  render() {

    return (

      <View style={{
        flex: 1, flexDirection: 'column',
        backgroundColor: '#fff'
      }}>
        <TouchableOpacity
          style={{
            paddingTop: 2, paddingRight: 2, paddingLeft: 2, alignItems: 'center', flexDirection: 'row',
            paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:45,
          }}
          onPress={this.changeNumber.bind(this, this.state.Mobilenumber)}  /*Products is navigation name*/>
          <Image source={require('../pages/assets/images/back.png')}
            style={{ flex: 1, height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
          <Text style={{ flex: 3, fontSize: 12, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}>Back </Text>
          <Text style={{ flex: 4, fontSize: 12, paddingLeft: 15, fontSize: 14, color: 'black', alignSelf: 'center' }}>OTP Verification</Text>
          <Text style={{ flex: 4, fontSize: 12, paddingLeft: 15, fontSize: 14, color: 'black', alignSelf: 'center' }}></Text>
        </TouchableOpacity>
        <View style={{
          backgroundColor: 'lightgrey',
          flexDirection: "row",
          height: 1, width: '100%'

        }}>


        </View>
        <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
        <Image
          source={require('../pages/assets/images/building_complex.png')}
          style={{ width: '100%', height: '35%', alignSelf: 'center', }}
        />
        {this.state.isLoading ? <View style={{ height: '5%' }}>
          <ActivityIndicator />
        </View> : <Text style={{ height: '5%' }}> </Text>}
        <KeyboardAvoidingView behavior="position">
        <Text style={styles.mobilenumberverification} >Enter OTP Sent to</Text>
        <Text style={styles.mobilenumberverification} >{global.MyISDCode}{global.MyMobileNumber} </Text>

        
            {/* <TextField
              label='OTP'
              fontSize={12}
              labelHeight={10}
              characterRestriction={10}
              activeLineWidth={0.1}
              keyboardType='numeric'
              returnKeyType='done'
              maxLength={10}
              onChangeText={this.handleOTP}
            /> */}
          <TextInput
          style={{
            padding: 5, textAlign: 'center', textDecorationLine: 'underline',
            letterSpacing: 5, width: 120, alignSelf: 'center', backgroundColor: 'white',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: 'orange'
          }}
          
          underlineColorAndroid="#828282"
          placeholder="Enter OTP"
          placeholderTextColor="black"
          onChangeText={this.handleOTP}
          maxLength={6}
          returnKeyType="done"
          
          keyboardType={'numeric'} /> 
        {/* <SMSVerifyCode
          style={{ marginTop: '3%' }}
          verifyCodeLength={6}
          returnKeyType="done"
          containerPaddingVertical={10}
          containerPaddingHorizontal={50}
          onInputChangeText={this.handleOTP}
          focusedCodeViewBorderColor={'orange'}
          containerBackgroundColor={'white'}
        /> */}
        {/*  </TextInputLayout>  */}
        {this.state.OTPNumber.length == 6 ? <TouchableOpacity
          style={styles.mybutton}
          onPress={this.verifyOTP.bind(this, this.state.OTPNumber)}>
          <Text style={styles.submitButtonText}>Verify OTP</Text>
        </TouchableOpacity> : <TouchableOpacity
          style={styles.mybuttonDisable}
        >
            <Text style={styles.submitButtonText}>Verify OTP</Text>
          </TouchableOpacity>}
        {/*  <TouchableOpacity
          style={styles.mybutton}
          onPress={this.verifyOTP.bind(this, this.state.OTPNumber)}>
          <Text style={styles.submitButtonText}>Verify OTP</Text>
        </TouchableOpacity> */}
        {/*  <TouchableOpacity
          style={styles.mybutton}
          onPress={this.changeNumber.bind(this, this.state.Mobilenumber)}>
          <Text style={styles.submitButtonText}>Change Mobile Number</Text>
        </TouchableOpacity> */}
        {this.state.timer == 1 ? <Text> </Text> :
          <Text style={{
            color: 'black',
            margin: '1%',
            textAlign: 'center'
          }}>Resend OTP in {this.state.timer} seconds </Text>}
        {this.state.timer == 1 ? <TouchableOpacity
          style={styles.mybutton}
          onPress={this.getOtp.bind(this, this.state.OTPNumber)}>
          <Text style={styles.submitButtonText}>Resend OTP</Text>
        </TouchableOpacity> : <TouchableOpacity
          style={styles.mybuttonDisable}
        >
            <Text style={styles.submitButtonText}>Resend OTP</Text>
          </TouchableOpacity>}
          </KeyboardAvoidingView>
        {/* <TouchableOpacity
          style={styles.mybutton}
          onPress={this.getOtp.bind(this, this.state.Mobilenumber)}>
          <Text style={styles.submitButtonText}>Resend OTP</Text>
        </TouchableOpacity>  */}
        {/* <Text style={styles.ihavereadandacceptthepri}
          onPress={() => {
            //on clicking we are going to open the URL using Linking
            Linking.openURL('http://www.oye247.com/components/termsandconditions.html');
          }}  >I have read and accept the privacy policy and terms of use</Text> */}
          </KeyboardAvoidingView>
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
    borderColor: '#7a42f4',
    borderWidth: 1
  },
  input1: {
    marginLeft: 5, marginRight: 5, marginTop: 15, height: 40, borderColor: '#F2F2F2',
    backgroundColor: '#F2F2F2', borderWidth: 1.5, borderRadius: 2, flexDirection: 'row',
  },
  submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40,
  },
  submitButtonText: {
    color: 'black',
    margin: '1%',
    textAlign: 'center'
  }, container: {
    flex: 1,
    paddingTop: 100
  },
  imagee: { height: 14, width: 14, margin: 10, },
  text: { fontSize: 10,  color: 'black', },

  mobilenumberverification: {
    width: '100%', marginTop: '2%', color: '#060606', textAlign: 'center',
    fontFamily: Fonts.Tahoma, fontSize: 19, //lineheight: '17px',
  },

  pleaseenteryourmobilenumbe: {
    height: '10%', width: '80%', color: '#060606', textAlign: 'center',
    alignSelf: 'center', fontFamily: Fonts.Tahoma, fontSize: 15, //lineheight: '13px',
  },
  mybutton1: {
    backgroundColor: 'orange', width: '50%', paddingTop: 8, marginTop: '5%', marginRight: '25%', marginLeft: '25%',
    padding: 4, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center', color: 'white',
    justifyContent: 'center'
  },
  mybutton: {
    alignSelf: 'center',
    marginTop: 5, width: '50%',
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'orange'
  },
  mybuttonDisable: {
    alignSelf: 'center',
    marginTop: 5, width: '50%',
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'lightgrey'
  },

  ihavereadandacceptthepri: {
    height: '15%', width: '80%', marginTop: '5%', color: '#020202',
    justifyContent: 'center', alignSelf: 'center', fontFamily: Fonts.Tahoma, fontSize: 12,  //lineheight: '8px',
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
    justifyContent: 'center',
    margin: 20
  }

})


export default connect(null , { updateUserInfo })(OTPVerification)
