import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ImageBackground,
  Icon,
  Alert,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import {
  Form,
  Item,
  Input,
  Label,
  Button,
  Card,
  CardItem,
  Picker
} from "native-base";
import { Dropdown } from "react-native-material-dropdown";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BorderlessButton } from "react-native-gesture-handler";
import { BottomTabBar } from "react-navigation";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cell
} from "react-native-table-component";
import { DatePickerDialog } from "react-native-datepicker-dialog";
import moment from "moment";
import VehicleRow from "./VehicleRow.js";
import { initializeRegistryWithDefinitions } from "react-native-animatable";
import _ from "lodash";
import {connect} from 'react-redux';
import RNRestart from "react-native-restart";
var index1=60;
let Unit_Type = [
  {
    value: "Vacant Plot"
  },
  {
    value: "Flat"
  },
  {
    value: "Villa"
  }
];
let Occupancy_Status = [
  {
    value: "Sold Owner Occupied Unit",
    id: 1 // Show Only Owner Details//own
  },
  {
    value: "Sold Tenant Occupied Unit",
    id: 2 // Owner and Tenant Details tent
  },
  {
    value: "Sold Vacant Unit",
    id: 3 // Owner Details
  },
  {
    value: "Unsold Vacant Unit", 
    id: 4 // Only Tenant Details
  },
  {
    value: "Unsold Tenant Occupied Unit",
    id: 5 // Only Tenant Details
  }
];
let Calculation_Type = [
  {
    value: "Flat Rate Value"
  },
  {
    value: "Dimension Based"
  }
];
let select_block = [
  {
    value: "block1"
  },
  {
    value: "block2"
  }
];

class AddUnit extends Component {
  static navigationOptions = {
    title: "Add Unit",
    header: null
  };
  constructor(props) {
    
    super(props);
    this.state = {
      tableHead: ["Parking Lot No. ", "Vehicle No.", "Remove"],
      Vehicleno: [],
      parkinglot: [],
      tableData: [],
      isModalVisible: false,
      selectblock: "",
      UnitNumber: "",
      UnitType: "",
      UnitDimention: "",
      UnitRate: "",
      CalculationType: "",
      OccupancyStatus: "",
      parkingLotno: "",
      VehicleNo: "",
      //date picker
      dobText: moment(new Date()).format("YYYY-MM-DD"), //year + '-' + month + '-' + date,
      dobDate: "",
      dobText1: moment(new Date()).format("YYYY-MM-DD"), //year + '-' + month + '-' + date,
      dobDate1: "",
      
      Unitofname: "",
      Unitolname: "",
      Unitomnum: "",
      UnitoAnum: "",
      Unitoeid: "",
      Unitoaeid: "",
      Unittfname: "",
      Unittlname: "",
      Unittmnum: "",
      Unitteid: ""
    };
  }

  removeVehicle = index => {
    index1=index1-30;
    let tableData = this.state.tableData;
    tableData.splice(index, 1);
    this.setState({ tableData: tableData });
    // console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKK",tableData);
  };
  //Date Picker
  onDOBPress = () => {
    let dobDate = this.state.dobDate;
    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        dobDate: dobDate
      });
    }
    this.refs.dobDialog.open({
      date: dobDate,
      // maxDate: new Date() //To restirct past dates
    });
  };

  onDOBDatePicked = date => {
    this.setState({
      dobDate: date,
      dobText: moment(date).format("YYYY-MM-DD")
    });
  };
