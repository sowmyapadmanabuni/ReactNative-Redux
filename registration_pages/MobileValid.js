import React, { Component } from 'react';
import {
  AppRegistry, StyleSheet, Alert,ScrollView, Image, Button, Text,
   TouchableHighlight, ActivityIndicator, TouchableWithoutFeedback, Keyboard, 
  TouchableOpacity, Linking, TextInput, View, KeyboardAvoidingView,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import { openDatabase } from 'react-native-sqlite-storage';
import { Fonts } from '../pages/src/utils/Fonts';
import { TextField } from 'react-native-material-textfield';
import VersionNumber from 'react-native-version-number';
import CountryPicker, {
  getAllCountries
} from 'react-native-country-picker-modal'


var db = openDatabase({ name: global.DB_NAME });
console.disableYellowBox = true;
export default class MobileValid extends Component {

  constructor(props) {
    super(props);

    state = {
      checked:true,
    }
    db.transaction(txMyMem => {
      txMyMem.executeSql('SELECT * FROM OTPVerification', [], (txMyMem, resultsMyMem) => {
        console.log('Results OTPVerification ', resultsMyMem.rows.length + ' ');

        if (resultsMyMem.rows.length > 0) {
          console.log('Results OTPVerification', ' ');
          global.MyMobileNumber = resultsMyMem.rows.item(0).MobileNumber;
          global.MyISDCode = resultsMyMem.rows.item(0).ISDCode;
          this.props.navigation.navigate('OTPVerificationScreen');
        } else {

        }

      });
    });

  }

  state = {
    Mobilenumber: '',
    OTPNumber: '',
    cca2: 'IN',
    callingCode: '91',
    isLoading: false,
    checked:true,
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

  mobilevalidate = (mobilenumber) => {
    const reg = /^[0]?[6789]\d{9}$/;
    const countryCode = '+' + this.state.callingCode;//this.phone.getValue();
    if (mobilenumber == 0) {
      alert('Mobile Number cannot be Empty');
    } else if (reg.test(mobilenumber) === false) {
      alert('Enter valid Mobile Number');
      return false;
    
    } else {
      anu = {
        "ACISDCode": countryCode,
        "ACMobile": mobilenumber
      }

      url = global.champBaseURL + 'Account/GetAccountDetailsByMobileNumber';
      //  http://122.166.168.160/champ/api/v1/Account/GetAccountDetailsByMobileNumber
      console.log('anu', url + ' ff' + countryCode + mobilenumber);
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
              global.MyMobileNumber = mobilenumber;
              global.MyISDCode = countryCode;
              this.props.navigation.navigate('RegistrationPageScreen');
              alert('You are not a Registered User');

            } else {
              console.log('Account Registered', responseJson.data);
             
              this.insert_Accounts(responseJson.data.accountByMobile[0].acAccntID, 
                responseJson.data.accountByMobile[0].acfName,
                 responseJson.data.accountByMobile[0].aclName,
                mobilenumber, countryCode);
              this.insert_OTP(mobilenumber, countryCode);

              // this.syncMyMembers(this.phone.getValue(), mobilenumber);//
              this.props.navigation.navigate('SplashScreen');
            }

          } else {
            console.log('responseJson Account else', responseJson.data);

            alert('You are not a Member of any Association');
            // this.props.navigation.navigate('CreateOrJoinScreen');
          }

        })
        .catch((error) => {
          console.log('MobileValid err GetAccountDetailsByMobileNumber ' + error);
          alert(' Failed to Get');
        });
     

    }
  }

  getOtp = (mobilenumber) => {
    const reg = /^[0]?[6789]\d{9}$/;
    const countryCode = '+' + this.state.callingCode;//this.phone.getValue();
    
    if ( mobilenumber == 0) {
      alert('Mobile Number cannot be Empty');
    } else if (!this.state.isChecked ) {
      alert('Please read and accept Terms and Conditions and Privacy Policy to proceed');
    } else if (reg.test(mobilenumber) === false) {
      alert('Enter valid Mobile Number');
      return false;
    } else if (mobilenumber =='9480107369' && countryCode=='+91') {
      this.mobilevalidate(this.state.Mobilenumber)
      return false;
    } else {
      anu = {
        "CountryCode": countryCode,
        "MobileNumber": mobilenumber
      }

      url = global.champBaseURL + 'account/sendotp';
      //  http://api.oyespace.com/champ/api/v1/account/sendotp
      console.log('anu', url + ' ff' + countryCode + mobilenumber);
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
            this.insert_OTP(mobilenumber, countryCode);
            global.MyMobileNumber = mobilenumber;
            global.MyISDCode = countryCode;
            this.props.navigation.navigate('OTPVerificationScreen');

          } else {
            console.log('responseJson Account else', responseJson.data);
            this.setState({
              isLoading: false
            })
            alert('OTP not Sent');
            // this.props.navigation.navigate('CreateOrJoinScreen');
          }
          console.log('suvarna', 'hi');
        })
        .catch((error) => {
          console.log(error);
          alert(' Failed to Get OTP');
          this.setState({
            isLoading: false
          })
        });

    }
  }


  render() {

    return (
      <View
      style={{ 
      flex: 1,
      flexDirection: 
      'column', 
      backgroundColor: 
      '#fff' 
      }}>
      
      <View
      
      style={{
      
      paddingTop: 
      2, paddingRight: 
      2, paddingLeft: 
      2, alignItems: 
      'center', flexDirection: 
      'row',
      
      paddingBottom: 
      2, borderColor: 
      'white', borderRadius: 
      0, borderWidth: 
      2, justifyContent: 
      'center',
      
      width:'100%',
      height: 35,marginTop:
      45,marginBottom:5
      
      }}
      
      >
      
      
      <Image
      source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
      style={{height: 40, width: 95, marginTop: 5,marginBottom:5,
      alignSelf: 'center',justifyContent:'center',alignItems:'center'
       }} />
      
      </View>
      <KeyboardAvoidingView behavior="padding">
      <View
      style={{
      
      backgroundColor: 
      'lightgrey',
      
      flexDirection: 
      "row",
      
      height:1,width:'100%'
      
      
      
      }}>

      </View> 
        <Image
          source={require('../pages/assets/images/building_complex.png')}
          style={{ width: '100%', height: '35%', alignSelf: 'center' }}
        />
        {this.state.isLoading ? <View style={{ height: '5%' }}>
          <ActivityIndicator />
        </View> : <Text style={{height: '5%'}}> </Text>}
        <Text style={styles.mobilenumberverification} >Mobile Number Verification</Text>
        <Text style={styles.pleaseenteryourmobilenumbe}>Please enter your Mobile Number to get OTP</Text>
       

       <View style={{flex:1, flexDirection:'row', width:'100%',justifyContent:'center',alignItems:'center'}}>
          <View style={{ flex: 0.10, flexDirection: 'row', alignItems: 'center', }}>
            <CountryPicker
              onChange={value => {
                this.setState({ cca2: value.cca2, callingCode: value.callingCode })
              }}
              cca2={this.state.cca2}
              translation="eng"
            ></CountryPicker>
          </View>

          <View style={{ flex: 0.12, flexDirection: 'row', marginLeft: 2, alignItems: 'center' }}>
            <Text style={{ color: 'black', fontSize: 12 }}>+{this.state.callingCode}</Text>
          </View>


          <View style={{ flex: 0.60, marginTop: 20 }}>
            <TextField
              label='Mobile Number'
              fontSize={12}
              labelHeight={10}
              characterRestriction={10}
              activeLineWidth={0.5}
              keyboardType='numeric'
              returnKeyType='done'
              maxLength={10}
              onChangeText={this.handleMobile}
            />

          </View>


       
          
        </View>
      
               {/* <TouchableOpacity
          style={styles.mybutton}
          onPress={this.mobilevalidate.bind(this, this.state.Mobilenumber)}>
          <Text style={styles.submitButtonText}>Get OTP for Verification</Text>
        </TouchableOpacity>   */}
        
        </KeyboardAvoidingView>
        <View style={{
          height: '8%', flexDirection: 'row',
        }}>
        <View style={{flex:0.1, paddingLeft:'5%'}}>
          <CheckBox
            style={{flex: 1}}
            onClick={()=>{
              this.setState({
                isChecked:!this.state.isChecked
              })
            }}
            isChecked={this.state.isChecked}
            checkedImage={<Image source={require('../pages/assets/images/checked.png')} style={{width:20,height:20}}/>}
            unCheckedImage={<Image source={require('../pages/assets/images/uncheck.png')} style={{width:20,height:20}}/>}
        />
        </View>
        <View style={{flex:0.9}}>
         <Text style={{color: '#020202', fontFamily: Fonts.Tahoma, fontSize: 12,}}
        >I have read and accepted the
  
          <Text style={{ fontSize: 10, color: 'orange' }}
           onPress={() => {
            //on clicking we are going to open the URL using Linking
            Linking.openURL('https://www.oyespace.com/PrivacyPolicy.html');
          }}> privacy policy</Text> and
          <Text style={{ fontSize: 10, color: 'orange' }}
           onPress={() => {
            //on clicking we are going to open the URL using Linking
            Linking.openURL('https://www.oyespace.com/TermsCond.html');
          }}> terms of use</Text>.
         </Text>
         </View>
         
         </View>
         <View style={{flex:1,}}>
         <TouchableOpacity
          style={styles.mybutton}
          onPress={this.getOtp.bind(this, this.state.Mobilenumber)}>
          <Text style={styles.submitButtonText}>Get OTP</Text>
        </TouchableOpacity>
         </View>
       
        <Text style={{ height: '6%', fontSize: 12, paddingRight: '5%', paddingBottom: '5%', alignSelf: 'flex-end',alignItems:'flex-end', justifyContent:'flex-end', textAlignVertical: 'center', color: 'black',marginRight:10 }}>
          Version:{VersionNumber.appVersion}
        </Text>
        
      </View>

    );
  }

  insert_Accounts(account_id, first_name, last_name, mobile_number, isd_code) {

    db.transaction(function (tx) {
      //Account( AccountID INTEGER,  FirstName VARCHAR(50) ,LastName VARCHAR(50), '
      //  + '  MobileNumber VARCHAR(20), Email VARCHAR(50),  '+ ' ISDCode VARCHAR(20))
      tx.executeSql(
        'INSERT INTO Account (AccountID, FirstName, LastName, MobileNumber, ISDCode  ' +
        '  ) VALUES (?,?,?,?,?)',
        [account_id, first_name, last_name, mobile_number, isd_code],
        (tx, results) => {
          console.log('INSERT Account ', results.rowsAffected + ' ' + account_id);

        }
      );
    });
  }

  insert_OTP(mobile_number, isd_code) {

    db.transaction(function (tx) {
      //ID INTEGER,  OTPVerified boolean ,'
      // + '  MobileNumber VARCHAR(20),   '+ ' ISDCode VARCHAR(20)
      tx.executeSql(
        'INSERT INTO OTPVerification ( MobileNumber, ISDCode  ' +
        '  ) VALUES (?,?)',
        [mobile_number, isd_code],
        (tx, results) => {
          console.log('INSERT OTPVerification ', results.rowsAffected + ' ' + mobile_number + ' ' + isd_code);

        }
      );
    });
  }

  syncMyMembers(cc, mobilenumber) {
    anu = {
      "ACMobile": cc + mobilenumber
    }
    url = global.champBaseURL + 'Member/GetMemberListByMobileNumber';
    console.log('anu', url + ' ff' + cc + mobilenumber);
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
        console.log('bf responseJson ', responseJson);

        if (responseJson.success) {
          console.log('ravii', responseJson);
          console.log('responseJson count', responseJson.data.memberList.length);
          for (let i = 0; i < responseJson.data.memberList.length; ++i) {

            console.log('Results MyMembership', responseJson.data.memberList[i].meMemID + ' ' + responseJson.data.memberList[i].asAssnID);
            // this.insert_MyMembership(responseJson.data.memberList[i].meMemID, responseJson.data.memberList[i].asAssnID,
            // responseJson.data.memberList[i].oyeUnitID, responseJson.data.memberList[i].firstName,
            // responseJson.data.memberList[i].lastName, responseJson.data.memberList[i].mobileNumber,
            // responseJson.data.memberList[i].email, responseJson.data.memberList[i].parentAccountID,
            // responseJson.data.memberList[i].mrmRoleID, responseJson.data.memberList[i].meIsActive,
            // responseJson.data.memberList[i].acAccntID, responseJson.data.memberList[i].vehicleNumber);

            this.insert_MyMembership_New(responseJson.data.memberList[i].meMemID, responseJson.data.memberList[i].asAssnID,
              responseJson.data.memberList[i].unUnitID, responseJson.data.memberList[i].acMobile,
              responseJson.data.memberList[i].mrmRoleID, responseJson.data.memberList[i].meIsActive,
              responseJson.data.memberList[i].acAccntID);

          }

          //  this.props.navigation.navigate('SplashScreen');
          this.syncAssns(responseJson.data.memberList[0].asAssnID);
        } else {
          alert('You are not a Member of any Association');
          this.props.navigation.navigate('CreateOrJoinScreen');
        }

        console.log('suvarna', 'hi');
      })
      .catch((error) => {
        console.log('MobileValid err syncMyMembers ' + error);
        alert(' Failed to Get');
      });
  }

  syncAssns(assnID) {
    console.log('bf assnID ', assnID);

    console.log('componentdidmount')
    const urlAsn = global.champBaseURL + 'association/getassociationlist'

    fetch(urlAsn, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          // dataSource: responseJson.data.associations, // dataSource: responseJson.data.associations.filter(x => x.associationID ==30) associationid  
        })

        console.log('anu', responseJson);
        if (responseJson.success) {
          console.log('responseJson count Association ', responseJson.data.associations.length);
          for (let i = 0; i < responseJson.data.associations.length; ++i) {

            //     temp.push(results.rows.item(i));
            //{ asiCrFreq: 0,   asAssnID: 6,  asPrpCode: '', asAddress: 'Electronic City', asCountry: 'India', asCity: 'Bangalore',
            // asState: 'karnataka',  asPinCode: '560101', asAsnLogo: '122.166.168.160/Images/Robo.jpeg', asAsnName: 'Prime Flora',
            // asPrpName: 'Electro',  asPrpType: '',  asRegrNum: '123456', asWebURL: 'www.careofhomes.com', asMgrName: 'Tapaswini',
            // asMgrMobile: '7008295630',  asMgrEmail: 'tapaswiniransingh7@gmail.com', asAsnEmail: 'tapaswini_ransingh@careofhomes.com',
            // aspanStat: 'True', aspanNum: '560066', aspanDoc: '', asNofBlks: 9, asNofUnit: 5, asgstNo: '', asTrnsCur: '', asRefCode: '',
            // asMtType: '',  asMtDimBs: 0, asMtFRate: 0,asUniMsmt: '', asbGnDate: '2018-11-04T00:00:00',aslpcType: '', aslpChrg: 8.9,
            // aslpsDate: '2018-11-04T00:00:00', asotpStat: 'ON', asopStat: 'ON', asonStat: 'ON', asomStat: 'ON', asoloStat: 'ON',
            // asgpsPnt: null,  asdPyDate: '0001-01-01T00:00:00', asdCreated: '2018-11-04T00:00:00', asdUpdated: '2018-11-04T00:00:00',
            //asIsActive: true, asbToggle: false,asavPymnt: false, asaInvc: false, asAlexaItg: false,  asaiPath: '', asOkGItg: false,
            //asokgiPath: '',  asSiriItg: false, assiPath: '', asCorItg: false, asciPath: '', bankDetails: [], unit: null },} ] },

            console.log('Results Association', responseJson.data.associations[i].asAssnID + ' ' + responseJson.data.associations[i].asAsnName + ' ' + responseJson.data.associations[i].aspanNum);

            //association_id, name, country, locality, pan_number, pin_code, gps_location, total_units, property_code, fy_start,
            //  maint_pymt_freq, otp_status, photo_status , name_status , mobile_status , logoff_status , validity

            this.insert_associations(responseJson.data.associations[i].asAssnID,
              responseJson.data.associations[i].asAsnName,
              responseJson.data.associations[i].asCountry, responseJson.data.associations[i].asCity,
              responseJson.data.associations[i].aspanNum, responseJson.data.associations[i].asPinCode,
              responseJson.data.associations[i].gpsLocation, responseJson.data.associations[i].asNofUnit,
              responseJson.data.associations[i].asPrpCode, responseJson.data.associations[i].asiCrFreq,
              responseJson.data.associations[i].asMtFRate, 'off', 'off', 'off', 'off', 'off');

          }
          console.log('success')
          this.syncUnits(assnID);

        } else {
          console.log('failurre')
        }

      })
      .catch((error) => {
        console.log(error)
      })
  }

  insert_associations(association_id, name, country, city, pan_number, pin_code, gps_location, total_units, property_code, fy_start,
    maint_pymt_freq, otp_status, photo_status, name_status, mobile_status, logoff_status) {

    db.transaction(function (tx) {
      // CREATE TABLE IF NOT EXISTS Association( AsiCrFreq INTEGER , AssnID INTEGER, PrpCode VARCHAR(40), Address TEXT ,'
      // + ' Country VARCHAR(40), City VARCHAR(40) , State VARCHAR(80), PinCode VARCHAR(40), AsnLogo VARCHAR(200),  '
      // + 'AsnName VARCHAR(200) , PrpName VARCHAR(200),'// MaintenanceRate double, MaintenancePenalty double,'
      // + ' PrpType VARCHAR(50) , RegrNum VARCHAR(50), WebURL VARCHAR(50), MgrName VARCHAR(50), MgrMobile VARCHAR(20), '
      // + ' MgrEmail VARCHAR(50) , AsnEmail VARCHAR(50), PanStat VARCHAR(50), PanNum VARCHAR(50), PanDoc VARCHAR(50), '
      // + ' NofBlks INTEGER , NofUnit INTEGER, GstNo VARCHAR(50), TrnsCur VARCHAR(50), RefCode VARCHAR(50), '
      // + ' MtType VARCHAR(50) , MtDimBs INTEGER, MtFRate INTEGER, UniMsmt VARCHAR(50), BGnDate VARCHAR(50), '
      // + ' LpcType VARCHAR(50) , LpChrg INTEGER, LpsDate VARCHAR(50), OtpStat VARCHAR(50), PhotoStat VARCHAR(50), '
      // + ' NameStat VARCHAR(50) , MobileStat VARCHAR(50), LogStat VARCHAR(50), GpsPnt VARCHAR(50), PyDate VARCHAR(50), '
      // + ' Created VARCHAR(50) , Updated VARCHAR(50), IsActive bool, bToggle VARCHAR(50), AutovPymnt bool, '
      // + ' AutoInvc bool , AlexaItg bool, aiPath VARCHAR(50), OkGItg bool, okgiPath VARCHAR(50), '
      // + ' SiriItg bool , siPath VARCHAR(50), CorItg bool, ciPath VARCHAR(50), unit VARCHAR(50) )

      tx.executeSql(
        'INSERT INTO Association (AssnID, AsnName, Country, City, PanNum, PinCode, GPSLocation, ' +
        ' NofUnit, PrpCode, AsiCrFreq, MtFRate, OtpStat, PhotoStat , NameStat , MobileStat ,' +
        '  LogStat ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [association_id, name, country, city, pan_number, pin_code, gps_location, total_units, property_code, fy_start,
          maint_pymt_freq, otp_status, photo_status, name_status, mobile_status, logoff_status],
        (tx, results) => {
          console.log('INSERT MV Association ', results.rowsAffected + ' ' + association_id);
        }
      );
    });
  }

  syncUnits(assnID) {
    console.log('bf syncUnits ', assnID);

    console.log('unitlist start ', assnID)
    console.log('componentdidmount')
    //const url = 'http://oye247api.oye247.com/oye247/api/v1/OYEUnit/OYEUnitlist/'+assnID
    const url = global.champBaseURL + 'Unit/GetUnitListByAssocID/' + assnID
    console.log(url)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('unitlist in ', responseJson)

        if (responseJson.success) {
          console.log('ravii', responseJson);
          console.log('responseJson count unit ', responseJson.data.unit.length);
          for (let i = 0; i < responseJson.data.unit.length; ++i) {
            //     temp.push(results.rows.item(i));

            console.log('Results unit', responseJson.data.unit[i].unUniName + ' ' + responseJson.data.unit[i].unUnitID);

            this.insert_units(responseJson.data.unit[i].unUnitID,
              responseJson.data.unit[i].asAssnID,
              responseJson.data.unit[i].unUniName, responseJson.data.unit[i].unUniType,
              responseJson.data.unit[i].flFloorID, responseJson.data.unit[i].unIsActive,
              responseJson.data.unit[i].parkingLotNumber);

          }

          this.syncUnitOwners(assnID);
        } else {
          console.log('failurre')
        }
      })
      .catch((error) => {

        console.log(error)
        console.log('unitlist err ', error)

      })
  }

  insert_units(unit_id, association_id, UnitName, type, admin_account_id, created_date_time, parking_slot_number
  ) {
    db.transaction(function (tx) {
      //// OyeUnit(UnitID integer , " +
      //" AssociationID integer , UnitName VARCHAR(20) ,  Type VARCHAR(20) , AdminAccountID integer , " +
      //" CreatedDateTime VARCHAR(20),  ParkingSlotNumber VARCHAR(20) )
      tx.executeSql(
        'INSERT INTO OyeUnit (UnitID, AssociationID, UnitName, Type, AdminAccountID, CreatedDateTime,  ' +
        '  ParkingSlotNumber ) VALUES (?,?,?,?,?,?,?)',
        [unit_id, association_id, UnitName, type, admin_account_id, created_date_time, parking_slot_number],
        (tx, results) => {
          console.log('INSERT oyeUnits ', results.rowsAffected + ' ' + association_id);

        }
      );
    });
  }

  syncUnitOwners(assnID) {
    console.log('bf syncUnitOwners ', assnID);

    const url = global.champBaseURL + 'Member/GetMemUniOwnerTenantListByAssoc/' + assnID
    //http://122.166.168.160/champ/api/v1/Member/GetMemUniOwnerTenantListByAssoc/30
    console.log(url)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('syncUnitOwners in ', responseJson);

        if (responseJson.success) {
          console.log('ravii', responseJson);
          console.log('responseJson count syncUnitOwners ', responseJson.data.unitOwner.length);
          for (let i = 0; i < responseJson.data.unitOwner.length; ++i) {
            //     temp.push(results.rows.item(i));

            console.log('Results unit', responseJson.data.unitOwner[i].unUniName + ' ' + responseJson.data.unitOwner[i].unUnitID);

            //  "uoid": 20, "uofName": "Basava",  "uolName": "K", "uoMobile": "+919480107369", "uoMobile1": "",
            //  "uoMobile2": "", "uoMobile3": "",  "uoMobile4": "", "uoEmail": "",  "uoEmail1": "",
            //  "uoEmail2": "", "uoEmail3": "", "uoEmail4": "",  "uocdAmnt": 12.36,  "uoisdCode": null,
            // "unUnitID": 46,  "asAssnID": 30,  "uodCreated": "2018-11-20T09:55:20",
            //  "uodUpdated": "0001-01-01T00:00:00",  "uoIsActive": true

            this.insert_unitOwners(responseJson.data.unitOwner[i].uoid,
              responseJson.data.unitOwner[i].unUnitID, responseJson.data.unitOwner[i].asAssnID,
              responseJson.data.unitOwner[i].uofName, responseJson.data.unitOwner[i].uolName,
              responseJson.data.unitOwner[i].uoMobile, responseJson.data.unitOwner[i].uoEmail,
              responseJson.data.unitOwner[i].uocdAmnt, responseJson.data.unitOwner[i].uodCreated,
              responseJson.data.unitOwner[i].uodUpdated, responseJson.data.unitOwner[i].uoIsActive);
          }
          console.log('success')
          // alert('unitlist unitlist success');
          this.props.navigation.navigate('SplashScreen');
        } else {
          console.log('failurre')
        }
      })
      .catch((error) => {

        console.log('unitlist err ', error)

      })
  }

  insert_unitOwners(owner_id, unit_id, association_id, owner_first_name, owner_last_name, owner_mobile,
    owner_email, owner_due_amnt, owner_created, owner_updated, owne_is_active
  ) {
    db.transaction(function (tx) {
      ////  'CREATE TABLE IF NOT EXISTS UnitOwner( OwnerId INTEGER,  OwnerFirstName VARCHAR(50) ,'
      //  + ' OwnerLastName VARCHAR(50), OwnerMobile VARCHAR(50), OwnerEmail VARCHAR(50), OwnerDueAmnt double, '
      //  + ' OwnerUnitID INTEGER, OwnerAssnID INTEGER , OwnerCreated VARCHAR(50), OwnerUpdated VARCHAR(50), OwnerIsActive boolean)',


      tx.executeSql(
        'INSERT INTO UnitOwner (OwnerId, OwnerUnitID, OwnerAssnID, OwnerFirstName, OwnerLastName, OwnerMobile,  ' +
        ' OwnerEmail,  OwnerDueAmnt, OwnerCreated ,OwnerUpdated,OwnerIsActive) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [owner_id, unit_id, association_id, owner_first_name, owner_last_name, owner_mobile,
          owner_email, owner_due_amnt, owner_created, owner_updated, owne_is_active],
        (tx, results) => {
          console.log('INSERT UnitOwner ', results.rowsAffected + ' ' + owner_id);

        }
      );
    });
  }

  insert_MyMembership(oye_memberid, association_id, oye_unitid, first_name, last_name, mobile_number, email, parent_accountid,
    oye_memberroleid, status, account_id, vehicle_number) {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO MyMembership (OYEMemberID, AssociationID, OYEUnitID, FirstName, LastName, MobileNumber, Email, ' +
        ' ParentAccountID, OYEMemberRoleID, Status, AccountID, VehicleNumber ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        [oye_memberid, association_id, oye_unitid, first_name, last_name, mobile_number, email, parent_accountid,
          oye_memberroleid, status, account_id, vehicle_number],
        (tx, results) => {
          console.log('Results', results.rowsAffected);

        }
      );
    });
  }

  insert_MyMembership_New(oye_memberid, association_id, oye_unitid, mobile_number,
    oye_memberroleid, status, account_id) {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO MyMembership (OYEMemberID, AssociationID, OYEUnitID, MobileNumber, ' +
        '  OYEMemberRoleID, Status, AccountID ) VALUES (?,?,?,?,?,?,?)',
        [oye_memberid, association_id, oye_unitid, mobile_number,
          oye_memberroleid, status, account_id],
        (tx, results) => {
          console.log('INSERT MyMembership', results.rowsAffected);
        }
      );
    });
  }

}

