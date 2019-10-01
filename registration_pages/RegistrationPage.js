import React, {Component} from "react";
import {Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
// import RNExitApp from "react-native-exit-app";
import {updateUserInfo} from "../src/actions";
import {connect} from "react-redux";

console.disableYellowBox = true;

class AddRegularVisitor extends Component {
    state = {
        FirstName: "",
        LastName: "",
        MobileNumber: "",
        Mail: ""
    };

    constructor() {
        super();
        this.state = {
            data: null,
            valid: "",
            type: "",
            value: "",
            isLoading: false
        };

        this.renderInfo = this.renderInfo.bind(this);
    }

    Firstname = firstname => {
        updateUserInfo;
        this.setState({FirstName: firstname});
    };

    Lastname = lastname => {
        this.setState({LastName: lastname});
    };

    Mobile = mobile => {
        this.setState({MobileNumber: mobile});
    };

    Mail = email => {
        this.setState({Mail: email});
    };

    AddMember = (first, last, email) => {
        /*  this.setState({
                 valid: this.phone.isValidNumber(),
                 type: this.phone.getNumberType(),
                 value: this.phone.getValue()
             }); */

        var result = this.Validate(first, last, email);

        if (result === true) {
            member = {
                ACFName: first,
                ACLName: last,
                ACMobile: this.props.MyMobileNumber,
                ACMobile1: "",
                ACMobile2: "",
                ACMobile3: "",
                ACMobile4: "",
                ACEmail: email,
                ACEmail1: "",
                ACEmail2: "",
                ACEmail3: "",
                ACEmail4: "",
                ACISDCode: this.props.MyISDCode,
                ACISDCode1: "",
                ACISDCode2: "",
                ACISDCode3: "",
                ACISDCode4: ""
            };

            /* {
          "ACFName"  : "basava",	"ACLName" : "rajesh",	"ACMobile"  : "9480107369",	"ACMobile1" : "",	"ACMobile2" : "", 	"ACMobile3" : "",
          "ACMobile4" : "",	"ACEmail" : "basavarajeshk86@gmail.com",	"ACEmail1" : "",	"ACEmail2" : "",	"ACEmail3" : "",
          "ACEmail4": "",	"ACISDCode" : "+91",	"ACISDCode1" : "",	"ACISDCode2" : "",	"ACISDCode3" : "",	"ACISDCode4" : ""
      }*/
            const url = this.props.champBaseURL + "account/signup";
            //  const url = 'http://122.166.168.160/champ/api/v1/account/signup'

            console.log("member", JSON.stringify(member));
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                    "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
                },
                body: JSON.stringify(member)
            })
                .then(response => response.json())
                .then(responseJson => {
                    console.log("response", responseJson);

                    if (responseJson.success) {
                        const {updateUserInfo} = this.props;
                        const {
                            acAccntID,
                            acfName,
                            aclName,
                            acMobile,
                            acEmail,
                            acisdCode
                        } = responseJson.data.account;
                        updateUserInfo({prop: "MyAccountID", value: acAccntID});
                        updateUserInfo({prop: "MyEmail", value: acEmail});
                        updateUserInfo({prop: "MyMobileNumber", value: acMobile});
                        updateUserInfo({prop: "MyFirstName", value: acfName});
                        updateUserInfo({prop: "MyLastName", value: aclName});
                        updateUserInfo({prop: "MyISDCode", value: acisdCode});
                        updateUserInfo({prop: "signedIn", value: true});

                        console.log('Association check', responseJson.success);

                        this.props.navigation.navigate("App"); // Navigate to Join Association
                    } else {
                        console.log("hiii", "failed");
                        alert("failed to add user !");
                    }
                    console.log("suvarna", "hi");
                })
                .catch(error => {
                    console.error(error);
                    alert("caught error in adding user");
                });
        } else {
            console.log("Validation", "Failed");
        }
        //583506
    };

    Validate(first, last, email) {
        const reg = /^[0]?[6789]\d{9}$/;
        if (first == "" || first == undefined) {
            alert("Enter First Name");
            return false;
        } else if (first.length < 3) {
            alert("Enter Minimum 3 Characters");
            return false;
        } else if (this.props.oyeNonSpecialNameRegex.test(first) === true) {
            alert(" First Name should not contain Special Character");
            return false;
        } else if (last == "" || last == undefined) {
            alert("Enter Last Name");
            return false;
        } else if (this.props.oyeNonSpecialNameRegex.test(last) === true) {
            alert("Last Name should not contain Special Character");
            return false;
            //   } else if (reg.test(mobile) === false || first == undefined) {
            //     alert('Enter valid Mobile Number')
            //     return false;
        } else if (email == "" || email == undefined) {
            alert("Enter Email ID");
            return false;
        } else if (this.props.oyeEmailRegex.test(email) === false) {
            alert("Invalid Email ID ");
            return false;
        }
        return true;
    }

    renderInfo() {
        if (this.state.value) {
            return (
                <View style={styles.info}>
                    <Text>
                        {" "}
                        Is Valid:{" "}
                        <Text style={{fontWeight: "bold"}}>
                            {this.state.valid.toString()}
                        </Text>
                    </Text>
                    <Text>
                        {" "}
                        Type: <Text style={{fontWeight: "bold"}}>{this.state.type}</Text>
                    </Text>
                    <Text>
                        {" "}
                        Value:{" "}
                        <Text style={{fontWeight: "bold"}}>{this.state.value}</Text>
                    </Text>
                </View>
            );
        }
    }

    

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{flexDirection: "column"}}>
                        <View style={{flexDirection: "column", height: "35%"}}>
                            <Image
                                source={require("../pages/assets/images/building_complex.png")}
                                style={{width: "100%"}}
                            />
                        </View>

                        <View style={{flexDirection: "row", marginTop: 25}}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    marginLeft: "2%",
                                    marginTop: 5,
                                    height: 40,
                                    borderColor: "#F2F2F2",
                                    backgroundColor: "#F2F2F2",
                                    borderWidth: 1.5,
                                    borderRadius: 2
                                }}
                            >
                                <Image
                                    source={require("../pages/assets/images/man-user.png")}
                                    style={styles.imagee}
                                />
                                <TextInput
                                    style={styles.text1}
                                    underlineColorAndroid="transparent"
                                    placeholder="First Name"
                                    placeholderTextColor="#828282"
                                    autoCapitalize="words"
                                    maxLength={50}
                                    //value={this.state.FirstName}
                                    onChangeText={this.Firstname}
                                />
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    marginLeft: "2%",
                                    marginRight: 5,
                                    marginTop: 5,
                                    height: 40,
                                    borderColor: "#F2F2F2",
                                    backgroundColor: "#F2F2F2",
                                    borderWidth: 1.5,
                                    borderRadius: 2
                                }}
                            >
                                <Image
                                    source={require("../pages/assets/images/man-user.png")}
                                    style={styles.imagee}
                                />
                                <TextInput
                                    style={styles.text1}
                                    underlineColorAndroid="transparent"
                                    placeholder="Last Name"
                                    placeholderTextColor="#828282"
                                    autoCapitalize="words"
                                    maxLength={50}
                                    onChangeText={this.Lastname}
                                />
                            </View>
                        </View>
                        {/*   <View style={styles.input1}>
                            <Image style={{ flex: 1 }}
                                source={require('../pages/assets/images/call-answer.png')}
                                style={styles.imagee} />
                            <PhoneInput style={styles.text}
                                style={{ flex: 2 }}
                                ref={ref => {
                                    this.phone = ref;
                                }}
                            />
                            <TextInput
                                style={styles.text}
                                style={{ flex: 5 }}
                                underlineColorAndroid="transparent"
                                placeholder="Mobile Number"
                                placeholderTextColor="#828282"
                                autoCapitalize="none"
                                keyboardType={'numeric'}
                                maxLength={10}
                                onChangeText={this.Mobile} />
                        </View> */}
                        <Text
                            style={{
                                fontSize: 13,
                                color: "black",
                                margin: 10,
                                justifyContent: "center",
                                alignSelf: "center",
                                alignContent: "center"
                            }}
                        >
                            {global.MyISDCode} {global.MyMobileNumber}{" "}
                        </Text>
                        <View style={styles.input1}>
                            <Image
                                source={require("../pages/assets/images/envelope.png")}
                                style={styles.imagee}
                            />
                            <TextInput
                                style={styles.text1}
                                underlineColorAndroid="transparent"
                                placeholder="Email ID"
                                placeholderTextColor="#828282"
                                autoCapitalize="none"
                                maxLength={50}
                                onChangeText={this.Mail}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.rectangle}
                            onPress={this.AddMember.bind(
                                this,
                                this.state.FirstName,
                                this.state.LastName,
                                this.state.Mail
                            )}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    padding: 3,
                                    alignSelf: "center",
                                    color: "#ed8a19"
                                }}
                            >
                                Register{" "}
                            </Text>
                        </TouchableOpacity>

                        {/*  <View style={{ flexDirection: 'row', paddingTop: 40 }}>
                            <View style={{ backgroundColor: '#929292', height: 1, flex: 1, alignSelf: 'center' }} />
                            <Text style={{ alignSelf: 'center', paddingHorizontal: 5, fontSize: 18 }}>OR</Text>
                            <View style={{ backgroundColor: '#929292', height: 1, flex: 1, alignSelf: 'center' }} />
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 20 }}>
                            <Text style={{ fontSize: 16, alignSelf: 'center', marginleft: 30 }}>
                                Login with? </Text>
                        </View> */}
                        <View
                            style={{
                                backgroundColor: "white",
                                padding: 5,
                                margin: 15,
                                alignContent: "center"
                            }}
                        >
                            <Text
                                style={{
                                    marginTop: 20,
                                    fontSize: 16,
                                    padding: 3,
                                    alignSelf: "center"
                                }}
                            >
                                JABM Property Managers Pvt Ltd{" "}
                            </Text>
                        </View>
                        
                    </View>
                </ScrollView>
            </View>
        );
    }

    componentDidMount() {
        console.log("testing", this.props.oyeNonSpecialNameRegex.test("email"));
    }
}

