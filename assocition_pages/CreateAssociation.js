
import React, { Component } from 'react';
import { BackHandler,Image ,
  Platform, StyleSheet, Button, Picker, Text, Alert, alertMessage,
  ScrollView, TextInput, TouchableOpacity, View
} from 'react-native';
//import PhoneInput from "react-native-phone-input";
import { Fonts } from '../pages/src/utils/Fonts';
//import { View } from 'native-base';
import { openDatabase } from 'react-native-sqlite-storage';
import { TextField } from 'react-native-material-textfield';
import { Dropdown } from 'react-native-material-dropdown';
import CountryPicker, {
  getAllCountries
} from 'react-native-country-picker-modal';
import firebase from 'react-native-firebase';

var db = openDatabase({ name: global.DB_NAME});

export default class CreateAssociation extends Component {

  constructor(props) {
    super(props);
    const userCountryData = getAllCountries()
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      Assocation_name: '',
      Pan_Number: '',
      PinCode: '',
      Gps: '',
      No_Units: 0,
      Place: '',
      Unit_Name: 'Common',
      Mail: '',
      Manager_Name: 'xyz',
      Man_Mob_No: '',
      Referal_Code: '',
      Prop_Name: '',
      Prop_Type: '',
      PickerValueHolder: '',
      PickerValueHolder_acctype: '',
      total_Blocks: 0,
      Assn_Country:'India',
      Ass_State: '',
      Ass_City: '',
      Manager_Email: '',
      ass_Adress: '',
      Bank_Name: '',
      Account_Number: '',
      Account_type: '',
      IFSC_Code: '',
      Acc_Balence: '',
      panCount: 0,
      cca2: 'IN',
        callingCode: '91',
    };

  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentDidMount(){
  const urlAsn = global.champBaseURL +'association/getassociationlist'

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
        isLoading: false
      })

      console.log('anu', responseJson);

      if (responseJson.success) {

        console.log('responseJson count Association ', responseJson.data.associations.length);
        db.transaction(tx => {
          tx.executeSql('delete  FROM Association ', [], (tx, results) => {
              console.log('CreateAssociation Results Association delete ', results.rowsAffected);
          });
      });
      
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
    console.log('bf INSERT Association ', association_id+ ' ' +name );
  db.transaction(function (tx) {
    // CREATE TABLE IF NOT EXISTS Association( AsiCrFreq INTEGER , AssnID INTEGER, PrpCode VARCHAR(40), Address TEXT ,'
    // + ' Country VARCHAR(40), City VARCHAR(40) , State VARCHAR(80), PinCode VARCHAR(40), AsnLogo VARCHAR(200),  '
    // + 'AsnName VARCHAR(200) , PrpName VARCHAR(200),'// MaintenanceRate double, MaintenancePenalty double,'
    // + ' PrpType VARCHAR(50) , RegrNum VARCHAR(50), WebURL VARCHAR(50), MgrName VARCHAR(50), MgrMobile VARCHAR(20)n, '
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

  handleBackButtonClick() {
    db.transaction(txMyMem => {
      txMyMem.executeSql('SELECT * FROM MyMembership', [], (txMyMem, resultsMyMem) => {
        console.log('CreateAssociation Results MyMembership ', resultsMyMem.rows.length + ' ');
        //  tx.executeSql('SELECT Distinct M.OYEUnitID, A.UnitName FROM MyMembership M inner Join OyeUnit A on
        // M.OYEUnitID=A.UnitID and M.AssociationID=' + global.SelectedAssociationID, [], (tx, results) => {
        //   UnitOwner (OwnerId, OwnerUnitID, OwnerAssnID, OwnerFirstName, OwnerLastName, OwnerMobile,  ' +
        //  ' OwnerEmail,  OwnerDueAmnt, OwnerCreated ,OwnerUpdated,OwnerIsActive

        if (resultsMyMem.rows.length > 0) {
          this.props.navigation.navigate('ResDashBoard');
        } else {
          this.props.navigation.navigate('SelectMyRoleScreen');
        }

      });
    });

    return true;
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  //   state = {
  //     Assocation_name: '',
  //     Pan_Number:'',
  //     PinCode:'',
  //     Gps:'',
  //     No_Units:'',
  //     Place:'',
  //     Unit_Name:'',
  //     Mail:'',
  //     Manager_Name:'',
  //     Man_Mob_No:'',
  //     Referal_Code:'',
  //     Prop_Name:'',
  //     Prop_Type:'',
  //     PickerValueHolder : ''
  // }


  Total_Blocks = (blocks) => {
    this.setState({ total_Blocks: blocks })
  }

  Assname = (assocation_name) => {

    this.setState({ Assocation_name: assocation_name })
  }

  PanNumber = (pan_num) => {
    this.setState({ Pan_Number: pan_num })
  }

  Pincode = (pin) => {
    this.setState({ PinCode: pin })
  }

  Location = (gps) => {
    this.setState({ Gps: gps })
  }

  Units = (no_units) => {
    this.setState({ No_Units: no_units })
  }

  Locality = (locality) => {
    this.setState({ Place: locality })
  }

  UnitName = (unit_name) => {
    this.setState({ Unit_Name: unit_name })
  }

  Email = (mail) => {
    this.setState({ Mail: mail })
  }

  Mangername = (manager_name) => {
    this.setState({ Manager_Name: manager_name })
  }

  ManMobNo = (man_mob_no) => {
    this.setState({ Man_Mob_No: man_mob_no })
  }

  ReferalCode = (referal_code) => {
    this.setState({ Referal_Code: referal_code })
  }

  PropName = (prop_name) => {
    this.setState({ Prop_Name: prop_name })
  }

  PropType = (prop_type) => {
    this.setState({ Prop_Type: prop_type })
  }

  as_State = (as_state) => {
    this.setState({ Ass_State: as_state })
  }

  ass_City = (as_city) => {
    this.setState({ Ass_City: as_city })
  }

  Man_Mail = (man_mail) => {
    this.setState({ Manager_Email: man_mail })
  }

  ass_add = (as_add) => {
    this.setState({ ass_Adress: as_add })
  }

  bank_Nmae = (name) => {
    this.setState({ Bank_Name: name })
  }

  acc_no = (Acc_no) => {
    this.setState({ Account_Number: Acc_no })
  }

  IFSC = (ifsc) => {
    this.setState({ IFSC_Code: ifsc })
  }

  bal = (Bal) => {
    this.setState({ Acc_Balence: Bal })
  }

  reset = () => {
    console.log('ho', 'hii');
    this.setState({ Manager_Name: '' })
  }

  resetAllFields = () => {
    this.textInput1.clear();
    this.textInput2.clear();
    this.textInput3.clear();
    this.textInput4.clear();
    this.textInput5.clear();
    this.textInput6.clear();
    this.textInput7.clear();
    this.textInput8.clear();
    this.textInput9.clear();
  }

  mobilevalidate = (assname, spinner, acc_type) => {
    assname = this.state.Assocation_name;
    mpannumber = this.state.Pan_Number;
    mPinCode = this.state.PinCode;
    mpropName = this.state.Prop_Name
    mnum_units = this.state.No_Units;
    mnum_block = this.state.total_Blocks;
    mPlace = this.state.Place;
    mUnitName = this.state.Unit_Name;
    mMail = this.state.Mail;
    mManager_Name = this.state.Manager_Name;
    mMobileNumber = this.state.Man_Mob_No;
    mReferalCode = this.state.Referal_Code;
    mCountry=this.state.Assn_Country;
    mstate = this.state.Ass_State;
    mCity = this.state.Ass_City;
    mAdress = this.state.ass_Adress
    mBank_name = this.state.Bank_Name;
    mAccount_Number = this.state.Account_Number;
    mIFSc = this.state.IFSC_Code;
    mbal = this.state.Acc_Balence;

    // mBank_name=this.state.Bank_Name;
    const reg = /^[0]?[789]\d{9}$/;
    let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    let regIFSC = /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/

    //console.log('gps',params.cat+','+params.cat1);
    // if(mpannumber.length>0 
    // ){
    db.transaction(tx => {
      tx.executeSql('SELECT  Distinct PanNum FROM Association where PanNum=?', [mpannumber], (tx, results) => {
        console.log('CreateAssociation Results', results.rows.length);
        this.setState({ panCount: results.rows.length, });
      });
    });

    // }
    // if(this.state.panCount!=0){
    //   ToastAndroid.show('PAN Number exist', ToastAndroid.SHORT);
    // }
   
    if (assname.length == 0) {
      alert("Association name Cannot be Empty");
    } else if (global.oyeNonSpecialRegex.test(assname) === true) {
      alert(" Association name should not contain Special Character");
      this.setState({
        mobilevalidate: false,
        telephone: assname,
      });
      return false;

    } else if (assname.length < 3) {
      alert("Association name should be more than 3 Characters");
    } else if (mpropName.length == 0) {
      alert("property name cannot be empty");
    } else if (global.oyeNonSpecialRegex.test(mpropName) === true) {
      alert(" Property name should not contain Special Character");
      this.setState({
        mobilevalidate: false,
        telephone: mpropName,
      });
      return false;
    } else if (spinner == 0) {
      alert("Select Property Type");
    } else if (mpannumber.length == 0) {
      alert("Pan Number Cannot be Empty");
    } else if (mpannumber.length < 10) {
      alert("Invalid Pan Number");
    } else if (regpan.test(mpannumber) == false) {
      alert("Enter valid PAN Number");
      this.setState({
        mobilevalidate: false,
        pan: mpannumber,
      });
      return false;
    } else if (this.state.panCount != 0) {
      alert(" Pan Number already Exist");
    } else if (mstate.length == 0) {
      alert("State cannot be Empty");
    } else if (global.oyeNonSpecialRegex.test(mstate) === true) {
      alert(" State should not contain Special Character");
      this.setState({
        mobilevalidate: false,
        telephone: mstate,
      });
      return false;
    } else if (mCity.length == 0) {
      alert("City cannot be Empty");
    } else if (global.oyeNonSpecialRegex.test(mCity) === true ) {
      alert(" City should not contain Special Character");
      this.setState({
        mobilevalidate: false,
        telephone: mCity,
      });

      return false;
    } 
    else if(global.OyeFullName.test(mCity) === false){
      alert(" City should only contains alpha characters.");
      this.setState({
        mobilevalidate: false,
        telephone: mCity,
      });

      return false;
    }
     else if (mAdress.length == 0) {
      alert("Address cannot be Empty");
    } else if (global.oyeNonSpecialRegex.test(mAdress) === true) {
      alert(" Adress should not contain Special Character");
      this.setState({
        mobilevalidate: false,
        telephone: mAdress,
      });

      return false;
    } else if (mPinCode.length == 0) {
      alert("Pin Code Cannot be Empty");
    } else if (mPinCode.length < 6) {
      alert("Invalid Pin Code");
    } else if (mPinCode == 0) {
      Alert.alert('Pin Code Cannot be zero');
    } else if (mnum_block.length == 0) {
      alert("Number of Blocks cannot be empty");
    } else if (mnum_block === '0') {
      Alert.alert(' Number Of Blocks cannot be zero');
    } else if (mnum_units.length == 0) {
      alert(" Number of Units cannot be Empty");
    } else if (mnum_units == 0) {
      Alert.alert(' Number Of Units cannot be zero');
    } else if (mnum_units === '0') {
      Alert.alert(' Number Of Units cannot be zero');
    }

    // else if(mPlace.length==0){
    // alert(" Number of Units cannot be Empty");
    // }
    // else if(mPlace.length<3){
    // ToastAndroid.show('Invalid Location', ToastAndroid.SHORT);
    // }
    // else if(mUnitName.length<3){
    // ToastAndroid.show('Invalid Unitname', ToastAndroid.SHORT);
    // }

    // else if (mManager_Name.length == 0) {
    //   alert(" Manager Name cannot be Empty");
    // } else if (global.oyeNonSpecialRegex.test(mManager_Name) === true) {
    //   alert(" Manager Name should not contain Special Character");
    //   this.setState({
    //     mobilevalidate: false,
    //     telephone: mManager_Name,
    //   });
    //   return false;
    // } else if (mMobileNumber.length < 10) {
    //   alert(" Invalid Manager Mobile Number");
    // } else if (reg.test(mMobileNumber) === false) {
    //   alert(" Invalid Mobile Number");
    //   this.setState({
    //     mobilevalidate: false,
    //     telephone: mMobileNumber,
    //   });

    //   return false;
    // } else if (regemail.test(mMail) == false) {
    //   alert(" Invalid Email Id");
    //   this.setState({
    //     mobilevalidate: false,
    //     telephone: mMail,
    //   });

    //   return false;

    // } else if (regemail.test(this.state.Manager_Email) == false) {
      // alert(" Invalid Email Id");
      // this.setState({
      //   mobilevalidate: false,
      //   telephone: this.state.Manager_Email,
      // });

      // return false;
    // } 
    else if (mUnitName.length == 0) {
      alert(" Unit Name cannot be Empty");
    } 
    // else if (global.oyeNonSpecialRegex.test(mUnitName) === true) {
    //   alert(" Manager Name should not contain Special Character");
    //   this.setState({
    //     mobilevalidate: false,
    //     telephone: mManager_Name,
    //   });
    //   return false;
   
    // } 
    // else if (global.oyeNonSpecialRegex.test(mBank_name) === true) {
    //   alert(" Manager Name should not contain Special Character");
    //   this.setState({
    //     mobilevalidate: false,
    //     telephone: mBank_name,
    //   });
    //   return false;
    /*  } else if (mBank_name.length == 0) {
      alert(" Bank Name cannot be Empty");
    } else if (mAccount_Number.length <= 10) {
      alert(" Enter Valid Account Number");
    } else if (mIFSc.length == 0) {
      alert(" IFSC code Cannot be Empty");
    } else if (regIFSC.test(this.state.IFSC_Code) == false) {
      alert(" Invalid IFSC code");
      this.setState({
        mobilevalidate: false,
        telephone: this.state.IFSC_Code,
      });

      return false;

    } else if (acc_type == 0) {
      alert("Select Account Type");
    } else if (mbal.length == 0) {
      alert("Account Balence Cannot be Empty");
    } else if (mbal === '0') {
      Alert.alert(' Accopunt Balence cannot be zero'); */
    // } 
    else if (assname.length == 0) {
      alert("Association name Cannot be Empty");
    } else if (assname.length < 3) {
      alert("Association name should be more than  3 Characters");
    } else if (mpropName.length == 0) {
      alert("property name cannot be empty");
    } else if (spinner == 0) {
      alert("Select  Property Type");
    } else if (mpannumber.length == 0) {
      alert("Pan Number Cannot be Empty");
    } else if (mpannumber.length < 10) {
      alert("Invalid Pan Number");
    } else if (regpan.test(mpannumber) == false) {

      alert("Enter valid PAN Number");
      this.setState({
        mobilevalidate: false,
        pan: mpannumber,
      });

      return false;
    } else if (this.state.panCount != 0) {
      alert(" Pan Number already Exist");
    } else if (mstate.length == 0) {
      alert("State cannot be Empty");
    } else if (mCity.length == 0) {
      alert("City cannot be Empty");
    } else if (mAdress.length == 0) {
      alert("Address  cannot be Empty");
    } else if (mPinCode.length == 0) {
      alert("Pin Code Cannot be Empty");
    } else if (mPinCode.length < 6) {
      alert("Invalid Pin Code");
    } else if (mnum_block.length == 0) {
      alert("Number of Blocks cannot be empty");
    } else if (mnum_block === '0') {
      Alert.alert(' Number Of Blocks cannot be zero');
    } else if (mnum_units.length == 0) {
      alert(" Number of Units cannot be Empty");
    } else if (mnum_units === '0') {
      Alert.alert(' Number Of Units cannot be zero');
    } else if (mnum_units === 0) {
      Alert.alert(' Number Of Units cannot be zero');
    }

    // else if(mPlace.length==0){
    //   alert(" Number of Units cannot be Empty");
    // }
    // else if(mPlace.length<3){
    //   ToastAndroid.show('Invalid Location', ToastAndroid.SHORT);
    // }
    // else if(mUnitName.length<3){
    //   ToastAndroid.show('Invalid Unitname', ToastAndroid.SHORT);
    // }
    // else if (mManager_Name.length == 0) {
    //   alert("Manager  Name cannot be Empty");
    // } else if (mMobileNumber.length < 10) {
    //   alert("Invalid  Manager Mobile Number");
    // } 
    // else if (reg.test(mMobileNumber) === false) {
    //   alert("Invalid Mobile Number");
    //   this.setState({
    //     mobilevalidate: false,
    //     telephone: mMobileNumber,
    //   });
    //   return false;
    // } 
    // else if (regemail.test(mMail) == false) {
    //   alert("Invalid Email Id");
    //   this.setState({
    //     mobilevalidate: false,
    //     telephone: mMail,
    //   });

    //   return false;
    // } 
    // else if (regemail.test(this.state.Manager_Email) == false) {
    //   alert("Invalid Email Id");
    //   this.setState({
    //     mobilevalidate: false,
    //     telephone: this.state.Manager_Email,
    //   });
    //   return false;
    // }
     else if (mUnitName.length == 0) {
      alert(" Unit Name cannot be Empty");
   /*  } else if (mBank_name.length == 0) {
      alert(" Bank Name cannot be Empty");
    } else if (mAccount_Number.length <= 10) {
      alert(" Enter Valid Account Number");
    } else if (mIFSc.length == 0) {
      alert(" IFSC code Cannot be Empty");
    } else if (regIFSC.test(this.state.IFSC_Code) == false) {
      alert(" Invalid IFSC code" + this.state.IFSC_Code);
      this.setState({
        mobilevalidate: false,
        telephone: this.state.IFSC_Code,
      });
      return false;
    } else if (acc_type == 0) {
      alert("Select  Account Type");
    } else if (mbal.length == 0) {
      alert("Account Balence Cannot be Empty");
    } else if (mbal === '0') {
      Alert.alert(' Accopunt Balence cannot be zero'); */
    } else {
      responseObj = {



        "ACAccntID" : global.MyAccountID,
        "association" :{
                "ASAddress" : mAdress,
                "ASCountry" : "India",
                "ASCity"    : mCity,
                "ASState"   : mstate,
                "ASPinCode" : mPinCode,
                "ASAsnLogo" : "Images/Robo.jpeg",
                "ASAsnName" : assname,
                "ASPrpName" : mpropName,
                "ASPrpType" : spinner,
                "ASRegrNum" : "",
                "ASWebURL"  : "www.spectra.com",
                "ASPANStat" : "False",
                "ASPANNum"  : mpannumber,
                "ASPANDoc"  : "",
                "ASNofBlks" : mnum_block,
                "ASNofUnit" : mnum_units,
                "ASGSTNo"   : "",
                "ASTrnsCur" : "Rupees",
                "ASRefCode" : "",
                "ASOTPStat" : "ON",
                "ASOPStat"  : "ON",
                "ASONStat"  : "ON",
                "ASOMStat"  : "ON",
                "ASOLOStat" : "ON",
                "ASGPSPnt"  : "",
                "ASFaceDet" : "", "ASAsnEmail" :"",
                "Amenities":
                [{
                    "AMType"            : "ClubHouse",
                    "NoofAmenities"    : 2
                  }]

        // "ACAccntID" : global.MyAccountID,
        // "association" :{
        // "asAssnID": global.assnID,
        //     "asPrpCode": null,
        //     "asAddress": mAdress,
        //     "asCountry": "India",
        //     "asCity": mCity,
        //     "asState": mstate,
        //     "asPinCode": mPinCode,
        //     "asAsnLogo": "Images/Robo.jpeg",
        //     "asAsnName": assname,
        //     "asPrpName": mpropName,
        //     "asPrpType": spinner,
        //     "asRegrNum": "",
        //     "asWebURL": "",
        //     "asAsnEmail": null,
        //     "aspanStat": "True",
        //     "aspanNum": mpannumber,
        //     "aspanDoc": "",
        //     "asNofBlks": mnum_block,
        //     "asNofUnit": mnum_units,
        //     "asgstNo": "",
        //     "asTrnsCur": "Rupees",
        //     "asRefCode": "",
        //     "asotpStat": "ON",
        //     "asopStat": "ON",
        //     "asonStat": "ON",
        //     "asomStat": "OM",
        //     "asoloStat": "ON",
        //     "asgpsPnt": "",
        //     "asdCreated": "0001-01-01T00:00:00",
        //     "asdUpdated": "0001-01-01T00:00:00",
        //     "asIsActive": false,
        //     "acAccntID": 0,
        //     "asFaceDet": "False",
        //     "amenities": null,

        }

          // "ACAccntID" : global.MyAccountID,
          // "association" :{
          // "ASAddress" : mAdress,
          // "ASCountry" : "India",
          // "ASCity"    : mCity,
          // "ASState"   : mstate,
          // "ASPinCode" : mPinCode,
          // "ASAsnLogo" : "Images/Robo.jpeg",
          // "ASAsnName" : assname,
          // "ASPrpName" : mpropName,
          // "ASPrpType" : spinner,
          // "ASRegrNum" : "",
          // "ASWebURL"  : "",
          // "ASPANStat" : "True",
          // "ASPANNum"  : mpannumber,
          // "ASPANDoc"  : "",
          // "ASNofBlks" : mnum_block,
          // "ASNofUnit" : mnum_units,
          // "ASGSTNo"   : "",
          // "ASTrnsCur" : "Rupees",
          // "ASRefCode" : "",
          // "ASOTPStat" : "ON",
          // "ASOPStat"  : "ON",
          // "ASONStat"  : "ON",
          // "ASOMStat"  : "ON",
          // "ASOLOStat" : "ON",
          // "ASGPSPnt"  : "",
          // "ASFaceDet" : "",
          // "Amenities":
          // [{
          // "AMType"     : "ClubHouse",
          // "NoofAmenities"            : 2
          // }]

          
          // "ASAddress": mAdress,
          // "ASCountry": "India",
          // "ASBToggle": "True",
          // "ASAVPymnt": "False",
          // "ASCity": mCity,
          // "ASState": mstate,
          // "ASPinCode": mPinCode,
          // "ASAsnLogo": "Images/Robo.jpeg",
          // "ASAsnName": assname,
          // "ASPrpName": mpropName,
          // "ASPrpType": spinner,
          // "ASRegrNum": "",
          // "ASWebURL": "",
          // "ASMgrName": mManager_Name,
          // "ASMgrMobile": mMobileNumber,
          // "ASMgrEmail": this.state.Manager_Email,
          // "ASAsnEmail": mMail,
          // "ASPANStat": "True",
          // "ASPANNum": mpannumber,
          // "ASNofBlks": mnum_block,
          // "ASNofUnit": mnum_units,
          // "ASONStat": "True",
          // "ASOMStat": "False",
          // "BankDetails":
          //   [
          //     {
          //       "BABName": mBank_name,
          //       "BAActType": acc_type,
          //       "BAActNo": mAccount_Number,
          //       "BAIFSC": mIFSc,
          //       "BAActBal": mbal
          //     }
          //   ]
        // }
      }

      console.log('CreateAssociation request', responseObj);
      fetch(global.champBaseURL +'association/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
          },
          body: JSON.stringify(responseObj)
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('CreateAssociation responseJson', responseJson);
          
          if (responseJson.success) {
            console.log(responseJson.data.association.asAssnID + 'admin')
            firebase.messaging().subscribeToTopic(responseJson.data.association.asAssnID + 'admin');
            // Alert.alert(' Created Succesfully');
            this.props.navigation.navigate('ResDashBoard');
            this.createSelfUnit(responseJson.data.association.asAssnID, this.state.Unit_Name);
          } else {
            console.log('ravii else', responseJson);
            Alert.alert(' Create Association Failed');
            // console.log('hiii',failed);
          }
        })
        .catch((error) => {
          console.log('CreateAssociation error ', error);
          Alert.alert(' Caught Error while getting Response');
        });
    }
  }

  datavalidate = (assname) => {

    const { params } = this.props.navigation.state;
    mpannumber = this.state.Pan_Number;
    mPinCode = this.state.PinCode;
    //mGps=params.cat+','+params.cat1
    mnum_units = this.state.No_Units;
    mUnitName = this.state.Unit_Name;
    mMail = this.state.Mail;
    mManager_Name = this.state.Manager_Name;
    if (assname.length == 0 && mpannumber.length == 0 && mnum_units.length == 0
      && mUnitName.length == 0 && mManager_Name.length == 0) {
      this.props.navigation.navigate('ResDashBoard');
    } else {
      Alert.alert(
        'Do you want to Exit?',
        alertMessage,
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
          { text: 'OK', onPress: () => { this.handleBackButtonClick() } },
        ]
      )
    }
  }

  //Cancle function
  AddMember = (firstname, lastname, mobilenumber, relation) => {
    var result = this.Validate(firstname, lastname, mobilenumber, relation)
    if (result === true) {

    } else {

    }
  }

  Validate(firstname, lastname, mobilenumber, relation) {

    if (firstname == '') {

      return false
    } else if (lastname == '') {
      Alert.alert(
        'Enter Last Name',
        alertMessage,
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
          { text: 'OK', onPress: () => console.log('Ok Pressed!') },
        ]
      )
      return false
    }

  }
  createSelfUnit(assnID, unit_name) {
    anu = {
      "ASAssnID": assnID,
      "AcAccntID":global.MyAccountID,
      "units": [
        {
          "UNUniName": unit_name,
          "UNUniType": "",//nunitType,
          "UNOpenBal": "",//opn_due_bal,
          "UNCurrBal": "",
          "UNOcStat": "",//mocc_sts,
          "UNOcSDate": "2018-12-25",
          "UNOwnStat": "",//mown_sts,
          "UNSldDate": "2018-12-02",
          "UNDimens": "",//dimens,
          "UNCalType": "",//rateType,
          "FLFloorID": 1,
          "BLBlockID": 1,
          "Owner": {
            "UOFName": global.MyFirstName,
            "UOLName": global.MyLastName,
            "UOMobile": global.MyMobileNumber,
            "UOISDCode": global.MyISDCode,
            "UOMobile1": "",
            "UOMobile2": "",
            "UOMobile3": "",
            "UOMobile4": "",
            "UOEmail": global.MyEmail,
            "UOEmail1": "",
            "UOEmail2": "",
            "UOEmail3": "",
            "UOEmail4": "",
            "UOCDAmnt": "",
            "ASAssnID": assnID
          },
          "Tenant":
          {
            "UTName": "",
            "UTFName": "",
            "UTLName": "",
            "UTMobile": "",
            "UTMobile1": "",
            "UTEmail": "",
            "UTEmail1": ""
          },
          "UnitParkingLot":
            [
              {
                "UPLNum": unit_name,
                "MEMemID": global.MyOYEMemberID==undefined?0:global.MyOYEMemberID,//2,
                "UPGPSPnt": ""
              }
            ]
        }
      ]
    }
    console.log('unit req', anu);
    fetch(global.champBaseURL +'unit/create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
        },
        body: JSON.stringify(anu
        )
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('CreateAssociation unit resp', responseJson);
        if (responseJson.success) {
          Alert.alert('Association created successfully ');
          this.props.navigation.navigate('SelectMyRoleScreen');
        } else {
          console.log('hiii', 'failed');
          Alert.alert(' Association created ');
         this.props.navigation.navigate('SelectMyRoleScreen');
        }
      })
      .catch((error) => {
        console.error('CreateAssociation err '+error);
        Alert.alert('caught error in member creating');
      });
  }

  render() {
    let statelist=

    [{ value: 
    'Andhra Pradesh' },
    
    {value: 'Arunachal Pradesh', },
    
    { value: 
    'Assam', }, 
    
    { value: 
    'Bihar' ,},
    
    { value: 
    'Chhattisgarh', },{ value: 
      'Delhi', },
    
    {value: 'Goa', },
    
    { value: 
    'Gujarat', }, 
    
    { value: 
    'Haryana', }, 
    
    { value: 
    'Himachal Pradesh', }, 
    
    { value: 
    'Jammu & Kashmir', }, 
    
    { value: 
    'Jharkhand', }, 
    
    { value: 
    'Karnataka', },
    
    { value: 
    'Kerala', },
    
    { value: 
    'Madhya Pradesh', }, 
    
    {value: 'Maharashtra', },
    
    { value: 
    'Manipur', }, 
    
    { value: 
    'Meghalaya', },
    
    { value: 
    'Mizoram', },
    
    { value: 
    'Nagaland', }, 
    
    { value: 
    'Odisha', }, 
    
    { value: 
    'Punjab', }, 
    
    { value: 
    'Rajasthan', }, 
    
    { value: 
    'Sikkim', }, 
    
    { value: 
    'Tamil Nadu', },
    
    { value: 
    'Telangana', }, 
    
    { value: 
    'Tripura', }, 
    
    {value: 'Uttarakhand', },
    
    { value: 
    'Uttar Pradesh', },
    
    { value: 
    'West Bengal', }
    
    ];
   const { navigate } = this.props.navigation;
  //  const { params } = this.props.navigation.state;
    // console.log('SelectedAssociationID ', global.SelectedAssociationID);

    return (
<View><View style={{backgroundColor: 'white' }}>
<View
style={{
paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:45,
}}>
<TouchableOpacity onPress={() => navigate(('AdminFunction'), { cat: '' })}
style={{ flex: 1 , alignSelf:'center'}}>
<Image source={require('../pages/assets/images/back.png')}
style={{ height: 25, width: 25,  }} />
</TouchableOpacity>
<Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
<View style={{ flex: 3, alignSelf: 'center' }}>
<Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
style={{
height: 38, width: 95, margin: 5,
alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
}} />
</View>
<View style={{ flex: 3,alignSelf: 'flex-end',alignItems:'flex-end',justifyContent:'flex-end' }}>
                         

                        </View>


</View>
                    <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
<Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',justifyContent:'center',alignContent:'center', }}>Create Association</Text>

          {/* <View
            style={{
              paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
              borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
              marginTop:20,
            }}>
            <TouchableOpacity onPress={() => this.handleBackButtonClick()}
              style={{ flex: 1 }}>
              <Image source={require('../pages/assets/images/back.png')}
                style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
            </TouchableOpacity>
            <Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
            <Text style={{ flex: 6, fontSize: 16, color: 'black',  alignSelf: 'center' }}>Create Association</Text>
            <View style={{ flex: 3, alignSelf: 'center' }}>
              <Image source={require('../pages/assets/images/OyeSpace_hor.png')}
                style={{
                  height: 35, width: 105, margin: 5,
                  alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
                }} />
            </View>
          </View>
          <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View> */}
        </View>
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.formtitle} >Association Details</Text>
          <View style={styles.formrectangle}>
           {/*  <Text style={styles.whatisthenameofyourassoc} >Association Name
    <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}> *</Text>
            </Text >
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="eg: Dream City Owners Association"
              //  autoCapitalize = "none"
              //  autoCapitalize = 'true'
              autofocus='true'
              maxLength={50}
              onChangeText={this.Assname} /> */}
               <TextField
                            label='Association Name (eg: Dream City Owners Association)'
                            autoCapitalize='sentences'
                            ref={input => { this.textInput1 = input }}
                            labelHeight={15}
                            maxLength={50}
                            characterRestriction={50}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.Assname}
                        />
           {/*  <Text style={styles.whatisthenameofyourassoc}>Property Name
      <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
            </Text>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="eg: Dream City"
              //  autoCapitalize = "none"
              autofocus='true'
              maxLength={50}
              onChangeText={this.PropName} /> */}
            {/*  <Text style={styles.whatisthenameofyourassoc}>Property Type</Text> */}
            <TextField
                            label='Property Name (eg: Dream City)'
                            autoCapitalize='sentences'
                            ref={input => { this.textInput2 = input }}
                            labelHeight={15}
                            maxLength={50}
                            characterRestriction={50}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.PropName}
                        />
            <Picker
              selectedValue={this.state.PickerValueHolder}
              style={{ marginLeft: 15, marginRight:15  }}
              onValueChange={(itemValue, itemIndex) => this.setState({ PickerValueHolder: itemValue })} >
              <Picker.Item label="Select Property Type" value='0' />
              <Picker.Item label="Residential" value="Residential" />
              <Picker.Item label="Commercial" value="Commercial" />
              <Picker.Item label="Residential/Commercial" value="Residential/Commercial" />
            </Picker>
           {/*  <Text style={styles.whatisthenameofyourassoc}>PAN Number of your Association (Do not use Personal PAN Number)
       <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
            </Text>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="eg: ABCDE1234RS"
              autoCapitalize='characters'
              maxLength={20}
              onChangeText={this.PanNumber} /> */}
               <TextField
                            label='PAN Number of your Association (Do not use Personal PAN Number) (eg: ABCDE1234S)'
                            autoCapitalize='characters'
                            ref={input => { this.textInput3 = input }}
                            labelHeight={15}
                            maxLength={10}
                            characterRestriction={10}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.PanNumber}
                        />
                        <View style={{ flexDirection: 'row', marginTop: 2,  }}>
            <Text style={styles.whatisthenameofyourassoc}>Country
       <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
            </Text>
            <CountryPicker
                                    onChange={value => {
                                        this.setState({ cca2: value.cca2, callingCode: value.callingCode ,country: value, Assn_Country:value.name})
                                    }}
                                    cca2={this.state.cca2}
                                    translation="eng"
                                />
                                 <View style={{  flexDirection: 'row', alignContent:'center',alignItems:'center',alignSelf:'center' }}>
                                <Text style={{ paddingLeft:20,alignSelf:'center',alignItems:'center', color: 'black',   fontSize: 15, }}>+{this.state.callingCode}  {this.state.Assn_Country} 
        </Text></View>
       {/*  {this.state.country && (
          <Text style={{color: 'black', fontSize: 12 }}>
            {JSON.stringify(this.state.country.name, null, 2)}
          </Text>)} */}
           {/*  <PhoneInput style={styles.text}
              style={{ flex: 2 }}
              ref={ref => { this.phone = ref; }}
            /> */}
             </View> 
            
            {/* <View style={{ flexDirection: 'row', marginTop: 2, flex: 2 }}>
              <Text style={styles.whatisthenameofyourassoc1}>State
       <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
              </Text>
              <TextInput style={styles.input1}
                underlineColorAndroid="transparent"
                autofocus='true'
                maxLength={50}
                onChangeText={this.as_State} />
            </View> */}
            <Dropdown

                  label='Select State'

                  data={statelist}

                  labelHeight={15}

                  fontSize={15}

                  onChangeText= 
                  {this.as_State}

                  />
      
          {/*   <Text style={styles.whatisthenameofyourassoc}>City
       <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
            </Text>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              //  placeholder = "eg: ABCDE1234RS"
              //  autoCapitalize = "none"
              maxLength={50}
              autofocus='true'
              onChangeText={this.ass_City} /> */}
               <TextField
                            label='City'
                            autoCapitalize='sentences'
                            labelHeight={15}
                            ref={input => { this.textInput4 = input }}
                            maxLength={50}
                            characterRestriction={50}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.ass_City}
                        />

          {/*   <Text style={styles.whatisthenameofyourassoc}>Association Address
       <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
            </Text>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              maxLength={200}
              // multiline=
              //  placeholder = "eg: ABCDE1234R"
              //  autoCapitalize = "none"
              autofocus='true'
              onChangeText={this.ass_add} /> */}
              
              <TextField
                            label='Association Address'
                            autoCapitalize='sentences'
                            labelHeight={15}
                            maxLength={50}
                            ref={input => { this.textInput5 = input }}
                            characterRestriction={50}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.ass_add}
                        />
           {/*  <View style={{ flexDirection: 'row', marginTop: 2, flex: 2 }}>
              <Text style={styles.whatisthenameofyourassoc1}>PinCode
        <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
              </Text>
              <View style={styles.input1}>
                <TextInput underlineColorAndroid="transparent"
                  keyboardType={'numeric'}
                  maxLength={6}
                  autoCapitalize="none"
                  onChangeText={this.Pincode} />
              </View>
             
            </View> */}
            <TextField
                            label='PinCode'
                            autoCapitalize='sentences'
                            labelHeight={15}
                            maxLength={6}
                            ref={input => { this.textInput6 = input }}
                            keyboardType={'numeric'}
                            returnKeyType='done'
                            characterRestriction={6}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.Pincode}
                        />
            
           {/*  <View style={{ flexDirection: 'row', marginTop: 2, flex: 3 }}>
              <Text style={styles.whatisthenameofyourassoc2}>Total Number of Blocks
      <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>
                  *</Text>
              </Text>
              <TextInput style={styles.input1}
                underlineColorAndroid="transparent"
                keyboardType={'numeric'}
                maxLength={2}
                autoCapitalize="none"
                onChangeText={this.Total_Blocks} />
            </View> */}
            <TextField
                            label='Total Number of Blocks'
                            autoCapitalize='sentences'
                            labelHeight={15}
                            maxLength={2}
                            ref={input => { this.textInput7 = input }}
                            keyboardType={'numeric'}
                            returnKeyType='done'
                             characterRestriction={2}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.Total_Blocks}
                        />
            {/* <View style={{ flexDirection: 'row', marginTop: 2, flex: 3 }}>
              <Text style={styles.whatisthenameofyourassoc2}>Total Number of Units
      <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>
                  *</Text>
              </Text>
              <TextInput style={styles.input1}
                underlineColorAndroid="transparent"
                keyboardType={'numeric'}
                maxLength={4}
                autoCapitalize="none"
                onChangeText={this.Units} />
            </View> */}
            <TextField
                            label='Total Number of Units'
                            autoCapitalize='sentences'
                            labelHeight={15}
                            maxLength={4}
                            ref={input => { this.textInput8 = input }}
                            keyboardType={'numeric'}
                            returnKeyType='done'
                            characterRestriction={4}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.Units}
                        />
            {/* <Text style={styles.whatisthenameofyourassoc}>Email ID of the Association
    <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
            </Text>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              maxLength={50}
              onChangeText={this.Email} /> */}
              <TextField
                            label='Email ID of the Association'
                            labelHeight={15}
                            maxLength={50}
                            ref={input => { this.textInput9 = input }}
                            characterRestriction={50}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.Email}
                        />
          </View>
          {/* <Text style={styles.formtitle} >Other Details</Text>
          <View style={styles.formrectangle}> */}
            {/* <Text style={styles.whatisthenameofyourassoc}>Your Unit Name in the Association
      <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
            </Text>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              //  autoCapitalize = "none"
              maxLength={50}
              autofocus='true'
              onChangeText={this.UnitName} /> */}
              {/* <TextField
                            label='Your Unit Name in the Association'
                            labelHeight={15}
                            maxLength={50}
                            characterRestriction={50}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.UnitName}
                        /> */}
            {/* <Text style={styles.whatisthenameofyourassoc}>Name of your Manager
    <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
            </Text>
            <TextInput style={styles.input} underlineColorAndroid="transparent"
              //  autoCapitalize = "none"
              autofocus='true'
              maxLength={50}
              onChangeText={this.Mangername} /> */}
  {/* <TextField
                            label='Name of your Manager'
                            labelHeight={15}
                            maxLength={50}
                            characterRestriction={50}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.Mangername}
                        /> */}
           {/*  <Text style={styles.whatisthenameofyourassoc}>Mobile Number of your Manager
  <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>

            </Text>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              keyboardType={'numeric'}
              maxLength={10}
              autoCapitalize="none"
              onChangeText={this.ManMobNo} /> */}
              {/* <TextField
                            label='Mobile Number of your Manager'
                            labelHeight={15}
                            maxLength={10}
                            keyboardType={'numeric'}
                            returnKeyType='done'
                            characterRestriction={10}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.ManMobNo}
                        /> */}
           {/*  <Text style={styles.whatisthenameofyourassoc}>EmailID of your Manager
  <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
            </Text>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              //  keyboardType={'numeric'}
              maxLength={50}
              autoCapitalize="none"
              onChangeText={this.Man_Mail} /> */}
               {/* <TextField
                            label='Email ID of your Manager'
                            labelHeight={15}
                            maxLength={50}
                            characterRestriction={50}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.Man_Mail}
                        />
          </View> */}
          {/* <Text style={styles.formtitle} >Bank Details</Text>
          <View style={styles.formrectangle}> */}
            {/* <Text style={styles.whatisthenameofyourassoc}> Bank Name
     
            </Text>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              //  autoCapitalize = "none"
              autofocus='true'
              maxLength={50}
              onChangeText={this.bank_Nmae} /> */}
               {/* <TextField
                            label='Bank Name'
                            labelHeight={15}
                            maxLength={50}
                            characterRestriction={50}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.bank_Nmae}
                        /> */}
          {/*   <Text style={styles.whatisthenameofyourassoc}>IFSC Code
   
            </Text>
            <TextInput style={styles.input} underlineColorAndroid="transparent"
              autoCapitalize='characters'
              autofocus='true'
              maxLength={20}
              onChangeText={this.IFSC} /> */}
               {/* <TextField
                            label='IFSC Code'
                            labelHeight={15}
                            maxLength={20}
                            characterRestriction={20}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.IFSC}
                        /> */}
           {/*  <Text style={styles.whatisthenameofyourassoc}>Account Number
  
            </Text>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              keyboardType={'numeric'}
              maxLength={20}
              autoCapitalize="none"
              onChangeText={this.acc_no} /> */}
                {/* <TextField
                            label='Account Number'
                            labelHeight={15}
                            maxLength={20}
                            characterRestriction={20}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.acc_no}
                        /> */}
            {/* <Text style={styles.whatisthenameofyourassoc}>Account Type
  
            </Text>
            <Picker selectedValue={this.state.PickerValueHolder_acctype}
              style={{ marginLeft: 15,marginRight:15 }}
              onValueChange={(itemValue, itemIndex) => this.setState({ PickerValueHolder_acctype: itemValue })} >
              <Picker.Item label="Select " value='0' />
              <Picker.Item label="Savings" value="Savings" />
              <Picker.Item label="Current" value="Current" />
            </Picker> */}
            {/* <Text style={styles.whatisthenameofyourassoc}>Account Balance
  
            </Text>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              keyboardType={'numeric'}
              autoCapitalize="none"
              maxLength={10}
              onChangeText={this.bal} /> */}
                 {/* <TextField
                            label='Account Balance'
                            labelHeight={15}
                            maxLength={10}
                            keyboardType={'numeric'}
                            returnKeyType='done'
                            characterRestriction={10}
                            activeLineWidth={0.5}
                            fontSize={15}
                            onChangeText={this.bal}
                        />
          </View> */}

          {/* <Text style = {styles.whatisthenameofyourassoc}>Do you have any referral code?
     <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>
       </Text>
       <TextInput style = {styles.input}
       underlineColorAndroid = "transparent"
       autoCapitalize = "none"
                     maxLength={50}
       onChangeText = {this.ReferalCode}/> */}

          <View style={{ flex: 1, flexDirection: 'row', marginBottom: 90 }}>
            <TouchableOpacity style={styles.rectangle}
              onPress={this.mobilevalidate.bind(this, this.state.Assocation_name, this.state.PickerValueHolder)}>
              <Text style={styles.submitButtonText}> OK </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rectangle}
              onPress={this.resetAllFields.bind()}>
              <Text style={styles.submitButtonText}> Reset </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </View>
    );

  }

}

