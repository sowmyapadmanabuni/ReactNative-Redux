
import React, { Component } from 'react';
import {
  Platform, StyleSheet, Button, Picker, View, Text, Image,BackHandler,
  ScrollView, TextInput, TouchableOpacity, Alert, FlatList
} from 'react-native';
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import { Dropdown } from 'react-native-material-dropdown';
// import Orientation from 'react-native-orientation';
import PhoneInput from "react-native-phone-input";
import { Fonts } from '../pages/src/utils/Fonts';
import moment from 'moment';
import { openDatabase } from 'react-native-sqlite-storage';
import { TextField } from 'react-native-material-textfield';
import CountryPicker from 'react-native-country-picker-modal';
var db = openDatabase({ name: global.DB_NAME });

// const initial = Orientation.getInitialOrientation();
var date = new Date().getDate();
var month = new Date().getMonth() + 1;
var year = new Date().getFullYear();

export default class CreateUnitsPotrait extends Component {
  constructor() {
    super()
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {

      Unit_Name: '',
      Mail: '',
      TenantMail: '',
      UnitParkingLot: '',
      Manager_Name: '',
      Referal_Code: '',
      PickerValueHolder: '',
      UnitType: '',
      ownstatus: '',
      seleRate: '',
      UnitID: '',
      First_Name: '',
      LastName: '',
      Tenant_First_Name: '',
      TenantLastName: '',
      MobileNumber: '',
      TenantMobileNumber: '',
      AltEmailID: '',
      AltMobNo: '',
      SelectRate: '',
      Ownership_status: '',
      Occupency_Status: '',
      RateType: '',
      Dimension_d: '',
      Opening_Due_bal: '',
      isLoading: true,
      dobText: year + '-' + month + '-' + date,
      dobDate: null,
      imageLoading: true,
      chosenDate: new Date(),
      iso2:'in'
    };
    this.setDate = this.setDate.bind(this);
    this.onDateChange = this.onDateChange.bind(this);

    this.setState({ Unit_Name: '' });

  }

