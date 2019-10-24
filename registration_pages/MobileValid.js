import React, {Component, Fragment} from "react";
import {Dimensions, Image, SafeAreaView, StyleSheet, Text, View} from "react-native";
import ProgressLoader from "rn-progress-loader";
import base from "../src/base";
import CheckBox from "react-native-check-box";
import {TextField} from "react-native-material-textfield";
import CountryPicker from "react-native-country-picker-modal";
import Header from "./Header.js";
import {Button} from "native-base";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {connect} from "react-redux";
import {updateUserInfo} from "../src/actions";

class MobileValid extends Component {
    static navigationOptions = {
        title: "Mobile",
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {

            Mobilenumber: "",
            OTPNumber: "",
            cca2: "IN",
            callingCode: "91",
            isLoading: false,
            checked: true,
            isChecked: true
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                isLoading: false
            });
        }, 1500);
    }

    handleMobile = mobilenumber => {
        let num = mobilenumber.replace(".", '');
        if (isNaN(num)) {
            // Its not a number
        } else {
            this.setState({Mobilenumber: mobilenumber});
        }

    };

    getOtp = mobilenumber => {

        // this.props.navigation.navigate('OTPVerificationScreen');

        const reg = /^[0]?[6789]\d{9}$/;
        const countryCode = "+" + this.state.callingCode; //this.phone.getValue();

        if (mobilenumber == 0) {
            alert("Mobile Number is a mandatory field");
        } else if (!this.state.isChecked) {
            alert(
                "Please read and accept our Terms and Conditions and Privacy Policy to proceed"
            );
        } else if (reg.test(mobilenumber) === false) {
            alert("Please enter a valid (10 digit) Mobile number");
            return false;
        } else {
            anu = {
                CountryCode: countryCode,
                MobileNumber: mobilenumber
            };

            console.log('jhgjhghjgjh', this.props);

            url = `http://${this.props.oyeURL}/oyeliving/api/v1/account/sendotp`;
            //  http://api.oyespace.com/champ/api/v1/account/sendotp

            this.setState({
                isLoading: true
            });

            const {updateUserInfo} = this.props;

            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
                },
                body: JSON.stringify(anu)
            })
                .then(response => response.json())
                .then(responseJson => {
                    if (responseJson.success) {
                        console.log("responseJson Account if", responseJson, responseJson.data);
                        // this.insert_OTP(mobilenumber, countryCode);
                        updateUserInfo({prop: "MyMobileNumber", value: mobilenumber});
                        updateUserInfo({prop: "MyISDCode", value: countryCode});
                        // global.MyMobileNumber = mobilenumber;
                        // global.MyISDCode = countryCode;
                        this.setState({
                            isLoading: false
                        });
                        this.props.navigation.navigate("OTPVerificationScreen");


                    }
                })
                .catch(error => {
                    console.log(error);
                    alert(" Failed to Get OTP");
                    this.setState({
                        isLoading: false
                    });
                });
        }
    };


    render() {
        return (
            <Fragment>
                <SafeAreaView style={{flex: 0, backgroundColor: "#ff8c00"}}/>
                <SafeAreaView style={{flex: 1, backgroundColor: "white"}}>
                    {/* {this.state.isLoading1 ? (
            <SplashScreen />
          ) : ( */}
                    <View style={styles.container}>
                        <View style={{flex: 1}}>
                            <View>
                                <Header/>
                            </View>
                            <KeyboardAwareScrollView>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "column",
                                        backgroundColor: "#fff"
                                    }}
                                >
                                    <View style={{flexDirection: "column"}}>
                                        <View
                                            style={{justifyContent: "center", alignItems: "center"}}
                                        >
                                            <Text
                                                style={{
                                                    color: "#ff8c00",
                                                    fontSize: hp("2.5%"),
                                                    marginTop: hp("1.5%"),
                                                    marginBottom: hp("1.5%")
                                                }}
                                            >
                                                Mobile Number Verification
                                            </Text>
                                        </View>
                                        <View
                                            style={{justifyContent: "center", alignItems: "center"}}
                                        >
                                            <Image
                                                source={require("../icons/workstation-illustration-pack_2x.png")}
                                                style={{
                                                    width: Dimensions.get("screen").width,
                                                    height: hp("30%")
                                                }}
                                            />
                                        </View>
                                    </View>

                                    {/* {this.state.isLoading ? (
                                        <View style={{ height: hp("5%") }}>
                                            <ActivityIndicator />
                                        </View>
                                    ) : (
                                            <Text style={{ height: hp("5%") }}> </Text>
                                        )} */}
                                    <View style={styles.mobilenumberverification}>
                                        <Text style={{fontSize: hp("2%")}}>
                                            Enter your mobile number to get{" "}
                                            <Text style={{fontSize: hp("2%"), color: "#ff8c00"}}>
                                                OTP
                                            </Text>
                                        </Text>
                                    </View>

                                    <View style={styles.number}>
                                        <View
                                            style={{
                                                flex: 0.1,
                                                flexDirection: "row",
                                                alignItems: "center"
                                            }}
                                        >
                                            <CountryPicker
                                                hideAlphabetFilter={true}
                                                onChange={value => {
                                                    this.setState({
                                                        cca2: value.cca2,
                                                        callingCode: value.callingCode
                                                    });
                                                }}
                                                cca2={this.state.cca2}
                                                translation="eng"
                                            />
                                        </View>

                                        <View
                                            style={{
                                                flex: 0.15,
                                                flexDirection: "row",
                                                marginLeft: hp("0.5%"),
                                                alignItems: "center"
                                            }}
                                        >
                                            <Text style={{color: "black", fontSize: hp("1.8%")}}>
                                                +{this.state.callingCode}
                                            </Text>
                                        </View>

                                        <View style={{flex: 0.5, marginTop: hp("2%")}}>
                                            <TextField
                                                label="Mobile Number"
                                                fontSize={16}
                                                labelHeight={10}
                                                characterRestriction={10}
                                                activeLineWidth={0.5}
                                                keyboardType="numeric"
                                                returnKeyType="done"
                                                maxLength={10}
                                                onChangeText={this.handleMobile}
                                            />
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            height: hp("5%"),
                                            flexDirection: "row",
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                            alignContent: "flex-start"
                                        }}
                                    >
                                        <View
                                            style={{
                                                marginLeft: hp("1.8%"),
                                                flexDirection: "row",
                                                marginTop: hp("3%"),
                                                width: '90%'
                                            }}
                                        >
                                            <CheckBox
                                                onClick={() => {
                                                    this.setState({
                                                        isChecked: !this.state.isChecked
                                                    });
                                                }}
                                                isChecked={this.state.isChecked}
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
                                            <Text
                                                style={{
                                                    marginLeft: hp("0.5%"),
                                                    color: "#020202",
                                                    fontSize: hp("1.45%"),
                                                    marginTop: hp("0.5%")
                                                }}
                                            >
                                                I have read and accepted the{" "}
                                                <Text
                                                    style={{fontSize: hp("1.45%"), color: "#ff8c00"}}
                                                    onPress={() => {
                                                        this.props.navigation.navigate("privacyPolicy")
                                                        /*Linking.openURL(
                                                            "https://www.oyespace.com/privacy"
                                                        );*/
                                                    }}
                                                >
                                                    privacy policy{" "}
                                                </Text>
                                                and
                                                <Text
                                                    style={{fontSize: hp("1.45%"), color: "#ff8c00"}}
                                                    onPress={() => {
                                                        this.props.navigation.navigate("termsAndConditions")

                                                        /*Linking.openURL(
                                                            "https://www.oyespace.com/terms"
                                                        );*/
                                                    }}
                                                >
                                                    {" "}
                                                    terms of use.
                                                </Text>
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{alignSelf: "center", marginTop: hp("10%")}}>
                                        <Button
                                            onPress={this.getOtp.bind(this, this.state.Mobilenumber)}
                                            style={{
                                                width: wp("30%"),
                                                height: hp("4.8%"),
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: "#ff8c00"
                                            }}
                                            rounded
                                        >
                                            <Text style={{color: "white", fontSize: hp("2%")}}>
                                                Get OTP
                                            </Text>
                                        </Button>
                                    </View>
                                </View>
                                <ProgressLoader
                                    isHUD={true}
                                    isModal={true}
                                    visible={this.state.isLoading}
                                    color={base.theme.colors.primary}
                                    hudColor={"#FFFFFF"}
                                />
                            </KeyboardAwareScrollView>
                        </View>
                    </View>

                </SafeAreaView>
            </Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    input: {
        margin: 15,
        height: 40,
        borderColor: "#7a42f4",
        borderWidth: 1
    },

    number: {
        flexDirection: "row",
        width: Dimensions.get("screen").width,
        justifyContent: "center",
        alignItems: "center"
    },

    mobilenumberverification: {
        height: hp("6%"),
        width: Dimensions.get("screen").width,
        alignItems: "center",
        justifyContent: "center"
    }
});

const mapStateToProps = state => {
    return {
        oyeURL: state.OyespaceReducer.oyeURL,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oye247BaseURL: state.OyespaceReducer.oye247BaseURL,
        oyeBaseURL: state.OyespaceReducer.oyeBaseURL
    };
};

export default connect(mapStateToProps, {updateUserInfo})(MobileValid);