const styles = StyleSheet.create({

  container: { paddingTop: 15,paddingBottom:10, backgroundColor: 'white',height:'90%' },

  input: {
    marginLeft: 20, marginRight: 15, marginTop: 5, marginBottom: 5,
    height: 40, borderColor: '#F2F2F2', backgroundColor: '#F2F2F2', borderWidth: 1.5, borderRadius: 2,
  },
  input1: {
    marginLeft: 20, marginRight: 15, marginTop: 5, marginBottom: 5, flex: 1,
    height: 40, borderColor: '#F2F2F2', backgroundColor: '#F2F2F2', borderWidth: 1.5, borderRadius: 2,
  },
  whatisthenameofyourassoc1: {
    marginLeft: 25, color: '#000', fontFamily: Fonts.Tahoma, fontSize: 13, flex: 1
  },
  whatisthenameofyourassoc2: {
    marginLeft: 25, color: '#000', fontFamily: Fonts.Tahoma, fontSize: 13, flex: 2
  },
  whatisthenameofyourassoc: {
    marginLeft: 10, marginRight: 10, color: '#000', fontFamily: Fonts.Tahoma, fontSize: 13,
  },
  submitButton: { backgroundColor: '#7a42f4', padding: 10, margin: 15, height: 40, },

  submitButtonText: { color: '#FA9917' },
  formtitle: { fontSize: 16,  color : 'black', marginBottom:8,marginLeft:8},
  formrectangle: { flex: 1, backgroundColor: 'white', borderColor: 'orange',
  marginLeft:8, marginRight:8,marginBottom:8, borderRadius: 0, borderWidth: 1.5, paddingLeft:10, paddingRight:10 },
  text: { fontSize: 13, color: 'black', justifyContent: 'center', marginLeft: 15 },
  rectangle: { flex: 1, backgroundColor: 'white', padding:10, borderColor: 'orange',
  marginLeft:5, marginRight:5, marginTop:5, borderRadius: 2, borderWidth: 1, },
})




