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
  KeyboardAvoidingView,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Dimensions
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
import CountryPicker, {
  getAllCountries
} from "react-native-country-picker-modal";
import PhoneInput from "react-native-phone-input";
import { Dropdown } from "react-native-material-dropdown";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import { getDashAssociation, getDashSub } from "../src/actions";

let data = [
  {
    value: "Residential",
    id: 1
  },
  {
    value: "Commercial",
    id: 2
  },
  {
    value: "Residential and Commercial",
    id: 3
  }
];

let data1 = [
  {
    value: "Savings",
    id: 1
  },
  {
    value: "Current",
    id: 2
  }
];

class App extends Component {
  static navigationOptions = {
    title: "CreateAssociation",
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      association_Name: "",
      property_Name: "",
      property_Type: "",
      pan_Number: "",
      reg_Number: "",
      country_a: "",
      state: "",
      city: "",
      association_Address: "",
      pinCode: "",
      total_NumberOfBlocks: "",
      total_NumberOfUnits: "",
      emailAssociation: "",
      country: "India",
      selected2: "",
      data1: [],
      cca2: "IN",
      callingCode: "+91",
      bankName: "",
      bankIFSC: "",
      bankAccountNumber: "",
      bankAccountType: "",
      banks: [],

      viewSection: false,
      pan_number_empty_flag: true,
      pan_Number1: "",
      bankAccountNumber1: ""
      // count: 0
    };

    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
  }

  resetAllFields = () => {
    this.textInput_association_Name.setNativeProps({ text: "" });
    this.setState({ association_Name: "" });
    this.textInput_property_Name.setNativeProps({ text: "" });
    this.setState({ property_Name: "" });

    this.setState({ property_Type: "" });

    if (this.state.pan_Number.trim() != "") {
      console.log(this.state.pan_Number, "this.state.pan_Number");
      this.textInput_pan_Number.setNativeProps({ text: "" });
      this.setState({ pan_Number: "" });
    }

    if (this.state.reg_Number.trim() != "") {
      console.log(this.state.reg_Number, "this.state.reg_Number");
      this.textInput_reg_Number.setNativeProps({ text: "" });
      this.setState({ reg_Number: "" });
    }

    this.textInput_state.setNativeProps({ text: "" });
    this.setState({ state: "" });
    this.textInput_city.setNativeProps({ text: "" });
    this.setState({ city: "" });
    this.textInput_association_Address.setNativeProps({ text: "" });
    this.setState({ association_Address: "" });
    this.textInput_pinCode.setNativeProps({ text: "" });
    this.setState({ pinCode: "" });
    this.textInput_total_NumberOfBlocks.setNativeProps({ text: "" });
    this.setState({ total_NumberOfBlocks: "" });
    this.textInput_total_NumberOfUnits.setNativeProps({ text: "" });
    this.setState({ total_NumberOfUnits: "" });
    this.textInput_emailAssociation.setNativeProps({ text: "" });
    this.setState({ emailAssociation: "" });
    this.textInput_bankName.setNativeProps({ text: "" });
    this.setState({ bankName: "" });
    this.textInput_bankIFSC.setNativeProps({ text: "" });
    this.setState({ bankIFSC: "" });
    this.textInput_bankAccountNumber.setNativeProps({ text: "" });
    this.setState({ bankAccountNumber: "" });
    this.phone.selectCountry("in");
  };

  componentDidMount() {
    this.phone.selectCountry("in");
    this.setState({
      pickerData: this.phone.getPickerData()
    });
  }

  onPressFlag() {
    this.countryPicker.openModal();
  }

  selectCountry(country) {
    this.phone.selectCountry(country.cca2.toLowerCase());
    this.setState({ cca2: country.cca2 });
  }

  createAssociationPostData = () => {
    association_Name = this.state.association_Name;
    property_Name = this.state.property_Name;
    property_Type = this.state.property_Type;
    pan_Number = this.state.pan_Number;
    reg_Number = this.state.reg_Number;
    country_a = this.state.country_a;
    state = this.state.state;
    city = this.state.city;
    association_Address = this.state.association_Address;
    pinCode = this.state.pinCode;
    total_NumberOfBlocks = this.state.total_NumberOfBlocks;
    total_NumberOfUnits = this.state.total_NumberOfUnits;
    emailAssociation = this.state.emailAssociation;
    bankName = this.state.bankName;
    bankIFSC = this.state.bankIFSC;
    bankAccountNumber = this.state.bankAccountNumber;
    bankAccountType = this.state.bankAccountType;

    const reg = /^[0]?[6789]\d{9}$/;
    const regTextOnly = /^[a-zA-Z ]+$/;
    //const regTextOnly = /^[a-zA-Z\s]*$/
    const regPIN = /^[0-9]{1,20}$/;
    const oyeNonSpecialRegex = /[^0-9A-Za-z ,]/;

    let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    let regIFSC = /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/;
    var panNumber = this.state.pan_Number.charAt(4);
    var associationName = this.state.association_Name.charAt(4);

    if (association_Name.length == 0) {
      Alert.alert("Association name Cannot be empty");
    } else if (oyeNonSpecialRegex.test(association_Name) === true) {
      alert("Association name should not contain special character");
    } else if (association_Name < 3) {
      alert("Association name should be more than 3 characters");
    } else if (association_Name > 50) {
      alert("Association name should be less than 50 characters");
    } else if (property_Name.length == 0) {
      Alert.alert("Property name cannot be empty");
    } else if (oyeNonSpecialRegex.test(property_Name) === true) {
      alert(" Property name should not contain special character");
    } else if (property_Name < 3) {
      alert("Property name should be more than 3 characters");
    } else if (property_Name > 50) {
      alert("Property name should be less than 50 characters");
    } else if (property_Type == 0) {
      alert("Select property type");
    } else if (country_a.length == 0) {
      alert("Please select country");
    } else if (pan_Number.length === 0 && reg_Number === 0) {
      alert("PAN number or Registration number Cannot be Empty");
    } else if (pan_Number < 10) {
      alert("Invalid PAN number");
    } else if (pan_Number.charAt(4) !== association_Name.charAt(0)) {
      alert("Enter valid PAN number");
    } else if (regpan.test(pan_Number) === false) {
      alert("Enter valid PAN number");
    } else if (state.length == 0) {
      alert("State cannot be empty");
    } else if (regTextOnly.test(state) === false) {
      alert(" State should not contain special character");
    } else if (state > 50) {
      alert("State name should be less than 50 characters");
    } else if (city.length == 0) {
      alert("City cannot be empty");
    } else if (city > 50) {
      alert("City name should be less than 50 characters");
    } else if (regTextOnly.test(city) === false) {
      alert(" City should not contain special character");
    } else if (association_Address.length == 0) {
      alert("Address cannot be empty");
    } else if (regTextOnly.test(association_Address) === false) {
      alert("Address should not contain special character");
    } else if (association_Address > 50) {
      alert("Association address should be less than 50 characters");
    } else if (pinCode.length == 0) {
      alert("Pincode cannot be empty");
    } else if (pinCode.length < 6) {
      alert("Invalid pincode");
    } else if (regPIN.test(pinCode) === false) {
      alert(" PIN code should not contain alphabets and special character");
    } else if (total_NumberOfBlocks.length == 0) {
      alert(" Number of blocks cannot be Empty");
    } else if (total_NumberOfBlocks == 0) {
      alert("Number of blocks cannot be empty");
    } else if (total_NumberOfBlocks === "0") {
      Alert.alert(" Number of blocks cannot be zero");
    } else if (total_NumberOfBlocks.length < 1) {
      alert("Number of blocks should at least be 1");
    } else if (regPIN.test(total_NumberOfBlocks) === false) {
      alert(
        "Number of blocks should not contain alphabets and special character"
      );
    } else if (total_NumberOfBlocks > 99) {
      alert("Number of blocks should not be more than 99");
    } else if (total_NumberOfUnits.length == 0) {
      alert("Number of units cannot be empty");
    } else if (total_NumberOfUnits === "0") {
      Alert.alert(" Number of units cannot be zero");
    } else if (total_NumberOfUnits === 0) {
      Alert.alert("Number of units cannot be zero");
    } else if (total_NumberOfUnits > 99) {
      alert("Number of units should not be more than 99");
    } else if (regPIN.test(total_NumberOfUnits) === false) {
      alert(
        "Number of units should not contain alphabets and special character"
      );
    } else if (regemail.test(emailAssociation) === false) {
      Alert.alert("Enter valid email ID of association");
    } else if (emailAssociation.length == 0) {
      alert("Email cannot be empty");
    } else if (bankName.length == 0) {
      Alert.alert("Bank name cannot be empty");
    } else if (regTextOnly.test(bankName) === false) {
      alert("Enter valid bank name");
    } else if (bankIFSC.length == 0) {
      alert("IFSC cannot be empty");
    } else if (regIFSC.test(bankIFSC) === false) {
      alert("Enter valid IFSC");
    } else if (bankAccountNumber.length == 0) {
      alert("Bank account number cannot be empty");
    } else if (bankAccountNumber.length < 10) {
      alert("Enter valid bank account number");
    } else if (bankAccountNumber.length > 18) {
      alert("Enter valid bank account number");
    } else if (bankAccountType === 0) {
      alert("Select bank account type");
    } else if (regPIN.test(bankAccountNumber) === false) {
      alert("Enter valid Bank account number");
    } else if (pan_Number != 0 && bankAccountNumber != 0) {
      this.validationbank();
      return;
    }
  };

  validationbank = () => {
    let pan_Number = this.state.pan_Number;
    let bankAccountNumber = this.state.bankAccountNumber;

    fetch(
      `http://${
        this.props.oyeURL
      }/oyeliving/api/v1/association/getassociationlist`,
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
        console.log(
          responseJson,
          "*******************************************"
        );
        var count = Object.keys(responseJson.data.associations).length;

        for (var i = 0; i < count; i++) {
          console.log("hfjshgkfh", responseJson.data.associations[i].aspanNum);

          if (pan_Number === responseJson.data.associations[i].aspanNum) {
            alert("Pan Number already used");
            return;
          } else if (responseJson.data.associations[i].bankDetails.length > 0) {
            if (
              bankAccountNumber ===
              responseJson.data.associations[i].bankDetails[0].baActNo
            ) {
              alert("Bank Account Number already used");
              return;
            }
          }
        }

        this.createassocition();
      })
      .catch(error => {
        console.log(error, "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
      });
  };

  createassocition = () => {
    const { MyAccountID } = this.props.userReducer;
    const { oyeURL } = this.props.oyespaceReducer;

    fetch(`http://${this.props.oyeURL}/oyeliving/api/v1/association/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
      },
      body: JSON.stringify({
        ACAccntID: this.props.MyAccountID,
        association: {
          ASAddress: association_Address,

          ASCountry: country_a,

          ASCity: city,

          ASState: state,

          ASPinCode: pinCode,

          ASAsnLogo: "Images/c1.img",
          ASAsnName: association_Name,

          ASPrpName: property_Name,

          ASPrpType: property_Type,

          ASRegrNum: reg_Number,

          ASWebURL: "www.spectra.com",
          ASAsnEmail: emailAssociation,
          ASPANStat: "False",
          ASPANNum: pan_Number,

          ASPANDoc: "",
          ASNofBlks: total_NumberOfBlocks,

          ASNofUnit: total_NumberOfUnits,

          ASGSTNo: "",
          ASTrnsCur: "Rupees",
          ASRefCode: "",
          ASOTPStat: "ON",
          ASOPStat: "ON",
          ASONStat: "ON",
          ASOMStat: "ON",
          ASOLOStat: "ON",
          ASGPSPnt: "",
          ASFaceDet: "",
          BankDetails: [
            {
              BABName: bankName,
              BAActType: bankAccountType,
              BAActNo: bankAccountNumber,
              BAIFSC: bankIFSC,
              BAActBal: 1
            }
          ],
          Amenities: [
            {
              AMType: "ClubHouse",
              NoofAmenities: 2
            }
          ]
        }
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        alert("Association Created");
        getDashAssociation(oyeURL, MyAccountID);
        this.props.navigation.navigate("ResDashBoard");
      })

      .catch(error => {
        alert("error", error);
      });
  };

  addItem = () => {
    // const banks = this.state.banks.map((bank, index) => {
    if (this.state.viewSection) {
      return (
        // <View key={bank + index}>
        <Card style={{ height: hp("46%") }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Text
              style={{
                color: "#38BCDB",
                marginLeft: wp("5%"),
                fontSize: hp("2.2%"),
                marginVertical: hp("1%")
              }}
            >
              Bank {this.setState.count}
            </Text>
            <Image
              style={styles.deleteImageStyle}
              source={require("../icons/delete.png")}
            />
          </View>
          <Text
            style={{
              color: "#696969",
              marginLeft: wp("5%"),
              fontSize: hp("2%"),
              marginVertical: hp("1%")
            }}
          >
            Bank Name
          </Text>
          <Item style={styles.bankDetailLine}>
            <Input
              style={styles.box}
              placeholder="Enter Bank Name"
              autoCorrect={false}
              autoCapitalize="characters"
              keyboardType="default"
              ref={text => (this.textInput_bankName = text)}
              onChangeText={bankName => this.setState({ bankName: bankName })}
            />
          </Item>
          <View style={{ flexDirection: "row", marginTop: hp("1%") }}>
            <View style={{ height: hp("5%"), width: wp("40%") }}>
              <Text
                style={{
                  color: "#696969",
                  marginLeft: wp("5%"),
                  fontSize: hp("2%"),
                  marginVertical: hp("1%")
                }}
              >
                IFSC
              </Text>
              <Item style={styles.bankDetailLine}>
                <Input
                  style={styles.box}
                  placeholder="IFSC"
                  // underlineColorAndroid="orange"
                  autoCorrect={false}
                  autoCapitalize="characters"
                  keyboardType="default"
                  ref={text => (this.textInput_bankIFSC = text)}
                  onChangeText={bankIFSC =>
                    this.setState({ bankIFSC: bankIFSC })
                  }
                />
              </Item>
            </View>
            <View style={{ height: hp("5%"), width: wp("60%") }}>
              <Text
                style={{
                  color: "#696969",
                  marginLeft: wp("5%"),
                  fontSize: hp("2%"),
                  marginVertical: hp("1%")
                }}
              >
                Account Number
              </Text>
              <Item style={styles.bankDetailLine}>
                <Input
                  style={styles.box}
                  placeholder="Account Number"
                  // underlineColorAndroid="orange"
                  autoCorrect={false}
                  autoCapitalize="characters"
                  keyboardType="default"
                  ref={text => (this.textInput_bankAccountNumber = text)}
                  onChangeText={bankAccountNumber =>
                    this.setState({
                      bankAccountNumber: bankAccountNumber
                    })
                  }
                />
              </Item>
            </View>
          </View>

          <View style={{ flexDirection: "row", marginTop: hp("7%") }}>
            <View style={{ height: hp("5%"), width: wp("70%") }}>
              <Text
                style={{
                  color: "#696969",
                  marginLeft: wp("5%"),
                  fontSize: hp("2%"),
                  marginVertical: hp("1%")
                }}
              >
                Account Type
              </Text>

              <Item style={styles.bankDetailLine}>
                <Dropdown
                  containerStyle={styles.box1}
                  dropdownPosition={-1}
                  // label="Select Account Type"
                  style={{ fontSize: hp("2%") }}
                  value={"Savings"}
                  textColor="#3A3A3C"
                  labelHeight={hp("0.7%")}
                  data={data1}
                  inputContainerStyle={{ borderBottomColor: "transparent" }}
                  onChangeText={bankAccountType =>
                    this.setState({ bankAccountType: bankAccountType })
                  }
                />
              </Item>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",

                justifyContent: "space-evenly"
              }}
            >
              <Image
                style={styles.circleImageStyle}
                source={require("../icons/circle.png")}
              />
              <Text
                style={{
                  marginLeft: hp("0.5%"),
                  fontSize: hp("2%"),
                  marginVertical: hp("5.4%")
                }}
              >
                Default
              </Text>
            </View>
          </View>
        </Card>
      );
    }
  };

  buttonPress = () => {
    this.setState({ viewSection: true });
  };
  render() {
    return (
      <View>
        <SafeAreaView style={{ backgroundColor: "orange" }}>
          <View style={[styles.viewStyle, { flexDirection: "row" }]}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginLeft: 20
                }}
              >
                <Image
                  source={require("../icons/backBtn.png")}
                  style={{ width: 20, height: 20 }}
                />
              </View>
            </TouchableOpacity>

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

        <KeyboardAwareScrollView>
          <View style={styles.textWrapper}>
            <Text style={styles.titleText}>Create Association</Text>

            <View style={styles.associationDetailsView}>
              <Text style={styles.titleChildText}>
                Fill Association Details
              </Text>
              <View style={styles.fillAssociationDetailline} />
            </View>

            <ScrollView>
              {/* ******************************* */}
              <View style={styles.container}>
                <Card style={styles.myProfileCardsStyle}>
                  <Item stackedLabel style={styles.cardItemsStyle}>
                    <Text style={styles.itemTextTitles}>Association Name:</Text>
                    <Input
                      style={styles.itemTextValues}
                      autoCorrect={false}
                      autoCapitalize="words"
                      multiline={false}
                      maxLength={50}
                      textAlign={"justify"}
                      keyboardType="default"
                      placeholder="Enter Association Name"
                      ref={text => (this.textInput_association_Name = text)}
                      onChangeText={association_Name =>
                        this.setState({
                          association_Name: association_Name
                        })
                      }
                    />
                  </Item>
                  <Item stackedLabel style={styles.cardItemsStyle}>
                    <Text style={styles.itemTextTitles}>Property Name:</Text>
                    <Input
                      style={styles.itemTextValues}
                      autoCorrect={false}
                      autoCapitalize="words"
                      multiline={false}
                      maxLength={50}
                      textAlign={"justify"}
                      keyboardType="default"
                      placeholder="Enter Property Name"
                      ref={text => (this.textInput_property_Name = text)}
                      onChangeText={property_Name =>
                        this.setState({ property_Name: property_Name })
                      }
                    />
                  </Item>
                </Card>

                <Card style={styles.myProfileCardsStyle}>
                  <Item stackedLabel style={styles.cardItemsStyle}>
                    <Dropdown
                      containerStyle={{
                        flex: 1,
                        width: wp("90%"),
                        marginLeft: hp("2%"),
                        height: hp("3%"),
                        marginRight: hp("2%")
                      }}
                      dropdownPosition={-4}
                      // defaultIndex={-1}
                      label="Select Property Type"
                      style={{ fontSize: hp("2%") }}
                      value={data.value}
                      textColor="#3A3A3C"
                      data={data}
                      inputContainerStyle={{ borderBottomColor: "transparent" }}
                      //ref={text => (this.textInput_property_Type = text)}
                      onChangeText={property_Type =>
                        this.setState({ property_Type: property_Type })
                      }
                    />
                  </Item>
                </Card>

                <Card style={styles.myProfileCardsStyle}>
                  <Item stackedLabel style={styles.countryPickerCardItemStyle}>
                    <Text style={styles.itemTextTitles}>
                      Country
                      <Text
                        style={{
                          fontSize: hp("2%"),
                          textAlignVertical: "center",
                          color: "red"
                        }}
                      >
                        *
                      </Text>
                    </Text>
                    <View style={styles.countryPickerStyle}>
                      <PhoneInput
                        ref={ref => {
                          this.phone = ref;
                        }}
                        onPressFlag={this.onPressFlag}
                      />

                      <CountryPicker
                        ref={ref => {
                          this.countryPicker = ref;
                        }}
                        onChange={value => {
                          this.setState({
                            cca2: value.cca2,
                            callingCode: value.callingCode,
                            country: this.selectCountry(value),
                            country_a: value.name
                          });
                        }}
                        translation="eng"
                        cca2={this.state.cca2}
                      >
                        <View />
                      </CountryPicker>
                    </View>
                  </Item>
                  <Item stackedLabel style={styles.cardItemsStyle}>
                    {this.state.cca2 == "IN" ? (
                      <Item stackedLabel style={styles.cardItemsStyle}>
                        <Text style={styles.itemTextTitles}>PAN Number:</Text>
                        <Input
                          style={styles.itemTextValues}
                          autoCorrect={false}
                          autoCapitalize="words"
                          multiline={false}
                          textAlign={"justify"}
                          keyboardType="default"
                          placeholder="Enter PAN Number"
                          ref={text => (this.textInput_pan_Number = text)}
                          onChangeText={pan_Number => {
                            this.setState({ pan_number_empty_flag: false });
                            return this.setState({ pan_Number: pan_Number });
                          }}
                        />
                      </Item>
                    ) : (
                      <Item stackedLabel style={styles.cardItemsStyle}>
                        <Text style={styles.itemTextTitles}>
                          Registration Number:
                        </Text>
                        <Input
                          style={styles.itemTextValues}
                          autoCorrect={false}
                          autoCapitalize="words"
                          multiline={false}
                          maxLength={25}
                          textAlign={"justify"}
                          keyboardType="default"
                          placeholder="Enter Registration Number"
                          ref={text => (this.textInput_reg_Number = text)}
                          onChangeText={reg_Number =>
                            this.setState({ reg_Number: reg_Number })
                          }
                        />
                      </Item>
                    )}
                  </Item>
                </Card>

                <Card style={styles.myProfileCardsStyle}>
                  <Item stackedLabel style={styles.cardItemsStyle}>
                    <Text style={styles.itemTextTitles}>Select State:</Text>
                    <Input
                      style={styles.itemTextValues}
                      autoCorrect={false}
                      autoCapitalize="words"
                      multiline={false}
                      maxLength={50}
                      textAlign={"justify"}
                      keyboardType="default"
                      placeholder="Enter State"
                      ref={text => (this.textInput_state = text)}
                      onChangeText={state => this.setState({ state: state })}
                    />
                  </Item>
                  <Item stackedLabel style={styles.cardItemsStyle}>
                    <Text style={styles.itemTextTitles}>City:</Text>
                    <Input
                      style={styles.itemTextValues}
                      autoCorrect={false}
                      autoCapitalize="words"
                      multiline={false}
                      maxLength={50}
                      textAlign={"justify"}
                      keyboardType="default"
                      placeholder="Enter City"
                      ref={text => (this.textInput_city = text)}
                      onChangeText={city => this.setState({ city: city })}
                    />
                  </Item>
                  <Item stackedLabel style={styles.cardItemsStyle}>
                    <Text style={styles.itemTextTitles}>
                      Association Address:
                    </Text>
                    <Input
                      style={styles.itemTextValues}
                      autoCorrect={false}
                      autoCapitalize="words"
                      multiline={false}
                      maxLength={50}
                      textAlign={"justify"}
                      keyboardType="default"
                      placeholder="Enter Association Address"
                      ref={text => (this.textInput_association_Address = text)}
                      onChangeText={association_Address =>
                        this.setState({
                          association_Address: association_Address
                        })
                      }
                    />
                  </Item>
                  <Item stackedLabel style={styles.cardItemsStyle}>
                    <Text style={styles.itemTextTitles}>Pincode:</Text>
                    <Input
                      style={styles.itemTextValues}
                      autoCorrect={false}
                      autoCapitalize="words"
                      multiline={false}
                      textAlign={"justify"}
                      keyboardType="number-pad"
                      placeholder="Enter Pincode"
                      ref={text => (this.textInput_pinCode = text)}
                      onChangeText={pinCode =>
                        this.setState({ pinCode: pinCode })
                      }
                    />
                  </Item>
                </Card>

                <Card style={styles.myProfileCardsStyle}>
                  <Item stackedLabel style={styles.cardItemsStyle}>
                    <Text style={styles.itemTextTitles}>
                      Total Number of Blocks:
                    </Text>
                    <Input
                      style={styles.itemTextValues}
                      autoCorrect={false}
                      autoCapitalize="words"
                      multiline={false}
                      maxLength={3}
                      textAlign={"justify"}
                      keyboardType="number-pad"
                      placeholder="Enter Total Number of Blocks"
                      ref={text => (this.textInput_total_NumberOfBlocks = text)}
                      onChangeText={total_NumberOfBlocks =>
                        this.setState({
                          total_NumberOfBlocks: total_NumberOfBlocks
                        })
                      }
                    />
                  </Item>
                  <Item stackedLabel style={styles.cardItemsStyle}>
                    <Text style={styles.itemTextTitles}>
                      Total Number of Units:
                    </Text>
                    <Input
                      style={styles.itemTextValues}
                      autoCorrect={false}
                      autoCapitalize="words"
                      multiline={false}
                      maxLength={3}
                      textAlign={"justify"}
                      keyboardType="number-pad"
                      placeholder="Enter Total Number of Units"
                      ref={text => (this.textInput_total_NumberOfUnits = text)}
                      onChangeText={total_NumberOfUnits =>
                        this.setState({
                          total_NumberOfUnits: total_NumberOfUnits
                        })
                      }
                    />
                  </Item>
                </Card>

                <Card style={styles.myProfileCardsStyle}>
                  <Item stackedLabel style={styles.cardItemsStyle}>
                    <Text style={styles.itemTextTitles}>
                      EmailID Of Association:
                    </Text>
                    <Input
                      style={styles.itemTextValues}
                      autoCorrect={false}
                      autoCapitalize="none"
                      multiline={false}
                      maxLength={50}
                      textAlign={"justify"}
                      keyboardType="email-address"
                      placeholder="Enter EmailID Of Association"
                      ref={text => (this.textInput_emailAssociation = text)}
                      onChangeText={emailAssociation =>
                        this.setState({
                          emailAssociation: emailAssociation
                        })
                      }
                    />
                  </Item>
                </Card>
              </View>

              <View style={styles.associationDetailsView}>
                <Text style={styles.titleChildText}>Bank Details</Text>
                <View style={styles.fillAssociationDetailline} />
              </View>

              <Card style={{ height: hp("42%") }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <Text
                    style={{
                      color: "#38BCDB",
                      marginLeft: wp("5%"),
                      fontSize: hp("2.2%"),
                      marginVertical: hp("1%")
                    }}
                  >
                    Bank
                    {/* {this.setState.count} */}
                  </Text>
                </View>
                <Text
                  style={{
                    color: "#696969",
                    marginLeft: wp("5%"),
                    fontSize: hp("2%"),
                    marginVertical: hp("1%")
                  }}
                >
                  Bank Name
                </Text>
                <Item style={styles.bankDetailLine}>
                  <Input
                    style={styles.box}
                    placeholder="Enter Bank Name"
                    autoCorrect={false}
                    maxLength={50}
                    autoCapitalize="characters"
                    keyboardType="default"
                    ref={text => (this.textInput_bankName = text)}
                    onChangeText={bankName =>
                      this.setState({ bankName: bankName })
                    }
                  />
                </Item>
                <View style={{ flexDirection: "row", marginTop: hp("1%") }}>
                  <View style={{ height: hp("5%"), width: wp("40%") }}>
                    <Text
                      style={{
                        color: "#696969",
                        marginLeft: wp("5%"),
                        fontSize: hp("2%"),
                        marginVertical: hp("1%")
                      }}
                    >
                      IFSC
                    </Text>
                    <Item style={styles.bankDetailLine}>
                      <Input
                        style={styles.box}
                        placeholder="IFSC"
                        // underlineColorAndroid="orange"
                        maxLength={20}
                        autoCorrect={false}
                        autoCapitalize="characters"
                        keyboardType="default"
                        ref={text => (this.textInput_bankIFSC = text)}
                        onChangeText={bankIFSC =>
                          this.setState({ bankIFSC: bankIFSC })
                        }
                      />
                    </Item>
                  </View>
                  <View style={{ height: hp("5%"), width: wp("60%") }}>
                    <Text
                      style={{
                        color: "#696969",
                        marginLeft: wp("5%"),
                        fontSize: hp("2%"),
                        marginVertical: hp("1%")
                      }}
                    >
                      Account Number
                    </Text>
                    <Item style={styles.bankDetailLine}>
                      <Input
                        style={styles.box}
                        placeholder="Account Number"
                        // underlineColorAndroid="orange"
                        maxLength={30}
                        autoCorrect={false}
                        autoCapitalize="characters"
                        keyboardType="number-pad"
                        ref={text => (this.textInput_bankAccountNumber = text)}
                        onChangeText={bankAccountNumber =>
                          this.setState({
                            bankAccountNumber: bankAccountNumber
                          })
                        }
                      />
                    </Item>
                  </View>
                </View>

                <View style={{ flexDirection: "row", marginTop: hp("7%") }}>
                  <View style={{ height: hp("5%"), width: wp("70%") }}>
                    <Text
                      style={{
                        color: "#696969",
                        marginLeft: wp("5%"),
                        fontSize: hp("2%"),
                        marginVertical: hp("1%")
                      }}
                    >
                      Account Type
                    </Text>

                    <Item style={styles.bankDetailLine}>
                      <Dropdown
                        containerStyle={styles.box1}
                        dropdownPosition={-1}
                        // defaultIndex={-1}
                        // label="Select Account Type"
                        style={{ fontSize: hp("2%") }}
                        value={"Savings"}
                        textColor="#3A3A3C"
                        labelHeight={hp("0.7%")}
                        data={data1}
                        onChangeText={bankAccountType =>
                          this.setState({ bankAccountType: bankAccountType })
                        }
                      />
                    </Item>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",

                      justifyContent: "space-evenly"
                    }}
                  >
                    <Image
                      style={styles.circleImageStyle}
                      source={require("../icons/circle.png")}
                    />
                    <Text
                      style={{
                        marginLeft: hp("0.5%"),
                        fontSize: hp("2%"),
                        marginVertical: hp("5.4%")
                      }}
                    >
                      Default
                    </Text>
                  </View>
                </View>
              </Card>

              <View style={styles.resetOkButtonView}>
                <Button
                  rounded
                  light
                  style={styles.buttonReset}
                  onPress={this.resetAllFields.bind()}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: hp("2%")
                    }}
                  >
                    Reset
                  </Text>
                </Button>
                <Button
                  rounded
                  warning
                  style={styles.buttonOk}
                  onPress={() => {
                    this.createAssociationPostData();
                  }}
                  // onPress={this.resetAllFields.bind()}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: hp("2%")
                    }}
                  >
                    Submit
                  </Text>
                </Button>
              </View>
              <View style={styles.empty} />
            </ScrollView>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textWrapper: {
    height: hp("85%"), // 70% of height device screen
    width: wp("100%") // 80% of width device screen
  },

  container: {
    flex: 1,
    margin: hp("0.5%"),
    marginBottom: hp("5%")
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

  titleChildText: {
    fontSize: hp("2.4%"),
    fontWeight: "300",
    fontStyle: "normal",
    marginBottom: hp("1.5%"),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
    color: "#000000"
  },

  cardItem: {
    padding: hp("1.5%"),
    marginBottom: hp("5%")
  },

  empty: {
    marginTop: hp("5%"),
    height: hp("2%"),
    backgroundColor: "#FFF"
  },

  buttonOk: {
    width: wp("20%"),
    height: hp("5%"),
    justifyContent: "center",
    backgroundColor: "#FF8C00"
  },

  buttonReset: {
    width: wp("20%"),
    height: hp("5%"),
    justifyContent: "center",
    backgroundColor: "#808080"
  },

  cardItemsStyle: {
    alignItems: "flex-start",
    justifyContent: "flex-start"
    // flexDirection: "row"
  },
  countryPickerCardItemStyle: {
    //alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center"
  },
  itemTextTitles: {
    marginTop: hp("1%"),
    marginLeft: hp("2%"),
    fontSize: hp("2.1%"),
    fontWeight: "300",
    // fontStyle: "italic",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  itemTextValues: {
    marginLeft: hp("1.5%"),
    fontSize: hp("2.1%"),
    fontWeight: "300",
    paddingTop: hp("1%"),
    paddingBottom: hp("0.4%"),
    paddingHorizontal: 0,
    height: hp("2%"),
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  associationDetailsView: {
    justifyContent: "space-between",
    flexDirection: "row",
    // alignItems: "stretch",
    marginTop: hp("0.2%"),
    marginLeft: hp("1%"),
    marginRight: hp("1%")
  },
  fillAssociationDetailline: {
    // borderBottomWidth: 1,
    marginTop: hp("1.7%"),
    height: hp("0.1%"),
    width: hp("20%"),
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    backgroundColor: "#696969"
  },
  resetOkButtonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: hp("5%")
  },
  countryPickerStyle: {
    marginLeft: hp("4%"),
    marginTop: hp("1.2%")
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
  deleteImageStyle: {
    width: hp("2.8%"),
    height: hp("2.8%"),
    marginRight: hp("2%")
  },
  circleImageStyle: {
    width: hp("2.5%"),
    height: hp("2.5%")
  },
  box1: {
    borderColor: "#DCDCE5",
    borderWidth: hp("0.1%"),
    marginLeft: wp("5%"),
    marginRight: wp("5%"),
    paddingLeft: wp("5%"),
    height: hp("5%"),
    backgroundColor: "#DCDCE5",
    width: hp("25%")
  },

  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  },
  image: {
    width: wp("24%"),
    height: hp("10%")
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
  emptyViewStyle: {
    flex: 1
  }
});

const mapStateToProps = state => {
  return {
    MyFirstName: state.UserReducer.MyFirstName,
    MyLastName: state.UserReducer.MyLastName,
    MyEmail: state.UserReducer.MyEmail,
    MyMobileNumber: state.UserReducer.MyMobileNumber,
    MyISDCode: state.UserReducer.MyISDCode,

    joinedAssociations: state.AppReducer.joinedAssociations,
    champBaseURL: state.OyespaceReducer.champBaseURL,
    oyeURL: state.OyespaceReducer.oyeURL,
    MyAccountID: state.UserReducer.MyAccountID,
    userReducer: state.UserReducer,
    oyespaceReducer: state.OyespaceReducer
  };
};

export default connect(
  mapStateToProps,
  {
    getDashSub,
    getDashAssociation
  }
)(App);

