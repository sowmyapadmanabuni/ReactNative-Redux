/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    Alert,
    BackHandler,
    Dimensions,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {Button, Form, Input, Item, Label,} from "native-base";
// import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {RadioButton, RadioGroup} from "react-native-flexi-radio-button";
import {connect} from "react-redux";
import base from "../src/base";

var radio_props = [
    {label: 'Two Vehicle', value: 0},
    {label: 'Four Vehicle', value: 1}
];

class EditVehicle extends Component {

    static navigationOptions = {
        title: "Edit Vehicle",
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            text: this.props.navigation.state.params.VehType,
            vehName: "",
            vehNum: "",
            vehStickerNum: "",
            vehParkingSlotNum: "",
            id: ""
        }
    }

    componentWillMount() {
        this.setState({
            vehName: this.props.navigation.state.params.VehName ?
                this.props.navigation.state.params.VehName
                : ""
        });

        this.setState({
            vehNum: this.props.navigation.state.params.VehNum ?
                this.props.navigation.state.params.VehNum
                : ""
        });

        this.setState({
            vehStickerNum: this.props.navigation.state.params.VehStickerNum ?
                this.props.navigation.state.params.VehStickerNum
                : ""
        });

        this.setState({
            vehParkingSlotNum: this.props.navigation.state.params.VehParkingSlotNum ?
                this.props.navigation.state.params.VehParkingSlotNum
                : ""
        })
        base.utils.validate.checkSubscription(this.props.userReducer.SelectedAssociationID);

    }

    componentDidUpdate() {
        setTimeout(() => {
            BackHandler.addEventListener('hardwareBackPress', () => this.processBackPress())
        }, 100)
    }

    componentWillUnmount() {
        setTimeout(() => {
            BackHandler.removeEventListener('hardwareBackPress', () => this.processBackPress())
        }, 0)

    }

    processBackPress() {
        console.log("Part");
        const {goBack} = this.props.navigation;
        goBack(null);
    }

    onSelect(index, value) {
        this.setState({
            text: `${value}`
        });
    }

    ModelName = modelName => {
        this.setState({vehName: modelName})
    };
    VehNum = vehNum => {
        this.setState({vehNum: vehNum})
    };
    VehStickerNum = vehStickerNum => {
        this.setState({vehStickerNum: vehStickerNum})
    };
    VehParkingSlotNum = vehParkingSlotNum => {
        this.setState({vehParkingSlotNum: vehParkingSlotNum})
    };

    editVehicle = () => {
        const {
            VehName,
            VehNum,
            VehStickerNum,
            VehParkingSlotNum,
            VehType,
            Veid
        } = this.props.navigation.state.params;

        // id = Veid
        value = this.state.text;
        vehName = this.state.vehName;
        vehNum = this.state.vehNum;
        vehStickerNum = this.state.vehStickerNum;
        parkingSlotNum = this.state.vehParkingSlotNum;
        vehType = this.state.text;

        const reg = /^[0]?[6789]\d{9}$/;
        const OyeFullName = /^[a-zA-Z ]+$/;
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
            let body = JSON.stringify({
                VEType: this.state.text === "Two Wheeler" ? "Two Wheeler" : "Four Wheeler",
                VERegNo: vehNum.length <= 0 ? VehNum : vehNum.toString(),
                VEMakeMdl: vehName.length <= 0 ? VehName : vehName,
                VEStickNo: vehStickerNum.length <= 0 ? VehStickerNum : vehStickerNum.toString(),
                UPLNum: parkingSlotNum.length <= 0 ? VehParkingSlotNum : parkingSlotNum.toString(),
                VEID: this.props.navigation.state.params.Veid,
                ASAssnID: this.props.dashBoardReducer.selectedAssociation
            });
            fetch(
                `http://${this.props.oyeURL}/oyeliving/api/v1/Vehicle/VehicleUpdate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
                    },
                    body: body
                }
            )
                .then(responseData => responseData.json())
                .then(responseJson => {
                    console.log("Respo::", responseJson, body);
                    if (responseJson.success) {
                        this.props.navigation.navigate("MyVehicleListScreen");
                    } else {
                        alert(responseJson.error.message)
                    }

                    // this.setState({
                    //   datasource: responseJson

                    // })
                })

                .catch(error => {
                    console.log(responseJson.error.message)
                })
        }
    };

    onSelect(index, value) {
        this.setState({
            text: `${value}`
        });
    }

    render() {

        console.log("Props:", this.props.navigation.state.params);
        console.log("State:", this.state);
        let propsData = this.props.navigation.state.params;
        let stateData = this.state;
        let isEdited = (propsData.VehName !== stateData.vehName || propsData.VehNum !== stateData.vehNum || propsData.VehType !== stateData.text
            || propsData.VehParkingSlotNum !== stateData.vehParkingSlotNum || propsData.VehStickerNum !== stateData.vehStickerNum);
        console.log(propsData.VehName !== stateData.vehName, propsData.VehName !== stateData.vehName, propsData.VehType !== stateData.text
            , propsData.VehParkingSlotNum !== stateData.vehParkingSlotNum, propsData.VehStickerNum !== stateData.vehStickerNum);
        console.log("isEdited:", isEdited);

        return (
            <View style={styles.container}>
                {/* <Header/> */}
                <SafeAreaView style={{backgroundColor: "#ff8c00"}}>
                    <View style={[styles.viewStyle1, {flexDirection: "row"}]}>
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
                                source={require("../icons/OyespaceSafe.png")}
                            />
                        </View>
                        <View style={{flex: 0.2}}>
                            {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                        </View>
                    </View>
                    <View style={{borderWidth: 1, borderColor: "orange"}}/>
                </SafeAreaView>


                <Text style={styles.titleOfScreen}>Edit Vehicle</Text>
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

                        <RadioGroup
                            style={{flexDirection: "row"}}
                            onSelect={(index, value) => this.onSelect(index, value)}
                            selectedIndex={
                                this.props.navigation.state.params.VehType === "Two Wheeler" ?
                                    0
                                    : 1
                            }
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
                            <Item style={styles.inputItem} stackedLabel>
                                <Label>Vehicle Name</Label>
                                <Input
                                    // underlineColorAndroid="orange"
                                    autoCorrect={false}
                                    autoCapitalize="characters"
                                    keyboardType="default"
                                    defaultValue={
                                        this.props.navigation.state.params.VehName ?
                                            this.props.navigation.state.params.VehName.toString()
                                            : ""
                                    }
                                    value={this.state.vehName}
                                    onChangeText={this.ModelName}
                                />
                            </Item>
                            <Item style={styles.inputItem} stackedLabel>
                                <Label>Vehicle Number</Label>
                                <Input
                                    // underlineColorAndroid="orange"
                                    autoCorrect={false}
                                    autoCapitalize="characters"
                                    keyboardType="default"
                                    defaultValue={
                                        this.props.navigation.state.params.VehName ?
                                            this.props.navigation.state.params.VehName.toString()
                                            : ""
                                    }
                                    value={this.state.vehNum}
                                    onChangeText={this.VehNum}
                                />
                            </Item>
                            <Item style={styles.inputItem} stackedLabel>
                                <Label>Vehicle Sticker Number</Label>
                                <Input
                                    // underlineColorAndroid="orange"
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    maxLength={10}
                                    keyboardType='default'
                                    defaultValue={
                                        this.props.navigation.state.params.VehName ?
                                            this.props.navigation.state.params.VehName.toString()
                                            : ""
                                    }
                                    value={this.state.vehStickerNum}
                                    onChangeText={this.VehStickerNum
                                    }
                                />
                            </Item>
                            <Item style={styles.inputItem} stackedLabel>
                                <Label>Parking Slot Number</Label>
                                <Input
                                    // underlineColorAndroid="orange"
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    keyboardType='default'
                                    defaultValue={
                                        this.props.navigation.state.params.VehParkingSlotNum ?
                                            this.props.navigation.state.params.VehParkingSlotNum.toString()
                                            : ""
                                    }
                                    value={this.state.vehParkingSlotNum}
                                    onChangeText={(vehParkingSlotNum) =>
                                        this.setState({vehParkingSlotNum: vehParkingSlotNum})
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
                            {isEdited ?
                                <Button
                                    bordered
                                    warning
                                    style={styles.buttonAdd}
                                    onPress={() => this.editVehicle()}
                                >
                                    <Text style={styles.textFamilyVehicle}>Update</Text>
                                </Button> :
                                <Button
                                    bordered
                                    info
                                    style={styles.buttonCancel}
                                    onPress={() => alert("Please Edit the details to update")}
                                >
                                    <Text style={styles.textFamilyVehicle}>Update</Text>
                                </Button>}
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
    containers: {},
    titleOfScreen: {
        marginTop: hp("1.6%"),
        textAlign: 'center',
        fontSize: hp('2%'),
        fontWeight: 'bold',
        color: '#ff8c00',
        marginBottom: hp("1.6%"),
    },
    inputItem: {
        marginLeft: wp('5%'),
        marginRight: wp('5%'),
        fontSize: hp("1.8%"),
        fontWeight: "300",
        color: "#474749",
        marginTop: hp('2.5%')
    },
    itemTextValues: {
        fontSize: hp("2%"),
        fontWeight: "400",
        color: "#000000",
        marginLeft: wp('5%'),
        marginRight: wp('5%'),
        borderColor: "orange",
        borderBottomWidth: hp('0.1%'),
        height: hp('3%'),
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
    image1: {
        width: wp("34%"),
        height: hp("18%"),
        marginRight: hp("3%")
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

        dashBoardReducer: state.DashboardReducer,
        oyeURL: state.OyespaceReducer.oyeURL,
        userReducer: state.UserReducer,



    };
};


export default connect(mapStateToProps)(EditVehicle);