// import React, { Component } from 'react';
// import { BackHandler,Image ,
//   Platform, StyleSheet, Button, Picker, Text, Alert, alertMessage,
//   ScrollView, TextInput, TouchableOpacity, View
// } from 'react-native';
// import PhoneInput from "react-native-phone-input";
// import { Fonts } from '../pages/src/utils/Fonts';
// //import { View } from 'native-base';
// import { openDatabase } from 'react-native-sqlite-storage';
// import { TextField } from 'react-native-material-textfield';
// import CountryPicker, {
//   getAllCountries
// } from 'react-native-country-picker-modal';
// import { Dropdown }
// from 'react-native-material-dropdown';
// var db = openDatabase({ name: global.DB_NAME});

// export default class CreateAssociation1 extends Component {

//   constructor(props) {
//     super(props);
//     const userCountryData = getAllCountries()
//     this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

//     this.state = {
//       Assocation_name: '',
//       Pan_Number: '',
//       PinCode: '',
//       Gps: '',
//       No_Units: 0,
//       Place: '',
//       Unit_Name: '',
//       Mail: '',
//       Manager_Name: '',
//       Man_Mob_No: '',
//       Referal_Code: '',
//       Prop_Name: '',
//       Prop_Type: '',
//       PickerValueHolder: '',
//       PickerValueHolder_acctype: '',
//       total_Blocks: 0,
//       Assn_Country:'India',
//       Ass_State: '',
//       Ass_City: '',
//       Manager_Email: '',
//       ass_Adress: '',
//       Bank_Name: '',
//       Account_Number: '',
//       Account_type: '',
//       IFSC_Code: '',
//       Acc_Balence: '',
//       panCount: 0,
//       cca2: 'IN',
//         callingCode: '91',
//     };

