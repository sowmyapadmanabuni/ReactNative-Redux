import React, { Component } from "react"
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
    Image,span,
    Dimensions,
    KeyboardAvoidingView,
    TextInput,TouchableOpacity,
    SafeAreaView
} from "react-native"
import {
    Form,
    Item,
    Input,
    Label,
    Button,
    Card,
    CardItem,
    Picker,
} from "native-base"
import { Dropdown } from 'react-native-material-dropdown';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen"
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { BorderlessButton } from "react-native-gesture-handler";
import { BottomTabBar } from "react-navigation";
import { Table, TableWrapper, Row,Cell, Rows } from 'react-native-table-component';
import { DatePickerDialog } from "react-native-datepicker-dialog";
import moment from "moment";
import {connect} from 'react-redux';

let Unit_Type = [
    {
        value: 'Vacant Plot'
    },
    {
        value: 'Flat'
    },
    {
        value: 'Villa'
    }
];
let Occupancy_Status = [
    {
        value: 'Sold Owner Occupied Unit',id :1 // Show Only Owner Details//own
    }, {
        value: 'Sold Tenant Occupied Unit',id:2 // Owner and Tenant Details tent
    }, {
        value: 'Sold Vacant Unit',id:3 // Owner Details
    }, {
        value: 'Unsold Vacant Unit',id:4 // Only Tenant Details
    }, {
        value: 'Unsold Tenant Occupied Unit',id:5 // Only Tenant Details
    }
];
let Calculation_Type = [
    {
        value: 'Flat Rate Value'
    },
    {
        value: 'Dimension Based'
    },
];