  onDOBPress = () => {
    let dobDate = this.state.dobDate;

    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        dobDate: dobDate
      });
      //this.makeRemoteRequest();
    }
    this.refs.dobDialog.open({
      date: dobDate,
      maxDate: new Date() //To restirct future date
    });

  }
  onDOBDatePicked = (date) => {
    this.setState({
      dobDate: date,
      dobText: moment(date).format('YYYY-MM-DD')
    });
    //this.makeRemoteRequest();
    console.log('CreateUnitsPotrait ', date + ' ' + this.state.dobDate + ' ' + this.state.dobText);

  }
  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
    //this.makeRemoteRequest();
  }
  setDate(newDate) {
    this.setState({ chosenDate: newDate });
    // this.makeRemoteRequest();
  }

  Flat = (Flat_no) => {
    this.setState({ Unit_Name: Flat_no })
  }
  firstname = (f_n) => {
    this.setState({ First_Name: f_n })
  }
  lastname = (l_n) => {
    this.setState({ LastName: l_n })
  }
  tenantfirstname = (f_n) => {
    this.setState({ Tenant_First_Name: f_n })
  }
  tenantlastname = (l_n) => {
    this.setState({ TenantLastName: l_n })
  }
  mob = (mobile) => {
    this.setState({ MobileNumber: mobile })
  }
  tenant_mob = (mobile) => {
    this.setState({ TenantMobileNumber: mobile })
  }

  Unit_type = (u_t) => {
    this.setState({ Unit_type: u_t })
  }
  Mail = (email) => {
    this.setState({ Mail: email })
  }
  TenantMail = (email) => {
    this.setState({ TenantMail: email })
  }
  unitParkgLot = (upl) => {
    this.setState({ UnitParkingLot: upl })
  }
  altemail = (a_e_id) => {
    this.setState({ AltEmailID: a_e_id })
  }
  AltMobl = (a_m_no) => {
    this.setState({ AltMobNo: a_m_no })
  }
  Select_Rate = (mselect) => {
    this.setState({ SelectRate: mselect })
  }
  handleOccStatus = (mocc_status) => {
    this.setState({ Occupency_Status: mocc_status })
  }
  ownstatus = (mown_statys) => {
    this.setState({ Ownership_status: mown_statys })
  }
  dimension = (mdim) => {
    this.setState({ Dimension_d: mdim })
  }
  due_bal = (mdue_bal) => {
    this.setState({ Opening_Due_bal: mdue_bal })
  }
  reset = () => {
    console.log('ho', 'hii');
    this.setState({ Manager_Name: '' })
  }

  handleRateType = (relation) => {
    this.setState({ RateType: relation })
  }

  handleUnitType = (relation) => {
    this.setState({ UnitType: relation })
  }

  componentWillMount() {
    // The getOrientation method is async. It happens sometimes that
    // you need the orientation at the moment the JS runtime starts running on device.
    // `getInitialOrientation` returns directly because its a constant set at the
    // beginning of the JS runtime.
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    // const initial = Orientation.getInitialOrientation();
    // if (initial === 'PORTRAIT') {
    //   //alert('portaroiat1');
    //   console.log('portrait', 'hi');
    // } else {
    //   console.log('landscape', 'hi');
    //   // alert('hello else');
    // }
  }

  componentDidMount() {

    // this locks the view to Portrait Mode
    // Orientation.lockToPortrait();
    // Orientation.lockToLandscape();
    // this locks the view to Landscape Mode
    // Orientation.lockToLandscape();
    // this unlocks any previous locks to all Orientations
    // Orientation.unlockAllOrientations();
    // Orientation.addOrientationListener(this._orientationDidChange);

  }

  _orientationDidChange = (orientation) => {
    // if (orientation === 'LANDSCAPE') {
    //   Orientation.lockToLandscape();
    //   alert('landscape');
    // } else {
    //   Orientation.lockToLandscape();
    //   console.log('port' ,'jhjkjh',)
    //   alert('else land');
    //   // do something with portrait layout
    // }
  }

  componentWillUnmount() {
    // Orientation.unlockAllOrientations();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

    // Orientation.getOrientation((err, orientation) => {
      //  alert('close land');
      // console.log(`Current Device Orientation: ${orientation}`);
    // });

    // Remember to remove listener
    // Orientation.removeOrientationListener(this._orientationDidChange);
  }

  mobilevalidate = (unitName) => {

    const { params } = this.props.navigation.state;
    console.log('createunitportrait start ', params.id + ' ' + unitName + ' ')
    if (this.state.Unit_Name == undefined) {

    } else {
      nFalt = this.state.Unit_Name;
    }
    nfirst_name = this.state.First_Name;
    tenantfirst_name = this.state.Tenant_First_Name;
    // mGps=params.cat+','+params.cat1
    nlast_name = this.state.LastName;
    tenantlast_name = this.state.TenantLastName;
    nmob = this.state.MobileNumber;
    tenant_nmob = this.state.TenantMobileNumber;
    nunitType = this.state.UnitType;
    nemail = this.state.Mail;
    tenantnemail = this.state.TenantMail;
    nselectrate = this.state.Select_Rate;
    mocc_sts = this.state.Occupency_Status;
    mown_sts = this.state.Ownership_status;
    dimens = this.state.Dimension_d;
    opn_due_bal = this.state.Opening_Due_bal;
    rateType = this.state.RateType;

    let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    //Alert.alert( this.phone1.getValue()+' cc '+ this.phone.getValue());
    if (nFalt.length == 0) {
      Alert.alert('Enter Flat Number');
    } else if (nfirst_name.length == 0) {
      Alert.alert(' Enter First name');
    } else if (nlast_name.length == 0) {
      Alert.alert(' Enter Last name');
    } else if (nmob.length < 10) {
      Alert.alert('Invalid Mobilenumber');
    } else if (global.oyeMobileRegex.test(nmob) === false) {
      Alert.alert('Enter valid  Mobile Number');
      this.setState({
        mobilevalidate: false,
        telephone: nmob,
      });
      return false;
    } else if (nemail.length == 0) {
      Alert.alert('Email ID cannot be empty');
      // } else if (regemail.test(nemail) == false) {
      //   Alert.alert('enter valid mail');
      //   this.setState({
      //     mobilevalidate: false,
      //     telephone: nemail,
      //   });
      //   return false;
    }
    else if (nunitType == '') {
      Alert.alert('Select Unit Type');
    }
    else if (mocc_sts == '') {
      Alert.alert('Select Occupancy Status');
    }

    /* 
    Unit_Name
    UnitIdentifier
    Unit_Type
    Opening_Balance
    Current_Balance
    Occupancy_Status(int, 0,1,2,3)
    Occupancy_Status_Date(is respect to Occupancy_Status)
    Ownership_Status(bool)
    Sold_Date(if Ownership_Status 0,1 this field will come)
    Association_ID
    Unit_Dimension
    CalculationType(per unit or dimesion Based Calculation)
    Floor_ID
    Block_ID */
    else {

      // anu1 = {
      //   "ASAssnID": 6,
      //   "units": [
      //     {
      //       "UNUniName": nFalt,
      //       "UNUniType": nunitType,
      //       "UNOpenBal": "12.3",
      //       "UNCurrBal": "25.12",
      //       "UNOcStat": mocc_sts,
      //       "UNOcSDate": this.state.PinCode,
      //       "UNOwnStat": mown_sts,
      //       "UNSldDate": "2018-02-02",
      //       "UNDimens": "2",
      //       "UNCalType": "df",
      //       "FLFloorID": 1,
      //       "BLBlockID": 1

      //     }
      //   ]

      // }
      anu = {
        "ASAssnID": params.id,
        "units": [
          {
            "UNUniName": nFalt,
            "UNUniType": nunitType,
            "UNOpenBal": opn_due_bal,
            "UNCurrBal": "25.12",
            "UNOcStat": mocc_sts,
            "UNOcSDate": this.state.dobText,
            "UNOwnStat": mown_sts,
            "UNSldDate": "2018-02-02",
            "UNDimens": dimens,
            "UNCalType": rateType,
            "FLFloorID": 1,
            "BLBlockID": 1,
            "Owner": {
              "UOFName": nfirst_name,
              "UOLName": nlast_name,
              "UOMobile": nmob,
              "UOISDCode": this.phone1.getValue(),
              "UOMobile1": "",
              "UOMobile2": "",
              "UOMobile3": "",
              "UOMobile4": "",
              "UOEmail": nemail,
              "UOEmail1": "",
              "UOEmail2": "",
              "UOEmail3": "",
              "UOEmail4": "",
              "UOCDAmnt": "12.36",
              "ASAssnID": params.id
            },
            "Tenant":
            {
              "UTName": tenantfirst_name,
              "UTFName": tenantfirst_name,
              "UTLName": tenantlast_name,
              "UTMobile": tenant_nmob,
              "UTMobile1": "",
              "UTEmail": tenantnemail,
              "UTEmail1": ""
            },
            "unitbankaccount":
            {
              "UBName": "",
              "UBIFSC": "",
              "UBActNo": "",
              "UBActType": "",
              "UBActBal": 12.3,
              "BLBlockID": 10
            },
            "UnitParkingLot":
              [
                {
                  "UPLNum": this.state.UnitParkingLot,
                  "MEMemID": global.MyOYEMemberID,//2,
                  "UPGPSPnt": ""
                }
              ]
          }
        ]
      }
      console.log('anu', anu);
      fetch(global.champBaseURL + 'unit/create',
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
          console.log('ravii', responseJson);
          if (responseJson.success) {

            // Alert.alert('sent suceefully ');
            if (nmob == global.MyMobileNumber) {
              this.props.navigation.navigate('SelectMyRoleScreen');
            } else {
              this.props.navigation.navigate('Unit');
            }

          } else {
            console.log('hiii', 'failed');
            Alert.alert('Unit Created');
            if (nmob == global.MyMobileNumber) {
              this.props.navigation.navigate('SelectMyRoleScreen');
            } else {
              this.props.navigation.navigate('Unit');
            }
          }
          console.log('suvarna', 'hi');
        })
        .catch((error) => {
          console.error(error);
          Alert.alert('caught error in sending otp');
        });
    }