//   }

//   validateData(text,type){
//     alph=/^[a-zA-Z]+$/
//     specialcharacter=/^[^!-\/:-@\[-`{-~]+$/
//     if(type=='Ass_State')
//     {
//       if(alph.test(text))
//       {
//         this.as_State
//       }
//       else{
        
//         alert("Please enter valid data")
//       }
//     }
//     else if(type=='Ass_City')
//     {
//       if(alph.test(text))
//       {
//         this.ass_City
//       }
//       else{
        
//         alert("Please enter valid data")
//       }
//     }
//     else if(type=='IFSC_Code')
//     {
//       if(specialcharacter.test(text))
//       {
//         this.IFSC
//       }
//       else{
        
//         alert("Please enter valid data")
//       }
//     }

//     else if(type=='Manager_Name')
//     {
//       if(alph.test(text))
//       {
//         this.Mangername
//       }
//       else{
        
//         alert("Please enter valid data")
//       }
//     }
//   }
  

//   componentWillMount() {
//     BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
//   }

//   componentWillUnmount() {
//     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
//   }
//   componentDidMount(){
//   const urlAsn = global.champBaseURL +'association/getassociationlist'

//   fetch(urlAsn, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
//     },
//   })
//     .then((response) => response.json())
//     .then((responseJson) => {
//       this.setState({
//         // dataSource: responseJson.data.associations, // dataSource: responseJson.data.associations.filter(x => x.associationID ==30) associationid  
//         isLoading: false
//       })

//       console.log('anu', responseJson);

//       if (responseJson.success) {

//         console.log('responseJson count Association ', responseJson.data.associations.length);
//         db.transaction(tx => {
//           tx.executeSql('delete  FROM Association ', [], (tx, results) => {
//               console.log('CreateAssociation Results Association delete ', results.rowsAffected);
//           });
//       });
      
//         for (let i = 0; i < responseJson.data.associations.length; ++i) {