///////////////////////////////
  onDOBPress1 = () => {
    let dobDate = this.state.dobDate1;
    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        dobDate1: dobDate
      });
    }
    this.refs.dobDialog1.open({
      date: dobDate,
      // maxDate: new Date() //To restirct past dates
    });
  };

  onDOBDatePicked1 = date => {
    this.setState({
      dobDate1: date,
      dobText1: moment(date).format("YYYY-MM-DD")
    });
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  validateUnsold = () => {
    let Unittfname1 = this.state.Unittfname;
    let Unittlname1 = this.state.Unittlname;
    let Unittmnum1 = this.state.Unittmnum;
    let Unitteid1 = this.state.Unitteid;
    let mobRegex = /^[0]?[456789]d{9}$/;
    let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let regTextOnly = /^[a-zA-Z ]+$/
    let status = false;

    if (Unittfname1.length == 0) {
      Alert.alert("Tenant first Cannot be Empty");
      return;
    }else if (regTextOnly.test(Unittfname1) == false) {
      Alert.alert("Tenant first name should contain characters");
      return;
    } else if (Unittlname1.length == 0) {
      Alert.alert("Tenant Last name Cannot be Empty");
      return;
    }else if (regTextOnly.test(Unittlname1)== false) {
      Alert.alert("Tenant Last name should contain characters");
      return;
    }else if(Unittmnum1.length < 10){
      Alert.alert("Enter Tenant Mobile Number");
    } 
    else if (mobRegex.test(Unittmnum1) == true) {
      Alert.alert("Please check Tenant Mobile Number");
      return;
    } else if (Unitteid1.length == 0 ) {
      Alert.alert("Please Enter Tenant Email");
      return;
    } else if (regemail.test(Unitteid1)== false ) {
      Alert.alert("Please Check Tenant Email");
      return;
    }
    
    else {
      this.createUnit();
      return;
      // Alert.alert("Something went wrong");
    }

    return;
  };

  validateOwner = () => {
    let Unitofname1 = this.state.Unitofname;
    let Unitolname1 = this.state.Unitolname;
    let Unitomnum1 = this.state.Unitomnum;
    let Unitoeid1 = this.state.Unitoeid;
    let Unitoaeid1 = this.state.Unitoaeid;
    let UnitoAnum1 =this.state.UnitoAnum;
    let mobRegex = /^[0]?[456789]d{9}$/;
    let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let status = false;
    let regTextOnly = /^[a-zA-Z ]+$/

    if (Unitofname1.length == 0) {
      Alert.alert("Owner first Name Cannot be Empty");
      return;
    } else if (regTextOnly.test(Unitofname1) == false) {
      Alert.alert("Owner first name should contain characters ");
      return;
    } else if (Unitolname1.length == 0) {
      Alert.alert("Owner Last Name Cannot be Empty");
      return;
    }else if (regTextOnly.test(Unitolname1)== false) {
      Alert.alert("Owner Last Nname should contain characters");
      return;
    }else if (Unitomnum1.length == 0) {
      Alert.alert("Enter Owner Mobile Number");
      return;
    } else if (Unitomnum1.length < 10) {
      Alert.alert("Please Enter Valid Owner Mobile Number");
      return;
    }else if (mobRegex.test(Unitomnum1) == true) {
      Alert.alert("Please check  Mobile Number");
      return;
    }else if ( !UnitoAnum1.length == "" && UnitoAnum1.length < 10){
      Alert.alert(" Please Enter Valid Alternate Mobile Number ");
      return;
    } else if ( !UnitoAnum1.length == "" && mobRegex.test(UnitoAnum1) == true){
      Alert.alert(" Please Enter Valid Alternate Mobile Number ");
      return;
    }else if (!UnitoAnum1.length == "" && Unitomnum1 == UnitoAnum1 ){
      Alert.alert(" Mobile Number Should not be Same");
      return;
    }else if (Unitoeid1.length == 0 ) {
      Alert.alert("Please Enter Owner Email ID");
      return;
    }else if (regemail.test(Unitoeid1)== false ) {
      Alert.alert("Please Enter Valid Owner Email ID");
      return;
    } else if (!Unitoaeid1.length == "" && Unitoaeid1 === Unitoeid1){
      Alert.alert(" Email ID Should not be Same ");
      return;
    } else if ( !Unitoaeid1.length == "" && regemail.test(Unitoaeid1) == false){
      Alert.alert(" Please Enter Valid Alternate Email ID ");
      return;
    }
    
    else {
      this.createUnit();
      return;
      // Alert.alert("Something went wrong");
    }

    return;
  };

  createUnit = () => {
    console.log("bhaiiiiiiiiiiii",this.state.dobDate)
    console.log("$$$$$$$$$$$4",this.state.dobText)
    UnitNum1 = this.state.UnitNumber;
    UnitType1 = this.state.UnitType;
    UnitRate1 = this.state.UnitRate;
    CalculationType1 = this.state.CalculationType;
    OccupancyStatus1 = this.state.OccupancyStatus;
    parkingLotno1 = this.state.parkingLotno;
    VehicleNo1 = this.state.VehicleNo;
    UnitDimention1 = this.state.UnitDimention;
    selectblock1 = this.state.selectblock;

    Unitofname1 = this.state.Unitofname;
    Unitolname1 = this.state.Unitolname;
    Unitomnum1 = this.state.Unitomnum;
    UnitoAnu1 = this.state.UnitoAnum;
    Unitoeid1 = this.state.Unitoeid;
    Unitoaeid1 = this.state.Unitoaeid;
    Unittfname1 = this.state.Unittfname;
    Unittlname1 = this.state.Unittlname;
    Unittmnum1 = this.state.Unittmnum;
    Unitteid1 = this.state.Unitteid;
    date1 = this.state.dobText;
    date2 = this.state.dobText1;
    mobile =""
    if(OccupancyStatus1 === "Unsold Vacant Unit" || OccupancyStatus1 === "Unsold Tenant Occupied Unit"  )
    {
      mobile=""
    }
    else {
      mobile="+91"
    }
    if(OccupancyStatus1 === "Unsold Vacant Unit" )
    {
      mobile1=""
    }
    else{
      mobile1="+91"
    }

    vehicle = [];
    for (var i = 0; i < this.state.tableData.length; i++) {
      vehicle.push({ parkinglot: this.state.tableData[i] });
    }
 
    let finalData;
    let unitParkingLot = [];
    let p;
    let tableData = this.state.tableData;

    tableData.map((data, index) => {
      data.map((data_2, index_2) => {
        if (index_2 === 0) {
          p = { UPLNum: data_2 };
        }

        finalData = {
          ...p,
          MEMemID: "",
          UPGPSPnt: ""
        };

        unitParkingLot.push({ ...finalData });
      });
    });

    let uniqData = _.uniqBy(unitParkingLot, "UPLNum");
    // console.log(unitParkingLot);
    // console.log(uniqData);
    const {
        unit
      } = this.props.navigation.state.params

      // console.log('123812638961289368912638912693',unit)
    fetch(`http://${this.props.oyeURL}/oyeliving/api/v1/unit/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
      },
      body: JSON.stringify({
        ASAssnID:this.props.SelectedAssociationID,
        ACAccntID: this.props.MyAccountID,
        units: [
          {
            UNUniName: UnitNum1,
            UNUniType: UnitType1,
            UNOcStat: OccupancyStatus1,
            UNOcSDate: date2,
            UNOwnStat: "Sold",
            UNSldDate: this.state.dobText,
            UNDimens: UnitDimention1,
            UNRate: UnitRate1,
            UNCalType: CalculationType1,
            FLFloorID: 14,
            BLBlockID: unit,
            Owner: [
              {
                UOFName: Unitofname1,
                UOLName: Unitolname1,
                UOMobile: Unitomnum1,
                UOISDCode: mobile,
                UOMobile1: UnitoAnu1,
                UOMobile2: "",
                UOMobile3: "",
                UOMobile4: "",
                UOEmail: Unitoeid1,
                UOEmail1: Unitoaeid1,
                UOEmail2: "",
                UOEmail3: "",
                UOEmail4: "",
                UOCDAmnt: ""
              }
            ],

            Tenant: [
              {
                UTFName: Unittfname1,
                UTLName: Unittlname1,
                UTMobile: Unittmnum1,
                UTISDCode: mobile1,
                UTMobile1: "",
                UTEmail: Unitteid1,
                UTEmail1: ""
              }
            ],
            unitbankaccount: {
              UBName: "SBI",
              UBIFSC: "SBIN000014",
              UBActNo: "SBI23ejnhgf43434",
              UBActType: "Savings",
              UBActBal: 12.3,
              BLBlockID: unit
            },

            UnitParkingLot: uniqData
          }
        ]
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("unit added ###############", responseJson);
        Alert.alert(
          "",
          "Unit Created Successfully",
          [
            {
              text: "Ok",
              onPress: ()=>
                RNRestart.Restart()  
            }
          ],
          { cancelable: false }
        );
        // this.props.navigation.goBack();
      })

      .catch(error => {
        console.log("ashdjkhasjkhjaksbcjaksbkjdasd", error);
        alert("Unit not created. Please check internet connection.");
      });
  };

  validateSold = () => {
    let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let regTextOnly = /^[a-zA-Z ]+$/
    let mobRegex = /^[0]?[456789]d{9}$/;

    let Unitofname1 = this.state.Unitofname;
    let Unitolname1 = this.state.Unitolname;
    let Unitomnum1 = this.state.Unitomnum;
    let Unitoeid1 = this.state.Unitoeid;
    let Unittfname1 = this.state.Unittfname;
    let Unittlname1 = this.state.Unittlname;
    let Unittmnum1 = this.state.Unittmnum;
    let Unitteid1 = this.state.Unitteid;
    let Unitoaeid1 = this.state.Unitoaeid;
    let UnitoAnum1 =this.state.UnitoAnum;

    if (Unitofname1.length === 0) {
      Alert.alert("Owner first Name Cannot be Empty");
    } else if (regTextOnly.test(Unitofname1) === false) {
      Alert.alert("Owner first Name should contain characters");
    } else if (Unitolname1.length === 0) {
      Alert.alert("Owner Last Name Cannot be Empty");
    } else if (regTextOnly.test(Unitolname1) === false) {
      Alert.alert("Owner Last Name should contain characters");
    } else if (Unitomnum1.length < 10) {
      Alert.alert("Please Enter Mobile Number");
    } else if (mobRegex.test(Unitomnum1)== true) {
      Alert.alert("Please check Mobile Number");
    }else if ( !UnitoAnum1.length == "" && mobRegex.test(UnitoAnum1) == true){
      Alert.alert(" Please Enter Valid Alternate Mobile Number ");
      return;
    }else if (!UnitoAnum1.length == "" && Unitomnum1 == UnitoAnum1 ){
      Alert.alert(" Mobile Number Should not be Same");
      return;
    }else if (Unitoeid1.length == 0 ) {
      Alert.alert("Please Enter Owner Email ID");
      return;
    }else if (regemail.test(Unitoeid1)== false ) {
      Alert.alert("Please Enter Valid Owner Email ID");
      return;
    } else if (!Unitoaeid1.length == "" && Unitoaeid1 === Unitoeid1){
      Alert.alert(" Email ID Should not be Same ");
      return;
    } else if ( !Unitoaeid1.length == "" && regemail.test(Unitoaeid1) == false){
      Alert.alert(" Please Enter Valid Owner Alternate Email ID ");
      return;
    }else if (Unittfname1.length === 0) {
      Alert.alert("Tenant first Name Cannot be Empty");
    } else if (regTextOnly.test(Unittfname1) === false) {
      Alert.alert("Tenant first Name should contain characters");
    } else if (Unittlname1.length === 0) {
      Alert.alert("Tenant Last Name Cannot be Empty");
    }else if (regTextOnly.test(Unittlname1) === false) {
      Alert.alert("Tenant Last Name should contain characters");
    }  else if (Unittmnum1.length < 10) {
      Alert.alert("Please check Tenant Mobile Number");
    }else if ((Unittmnum1) === Unitomnum1 ) {
      Alert.alert("Owner & Tenant Mobile Number should not be same");
    }else if (Unittmnum1 ===  UnitoAnum1) {
      Alert.alert("Owner & Tenant Mobile Number should not be same");
    } else if (Unitteid1.length === 0) {
      Alert.alert("Enter  Tenant Email ID");
    }else if ((Unitteid1)=== Unitoeid1 ) {
      Alert.alert("Owner & Tenant Email ID should not be same");
    }else if ((Unitteid1)=== Unitoaeid1) {
      Alert.alert("Owner & Tenant Email ID should not be same");
    } else if (regemail.test(Unitteid1) === false) {
      Alert.alert("Enter Valid Tenant Email ID");
    }
    else {
      this.createUnit();
    }
  };

  createUnitPostData = () => {
    UnitNum1 = this.state.UnitNumber;
    UnitType1 = this.state.UnitType;
    UnitRate1 = this.state.UnitRate;
    CalculationType1 = this.state.CalculationType;
    OccupancyStatus1 = this.state.OccupancyStatus;
    parkingLotno1 = this.state.parkingLotno;
    VehicleNo1 = this.state.VehicleNo;
    UnitDimention1 = this.state.UnitDimention;
    selectblock1 = this.state.selectblock;

    Unitofname1 = this.state.Unitofname;
    Unitolname1 = this.state.Unitolname;
    Unitomnum1 = this.state.Unitomnum;
    UnitoAnu1 = this.state.UnitoAnum;
    Unitoeid1 = this.state.Unitoeid;
    Unitoaeid1 = this.state.Unitoaeid;
    Unittfname1 = this.state.Unittfname;
    Unittlname1 = this.state.Unittlname;
    Unittmnum1 = this.state.Unittmnum;
    Unitteid1 = this.state.Unitteid;
    date1 = this.state.dobDate;
    date2 = this.state.dobDate1;

    vehicle = [];
    for (var i = 0; i < this.state.tableData.length; i++) {
      vehicle.push({ parkinglot: this.state.tableData[i] });
    }
    // console.log("hhhhhhh", vehicle);

    // const reg = /^[0]?[6789]\d{9}$/
    const regTextOnly = /^[a-zA-Z ]+$/;
    const regPIN = /^[0-9]{1,10}$/;

    let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    let regIFSC = /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/;
    let oyeNonSpecialRegex = /[^0-9A-Za-z ]/;
    let mobRegex = /^[0]?[456789]d{9}$/;

    //let validation = [] ={ UnitNum1,UnitType1,UnitRate1,CalculationType1,OccupancyStatus1,UnitDimention1 }
    // if (selectblock1.length === 0) {
    //   Alert.alert("Select Block ");
    // } 
    if (UnitNum1.length === 0) {
      Alert.alert("Unit Number Cannot be Empty");
    }   
    //else if (selectblock1.length === 0) {
    //   Alert.alert("Select Block ");
    // } 
    else if (OccupancyStatus1.length === 0) {
      Alert.alert("Select Occupancy Status");
    } else if (
      OccupancyStatus1 === "Unsold Tenant Occupied Unit" 
    ) {
      // alert("unSold");
      this.validateUnsold();
      return;
    } else if (OccupancyStatus1 == "Sold Tenant Occupied Unit") {
      // alert("Sold");
      this.validateSold();
      return;
    } else if (
      OccupancyStatus1 == "Sold Owner Occupied Unit" || OccupancyStatus1 =="Sold Vacant Unit"
    )
    {
      this.validateOwner();
      return;
    }
    else if (OccupancyStatus1 == "Unsold Vacant Unit"){
      this.createUnit();
      return;
    }
  };

  _alertIndex(index) {
    Alert.alert(`This is row ${index + 1}`);
  }

  render() {
    // console.log(this.state.tableData)

    const state = this.state;
    const element = (data, index) => (
      <TouchableOpacity onPress={() => this._alertIndex(index)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>button</Text>
        </View>
      </TouchableOpacity>
    );
    const {blockname} = this.props.navigation.state.params; 
    return (
     

      <View style={{ flex: 1 }}>
     
     <SafeAreaView style={{ backgroundColor: "orange" }}>
          <View style={[styles.viewStyle1, { flexDirection: "row" }]}>
            <View style={styles.viewDetails1}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
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
        <View style={styles.textWrapper}>
          <Text style={styles.titleText}>Add Unit</Text>
          <View style={styles.associationDetailsView}>
                <Text style={styles.titleChildText}>{this.props.navigation.state.params.blockname}</Text>
          </View>
          <ScrollView>
            <View style={styles.associationDetailsView}>
              <Text style={styles.titleChildText}>Unit Information</Text>
              <View style={styles.fillAssociationDetailline} />
            </View>
            <Card style={{ height: hp("23%"), marginTop: hp("0") }}>
              <View style={{ flexDirection: "column" }}>
                <View
                  style={{
                    height: hp("10%"),
                    marginTop: hp("1%")
                  }}
                >
                  <Text style={styles.text1}>
                    Unit ID./Flat No./Site No./Door No.
                    <Text style={styles.imp}>*</Text>
                  </Text>
                  <Item style={styles.bankDetailLine}>
                    <Input
                      style={styles.box}
                      placeholder="Unit Number"
                      autoCorrect={false}
                      autoCapitalize='characters'
                      keyboardType="default"
                      onChangeText={UnitNumber =>
                        this.setState({ UnitNumber: UnitNumber })
                      }
                    />
                  </Item>
                </View>
                <View
                  style={{
                    height: hp("10%"),
                    marginTop: hp("1%")
                  }}
                >
                  <View style={{ flex: 1, height: hp("10%") }}>
                    <Text style={styles.text1}>
                      Occupancy Status & Ownership Status
                      <Text style={styles.imp}>*</Text>
                    </Text>
                    <Dropdown
                      containerStyle={[styles.box2]}
                      // ref={this.typographyRef}
                      onChangeText={value =>
                        this.setState({ OccupancyStatus: value })
                      }
                      // label='Select Unit'
                      placeholder={"Select Occupancy Status"}
                      // value={"Occupancy Status"}
                      data={Occupancy_Status}
                      fontSize={hp("1.8%")}
                      labelHeight={hp("0.7%")}
                      labelPadding={hp("0.5%")}
                    />
                  </View>
                </View>
              </View>
            </Card>

            {this.state.OccupancyStatus == "Sold Owner Occupied Unit" ||
            this.state.OccupancyStatus == "Sold Tenant Occupied Unit" ||
            this.state.OccupancyStatus == "Sold Vacant Unit" ? (
              <View>
                <View style={styles.associationDetailsView}>
                  <Text style={styles.titleChildText}>
                    Unit Owner Information
                  </Text>
                  <View style={styles.fillAssociationDetailline} />
                </View>
                <Card
                  style={{
                    height: hp("55%"),
                    marginTop: hp("0")
                  }}
                >
                  
                    {this.state.OccupancyStatus == "Sold Owner Occupied Unit" ? (
              <View style={{ height: hp("10%")}}>
                <View style={{ flexDirection: "column" }}>
                  <View
                    style={{
                      height: hp("7%"),
                      marginTop: hp("1%")
                    }}
                  >
                    <View style={{ height: hp("10%") }}>
                      <Text style={styles.text1}>
                        Unit Owner Occupied Date
                        <Text style={styles.imp}>*</Text>
                      </Text>
                      <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                        <View style={styles.datePickerBox}>
                          <Text style={styles.datePickerText}>
                            {this.state.dobText}{" "}
                          </Text>
                          <DatePickerDialog
                            ref="dobDialog"
                            onDatePicked={this.onDOBDatePicked.bind(this)}
                          />
                          <Image
                            style={styles.viewDatePickerImageStyle}
                            source={require("../icons/calender.png")}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <Text />
            )}
                  <View
                    style={{
                      height: hp("10%"),
                      flexDirection: "row"
                    }}
                  >
                    <View
                      style={{
                        flex: 0.5,
                        height: hp("8.7%"),
                      
                      }}
                    >
                      <Text style={styles.text1}>
                        Owner First Name<Text style={styles.imp}>*</Text>
                      </Text>
                      <Input
                        style={styles.box5}
                        placeholder="First Name"
                        // underlineColorAndroid="orange"
                        autoCorrect={false}
                        autoCapitalize='words'
                        keyboardType="default"
                        onChangeText={Unitofname =>
                          this.setState({
                            Unitofname: Unitofname
                          })
                        }
                      />
                    </View>
                    <View
                      style={{
                        flex: 0.5,
                        height: hp("8.7%"),
                      }}
                    >
                      <Text style={styles.text1}>
                        Owner Last Name<Text style={styles.imp}>*</Text>
                      </Text>
                      <Input
                        style={styles.box5}
                        placeholder="Last Name"
                        // underlineColorAndroid="orange"
                        autoCorrect={false}
                        autoCapitalize='words'
                        keyboardType="default"
                        onChangeText={Unitolname =>
                          this.setState({
                            Unitolname: Unitolname
                          })
                        }
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      height: hp("10%"),
                      flexDirection: "row",
                      marginTop: hp("2%")
                    }}
                  >
                    <View style={{ flex: 0.5, height: hp("8.7%") }}>
                      <Text style={styles.text1}>
                        Owner Mobile Number<Text style={styles.imp}>*</Text>
                      </Text>
                      <Input
                        style={styles.box5}
                        placeholder="Mobile Number"
                        // underlineColorAndroid="orange"
                        autoCorrect={false}
                        autoCapitalize="characters"
                        keyboardType='number-pad'
                        maxLength={10}
                        onChangeText={Unitomnum =>
                          this.setState({ Unitomnum: Unitomnum })
                        }
                      />
                    </View>
                    <View style={{ flex: 0.5, height: hp("8.7%") }}>
                      <Text style={styles.text1}>
                        Alternate Mobile Number
                      </Text>
                      <Input
                        style={styles.box5}
                        placeholder="Mobile Number"
                        // underlineColorAndroid="orange"
                        autoCorrect={false}
                        maxLength={10}
                        autoCapitalize="characters"
                        keyboardType='number-pad'
                        onChangeText={UnitoAnum =>
                          this.setState({ UnitoAnum: UnitoAnum })
                        }
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      height: hp("10%"),
                      marginTop: hp("1%")
                    }}
                  >
                    <Text style={styles.text1}>
                      Owner Email ID<Text style={styles.imp}>*</Text>
                    </Text>
                    <Item style={styles.bankDetailLine}>
                      <Input
                        style={styles.box}
                        placeholder="Email ID"
                        // underlineColorAndroid="orange"
                        autoCorrect={false}
                        autoCapitalize='none'
                        keyboardType="default"
                        onChangeText={Unitoeid =>
                          this.setState({ Unitoeid: Unitoeid })
                        }
                      />
                    </Item>
                  </View>
                  <View
                    style={{
                      height: hp("10%"),
                      marginTop: hp("1%")
                    }}
                  >
                    <Text style={styles.text1}>Owner Alternate Email ID</Text>
                    <Item style={styles.bankDetailLine}>
                      <Input
                        style={styles.box}
                        placeholder="Email ID"
                        // underlineColorAndroid="orange"
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType="default"
                        onChangeText={UnitNumbe =>
                          this.setState({
                            Unitoaeid: UnitNumbe
                          })
                        }
                      />
                    </Item>
                  </View>
                </Card>
              </View>
            ) : (
              <Text />
            )}
            {
            this.state.OccupancyStatus == "Sold Tenant Occupied Unit" ||
            this.state.OccupancyStatus == "Unsold Tenant Occupied Unit" ? (
              <View>
                <View style={styles.associationDetailsView}>
                  <Text style={styles.titleChildText}>
                    Unit Tenant Information
                  </Text>
                  <View style={styles.fillAssociationDetailline} />
                </View>
                <Card
                  style={{
                    height: hp("45%"),
                    marginTop: hp("0")
                  }}
                >
                  {this.state.OccupancyStatus == "Sold Tenant Occupied Unit" ? (
              <View style={{ height: hp("10%"), marginTop: hp("1%") }}>
                <View style={{ flexDirection: "column" }}>
                  <View
                    style={{
                      height: hp("7%"),
                      marginTop: hp("0%")
                    }}
                  >
                    <View style={{ height: hp("10%") }}>
                      <Text style={styles.text1}>
                        Unit Tenant Occupied Date
                        <Text style={styles.imp}>*</Text>
                      </Text>
                      <TouchableOpacity onPress={this.onDOBPress1.bind(this)}>
                        <View style={styles.datePickerBox}>
                          <Text style={styles.datePickerText}>
                            {this.state.dobText1}{" "}
                          </Text>
                          <DatePickerDialog
                            ref="dobDialog1"
                            onDatePicked={this.onDOBDatePicked1.bind(this)}
                          />
                          <Image
                            style={styles.viewDatePickerImageStyle}
                            source={require("../icons/calender.png")}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <Text />
            )}
                  <View
                    style={{
                      height: hp("10%"),
                      flexDirection: "row",
                      // marginTop: hp("2%")
                    }}
                  >
                    <View style={{ flex: 0.5, height: hp("8.7%") }}>
                      <Text style={styles.text1}>
                        Tenant First Name<Text style={styles.imp}>*</Text>
                      </Text>
                      <Input
                        style={styles.box5}
                        placeholder="First Name"
                        // underlineColorAndroid="orange"
                        autoCorrect={false}
                        autoCapitalize='words'
                        keyboardType="default"
                        onChangeText={Unittfname =>
                          this.setState({
                            Unittfname: Unittfname
                          })
                        }
                      />
                    </View>
                    <View style={{ flex: 0.5, height: hp("8.7%") }}>
                      <Text style={styles.text1}>
                        Tenant Last Name<Text style={styles.imp}>*</Text>
                      </Text>
                      <Input
                        style={styles.box5}
                        placeholder="Last Name"
                        // underlineColorAndroid="orange"
                        autoCorrect={false}
                        autoCapitalize='words'
                        keyboardType="default"
                        onChangeText={Unittlname =>
                          this.setState({
                            Unittlname: Unittlname
                          })
                        }
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      height: hp("10%"),
                      marginTop: hp("1%")
                    }}
                  >
                    <Text style={styles.text1}>
                      Tenant Mobile Number<Text style={styles.imp}>*</Text>
                    </Text>
                    <Item style={styles.bankDetailLine}>
                      <Input
                        style={styles.box}
                        placeholder="Mobile Number"
                        // underlineColorAndroid="orange"
                        autoCorrect={false}
                        maxLength={10}
                        keyboardType='number-pad'
                        onChangeText={Unittmnum =>
                          this.setState({ Unittmnum: Unittmnum })
                        }
                      />
                    </Item>
                  </View>
                  <View
                    style={{
                      height: hp("10%"),
                      marginTop: hp("1%")
                    }}
                  >
                    <Text style={styles.text1}>
                      Tenant Email ID<Text style={styles.imp}>*</Text>
                    </Text>
                    <Item style={styles.bankDetailLine}>
                      <Input
                        style={styles.box}
                        placeholder="Email ID"
                        // underlineColorAndroid="orange"
                        autoCorrect={false}
                        autoCapitalize='none'
                        keyboardType="default"
                        onChangeText={Unitteid =>
                          this.setState({ Unitteid: Unitteid })
                        }
                      />
                    </Item>
                  </View>
                </Card>
              </View>
            ) : (
              <Text />
            )}

              <View style={styles.associationDetailsView}>
              <Text style={styles.titleChildText}>Unit Maintenance Details</Text>
              <View style={styles.fillAssociationDetailline} />
            </View>
            <Card style={{ height: hp("23%"), marginTop: hp("0") }}>
              <View style={{ flexDirection: "column" }}>
              <View
                  style={{
                    height: hp("10%"),
                    flexDirection: "row",
                    marginTop: hp("1%")
                  }}
                >
                  <View style={{ flex: 0.5, height: hp("8.7%") }}>
                    <Text style={styles.text1}>
                      Select Unit Type</Text>
                    <Dropdown
                      containerStyle={styles.box2}
                      // ref={this.typographyRef}
                      onChangeText={value =>
                        this.setState({ UnitType: value })
                      }
                      // label='Unit Type'
                      data={Unit_Type}
                      fontSize={hp("1.8%")}
                      placeholder={"Select Unit Type"}
                     
                      labelHeight={hp("0.7%")}
                      labelPadding={hp("0.5%")}
                      labelSize={hp("1%")}
                    />
                  </View>
                  <View style={{ flex: 0.5, height: hp("8.5%") }}>
                    <Text style={styles.text1}>
                      Unit Rate
                    </Text>
                    <Input
                      style={styles.box5}
                      placeholder="Unit Rate"
                      // underlineColorAndroid="orange"
                      autoCorrect={false}
                      keyboardType='number-pad'
                      onChangeText={UnitRate =>
                        this.setState({ UnitRate: UnitRate })
                      }
                    />
                  </View>
                </View>
                <View
                  style={{
                    height: hp("8%"),
                    flexDirection: "row",
                    marginTop: hp("1%")
                  }}
                >
                  <View style={{ flex: 0.5, height: hp("8.7%") }}>
                    <Text style={styles.text1}>
                      Select Maintenance Calculation Type
                    </Text>
                    <Dropdown
                      containerStyle={styles.box2}
                      // ref={}
                      onChangeText={value =>
                        this.setState({ CalculationType: value })
                      }
                      // label='Unit Type'
                      data={Calculation_Type}
                      fontSize={hp("1.8%")}
                      labelHeight={hp("0.8%")}
                      labelPadding={hp("2%")}
                      labelSize={hp("1%")}
                      // value={"Calculation Type"}
                      placeholder={"Select Calculation Type"}
                    />
                  </View>
                  <View style={{ flex: 0.5, height: hp("8.5%") }}>
                    <Text style={styles.text1}>
                      Unit Dimension
                    </Text>
                    <Input
                      style={styles.box5}
                      placeholder="Unit Dimension"
                      // underlineColorAndroid="orange"
                      autoCorrect={false}
                      keyboardType="number-pad"
                      onChangeText={vehName =>
                        this.setState({ UnitDimention: vehName })
                      }
                    />
                  </View>
                </View>


              </View>
              </Card>
            <View style={styles.associationDetailsView}>
              <Text style={styles.titleChildText}>
                Unit Vehicle Information
              </Text>
              <View style={styles.fillAssociationDetailline} />
            </View>
            <View style={{ height:(index1) }}>
              <VehicleRow
                tableData={this.state.tableData}
                removeVehicle={this.removeVehicle}
                tableHead={this.state.tableHead}
              />
            </View>
            
            <View
              style={{
                height: hp("5%"),
                justifyContent: "center",
                alignItems: "flex-end"
              }}
            >
              <View
                style={{
                  height: hp("5%"),
                  width: hp("20%")
                }}
              >
                <TouchableOpacity onPress={() => this.toggleModal()}>
                  <Text
                    style={{
                      fontSize: hp("2.5%"),
                      color: "#00bfff"
                    }}
                  >
                    +Add Vehicle
                  </Text>
                </TouchableOpacity>
              </View>
              <Modal
                style={{
                  alignItems: "center",
                  justifyContent: "center"
                }}
                isVisible={this.state.isModalVisible}
              >
                <View
                  style={{
                    width: wp("70%"),
                    height: hp("40%"),
                    backgroundColor: "#fff"
                  }}
                >
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.titleText}>Add Vehicle</Text>

                    <Item style={[styles.bankDetailLine,marginLeft= hp("2%"),marginRight=hp("2%"),marginBottom=hp("2%")]}>
                      <Input
                        style={styles.box}
                        placeholder="Parking Lot No."
                        // underlineColorAndroid="orange"
                        autoCorrect={false}
                        autoCapitalize="characters"
                        keyboardType="default"
                        onChangeText={tableData1 =>
                          this.setState({
                            parkinglot: tableData1
                          })
                        }
                      />
                    </Item>
                    <Item style={[styles.bankDetailLine,marginLeft= hp("2%"),marginRight=hp("2%"),marginBottom=hp("2%")]}>
                      <Input
                        style={styles.box}
                        placeholder="Vehicle No."
                        // underlineColorAndroid="orange"
                        autoCorrect={false}
                        autoCapitalize="characters"
                        keyboardType="default"
                        onChangeText={tableData2 =>
                          this.setState({ Vehicleno: tableData2 })
                        }
                      />
                    </Item>
                    <View style={{ flexDirection: "row" }}>
                      <View
                        style={{
                          alignSelf: "center",
                          marginTop: hp("2%"),
                          flex: 0.5,
                          marginLeft: hp("5%"),
                          marginRight: hp("2%")
                        }}
                      >
                        <Button
                          onPress={() => this.toggleModal()}
                          style={{
                            width: wp("20%"),
                            height: hp("5.5%"),
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#ff8c00"
                          }}
                          rounded
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: hp("2%")
                            }}
                          >
                            Cancel
                          </Text>
                        </Button>
                      </View>
                      <View
                        style={{
                          alignSelf: "center",
                          marginTop: hp("2%"),
                          flex: 0.5,
                          marginRight: hp("2%")
                        }}
                      >
                        {(this.state.parkingLotno === "" &&
                          this.state.Vehicleno === "") || (this.state.Vehicleno.length === 0 && this.state.parkingLotno.length === 0) ? (
                            <Button
                              style={{
                                width: wp("20%"),
                                height: hp("5.5%"),
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#909091"
                              }}
                              rounded
                            >
                              <Text
                                style={{
                                  color: "white",
                                  fontSize: hp("2%")
                                }}
                              >
                                Add
                              </Text>
                            </Button>
                          ) : (
                            <Button
                              style={{
                                width: wp("20%"),
                                height: hp("5.5%"),
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#ff8c00"
                              }}
                              rounded
                              onPress={() => {
                                this.toggleModal();
                                const prevData = this.state.tableData;
                                let newData = [];
                                newData.push(this.state.parkinglot);
                                newData.push(this.state.Vehicleno);
                                newData.push(4);
                                prevData.push(newData);
                                index1=index1+30;
                                this.setState({
                                  tableData: prevData,
                                  parkingLotno: "",
                                  Vehicleno: "",
                                });
                                console.log(this.state.tableData);
                              }}
                            >
                              <Text
                                style={{
                                  color: "white",
                                  fontSize: hp("2%")
                                }}
                              >
                                Add
                              </Text>
                            </Button>
                          )}
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>

            <View style={{ flexDirection: "row", marginBottom:hp('3%') }}>
              <View
                style={{
                  alignSelf: "center",
                  marginTop: hp("2%"),
                  flex: 0.5,
                  marginLeft: hp("3%")
                }}
              >
                <Button
                  onPress={() => this.props.navigation.goBack()}
                  style={{
                    width: wp("40%"),
                    height: hp("5.5%"),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#ff8c00"
                  }}
                  rounded
                >
                  <Text style={{ color: "white", fontSize: hp("2%") }}>
                    Cancel
                  </Text>
                </Button>
              </View>
              <View
                style={{
                  alignSelf: "center",
                  marginTop: hp("2%"),
                  flex: 0.5,
                  marginRight: hp("2%")
                }}
              >
                <Button
                  onPress={() => this.createUnitPostData()}
                  style={{
                    width: wp("40%"),
                    height: hp("5.5%"),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#ff8c00"
                  }}
                  rounded
                >
                  <Text style={{ color: "white", fontSize: hp("2%") }}>
                    Add Unit
                  </Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    </View>



      );
  }
}

const styles = StyleSheet.create({
  textWrapper: {
    height: hp("87%"), // 70% of height device screen
    // width: wp("98%"), // 80% of width device screen
    marginLeft: hp("1%"),
    marginRight: hp("1%")
  },
  titleText: {
    marginTop: hp("1.5%"),
    marginBottom: hp("2%"),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
    fontSize: hp("2.5%"),
    fontWeight: "300",
    color: "#FF8C00"
  },
  associationDetailsView: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: hp("2%")
  },
  titleChildText: {
    fontSize: hp("2%"),
    fontWeight: "500",
    fontStyle: "normal",
    marginBottom: hp("1.5%"),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
    color: "#ff8c00",
    marginLeft: hp("1.5%")
  },
  fillAssociationDetailline: {
    // borderBottomWidth: 1,
    marginTop: hp("1.7%"),
    height: hp("0.1%"),
    flex: 1,
    marginLeft: hp("0.5%"),
    marginRight: hp("1%"),
    // width: hp("30%"),
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    backgroundColor: "#696969"
  },
  cardItemsStyle: {
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  inputItem: {
    marginLeft: hp("5%"),
    marginRight: hp("5%"),
    borderColor: "orange"
  },
  bankDetailLine: {
    borderColor: "white",
  },
  box: {
    borderColor: "#696969",
    borderWidth: hp("0.1%"),
    marginLeft: hp("1.5%"),
    marginRight: hp("1.5%"),
    paddingLeft: hp("1.5%"),
    paddingRight: hp("1.5%"),
    height: hp("6%"),
    fontSize: hp("1.8%")
  },
  box1: {
    borderColor: "#00bfff",
    borderWidth: hp("0.1%"),
    // marginLeft: hp('1%'),
    // marginRight: hp('1%'),
    paddingLeft: hp("1.5%"),
    paddingRight: hp("1.5%"),
    height: hp("5%"),
    borderRadius: hp("0.5%")
  },
  box2: {
    marginLeft: hp("1.5%"),
    marginRight: hp("1.5%"),
    paddingLeft: hp("1.5%"),
    paddingRight: hp("1.5%"),
    height: hp("6.2%"),
    backgroundColor: "#F5F5F5"
  },
  box5: {
    borderColor: "#696969",
    borderWidth: hp("0.1%"),
    marginLeft: hp("1.5%"),
    marginRight: hp("1.5%"),
    paddingLeft: hp("1.5%"),
    paddingRight: hp("1.5%"),
    height: hp("6%"),
    fontSize: hp("1.8%")
  },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { textAlign: "center" },
  wrapper: { flexDirection: "row" },
  row: { height: 28 },
  text1: {
    color: "#696969",
    fontSize: hp("1.5%"),
    marginLeft: hp("2%"),
    width: hp("80%"),
    marginBottom: hp("0.5%")
  },
  datePickerBox: {
    // margin: hp("1.0%"),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: hp("0.2%"),
    height: hp("4%"),
    borderColor: "#bfbfbf",
    padding: 0,
    marginLeft: hp("1.5%"),
    marginRight: hp("1.5%")
  },
  datePickerText: {
    fontSize: hp("1.5%"),
    marginLeft: 5,
    marginRight: 5,
    color: "#474749"
  },
  datePickerButtonView: {
    marginTop: hp("1%"),
    flexDirection: "row",
    justifyContent: "flex-end",
    justifyContent: "space-around",
    marginHorizontal: hp("2%")
  },
  viewDatePickerImageStyle: {
    width: wp("2.6%"),
    height: hp("2.6%"),
    marginRight: hp("0.5%")
  },
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#808B97" },
  text: { margin: 6 },
  rowStyle: { flexDirection: "row", backgroundColor: "#FFF1C1" },
  btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
  btnText: { textAlign: "center", color: "#fff" },



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

viewDetails2: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: hp("3%"),
    height: hp("3%"),
    marginTop: 5
    // marginLeft: 10
  },

image1: {
    width: wp("17%"),
    height: hp("12%"),
    marginRight: hp("3%")
  },

  
  imp: {
    fontSize: hp("1.5%"),
    color: "red"
  }
});

const mapStateToProps = state => {
    return {
      champBaseURL: state.OyespaceReducer.champBaseURL,
      SelectedAssociationID: state.UserReducer.SelectedAssociationID,
      MyAccountID: state.UserReducer.MyAccountID,
      oyeURL: state.OyespaceReducer.oyeURL  
    };
  };
  
  export default connect(mapStateToProps)(AddUnit);

