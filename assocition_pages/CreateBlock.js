import React, { Component } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Icon,
  Alert,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  TextInput,
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
  Picker
} from "native-base"
import { Dropdown } from "react-native-material-dropdown"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import CheckBox from "react-native-check-box"
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button"
import { DatePickerDialog } from "react-native-datepicker-dialog"
import moment from "moment"
import {connect} from 'react-redux';

let data = [
  {
    value: "Monthly",
    id: 1
  },
  {
    value: "Quarterly",
    id: 2
  },
  {
    value: "Half Yearly",
    id: 3
  },
  {
    value: "Annually",
    id: 4
  }
]

let data1 = [
  {
    value: "Monthly",
    id: 1
  },
  {
    value: "Quarterly",
    id: 2
  },
  {
    value: "Half Yearly",
    id: 3
  },
  {
    value: "Annually",
    id: 4
  }
]
let data2 = [
  {
    value: "Residential",
    id: 1
  },
  {
    value: "Commercial",
    id: 2
  },
  {
    value: "Residential/Commercial",
    id: 3
  }
]

var radio_props = [{ label: "Flat Rate Value", value: 0 }]
class AddBlock extends Component {
  static navigationOptions = {
    title: "Add Block",
    header: null
  }
  constructor(props) {
    super(props)
    this.state = {
      blockName: "",
      blockType: "",
      noOfUnits: "",
      managerName: "",
      mobNum: "",
      emailID: "",
      flatRateValue: "",
      maintenaceValue: "",
      measurementType: "",
      invoiceCreationFreq: "",
      nextInvoiceGenDate: "",
      dueDate: "",
      latePayChargeType: "",
      latePayCharge: "",
      startsFromDate: "",

      measurementTypeCountry: "",

      flash: +91,

      dobText: moment(new Date()).format("YYYY-MM-DD"), //year + '-' + month + '-' + date,
      dobDate: "",

      // dobText: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"), //year + '-' + month + '-' + date,
      // dobDate: "",

      dobText2: moment(new Date()).format("YYYY-MM-DD"), //year + '-' + month + '-' + date,
      dobDate2: "",

      dobText3: moment(new Date()).format("YYYY-MM-DD"), //year + '-' + month + '-' + date,
      dobDate3: "",

      dobText4: moment(new Date()).format("YYYY-MM-DD"), //year + '-' + month + '-' + date,
      dobDate4: "",

      checked: true,
      checked2: true,


      associationId:null
    }
  }

  //Date Picker - 1
  onDOBPress = () => {
    let dobDate = this.state.dobDate
    if (!dobDate || dobDate == null) {
      dobDate = new Date()
      this.setState({
        dobDate: dobDate
      })
    }
    this.refs.dobDialog.open({
      date: dobDate,
      minDate: new Date() //To restirct past dates
    })
  }
  onDOBDatePicked = date => {
    this.setState({
      dobDate: date,
      dobText: moment(date).format("YYYY-MM-DD")
    })
  }

  //Date Picker - 2
  onDOBPress2 = () => {
    let dobDate = this.state.dobDate2
    if (!dobDate || dobDate == null) {
      dobDate = new Date()
      this.setState({
        dobDate2: dobDate
      })
    }
    this.refs.dobDialog2.open({
      date: dobDate,
      minDate: new Date() //To restirct past dates
    })
  }
  onDOBDatePicked2 = date => {
    this.setState({
      dobDate2: date,
      dobText2: moment(date).format("YYYY-MM-DD")
    })
  }

  //Date Picker - 3
  onDOBPress3 = () => {
    let dobDate = this.state.dobDate3
    if (!dobDate || dobDate == null) {
      dobDate = new Date()
      this.setState({
        dobDate3: dobDate
      })
    }
    this.refs.dobDialog3.open({
      date: dobDate,
      minDate: new Date() //To restirct past dates
    })
  }
  onDOBDatePicked3 = date => {
    this.setState({
      dobDate3: date,
      dobText3: moment(date).format("YYYY-MM-DD")
    })
  }