const DismissKeyboardHOC = (Comp) => {
  return ({ children, ...props }) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Comp {...props}>
        {children}
      </Comp>
    </TouchableWithoutFeedback>
  );
};
const DismissKeyboardView = DismissKeyboardHOC(View)

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
    margin:'1%',
    textAlign:'center'
  },
  container: {
    flex: 1,
    paddingTop: 100
  },
  imagee: { height: 14, width: 14, margin: 10, },
  text: { fontSize: 10, fontFamily: Fonts.OpenSansRegular, color: 'black', },

  mobilenumberverification: {
    height: '6%', width: '100%', marginTop: '1%', color: '#060606', textAlign: 'center',
    fontFamily: Fonts.Tahoma, fontSize: 19, //lineheight: '17px',
  },

  pleaseenteryourmobilenumbe: {
    height: '6%', width: '100%', color: '#060606', textAlign: 'center',
    alignSelf: 'center', fontFamily: Fonts.Tahoma, fontSize: 15, //lineheight: '13px',
  },
  mybutton: {
    alignSelf:'center',
  marginTop:5,width:'50%',
   paddingTop:2,
   paddingBottom:2,
   backgroundColor:'white',
   borderRadius:5,
   borderWidth: 1,
   borderColor: 'orange'
    // backgroundColor: 'orange', width: '50%', paddingTop: 8, marginRight: '25%', marginLeft: '25%',
    // paddingBottom: 8, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center', color: 'white',
    // justifyContent: 'center'
  },

  ihavereadandacceptthepri: {
    height: '8%', width: '100%',   //lineheight: '8px',
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
