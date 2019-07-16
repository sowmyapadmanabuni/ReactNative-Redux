import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert
} from "react-native";
import { Button, Card, CardItem } from "native-base";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { DatePickerDialog } from "react-native-datepicker-dialog";
import axios from "axios";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { connect } from "react-redux";
import {
  updateJoinedAssociation,
  createUserNotification
} from "../src/actions";
import _ from "lodash";
import { CLOUD_FUNCTION_URL } from "../constant";
import firebase from "react-native-firebase";
import unitlist from "./unitlist";

class RegisterMe extends Component {
  static navigationOptions = {
    title: "Register Me",
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      //date picker
      dobText: "Select Date of Occupancy", //year + '-' + month + '-' + date,
      dobDate: "",

      unitofperson: false,
      unitofperson1: false
    };
  }

  //Date Picker
  onDOBPress = () => {
    let dobDate = this.state.dobDate;
    if (!dobDate || dobDate == null) {
      dobDate = new Date();
      this.setState({
        dobDate: dobDate
      });
    }
    this.refs.dobDialog.open({
      date: dobDate,
      // minDate: new Date() //To restirct past dates
    });
  };

  onDOBDatePicked = date => {
    this.setState({
      dobDate: date,
      dobText: moment(date).format("YYYY-MM-DD")
    });
  };

  submitForOwnwer = () => {
    const {
      AssnId,
      associationName,
      unitList
    } = this.props.navigation.state.params;
    if (this.state.dobText == "Select Date of Occupancy") {
      alert("Select Date of Occupancy");
    } else if (this.checkStatus()) {
      alert("You already requested to join this unit");
    } else {
      anu = {
        ASAssnID: unitList.asAssnID,
        BLBlockID: unitList.blBlockID,
        UNUnitID: unitList.unUnitID,
        MRMRoleID: parseInt("6"),
        FirstName: this.props.MyFirstName,
        MobileNumber: this.props.MyMobileNumber,
        ISDCode: this.props.MyISDCode,
        LastName: this.props.MyLastName,
        Email: this.props.MyEmail,
        SoldDate: this.state.dobText,
        OccupancyDate: this.state.dobText
      };

      let champBaseURL = this.props.champBaseURL;

      axios
        .post(
          `${champBaseURL}/association/join`,
          {
            ASAssnID: unitList.asAssnID,
            BLBlockID: unitList.blBlockID,
            UNUnitID: unitList.unUnitID,
            MRMRoleID: parseInt("6"),
            FirstName: this.props.MyFirstName,
            MobileNumber: this.props.MyMobileNumber,
            ISDCode: this.props.MyISDCode,
            LastName: this.props.MyLastName,
            Email: this.props.MyEmail,
            SoldDate: this.state.dobText,
            OccupancyDate: this.state.dobText
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
            }
          }
        )
        .then(response => {
          // console.log("*******");
          // console.log("here_1 ");
          // console.log("*******");
          let responseData_1 = response.data;
          if (responseData_1.success) {
            let headers_2 = {
              "Content-Type": "application/json",
              "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
            };
            let mobileNo = this.props.MyISDCode + this.props.MyMobileNumber;
            // console.log(mobileNo);
            axios
              .post(
                "http://" +
                  this.props.oyeURL +
                  "/oyeliving/api/v1/Member/GetRequestorDetails",
                {
                  ACMobile: mobileNo,
                  ASAssnID: unitList.asAssnID,
                  UNUnitID: unitList.unUnitID,
                  MRMRoleID: parseInt("6")
                },
                {
                  headers: headers_2
                }
              )
              .then(response_2 => {
                let responseData_2 = response_2.data.data.member;
                console.log("*******");
                console.log("here_2 ", responseData_2);

                if (!_.isEmpty(responseData_2)) {
                  let userID = this.props.MyAccountID;
                  let sbUnitID = unitList.unUnitID;
                  let unitName = unitList.unUniName;
                  let adminAccId = unitList.acAccntID;
                  let sbSubID =
                    this.props.MyAccountID.toString() +
                    unitList.unUnitID.toString() +
                    "usernotif";
                  let sbRoleId = "2";
                  let sbMemID = responseData_2.meMemID;
                  let sbName =
                    this.props.MyFirstName + " " + this.props.MyLastName;
                  let associationID = AssnId;
                  // let associationName = associationName;
                  let ntType = "Join";
                  let ntTitle =
                    "Request to join" +
                    " " +
                    associationName +
                    " " +
                    "Association";
                  let roleName = "Owner";
                  let ntDesc =
                    sbName +
                    " " +
                    "requested to join" +
                    unitName +
                    " " +
                    "unit in " +
                    associationName +
                    " " +
                    "association as " +
                    roleName;
                  let soldDate = this.state.dobText;
                  let occupancyDate = this.state.dobText;

                  // console.log("userId", userID);
                  // console.log("sbUnitID", sbUnitID);
                  // console.log("sbSubID", sbSubID);
                  // console.log("sbRoleId", sbRoleId);
                  // console.log("sbMemID", sbMemID);
                  // console.log("sbName", sbName);
                  // console.log("associationID", associationID);
                  // console.log("ntType", ntType);
                  // console.log("ntTitle", ntTitle);
                  // console.log("ntDesc", ntDesc);

                  firebase.messaging().subscribeToTopic(sbSubID);
                  // alert(sbSubID)
                  // Send a push notification to the admin here
                  axios
                    .post(`${CLOUD_FUNCTION_URL}/sendAdminNotification`, {
                      userID: userID.toString(),
                      sbUnitID: sbUnitID.toString(),
                      unitName: unitName.toString(),
                      sbSubID: sbSubID.toString(),
                      sbRoleId: sbRoleId,
                      sbMemID: sbMemID.toString(),
                      sbName: sbName,
                      associationID: AssnId.toString(),
                      associationName: associationName,
                      ntType: ntType,
                      ntTitle: ntTitle,
                      ntDesc: ntDesc,
                      roleName: roleName,
                      soldDate: soldDate,
                      occupancyDate: occupancyDate
                    })
                    .then(response_3 => {
                      this.setState({ loading: false });
                      this.props.createUserNotification(
                        ntType,
                        this.props.oyeURL,
                        adminAccId,
                        this.props.navigation.state.params.AssnId.toString(),
                        ntDesc,
                        sbUnitID.toString(),
                        sbMemID.toString(),
                        sbSubID.toString(),
                        sbRoleId,
                        this.props.navigation.state.params.associationName,
                        unitName.toString(),
                        occupancyDate,
                        soldDate
                      );
                      this.props.navigation.navigate("SplashScreen");
                      this.props.updateJoinedAssociation(
                        this.props.joinedAssociations,
                        unitList.unUnitID
                      );

                      fetch(
                        `http://${
                          this.props.oyeURL
                        }/oyeliving/api/v1/Member/GetMemberListByAccountID/${
                          this.props.MyAccountID
                        }`,
                        {
                          method: "GET",
                          headers: headers_2
                        }
                      )
                        .then(response => response.json())
                        .then(responseJson => {
                          console.log(
                            "2312#!@$@#%$#24235346$^#$^#",
                            this.state.unitofperson
                          );

                          let count = Object.keys(
                            responseJson.data.memberListByAccount
                          ).length;
                          for (let i = 0; i < count; i++) {
                            if (
                              responseJson.data.memberListByAccount[i]
                                .unUnitID ===
                              this.props.navigation.state.params.unitList
                                .unUnitID
                            ) {
                              this.setState({ unitofperson: true });
                            }
                          }
                          console.log("@$!@$!@$2$41242$@$@#$@#4", count);
                        })
                        .catch(error => {
                          console.log("second error", error);
                        });
                      console.log(
                        "2312#!@$@#%$#24235346$^#$^#",
                        this.state.unitofperson
                      );
                      {
                        this.state.unitofperson === true
                          ? Alert.alert(
                              "Oyespace",
                              "Request Send to Admin Successfully",
                              [
                                {
                                  text: "Ok",
                                  
                                }
                              ],
                              { cancelable: false }
                            )
                          : Alert.alert(
                              "Oyespace",
                              "Request Send to Admin Successfully",
                              [
                                {
                                  text: "Ok",
                                  // onPress: () =>
                                  //   this.props.navigation.navigate(
                                  //     "CreateOrJoinScreen"
                                  //   )
                                }
                              ],
                              { cancelable: false }
                            );
                      }
                    });
                } else {
                  this.setState({ loading: false });
                  Alert.alert(
                    "Alert",
                    "You have already requested to join previously, your request is under review. You would be notified once review is complete",
                    [{ text: "Ok", onPress: () => {} }],
                    { cancelable: false }
                  );
                }
              })
              .catch(error => {
                this.setState({ loading: false });
                console.log("********");
                console.log(error);
                console.log("********");
              });
          } else {
            this.setState({ loading: false });
            Alert.alert(
              "Alert",
              "Request not sent..!",
              [{ text: "Ok", onPress: () => {} }],
              { cancelable: false }
            );
          }
        })
        .catch(error => {
          console.log("second error", error);
          this.setState({ loading: false });
          Alert.alert(
            "Alert",
            "Request not sent..!",
            [{ text: "Ok", onPress: () => {} }],
            { cancelable: false }
          );
        });
    }
  };

  submitForTenant = () => {
    const {
      AssnId,
      associationName,
      unitList
    } = this.props.navigation.state.params;
    // this.checkStatus();

    if (this.state.dobText == "Select Date of Occupancy") {
      alert("Select Date of Occupancy");
    } else if (this.checkStatus()) {
      alert("You already requested to join this unit");
    } else {
      anu = {
        ASAssnID: unitList.asAssnID,
        BLBlockID: unitList.blBlockID,
        UNUnitID: unitList.unUnitID,
        MRMRoleID: parseInt("7"),
        FirstName: this.props.MyFirstName,
        MobileNumber: this.props.MyMobileNumber,
        ISDCode: this.props.MyISDCode,
        LastName: this.props.MyLastName,
        Email: this.props.MyEmail,
        SoldDate: this.state.dobText,
        OccupancyDate: this.state.dobText
      };

      let champBaseURL = this.props.champBaseURL;
      console.log(champBaseURL);

      axios
        .post(
          `${champBaseURL}/association/join`,
          {
            ASAssnID: unitList.asAssnID,
            BLBlockID: unitList.blBlockID,
            UNUnitID: unitList.unUnitID,
            MRMRoleID: parseInt("7"),
            FirstName: this.props.MyFirstName,
            MobileNumber: this.props.MyMobileNumber,
            ISDCode: this.props.MyISDCode,
            LastName: this.props.MyLastName,
            Email: this.props.MyEmail,
            SoldDate: this.state.dobText,
            OccupancyDate: this.state.dobText
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
            }
          }
        )
        .then(response => {
          console.log("*******");
          console.log("here_1 ");
          console.log("*******");
          let responseData_1 = response.data;
          if (responseData_1.success) {
            let headers_2 = {
              "Content-Type": "application/json",
              "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
            };

            let mobileNo = this.props.MyISDCode + this.props.MyMobileNumber;
            console.log(mobileNo);
            axios
              .post(
                "http://" +
                  this.props.oyeURL +
                  "/oyeliving/api/v1/Member/GetRequestorDetails",
                {
                  ACMobile: mobileNo,
                  ASAssnID: this.props.navigation.state.params.AssnId,
                  UNUnitID: unitList.unUnitID,
                  MRMRoleID: parseInt("7")
                },
                {
                  headers: headers_2
                }
              )
              .then(response_2 => {
                let responseData_2 = response_2.data.data.member;
                console.log("*******");
                console.log("here_2 ", responseData_2);

                if (!_.isEmpty(responseData_2)) {
                  let userID = this.props.MyAccountID;
                  let adminAccId = unitList.acAccntID;
                  let sbUnitID = unitList.unUnitID;
                  let unitName = unitList.unUniName;
                  let sbSubID =
                    this.props.MyAccountID.toString() +
                    unitList.unUnitID.toString() +
                    "usernotif";
                  let sbRoleId = "3";
                  let sbMemID = responseData_2.meMemID;
                  let sbName =
                    this.props.MyFirstName + " " + this.props.MyLastName;
                  let associationID = AssnId;
                  let ntType = "Join";
                  let ntTitle =
                    "Request to join" +
                    " " +
                    associationName +
                    " " +
                    "Association";
                  let roleName = "Tenant";
                  let ntDesc =
                    sbName +
                    " " +
                    "requested to join" +
                    unitName +
                    " " +
                    "unit in " +
                    associationName +
                    " " +
                    "association as " +
                    roleName;
                  let soldDate = this.state.dobText;
                  let occupancyDate = this.state.dobText;

                  firebase.messaging().subscribeToTopic(sbSubID);
                  // alert(sbSubID)
                  // Send a push notification to the admin here
                  axios
                    .post(`${CLOUD_FUNCTION_URL}/sendAdminNotification`, {
                      userID: userID.toString(),
                      sbUnitID: sbUnitID.toString(),
                      unitName: unitName.toString(),
                      sbSubID: sbSubID.toString(),
                      sbRoleId: sbRoleId,
                      sbMemID: sbMemID.toString(),
                      sbName: sbName,
                      associationID: this.props.navigation.state.params.AssnId.toString(),
                      associationName: this.props.navigation.state.params
                        .associationName,
                      ntType: ntType,
                      ntTitle: ntTitle,
                      ntDesc: ntDesc,
                      roleName: roleName,
                      soldDate: soldDate,
                      occupancyDate: occupancyDate
                    })
                    .then(response_3 => {
                      this.setState({ loading: false });
                      this.props.createUserNotification(
                        ntType,
                        this.props.oyeURL,
                        adminAccId,
                        this.props.navigation.state.params.AssnId.toString(),
                        ntDesc,
                        sbUnitID.toString(),
                        sbMemID.toString(),
                        sbSubID.toString(),
                        sbRoleId,
                        this.props.navigation.state.params.associationName,
                        unitName.toString(),
                        occupancyDate,
                        soldDate
                        // this.props.navigation
                      );

                      this.props.navigation.navigate("SplashScreen");
                      this.props.updateJoinedAssociation(
                        this.props.joinedAssociations,
                        unitList.unUnitID
                      );
                      fetch(
                        `http://${
                          this.props.oyeURL
                        }/oyeliving/api/v1/Member/GetMemberListByAccountID/${
                          this.props.MyAccountID
                        }`,
                        {
                          method: "GET",
                          headers: headers_2
                        }
                      )
                        .then(response => response.json())
                        .then(responseJson => {
                          console.log(
                            "2312#!@$@#%$#24235346$^#$^#",
                            this.state.unitofperson1
                          );

                          let count = Object.keys(
                            responseJson.data.memberListByAccount
                          ).length;
                          for (let i = 0; i < count; i++) {
                            if (
                              responseJson.data.memberListByAccount[i]
                                .unUnitID ===
                              this.props.navigation.state.params.unitList
                                .unUnitID
                            ) {
                              this.setState({ unitofperson1: true });
                            }
                          }
                          console.log("@$!@$!@$2$41242$@$@#$@#4", count);
                        })
                        .catch(error => {
                          console.log("second error", error);
                        });
                      console.log(
                        "2312#!@$@#%$#24235346$^#$^#",
                        this.state.unitofperson1
                      );
                      {
                        this.state.unitofperson1 === true
                          ? Alert.alert(
                              "Oyespace",
                              "Request Send to Admin Successfully",
                              [
                                {
                                  text: "Ok",
                                  // onPress: () =>
                                  //   this.props.navigation.navigate(
                                  //     "Dashboard"
                                  //   )
                                }
                              ],
                              { cancelable: false }
                            )
                          : Alert.alert(
                              "Oyespace",
                              "Request Send to Admin Successfully",
                              [
                                {
                                  text: "Ok",
                                  // onPress: () =>
                                  //   this.props.navigation.navigate(
                                  //     "CreateOrJoinScreen"
                                  //   )
                                }
                              ],
                              { cancelable: false }
                            );
                      }
                    });
                } else {
                  this.setState({ loading: false });
                  Alert.alert(
                    "Alert",
                    "You have already requested to join previously, your request is under review. You would be notified once review is complete",
                    [{ text: "Ok", onPress: () => {} }],
                    { cancelable: false }
                  );
                }
              })
              .catch(error => {
                this.setState({ loading: false });
                console.log("********");
                console.log(error);
                console.log("********");
              });
          } else {
            this.setState({ loading: false });
            Alert.alert(
              "Alert",
              "Request not sent..!",
              [{ text: "Ok", onPress: () => {} }],
              { cancelable: false }
            );
          }
        })
        .catch(error => {
          console.log("second error", error);
          this.setState({ loading: false });
          Alert.alert(
            "Alert",
            "Request not sent..!",
            [{ text: "Ok", onPress: () => {} }],
            { cancelable: false }
          );
        });
    }
  };

  checkStatus = () => {
    const { unitList, AssnId } = this.props.navigation.state.params;
    const { joinedAssociations } = this.props;
    let unitID = unitList.unUnitID;

    let status = _.includes(joinedAssociations, unitID);

    return status;
    // console.log("unitId", unitID);
    // console.log(_.includes(joinedAssociations, unitID));
  };

  render() {
    const { unitList, AssnId } = this.props.navigation.state.params;
    console.log("unitList", unitList);
    return (
      <View style={styles.container}>
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

        <Text style={styles.titleOfScreen}>Register Me</Text>
        {unitList.owner.length > 0 ? (
          <View style={{ flexDirection: "column" }}>
            <View style={styles.box}>
              <Text style={{ color: "#fff", fontSize: hp("2.2%") }}>
                Join Us
              </Text>
            </View>
            <View style={styles.View}>
              <Card style={styles.DateCard}>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                    <View style={styles.datePickerBox}>
                      <View style={styles.calView}>
                        <Image
                          style={styles.viewDatePickerImageStyle}
                          source={require("../icons/cal.png")}
                        />
                      </View>

                      <Text style={styles.datePickerText}>
                        {this.state.dobText}{" "}
                      </Text>
                      <DatePickerDialog
                        ref="dobDialog"
                        onDatePicked={this.onDOBDatePicked.bind(this)}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </Card>
            </View>

            <View style={{ flexDirection: "column", marginTop: hp("3%") }}>
              <View style={styles.View}>
                <TouchableOpacity onPress={() => this.submitForOwnwer()}>
                  <Card style={styles.Card}>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Text style={{ fontSize: hp("2%") }}>Join As Owner</Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              </View>
              <View style={styles.View}>
                <TouchableOpacity onPress={() => this.submitForTenant()}>
                  <Card style={styles.Card}>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Text style={{ fontSize: hp("2%") }}>Join As Tenant</Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              </View>
            </View>

            {/* <Text>{unitList.owner[0].uofName}</Text> */}
          </View>
        ) : (
          <View style={{ flexDirection: "column" }}>
            <View style={styles.box}>
              <Text style={{ color: "#fff", fontSize: hp("2.2%") }}>
                Join Us
              </Text>
            </View>
            <View style={styles.View}>
              <Card style={styles.DateCard}>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                    <View style={styles.datePickerBox}>
                      <View style={styles.calView}>
                        <Image
                          style={styles.viewDatePickerImageStyle}
                          source={require("../icons/cal.png")}
                        />
                      </View>

                      <Text style={styles.datePickerText}>
                        {this.state.dobText}{" "}
                      </Text>
                      <DatePickerDialog
                        ref="dobDialog"
                        onDatePicked={this.onDOBDatePicked.bind(this)}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </Card>
            </View>

            <View style={{ flexDirection: "column", marginTop: hp("3%") }}>
              <View style={styles.View}>
                <TouchableOpacity onPress={() => this.submitForOwnwer()}>
                  <Card style={styles.Card}>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Text style={{ fontSize: hp("2%") }}>Join As Owner</Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              </View>
              <View style={styles.View}>
                <TouchableOpacity onPress={() => this.submitForTenant()}>
                  <Card style={styles.Card}>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Text style={{ fontSize: hp("2%") }}>Join As Tenant</Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              </View>
            </View>

            {/* <Text>{unitList.owner[0].uofName}</Text> */}
          </View>
        
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  titleOfScreen: {
    marginTop: hp("1.6%"),
    textAlign: "center",
    fontSize: hp("2%"),
    fontWeight: "bold",
    color: "#ff8c00",
    marginBottom: hp("1.6%")
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
  box: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff8c00",
    height: hp("5%"),
    marginLeft: hp("2%"),
    marginRight: hp("2%")
  },
  View: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  Card: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    width: hp("30%"),
    height: hp("6%"),
    borderRadius: hp("2%"),
    marginBottom: hp("2%")
  },
  DateCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    width: hp("35%"),
    height: hp("6%"),
    marginTop: hp("5%")
  },
  datePickerBox: {
    margin: hp("1.0%"),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: hp("4%"),
    padding: 0
  },
  datePickerText: {
    fontSize: hp("2%"),
    marginLeft: hp("2%"),
    marginRight: hp("2%"),
    color: "#474749"
  },
  calView: {
    width: hp("3%"),
    height: hp("3%"),
    alignItems: "center",
    justifyContent: "center"
  },
  viewDatePickerImageStyle: {
    width: wp("4.5%"),
    height: hp("3%"),
    marginRight: hp("0.2%")
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
    MyAccountID: state.UserReducer.MyAccountID
  };
};

export default connect(
  mapStateToProps,
  { updateJoinedAssociation, createUserNotification }
)(RegisterMe);

