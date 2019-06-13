/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard,Dimensions,SafeAreaView,Image, TouchableOpacity} from 'react-native';
// import Header from './components/common/Header'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Card,CardItem, Form, Item, Label, Input, Button, } from "native-base";
// import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RadioGroup, RadioButton } from "react-native-flexi-radio-button";
import {connect} from 'react-redux';

var radio_props = [
  {label: 'Two Vehicle', value: 0 },
  {label: 'Four Vehicle', value: 1 }
];

class EditVehicle extends Component {

    static navigationOptions = {
        title: "Edit Vehicle",
        header:null
    }

    constructor(props) {
      super(props);
      this.state = {
        value: 0,
        text:"",
        vehName:"",
        vehNum:"",
        vehStickerNum:"",
        parkingSlotNum:""
      }
    }

    componentWillMount() {
      this.setState({
        vehName: this.props.navigation.state.params.VehName ? 
          this.props.navigation.state.params.VehName
            : ""
      })
  
      this.setState({
        vehNum: this.props.navigation.state.params.VehNum ? 
        this.props.navigation.state.params.VehNum
        : ""
      })
  
      this.setState({
        vehStickerNum: this.props.navigation.state.params.VehStickerNum ? 
        this.props.navigation.state.params.VehStickerNum
        : ""
      })
  
      this.setState({
        parkingSlotNum: this.props.navigation.state.params.VehParkingSlotNum ? 
        this.props.navigation.state.params.VehParkingSlotNum
        : ""
      })
    }

