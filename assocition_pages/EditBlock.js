import React, {Component} from "react"
import {
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native"
import {Button, Card, Input, Item} from "native-base"
import {Dropdown} from "react-native-material-dropdown"
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen"
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view"
import CheckBox from "react-native-check-box"
import {DatePickerDialog} from "react-native-datepicker-dialog"
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
];

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
];
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
];

var radio_props = [{label: "Flat Rate Value", value: 0}];

class EditBlock extends Component {
    static navigationOptions = {
        title: "Edit Block",
        header: null
    };

    constructor(props) {
        super(props);
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
            idOfBlock: "",

            flash: +91,

            dobText: moment(new Date()).format("YYYY-MM-DD"), //year + '-' + month + '-' + date,
            dobDate: "",

            dobText2: moment(new Date()).format("YYYY-MM-DD"), //year + '-' + month + '-' + date,// hh:mm:ss
            dobDate2: "",

            dobText3: moment(new Date()).format("YYYY-MM-DD"), //year + '-' + month + '-' + date,
            dobDate3: "",

            dobText4: moment(new Date()).format("YYYY-MM-DD"), //year + '-' + month + '-' + date,
            dobDate4: "",

            checked: true,
            checked2: true
        }
    }

    //Date Picker - 1
    onDOBPress = () => {
        let dobDate = this.state.dobDate;
        if (!dobDate || dobDate == null) {
            dobDate = new Date();
            this.setState({
                dobDate: dobDate
            })
        }
        this.refs.dobDialog.open({
            date: dobDate,
            minDate: new Date() //To restirct past dates
        })
    };

    onDOBDatePicked = date => {
        this.setState({
            dobDate: date,
            dobText: moment(date).format("DD-MM-YYYY")
        })
    };

    //Date Picker - 2
    onDOBPress2 = () => {
        let dobDate = this.state.dobDate2;
        if (!dobDate || dobDate == null) {
            dobDate = new Date();
            this.setState({
                dobDate2: dobDate
            })
        }
        this.refs.dobDialog2.open({
            date: dobDate,
            minDate: new Date() //To restirct past dates
        })
    };

    onDOBDatePicked2 = date => {
        this.setState({
            dobDate2: date,
            dobText2: moment(date).format("DD-MM-YYYY")
        })
    };

    //Date Picker - 3
    onDOBPress3 = () => {
        let dobDate = this.state.dobDate3;
        if (!dobDate || dobDate == null) {
            dobDate = new Date();
            this.setState({
                dobDate3: dobDate
            })
        }
        this.refs.dobDialog3.open({
            date: dobDate,
            minDate: new Date() //To restirct past dates
        })
    };

    onDOBDatePicked3 = date => {
        this.setState({
            dobDate3: date,
            dobText3: moment(date).format("DD-MM-YYYY")
        })
    };

    //Date Picker - 4
    onDOBPress4 = () => {
        let dobDate = this.state.dobDate4;
        if (!dobDate || dobDate == null) {
            dobDate = new Date();
            this.setState({
                dobDate4: dobDate
            })
        }
        this.refs.dobDialog4.open({
            date: dobDate,
            minDate: new Date() //To restirct past dates
        })
    };

    onDOBDatePicked4 = date => {
        this.setState({
            dobDate4: date,
            dobText4: moment(date).format("DD-MM-YYYY")
        })
    };


    validation = () => {
        let blockName = this.state.blockName;
        let blockType = this.state.blockType;
        let noOfUnits = this.state.noOfUnits;
        let managerName = this.state.managerName;
        let mobNum = this.state.mobNum;
        let emailID = this.state.emailID;
        let flatRateValue = this.state.flatRateValue;
        let maintenaceValue = this.state.maintenaceValue;
        let measurementType = this.state.measurementType;
        let invoiceCreationFreq = this.state.invoiceCreationFreq;
        let dobText = this.state.dobText;
        let dobText2 = this.state.dobText2;
        let latePayChargeType = this.state.latePayChargeType;
        let latePayCharge = this.state.latePayCharge;
        let dobText3 = this.state.dobText3;
        let dobText4 = this.state.dobText4;

        let checked = this.state.checked;
        let checked2 = this.state.checked2;

        const reg = /^[0]?[6789]\d{9}$/;
        const regTextOnly = /^[a-zA-Z ]+$/;
        const regPIN = /^[0-9]{1,10}$/;

        let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
        let regIFSC = /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/;
        let oyeNonSpecialRegex = /[^0-9A-Za-z ]/;
        let mobRegex = /^[0]?[456789]d{9}$/;

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
        } else if (noOfUnits >= 80) {
            Alert.alert("Number Of Units should not be more than 80")
        } else if (regPIN.test(noOfUnits) === false) {
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
            this.flatrate();

        } else if (checked2 === false) {
            this.dimenstion();

        } else if (checked === true || checked2 === true) {
            Alert.alert("Please give FlatRate value or MaintenaceValue")
        }
    };
    flatrate = () => {
        let flatRateValue = this.state.flatRateValue;
        if (flatRateValue.length === 0) {
            Alert.alert("Please should give Flat rate value");

        } else {
            this.createBlockPostData()
        }
    };

    dimenstion = () => {
        let maintenaceValue = this.state.maintenaceValue;
        if (maintenaceValue.length === 0) {
            Alert.alert("Please should give Maintenace value");

        } else {
            this.createBlockPostData()
        }
    };

    componentDidMount() {
        console.log(
            this.state.idOfBlock,
            "0ydj0htr0t0rtrtrtyrtr"
        )
    }

    createBlockPostData = () => {
        const {
            MyBlockName,
            MyBlockType,
            MyBlockNoOfUnits,
            MyBlockManagerName,
            MyBlockMobileNumber,
            MyBlockManagerEmail,
            MyBlockFlatRate,
            MyBlockMeasurementType,
            MyBlockInvoiceCreationFrequency,
            MyBlockNextInvoiceGenerationDate,
            MyBlockDueDate,
            MyBlockLatePaymentChargeType,
            MyBlockLatePaymentCharge,
            MyBlockStartsFrom,
            MyBlockMaintenceValue,
            MyBlockId
        } = this.props.navigation.state.params;


        blockName = this.state.blockName;
        blockType = this.state.blockType;
        noOfUnits = this.state.noOfUnits;
        managerName = this.state.managerName;
        mobNum = this.state.mobNum;
        emailID = this.state.emailID;
        flatRateValue = this.state.flatRateValue;
        maintenaceValue = this.state.maintenaceValue;
        measurementType = this.state.measurementType;
        invoiceCreationFreq = this.state.invoiceCreationFreq.toString();
        dobText = this.state.dobText;
        dobText2 = this.state.dobText2;
        latePayChargeType = this.state.latePayChargeType;
        latePayCharge = this.state.latePayCharge;
        dobText3 = this.state.dobText3;
        dobText4 = this.state.dobText4;

        checked = this.state.checked;
        checked2 = this.state.checked2;

        fetch(
            `http://${this.props.oyeURL}/oyeliving/api/v1/Block/BlockDetailsUpdate`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
                },
                body: JSON.stringify({
                    BLBlkName: blockName.length <= 0 ? MyBlockName : blockName,
                    BLBlkType: blockType.length <= 0 ? MyBlockType : blockType,
                    ASNofBlks: 1,
                    BLNofUnit: noOfUnits.length <= 0 ? MyBlockNoOfUnits : noOfUnits,
                    BLMgrName: managerName.length <= 0 ? MyBlockManagerName : managerName,
                    BLMgrMobile: mobNum <= 0 ? MyBlockMobileNumber : mobNum,
                    BLMgrEmail: emailID <= 0 ? MyBlockManagerEmail : emailID,
                    ASMtType: checked + checked2,
                    ASMtDimBs:
                        maintenaceValue <= 0 ? MyBlockMaintenceValue : maintenaceValue,
                    ASMtFRate: flatRateValue <= 0 ? MyBlockFlatRate : flatRateValue,
                    ASUniMsmt:
                        measurementType <= 0 ? MyBlockMeasurementType : measurementType, //sqft sqmt
                    ASBGnDate: dobText <= 0 ? MyBlockNextInvoiceGenerationDate : dobText, // Invoice Gen. Date
                    BLBlockID: this.state.idOfBlock,
                    ASICrFreq: invoiceCreationFreq,
                    // invoiceCreationFreq.length <= 4
                    //   ? MyBlockInvoiceCreationFrequency
                    //   : invoiceCreationFreq,
                    ASLPCType:
                        latePayChargeType <= 0
                            ? MyBlockLatePaymentChargeType
                            : latePayChargeType,
                    ASLPChrg:
                        latePayCharge <= 0 ? MyBlockLatePaymentCharge : latePayCharge,
                    ASLPSDate: dobText4 <= 0 ? MyBlockStartsFrom : dobText4, //Start Date
                    ASDPyDate: dobText2 <= 0 ? MyBlockDueDate : dobText2 //Due Date
                })
            }
        )
            .then(response => response.json())
            .then(responseJson => {
                console.log("My Family Details ###############", responseJson);
                alert("Data Created");
                this.props.navigation.goBack()
            })

            .catch(error => {
                console.log("ashdjkhasjkhjaksbcjaksbkjdasd", error);
                alert("error")
            })
    };


    componentWillMount() {

        console.log(this.props.navigation.state.params);

        this.setState({
            idOfBlock: this.props.navigation.state.params.MyBlockId
                ? this.props.navigation.state.params.MyBlockId
                : ""
        });
        this.setState({
            blockName: this.props.navigation.state.params.MyBlockName
                ? this.props.navigation.state.params.MyBlockName
                : ""
        });
        this.setState({
            blockType: this.props.navigation.state.params.MyBlockType
                ? this.props.navigation.state.params.MyBlockType
                : ""
        });

        this.setState({
            noOfUnits: this.props.navigation.state.params.MyBlockNoOfUnits
                ? this.props.navigation.state.params.MyBlockNoOfUnits
                : ""
        });

        this.setState({
            managerName: this.props.navigation.state.params.MyBlockManagerName
                ? this.props.navigation.state.params.MyBlockManagerName
                : ""
        });
        this.setState({
            emailID: this.props.navigation.state.params.MyBlockManagerEmail
                ? this.props.navigation.state.params.MyBlockManagerEmail
                : ""
        });

        this.setState({
            mobNum: this.props.navigation.state.params.MyBlockMobileNumber
                ? this.props.navigation.state.params.MyBlockMobileNumber
                : ""
        });

        this.setState({
            flatRateValue: this.props.navigation.state.params.MyBlockFlatRate
                ? this.props.navigation.state.params.MyBlockFlatRate
                : ""
        });
        this.setState({
            maintenaceValue: this.props.navigation.state.params.MyBlockMaintenceValue
                ? this.props.navigation.state.params.MyBlockMaintenceValue
                : ""
        });
        this.setState({
            measurementType: this.props.navigation.state.params.MyBlockMeasurementType
                ? this.props.navigation.state.params.MyBlockMeasurementType
                : ""
        });

        this.setState({
            invoiceCreationFreq: this.props.navigation.state.params
                .MyBlockInvoiceCreationFrequency
                ? this.props.navigation.state.params.MyBlockInvoiceCreationFrequency
                : ""
        });

        this.setState({
            dobText: this.props.navigation.state.params
                .MyBlockNextInvoiceGenerationDate
                ? this.props.navigation.state.params.MyBlockNextInvoiceGenerationDate
                : ""
        });

        this.setState({
            dobText2: this.props.navigation.state.params.MyBlockDueDate
                ? this.props.navigation.state.params.MyBlockDueDate
                : ""
        });

        this.setState({
            latePayChargeType: this.props.navigation.state.params
                .MyBlockLatePaymentChargeType
                ? this.props.navigation.state.params.MyBlockLatePaymentChargeType
                : ""
        });

        this.setState({
            latePayCharge: this.props.navigation.state.params.MyBlockLatePaymentCharge
                ? this.props.navigation.state.params.MyBlockLatePaymentCharge
                : ""
        });

        this.setState({
            dobText4: this.props.navigation.state.params.MyBlockStartsFrom
                ? this.props.navigation.state.params.MyBlockStartsFrom
                : ""
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <SafeAreaView style={{backgroundColor: "orange"}}>
                    <View style={[styles.viewStyle, {flexDirection: "row"}]}>
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
                                    style={{width: 20, height: 20}}
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
                        <View style={styles.emptyViewStyle}/>
                    </View>
                    <View style={{borderWidth: 1, borderColor: "#EBECED"}}/>
                </SafeAreaView>

                <KeyboardAwareScrollView>
                    <View style={styles.textWrapper}>
                        <Text style={styles.titleText}>Edit Block</Text>

                        <ScrollView>
                            <View style={styles.associationDetailsView}>
                                <Text style={styles.titleChildText}>Block Details</Text>
                                <View style={styles.fillAssociationDetailline}/>
                            </View>
                            <Card style={styles.myProfileCardsStyle}>
                                <Item style={styles.inputItem} floatingLabel>
                                    <Input
                                        placeholder="Block Name"
                                        // underlineColorAndroid="orange"
                                        autoCorrect={false}
                                        autoCapitalize="characters"
                                        keyboardType="default"
                                        // maxLength={30}
                                        textAlign={"justify"}
                                        // defaultValue={
                                        //   this.state.blockName ? this.state.blockName : ""
                                        // }
                                        defaultValue={
                                            this.props.navigation.state.params.MyBlockName
                                                ? this.props.navigation.state.params.MyBlockName
                                                : ""
                                        }
                                        onChangeText={blockName =>
                                            this.setState({blockName: blockName})
                                        }
                                        value={this.state.blockName}
                                    />
                                </Item>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-evenly",
                                        marginVertical: hp("2%")
                                    }}
                                >
                                    <View style={{flex: 0.4, height: hp("0.8%")}}>
                                        {/* <Text>Block Type</Text> */}
                                        <Dropdown
                                            containerStyle={styles.box2}
                                            dropdownPosition={-3}
                                            style={{fontSize: hp("2%")}}
                                            //value={"Residential"}
                                            textColor="#3A3A3C"
                                            data={data2}
                                            labelHeight={hp("1.8%")}
                                            labelPadding={hp("0.1%")}
                                            labelSize={hp("0.2%")}
                                            inputContainerStyle={{borderBottomColor: "transparent"}}
                                            // label={this.state.blockType ? this.state.blockType : ""}
                                            label={
                                                this.props.navigation.state.params.MyBlockType
                                                    ? this.props.navigation.state.params.MyBlockType
                                                    : ""
                                            }
                                            value={data2.value}
                                            onChangeText={blockType =>
                                                this.setState({blockType: blockType})
                                            }
                                            //value={this.state.blockType}
                                        />
                                    </View>

                                    {/* <Text>Number of Units</Text> */}
                                    <Input
                                        style={[styles.box, {flex: 0.4}]}
                                        placeholder="No. of Units"
                                        // autoCorrect={false}
                                        // autoCapitalize="characters"
                                        keyboardType="number-pad"
                                        textAlign={"justify"}
                                        // defaultValue={
                                        //   this.state.noOfUnits ? this.state.noOfUnits : ""
                                        // }
                                        defaultValue={
                                            this.props.navigation.state.params.MyBlockNoOfUnits
                                                ? this.props.navigation.state.params.MyBlockNoOfUnits.toString()
                                                : ""
                                        }
                                        onChangeText={noOfUnits =>
                                            this.setState({noOfUnits: noOfUnits})
                                        }
                                        value={this.state.noOfUnits}
                                    />
                                </View>
                            </Card>

                            <View style={styles.associationDetailsView}>
                                <Text style={styles.titleChildText}>Manager Details</Text>
                                <View style={styles.fillAssociationDetailline}/>
                            </View>
                            <Card style={styles.myProfileCardsStyle}>
                                <Item style={styles.inputItem} floatingLabel>
                                    <Input
                                        placeholder="Manager Name"
                                        // underlineColorAndroid="orange"
                                        autoCorrect={false}
                                        autoCapitalize="characters"
                                        keyboardType="default"
                                        // maxLength={30}
                                        defaultValue={
                                            this.props.navigation.state.params.MyBlockManagerName
                                                ? this.props.navigation.state.params.MyBlockManagerName
                                                : ""
                                        }
                                        onChangeText={managerName =>
                                            this.setState({managerName: managerName})
                                        }
                                        value={this.state.managerName}
                                    />
                                </Item>
                                <Item style={styles.inputItem} floatingLabel>
                                    <Input
                                        placeholder="Mobile Number"
                                        // underlineColorAndroid="orange"
                                        // autoCorrect={false}
                                        // autoCapitalize="characters"
                                        keyboardType="number-pad"
                                        maxLength={10}
                                        // defaultValue={this.state.mobNum ? this.state.mobNum : ""}
                                        defaultValue={
                                            this.props.navigation.state.params.MyBlockMobileNumber
                                                ? this.props.navigation.state.params.MyBlockMobileNumber
                                                : ""
                                        }
                                        onChangeText={mobNum => this.setState({mobNum: mobNum})}
                                        value={this.state.mobNum}
                                    />
                                </Item>
                                <Item style={styles.inputItem} floatingLabel>
                                    <Input
                                        placeholder="Email ID"
                                        // underlineColorAndroid="orange"
                                        autoCorrect={false}
                                        autoCapitalize="characters"
                                        keyboardType="default"
                                        // defaultValue={
                                        //   this.state.emailID ? this.state.emailID : ""
                                        // }
                                        defaultValue={
                                            this.props.navigation.state.params.MyBlockManagerEmail
                                                ? this.props.navigation.state.params.MyBlockManagerEmail
                                                : ""
                                        }
                                        onChangeText={emailID =>
                                            this.setState({emailID: emailID})
                                        }
                                        value={this.state.emailID}
                                    />
                                </Item>
                                <View style={{height: hp("2%")}}/>
                            </Card>

                            <View style={styles.associationDetailsView}>
                                <Text style={styles.titleChildText}>Maintenace Details</Text>
                                <View style={styles.fillAssociationDetailline}/>
                            </View>
                            <Card/>
                            <Card style={{height: 900}}>
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
                                        <View style={{flexDirection: "row"}}>
                                            <CheckBox
                                                onClick={() => {
                                                    this.setState({
                                                        checked: !this.state.checked
                                                    })
                                                }}
                                                isChecked={!this.state.checked}
                                                checkedImage={
                                                    <Image
                                                        source={require("../icons/tick.png")}
                                                        style={{width: 20, height: 20}}
                                                    />
                                                }
                                                unCheckedImage={
                                                    <Image
                                                        source={require("../icons/box.png")}
                                                        style={{width: 20, height: 20}}
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
                                            // defaultValue={
                                            //   this.state.flatRateValue
                                            //     ? this.state.flatRateValue
                                            //     : ""
                                            // }
                                            // onChangeText={flatRateValue =>
                                            //   this.setState({ flatRateValue: flatRateValue })}
                                            defaultValue={
                                                this.props.navigation.state.params.MyBlockFlatRate
                                                    ? this.props.navigation.state.params.MyBlockFlatRate.toString()
                                                    : ""
                                            }
                                            onChangeText={flatRateValue =>
                                                this.setState({flatRateValue: flatRateValue})
                                            }
                                            value={this.state.flatRateValue}
                                        />
                                    ) : (
                                        <Text/>
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
                                        <View style={{flexDirection: "row"}}>
                                            <CheckBox
                                                onClick={() => {
                                                    this.setState({
                                                        checked2: !this.state.checked2
                                                    })
                                                }}
                                                isChecked={!this.state.checked2}
                                                checkedImage={
                                                    <Image
                                                        source={require("../icons/tick.png")}
                                                        style={{width: 20, height: 20}}
                                                    />
                                                }
                                                unCheckedImage={
                                                    <Image
                                                        source={require("../icons/box.png")}
                                                        style={{width: 20, height: 20}}
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
                                            // defaultValue={
                                            //   this.state.maintenaceValue
                                            //     ? this.state.maintenaceValue
                                            //     : ""
                                            // }
                                            // onChangeText={maintenaceValue =>
                                            //   this.setState({ maintenaceValue: maintenaceValue })
                                            // }
                                            defaultValue={
                                                this.props.navigation.state.params.MyBlockMaintenceValue
                                                    ? this.props.navigation.state.params.MyBlockMaintenceValue.toString()
                                                    : ""
                                            }
                                            onChangeText={maintenaceValue =>
                                                this.setState({maintenaceValue: maintenaceValue})
                                            }
                                            value={this.state.maintenaceValue}
                                        />
                                    ) : (
                                        <Text/>
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
                                    {this.state.flash == +91 ? (
                                        <Input
                                            style={styles.box}
                                            placeholder="Measurement Type, e.g.,  SQFT"
                                            autoCorrect={false}
                                            autoCapitalize="characters"
                                            keyboardType="default"
                                            // defaultValue={
                                            //   this.state.measurementType
                                            //     ? this.state.measurementType
                                            //     : ""
                                            // }
                                            // onChangeText={measurementType =>
                                            //   this.setState({ measurementType: measurementType })
                                            // }
                                            defaultValue={
                                                this.props.navigation.state.params
                                                    .MyBlockMeasurementType
                                                    ? this.props.navigation.state.params.MyBlockMeasurementType.toString()
                                                    : ""
                                            }
                                            onChangeText={measurementType =>
                                                this.setState({measurementType: measurementType})
                                            }
                                            value={this.state.measurementType}
                                        />
                                    ) : (
                                        <Input
                                            style={styles.box}
                                            placeholder="Measurement Type, e.g., SQMT"
                                            autoCorrect={false}
                                            autoCapitalize="characters"
                                            keyboardType="default"
                                            // defaultValue={
                                            //   this.state.measurementType
                                            //     ? this.state.measurementType
                                            //     : ""
                                            // }
                                            // onChangeText={measurementType =>
                                            //   this.setState({ measurementType: measurementType })
                                            // }
                                            defaultValue={
                                                this.props.navigation.state.params
                                                    .MyBlockMeasurementType
                                                    ? this.props.navigation.state.params.MyBlockMeasurementType.toString()
                                                    : ""
                                            }
                                            onChangeText={measurementType =>
                                                this.setState({measurementType: measurementType})
                                            }
                                            value={this.state.measurementType}
                                        />
                                    )}
                                    {/* <Input
                        style={styles.box}
                        placeholder="Measurement Type"
                        autoCorrect={false}
                        autoCapitalize="characters"
                        keyboardType="default"
                        onChangeText={measurementType => this.setState({ measurementType : measurementType })}
                    /> */}
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
                                    dropdownPosition={-1}
                                    // label="Select Charge Type"
                                    style={{fontSize: hp("2%")}}
                                    // value={"Monthly"}
                                    textColor="#3A3A3C"
                                    data={data}
                                    labelHeight={hp("0.7%")}
                                    inputContainerStyle={{borderBottomColor: "transparent"}}
                                    // defaultValue={
                                    //   this.props.navigation.state.params.myBlockLatePaymentChargeType
                                    //     ? this.props.navigation.state.params.myBlockLatePaymentChargeType
                                    //     : ""
                                    // }
                                    // label={
                                    //   this.state.latePayChargeType
                                    //     ? this.state.latePayChargeType
                                    //     : ""
                                    // }
                                    label={
                                        this.props.navigation.state.params
                                            .myBlockInvoiceCreationFrequency
                                            ? this.props.navigation.state.params.myBlockInvoiceCreationFrequency.toString()
                                            : ""
                                    }
                                    value={data.value}
                                    onChangeText={invoiceCreationFreq =>
                                        this.setState({
                                            invoiceCreationFreq: invoiceCreationFreq
                                        })
                                    }
                                    value={this.state.invoiceCreationFreq}
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
                                    dropdownPosition={-1}
                                    // label="Select Charge Type"
                                    style={{fontSize: hp("2%")}}
                                    // value={"Monthly"}
                                    textColor="#3A3A3C"
                                    data={data1}
                                    labelHeight={hp("0.7%")}
                                    inputContainerStyle={{borderBottomColor: "transparent"}}
                                    // defaultValue={
                                    //   this.props.navigation.state.params.myBlockLatePaymentChargeType
                                    //     ? this.props.navigation.state.params.myBlockLatePaymentChargeType
                                    //     : ""
                                    // }
                                    // label={
                                    //   this.state.latePayChargeType
                                    //     ? this.state.latePayChargeType
                                    //     : ""
                                    // }
                                    label={
                                        this.props.navigation.state.params
                                            .myBlockLatePaymentChargeType
                                            ? this.props.navigation.state.params
                                                .myBlockLatePaymentChargeType
                                            : ""
                                    }
                                    value={data1.value}
                                    onChangeText={latePayChargeType =>
                                        this.setState({latePayChargeType: latePayChargeType})
                                    }
                                    value={this.state.latePayChargeType}
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
                                {/* <TouchableOpacity onPress={this.onDOBPress3.bind(this)}>
                            <View style={styles.datePickerBox}>
                            <Text style={styles.datePickerText}>{this.state.dobText3} </Text>
                            <DatePickerDialog
                                ref="dobDialog3"
                                onDatePicked={this.onDOBDatePicked3.bind(this)}
                            />
                            </View>
                        </TouchableOpacity> */}
                                <Item style={styles.bankDetailLine}>
                                    <Input
                                        style={styles.box}
                                        placeholder="Late Payment Charge"
                                        autoCorrect={false}
                                        autoCapitalize="characters"
                                        keyboardType="numeric"
                                        // defaultValue={
                                        //   this.state.latePayCharge ? this.state.latePayCharge : ""
                                        // }
                                        // onChangeText={latePayCharge =>
                                        //   this.setState({ latePayCharge: latePayCharge })
                                        // }
                                        defaultValue={
                                            this.props.navigation.state.params
                                                .MyBlockLatePaymentCharge
                                                ? this.props.navigation.state.params.MyBlockLatePaymentCharge.toString()
                                                : ""
                                        }
                                        onChangeText={latePayCharge =>
                                            this.setState({latePayCharge: latePayCharge})
                                        }
                                        value={this.state.latePayCharge}
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
                            <View style={{alignSelf: "center", marginTop: hp("2%")}}>
                                <Button
                                    onPress={() => this.validation()}
                                    style={{
                                        width: wp("40%"),
                                        height: hp("5.5%"),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#ff8c00"
                                    }}
                                    rounded
                                >
                                    <Text style={{color: "white", fontSize: hp("2%")}}>
                                        Add Blocks
                                    </Text>
                                </Button>
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
        borderColor: "#696969",
        borderWidth: hp("0.1%"),
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
        shadowOffset: {width: 0, height: 2},
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

export default connect(mapStateToProps)(EditBlock);