const mapStateToProps = state => {
    return {
        MyMobileNumber: state.UserReducer.MyMobileNumber,
        MyISDCode: state.UserReducer.MyISDCode,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oyeNonSpecialNameRegex: state.OyespaceReducer.oyeNonSpecialNameRegex,
        oyeEmailRegex: state.OyespaceReducer.oyeEmailRegex
    };
};

export default connect(
    mapStateToProps,
    {updateUserInfo}
)(AddRegularVisitor);

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        backgroundColor: "#fff",
        height: "100%",
        width: "100%"
    },
    input1: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        height: 40,
        borderColor: "#F2F2F2",
        backgroundColor: "#F2F2F2",
        borderWidth: 1.5,
        borderRadius: 2,
        flexDirection: "row"
    },
    rectangle: {
        backgroundColor: "white",
        padding: 5,
        borderColor: "orange",
        height: 40,
        marginTop: 20,
        marginRight: 40,
        marginLeft: 40,
        borderRadius: 2,
        borderWidth: 1,
        alignContent: "center"
    },

    input: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 40,
        height: 40,
        borderColor: "#F2F2F2",
        backgroundColor: "#F2F2F2",
        borderWidth: 1.5,
        borderRadius: 2,
        flexDirection: "row"
    },

    input_two: {
        marginLeft: 15,
        marginTop: 15,
        height: 40,
        borderColor: "#F2F2F2",
        backgroundColor: "#F2F2F2",
        borderWidth: 1.5,
        borderRadius: 2
    },

    imagee: {height: 14, width: 14, margin: 10},

    text: {fontSize: 12, color: "black", justifyContent: "center"},
    text1: {
        fontSize: 12,
        color: "black",
        justifyContent: "center",
        width: "65%"
    },

    submitButton: {
        backgroundColor: "#7a42f4",
        padding: 10,
        margin: 15,
        height: 40
    },

    submitButtonText: {color: "#FA9917"}
});
