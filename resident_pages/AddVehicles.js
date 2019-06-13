/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
// import Header from "./components/common/Header";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { Card, CardItem, Form, Item, Label, Input, Button } from "native-base";
// import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RadioGroup, RadioButton } from "react-native-flexi-radio-button";
import {connect} from 'react-redux';

var radio_props = [
  { label: "Two Wheeler", value: 0 },
  { label: "Four Wheeler", value: 1 }
];

class AddVehicle extends Component {
  static navigationOptions = {
    title: "Add Vehicle",
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      text:"",
      vehName: "",
      vehNum: "",
      vehStickerNum: "",
      parkingSlotNum: ""
    };
  }

  createVehicle = () => {
    value = this.state.text;
    vehName = this.state.vehName;
    vehNum = this.state.vehNum;
    vehStickerNum = this.state.vehStickerNum;
    parkingSlotNum = this.state.parkingSlotNum;

    //regex code
    const oyeNonSpecialRegex = /[^0-9A-Za-z ]/;

    if (vehName.length == 0 || vehName == "") {
      Alert.alert("Enter Vehicle Name");
      return false;
    } else if (vehNum.length == 0 || vehNum == "") {
      Alert.alert("Enter Vehicle Number");
      return false;
    } else if (vehStickerNum.length == 0 || vehStickerNum == "") {
      Alert.alert("Enter Sticker Number");
      return false;
    } else if (parkingSlotNum.length == 0 || parkingSlotNum == "") {
      Alert.alert("Enter Parking Slot Number");
      return false;
    } else if (oyeNonSpecialRegex.test(vehName) === true) {
      Alert.alert("Vehicle Name should not contain special character");
      return false;
    } else if (oyeNonSpecialRegex.test(vehNum) === true) {
      Alert.alert("Vehicle Number should not contain special character");
      return false;
    } else if (oyeNonSpecialRegex.test(vehStickerNum) === true) {
      Alert.alert(
        "Vehicle Sticker Number should not contain special character"
      );
      return false;
    } else if (oyeNonSpecialRegex.test(parkingSlotNum) === true) {
      Alert.alert("Parking Slot Number should not contain special character");
      return false;
    } else {
      fetch(`http://${this.props.oyeURL}/oyeliving/api/v1/Vehicle/Create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
        },
        body: JSON.stringify({
          VERegNo: vehNum,
          VEType: value,
          VEMakeMdl: vehName,
          VEStickNo: vehStickerNum,
          UNUnitID: this.props.SelectedUnitID,
          MEMemID: this.props.MyOYEMemberID,
          UPID: "28",
          UPLNum: parkingSlotNum,
          ASAssnID: this.props.SelectedAssociationID
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          Alert.alert("Data Saved");
          console.log("Manas", responseJson);
          this.props.navigation.goBack();
        })
        .catch(error => Alert.alert("Data not saved", error));
    }
  };
  onSelect(index, value) {
    this.setState({
      text:  `${value}`
    });
  }
  render() {
    return (
      <View style={styles.container}>
        {/* <Header/> */}
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
                    alignItems: 'flex-start',
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
        
        <Text style={styles.titleOfScreen}>Add Vehicle</Text>
        <View style={[styles.containers, { flex: 1, flexDirection: "column" ,}]}>
          <View
            style={{
              alignItems: "center",
              justifyContent:'space-around',
              flexDirection: "row",
              backgroundColor: "#DAE0E2",
              height: hp("7%")
            }}
          >
            {/* <RadioForm style={{marginTop:hp('1%')}}
                      radio_props={radio_props}
                      initial={0}
                      formHorizontal={true}
                      labelHorizontal={true}
                      buttonColor={'#2196f3'}
                      animation={true}
                      selectedButtonColor={'orange'}
                      selectedLabelColor = {'orange'}
                      buttonWrapStyle={{margin: wp('10%')}}
                      labelStyle={{fontSize:hp('1.5%')}}
                      onPress={(value) => {this.setState({value:value})}}
                    /> */}
            <RadioGroup
              style={{ flexDirection: "row" }}
              onSelect={(index, value) => this.onSelect(index, value)}
            >
              <RadioButton value={"Two Wheeler"}>
                <Text>Two Wheeler</Text>
              </RadioButton>

              <RadioButton value={"Four Wheeler"}>
                <Text>Four Wheeler</Text>
              </RadioButton>
            </RadioGroup>
          </View>
          {/* <Text style={styles.text}>{this.state.text}</Text> */}
          <KeyboardAwareScrollView>
            <Form>
              <Item style={styles.inputItem} floatingLabel>
                <Label>Vehicle Name</Label>
                <Input
                  // underlineColorAndroid="orange"
                  autoCorrect={false}
                  autoCapitalize="characters"
                  keyboardType="default"
                  onChangeText={vehName => this.setState({ vehName: vehName })}
                />
              </Item>
              <Item style={styles.inputItem} floatingLabel>
                <Label>Vehicle Number</Label>
                <Input
                  // underlineColorAndroid="orange"
                  autoCorrect={false}
                  autoCapitalize="characters"
                  keyboardType="default"
                  onChangeText={vehNum => this.setState({ vehNum: vehNum })}
                />
              </Item>
              <Item style={styles.inputItem} floatingLabel>
                <Label>Vehicle Sticker Number</Label>
                <Input
                  // underlineColorAndroid="orange"
                  autoCorrect={false}
                  autoCapitalize="none"
                  maxLength={10}
                  keyboardType="number-pad"
                  onChangeText={vehStickerNum =>
                    this.setState({ vehStickerNum: vehStickerNum })
                  }
                />
              </Item>
              <Item style={styles.inputItem} floatingLabel>
                <Label>Parking Slot Number</Label>
                <Input
                  // underlineColorAndroid="orange"
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  onChangeText={parkingSlotNum =>
                    this.setState({ parkingSlotNum: parkingSlotNum })
                  }
                />
              </Item>
            </Form>
            <View style={styles.buttonStyle}>
              <Button
                bordered
                info
                style={styles.buttonCancel}
                onPress={() => this.props.navigation.goBack()}
              >
                <Text style={styles.textFamilyVehicle}>Cancel</Text>
              </Button>
              <Button
                bordered
                warning
                style={styles.buttonAdd}
                onPress={() => this.createVehicle()}
              >
                <Text style={styles.textFamilyVehicle}>Add Vehicle</Text>
              </Button>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  containers: {},
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
  titleOfScreen: {
    marginTop: hp("1.6%"),
    textAlign: "center",
    fontSize: hp("2%"),
    fontWeight: "bold",
    color: "black",
    marginBottom: hp("1.6%")
  },
  inputItem: {
    marginLeft: wp("5%"),
    marginRight: wp("5%"),
    borderColor: "orange"
  },
  buttonStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("4%"),
    marginBottom: hp("2%"),
    marginHorizontal: hp("2%")
  },
  buttonCancel: {
    width: wp("32%"),
    height: hp("5%"),
    borderRadius: hp("2.5%"),
    borderWidth: hp("0.2%"),
    borderColor: "#bcbcbc",
    backgroundColor: "#bcbcbc",
    justifyContent: "center"
  },
  textFamilyVehicle: {
    color: "white",
    fontWeight: "600",
    fontSize: hp("2%")
  },
  buttonAdd: {
    width: wp("32%"),
    height: hp("5%"),
    borderRadius: hp("2.5%"),
    borderWidth: hp("0.2%"),
    borderColor: "orange",
    backgroundColor: "orange",
    justifyContent: "center"
  }
});

const mapStateToProps = state => {
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        SelectedAssociationID:state.UserReducer.SelectedAssociationID,
        MyAccountID: state.UserReducer.MyAccountID,
        SelectedUnitID:state.UserReducer.SelectedUnitID,
        MyOYEMemberID: state.UserReducer.MyOYEMemberID,
    }
}

export default connect(mapStateToProps)(AddVehicle);