this.goBack()
  }

  goBack(){
    this.props.navigation.navigate('Unit');
    }
  renderSeparator = () => {
    return (
      <View
        style={{ height: 2, width: '100%', backgroundColor: '#fff' }}>
      </View>
    )
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
          this.props.navigation.navigate('AssnListScreen');
        } else {
          this.props.navigation.navigate('AssnListScreen');
        }

      });
    });

    return true;
  }

  render() {
    let dpOwnershipStatus = [{ value: 'Sold', }, { value: 'Unsold', }]

    let dpOccupancyStatus = [{ value: 'Self Occupied', }, { value: 'Tenant Occupied', }, { value: 'Vacant', }]

    let dpUnitType = [{ value: 'Vacant Plot', }, { value: 'Flat', }, { value: 'Villa', }]

    let dpRateType = [{ value: 'Flat Rate Value', }, { value: 'Dimension Based', }]

    let dpVehType = [{ value: 'Two Wheeler', }, { value: 'Three Wheeler', }, { value: 'Four Wheeler', }]

    const {
      navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View>
        <View style={{flexDirection:'row',}}>
                    <View style={{flex:1, marginTop:43,marginRight:0, justifyContent:'center',marginLeft:10}}>
                        <TouchableOpacity onPress={() => navigate(('Unit'), { cat: '' })}
                        >
                        <Image source={require('../pages/assets/images/back.png')}
                        style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity 
                        style={{paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 1, alignItems: 'center', flexDirection: 'row',
                            paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:'6%'}}
                            onPress={() => this.props.navigation.navigate('SideMenu')}>
                        <Image source={require('../pages/assets/images/menu_button.png')}
                            style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
                    </TouchableOpacity> */}
                    <View style={{ flex: 5, alignItems:'center', justifyContent:'center'}}>
                    <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} />
                    </View>  
                    <View style={{flex:1,marginTop:45, marginRight:10, justifyContent:'center',}}>    
                    </View>                 
                </View> 

                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
                <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

                <Text style={{ fontSize: 16, color: 'black', fontWeight:'bold',margin:10 }}>Create Unit</Text>


          </View>
        <ScrollView style={{ height: '90%', paddingLeft: 20, paddingRight: 20 }}>

          <Text style={{ color: 'orange', marginLeft: 15, fontSize: 16 }}>Unit Information</Text>
          {/*  <View style={{ flexDirection: 'row', marginTop: 2, flex: 2 }}>
            <Text style={styles.whatisthenameofyourassoc1}>
              Flat No <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>
                *</Text>
            </Text>
            <TextInput style={styles.input11}
              underlineColorAndroid="transparent"
              placeholder="Flat No"
              autoCapitalize="words"
              onChangeText={this.Flat}
              maxLength={50} />
          </View> */}
          <TextField
            label='Flat Number / Door Number (eg:B007 )'
            autoCapitalize='sentences'
            labelHeight={15}
            maxLength={50}
            characterRestriction={50}
            activeLineWidth={0.5}
            
            fontSize={15}
            onChangeText={this.Flat}
          />
          <View style={{ flex: 1,  }}>

            <Dropdown label='Select Ownership Status'
              data={dpOwnershipStatus}
              onChangeText={this.ownstatus} />
          </View>
          <View style={{ flex: 2, flexDirection: 'row', }}>
            <View style={{ flex: 1, paddingRight: 5 }}>
              <Dropdown label='Select Unit Type'
                data={dpUnitType}
                onChangeText={this.handleUnitType} />
            </View>
            <View style={{ flex: 1, marginLeft: 5, paddingRight: 5 }}>
              <Dropdown label='Select Rate Type'
                data={dpRateType}
                onChangeText={this.handleRateType} />
            </View>
          </View>
          <View style={{ flex: 1, }}>
            <Dropdown label='Select Occupancy Status'
              data={dpOccupancyStatus}
              onChangeText={this.handleOccStatus} />
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View style={{
              flex: 1,  paddingRight: 5,
            }}>
              <TextField
                label='First Name'
                style={{ flex: 1 }}
                autoCapitalize='words'
                labelHeight={15}
                maxLength={50}
                characterRestriction={50}
                activeLineWidth={0.5}
                
                fontSize={15}
                onChangeText={this.firstname}
              />
              </View>
            <View style={{
              flex: 1, paddingLeft: 5, 
            }}>
              <TextField
                label='Last Name'
                autoCapitalize='words'
                style={{ flex: 1 }}
                labelHeight={15}
                maxLength={50}
                characterRestriction={50}
                activeLineWidth={0.5}
               
                fontSize={15}
                onChangeText={this.lastname}
              />
              </View>
            {/*   <View style={{
              flex: 1, flexDirection: 'row', marginLeft:
                '2%', marginTop: 5, height: 40, borderColor: '#F2F2F2', backgroundColor:
                '#F2F2F2', borderWidth: 1.5, borderRadius: 2,
            }}>

               <Image source={require('../pages/assets/images/man-user.png')}
                style={styles.imagee} />
              <TextInput style={styles.text}
                underlineColorAndroid="transparent"
                placeholder="First Name"
                placeholderTextColor="#828282"
                autoCapitalize="words"
                //value={this.state.FirstName}
                onChangeText={this.firstname} /> 
              
            </View>*/}

            {/*  <View style={{
              flex: 1, flexDirection: 'row', marginLeft: '2%', marginRight: 5, marginTop: 5, height:
                40, borderColor: '#F2F2F2', backgroundColor: '#F2F2F2', borderWidth: 1.5, borderRadius: 2,
            }}>

               <Image source={require('../pages/assets/images/man-user.png')}
                style={styles.imagee} />
              <TextInput style={styles.text}
                underlineColorAndroid="transparent"
                placeholder="Last Name"
                placeholderTextColor="#828282"
                autoCapitalize="words"
                onChangeText={this.lastname} /> 
             
            </View>*/}
          </View>

          <View style={{flexDirection:'row'}}>
            {/* <Image style={{ flex: 1 }}
              source={require('../pages/assets/images/call-answer.png')}
              style={styles.imagee} /> */}
            <PhoneInput style={styles.text}
              style={{ flex: 2 }}
              ref={ref1 => {
                this.phone1 = ref1;
              }}
            />
           {/*  <TextInput
              style={styles.text}
              style={{ flex: 5 }}
              underlineColorAndroid="transparent"
              placeholder="Mobile Number"
              placeholderTextColor="#828282"
              autoCapitalize="none"
              keyboardType={'numeric'}
              maxLength={10}
              onChangeText={this.mob} /> */}
              <View style={{
              flex: 5, paddingLeft: 5, paddingRight: 5,
            }}>
             <TextField
              label='Mobile Number'
              
              labelHeight={15}
              maxLength={10}
              keyboardType={'numeric'}
              characterRestriction={10}
              activeLineWidth={0.5}
              
              fontSize={15}
              onChangeText={this.mob}
            />
            </View>
           
          </View>

          {/*  <View style={{ flex: 1, flexDirection: 'row', marginTop: 2 }}>
            <Text style={{ marginLeft: 15, color: 'black', margin: 5 }}>
              Email Id <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>
                *</Text>
            </Text>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Email Id "
              autoCapitalize="none"
              onChangeText={this.Mail}
              maxLength={50} />
          </View> */}
          {/*  <View style={styles.input1}>
              <Image source={require('../pages/assets/images/envelope.png')}
              style={styles.imagee} />
            <TextInput style={styles.text}
              underlineColorAndroid="transparent"
              placeholder="Email ID"
              placeholderTextColor="#828282"
              autoCapitalize="none"
              onChangeText={this.Mail} /> 
           
          </View> */}
          <TextField
            label='Email ID'
            labelHeight={15}
            maxLength={50}
            characterRestriction={50}
            activeLineWidth={0.5}
            
            fontSize={15}
            onChangeText={this.Mail}
          />

          {/*  <View style={{ flex: 2, flexDirection: 'row', marginTop: 5, flex: 2 }}>
             <Text style={styles.whatisthenameofyourassoc1}>Dimension
        </Text>
            <TextInput style={styles.input11}
              underlineColorAndroid="transparent"
              placeholder="Dimension"
              autoCapitalize="none"
              keyboardType={'numeric'}
              onChangeText={this.dimension}
              maxLength={50} /> 
           
          </View> */}
          <TextField
            label='Dimension'
            labelHeight={15}
            maxLength={10}
            keyboardType={'numeric'}
            characterRestriction={10}
            activeLineWidth={0.5}
            
            fontSize={15}
            onChangeText={this.dimension}
          />
          {/* <View style={{ flexDirection: 'row', marginTop: 2, flex: 2 }}>
             <Text style={styles.whatisthenameofyourassoc1}>
              Opening Due Balance
   </Text>
            <TextInput style={styles.input11}
              underlineColorAndroid="transparent"
              placeholder="Opening Due Balance"
              autoCapitalize="none"
              keyboardType={'numeric'}
              maxLength={8}
              onChangeText={this.due_bal}
            /> 
            
          </View> */}
          <TextField
            label='Opening Due Balance'
            labelHeight={15}
            maxLength={10}
            keyboardType={'numeric'}
            characterRestriction={10}
            activeLineWidth={0.5}
            
            fontSize={15}
            onChangeText={this.due_bal}
          />
          {/*  <View style={{ flexDirection: 'row', marginTop: 2, flex: 2 }}>
            <Text style={styles.whatisthenameofyourassoc1} >PinCode
        <Text style={{ fontSize: 20, textAlignVertical: 'center', color: 'red' }}>*</Text>
            </Text>
            <View style={styles.input11}>
              <TextInput underlineColorAndroid="transparent"
                keyboardType={'numeric'}
                maxLength={6}
                autoCapitalize="none"
                onChangeText={this.Pincode} />
            </View>
            
            </View> */}
          <View style={{ flex: 2, flexDirection: 'row', marginTop: 2 }}>
            {/*  </View>
          <View style={{ marginLeft: 15, paddingRight: 15 }}> */}
            <Text style={styles.whatisthenameofyourassoc1}>
              Opening Due Balance as on
   </Text>
            <TouchableOpacity style={styles.datePickerBox} onPress={this.onDOBPress.bind(this)} >
              <View >
                <Text style={styles.datePickerText}> {this.state.dobText}   </Text>
              </View>
            </TouchableOpacity>
            <DatePickerDialog style={styles.input11} ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />

            {/* <TouchableOpacity onPress={this.onDOBPress.bind(this)} >
                     <View style={styles.datePickerBox}>
                       <Text style={styles.datePickerText}>{this.state.dobText}</Text>
                     </View>
                  </TouchableOpacity>
                   <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} /> */}
            {/* <Picker
       selectedValue={this.state.PickerValueHolder}
       onValueChange={(itemValue, itemIndex) => this.setState({PickerValueHolder: itemValue})} >
       <Picker.Item label="Residential" value="Residential" />
       <Picker.Item label="Comercial" value="Comercial" />
       <Picker.Item label="Residentail/Commercial" value="Residentail/Commercial" />
     </Picker> */}
          </View>


          {/*  <Text style={{ color: 'orange', marginLeft: 15, fontSize: 16 }}>
            Vehicle Details
   </Text> */}

          {/*  <View style={{ flexDirection: 'row', marginTop: 2, flex: 2 }}>
            <Text style={styles.whatisthenameofyourassoc1}>
              Parking Slot Number
   </Text>
            <TextInput style={styles.input11}
              underlineColorAndroid="transparent"
              placeholder="Parking Slot Number"
              autoCapitalize="words"
              maxLength={8}
              onChangeText={this.unitParkgLot}
            />

          </View> */}
          <TextField
            label='Parking Slot Number'
            labelHeight={15}
            maxLength={10}
            characterRestriction={10}
            activeLineWidth={0.5}
            
            fontSize={15}
            onChangeText={this.unitParkgLot}
          />
           {this.state.Occupency_Status == 'Self Occupied' ?
          <Text style={{height:0}}></Text>
         :
         <View>
          <Text style={{ color: 'orange', marginLeft: 15, fontSize: 16 }}>Tenant Information</Text>
          <View style={{ flexDirection: 'row' }}>
            {/* <View style={{
              flex: 1, flexDirection: 'row', marginLeft:
                '2%', marginTop: 5, height: 40, borderColor: '#F2F2F2', backgroundColor:
                '#F2F2F2', borderWidth: 1.5, borderRadius: 2,
            }}>

              <Image source={require('../pages/assets/images/man-user.png')}
                style={styles.imagee} />
              <TextInput style={styles.text}
                underlineColorAndroid="transparent"
                placeholder="Tenant's First  Name"
                placeholderTextColor="#828282"
                autoCapitalize="words"
                //value={this.state.FirstName}
                onChangeText={this.tenantfirstname} />
            </View> */}
            <View style={{
              flex: 1,  paddingRight: 5,
            }}>
              <TextField
                label="Tenant's First Name"
                style={{ flex: 1 }}
                autoCapitalize='words'
                labelHeight={15}
                maxLength={50}
                characterRestriction={50}
                activeLineWidth={0.5}
              
                fontSize={15}
                onChangeText={this.tenantfirstname}
              />
              </View>
            <View style={{
              flex: 1, paddingLeft: 5, 
            }}>
              <TextField
                label="Tenant's Last Name"
                autoCapitalize='words'
                style={{ flex: 1 }}
                labelHeight={15}
                maxLength={50}
                characterRestriction={50}
                activeLineWidth={0.5}
                
                fontSize={15}
                onChangeText={this.tenantlastname}
              />
              </View>

          </View>
          {/* <View style={{
            flex: 1, flexDirection: 'row', marginLeft: '2%', marginRight: 5, marginTop: 5, height:
              40, borderColor: '#F2F2F2', backgroundColor: '#F2F2F2', borderWidth: 1.5, borderRadius: 2,
          }}>

            <Image source={require('../pages/assets/images/man-user.png')}
              style={styles.imagee} />
            <TextInput style={styles.text}
              underlineColorAndroid="transparent"
              placeholder="Tenant's Last Name"
              placeholderTextColor="#828282"
              autoCapitalize="words"
              onChangeText={this.tenantlastname} />
          </View> */}
          
          <View style={{ flexDirection: 'row', }}>
                            <View style={{ flex: 0.10, flexDirection: 'row', marginTop: '3.5%' }}>
                                {/* <CountryPicker
                                    onChange={value => {
                                        this.setState({ cca21: value.cca2, callingCodeTenant: value.callingCode })
                                    }}
                                    cca2={this.state.cca21}
                                    translation="eng"
                                /> */}
                            </View>
                            <View style={{ flex: 0.20, flexDirection: 'row', marginTop: '4.5%' }}>
                                <Text style={{ color: 'black', fontSize: 12 }}>+{this.state.callingCodeTenant}</Text></View>

                            <View style={{ flex: 0.85 }}>
                                <TextField
                                    label='Mobile Number'
                                    fontSize={12}
                                    labelHeight={10}
                                    characterRestriction={10}
                                    activeLineWidth={0.5}
                                    keyboardType='numeric'
                                    maxLength={10}
                                    onChangeText={this.handlePhonenumber}
                                />

                            </View>
                        </View>
          {/* <View style={styles.input1}>
            <Image source={require('../pages/assets/images/envelope.png')}
              style={styles.imagee} />
            <TextInput style={styles.text}
              underlineColorAndroid="transparent"
              placeholder="Tenant Email ID"
              placeholderTextColor="#828282"
              autoCapitalize="none"
              onChangeText={this.TenantMail} />
          </View> */}
          <TextField
                label="Tenant Email ID"
                autoCapitalize='words'
                labelHeight={15}
                maxLength={50}
                characterRestriction={50}
                activeLineWidth={0.5}
           
                fontSize={15}
                onChangeText={this.TenantMail}
              />
                         </View>}

          <View style={{ flex: 1, flexDirection: 'row', marginBottom: 3 }}>
            {/* <TouchableOpacity style={{
              flex: 1, backgroundColor: 'white',
              padding: 5, borderColor: 'orange', marginLeft: 5,
              marginRight: 5, marginTop: 5, borderRadius: 2, borderWidth: 1, flex: 1
            }}
              onPress={this.reset}>
              <Text style={styles.submitButtonText}> Reset </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={[styles.rectangle,{marginBottom:65}]}
              onPress={this.mobilevalidate.bind(this)}>
              <Text style={styles.submitButtonText}> Submit </Text>
            </TouchableOpacity>
          </View>

          {/* <TouchableOpacity
    style = {styles.rectangle}
    onPress={this.mobilevalidate.bind(this,this.state.Assocation_name)}>
    <Text style = {styles.submitButtonText}> Ok </Text>
 </TouchableOpacity> */}

        </ScrollView>
      </View>
    );
  }

}