//           //     temp.push(results.rows.item(i));
//           //{ asiCrFreq: 0,   asAssnID: 6,  asPrpCode: '', asAddress: 'Electronic City', asCountry: 'India', asCity: 'Bangalore',
//           // asState: 'karnataka',  asPinCode: '560101', asAsnLogo: '122.166.168.160/Images/Robo.jpeg', asAsnName: 'Prime Flora',
//           // asPrpName: 'Electro',  asPrpType: '',  asRegrNum: '123456', asWebURL: 'www.careofhomes.com', asMgrName: 'Tapaswini',
//           // asMgrMobile: '7008295630',  asMgrEmail: 'tapaswiniransingh7@gmail.com', asAsnEmail: 'tapaswini_ransingh@careofhomes.com',
//           // aspanStat: 'True', aspanNum: '560066', aspanDoc: '', asNofBlks: 9, asNofUnit: 5, asgstNo: '', asTrnsCur: '', asRefCode: '',
//           // asMtType: '',  asMtDimBs: 0, asMtFRate: 0,asUniMsmt: '', asbGnDate: '2018-11-04T00:00:00',aslpcType: '', aslpChrg: 8.9,
//           // aslpsDate: '2018-11-04T00:00:00', asotpStat: 'ON', asopStat: 'ON', asonStat: 'ON', asomStat: 'ON', asoloStat: 'ON',
//           // asgpsPnt: null,  asdPyDate: '0001-01-01T00:00:00', asdCreated: '2018-11-04T00:00:00', asdUpdated: '2018-11-04T00:00:00',
//           //asIsActive: true, asbToggle: false,asavPymnt: false, asaInvc: false, asAlexaItg: false,  asaiPath: '', asOkGItg: false,
//           //asokgiPath: '',  asSiriItg: false, assiPath: '', asCorItg: false, asciPath: '', bankDetails: [], unit: null },} ] },

//           console.log('Results Association', responseJson.data.associations[i].asAssnID + ' ' + responseJson.data.associations[i].asAsnName + ' ' + responseJson.data.associations[i].aspanNum);

//           //association_id, name, country, locality, pan_number, pin_code, gps_location, total_units, property_code, fy_start,
//           //  maint_pymt_freq, otp_status, photo_status , name_status , mobile_status , logoff_status , validity

//           this.insert_associations(responseJson.data.associations[i].asAssnID,
//             responseJson.data.associations[i].asAsnName,
//             responseJson.data.associations[i].asCountry, responseJson.data.associations[i].asCity,
//             responseJson.data.associations[i].aspanNum, responseJson.data.associations[i].asPinCode,
//             responseJson.data.associations[i].gpsLocation, responseJson.data.associations[i].asNofUnit,
//             responseJson.data.associations[i].asPrpCode, responseJson.data.associations[i].asiCrFreq,
//             responseJson.data.associations[i].asMtFRate, 'off', 'off', 'off', 'off', 'off');

//         }
//         console.log('success')

//       } else {
//         console.log('failurre')
//       }

//     })
//     .catch((error) => {
//       console.log(error)
//     })
// }

// insert_associations(association_id, name, country, city, pan_number, pin_code, gps_location, total_units, property_code, fy_start,
//   maint_pymt_freq, otp_status, photo_status, name_status, mobile_status, logoff_status) {
//     console.log('bf INSERT Association ', association_id+ ' ' +name );
//   db.transaction(function (tx) {
//     // CREATE TABLE IF NOT EXISTS Association( AsiCrFreq INTEGER , AssnID INTEGER, PrpCode VARCHAR(40), Address TEXT ,'
//     // + ' Country VARCHAR(40), City VARCHAR(40) , State VARCHAR(80), PinCode VARCHAR(40), AsnLogo VARCHAR(200),  '
//     // + 'AsnName VARCHAR(200) , PrpName VARCHAR(200),'// MaintenanceRate double, MaintenancePenalty double,'
//     // + ' PrpType VARCHAR(50) , RegrNum VARCHAR(50), WebURL VARCHAR(50), MgrName VARCHAR(50), MgrMobile VARCHAR(20), '
//     // + ' MgrEmail VARCHAR(50) , AsnEmail VARCHAR(50), PanStat VARCHAR(50), PanNum VARCHAR(50), PanDoc VARCHAR(50), '
//     // + ' NofBlks INTEGER , NofUnit INTEGER, GstNo VARCHAR(50), TrnsCur VARCHAR(50), RefCode VARCHAR(50), '
//     // + ' MtType VARCHAR(50) , MtDimBs INTEGER, MtFRate INTEGER, UniMsmt VARCHAR(50), BGnDate VARCHAR(50), '
//     // + ' LpcType VARCHAR(50) , LpChrg INTEGER, LpsDate VARCHAR(50), OtpStat VARCHAR(50), PhotoStat VARCHAR(50), '
//     // + ' NameStat VARCHAR(50) , MobileStat VARCHAR(50), LogStat VARCHAR(50), GpsPnt VARCHAR(50), PyDate VARCHAR(50), '
//     // + ' Created VARCHAR(50) , Updated VARCHAR(50), IsActive bool, bToggle VARCHAR(50), AutovPymnt bool, '
//     // + ' AutoInvc bool , AlexaItg bool, aiPath VARCHAR(50), OkGItg bool, okgiPath VARCHAR(50), '
//     // + ' SiriItg bool , siPath VARCHAR(50), CorItg bool, ciPath VARCHAR(50), unit VARCHAR(50) )

//     tx.executeSql(
//       'INSERT INTO Association (AssnID, AsnName, Country, City, PanNum, PinCode, GPSLocation, ' +
//       ' NofUnit, PrpCode, AsiCrFreq, MtFRate, OtpStat, PhotoStat , NameStat , MobileStat ,' +
//       '  LogStat ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
//       [association_id, name, country, city, pan_number, pin_code, gps_location, total_units, property_code, fy_start,
//         maint_pymt_freq, otp_status, photo_status, name_status, mobile_status, logoff_status],
//       (tx, results) => {
//         console.log('INSERT MV Association ', results.rowsAffected + ' ' + association_id);
//       }
//     );
//   });
// }

//   handleBackButtonClick() {
//     db.transaction(txMyMem => {
//       txMyMem.executeSql('SELECT * FROM MyMembership', [], (txMyMem, resultsMyMem) => {
//         console.log('CreateAssociation Results MyMembership ', resultsMyMem.rows.length + ' ');
//         //  tx.executeSql('SELECT Distinct M.OYEUnitID, A.UnitName FROM MyMembership M inner Join OyeUnit A on
//         // M.OYEUnitID=A.UnitID and M.AssociationID=' + global.SelectedAssociationID, [], (tx, results) => {
//         //   UnitOwner (OwnerId, OwnerUnitID, OwnerAssnID, OwnerFirstName, OwnerLastName, OwnerMobile,  ' +
//         //  ' OwnerEmail,  OwnerDueAmnt, OwnerCreated ,OwnerUpdated,OwnerIsActive

//         if (resultsMyMem.rows.length > 0) {
//           this.props.navigation.navigate('ResDashBoard');
//         } else {
//           this.props.navigation.navigate('SelectMyRoleScreen');
//         }

//       });
//     });

//     return true;
//   }
//   handleChange(event) {
//     this.setState({ value: event.target.value });
//   }

//   //   state = {
//   //     Assocation_name: '',
//   //     Pan_Number:'',
//   //     PinCode:'',
//   //     Gps:'',
//   //     No_Units:'',
//   //     Place:'',
//   //     Unit_Name:'',
//   //     Mail:'',
//   //     Manager_Name:'',
//   //     Man_Mob_No:'',
//   //     Referal_Code:'',
//   //     Prop_Name:'',
//   //     Prop_Type:'',
//   //     PickerValueHolder : ''
//   // }


//   Total_Blocks = (blocks) => {
//     this.setState({ total_Blocks: blocks })
//   }

//   Assname = (assocation_name) => {

//     this.setState({ Assocation_name: assocation_name })
//   }

//   PanNumber = (pan_num) => {
//     this.setState({ Pan_Number: pan_num })
//   }

//   Pincode = (pin) => {
//     this.setState({ PinCode: pin })
//   }

//   Location = (gps) => {
//     this.setState({ Gps: gps })
//   }

//   Units = (no_units) => {
//     this.setState({ No_Units: no_units })
//   }

//   Locality = (locality) => {
//     this.setState({ Place: locality })
//   }

//   UnitName = (unit_name) => {
//     this.setState({ Unit_Name: unit_name })
//   }

//   Email = (mail) => {
//     this.setState({ Mail: mail })
//   }

//   Mangername = (manager_name) => {
//     this.setState({ Manager_Name: manager_name })
//   }

//   ManMobNo = (man_mob_no) => {
//     this.setState({ Man_Mob_No: man_mob_no })
//   }

//   ReferalCode = (referal_code) => {
//     this.setState({ Referal_Code: referal_code })
//   }

//   PropName = (prop_name) => {
//     this.setState({ Prop_Name: prop_name })
//   }

//   PropType = (prop_type) => {
//     this.setState({ Prop_Type: prop_type })
//   }

//   as_State = (as_state) => {
//     this.setState({ Ass_State: as_state })
//   }

//   ass_City = (as_city) => {
//     this.setState({ Ass_City: as_city })
//   }

//   Man_Mail = (man_mail) => {
//     this.setState({ Manager_Email: man_mail })
//   }

//   ass_add = (as_add) => {
//     this.setState({ ass_Adress: as_add })
//   }

//   bank_Nmae = (name) => {
//     this.setState({ Bank_Name: name })
//   }

//   acc_no = (Acc_no) => {
//     this.setState({ Account_Number: Acc_no })
//   }

//   IFSC = (ifsc) => {
//     this.setState({ IFSC_Code: ifsc })
//   }

//   bal = (Bal) => {
//     this.setState({ Acc_Balence: Bal })
//   }

//   reset = () => {
//     console.log('ho', 'hii');
//     this.setState({ Manager_Name: '' })
//   }

//   mobilevalidate = (assname, spinner, acc_type) => {

//     mpannumber = this.state.Pan_Number;
//     mPinCode = this.state.PinCode;
//     mpropName = this.state.Prop_Name
//     mnum_units = this.state.No_Units;
//     mnum_block = this.state.total_Blocks;
//     mPlace = this.state.Place;
//     mUnitName = this.state.Unit_Name;
//     mMail = this.state.Mail;
//     mManager_Name = this.state.Manager_Name;
//     mMobileNumber = this.state.Man_Mob_No;
//     mReferalCode = this.state.Referal_Code;
//     mCountry=this.state.Assn_Country;
//     mstate = this.state.Ass_State;
//     mCity = this.state.Ass_City;
//     mAdress = this.state.ass_Adress
//     mBank_name = this.state.Bank_Name;
//     mAccount_Number = this.state.Account_Number;
//     mIFSc = this.state.IFSC_Code;
//     mbal = this.state.Acc_Balence;

//     // mBank_name=this.state.Bank_Name;
//     const reg = /^[0]?[789]\d{9}$/;
//     let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     let regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
//     let regIFSC = /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/
//     const alph=/^[a-zA-Z]+$/;

//     //console.log('gps',params.cat+','+params.cat1);
//     // if(mpannumber.length>0 
//     // ){
//     db.transaction(tx => {
//       tx.executeSql('SELECT  Distinct PanNum FROM Association where PanNum=?', [mpannumber], (tx, results) => {
//         console.log('CreateAssociation Results', results.rows.length);
//         this.setState({ panCount: results.rows.length, });
//       });
//     });

//     // }
//     // if(this.state.panCount!=0){
//     //   ToastAndroid.show('PAN Number exist', ToastAndroid.SHORT);
//     // }

//     if (assname.length == 0) {
//       alert("Association name Cannot be Empty");
//     } else if (global.oyeNonSpecialRegex.test(assname) === true) {
//       alert(" Association name should not contain Special Character");
//       this.setState({
//         mobilevalidate: false,
//         telephone: assname,
//       });
//       return false;

