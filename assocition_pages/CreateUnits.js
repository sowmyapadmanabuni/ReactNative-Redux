import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Button,
  Picker,
  View,
  Text,
  Image,
  BackHandler,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList
} from "react-native";
import { DatePickerDialog } from "react-native-datepicker-dialog";
import { Dropdown } from "react-native-material-dropdown";
//import Orientation from 'react-native-orientation';
import PhoneInput from "react-native-phone-input";
//import { Fonts } from '../pages/src/utils/Fonts';
import moment from "moment";
import { openDatabase } from "react-native-sqlite-storage";
import { TextField } from "react-native-material-textfield";
import { connect } from "react-redux";

import CountryPicker, {
  getAllCountries
} from "react-native-country-picker-modal";

//const initial = Orientation.getInitialOrientation();
var date = new Date().getDate();
var month = new Date().getMonth() + 1;
var year = new Date().getFullYear();

class CreateUnitsPotrait extends Component {
  constructor() {
    super();
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      Unit_Name: "",
      Mail: "",
      TenantMail: "",
      UnitParkingLot: "",
      Manager_Name: "",
      Referal_Code: "",
      PickerValueHolder: "",
      UnitType: "",
      ownstatus: "",
      seleRate: "",
      UnitID: "",
      First_Name: "",
      LastName: "",
      Tenant_First_Name: "",
      TenantLastName: "",
      MobileNumber: "",
      TenantMobileNumber: "",
      AltEmailID: "",
      AltMobNo: "",
      SelectRate: "",
      Ownership_status: "",
      Occupency_Status: "",
      RateType: "",
      Dimension_d: "",
      Opening_Due_bal: "",
      isLoading: true,
      dobText: year + "-" + month + "-" + date,
      dobDate: null,
      imageLoading: true,
      chosenDate: new Date(),
      iso2: "in",
      cca2: "IN",
      cca21: "IN",
      callingCode: "91",
      callingCodeTenant: "91",
      dataSourceGuardPkr: [],
      PickerValueHolderguard: ""
    };
    db.transaction(tx => {
      tx.executeSql(
        "SELECT Distinct BlockID,BlockName FROM Blocks where AssnID=" +
          this.props.SelectedAssociationID,
        [],
        (tx, results) => {
          console.log("Results", results.rowsAffected);
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
            console.log(
              "Guards name",
              results.rows.item(i).BlockName + results.rows.item(i).BlockID
            );
          }

          this.setState({
            dataSourceGuardPkr: temp
          });
        }
      );
    });
    this.setDate = this.setDate.bind(this);
    this.onDateChange = this.onDateChange.bind(this);

    this.setState({ Unit_Name: "" });
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
  };
  onDOBDatePicked = date => {
    this.setState({
      dobDate: date,
      dobText: moment(date).format("YYYY-MM-DD")
    });
    //this.makeRemoteRequest();
    console.log(
      "CreateUnitsPotrait ",
      date + " " + this.state.dobDate + " " + this.state.dobText
    );
  };
  onDateChange(date) {
    this.setState({
      selectedStartDate: date
    });
    //this.makeRemoteRequest();
  }
  setDate(newDate) {
    this.setState({ chosenDate: newDate });
    // this.makeRemoteRequest();
  }

  Flat = Flat_no => {
    this.setState({ Unit_Name: Flat_no });
  };
  firstname = f_n => {
    this.setState({ First_Name: f_n });
  };
  lastname = l_n => {
    this.setState({ LastName: l_n });
  };
  tenantfirstname = f_n => {
    this.setState({ Tenant_First_Name: f_n });
  };
  tenantlastname = l_n => {
    this.setState({ TenantLastName: l_n });
  };
  mob = mobile => {
    this.setState({ MobileNumber: mobile });
  };
  tenant_mob = mobile => {
    this.setState({ TenantMobileNumber: mobile });
  };

  Unit_type = u_t => {
    this.setState({ Unit_type: u_t });
  };
  Mail = email => {
    this.setState({ Mail: email });
  };
  TenantMail = email => {
    this.setState({ TenantMail: email });
  };
  unitParkgLot = upl => {
    this.setState({ UnitParkingLot: upl });
  };
  altemail = a_e_id => {
    this.setState({ AltEmailID: a_e_id });
  };
  AltMobl = a_m_no => {
    this.setState({ AltMobNo: a_m_no });
  };
  Select_Rate = mselect => {
    this.setState({ SelectRate: mselect });
  };
  handleOccStatus = mocc_status => {
    this.setState({ Occupency_Status: mocc_status });
  };
  ownstatus = mown_statys => {
    this.setState({ Ownership_status: mown_statys });
  };
  dimension = mdim => {
    this.setState({ Dimension_d: mdim });
  };
  due_bal = mdue_bal => {
    this.setState({ Opening_Due_bal: mdue_bal });
  };
  reset = () => {
    console.log("ho", "hii");
    this.setState({ Manager_Name: "" });
  };

  handleRateType = relation => {
    this.setState({ RateType: relation });
  };

  handleUnitType = relation => {
    this.setState({ UnitType: relation });
  };
  handlePhonenumberOwner = mobilenumber => {
    this.setState({ MobileNumber: mobilenumber });
  };
  handlePhonenumberTenant = mobilenumber => {
    this.setState({ TenantMobileNumber: mobilenumber });
  };
  onAssnPickerValueChange = (value, index) => {
    BlockID = value;
    console.log("Results dataSourceUnitPkr UnitID", BlockID + " " + value);

    this.setState({
      PickerValueHolderguard: value
    });
  };
  componentWillMount() {
    
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    
  }

  componentDidMount() {
    
  }

  _orientationDidChange = orientation => {
    // if (orientation === 'LANDSCAPE') {
    //   Orientation.lockToLandscape();
    //   alert('landscape');
    // } else {
    //   Orientation.lockToLandscape();
    //   console.log('port' ,'jhjkjh',)
    //   alert('else land');
    //   // do something with portrait layout
    // }
  };

  componentWillUnmount() {
    // Orientation.unlockAllOrientations();
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );

    /* Orientation.getOrientation((err, orientation) => {
      //  alert('close land');
      console.log(`Current Device Orientation: ${orientation}`);
    });

    // Remember to remove listener
    Orientation.removeOrientationListener(this._orientationDidChange); */
  }

  mobilevalidate = unitName => {
    const { params } = this.props.navigation.state;
    console.log("createunitportrait start ", params.id + " " + unitName + " ");
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
      Alert.alert("Enter Flat Number");
    }
    
    else if (nunitType == "") {
      Alert.alert("Select Unit Type");
    } else if (mocc_sts == "") {
      Alert.alert("Select Occupancy Status");
    } else {

    
      anu = {
        ASAssnID: this.props.SelectedAssociationID,
        AcAccntID: this.props.MyAccountID,
        units: [
          {
            UNUniName: nFalt,
            UNUniType: nunitType,
            UNOpenBal: opn_due_bal,
            UNCurrBal: "25.12",
            UNOcStat: mocc_sts,
            UNOcSDate: this.state.dobText,
            UNOwnStat: mown_sts,
            UNSldDate: "2018-02-02",
            UNDimens: dimens,
            UNCalType: rateType,
            FLFloorID: 1,
            BLBlockID: this.state.PickerValueHolderguard,
            Owner: {
              UOFName: nfirst_name,
              UOLName: nlast_name,
              UOMobile: nmob,
              UOISDCode: "+" + this.state.callingCode,
              UOMobile1: "",
              UOMobile2: "",
              UOMobile3: "",
              UOMobile4: "",
              UOEmail: nemail,
              UOEmail1: "",
              UOEmail2: "",
              UOEmail3: "",
              UOEmail4: "",
              UOCDAmnt: "12.36",
              ASAssnID: this.props.SelectedAssociationID
            },
            Tenant: {
              UTFName: tenantfirst_name,
              UTLName: tenantlast_name,
              UTMobile: tenant_nmob,
              UTMobile1: "",
              UTEmail: tenantnemail,
              UTEmail1: ""
            },
            unitbankaccount: {
              UBName: "",
              UBIFSC: "",
              UBActNo: "",
              UBActType: "",
              UBActBal: 12.3,
              BLBlockID: this.state.PickerValueHolderguard
            },
            UnitParkingLot: [
              {
                UPLNum: this.state.UnitParkingLot,
                MEMemID: this.props.MyOYEMemberID,
                UPGPSPnt: ""
              }
            ]
          }
        ]
      };

      console.log("anu", anu);
      fetch(this.props.champBaseURL + "unit/create", {
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
            // Alert.alert('sent suceefully ');
            if (nmob == this.props.MyMobileNumber) {
              this.props.navigation.navigate("SelectMyRoleScreen");
              Alert.alert("Unit Created Successfully");
            } else {
              this.props.navigation.navigate("BlockWiseUnitListScreen");
              Alert.alert("Unit Created Successfully");
            }
          } else {
            console.log("hiii", "failed");

            if (nmob == this.props.MyMobileNumber) {
              this.props.navigation.navigate("SelectMyRoleScreen");
            } else {
              this.props.navigation.navigate("ResDashBoard");
            }
          }
          console.log("suvarna", "hi");
        })
        .catch(error => {
          console.error(error);
          Alert.alert("caught error in sending otp");
        });
    }
  };

  renderSeparator = () => {
    return (
      <View style={{ height: 2, width: "100%", backgroundColor: "#fff" }} />
    );
  };

  handleBackButtonClick() {
    db.transaction(txMyMem => {
      txMyMem.executeSql(
        "SELECT * FROM MyMembership",
        [],
        (txMyMem, resultsMyMem) => {
          console.log(
            "CreateAssociation Results MyMembership ",
            resultsMyMem.rows.length + " "
          );
          
          if (resultsMyMem.rows.length > 0) {
            this.props.navigation.navigate("ResDashBoard");
          } else {
            this.props.navigation.navigate("AssnListScreen");
          }
        }
      );
    });

    return true;
  }

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    let dpOccupancyStatus = [
      { value: "Sold Vacant" },
      { value: "Sold Owner Occupied" },
      { value: "Sold Tenant Occupied" },
      { value: "Unsold Vacant" },
      { value: "Unsold Owner Occupied" }
    ];

    let dpUnitType = [
      { value: "Vacant Plot" },
      { value: "Flat" },
      { value: "Villa" }
    ];

    let dpRateType = [
      { value: "Flat Rate Value" },
      { value: "Dimension Based" }
    ];

    let dpVehType = [
      { value: "Two Wheeler" },
      { value: "Three Wheeler" },
      { value: "Four Wheeler" }
    ];

    return (
      <View style={styles.container}>
        <View>
          <View
            style={{
              paddingTop: 2,
              paddingRight: 2,
              paddingLeft: 2,
              flexDirection: "row",
              paddingBottom: 2,
              borderColor: "white",
              borderRadius: 0,
              borderWidth: 2,
              textAlign: "center",
              marginTop: 45
            }}
          >
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}
              style={{ flex: 1 }}>
              <Image source={require('../pages/assets/images/back.png')}
                style={{ height: 25, width: 25, marginTop:'8%', justifyContent:'center',alignItems:'center' }} />
            </TouchableOpacity>
            <Text
              style={{
                flex: 2,
                paddingLeft: 5,
                fontSize: 14,
                color: "black",
                alignContent: "flex-start",
                alignSelf: "center"
              }}
            >
              {" "}
            </Text>
            <View style={{ flex: 3, alignSelf: "center" }}>
              <Image
                source={require("../pages/assets/images/OyeSpace_hor.png")}
                style={{
                  height: 38,
                  width: 95,
                  margin: 5,
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              />
            </View>
            <View
              style={{
                flex: 3,
                alignSelf: "flex-end",
                alignItems: "flex-end",
                justifyContent: "flex-end"
              }}
            />
          </View>
          <View
            style={{
              backgroundColor: "lightgrey",
              flexDirection: "row",
              width: "100%",
              height: 1
            }}
          />
          <Text
            style={{
              fontSize: 16,
              color: "black",
              fontWeight: "bold",
              justifyContent: "center",
              alignContent: "center",
              marginBottom: 10
            }}
          >
            {" "}
            Create Unit
          </Text>

          
        </View>
        <ScrollView
          style={{ height: "90%", paddingLeft: 20, paddingRight: 20 }}
        >
          <Text style={{ color: "orange", fontSize: 16 }}>
            Unit Information
          </Text>
          
          <TextField
            label="Flat Number / Door Number (eg:B007 )"
            autoCapitalize="sentences"
            labelHeight={15}
            maxLength={50}
            characterRestriction={50}
            activeLineWidth={0.5}
            fontSize={15}
            onChangeText={this.Flat}
          />
          
          <View style={{ flex: 2, flexDirection: "row" }}>
            <View style={{ flex: 1, paddingRight: 5 }}>
              <Dropdown
                label="Select Unit Type"
                data={dpUnitType}
                onChangeText={this.handleUnitType}
              />
            </View>
            
          </View>
          <View style={{ flex: 1 }}>
            <Dropdown
              label="Select Occupancy Status"
              data={dpOccupancyStatus}
              onChangeText={this.handleOccStatus}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Picker
              fontSize={12}
              selectedValue={this.state.PickerValueHolderguard}
              onValueChange={this.onAssnPickerValueChange}
            >
              <Picker.Item label="Choose Block Name" value="0" />
              {this.state.dataSourceGuardPkr.map((item, key) => (
                <Picker.Item
                  label={item.BlockName}
                  value={item.BlockID}
                  key={key}
                />
              ))}
            </Picker>
          </View>
          <TextField
            label="Parking Slot Number"
            labelHeight={15}
            maxLength={10}
            characterRestriction={10}
            activeLineWidth={0.5}
            fontSize={15}
            onChangeText={this.unitParkgLot}
          />

          <View style={{ flex: 1, flexDirection: "row", marginBottom: 3 }}>
            <TouchableOpacity
              style={styles.rectangle}
              onPress={this.mobilevalidate.bind(this)}
            >
              <Text style={styles.submitButtonText}> Submit </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    champBaseURL: state.OyespaceReducer.champBaseURL,
    SelectedAssociationID: state.UserReducer.SelectedAssociationID,
    MyAccountID: state.UserReducer.MyAccountID,
    MyOYEMemberID: state.UserReducer.MyOYEMemberID,
    MyMobileNumber: state.UserReducer.MyMobileNumber,
    oyeMobileRegex: state.OyespaceReducer.oyeMobileRegex
  };
};

