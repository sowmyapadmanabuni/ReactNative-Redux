/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from "react";
import {Alert, Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {Button, Form, Input, Item, Label} from "native-base";
// import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {RadioButton, RadioGroup} from "react-native-flexi-radio-button";
import {connect} from "react-redux";
import OyeLivingApi from "../src/base/services/OyeLivingApi";
import {Dropdown} from "react-native-material-dropdown";
import base from "../src/base";

var radio_props = [
    {label: "Two Wheeler", value: 0},
    {label: "Four Wheeler", value: 1}
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
            text: "",
            vehName: "",
            vehNum: "",
            vehStickerNum: "",
            parkingSlotNum: "",
            parkingLotDetail: [],
            selectedData: ""
        };

        this.getUnitDetail = this.getUnitDetail.bind(this);
    }


    componentWillMount() {
        this.getUnitDetail();
    }


    async getUnitDetail() {
        let self = this;
        let stat = await OyeLivingApi.getUnitDetailByUnitId(this.props.dashBoardReducer.uniID);
        //let stat = await OyeLivingApi.getUnitDetailByUnitId(497);
        console.log("Stat in unit detail:", stat);
        try {
            if (stat !== null) {
                let data = stat.data.unit.unitParkingLot;
                let parkingDataObj = {};
                let parkingDataArr = [];
                for (let i in data) {
                    parkingDataObj = {
                        value: data[i].uplNum,
                        id: data[i].upid,
                    };
                    parkingDataArr.push(parkingDataObj);
                }
                self.setState({
                    parkingLotDetail: parkingDataArr
                })
            } else {
                self.setState({
                    parkingLotDetail: []
                })
            }
        } catch (e) {

        }
    }

    createVehicle = () => {
        let value = this.state.text;
        let vehName = this.state.vehName;
        let vehNum = this.state.vehNum;
        let vehStickerNum = this.state.vehStickerNum;
        let parkingSlotNum = this.state.parkingSlotNum;
        let upID = '';

        //regex code

        console.log("Props :", this.props);

        const oyeNonSpecialRegex = /[^0-9A-Za-z ]/;

        if (vehName.length === 0 || vehName === "") {
            Alert.alert("Enter Vehicle Name");
            return false;
        } else if (vehNum.length === 0 || vehNum === "") {
            Alert.alert("Enter Vehicle Number");
            return false;
        } else if (vehStickerNum.length === 0 || vehStickerNum === "") {
            Alert.alert("Enter Sticker Number");
            return false;
        } else if (parkingSlotNum.length === 0 || parkingSlotNum === "") {
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
        } else if (value == "") {
            Alert.alert("Please select Vehicle type")
        } else {
            if (this.state.parkingLotDetail.length !== 0) {
                for (let i in this.state.parkingLotDetail) {
                    console.log(this.state.selectedData, this.state.parkingLotDetail[i].value);
                    if (this.state.selectedData === this.state.parkingLotDetail[i].value) {
                        upID = this.state.parkingLotDetail[i].id
                    }
                }
            }

            let payloadData = {
                VERegNo: vehNum,
                VEType: value,
                VEMakeMdl: vehName,
                VEStickNo: vehStickerNum,
                UNUnitID: this.props.dashBoardReducer.uniID,
                UPID: (this.state.parkingLotDetail.length !== 0) ? upID : null,
                UPLNum: parkingSlotNum,
                ASAssnID: this.props.dashBoardReducer.assId
            }

            console.log("Payload Data:", payloadData);

            fetch("http://apidev.oyespace.com/oyeliving/api/v1/Vehicle/Create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
                },
                body: JSON.stringify({payloadData})
            })
                .then(response => response.json())
                .then(responseJson => {
                    console.log("Manas", responseJson);
                    if (responseJson.success) {
                        this.props.navigation.navigate('MyVehicleListScreen');
                    } else {
                        alert("Something went wrong !!!");
                    }

                })
                .catch(error => Alert.alert("Data not saved", error));
        }
    };

    onSelect(index, value) {
        this.setState({
            text: `${value}`
        });
    }

    render() {
        console.log("State:", this.state)
        return (
            <View style={styles.container}>
                {/* <Header/> */}
                <SafeAreaView style={{backgroundColor: "orange"}}>
                    <View style={[styles.viewStyle1, {flexDirection: "row"}]}>
                        <View style={styles.viewDetails1}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }}
                            >
                                <View
                                    style={{
                                        height: hp("6%"),
                                        width: wp("20%"),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        alignContent: "center"
                                    }}
                                >
                                    <Image
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
                        <View style={{flex: 0.2}}/>
                    </View>
                    <View style={{borderWidth: 1, borderColor: "orange"}}/>
                </SafeAreaView>
                <Text style={styles.titleOfScreen}>Add Vehicle</Text>
                <View style={[styles.containers, {flex: 1, flexDirection: "column",}]}>
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: 'space-around',
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
                            style={{flexDirection: "row"}}
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
                                    onChangeText={vehName => this.setState({vehName: vehName})}
                                />
                            </Item>
                            <Item style={styles.inputItem} floatingLabel>
                                <Label>Vehicle Number</Label>
                                <Input
                                    // underlineColorAndroid="orange"
                                    autoCorrect={false}
                                    autoCapitalize="characters"
                                    keyboardType="default"
                                    onChangeText={vehNum => this.setState({vehNum: vehNum})}
                                />
                            </Item>
                            <Item style={styles.inputItem} floatingLabel>
                                <Label>Vehicle Sticker Number</Label>
                                <Input
                                    // underlineColorAndroid="orange"
                                    autoCorrect={false}
                                    autoCapitalize="characters"
                                    maxLength={10}
                                    keyboardType='default'
                                    onChangeText={vehStickerNum =>
                                        this.setState({vehStickerNum: vehStickerNum})
                                    }
                                />
                            </Item>
                            <Item style={styles.inputItem} floatingLabel>
                                <Label>Parking Slot Number</Label>
                                <Input
                                    // underlineColorAndroid="orange"
                                    autoCorrect={false}
                                    autoCapitalize="characters"
                                    keyboardType='default'
                                    onChangeText={parkingSlotNum =>
                                        this.setState({parkingSlotNum: parkingSlotNum})
                                    }
                                />
                            </Item>
                            {this.state.parkingLotDetail.length !== 0 ?
                                <Dropdown
                                    containerStyle={styles.box1}
                                    dropdownPosition={-1}
                                    style={{
                                        color: base.theme.colors.gray,
                                        right: 19,
                                        textAlign: 'left',
                                        fontFamily: base.theme.fonts.light,
                                        fontSize: hp('2.5%')
                                    }}
                                    value={"Select Parking lot"}
                                    textColor="#3A3A3C"
                                    labelHeight={hp("0.7%")}
                                    data={this.state.parkingLotDetail}
                                    inputContainerStyle={{borderBottomColor: "transparent"}}
                                    onChangeText={(data) => this.setState({selectedData: data})
                                    }
                                /> : <View style={styles.noData}>
                                    <Text>No parking slot available</Text></View>}
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
        width: wp("6%"),
        height: hp("2%")
    },
    image1: {
        width: wp("22%"),
        height: hp("12%"),
        marginRight: hp("1%")
    },
    viewStyle1: {
        backgroundColor: "#fff",
        height: hp("7%"),
        width: Dimensions.get("screen").width,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        elevation: 2,
        position: "relative"
    },
    titleOfScreen: {
        marginTop: hp("1.6%"),
        textAlign: "center",
        fontSize: hp("2%"),
        fontWeight: "bold",
        color: "#ff8c00",
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
    },
    box1: {
        borderBottomColor: base.theme.colors.primary,
        borderBottomWidth: hp("0.2%"),
        marginLeft: wp("5%"),
        marginRight: wp("5%"),
        paddingLeft: wp("5%"),
        height: hp("5%"),
        backgroundColor: base.theme.colors.transparent,
        width: hp("50%"),
        marginTop: hp('4%')
    },
    noData:{
        marginLeft: wp("5%"),
        marginRight: wp("5%"),
        height: hp("5%"),
        backgroundColor: base.theme.colors.transparent,
        width: hp("50%"),
        marginTop: hp('4%')
    }
});

const mapStateToProps = state => {
    return {
        dashBoardReducer: state.DashboardReducer, //u have to call this in file where u need ids
        userReducer: state.UserReducer,
    };
};


export default connect(mapStateToProps)(AddVehicle);