//     } else if (assname.length < 3) {
//       alert("Association name should be more than 3 Characters");
//     } else if (mpropName.length == 0) {
//       alert("property name cannot be empty");
//     } else if (global.oyeNonSpecialRegex.test(mpropName) === true) {
//       alert(" Property name should not contain Special Character");
//       this.setState({
//         mobilevalidate: false,
//         telephone: mpropName,
//       });
//       return false;
//     } else if (spinner == 0) {
//       alert("Select Property Type");
//     } else if (mpannumber.length == 0) {
//       alert("Pan Number Cannot be Empty");
//     } else if (mpannumber.length < 10) {
//       alert("Invalid Pan Number");
//     } else if (regpan.test(mpannumber) == false) {
//       alert("Enter valid PAN Number");
//       this.setState({
//         mobilevalidate: false,
//         pan: mpannumber,
//       });
//       return false;
//     } else if (this.state.panCount != 0) {
//       alert(" Pan Number already Exist");
//     } else if (mstate.length == 0) {
//       alert("State cannot be Empty");
//     } else if (global.oyeNonSpecialRegex.test(mstate) === true) {
//       alert(" State should not contain Special Character");
//       this.setState({
//         mobilevalidate: false,
//         telephone: mstate,
//       });
//       return false;
//     } else if (mCity.length == 0) {
//       alert("City cannot be Empty");
//     } else if (global.oyeNonSpecialRegex.test(mCity) === true) {
//       alert(" City should not contain Special Character");
//       this.setState({
//         mobilevalidate: false,
//         telephone: mCity,
//       });

//       return false;
//     } else if (alph.test(mCity) === false) {
    
//     alert(" City should not contain Special Character");
    
    
    
//     return false;
//     } else if (mAdress.length == 0) {
//       alert("Address cannot be Empty");
//     } else if (global.oyeNonSpecialRegex.test(mAdress) === true) {
//       alert(" Adress should not contain Special Character");
//       this.setState({
//         mobilevalidate: false,
//         telephone: mAdress,
//       });

//       return false;
//     } else if (mPinCode.length == 0) {
//       alert("Pin Code Cannot be Empty");
//     } else if (mPinCode.length < 6) {
//       alert("Invalid Pin Code");
//     } else if (mPinCode == 0) {
//       Alert.alert('Pin Code Cannot be zero');
//     } else if (mnum_block.length == 0) {
//       alert("Number of Blocks cannot be empty");
//     } else if (mnum_block === '0') {
//       Alert.alert(' Number Of Blocks cannot be zero');
//     } else if (mnum_units.length == 0) {
//       alert(" Number of Units cannot be Empty");
//     } else if (mnum_units == 0) {
//       Alert.alert(' Number Of Units cannot be zero');
//     } else if (mnum_units === '0') {
//       Alert.alert(' Number Of Units cannot be zero');
//     }

//     // else if(mPlace.length==0){
//     // alert(" Number of Units cannot be Empty");
//     // }
//     // else if(mPlace.length<3){
//     // ToastAndroid.show('Invalid Location', ToastAndroid.SHORT);
//     // }
//     // else if(mUnitName.length<3){
//     // ToastAndroid.show('Invalid Unitname', ToastAndroid.SHORT);
//     // }

//     else if (mManager_Name.length == 0) {
//       alert(" Manager Name cannot be Empty");
//     } else if (global.oyeNonSpecialRegex.test(mManager_Name) === true) {
//       alert(" Manager Name should not contain Special Character");
//       this.setState({
//         mobilevalidate: false,
//         telephone: mManager_Name,
//       });
//       return false;
//     } else if (mMobileNumber.length < 10) {
//       alert(" Invalid Manager Mobile Number");
//     } else if (reg.test(mMobileNumber) === false) {
//       alert(" Invalid Mobile Number");
//       this.setState({
//         mobilevalidate: false,
//         telephone: mMobileNumber,
//       });

//       return false;
//     } else if (regemail.test(mMail) == false) {
//       alert(" Invalid Email Id");
//       this.setState({
//         mobilevalidate: false,
//         telephone: mMail,
//       });

//       return false;

//     } else if (regemail.test(this.state.Manager_Email) == false) {
//       alert(" Invalid Email Id");
//       this.setState({
//         mobilevalidate: false,
//         telephone: this.state.Manager_Email,
//       });

//       return false;
//     } else if (mUnitName.length == 0) {
//       alert(" Unit Name cannot be Empty");
//     } else if (global.oyeNonSpecialRegex.test(mUnitName) === true) {
//       alert(" Manager Name should not contain Special Character");
//       this.setState({
//         mobilevalidate: false,
//         telephone: mManager_Name,
//       });
//       return false;
   
//     } else if (global.oyeNonSpecialRegex.test(mBank_name) === true) {
//       alert(" Manager Name should not contain Special Character");
//       this.setState({
//         mobilevalidate: false,
//         telephone: mBank_name,
//       });
//       return false;
//     /*  } else if (mBank_name.length == 0) {
//       alert(" Bank Name cannot be Empty");
//     } else if (mAccount_Number.length <= 10) {
//       alert(" Enter Valid Account Number");
//     } else if (mIFSc.length == 0) {
//       alert(" IFSC code Cannot be Empty");
//     } else if (regIFSC.test(this.state.IFSC_Code) == false) {
//       alert(" Invalid IFSC code");
//       this.setState({
//         mobilevalidate: false,
//         telephone: this.state.IFSC_Code,
//       });

//       return false;

//     } else if (acc_type == 0) {
//       alert("Select Account Type");
//     } else if (mbal.length == 0) {
//       alert("Account Balence Cannot be Empty");
//     } else if (mbal === '0') {
//       Alert.alert(' Accopunt Balence cannot be zero'); */
//     } else if (assname.length == 0) {
//       alert("Association name Cannot be Empty");
//     } else if (assname.length < 3) {
//       alert("Association name should be more than  3 Characters");
//     } else if (mpropName.length == 0) {
//       alert("property name cannot be empty");
//     } else if (spinner == 0) {
//       alert("Select  Property Type");
//     } else if (mpannumber.length == 0) {
//       alert("Pan Number Cannot be Empty");
//     } else if (mpannumber.length < 10) {
//       alert("Invalid Pan Number");
//     } else if (regpan.test(mpannumber) == false) {

//       alert("Enter valid PAN Number");
//       this.setState({
//         mobilevalidate: false,
//         pan: mpannumber,
//       });

//       return false;
//     } else if (this.state.panCount != 0) {
//       alert(" Pan Number already Exist");
//     } else if (mstate.length == 0) {
//       alert("State cannot be Empty");
//     } else if (mCity.length == 0) {
//       alert("City cannot be Empty");
//     } else if (mAdress.length == 0) {
//       alert("Address cannot be Empty");
//     } else if (mPinCode.length == 0) {
//       alert("Pin Code Cannot be Empty");
//     } else if (mPinCode.length < 6) {
//       alert("Invalid Pin Code");
//     } else if (mnum_block.length == 0) {
//       alert("Number of Blocks cannot be empty");
//     } else if (mnum_block === '0') {
//       Alert.alert(' Number Of Blocks cannot be zero');
//     } else if (mnum_units.length == 0) {
//       alert(" Number of Units cannot be Empty");
//     } else if (mnum_units === '0') {
//       Alert.alert(' Number Of Units cannot be zero');
//     } else if (mnum_units === 0) {
//       Alert.alert(' Number Of Units cannot be zero');
//     }

//     // else if(mPlace.length==0){
//     //   alert(" Number of Units cannot be Empty");
//     // }
//     // else if(mPlace.length<3){
//     //   ToastAndroid.show('Invalid Location', ToastAndroid.SHORT);
//     // }
//     // else if(mUnitName.length<3){
//     //   ToastAndroid.show('Invalid Unitname', ToastAndroid.SHORT);
//     // }
//     else if (mManager_Name.length == 0) {
//       alert(" Manager  Name cannot be Empty");
//     } else if (alph.test(mManager_Name) ===  false) {
  
//     alert(" Manager Name should not contain Special Character");
//     return false;
    
//     } else if (mMobileNumber.length < 10) {
//       alert(" Invalid  Manager Mobile Number");
//     } else if (reg.test(mMobileNumber) === false) {
//       alert(" Invalid Mobile Number");
//       this.setState({
//         mobilevalidate: false,
//         telephone: mMobileNumber,
//       });
//       return false;
//     } else if (regemail.test(mMail) == false) {
//       alert(" Invalid Email Id");
//       this.setState({
//         mobilevalidate: false,
//         telephone: mMail,
//       });

//       return false;
//     } else if (regemail.test(this.state.Manager_Email) == false) {
//       alert(" Invalid Email Id");
//       this.setState({
//         mobilevalidate: false,
//         telephone: this.state.Manager_Email,
//       });
//       return false;
//     } else if (mUnitName.length == 0) {
//       alert(" Unit Name cannot be Empty");
//     }else if (mAccount_Number.length != 0 && global.oyeNonSpecialRegex.test(mAccount_Number)
//     === true) {
   
//    alert(" Account no should not contain Special Character");
   
//    this.setState({
   
//    mobilevalidate: 
//    false,
   
//    telephone: 
//    mAccount_Number,
   
//    });
   
//    return false;
//   }else if (mIFSc.length != 0 && global.oyeNonSpecialRegex.test(mIFSc)
//   === true) {
 
//  alert("IFSC Code should not contain Special Character");
 
//  return false;
// } else if (mAccount_Number.length != 0 && global.oyeNonSpecialRegex.test(mAccount_Number)
// === true) {
//   alert(" Enter Valid Account Number");
//    /*  } else if (mBank_name.length == 0) {
//       alert(" Bank Name cannot be Empty");
//     } else if (mAccount_Number.length <= 10) {
//       alert(" Enter Valid Account Number");
//     } else if (mIFSc.length == 0) {
//       alert(" IFSC code Cannot be Empty");
//     } else if (regIFSC.test(this.state.IFSC_Code) == false) {
//       alert(" Invalid IFSC code" + this.state.IFSC_Code);
//       this.setState({
//         mobilevalidate: false,
//         telephone: this.state.IFSC_Code,
//       });
//       return false;
//     } else if (acc_type == 0) {
//       alert("Select  Account Type");
//     } else if (mbal.length == 0) {
//       alert("Account Balence Cannot be Empty");
//     } else if (mbal === '0') {
//       Alert.alert(' Accopunt Balence cannot be zero'); */
//     } else {
//       responseObj = {
//         "ACAccntID": global.MyAccountID,
//         "association":
//         {
//           "ASAddress": mAdress,
//           "ASCountry": "India",
//           "ASBToggle": "True",
//           "ASAVPymnt": "False",
//           "ASCity": mCity,
//           "ASState": mstate,
//           "ASPinCode": mPinCode,
//           "ASAsnLogo": "Images/Robo.jpeg",
//           "ASAsnName": assname,
//           "ASPrpName": mpropName,
//           "ASPrpType": spinner,
//           "ASRegrNum": "",
//           "ASWebURL": "",
//           "ASMgrName": mManager_Name,
//           "ASMgrMobile": mMobileNumber,
//           "ASMgrEmail": this.state.Manager_Email,
//           "ASAsnEmail": mMail,
//           "ASPANStat": "True",
//           "ASPANNum": mpannumber,
//           "ASNofBlks": mnum_block,
//           "ASNofUnit": mnum_units,
//           "ASONStat": "True",
//           "ASOMStat": "False",
//           "BankDetails":
//             [
//               {
//                 "BABName": mBank_name,
//                 "BAActType": acc_type,
//                 "BAActNo": mAccount_Number,
//                 "BAIFSC": mIFSc,
//                 "BAActBal": mbal
//               }
//             ],
                                   
//          "Amenities":{
//           "AMType":"",
//           "NoofUnits":mnum_units,
//           "AMDCreated":"2019-01-21"
//         }
                
//         }
//       }

//       console.log('CreateAssociation request', responseObj);
//       fetch(global.champBaseURL +'association/create',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
//           },
//           body: JSON.stringify(responseObj)
//         })
//         .then((response) => response.json())
//         .then((responseJson) => {
//           console.log('CreateAssociation responseJson', responseJson);
//           if (responseJson.success) {
//             // Alert.alert(' Created Succesfully');
//             //this.props.navigation.navigate('CreateUnitsScreen');
//             this.createSelfUnit(responseJson.data.association.asAssnID, this.state.Unit_Name);
//           } else {
//             console.log('ravii else', responseJson);
//             Alert.alert('Created');
//             this.props.navigation.navigate('SelectMyRoleScreen');
//             // console.log('hiii',failed);
//           }
//         })
//         .catch((error) => {
//           console.log('CreateAssociation error ', error);
//           Alert.alert(' Caught Error while getting Response');
//         });
//     }
//   }