export default connect(mapStateToProps)(CreateUnitsPotrait);

const styles = StyleSheet.create({
  container: { paddingTop: 5, backgroundColor: "#FFFEFE" },
  input: { margin: 5, height: 40, borderColor: "#F2F2F2", borderWidth: 1 },
  input1: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    height: 40,
    borderColor: "#F2F2F2",
    backgroundColor: "#F2F2F2",
    borderWidth: 1.5,
    borderRadius: 2,
    flexDirection: "row"
  },
  input11: {
    marginLeft: 5,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
    flex: 1,
    width: "65%",
    height: 40,
    borderColor: "#F2F2F2",
    backgroundColor: "#F2F2F2",
    borderWidth: 1.5,
    borderRadius: 2
  },
  whatisthenameofyourassoc1: {
    color: "#000",
    marginTop: 10,
    fontSize: 13,
    flex: 1
  },
  submitButton: {
    backgroundColor: "#7a42f4",
    padding: 10,
    margin: 15,
    height: 40
  },
  submitButtonText: {
    color: "#FA9917",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  imagee: { height: 14, width: 14, margin: 10 },
  text: { fontSize: 13, color: "black", justifyContent: "center" },
  datePickerBox: {
    marginLeft: 5,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
    borderColor: "#ABABAB",
    borderWidth: 0.5,
    padding: 0,
    flex: 1,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 38,
    justifyContent: "center"
  },
  datePickerText: {
    fontSize: 14,
    margin: 5,
    padding: 5,
    borderWidth: 0,
    color: "#121212"
  },
  rectangle: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    borderColor: "orange",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    borderRadius: 2,
    borderWidth: 1,
    marginBottom: 50
  }
});
