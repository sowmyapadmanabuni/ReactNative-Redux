import React, {Component} from "react";
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
} from "react-native";
import {Button, Card, Input, Item} from "native-base";
import {Dropdown} from "react-native-material-dropdown";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import _ from "lodash";
import {connect} from "react-redux";
import SwitchToggle from "react-native-switch-toggle";

let Occupancy_Status = [
    {
        value: "Owner",
        id: 1
    },
    {
        value: "Tenant",
        id: 2
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
            UnitNumber: "",
            OccupancyStatus: "",

            parkingLotno: "",

            Unitofname: "",
            Unitolname: "",
            Unitomnum: "",

            Unittfname: "",
            Unittlname: "",
            Unittmnum: "",

            switchOn4: false
        };
    }

    createUnit = () => {
        let UnitNum1 = this.state.UnitNumber;
        let OccupancyStatus1 = this.state.OccupancyStatus;

        let Unitofname1 = this.state.Unitofname;
        let Unitolname1 = this.state.Unitolname;
        let Unitomnum1 = this.state.Unitomnum;

        let Unittfname1 = this.state.Unittfname;
        let Unittlname1 = this.state.Unittlname;
        let Unittmnum1 = this.state.Unittmnum;

        let mobile = "";

        let switchOn = this.state.switchOn4;

        let unitParkingLot = [];

        let uniqData = _.uniqBy(unitParkingLot, "UPLNum");

        let blockId = this.props.navigation.state.params.unit;
        let associationId = this.props.navigation.state.params.assocID;

        if (UnitNum1.length === 0 || UnitNum1.length === "") {
            Alert.alert("Please enter Unit Number");
        } else if (OccupancyStatus1.length == 0) {
            Alert.alert("Please Select Block type");
        } else {
            fetch(`http://${this.props.oyeURL}/oyeliving/api/v1/unit/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
                },
                body: JSON.stringify({
                    ASAssnID: associationId,
                    ACAccntID: this.props.MyAccountID,
                    units: [
                        {
                            UNUniName: UnitNum1,
                            UNUniType: "",
                            UNOcStat: OccupancyStatus1,
                            UNOcSDate: "",
                            UNOwnStat: switchOn,
                            UNSldDate: "",
                            UNDimens: "",
                            UNRate: "",
                            UNCalType: "",
                            FLFloorID: 14,
                            BLBlockID: blockId,
                            Owner: [
                                {
                                    UOFName: Unitofname1,
                                    UOLName: Unitolname1,
                                    UOMobile: Unitomnum1,
                                    UOISDCode: "+91",
                                    UOMobile1: "",
                                    UOMobile2: "",
                                    UOMobile3: "",
                                    UOMobile4: "",
                                    UOEmail: "",
                                    UOEmail1: "",
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
                                    UTISDCode: "+91",
                                    UTMobile1: "",
                                    UTEmail: "",
                                    UTEmail1: ""
                                }
                            ],
                            unitbankaccount: {
                                UBName: "SBI",
                                UBIFSC: "SBIN000014",
                                UBActNo: "SBI23ejnhgf43434",
                                UBActType: "Savings",
                                UBActBal: 12.3,
                                BLBlockID: blockId
                            },

                            UnitParkingLot: uniqData
                        }
                    ]
                })
            })
                .then(response => response.json())
                .then(responseJson => {
                    console.log("unit added ###############", responseJson);
                    Alert.alert("Unit Added", responseJson.data);
                    // Alert.alert(
                    //   "",
                    //   "Unit Created Successfully",
                    //   [
                    //     {
                    //       text: "Ok",
                    //       onPress: () => RNRestart.Restart()
                    //     }
                    //   ],
                    //   { cancelable: false }
                    // );
                    this.props.navigation.goBack();
                })

                .catch(error => {
                    console.log("ashdjkhasjkhjaksbcjaksbkjdasd", error);
                    alert("Unit not created. Please check internet connection.");
                });
        }
    };

    // getButtonText() {
    //   return this.state.switchOn4 ? 'Hour' : 'Day';
    // }

    getRightText() {
        return this.state.switchOn4 ? "" : "Off";
    }

    getLeftText() {
        return this.state.switchOn4 ? "On" : "";
    }

    onPress4 = () => {
        this.setState({switchOn4: !this.state.switchOn4});
    };

    render() {
        // console.log(this.state.tableData)
        console.log(
            "The Assocn Id -------$@#@#%@#$!@>",
            this.props.navigation.state.params.assocID
        );
        return (
            <View style={{flex: 1}}>
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
                        <View style={{flex: 0.2}}>
                            {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
                        </View>
                    </View>
                    <View style={{borderWidth: 1, borderColor: "orange"}}/>
                </SafeAreaView>

                <KeyboardAwareScrollView>
                    <View style={styles.textWrapper}>
                        <Text style={styles.titleText}>Add Unit</Text>
                        <View style={styles.associationDetailsView}>
                            <Text style={styles.titleChildText}>
                                {this.props.navigation.state.params.blockname}
                            </Text>
                        </View>
                        <ScrollView>
                            <View style={styles.associationDetailsView}>
                                <Text style={styles.titleChildText}>Unit Information</Text>
                                <View style={styles.fillAssociationDetailline}/>
                            </View>
                            <Card style={{height: hp("23%"), marginTop: hp("0")}}>
                                <View style={{flexDirection: "column"}}>
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
                                                autoCapitalize="characters"
                                                keyboardType="default"
                                                onChangeText={UnitNumber =>
                                                    this.setState({UnitNumber: UnitNumber})
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
                                        <View style={{flex: 1, height: hp("10%")}}>
                                            <Text style={styles.text1}>
                                                Occupancy Status & Ownership Status
                                                <Text style={styles.imp}>*</Text>
                                            </Text>
                                            <Dropdown
                                                containerStyle={[styles.box2]}
                                                // ref={this.typographyRef}
                                                onChangeText={value =>
                                                    this.setState({OccupancyStatus: value})
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

                            {this.state.OccupancyStatus == "Owner" ? (
                                <View>
                                    <View style={styles.associationDetailsView}>
                                        <Text style={styles.titleChildText}>
                                            Unit Owner Information
                                        </Text>
                                        <View style={styles.fillAssociationDetailline}/>
                                    </View>
                                    <Card
                                        style={{
                                            height: hp("30%"),
                                            marginTop: hp("0")
                                        }}
                                    >
                                        {this.state.OccupancyStatus == "Owner" ? (
                                            <View style={{height: hp("2%")}}>
                                                <View style={{flexDirection: "column"}}/>
                                            </View>
                                        ) : (
                                            <Text/>
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
                                                    height: hp("8.7%")
                                                }}
                                            >
                                                <Text style={styles.text1}>Owner First Name</Text>
                                                <Input
                                                    style={styles.box5}
                                                    placeholder="First Name"
                                                    // underlineColorAndroid="orange"
                                                    autoCorrect={false}
                                                    autoCapitalize="words"
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
                                                    height: hp("8.7%")
                                                }}
                                            >
                                                <Text style={styles.text1}>Owner Last Name</Text>
                                                <Input
                                                    style={styles.box5}
                                                    placeholder="Last Name"
                                                    // underlineColorAndroid="orange"
                                                    autoCorrect={false}
                                                    autoCapitalize="words"
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
                                            <View style={{flex: 1, height: hp("8.7%")}}>
                                                <Text style={styles.text1}>Owner Mobile Number</Text>
                                                <Input
                                                    style={styles.box5}
                                                    placeholder="Mobile Number"
                                                    // underlineColorAndroid="orange"
                                                    autoCorrect={false}
                                                    autoCapitalize="characters"
                                                    keyboardType="number-pad"
                                                    maxLength={10}
                                                    onChangeText={Unitomnum =>
                                                        this.setState({Unitomnum: Unitomnum})
                                                    }
                                                />
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                flex: 0.5,
                                                height: hp("8.7%"),
                                                flexDirection: "row",
                                                alignItems: "center",
                                                margin: hp("1.5%")
                                            }}
                                        >
                                            <View style={{marginRight: hp("1.2%")}}>
                                                <Text
                                                    style={{
                                                        color: "#696969",
                                                        fontSize: hp("1.5%"),
                                                    }}
                                                >
                                                    Admin
                                                </Text>
                                            </View>
                                            <View>
                                                <SwitchToggle
                                                    // buttonText={this.getButtonText()}
                                                    backTextRight={this.getRightText()}
                                                    backTextLeft={this.getLeftText()}
                                                    type={1}
                                                    buttonStyle={{
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        position: "absolute"
                                                    }}
                                                    rightContainerStyle={{
                                                        flex: 1,
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                    leftContainerStyle={{
                                                        flex: 1,
                                                        alignItems: "center",
                                                        justifyContent: "flex-start"
                                                    }}
                                                    buttonTextStyle={{
                                                        fontSize: hp("1.8%"),
                                                        color: "#000"
                                                    }}
                                                    textRightStyle={{
                                                        fontSize: hp("1.8%"),
                                                        color: "#000"
                                                    }}
                                                    textLeftStyle={{
                                                        fontSize: hp("1.8%"),
                                                        color: "#000"
                                                    }}
                                                    containerStyle={{
                                                        marginTop: hp("1%"),
                                                        width: 100,
                                                        height: 45,
                                                        borderRadius: 30,
                                                        padding: 5
                                                    }}
                                                    backgroundColorOn="#f5c469"
                                                    backgroundColorOff="#A4B0BD"
                                                    circleStyle={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: 27.5,
                                                        backgroundColor: "blue" // rgb(102,134,205)
                                                    }}
                                                    switchOn={this.state.switchOn4}
                                                    onPress={this.onPress4}
                                                    circleColorOff="#DAE0E2"
                                                    circleColorOn="#ff8c00"
                                                    duration={500}
                                                />
                                            </View>
                                        </View>
                                    </Card>
                                </View>
                            ) : (
                                <Text/>
                            )}
                            {this.state.OccupancyStatus == "Tenant" ? (
                                <View>
                                    <View style={styles.associationDetailsView}>
                                        <Text style={styles.titleChildText}>
                                            Unit Tenant Information
                                        </Text>
                                        <View style={styles.fillAssociationDetailline}/>
                                    </View>
                                    <Card
                                        style={{
                                            height: hp("25%"),
                                            marginTop: hp("0")
                                        }}
                                    >
                                        {this.state.OccupancyStatus ==
                                        "Tenant" ? (
                                            <View style={{height: hp("2%"), marginTop: hp("1%")}}/>
                                        ) : (
                                            <Text/>
                                        )}
                                        <View
                                            style={{
                                                height: hp("10%"),
                                                flexDirection: "row"
                                                // marginTop: hp("2%")
                                            }}
                                        >
                                            <View style={{flex: 0.5, height: hp("8.7%")}}>
                                                <Text style={styles.text1}>Tenant First Name</Text>
                                                <Input
                                                    style={styles.box5}
                                                    placeholder="First Name"
                                                    // underlineColorAndroid="orange"
                                                    autoCorrect={false}
                                                    autoCapitalize="words"
                                                    keyboardType="default"
                                                    onChangeText={Unittfname =>
                                                        this.setState({
                                                            Unittfname: Unittfname
                                                        })
                                                    }
                                                />
                                            </View>
                                            <View style={{flex: 0.5, height: hp("8.7%")}}>
                                                <Text style={styles.text1}>Tenant Last Name</Text>
                                                <Input
                                                    style={styles.box5}
                                                    placeholder="Last Name"
                                                    // underlineColorAndroid="orange"
                                                    autoCorrect={false}
                                                    autoCapitalize="words"
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
                                            <Text style={styles.text1}>Tenant Mobile Number</Text>
                                            <Item style={styles.bankDetailLine}>
                                                <Input
                                                    style={styles.box}
                                                    placeholder="Mobile Number"
                                                    // underlineColorAndroid="orange"
                                                    autoCorrect={false}
                                                    maxLength={10}
                                                    keyboardType="number-pad"
                                                    onChangeText={Unittmnum =>
                                                        this.setState({Unittmnum: Unittmnum})
                                                    }
                                                />
                                            </Item>
                                        </View>
                                    </Card>
                                </View>
                            ) : (
                                <Text/>
                            )}

                            <View style={{flexDirection: "row", marginBottom: hp("3%")}}>
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
                                        <Text style={{color: "white", fontSize: hp("2%")}}>
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
                                        onPress={() => this.createUnit()}
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
        borderColor: "white"
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
    head: {height: 40, backgroundColor: "#f1f8ff"},
    text: {textAlign: "center"},
    wrapper: {flexDirection: "row"},
    row: {height: 28},
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
    container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff"},
    head: {height: 40, backgroundColor: "#808B97"},
    text: {margin: 6},
    rowStyle: {flexDirection: "row", backgroundColor: "#FFF1C1"},
    btn: {width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2},
    btnText: {textAlign: "center", color: "#fff"},

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