  //Date Picker - 4
  onDOBPress4 = () => {
    let dobDate = this.state.dobDate4
    if (!dobDate || dobDate == null) {
      dobDate = new Date()
      this.setState({
        dobDate4: dobDate
      })
    }
    this.refs.dobDialog4.open({
      date: dobDate,
      minDate: new Date() //To restirct past dates
    })
  }
  onDOBDatePicked4 = date => {
    this.setState({
      dobDate4: date,
      dobText4: moment(date).format("YYYY-MM-DD")
    })
  }

  validation = () => {
    let blockName = this.state.blockName
    let blockType = this.state.blockType
    let noOfUnits = this.state.noOfUnits
    let managerName = this.state.managerName
    let mobNum = this.state.mobNum
    let emailID = this.state.emailID
    let flatRateValue = this.state.flatRateValue
    let maintenaceValue = this.state.maintenaceValue
    let measurementType = this.state.measurementType
    let invoiceCreationFreq = this.state.invoiceCreationFreq
    let dobText = this.state.dobText
    let dobText2 = this.state.dobText2
    let latePayChargeType = this.state.latePayChargeType
    let latePayCharge = this.state.latePayCharge
    let dobText3 = this.state.dobText3
    let dobText4 = this.state.dobText4

    let checked = this.state.checked
    let checked2 = this.state.checked2

    const reg = /^[0]?[6789]\d{9}$/
    const regTextOnly = /^[a-zA-Z ]+$/
    const regPIN = /^[0-9]{1,10}$/

    let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/
    let regIFSC = /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/
    let oyeNonSpecialRegex = /[^0-9A-Za-z ]/
    let mobRegex = /^[0]?[456789]d{9}$/

    if (blockName.length == 0) {
      Alert.alert("Block name Cannot be Empty")
    } else if (oyeNonSpecialRegex.test(blockName) === true) {
      Alert.alert("Block name should not contain Special Character")
    } else if (blockName < 3) {
      alert("Block name should be more than 3 Characters")
    } else if (blockName > 50) {
      alert("Block name should be less than 50 Characters")
    } else if (blockType.length == 0) {
      Alert.alert("Please Select Block type")
    } else if (noOfUnits.length == 0) {
      Alert.alert("Number of Units Cannot be Empty")
    } 
    // else if (noOfUnits >= 80) {
    //   Alert.alert("Number Of Units should not be more than 80")
    // }
     else if (regPIN.test(noOfUnits) === false) {
      alert("Number Of Units should not contain Special Character")
    } else if (managerName.length == 0) {
      Alert.alert("Manager Name Cannot be Empty")
    } else if (regTextOnly.test(managerName) === false) {
      Alert.alert("Manager Name should not contain Special Character")
    } else if (mobNum.length < 10) {
      Alert.alert("Mobile number should contains 10 numerics.")
    } else if (reg.test(mobNum) === false) {
      Alert.alert("Mobile number should not contain special characters.")
    } else if (regemail.test(emailID) === false) {
      Alert.alert("Please check your email-id")
    } else if (invoiceCreationFreq.length == 0) {
      Alert.alert("Please select Invoice creation frequency")
    } else if (dobText.length == 0) {
      Alert.alert("Please select Next Invoice generation date")
    } else if (dobText2 < dobText) {
      Alert.alert("Invoice Creation frequency less than Due date")
    } else if (latePayChargeType.length == 0) {
      Alert.alert("Please select LatePayChargeType")
    } else if (latePayCharge == 0) {
      Alert.alert("Late Payment Charge cannot be empty")
    } else if (regPIN.test(latePayCharge) === false) {
      Alert.alert("Late Payment Charge should not contain special characters")
    } else if (dobText4 < dobText2 && dobText) {
      Alert.alert("Start's from date")
    } else if (checked === false) {
      this.flatrate()
      return
    } else if (checked2 === false) {
      this.dimenstion()
      return
    } else if (checked === true || checked2 === true) {
      Alert.alert("Please give FlatRate value or MaintenaceValue")
    }
  }
  flatrate = () => {
    let flatRateValue = this.state.flatRateValue
    if (flatRateValue.length === 0) {
      Alert.alert("Please should give Flat rate value")
      return
    } else {
      this.createBlockPostData()
    }
  }