class EditUnit extends Component {
    static navigationOptions = {
        title: "Edit Unit",
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            tableHead: ['Parking Lot No. ', 'Vehicle No.', 'Action'],
            Vehicleno:[],
            parkinglot:[],
            tableData: [],
            isModalVisible:false,
            selectblock:"",
            UnitNumber:"",
            UnitType:"",
            UnitDimention:"",
            UnitRate:"",
            CalType:"",
            OccupancyStatus:"",
            //date picker
            dobText: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"), //year + '-' + month + '-' + date,
            dobText1: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"), //year + '-' + month + '-' + date,
        

            Unitofname:"",
            Unitolname:"",
            Unitomnum:"",
            UnitoAnum:"",
            Unitoeid:"",
            Unitoaeid:"",
            Unittfname:"",
            Unittlname:"",
            Unittmnum:"",
            Unitteid:"",
            Ocdate:"",
            Osdate:""
        }
            
              
    }
     //Date Picker
  onDOBPress = () => {
    let dobDate = this.state.Ocdate;
    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        Ocdate: dobDate
      });
    }
    this.refs.dobDialog.open({
      date: dobDate,
      maxDate: new Date() //To restirct past dates
    });
  };

  onDOBDatePicked = date => {
    this.setState({
      dobDate: date,
      dobText: moment(date).format("YYYY-MM-DD")
    });
  };

  onDOBPress1 = () => {
    let dobDate = this.state.Osdate;
    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        Osdate: dobDate
      });
    }
    this.refs.dobDialog1.open({
      date: dobDate,
      maxDate: new Date() //To restirct past dates
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
      
      createUnitPostData = () => {
        UnitType1 = this.state.UnitType;
        UnitRate1 = this.state.UnitRate;
        CalculationType1 = this.state.CalType;
        OccupancyStatus1 = this.state.OccupancyStatus;
        UnitDimention1 = this.state.UnitDimention;
    
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
        // date1 = this.state.dobDate;
        // date2 = this.state.dobDate1;
    
        // vehicle = [];
        // for (var i = 0; i < this.state.tableData.length; i++) {
        //   vehicle.push({ parkinglot: this.state.tableData[i] });
        // }
        // console.log("hhhhhhh", vehicle);
    
        // const reg = /^[0]?[6789]\d{9}$/
        const regTextOnly = /^[a-zA-Z ]+$/;
        const regPIN = /^[0-9]{1,10}$/;
    
        let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
        let regIFSC = /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/;
        let oyeNonSpecialRegex = /[^0-9A-Za-z ]/;
        // let mobRegex = /^[0]?[456789]d{9}$/;
    
        //let validation = [] ={ UnitNum1,UnitType1,UnitRate1,CalculationType1,OccupancyStatus1,UnitDimention1 }
          if (OccupancyStatus1.length === 0) {
          Alert.alert("Select Occupancy Status");
        } else if (
          OccupancyStatus1 === "Unsold Vacant Unit" ||
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
        else if (OccupancyStatus1 == "Unsold Vacant Unit") {
          this.createUnit();
          return;
        }
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
    
        if (Unitofname1.length === 0) {
          Alert.alert("Owner first Name Cannot be Empty");
        } else if (regTextOnly.test(Unitofname1) === false) {
          Alert.alert("Owner first Name should not contain Special Character");
        } else if (Unitolname1.length === 0) {
          Alert.alert("Owner Last Name Cannot be Empty");
        } else if (regTextOnly.test(Unitolname1) === false) {
          Alert.alert("Owner Last Name should not contain Special Character");
        } else if (Unitomnum1.length < 10) {
          Alert.alert("Please Enter Mobile Number");
        } 
        // else if (mobRegex.test(Unitomnum1)== false) {
        //   Alert.alert("Please check Mobile Number");
        // }
        else if (Unitoeid1.length == 0 ) {
          Alert.alert("Enter Email ID");
        } else if (regemail.test(Unitoeid1) == false) {
          Alert.alert("Enter Valid Email ID");
        }else if (Unittfname1.length === 0) {
          Alert.alert("Tenant first Name Cannot be Empty");
        } else if (regTextOnly.test(Unittfname1) === false) {
          Alert.alert("Tenant first Name should not contain Special Character");
        } else if (Unittlname1.length === 0) {
          Alert.alert("Tenant Last Name Cannot be Empty");
        }else if (regTextOnly.test(Unittlname1) === false) {
          Alert.alert("Tenant Last Name should not contain Special Character");
        }  else if (Unittmnum1.length < 10) {
          Alert.alert("Please check Tenant Mobile Number");
        } else if (Unitteid1.length === 0) {
          Alert.alert("Enter  Tenant Email ID");
        } else if (regemail.test(Unitteid1) === false) {
          Alert.alert("Enter Valid Tenant Email ID");
        }
        else {
          this.createUnit();
        }
      };
      validateOwner = () => {
        let Unitofname1 = this.state.Unitofname;
        let Unitolname1 = this.state.Unitolname;
        let Unitomnum1 = this.state.Unitomnum;
        let Unitoeid1 = this.state.Unitoeid;
        let mobRegex = /^[0]?[456789]d{9}$/;
        let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let status = false;
        let regTextOnly = /^[a-zA-Z ]+$/
    
        if (Unitofname1.length == 0) {
          Alert.alert("Owner first Name Cannot be Empty");
          return;
        } else if (regTextOnly.test(Unitofname1) == false) {
          Alert.alert("Owner first name should not contain Special Character");
          return;
        } else if (Unitolname1.length == 0) {
          Alert.alert("Owner Last Name Cannot be Empty");
          return;
        }else if (regTextOnly.test(Unitolname1)== false) {
          Alert.alert("Owner Last Nname should not contain Special Character");
          return;
        }else if (Unitomnum1.length < 10) {
          Alert.alert("Please check  Mobile Number");
          return;
        } 
        // else if (mobRegex.test(Unitomnum1) == false) {
        //   Alert.alert("Please check  Mobile Number");
        //   return;
        // } 
        else if (Unitoeid1.length == 0 ) {
          Alert.alert("Please Enter Valid Email");
          return;
        }else if (regemail.test(Unitoeid1)== false ) {
          Alert.alert("Please Enter Valid Email");
          return;
        }
        
        else {
          this.createUnit();
          return;
          // Alert.alert("Something went wrong");
        }
    
        return;
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
          Alert.alert("Tenant first name should not contain Special Character");
          return;
        } else if (Unittlname1.length == 0) {
          Alert.alert("Tenant Last name Cannot be Empty");
          return;
        }else if (regTextOnly.test(Unittlname1)== false) {
          Alert.alert("Tenant Last name should not contain Special Character");
          return;
        }else if(Unittmnum1.length < 10){
          Alert.alert("Enter Tenant Mobile Number");
          return;
        } 
        // else if (mobRegex.test(Unittmnum1) == true) {
        //   Alert.alert("Please check Tenant Mobile Number");
        //   return;
        // } 
        else if (Unitteid1.length == 0 ) {
          Alert.alert("Please Enter Tenant Email");
          return;
        } else if (regemail.test(Unitteid1)== true ) {
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




      createUnit = () => {

        
        console.log("jkhhjjhsgjhagsjf")
        const { CalType, UnitNumber, UnitType, UnitRate ,OccupancyStatus,UnitDimention,selectblock,Unitofname,
            Unitolname, Unitomnum,UnitoAnum,Unitoeid,Unitoaeid,Unittfname,Unittlname,Unittmnum,Unitteid,dobDate,dobDate1,Ocdate,Osdate
        } = this.state;

        const {
            unitid,blockId
          } = this.props.navigation.state.params

          fetch(`http://${this.props.oyeURL}/oyeliving/api/v1/Unit/UpdateUnitOwnerTenantDetails`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
            },
            body: JSON.stringify({
                "UNUniType" : UnitType,
                "UNOpenBal"	: "",
                "UNCurrBal"	: "",
                "UNOcStat"	: OccupancyStatus ,
                "UNOcSDate" : Ocdate,  //tenabt
                "UNOwnStat" : "",
                "UNSldDate"	: Osdate,   //owner,
                "UNDimens"  : UnitDimention,
                "UNCalType"	: CalType, // Make sure you change this
                "UNRate"    : UnitRate,
                "FLFloorID" : 1,
                "BLBlockID" : blockId,
                "UNUnitID"  : this.props.navigation.state.params.UnitId,
                "owner":[{
                            "UOFName":Unitofname,
                            "UOLName":Unitolname,
                            "UOMobile":Unitomnum,
                            "UOMobile1": UnitoAnum,
                            "UOEmail":Unitoeid,
                            "UOEmail1":Unitoaeid,
                            "UODCreated":"",
                            "UOIsActive":"1"
                        }],
                "tenant":[{
                    "UTFName":Unittfname,
                    "UTLName":Unittlname,
                    "UTMobile":Unittmnum,
                    "UTMobile1":"",
                    "UTEmail": Unitteid,
                    "UTEmail1":"",
                    "UTDCreated":""
                        }]
            })
          })
            .then(response => response.json())
            .then(responseJson => {
              console.log("My Family Details ###############", responseJson)
              alert("Unit Updated")
              this.props.navigation.goBack();
            })
    
            .catch(error => {
              console.log("ashdjkhasjkhjaksbcjaksbkjdasd", error)
              alert("error")
            })
        
    //   }
    }
    
componentDidMount(){
this.setState({UnitDimention:this.props.navigation.state.params.UnitDimention? this.props.navigation.state.params.UnitDimention:""})
this.setState({UnitRate:this.props.navigation.state.params.Rate ? this.props.navigation.state.params.Rate:""})
this.setState({UnitNumber: this.props.navigation.state.params.UnitName ? this.props.navigation.state.params.UnitName : ""})
this.setState({UnitType:this.props.navigation.state.params.UnitType ? this.props.navigation.state.params.UnitType:""})
this.setState({OccupancyStatus:this.props.navigation.state.params.UnitStatus ? this.props.navigation.state.params.UnitStatus:""})
this.setState({CalType:this.props.navigation.state.params.CalType? this.props.navigation.state.params.CalType:""}) // this?yes
this.setState({Unitofname:this.props.navigation.state.params.fName? this.props.navigation.state.params.fName:""})

this.setState({Unitolname:this.props.navigation.state.params.lName? this.props.navigation.state.params.lName:""})
this.setState({Unitomnum:this.props.navigation.state.params.Mobile? this.props.navigation.state.params.Mobile:""})
this.setState({Unitoeid:this.props.navigation.state.params.Email? this.props.navigation.state.params.Email:""})
this.setState({UnitoAnum:this.props.navigation.state.params.AMobile? this.props.navigation.state.params.AMobile:""})
this.setState({Unitoaeid:this.props.navigation.state.params.AEmail? this.props.navigation.state.params.AEmail:""})
this.setState({Unittfname:this.props.navigation.state.params.tfName? this.props.navigation.state.params.tfName:""})

this.setState({Unittlname:this.props.navigation.state.params.tlName? this.props.navigation.state.params.tlName:""})
this.setState({Unittmnum:this.props.navigation.state.params.tMobile? this.props.navigation.state.params.tMobile:""})
this.setState({Unitteid:this.props.navigation.state.params.tEmail? this.props.navigation.state.params.tEmail:""})
this.setState({Ocdate:this.props.navigation.state.params.Ocdate? this.props.navigation.state.params.Ocdate:""})
this.setState({Osdate:this.props.navigation.state.params.Osdate? this.props.navigation.state.params.Osdate:""})

console.log("###############3",this.state.Osdate)
console.log("###############3",this.state.Ocdate)
}
// for onchange text ? what we have to sign ?

    

    _alertIndex(index) {
        Alert.alert(`This is row ${index + 1}`);
      }



    render() {
console.log(this.props.navigation.state.params)
console.log(this.state.CalType)
console.log('Edit Unit')
    const element = (data, index) => (
            <TouchableOpacity onPress={() => this._alertIndex(index)}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>button</Text>
              </View>
            </TouchableOpacity>
          );
      
        return (

     
        
          <View>
          <SafeAreaView style={{ backgroundColor: 'orange' }}>
            <View style={[styles.viewStyle1, { flexDirection: 'row' }]}>
              <View style={styles.viewDetails1}>
                <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                  <View style={{ height: hp("6%"), width: wp("20%"), alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
                    <Image source={require('../icons/backBtn.png')} style={styles.viewDetails2} />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={[styles.image1]} source={require('../icons/headerLogo.png')} />
              </View>
              <View style={{ flex: 0.2, }}>
                {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
              </View>
            </View>
            <View style={{ borderWidth: 1, borderColor: 'orange' }}></View>
          </SafeAreaView>
  
  
          <KeyboardAwareScrollView>
            <View style={styles.textWrapper}>
  
              <Text style={styles.titleText}>Edit Unit</Text>
              <ScrollView>
  
  
                <View style={styles.associationDetailsView}>
                  <Text style={styles.titleChildText}>Unit Information</Text>
                  <View style={styles.fillAssociationDetailline} />
                </View>
                <Card style={{ height: hp("23%"), marginTop: hp('0') }}>
                  <View style={{ flexDirection: 'column' }}>
  
                    <View style={{ height: hp('10%'), marginTop: hp('1%') }}>
                      <Text style={styles.text1}>Unit ID./Flat No./Site No./Door No.<Text style={styles.imp}>*</Text></Text>
                      <Item style={styles.bankDetailLine}>
                        <Text
                          style={styles.box8}
  
                        // defaultValue={this.props.navigation.state.params.UnitName ? this.props.navigation.state.params.UnitName : ""}
                        // onChangeText={UnitNumber=> this.setState({ UnitNumber: UnitNumber })}
                        > {this.props.navigation.state.params.UnitName ? this.props.navigation.state.params.UnitName : ""} </Text>
                      </Item>
                    </View>
                    <View style={{ height: hp('10%'), marginTop: hp('3%') }}>
                      <View style={{ flex: 1, height: hp('10%') }}>
                        <Text style={styles.text1}>Occupancy Status & Ownership Status<Text style={styles.imp}>*</Text></Text>
                        <Dropdown
                          containerStyle={[styles.box2]}
                          // ref={this.typographyRef}
                          onChangeText={(value) => this.setState({ OccupancyStatus: value })}
                          // label='Select Unit'
                          value={this.state.OccupancyStatus}
                          data={Occupancy_Status}
                          fontSize={hp("1.8%")}
                          labelHeight={hp("0.7%")}
                          labelPadding={hp('0.5%')}
                        // inputContainerStyle={{ borderBottomColor: 'transparent' }}   
                        />
  
  
                      </View>
                    </View>
                  </View>
  
                </Card>
  
  
  
  
                {this.props.navigation.state.params.UnitStatus == 'Sold Owner Occupied Unit' || this.props.navigation.state.params.UnitStatus == "Sold Tenant Occupied Unit" || this.props.navigation.state.params.UnitStatus == "Sold Vacant Unit"
                  || this.state.OccupancyStatus === 'Sold Owner Occupied Unit' || this.state.OccupancyStatus === "Sold Tenant Occupied Unit" || this.state.OccupancyStatus === "Sold Vacant Unit" ?
                  <View>
                    <View style={styles.associationDetailsView}>
                      <Text style={styles.titleChildText}>Unit Owner Information</Text>
                      <View style={styles.fillAssociationDetailline} />
                    </View>
                    <Card style={{ height: hp('56%'), marginTop: hp('0') }}>
  
                      {this.props.navigation.state.params.UnitStatus === 'Sold Owner Occupied Unit' || this.state.OccupancyStatus === 'Sold Owner Occupied Unit' ?
                        <View style={{ height: hp('10%'), marginTop: hp('1%') }}>
                          <View style={{ flexDirection: 'column' }}>
                            <View style={{ height: hp('7%'), marginTop: hp('0%') }}>
                              <View style={{ height: hp('10%') }}>
                                <Text style={styles.text1}>Unit Owner Occupied Date<Text style={styles.imp}>*</Text></Text>
                                <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                                  <View style={styles.datePickerBox}>
                                    <Text style={styles.datePickerText}>{this.state.Ocdate.toString()} </Text>
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
                        : <Text></Text>}
                      <View style={{ height: hp('11%'), flexDirection: 'row' }}>
                        <View style={{ flex: 0.5, height: hp('8.7%') }}>
                          <Text style={styles.text1}>Owner First Name<Text style={styles.imp}>*</Text></Text>
                          <Input
                            style={styles.box5}
  
                            placeholder="First Name"
                            // underlineColorAndroid="orange"
                            defaultValue={this.state.Unitofname}
                            autoCorrect={false}
                            autoCapitalize="characters"
                            keyboardType="default"
                            onChangeText={Unitofname => this.setState({ Unitofname: Unitofname })}
                          />
                        </View>
                        <View style={{ flex: 0.5, height: hp('8.7%') }}>
                          <Text style={styles.text1}>Owner Last Name<Text style={styles.imp}>*</Text></Text>
                          <Input
                            style={styles.box5}
                            placeholder="Last Name"
  
                            // underlineColorAndroid="orange"
                            autoCorrect={false}
                            defaultValue={this.state.Unitolname}
                            autoCapitalize="characters"
                            keyboardType="default"
                            onChangeText={Unitolname => this.setState({ Unitolname: Unitolname })}
                          />
                        </View>
  
  
                      </View>
                      <View style={{ height: hp('10%'), flexDirection: 'row', marginTop: hp('2%') }}>
                        <View style={{ flex: 0.5, height: hp('8.7%') }}>
                          <Text style={styles.text1}>Owner Mobile Number<Text style={styles.imp}>*</Text></Text>
                          <Input
                            style={styles.box5}
                            placeholder="Mobile Number"
                            // underlineColorAndroid="orange"
                            autoCorrect={false}
                            autoCapitalize="characters"
                            keyboardType='phone-pad'
                            defaultValue={this.props.navigation.state.params.Mobile ? this.props.navigation.state.params.Mobile.toString() : ""}
                            onChangeText={Unitomnum => this.setState({ Unitomnum: Unitomnum })}
                          />
                        </View>
                        <View style={{ flex: 0.5, height: hp('8.7%') }}>
                          <Text style={styles.text1}>Alternate Mobile Number</Text>
                          <Input
                            style={styles.box5}
                            placeholder="Mobile Number"
                            // underlineColorAndroid="orange"
                            autoCorrect={false}
                            autoCapitalize="characters"
                            keyboardType='name-phone-pad'
                            defaultValue={this.props.navigation.state.params.AMobile ? this.props.navigation.state.params.AMobile.toString() : ""}
                            onChangeText={UnitoAnum => this.setState({ UnitoAnum: UnitoAnum })}
                          />
                        </View>
  
                      </View>
                      <View style={{ height: hp('10%'), marginTop: hp('1%') }}>
                        <Text style={styles.text1}>Owner Email ID<Text style={styles.imp}>*</Text></Text>
                        <Item style={styles.bankDetailLine}>
                          <Input
                            style={styles.box}
                            placeholder="Email ID"
                            // underlineColorAndroid="orange"
                            autoCorrect={false}
                            autoCapitalize="characters"
                            keyboardType="default"
                            defaultValue={this.props.navigation.state.params.Email ? this.props.navigation.state.params.Email : ""}
  
                            onChangeText={Unitoeid => this.setState({ Unitoeid: Unitoeid })}
                          />
                        </Item>
                      </View>
                      <View style={{ height: hp('10%'), marginTop: hp('1%') }}>
                        <Text style={styles.text1}>Owner Alternate Email ID</Text>
                        <Item style={styles.bankDetailLine}>
                          <Input
                            style={styles.box}
                            placeholder="Email ID"
                            // underlineColorAndroid="orange"
                            autoCorrect={false}
                            autoCapitalize="characters"
                            keyboardType="default"
                            defaultValue={this.props.navigation.state.params.AEmail ? this.props.navigation.state.params.AEmail : ""}
                            onChangeText={UnitNumber => this.setState({ Unitoaeid: UnitNumber })}
                          />
                        </Item>
                      </View>
  
                    </Card>
                  </View> : <Text></Text>}
                {this.props.navigation.state.params.UnitStatus == "Sold Tenant Occupied Unit" || this.props.navigation.state.params.UnitStatus == "Unsold Tenant Occupied Unit"
                  || this.state.OccupancyStatus === "Sold Tenant Occupied Unit" || this.state.OccupancyStatus === "Unsold Tenant Occupied Unit" ?
                  <View>
                    <View style={styles.associationDetailsView}>
                      <Text style={styles.titleChildText}>Unit Tenant Information</Text>
                      <View style={styles.fillAssociationDetailline} />
                    </View>
                    <Card style={{ height: hp('45%'), marginTop: hp('1%') }}>
                      {this.props.navigation.state.params.UnitStatus === 'Sold Tenant Occupied Unit' || this.state.OccupancyStatus === 'Sold Tenant Occupied Unit' ?
                        <View style={{ height: hp('10%'), marginTop: ('1%') }}>
                          <View style={{ flexDirection: 'column' }}>
                            <View style={{ height: hp('7%') }}>
                              <View style={{ height: hp('10%') }}>
                                <Text style={styles.text1}>Unit Tenant Occupied Date<Text style={styles.imp}>*</Text></Text>
                                <TouchableOpacity onPress={this.onDOBPress1.bind(this)}>
                                  <View style={styles.datePickerBox}>
                                    <Text style={styles.datePickerText}>{this.state.Osdate.toString()} </Text>
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
                        </View> : <Text></Text>}
                      <View style={{ height: hp('10%'), flexDirection: 'row', }}>
                        <View style={{ flex: 0.5, height: hp('8.7%') }}>
                          <Text style={styles.text1}>Tenant First Name<Text style={styles.imp}>*</Text></Text>
                          <Input
                            style={styles.box5}
                            placeholder="First Name"
                            // underlineColorAndroid="orange"
                            autoCorrect={false}
                            autoCapitalize="characters"
                            keyboardType="default"
                            defaultValue={this.props.navigation.state.params.tfName ? this.props.navigation.state.params.tfName : ""}
  
                            onChangeText={Unittfname => this.setState({ Unittfname: Unittfname })}
                          />
                        </View>
                        <View style={{ flex: 0.5, height: hp('8.7%') }}>
                          <Text style={styles.text1}>Tenant Last Name<Text style={styles.imp}>*</Text></Text>
                          <Input
                            style={styles.box5}
                            placeholder="Last Name"
                            // underlineColorAndroid="orange"
                            autoCorrect={false}
                            autoCapitalize="characters"
                            keyboardType="default"
                            defaultValue={this.props.navigation.state.params.tlName ? this.props.navigation.state.params.tlName : ""}
                            onChangeText={Unittlname => this.setState({ Unittlname: Unittlname })}
                          />
                        </View>
  
                      </View>
                      <View style={{ height: hp('10%'), marginTop: hp('1%') }}>
                        <Text style={styles.text1}>Tenant Mobile Number<Text style={styles.imp}>*</Text></Text>
                        <Item style={styles.bankDetailLine}>
                          <Input
                            style={styles.box}
                            placeholder="Mobile Number"
                            // underlineColorAndroid="orange"
                            autoCorrect={false}
                            autoCapitalize="characters"
                            keyboardType="default"
                            defaultValue={this.props.navigation.state.params.tMobile ? this.props.navigation.state.params.tMobile.toString() : ""}
                            onChangeText={Unittmnum => this.setState({ Unittmnum: Unittmnum })}
                          />
                        </Item>
                      </View>
                      <View style={{ height: hp('10%'), marginTop: hp('1%') }}>
                        <Text style={styles.text1}>Tenant Email ID<Text style={styles.imp}>*</Text></Text>
                        <Item style={styles.bankDetailLine}>
                          <Input
                            style={styles.box}
                            placeholder="Email ID"
                            // underlineColorAndroid="orange"
                            autoCorrect={false}
                            defaultValue={this.props.navigation.state.params.tEmail ? this.props.navigation.state.params.tEmail : ""}
                            autoCapitalize="characters"
                            keyboardType="default"
                            onChangeText={Unitteid => this.setState({ Unitteid: Unitteid })}
                          />
                        </Item>
                      </View>
  
                    </Card>
                  </View> : <Text></Text>}
                <View style={styles.associationDetailsView}>
                  <Text style={styles.titleChildText}>Unit Maintenance Details</Text>
                  <View style={styles.fillAssociationDetailline} />
                </View>
                <Card style={{ height: hp("23%"), marginTop: hp("0") }}>
                  <View style={{ flexDirection: "column" }}>
                    <View style={{ height: hp('10%'), flexDirection: 'row', marginTop: hp('1%') }}>
                      <View style={{ flex: 0.5, height: hp('8.7%') }}>
                        <Text style={styles.text1}>Select Unit Type</Text>
                        <Dropdown
                          containerStyle={styles.box2}
                          // ref={this.typographyRef}
                          onChangeText={(value) => this.setState({ UnitType: value })}
                          // label='Unit Type'
                          data={Unit_Type}
                          fontSize={hp("1.8%")}
                          value={this.state.UnitType}
                          labelHeight={hp("0.7%")}
                          labelPadding={hp('0.5%')}
                          labelSize={hp("1%")}
  
  
  
                        />
                      </View>
                      <View style={{ flex: 0.5, height: hp('8.5%') }}>
                        <Text style={styles.text1}>Unit Rate</Text>
                        <Input
                          style={styles.box5}
                          placeholder="Unit Rate"
                          // underlineColorAndroid="orange"
                          autoCorrect={false}
                          // defaultValue={this.state.UnitRate}
                          // autoCapitalize="characters"
                          keyboardType="number-pad"
                          onChangeText={UnitRate => this.setState({ UnitRate: UnitRate })}
                          defaultValue={this.props.navigation.state.params.Rate ? this.props.navigation.state.params.Rate.toString() : ""}
                        />
                      </View>
  
  
                    </View>
  
  
  
  
  
  
                    <View style={{ height: hp('8%'), flexDirection: 'row', marginTop: hp('1%') }}>
                      <View style={{ flex: 0.5, height: hp('8.7%') }}>
                        <Text style={styles.text1}>Select Maintenance Calculation Type</Text>
                        <Dropdown
                          containerStyle={styles.box2}
                          // ref={}
                          onChangeText={(value) => this.setState({ CalType: value })}
                          // label='Unit Type'
                          data={Calculation_Type}
                          fontSize={hp("1.8%")}
                          labelHeight={hp("0.8%")}
                          labelPadding={hp('2%')}
                          labelSize={hp("1%")}
                          // Why are you using two different states for one element? bcz one is to set another one is for new update 
                          // Its wrong, one element should use one state, you can't be passing one this as the value and one thins as another
                          // You are setting the value of this to an empty string, hence the error
                          // can you show me one in this so i can try my self 
  
                          value={this.state.CalType} //here where using 
  
                        />
                      </View>
                      <View style={{ flex: 0.5, height: hp('8.5%') }}>
                        <Text style={styles.text1}>Unit Dimension</Text>
                        <Input
                          style={styles.box5}
  
                          placeholder="Unit Dimension"
                          // underlineColorAndroid="orange"
                          autoCorrect={false}
  
                          autoCapitalize="characters"
                          keyboardType="default"
                          onChangeText={vehName => this.setState({ UnitDimention: vehName })}
                          defaultValue={this.state.UnitDimention.toString()}
                        />
  
                      </View>
  
  
  
                    </View>
  
  
  
  
                  </View>
                </Card>
  
  
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ alignSelf: "center", marginTop: hp('2%'), flex: 0.5, marginLeft: hp('3%') }}>
                    <Button
                      onPress={() => this.props.navigation.goBack()}
                      style={{
                        width: wp('40%'),
                        height: hp('5.5%'),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: '#ff8c00'
                      }}
                      rounded
  
                    >
                      <Text style={{ color: "white", fontSize: hp('2%') }}>Cancel</Text>
                    </Button>
                  </View>
                  <View style={{ alignSelf: "center", marginTop: hp('2%'), flex: 0.5, marginRight: hp('2%') }}>
                    <Button
                      onPress={() => this.createUnitPostData()}
                      style={{
                        width: wp('40%'),
                        height: hp('5.5%'),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: '#ff8c00'
                      }}
                      rounded
  
                    >
                      <Text style={{ color: "white", fontSize: hp('2%') }}>Update</Text>
                    </Button>
                  </View>
  
                </View>
  
  
              </ScrollView>
            </View>
  
          </KeyboardAwareScrollView>
        </View>
  
  
        )
        
    }
}

const styles = StyleSheet.create({
    textWrapper: {
        height: hp("85%"), // 70% of height device screen
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
        // justifyContent: "space-between",
        flexDirection: "row",
        marginTop: hp("2%"),
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
        color: "orange",
        marginLeft: hp('1.5%'),
    },
    fillAssociationDetailline: {
        // borderBottomWidth: 1,
        marginTop: hp("1.7%"),
        height: hp("0.1%"),
        flex: 1,
        marginLeft: hp('0.5%'),
        marginRight: hp('1%'),
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
        marginLeft: hp('5%'),
        marginRight: hp('5%'),
        borderColor: "orange"
    },
    bankDetailLine: {
        borderColor: "white",
        

    },
    box: {
        borderColor: '#696969',
        borderWidth: hp('0.1%'),
        marginLeft: hp('1.5%'),
        marginRight: hp('1.5%'),
        paddingLeft: hp('1.5%'),
        paddingRight: hp('1.5%'),
        height: hp('6%'),
        fontSize:hp("1.8%"),
       
    },
    box1: {
        borderColor: '#00bfff',
        borderWidth: hp('0.1%'),
        // marginLeft: hp('1%'),
        // marginRight: hp('1%'),
        paddingLeft: hp('1.5%'),
        paddingRight: hp('1.5%'),
        height: hp("6%"),
        borderRadius: hp('0.5%'),
    },
    box2: {
        marginLeft: hp('1.5%'),
        marginRight: hp('1.5%'),
        paddingLeft: hp('1.5%'),
        paddingRight: hp('1.5%'),
        height: hp("5.8%"),
        backgroundColor:'#F5F5F5',
    },
    box5: {
        borderColor: '#696969',
        borderWidth: hp('0.1%'),
        marginLeft: hp('1.5%'),
        marginRight: hp('1.5%'),
        paddingLeft: hp('1.5%'),
        paddingRight: hp('1.5%'),
        height: hp('6.2%'),
        fontSize:hp("1.8%"),
       
    },
    box8: {
        borderColor: '#696969',
        borderWidth: hp('0.1%'),
        marginLeft: hp('1.5%'),
        marginRight: hp('1.5%'),
        paddingLeft: hp('1.5%'),
        paddingRight: hp('1.5%'),
        paddingTop:hp('1.5%'),
        height: hp('6%'),
        fontSize:hp("1.8%"),
        color:'black',
        width:hp('50%'),
        alignContent:'center'
    },
    head: {  height: 40,
          backgroundColor: '#f1f8ff'  
         },
        text: { textAlign: 'center' },
        wrapper: { flexDirection: 'row' },
        row: {  height: 28  },
    text1:{ 
        color: '#696969', 
        fontSize: hp('1.5%'),
         marginLeft: hp('2%'), 
         width: hp('80%'),
         marginBottom:hp("0.5%")
         },
    datePickerBox: {
            // margin: hp("1.0%"),
            justifyContent: "center",
            alignItems:'center',
            flexDirection:'row',
            borderWidth:hp('0.2%'),
            height:hp("4%"),
            borderColor:'#bfbfbf',
            padding:0,
            marginLeft:hp('1.5%'),
            marginRight:hp('1.5%')
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
            marginHorizontal:hp('2%')
          },
        viewDatePickerImageStyle: {
            width: wp("2.6%"),
            height:hp("2.6%"),
            marginRight:hp("0.5%")
          },
          dataWrapper: { marginTop: -1 },
          imp:{
            fontSize: hp("1.5%"),
            color: "red"
          },
          viewDetails1:{
            flex:0.3,
            flexDirection:'row',
             justifyContent:'center',
             alignItems:'center', 
             marginLeft:3
          },
          viewDetails2:{
            alignItems:'flex-start',
            justifyContent:'center',
            width:wp("6%"),
            height:hp("2%")
          },
          image1: {
            width:wp("22%"),
            height:hp("12%"),
            marginRight:hp("1%")
          },
          viewStyle1: {
            backgroundColor: '#fff',
            height: hp("7%"),
            width:Dimensions.get('screen').width,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            elevation: 2,
            position: 'relative',
        },

})

const mapStateToProps = state => {
    return {
      champBaseURL: state.OyespaceReducer.champBaseURL,
      SelectedAssociationID: state.UserReducer.SelectedAssociationID,
      MyAccountID: state.UserReducer.MyAccountID,
      oyeURL: state.OyespaceReducer.oyeURL  
    };
  };
  
  export default connect(mapStateToProps)(EditUnit);