//   datavalidate = (assname) => {

//     const { params } = this.props.navigation.state;
//     mpannumber = this.state.Pan_Number;
//     mPinCode = this.state.PinCode;
//     //mGps=params.cat+','+params.cat1
//     mnum_units = this.state.No_Units;
//     mUnitName = this.state.Unit_Name;
//     mMail = this.state.Mail;
//     mManager_Name = this.state.Manager_Name;
//     if (assname.length == 0 && mpannumber.length == 0 && mnum_units.length == 0
//       && mUnitName.length == 0 && mManager_Name.length == 0) {
//       this.props.navigation.navigate('ResDashBoard');
//     } else {
//       Alert.alert(
//         'Do you want to Exit?',
//         alertMessage,
//         [
//           { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
//           { text: 'OK', onPress: () => { this.handleBackButtonClick() } },
//         ]
//       )
//     }
//   }

//   //Cancle function
//   AddMember = (firstname, lastname, mobilenumber, relation) => {
//     var result = this.Validate(firstname, lastname, mobilenumber, relation)
//     if (result === true) {

//     } else {

//     }
//   }

//   Validate(firstname, lastname, mobilenumber, relation) {

//     if (firstname == '') {

//       return false
//     } else if (lastname == '') {
//       Alert.alert(
//         'Enter Last Name',
//         alertMessage,
//         [
//           { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
//           { text: 'OK', onPress: () => console.log('Ok Pressed!') },
//         ]
//       )
//       return false
//     }

//   }
//   createSelfUnit(assnID, unit_name) {
//     anu = {
//       "ASAssnID": assnID,
//       "AcAccntID":global.MyAccountID,
//       "units": [
//         {
//           "UNUniName": unit_name,
//           "UNUniType": "",//nunitType,
//           "UNOpenBal": "",//opn_due_bal,
//           "UNCurrBal": "",
//           "UNOcStat": "",//mocc_sts,
//           "UNOcSDate": "2018-12-25",
//           "UNOwnStat": "",//mown_sts,
//           "UNSldDate": "2018-12-02",
//           "UNDimens": "",//dimens,
//           "UNCalType": "",//rateType,
//           "FLFloorID": 1,
//           "BLBlockID": 1,
//           "Owner": {
//             "UOFName": global.MyFirstName,
//             "UOLName": global.MyLastName,
//             "UOMobile": global.MyMobileNumber,
//             "UOISDCode": global.MyISDCode,
//             "UOMobile1": "",
//             "UOMobile2": "",
//             "UOMobile3": "",
//             "UOMobile4": "",
//             "UOEmail": global.MyEmail,
//             "UOEmail1": "",
//             "UOEmail2": "",
//             "UOEmail3": "",
//             "UOEmail4": "",
//             "UOCDAmnt": "",
//             "ASAssnID": assnID
//           },
//           "Tenant":
//           {
//             "UTName": "",
//             "UTFName": "",
//             "UTLName": "",
//             "UTMobile": "",
//             "UTMobile1": "",
//             "UTEmail": "",
//             "UTEmail1": ""
//           },
//           "UnitParkingLot":
//             [
//               {
//                 "UPLNum": unit_name,
//                 "MEMemID": global.MyOYEMemberID==undefined?0:global.MyOYEMemberID,//2,
//                 "UPGPSPnt": ""
//               }
//             ]
//         }
//       ]
//     }
//     console.log('unit req', anu);
//     fetch(global.champBaseURL +'unit/create',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
//         },
//         body: JSON.stringify(anu
//         )
//       })
//       .then((response) => response.json())
//       .then((responseJson) => {
//         console.log('CreateAssociation unit resp', responseJson);
//         if (responseJson.success) {
//           Alert.alert('Association created successfully ');
//           this.props.navigation.navigate('CreateBlockScreen');
//         } else {
//           console.log('hiii', 'failed');
//           Alert.alert(' Association created ');
//          this.props.navigation.navigate('CreateBlockScreen');
//         }
//       })
//       .catch((error) => {
//         console.error('CreateAssociation err '+error);
//         Alert.alert('caught error in member creating');
//       });
//   }

//   render() {
//     let statelist=

//     [{ value: 
//     'Andhra Pradesh' },
    
//     {value: 'Arunachal Pradesh', },
    
//     { value: 
//     'Assam', }, 
    
//     { value: 
//     'Bihar' ,},
    
//     { value: 
//     'Chhattisgarh', },{ value: 
//       'Delhi', },
    
//     {value: 'Goa', },
    
//     { value: 
//     'Gujarat', }, 
    
//     { value: 
//     'Haryana', }, 
    
//     { value: 
//     'Himachal Pradesh', }, 
    
//     { value: 
//     'Jammu & Kashmir', }, 
    
//     { value: 
//     'Jharkhand', }, 
    
//     { value: 
//     'Karnataka', },
    
//     { value: 
//     'Kerala', },
    
//     { value: 
//     'Madhya Pradesh', }, 
    
//     {value: 'Maharashtra', },
    
//     { value: 
//     'Manipur', }, 
    
//     { value: 
//     'Meghalaya', },
    
//     { value: 
//     'Mizoram', },
    
//     { value: 
//     'Nagaland', }, 
    
//     { value: 
//     'Odisha', }, 
    
//     { value: 
//     'Punjab', }, 
    
//     { value: 
//     'Rajasthan', }, 
    
//     { value: 
//     'Sikkim', }, 
    
//     { value: 
//     'Tamil Nadu', },
    
//     { value: 
//     'Telangana', }, 
    
//     { value: 
//     'Tripura', }, 
    
//     {value: 'Uttarakhand', },
    
//     { value: 
//     'Uttar Pradesh', },
    
//     { value: 
//     'West Bengal', }
    
//     ];
// //    const { navigate } = this.props.navigation;
//   //  const { params } = this.props.navigation.state;
//     // console.log('SelectedAssociationID ', global.SelectedAssociationID);

//     return (
// <View><View style={{backgroundColor: 'white' }}>
//           <View
//             style={{
//               paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
//               borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
//             }}>
//             <TouchableOpacity onPress={() => this.handleBackButtonClick()}
//               style={{ flex: 1 }}>
//               <Image source={require('../pages/assets/images/back.png')}
//                 style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
//             </TouchableOpacity>
//             <Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
//             <Text style={{ flex: 6, fontSize: 16, color: 'black', fontFamily: Fonts.PoppinsExtraBold, alignSelf: 'center' }}>Create Association</Text>
//             <View style={{ flex: 3, alignSelf: 'center' }}>
//               <Image source={require('../pages/assets/images/OyeSpace_hor.png')}
//                 style={{
//                   height: 35, width: 105, margin: 5,
//                   alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
//                 }} />
//             </View>
//           </View>
//           <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
//         </View>
//       <ScrollView style={styles.container}>
//         <View>
//           <Text style={styles.formtitle} >Association Details</Text>
//           <View style={styles.formrectangle}>
//            {/*  <Text style={styles.whatisthenameofyourassoc} >Association Name
//     <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}> *</Text>
//             </Text >
//             <TextInput style={styles.input}
//               underlineColorAndroid="transparent"
//               placeholder="eg: Dream City Owners Association"
//               //  autoCapitalize = "none"
//               //  autoCapitalize = 'true'
//               autofocus='true'
//               maxLength={50}
//               onChangeText={this.Assname} /> */}
//                <TextField
//                             label='Association Name (eg: Dream City Owners Association)'
//                             autoCapitalize='sentences'
//                             labelHeight={15}
//                             maxLength={50}
//                             characterRestriction={50}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={this.Assname}
//                         />
//            {/*  <Text style={styles.whatisthenameofyourassoc}>Property Name
//       <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
//             </Text>
//             <TextInput style={styles.input}
//               underlineColorAndroid="transparent"
//               placeholder="eg: Dream City"
//               //  autoCapitalize = "none"
//               autofocus='true'
//               maxLength={50}
//               onChangeText={this.PropName} /> */}
//             {/*  <Text style={styles.whatisthenameofyourassoc}>Property Type</Text> */}
//             <TextField
//                             label='Property Name (eg: Dream City)'
//                             autoCapitalize='sentences'
//                             labelHeight={15}
//                             maxLength={50}
//                             characterRestriction={50}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={this.PropName}
//                         />
//            <Picker

// selectedValue={this.state.PickerValueHolder}

// style={{
// marginLeft: -7,
// marginRight:15 }}

// onValueChange={(itemValue,
// itemIndex) =>
// this.setState({
// PickerValueHolder: 
// itemValue })} 
// >

// <Picker.Item
// label="Select Property Type"
// value='0'
// />

// <Picker.Item
// label="Residential"
// value="Residential"
// />

// <Picker.Item
// label="Commercial"
// value="Commercial"
// />

// <Picker.Item
// label="Residential/Commercial"
// value="Residential/Commercial"
// />

// </Picker>
//            {/*  <Text style={styles.whatisthenameofyourassoc}>PAN Number of your Association (Do not use Personal PAN Number)
//        <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
//             </Text>
//             <TextInput style={styles.input}
//               underlineColorAndroid="transparent"
//               placeholder="eg: ABCDE1234RS"
//               autoCapitalize='characters'
//               maxLength={20}
//               onChangeText={this.PanNumber} /> */}
//                <TextField
//                             label='PAN Number of your Association (Do not use Personal PAN Number) (eg: ABCDE1234S)'
//                             autoCapitalize='characters'
//                             labelHeight={15}
//                             maxLength={10}
//                             characterRestriction={10}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={this.PanNumber}
//                         />
//                         <View style={{ flexDirection: 'row', marginTop: 2,  }}>
//             <Text style={styles.whatisthenameofyourassoc}>Country
//        <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
//             </Text>
//             <CountryPicker
//                                     onChange={value => {
//                                         this.setState({ cca2: value.cca2, callingCode: value.callingCode ,country: value, Assn_Country:value.name})
//                                     }}
//                                     cca2={this.state.cca2}
//                                     translation="eng"
//                                 />
//                                  <View style={{  flexDirection: 'row', alignContent:'center',alignItems:'center',alignSelf:'center' }}>
//                                 <Text style={{ paddingLeft:20,alignSelf:'center',alignItems:'center', color: 'black',  fontFamily: Fonts.PoppinsRegular, fontSize: 15, }}>+{this.state.callingCode}  {this.state.Assn_Country} 
//         </Text></View>
//        {/*  {this.state.country && (
//           <Text style={{color: 'black', fontSize: 12 }}>
//             {JSON.stringify(this.state.country.name, null, 2)}
//           </Text>)} */}
//            {/*  <PhoneInput style={styles.text}
//               style={{ flex: 2 }}
//               ref={ref => { this.phone = ref; }}
//             /> */}
//              </View> 
            
//             {/* <View style={{ flexDirection: 'row', marginTop: 2, flex: 2 }}>
//               <Text style={styles.whatisthenameofyourassoc1}>State
//        <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
//               </Text>
//               <TextInput style={styles.input1}
//                 underlineColorAndroid="transparent"
//                 autofocus='true'
//                 maxLength={50}
//                 onChangeText={this.as_State} />
//             </View> */}
//            {/*  <TextField
//                             label='State'
//                             autoCapitalize='sentences'
//                             labelHeight={15}
//                             maxLength={50}
//                             characterRestriction={50}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={(text) => this.validateData(text,'Ass_State')}
//                         /> */}
//                         <View
// style={{
// marginLeft: 2,
// paddingRight: 
// 5 , marginTop:10}}>

// <Dropdown

// label='Select State'

// data={statelist}

// labelHeight={15}

// fontSize={15}

// fontFamily={Fonts.PoppinsRegular}

// onChangeText= 
// {this.as_State}

// />

// </View>
//           {/*   <Text style={styles.whatisthenameofyourassoc}>City
//        <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
//             </Text>
//             <TextInput style={styles.input}
//               underlineColorAndroid="transparent"
//               //  placeholder = "eg: ABCDE1234RS"
//               //  autoCapitalize = "none"
//               maxLength={50}
//               autofocus='true'
//               onChangeText={this.ass_City} /> */}
//                <TextField
//                             label='City'
//                             autoCapitalize='sentences'
//                             labelHeight={15}
//                             maxLength={50}
//                             characterRestriction={50}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={this.ass_City}
//                            // onChangeText={(text) => this.validateData(text,'Ass_City')}
                            