  dimenstion = () => {
    let maintenaceValue = this.state.maintenaceValue
    if (maintenaceValue.length === 0) {
      Alert.alert("Please should give Maintenace value")
      return
    } else {
      this.createBlockPostData()
    }
  }

  createBlockPostData = () => {
    blockName = this.state.blockName
    blockType = this.state.blockType
    noOfUnits = this.state.noOfUnits
    managerName = this.state.managerName
    mobNum = this.state.mobNum
    emailID = this.state.emailID
    flatRateValue = this.state.flatRateValue
    maintenaceValue = this.state.maintenaceValue
    measurementType = this.state.measurementType
    invoiceCreationFreq = this.state.invoiceCreationFreq
    dobText = this.state.dobDate
    dobText2 = this.state.dobDate2
    latePayChargeType = this.state.latePayChargeType
    latePayCharge = this.state.latePayCharge
    dobText3 = this.state.dobDate3
    dobText4 = this.state.dobDate4

    checked = this.state.checked
    checked2 = this.state.checked2

    console.log(invoiceCreationFreq)
    console.log("All Data sending",this.props.navigation.state.params.associationId,
    this.props.MyAccountID,blockName,blockType,noOfUnits,managerName,mobNum,emailID,checked, checked2,
    invoiceCreationFreq,maintenaceValue,flatRateValue,measurementType,dobText,latePayChargeType,
    latePayCharge,dobText4,dobText2

    )
    fetch(`http://${this.props.oyeURL}/oyeliving/api/v1/Block/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
      },
      body: JSON.stringify({
        ASAssnID: this.props.navigation.state.params.associationId,
        ACAccntID: this.props.MyAccountID,
        blocks: [
          {
            BLBlkName: blockName,
            BLBlkType: blockType,
            BLNofUnit: noOfUnits,
            BLMgrName: managerName,
            BLMgrMobile: mobNum,
            BLMgrEmail: emailID,
            ASMtType: checked + checked2,
            ASICrFreq: invoiceCreationFreq,
            ASMtDimBs: maintenaceValue,
            ASMtFRate: flatRateValue,
            ASUniMsmt: measurementType, //sqft sqmt
            ASBGnDate: dobText, // Invoice Gen. Date
            ASLPCType: latePayChargeType,
            ASLPChrg: latePayCharge,
            ASLPSDate: dobText4, //Start Date
            ASDPyDate: dobText2 //Due Date
          }
        ]
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(
        //   "###############",
        //   responseJson.BLBlkName,
        //   responseJson.ASUniMsmt,
        //   responseJson.ASMtDimBs,
        //   responseJson.ASICrFreq
        // )
        console.log("Block Created", responseJson)
        //alert("Data Created")
        this.props.navigation.goBack()
      })

      .catch(error => {
        console.log("ashdjkhasjkhjaksbcjaksbkjdasd", error)
        alert("error")
      })
  }

  componentDidMount = () => {
    this.measurementType()
    
    console.log("The Association Id ----> ", this.state.associationId)
  }
  measurementType = () => {
    fetch(
      `http://${this.props.oyeURL}/oyeliving/api/v1/association/getAssociationList/`+ this.props.MyAccountID,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson)
        this.setState({
          measurementTypeCountry: responseJson.data.association.asCountry
        })
        console.log(
          this.state.measurementTypeCountry,
          "98765768798678657687986"
        )
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    console.log("The Association Id: ----> ", this.props.navigation.state.params.associationId)
    return (
      <View style={{ flex: 1 }}>
        {/* <Header /> */}
        <SafeAreaView style={{ backgroundColor: "orange" }}>
          <View style={[styles.viewStyle, { flexDirection: "row" }]}>
            <View
              style={{
                flex: 1,
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
                  source={require("../icons/backBtn.png")}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flex: 3,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={[styles.image]}
                source={require("../icons/headerLogo.png")}
              />
            </View>
            <View style={styles.emptyViewStyle} />
          </View>
          <View style={{ borderWidth: 1, borderColor: "orange" }} />
        </SafeAreaView>
        {/* <Header /> */}

        <KeyboardAwareScrollView>
          <View style={styles.textWrapper}>
            <Text style={styles.titleText}>Add Block</Text>

            <ScrollView>
              <View style={styles.associationDetailsView}>
                <Text style={styles.titleChildText}>Block Details</Text>
                <View style={styles.fillAssociationDetailline} />
              </View>
              <Card style={styles.myProfileCardsStyle}>
                <Item style={styles.inputItem} floatingLabel>
                  <Input
                    placeholder="Block Name"
                    // underlineColorAndroid="orange"
                    autoCorrect={false}
                    autoCapitalize="characters"
                    keyboardType="default"
                    maxLength={30}
                    onChangeText={blockName =>
                      this.setState({ blockName: blockName })
                    }
                  />
                </Item>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginVertical: hp("2%")
                  }}
                >
                  <View style={{ flex: 0.4, height: hp("0.8%") }}>
                    {/* <Text>Block Type</Text> */}
                    <Dropdown
                      containerStyle={styles.box2}
                      dropdownPosition={0}
                      style={{ fontSize: hp("2%") }}
                      value={"Residential"}
                      textColor="#3A3A3C"
                      data={data2}
                      labelHeight={hp("0.7%")}
                      // labelPadding={hp("0.5%")}
                      //labelSize={hp("1%")}
                      inputContainerStyle={{ borderBottomColor: "transparent" }}
                      onChangeText={blockType =>
                        this.setState({ blockType: blockType })
                      }
                    />
                  </View>

                  {/* <Text>Number of Units</Text> */}
                  <Input
                    style={[styles.box, { flex: 0.4 }]}
                    placeholder="No. of Units"
                    autoCorrect={false}
                    autoCapitalize="characters"
                    keyboardType="number-pad"
                    onChangeText={noOfUnits =>
                      this.setState({ noOfUnits: noOfUnits })
                    }
                  />
                </View>
              </Card>

              <View style={styles.associationDetailsView}>
                <Text style={styles.titleChildText}>Manager Details</Text>
                <View style={styles.fillAssociationDetailline} />
              </View>
              <Card style={styles.myProfileCardsStyle}>
                <Item style={styles.inputItem} floatingLabel>
                  <Input
                    placeholder="Manager Name"
                    // underlineColorAndroid="orange"
                    autoCorrect={false}
                    autoCapitalize="characters"
                    keyboardType="default"
                    maxLength={30}
                    onChangeText={managerName =>
                      this.setState({ managerName: managerName })
                    }
                  />
                </Item>
                <Item style={styles.inputItem} floatingLabel>
                  <Input
                    placeholder="Mobile Number"
                    // underlineColorAndroid="orange"
                    autoCorrect={false}
                    autoCapitalize="characters"
                    keyboardType="number-pad"
                    maxLength={10}
                    onChangeText={mobNum => this.setState({ mobNum: mobNum })}
                  />
                </Item>
                <Item style={styles.inputItem} floatingLabel>
                  <Input
                    placeholder="Email ID"
                    // underlineColorAndroid="orange"
                    autoCorrect={false}
                    autoCapitalize="none"
                    keyboardType="default"
                    onChangeText={emailID =>
                      this.setState({ emailID: emailID })
                    }
                  />
                </Item>
                <View style={{ height: hp("2%") }} />
              </Card>

              <View style={styles.associationDetailsView}>
                <Text style={styles.titleChildText}>Maintenace Details</Text>
                <View style={styles.fillAssociationDetailline} />
              </View>
              <Card />
              <Card style={{ height: 900 }}>
                <Text
                  style={{
                    color: "#696969",
                    marginLeft: wp("5%"),
                    fontSize: hp("2%"),
                    marginVertical: hp("1%")
                  }}
                >
                  Select Rate
                </Text>
                <View
                  style={{
                    marginLeft: wp("1.8%"),
                    flexDirection: "row",
                    height: hp("2%"),
                    marginTop: wp("3%")
                  }}
                >
                  <View
                    style={{
                      marginLeft: wp("1.8%"),
                      flexDirection: "row",
                      height: hp("2%"),
                      marginTop: wp("3%")
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <CheckBox
                        onClick={() => {
                          this.setState({
                            checked: !this.state.checked,
                            flatRateValue: ""
                          })
                        }}
                        isChecked={!this.state.checked}
                        checkedImage={
                          <Image
                            source={require("../icons/tick.png")}
                            style={{ width: 20, height: 20 }}
                          />
                        }
                        unCheckedImage={
                          <Image
                            source={require("../icons/box.png")}
                            style={{ width: 20, height: 20 }}
                          />
                        }
                      />
                      <Text>Flat Rate Value</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    height: hp("5%"),
                    marginTop: wp("8%"),
                    marginLeft: wp("5%"),
                    marginRight: wp("5%")
                  }}
                >
                  {this.state.checked == false ? (
                    <Input
                      style={{
                        borderColor: "#696969",
                        borderWidth: hp("0.1%")
                      }}
                      placeholder="Flat Rate Value"
                      autoCorrect={false}
                      autoCapitalize="characters"
                      keyboardType="numeric"
                      onChangeText={flatRateValue =>
                        this.setState({ flatRateValue: flatRateValue })
                      }
                    />
                  ) : (
                    <Text />
                  )}
                </View>

                <View
                  style={{
                    marginLeft: wp("1.8%"),
                    flexDirection: "row",
                    height: hp("2%"),
                    marginTop: wp("3%")
                  }}
                >
                  <View
                    style={{
                      marginLeft: wp("1.8%"),
                      flexDirection: "row",
                      height: hp("2%"),
                      marginTop: wp("3%")
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <CheckBox
                        onClick={() => {
                          this.setState({
                            checked2: !this.state.checked2
                            //flatRateValue: ""
                          })
                        }}
                        isChecked={!this.state.checked2}
                        checkedImage={
                          <Image
                            source={require("../icons/tick.png")}
                            style={{ width: 20, height: 20 }}
                          />
                        }
                        unCheckedImage={
                          <Image
                            source={require("../icons/box.png")}
                            style={{ width: 20, height: 20 }}
                          />
                        }
                      />
                      <Text>Dimension Based</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    height: hp("5%"),
                    marginTop: wp("8%"),
                    marginLeft: wp("5%"),
                    marginRight: wp("5%")
                  }}
                >
                  {this.state.checked2 == false ? (
                    <Input
                      style={{
                        borderColor: "#696969",
                        borderWidth: hp("0.1%")
                      }}
                      placeholder="Maintenace Value"
                      autoCorrect={false}
                      autoCapitalize="characters"
                      keyboardType="numeric"
                      onChangeText={maintenaceValue =>
                        this.setState({ maintenaceValue: maintenaceValue })
                      }
                    />
                  ) : (
                    <Text />
                  )}
                </View>

                <Text
                  style={{
                    color: "#696969",
                    marginLeft: wp("5%"),
                    fontSize: hp("2%"),
                    marginVertical: hp("1%"),
                    paddingTop: hp("1.5%")
                  }}
                >
                  Unit of Measurement
                </Text>
                <Item style={styles.bankDetailLine}>
                  {this.state.measurementTypeCountry == "indi" ? (
                    <Text style={styles.box8}>
                      {" "}
                      SQFT{" "}
                    </Text>
                  ) : (
                    <Text style={styles.box8}>
                      {" "}
                      SQMT
                    </Text>
                  )}
                </Item>
                <Text
                  style={{
                    color: "#696969",
                    marginLeft: wp("5%"),
                    fontSize: hp("2%"),
                    marginVertical: hp("1%")
                  }}
                >
                  Invoice Creation Frequency
                </Text>

                <Dropdown
                  containerStyle={styles.box1}
                  dropdownPosition={-3}
                  // label="Select Frequency"
                  style={{ fontSize: hp("2%") }}
                  value={"Monthly"}
                  textColor="#3A3A3C"
                  // baseColor="#fff"
                  data={data}
                  labelHeight={hp("0.7%")}
                  inputContainerStyle={{ borderBottomColor: "transparent" }}
                  onChangeText={invoiceCreationFreq =>
                    this.setState({
                      invoiceCreationFreq: invoiceCreationFreq
                    })
                  }
                />

                <Text
                  style={{
                    color: "#696969",
                    marginLeft: wp("5%"),
                    fontSize: hp("2%"),
                    marginVertical: hp("1%")
                  }}
                >
                  Next Invoice Generation Date
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
                  </View>
                </TouchableOpacity>
                <Text
                  style={{
                    color: "#696969",
                    marginLeft: wp("5%"),
                    fontSize: hp("2%"),
                    marginVertical: hp("1%")
                  }}
                >
                  Due Date
                </Text>
                <TouchableOpacity onPress={this.onDOBPress2.bind(this)}>
                  <View style={styles.datePickerBox}>
                    <Text style={styles.datePickerText}>
                      {this.state.dobText2}{" "}
                    </Text>
                    <DatePickerDialog
                      ref="dobDialog2"
                      onDatePicked={this.onDOBDatePicked2.bind(this)}
                    />
                  </View>
                </TouchableOpacity>
                <Text
                  style={{
                    color: "#696969",
                    marginLeft: wp("5%"),
                    fontSize: hp("2%"),
                    marginVertical: hp("1%")
                  }}
                >
                  Late Payment Charge Type
                </Text>
                <Dropdown
                  containerStyle={styles.box1}
                  dropdownPosition={-5}
                  // label="Select Charge Type"
                  style={{ fontSize: hp("2%") }}
                  value={"Monthly"}
                  textColor="#3A3A3C"
                  data={data1}
                  labelHeight={hp("0.7%")}
                  inputContainerStyle={{ borderBottomColor: "transparent" }}
                  onChangeText={latePayChargeType =>
                    this.setState({ latePayChargeType: latePayChargeType })
                  }
                />
                <Text
                  style={{
                    color: "#696969",
                    marginLeft: wp("5%"),
                    fontSize: hp("2%"),
                    marginVertical: hp("1%")
                  }}
                >
                  Late Payment Charge
                </Text>

                <Item style={styles.bankDetailLine}>
                  <Input
                    style={styles.box}
                    placeholder="Late Payment Charge"
                    autoCorrect={false}
                    autoCapitalize="characters"
                    keyboardType="numeric"
                    onChangeText={latePayCharge =>
                      this.setState({ latePayCharge: latePayCharge })
                    }
                  />
                </Item>
                <Text
                  style={{
                    color: "#696969",
                    marginLeft: wp("5%"),
                    fontSize: hp("2%"),
                    marginVertical: hp("1%")
                  }}
                >
                  Starts From
                </Text>
                <TouchableOpacity onPress={this.onDOBPress4.bind(this)}>
                  <View style={styles.datePickerBox}>
                    <Text style={styles.datePickerText}>
                      {this.state.dobText4}{" "}
                    </Text>
                    <DatePickerDialog
                      ref="dobDialog4"
                      onDatePicked={this.onDOBDatePicked4.bind(this)}
                    />
                  </View>
                </TouchableOpacity>
              </Card>

              <View style={{ alignSelf: "center", marginTop: hp("2%") }}>
                <Button
                  onPress={() =>
                    //this.createBlockPostData()
                    this.validation()
                  }
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
                    Add Blocks
                  </Text>
                </Button>
              </View>
              <View style={styles.empty} />
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
    marginTop: hp("2%"),
    marginBottom: hp("1.8%"),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
    fontSize: hp("2.8%"),
    fontWeight: "300",
    color: "#FF8C00"
  },
  associationDetailsView: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: hp("2%")
  },
  titleChildText: {
    fontSize: hp("2.4%"),
    fontWeight: "500",
    fontStyle: "normal",
    marginBottom: hp("1.5%"),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
    color: "orange"
  },
  fillAssociationDetailline: {
    // borderBottomWidth: 1,
    marginTop: hp("1.7%"),
    height: hp("0.1%"),
    flex: 1,
    marginLeft: hp("0.5%"),
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
    marginLeft: wp("5%"),
    marginRight: wp("5%"),
    borderColor: "orange"
  },
  bankDetailLine: {
    borderColor: "white"
  },
  box: {
    borderColor: "#696969",
    borderWidth: hp("0.1%"),
    marginLeft: wp("5%"),
    marginRight: wp("5%"),
    paddingLeft: wp("5%")
  },
  box1: {
    // borderColor: "#696969",
    // borderWidth: hp("0.1%"),
    marginLeft: wp("5%"),
    marginRight: wp("5%"),
    paddingLeft: wp("5%"),
    height: hp("5%"),
    backgroundColor: "#F5F5F5"
  },
  box2: {
    marginLeft: wp("0.5%"),
    marginRight: wp("0.5%"),
    paddingLeft: wp("5%"),
    height: hp("6.3%"),
    backgroundColor: "#F5F5F5"
  },
  datePickerBox: {
    marginLeft: wp("5%"),
    marginRight: wp("5%"),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: hp("0.2%"),
    height: hp("4%"),
    borderColor: "#bfbfbf",
    padding: 0
  },
  datePickerText: {
    fontSize: hp("1.5%"),
    marginLeft: wp("5%"),
    marginRight: wp("5%"),
    color: "#474749"
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
  resetOkButtonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: hp("5%")
  },
  buttonReset: {
    width: wp("20%"),
    height: hp("5%"),
    justifyContent: "center",
    backgroundColor: "#808080"
  },
  buttonOk: {
    width: wp("20%"),
    height: hp("5%"),
    justifyContent: "center",
    backgroundColor: "#FF8C00"
  },
  empty: {
    marginTop: hp("5%"),
    height: hp("2%"),
    backgroundColor: "#FFF"
  },
  box8: {
    borderColor: "#696969",
    borderWidth: hp("0.1%"),
    marginLeft: hp("1.5%"),
    marginRight: hp("1.5%"),
    paddingLeft: hp("1.5%"),
    paddingRight: hp("1.5%"),
    paddingTop: hp("1.5%"),
    height: hp("6%"),
    fontSize: hp("1.8%"),
    color: "black",
    width: hp("50%"),
    alignContent: "center"
  }
})

const mapStateToProps = state => {
  return {
    champBaseURL: state.OyespaceReducer.champBaseURL,
    SelectedAssociationID: state.UserReducer.SelectedAssociationID,
    MyAccountID: state.UserReducer.MyAccountID,
    oyeURL: state.OyespaceReducer.oyeURL  
  };
};

export default connect(mapStateToProps)(AddBlock);