const styles = StyleSheet.create({
  container: { paddingTop: 5, backgroundColor: '#FFFEFE' },
  input: { margin: 5, height: 40, borderColor: '#F2F2F2', borderWidth: 1 },
  input1: {
    marginLeft: 5, marginRight: 5, marginTop: 5, height: 40, borderColor: '#F2F2F2',
    backgroundColor: '#F2F2F2', borderWidth: 1.5, borderRadius: 2, flexDirection: 'row',
  },
  input11: {
    marginLeft: 5, marginRight: 15, marginTop: 5, marginBottom: 5, flex: 1, width: '65%',
    height: 40, borderColor: '#F2F2F2', backgroundColor: '#F2F2F2', borderWidth: 1.5, borderRadius: 2,
  },
  whatisthenameofyourassoc1: {
     color: '#000', marginTop: 10, fontFamily: Fonts.Tahoma, fontSize: 13, flex: 1
  },
  submitButton: { backgroundColor: '#7a42f4', padding: 10, margin: 15, height: 40, },
  submitButtonText: { color: '#FA9917', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
  imagee: { height: 14, width: 14, margin: 10, },
  text: { fontSize: 13, color: 'black', justifyContent: 'center', },
  datePickerBox: {
    marginLeft: 5, marginRight: 15, marginTop: 5, marginBottom: 5, borderColor: '#ABABAB', borderWidth: 0.5, padding: 0, flex: 1,
    borderTopLeftRadius: 4, borderTopRightRadius: 4, borderBottomLeftRadius: 4, borderBottomRightRadius: 4,
    height: 38, justifyContent: 'center'
  },
  datePickerText: { fontSize: 14, margin: 5, padding: 5, borderWidth: 0, color: '#121212', },
  rectangle: {
    flex: 1, backgroundColor: 'white', padding: 10, borderColor: 'orange',
    marginLeft: 5, marginRight: 5, marginTop: 5, borderRadius: 2, borderWidth: 1,
  },
})