//                         />

//           {/*   <Text style={styles.whatisthenameofyourassoc}>Association Address
//        <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
//             </Text>
//             <TextInput style={styles.input}
//               underlineColorAndroid="transparent"
//               maxLength={200}
//               // multiline=
//               //  placeholder = "eg: ABCDE1234R"
//               //  autoCapitalize = "none"
//               autofocus='true'
//               onChangeText={this.ass_add} /> */}
              
//               <TextField
//                             label='Association Address'
//                             autoCapitalize='sentences'
//                             labelHeight={15}
//                             maxLength={50}
//                             characterRestriction={50}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={this.ass_add}
//                         />
//            {/*  <View style={{ flexDirection: 'row', marginTop: 2, flex: 2 }}>
//               <Text style={styles.whatisthenameofyourassoc1}>PinCode
//         <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
//               </Text>
//               <View style={styles.input1}>
//                 <TextInput underlineColorAndroid="transparent"
//                   keyboardType={'numeric'}
//                   maxLength={6}
//                   autoCapitalize="none"
//                   onChangeText={this.Pincode} />
//               </View>
             
//             </View> */}
//             <TextField
//                             label='PinCode'
//                             autoCapitalize='sentences'
//                             labelHeight={15}
//                             maxLength={6}
//                             keyboardType={'numeric'}
//                             characterRestriction={6}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={this.Pincode}
//                         />
            
//            {/*  <View style={{ flexDirection: 'row', marginTop: 2, flex: 3 }}>
//               <Text style={styles.whatisthenameofyourassoc2}>Total Number of Blocks
//       <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>
//                   *</Text>
//               </Text>
//               <TextInput style={styles.input1}
//                 underlineColorAndroid="transparent"
//                 keyboardType={'numeric'}
//                 maxLength={2}
//                 autoCapitalize="none"
//                 onChangeText={this.Total_Blocks} />
//             </View> */}
//             <TextField
//                             label='Total Number of Blocks'
//                             autoCapitalize='sentences'
//                             labelHeight={15}
//                             maxLength={2}
//                             keyboardType={'numeric'}
//                             characterRestriction={2}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={this.Total_Blocks}
//                         />
//             {/* <View style={{ flexDirection: 'row', marginTop: 2, flex: 3 }}>
//               <Text style={styles.whatisthenameofyourassoc2}>Total Number of Units
//       <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>
//                   *</Text>
//               </Text>
//               <TextInput style={styles.input1}
//                 underlineColorAndroid="transparent"
//                 keyboardType={'numeric'}
//                 maxLength={4}
//                 autoCapitalize="none"
//                 onChangeText={this.Units} />
//             </View> */}
//             <TextField
//                             label='Total Number of Units'
//                             autoCapitalize='sentences'
//                             labelHeight={15}
//                             maxLength={4}
//                             keyboardType={'numeric'}
//                             characterRestriction={4}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={this.Units}
//                         />
//             {/* <Text style={styles.whatisthenameofyourassoc}>Email ID of the Association
//     <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
//             </Text>
//             <TextInput style={styles.input}
//               underlineColorAndroid="transparent"
//               autoCapitalize="none"
//               maxLength={50}
//               onChangeText={this.Email} /> */}
//               <TextField
//                             label='Email ID of the Association'
//                             labelHeight={15}
//                             maxLength={50}
//                             characterRestriction={50}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={this.Email}
//                         />
//           </View>
//           <Text style={styles.formtitle} >Other Details</Text>
//           <View style={styles.formrectangle}>
//             {/* <Text style={styles.whatisthenameofyourassoc}>Your Unit Name in the Association
//       <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
//             </Text>
//             <TextInput style={styles.input}
//               underlineColorAndroid="transparent"
//               //  autoCapitalize = "none"
//               maxLength={50}
//               autofocus='true'
//               onChangeText={this.UnitName} /> */}
//               <TextField
//                             label='Your Unit Name in the Association'
//                             labelHeight={15}
//                             maxLength={50}
//                             characterRestriction={50}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={this.UnitName}
//                         />
//             {/* <Text style={styles.whatisthenameofyourassoc}>Name of your Manager
//     <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
//             </Text>
//             <TextInput style={styles.input} underlineColorAndroid="transparent"
//               //  autoCapitalize = "none"
//               autofocus='true'
//               maxLength={50}
//               onChangeText={this.Mangername} /> */}
//   <TextField
//                             label='Name of your Manager'
//                             labelHeight={15}
//                             maxLength={50}
//                             characterRestriction={50}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={this.Mangername}
//                             //onChangeText={(text) => this.validateData(text,'Manager_Name')}

                            
//                         />
//            {/*  <Text style={styles.whatisthenameofyourassoc}>Mobile Number of your Manager
//   <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>

//             </Text>
//             <TextInput style={styles.input}
//               underlineColorAndroid="transparent"
//               keyboardType={'numeric'}
//               maxLength={10}
//               autoCapitalize="none"
//               onChangeText={this.ManMobNo} /> */}
//               <TextField
//                             label='Mobile Number of your Manager'
//                             labelHeight={15}
//                             maxLength={10}
//                             keyboardType={'numeric'}
//                             characterRestriction={10}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={this.ManMobNo}
//                         />
//            {/*  <Text style={styles.whatisthenameofyourassoc}>EmailID of your Manager
//   <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
//             </Text>
//             <TextInput style={styles.input}
//               underlineColorAndroid="transparent"
//               //  keyboardType={'numeric'}
//               maxLength={50}
//               autoCapitalize="none"
//               onChangeText={this.Man_Mail} /> */}
//                <TextField
//                             label='Email ID of your Manager'
//                             labelHeight={15}
//                             maxLength={50}
//                             characterRestriction={50}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={this.Man_Mail}
//                         />
//           </View>
//           <Text style={styles.formtitle} >Bank Details</Text>
//           <View style={styles.formrectangle}>
//             {/* <Text style={styles.whatisthenameofyourassoc}> Bank Name
     
//             </Text>
//             <TextInput style={styles.input}
//               underlineColorAndroid="transparent"
//               //  autoCapitalize = "none"
//               autofocus='true'
//               maxLength={50}
//               onChangeText={this.bank_Nmae} /> */}
//                <TextField
//                             label='Bank Name'
//                             labelHeight={15}
//                             maxLength={50}
//                             characterRestriction={50}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={this.bank_Nmae}
//                         />
//           {/*   <Text style={styles.whatisthenameofyourassoc}>IFSC Code
   
//             </Text>
//             <TextInput style={styles.input} underlineColorAndroid="transparent"
//               autoCapitalize='characters'
//               autofocus='true'
//               maxLength={20}
//               onChangeText={this.IFSC} /> */}
//                <TextField
//                             label='IFSC Code'
//                             labelHeight={15}
//                             maxLength={20}
//                             characterRestriction={20}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={(text) => this.validateData(text,'IFSC_Code')}
//                             //onChangeText={this.IFSC}
                            
//                         />
//            {/*  <Text style={styles.whatisthenameofyourassoc}>Account Number
  
//             </Text>
//             <TextInput style={styles.input}
//               underlineColorAndroid="transparent"
//               keyboardType={'numeric'}
//               maxLength={20}
//               autoCapitalize="none"
//               onChangeText={this.acc_no} /> */}
//                 <TextField
//                             label='Account Number'
//                             labelHeight={15}
//                             maxLength={20}
//                             characterRestriction={20}
//                             keyboardType={'numeric'}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={this.acc_no}
//                         />
//            <Text
// style={styles.whatisthenameofyourassoc}>Account
//  Type


// </Text>

// <Picker
// selectedValue={this.state.PickerValueHolder_acctype}

// style={{
// marginLeft: -5,marginRight:15 }}

// onValueChange={(itemValue,
// itemIndex) =>
// this.setState({
// PickerValueHolder_acctype: 
// itemValue })} 
// >

// <Picker.Item
// label="Select "
// value='0'
// />

// <Picker.Item
// label="Savings"
// value="Savings"
// />

// <Picker.Item
// label="Current"
// value="Current"
// />

// </Picker>
//             {/* <Text style={styles.whatisthenameofyourassoc}>Account Balance
  
//             </Text>
//             <TextInput style={styles.input}
//               underlineColorAndroid="transparent"
//               keyboardType={'numeric'}
//               autoCapitalize="none"
//               maxLength={10}
//               onChangeText={this.bal} /> */}
//                  <TextField
//                             label='Account Balance'
//                             labelHeight={15}
//                             maxLength={10}
//                             keyboardType={'numeric'}
//                             characterRestriction={10}
//                             activeLineWidth={0.5}
//                             fontFamily={Fonts.PoppinsRegular}
//                             fontSize={15}
//                             onChangeText={this.bal}
//                         />
//           </View>

//           {/* <Text style = {styles.whatisthenameofyourassoc}>Do you have any referral code?
//      <Text style={{fontSize: 20,textAlignVertical:'center', color: 'red'}}>*</Text>
//        </Text>
//        <TextInput style = {styles.input}
//        underlineColorAndroid = "transparent"
//        autoCapitalize = "none"
//                      maxLength={50}
//        onChangeText = {this.ReferalCode}/> */}

//           <View style={{ flex: 1, flexDirection: 'row', marginBottom: 20 }}>
//             <TouchableOpacity style={styles.rectangle}
//               onPress={this.mobilevalidate.bind(this, this.state.Assocation_name, this.state.PickerValueHolder, this.state.PickerValueHolder_acctype)}>
//               <Text style={styles.submitButtonText}> OK </Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.rectangle}
//               onPress={this.datavalidate.bind(this, this.state.Assocation_name)}>
//               <Text style={styles.submitButtonText}> Cancel </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//       </View>
//     );

//   }

// }

// const styles = StyleSheet.create({

//   container: { paddingTop: 15,paddingBottom:10, backgroundColor: 'white',height:'90%' },

//   input: {
//     marginLeft: 20, marginRight: 15, marginTop: 5, marginBottom: 5,
//     height: 40, borderColor: '#F2F2F2', backgroundColor: '#F2F2F2', borderWidth: 1.5, borderRadius: 2,
//   },
//   input1: {
//     marginLeft: 20, marginRight: 15, marginTop: 5, marginBottom: 5, flex: 1,
//     height: 40, borderColor: '#F2F2F2', backgroundColor: '#F2F2F2', borderWidth: 1.5, borderRadius: 2,
//   },
//   whatisthenameofyourassoc1: {
//     marginLeft: 25, color: '#000', fontFamily: Fonts.Tahoma, fontSize: 13, flex: 1
//   },
//   whatisthenameofyourassoc2: {
//     marginLeft: 25, color: '#000', fontFamily: Fonts.Tahoma, fontSize: 13, flex: 2
//   },
//   whatisthenameofyourassoc: {
//     marginLeft: 0, marginRight: 10, color: '#000', fontFamily: Fonts.Tahoma, 
// fontSize: 13,
//   },
//   submitButton: { backgroundColor: '#7a42f4', padding: 10, margin: 15, height: 40, },
//   submitButtonText: { 
//     color: '#000000',fontFamily:
//     Fonts.OpenSansExtraBold,alignSelf:'center' },
    
//     rectangle: { 
//     flex: 1, 
//     backgroundColor: '#FFA500',
//     padding:10,
//     borderColor:  'orange',
//     marginLeft:5,
//     marginRight:5,
//     marginTop:5,
//     borderRadius: 
//     2, borderWidth: 
//     1, },
//   submitButtonTextold: { color: '#FA9917' },
//   formtitle: { fontSize: 16, fontFamily: Fonts.PoppinsExtraBold , color : 'black', marginBottom:8,marginLeft:8},
//   formrectangle: { flex: 1, backgroundColor: 'white', borderColor: 'orange',
//   marginLeft:8, marginRight:8,marginBottom:8, borderRadius: 0, borderWidth: 1.5, paddingLeft:10, paddingRight:10 },
//   text: { fontSize: 13, color: 'black', justifyContent: 'center', marginLeft: 15 },
//   rectangleold: { flex: 1, backgroundColor: 'white', padding:10, borderColor: 'orange',
//   marginLeft:5, marginRight:5, marginTop:5, borderRadius: 2, borderWidth: 1, },
// })