    myFamilyUpdate = () => {
      const {
        VehName,
        VehNum,
        VehStickerNum,
        VehParkingSlotNum,
      } = this.props.navigation.state.params

      value = this.state.text;
      vehName = this.state.vehName
      vehNum = this.state.vehNum
      vehStickerNum = this.state.vehStickerNum
      parkingSlotNum = this.state.parkingSlotNum
  
      const reg = /^[0]?[6789]\d{9}$/
      const OyeFullName = /^[a-zA-Z ]+$/
  
      if (vehName.length == 0) {
        Alert.alert("Vehicle Name should not be empty")
      } else if (OyeFullName.test(vehName) === false) {
        alert("Enter valid Vehicle Name")
        return false
      } else if (fname.length < 3) {
        Alert.alert("Vehicle Name should be more than 3 letters")
      } else if (vehNum.length == 0) {
        Alert.alert("Vehicle Number cannot be empty")
      } else if (vehStickerNum.length == 0) {
        Alert.alert("vehicle Sticker Number should not be empty")
      } else if (parkingSlotNum.length == 0) {
        Alert.alert("Parking Slot Number should not be empty")
      } else {
        fetch(
            `http://${this.props.oyeURL}/oyesafe/api/v1/FamilyMemberDetails/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
            },
            body: JSON.stringify({
              FMName: vehName.length <= 0 ? VehName : vehName,
              
              FMRltn: vehNum.length <= 0 ? VehNum : vehNum,
              FMAge: vehStickerNum.length <= 0 ? VehStickerNum : vehStickerNum,
              FMFlag: parkingSlotNum.length <= 0 ? VehParkingSlotNum : parkingSlotNum
            })
          }
        )
          .then(responseData => responseData.json())
          .then(responseJson => {
            //Alert.alert("Saved")
            this.props.navigation.goBack()
            // this.setState({
            //   datasource: responseJson
  
            // })
          })
  
          .catch(error => {
            console.log(error)
            // Alert.alert("Upload Fail");
          })
      }
    }
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

        <Text style={styles.titleOfScreen}>Edit Vehicle</Text>
        <View style={[styles.containers,{flex:1,flexDirection:'column'}]}>
          <View style={{alignItems:'center',flexDirection: "row",backgroundColor:'#DAE0E2',height:hp('7%'),justifyContent:'space-around'}}>
                    {/* <RadioForm style={{marginTop:hp('1%'),}}
                      radio_props={radio_props}
                      initial={this.props.navigation.state.params.VehType == 0 ? 0 : 1}
                      formHorizontal={true}
                      labelHorizontal={true}
                      buttonColor={'#2196f3'}
                      selectedButtonColor={'orange'}
                      selectedLabelColor = {'orange'}
                      animation={true}
                      buttonWrapStyle={{margin: wp('10%')}}
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
            <KeyboardAwareScrollView>
                  <Form>
                    <Text style={styles.inputItem}>Vehicle Name</Text>
                    <Input
                        style={styles.itemTextValues}
                        autoCorrect={false}
                        autoCapitalize="characters"
                        keyboardType="default"
                        defaultValue={this.state.vehName}
                        onChangeText={vehName => this.setState({ vehName : vehName })}
                    />
                    <Text style={styles.inputItem}>Vehicle Number</Text>
                    <Input
                        style={styles.itemTextValues}
                        autoCorrect={false}
                        autoCapitalize="characters"
                        keyboardType="default"
                        defaultValue={this.state.vehNum}
                        onChangeText={vehNum => this.setState({ vehNum : vehNum})}
                    />
                    <Text style={styles.inputItem}>Vehicle Sticker Number</Text>
                    <Input
                        style={styles.itemTextValues}
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType="number-pad"                        
                        defaultValue={this.state.vehStickerNum}
                        onChangeText={vehStickerNum => this.setState({ vehStickerNum : vehStickerNum})}
                    />
                    <Text style={styles.inputItem}>Parking Slot Number</Text>
                    <Input
                        style={styles.itemTextValues}
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType='number-pad'
                        defaultValue={this.state.parkingSlotNum}
                        onChangeText={parkingSlotNum => this.setState({ parkingSlotNum : parkingSlotNum})}
                    />
                  </Form>
                  <View style={styles.buttonStyle}>
                    <Button bordered dark style={styles.buttonFamily} onPress={() => this.props.navigation.goBack()}>
                      <Text style={styles.textFamilyVehicle}>Cancel</Text>
                    </Button>
                    <Button bordered dark style={styles.buttonVehicle}>
                      <Text style={styles.textFamilyVehicle}>Update</Text>
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
    backgroundColor: '#fff',
  },
  containers: {
    
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

  titleOfScreen: {
    marginTop:hp("1.6%"),
    textAlign: 'center',
    fontSize: hp('2%'),
    fontWeight:'bold',
    color:'black',
    marginBottom: hp("1.6%"),
  },
  inputItem: {
    marginLeft: wp('5%'),
    marginRight:wp('5%'),
    fontSize: hp("1.8%"),
    fontWeight: "300",
    color: "#474749",
    marginTop:hp('2.5%')
  },
  itemTextValues: {
    fontSize: hp("2%"),
    fontWeight: "400",
    color: "#000000",
    marginLeft: wp('5%'),
    marginRight:wp('5%'),
    borderColor: "orange",
    borderBottomWidth:hp('0.1%'),
    height:hp('3%'),
  },
  buttonStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("4%"),
    marginBottom: hp("2%"),
    marginHorizontal: hp("2%")
  },
  buttonFamily: {
    width: wp("32%"),
    height: hp("5%"),
    borderRadius: hp("2.5%"),
    borderWidth: hp("0.2%"),
    borderColor: "#C3C3C3",
    backgroundColor: "#C3C3C3",
    justifyContent: "center"
  },
 textFamilyVehicle: {
    color: "white",
    fontWeight: "600",
    fontSize: hp("2%")
  },
 buttonVehicle: {
    width: wp("32%"),
    height: hp("5%"),
    borderRadius: hp("2.5%"),
    borderWidth: hp("0.2%"),
    borderColor: "orange",
    backgroundColor: "orange",
    justifyContent: "center"
  },
});

const mapStateToProps = state => {
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        MyAccountID: state.UserReducer.MyAccountID,
        MyOYEMemberID: state.UserReducer.MyOYEMemberID,
    }
}

export default connect(mapStateToProps)(EditVehicle);