import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
  FlatList,
  TextInput,
  Dimensions,
  Alert,
  TouchableHighlight,BackHandler
} from "react-native";
import { Button, Card, CardItem } from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Modal from "react-native-modal";
import { NavigationEvents } from "react-navigation";
// import Swipeout from 'react-native-swipeout';
import axios from "axios";
import moment from "moment";
import { DatePickerDialog } from "react-native-datepicker-dialog";
import { connect } from "react-redux";
import {
  updateJoinedAssociation,
  createUserNotification,
  getAssoMembers
} from "../src/actions";
import _ from "lodash";
import { CLOUD_FUNCTION_URL } from "../constant";
import firebase from "react-native-firebase";
import unitlist from "./unitlist";

class UnitList extends Component {
  static navigationOptions = {
    title: "Unit List",
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      query: "",
      loading: false,
      error: null,
      isModalVisible: false,

      //date picker
      dobText: "Select Date of Occupancy", //year + '-' + month + '-' + date,
      dobDate: "",

      unitofperson: false,
      unitofperson1: false,
      sent: false,

      unitlist: []

      // value:""
    };
    this.arrayholder = [];
  }

  setModalVisible(item) {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      unitlist: item
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 1500);
    this.getUnitList();
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack(null); // works best when the goBack is async
      return true;
    });
    
  }

  componentWillUnmount(){
    this.backHandler.remove();
  }

  searchFilterFunction = text => {
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.unUniName.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      dataSource: newData
    });
  };

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
      minDate: new Date() //To restirct past dates
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
      associationName
      // unitList
    } = this.props.navigation.state.params;
    console.log("Unit Data", this.state.unitlist.unUnitID, associationName);
    const { getAssoMembers, oyeURL, MyAccountID } = this.props;
    if (this.state.dobText == "Select Date of Occupancy") {
      alert("Select Date of Occupancy");
    } else if (this.state.sent) {
      alert("Request already sent");
    } else if (this.checkForOwner()) {
      alert("You are an active member and can't join");
    } else if (this.checkStatus()) {
      alert("You already requested to join this unit");
    } else {
      anu = {
        ASAssnID: this.state.unitlist.asAssnID,
        BLBlockID: this.state.unitlist.blBlockID,
        UNUnitID: this.state.unitlist.unUnitID,
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
      this.setState({ sent: true, loading: true });
      axios
        .post(
          `${champBaseURL}/association/join`,
          {
            ASAssnID: this.state.unitlist.asAssnID,
            BLBlockID: this.state.unitlist.blBlockID,
            UNUnitID: this.state.unitlist.unUnitID,
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
                  ASAssnID: this.state.unitlist.asAssnID,
                  UNUnitID: this.state.unitlist.unUnitID,
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
                  let sbUnitID = this.state.unitlist.unUnitID;
                  let unitName = this.state.unitlist.unUniName;
                  let adminAccId = this.state.unitlist.acAccntID;
                  let sbSubID =
                    this.props.MyAccountID.toString() +
                    this.state.unitlist.unUnitID.toString() +
                    "usernotif";
                  let sbRoleId = "2";
                  let sbMemID = responseData_2.meMemID;
                  let sbName =
                    this.props.MyFirstName + " " + this.props.MyLastName;
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
                    "requested to join " +
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

                      axios
                        .get(
                          "http://" +
                            this.props.oyeURL +
                            `/oyeliving/api/v1/Member/GetMemberListByAssocID/${AssnId}`,
                          {
                            headers: {
                              "X-Champ-APIKey":
                                "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
                              "Content-Type": "application/json"
                            }
                          }
                        )
                        .then(res => {
                          let memberList =
                            res.data.data.memberListByAssociation;

                          memberList.map(data => {
                            if (data.mrmRoleID === 1 && data.meIsActive) {
                              console.log("adminssss", data);
                              this.props.createUserNotification(
                                ntType,
                                this.props.oyeURL,
                                data.acAccntID,
                                this.props.navigation.state.params.AssnId.toString(),
                                ntDesc,
                                sbUnitID.toString(),
                                sbMemID.toString(),
                                sbSubID.toString(),
                                sbRoleId,
                                this.props.navigation.state.params
                                  .associationName,
                                unitName.toString(),
                                occupancyDate,
                                soldDate,
                                false,
                                this.props.MyAccountID
                              );
                            }
                          });

                          getAssoMembers(oyeURL, MyAccountID);

                          this.props.updateJoinedAssociation(
                            this.props.joinedAssociations,
                            this.state.unitlist.unUnitID
                          );
                          Alert.alert(
                            "Oyespace",
                            "Request sent to Admin",
                            [
                              {
                                text: "Ok",
                                onPress: () =>
                                  this.props.navigation.navigate("ResDashBoard")
                              }
                            ],
                            {
                              cancelable: false
                            }
                          );
                        })
                        .catch(error => {
                          getAssoMembers(oyeURL, MyAccountID);
                          this.setState({
                            loading: false
                          });
                          Alert.alert(
                            "Alert",
                            "Request not sent..!",
                            [
                              {
                                text: "Ok",
                                onPress: () => {}
                              }
                            ],
                            {
                              cancelable: false
                            }
                          );
                          console.log(error, "errorAdmin");
                        });

                      // this.props.navigation.navigate("SplashScreen");
                    });
                } else {
                  this.setState({
                    loading: false,
                    sent: true
                  });
                  Alert.alert(
                    "Alert",
                    "You have already requested to join previously, your request is under review. You would be notified once review is complete",
                    [{ text: "Ok", onPress: () => {} }],
                    { cancelable: false }
                  );
                }
              })
              .catch(error => {
                this.setState({
                  loading: false,
                  sent: false
                });
                console.log("********");
                console.log(error);
                console.log("********");
                this.setState({ sent: false });
              });
          } else {
            this.setState({ loading: false, sent: false });
            Alert.alert(
              "Alert",
              "Request not sent..!",
              [{ text: "Ok", onPress: () => {} }],
              { cancelable: false }
            );
            this.setState({ sent: false });
          }
        })
        .catch(error => {
          console.log("second error", error);
          this.setState({ loading: false, sent: false });
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
      associationName
      // unitList
    } = this.props.navigation.state.params;
    console.log("Unit Data", this.state.unitlist.unUnitID);
    const { getAssoMembers, oyeURL, MyAccountID } = this.props;
    if (this.state.dobText == "Select Date of Occupancy") {
      alert("Select Date of Occupancy");
    } else if (this.state.sent) {
      alert("Request already sent");
    } else if (this.checkTenant()) {
      alert("You are an active member and can't join");
    } else if (this.checkStatus()) {
      alert("You already requested to join this unit");
    } else {
      anu = {
        ASAssnID: this.state.unitlist.asAssnID,
        BLBlockID: this.state.unitlist.blBlockID,
        UNUnitID: this.state.unitlist.unUnitID,
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
      this.setState({ sent: true });
      console.log({
        ASAssnID: this.state.unitlist.asAssnID,
        BLBlockID: this.state.unitlist.blBlockID,
        UNUnitID: this.state.unitlist.unUnitID,
        MRMRoleID: parseInt("7"),
        FirstName: this.props.MyFirstName,
        MobileNumber: this.props.MyMobileNumber,
        ISDCode: this.props.MyISDCode,
        LastName: this.props.MyLastName,
        Email: this.props.MyEmail,
        SoldDate: this.state.dobText,
        OccupancyDate: this.state.dobText
      });
      axios
        .post(
          `${champBaseURL}/association/join`,
          {
            ASAssnID: this.state.unitlist.asAssnID,
            BLBlockID: this.state.unitlist.blBlockID,
            UNUnitID: this.state.unitlist.unUnitID,
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
                  ASAssnID: this.state.unitlist.asAssnID,
                  UNUnitID: this.state.unitlist.unUnitID,
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
                  let adminAccId = this.state.unitlist.acAccntID;
                  let sbUnitID = this.state.unitlist.unUnitID;
                  let unitName = this.state.unitlist.unUniName;
                  let sbSubID =
                    this.props.MyAccountID.toString() +
                    this.state.unitlist.unUnitID.toString() +
                    "usernotif";
                  let sbRoleId = "3";
                  let sbMemID = responseData_2.meMemID;
                  let sbName =
                    this.props.MyFirstName + " " + this.props.MyLastName;
                  let associationID = this.state.unitlist.asAssnID;
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
                    "requested to join " +
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

                      axios
                        .get(
                          "http://" +
                            this.props.oyeURL +
                            `/oyeliving/api/v1/Member/GetMemberListByAssocID/${AssnId}`,
                          {
                            headers: {
                              "X-Champ-APIKey":
                                "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
                              "Content-Type": "application/json"
                            }
                          }
                        )
                        .then(res => {
                          let memberList =
                            res.data.data.memberListByAssociation;

                          memberList.map(data => {
                            if (data.mrmRoleID === 1 && data.meIsActive) {
                              console.log("adminssss", data);
                              this.props.createUserNotification(
                                ntType,
                                this.props.oyeURL,
                                data.acAccntID,
                                this.props.navigation.state.params.AssnId.toString(),
                                ntDesc,
                                sbUnitID.toString(),
                                sbMemID.toString(),
                                sbSubID.toString(),
                                sbRoleId,
                                this.props.navigation.state.params
                                  .associationName,
                                unitName.toString(),
                                occupancyDate,
                                soldDate,
                                false,
                                this.props.MyAccountID
                              );
                            }
                          });

                          getAssoMembers(oyeURL, MyAccountID);

                          this.props.updateJoinedAssociation(
                            this.props.joinedAssociations,
                            this.state.unitlist.unUnitID
                          );
                          Alert.alert(
                            "Oyespace",
                            "Request sent to Admin",
                            [
                              {
                                text: "Ok",
                                onPress: () =>
                                  this.props.navigation.navigate("ResDashBoard")
                              }
                            ],
                            {
                              cancelable: false
                            }
                          );
                        })
                        .catch(error => {
                          getAssoMembers(oyeURL, MyAccountID);
                          this.setState({
                            loading: false
                          });
                          Alert.alert(
                            "Alert",
                            "Request not sent..!",
                            [
                              {
                                text: "Ok",
                                onPress: () => {}
                              }
                            ],
                            {
                              cancelable: false
                            }
                          );
                          console.log(error, "errorAdmin");
                        });

                      // this.props.navigation.navigate("SplashScreen");
                    });
                } else {
                  this.setState({
                    loading: false,
                    sent: true
                  });
                  Alert.alert(
                    "Alert",
                    "You have already requested to join previously, your request is under review. You would be notified once review is complete",
                    [{ text: "Ok", onPress: () => {} }],
                    { cancelable: false }
                  );
                }
              })
              .catch(error => {
                this.setState({
                  loading: false,
                  sent: false
                });
                console.log("********");
                console.log(error);
                console.log("********");
              });
          } else {
            this.setState({ loading: false, sent: false });
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
          this.setState({ loading: false, sent: false });
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
    // const { unitList, AssnId } = this.props.navigation.state.params;
    const { joinedAssociations, memberList } = this.props;
    let unitID = this.state.unitlist.unUnitID;
    console.log("Unit Data", this.state.unitlist.unUnitID);
    let joinStat = _.includes(joinedAssociations, unitID);
    let status;
    // console.log(memberList, "memberList");

    let matchUnit = _.find(memberList, function(o) {
      console.log(o, "values");
      return o.unUnitID === unitID;
    });

    console.log(matchUnit, "matchUnit");

    if (matchUnit) {
      if (
        matchUnit.meJoinStat === "Approved" ||
        matchUnit.meJoinStat === "Requested" ||
        (matchUnit.meJoinStat === "Accepted" && matchUnit.meIsActive)
      ) {
        status = true;
      } else {
        status = false;
      }
    } else {
      status = false;
    }

    return status;

    // return false;
  };

  checkForOwner = () => {
    const { memberList } = this.props;
    const { unitList } = this.state.unitlist;
    console.log("Unit Data", this.state.unitlist.unUnitID);

    let unitID = this.state.unitlist.unUnitID;
    let status;

    // console.log(unitID, "unitID");
    console.log(memberList, "memberList");

    let matchUnit = _.find(memberList, function(o) {
      console.log(o, "values");
      console.log(o.unUnitID, "member", unitID, "unitID");
      return o.unUnitID === unitID;
    });

    console.log(matchUnit, "matchUnit");

    if (matchUnit) {
      if (matchUnit.mrmRoleID === 2 && matchUnit.meIsActive) {
        status = true;
      } else if (matchUnit.mrmRoleID === 3 && matchUnit.meIsActive) {
        status = true;
      } else {
        status = false;
      }
    } else {
      status = false;
    }

    return status;
  };

  checkTenant = () => {
    const { memberList } = this.props;
    const { unitList } = this.state;
    console.log("Unit Data", this.state.unitlist.unUnitID);

    let unitID = this.state.unitlist.unUnitID;
    let status;

    // console.log(unitID, "unitID");

    let matchUnit = _.find(memberList, function(o) {
      console.log(o, "values");
      console.log(o.unUnitID, "member", unitID, "unitID");
      return o.unUnitID === unitID;
    });

    console.log(matchUnit, "matchUnit");

    if (matchUnit) {
      if (matchUnit.mrmRoleID === 2 && matchUnit.meIsActive) {
        status = true;
      } else if (matchUnit.mrmRoleID === 3 && matchUnit.meIsActive) {
        status = true;
      } else {
        status = false;
      }
    } else {
      status = false;
    }

    return status;
  };

  checkCommon = () => {
    let status;
    const { unUniName } = this.state.unitlist;
    console.log("Unit Data", this.state.unitlist.unUnitID);

    if (unUniName === "Common" || unUniName === "common") {
      status = true;
    } else {
      status = false;
    }

    return status;
  };

  getUnitList = () => {
    const { id, associationName } = this.props.navigation.state.params;
    fetch(
      `https://${this.props.oyeURL}/oyeliving/api/v1/Unit/GetUnitListByAssocID/` +
        id,
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
        console.log("Manas", responseJson);

        this.setState({
          isLoading: false,
          dataSource: responseJson.data.unit,
          error: responseJson.error || null,
          loading: false
        });
        this.arrayholder = responseJson.data.unit;
      })
      .catch(error => {
        this.setState({ loading: false });
        console.log(error);
      });
  };

  renderButton = () => {
    let status;
    console.log("Unit Data", this.state.unitlist.unUnitID);
    const { unUniName } = this.state.unitlist;

    let lowerCaseName = unUniName.toLowerCase();

    if (lowerCaseName.includes("common")) {
      status = true;
    } else {
      status = false;
    }

    return status;
  };

  renderItem = ({ item, index }) => {
    console.log("item", item);
    return (
      <View style={styles.tableView}>
        <View style={styles.lineAboveAndBelowFlatList} />
        <View style={styles.cellView}>
          <View style={styles.cellDataInColumn}>
            <View style={styles.blockNameFlexStyle}>
              <Image
                style={styles.memberDetailIconImageStyle}
                source={require("../icons/buil.png")}
              />
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.blockNameTextStyle}>
                  {item.block.blBlkName ? (
                    <Text> {item.block.blBlkName + " > "}</Text>
                  ) : null}
                  {item.unUniName}
                </Text>
              </View>
            </View>
            <View style={styles.noOfUnitsFlex}>
              <View style={styles.viewForNoOfUnitsText}>
                <Text style={styles.numberOfUnitsTextStyle}>
                  <Text
                    style={{
                      color: "#cdcdcd",
                      fontSize: hp("1.8%"),
                      fontWeight: "bold"
                    }}
                  >
                    {item.unOcStat}
                  </Text>
                </Text>
              </View>
              <View style={styles.editButtonViewStyle}>
                <View style={{ marginLeft: hp("1%") }}>
                  <Button
                    bordered
                    dark
                    style={styles.addUnitButton}
                    onPress={() =>
                      this.props.navigation.navigate("RegisterUser", {
                        unitList: item,
                        AssnId: this.props.navigation.state.params.id,
                        associationName: this.props.navigation.state.params
                          .associationName
                      })
                    }
                  >
                    <Text style={styles.addUnitText}>Register Me</Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.lineAboveAndBelowFlatList} />
      </View>
    );
  };

  render() {
    if (this.state.isLoading) {
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
                  source={require("../icons/headerLogo.png")}
                />
              </View>
              <View style={{ flex: 0.2 }}>
                {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
              </View>
            </View>
            <View style={{ borderWidth: 1, borderColor: "orange" }} />
          </SafeAreaView>

          <Text style={styles.titleOfScreen}>Unit List</Text>

          <View style={styles.progress}>
            <ActivityIndicator size="large" color="#F3B431" />
          </View>
        </View>
      );
    }
    const { id, associationName } = this.props.navigation.state.params;
    console.log("$$$$$$$$@$@!$!@$@%#^#$%&%^&%$", id, associationName);
    return (
      <View style={styles.container}>
        <NavigationEvents
          onDidFocus={payload => this.getUnitList()}
          // onWillBlur={payload => this.getUnitList()}
        />
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
                source={require("../icons/headerLogo.png")}
              />
            </View>
            <View style={{ flex: 0.2 }}>
              {/* <Image source={require('../icons/notifications.png')} style={{width:36, height:36, justifyContent:'center',alignItems:'flex-end', marginTop:5 }}/> */}
            </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: "orange" }} />
        </SafeAreaView>

        <Text style={styles.titleOfScreen}>Unit List</Text>

        <TextInput
          style={styles.searchTextStyle}
          placeholder="Search by Unit Name"
          round
          onChangeText={this.searchFilterFunction}
        />

        {this.state.dataSource.length == 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white"
            }}
          >
            <Text
              style={{
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
                fontSize: hp("2%")
              }}
            >
              No units available
            </Text>
          </View>
        ) : (
          <FlatList
            style={{ marginTop: 15 }}
            data={this.state.dataSource}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.unUnitID.toString()}
          />
        )}
        {/* {this.Modal()} */}
      </View>
    );
  }
  Modal = () => {
    return (
      <Modal isVisible={this.state.isModalVisible} animationIn="bounceInUp">
        <View style={{ marginLeft: hp("5%") }}>
          <View
            style={{
              width: wp("80%"),
              height: hp("30%"),
              backgroundColor: "#fff",
              flexDirection: "column"
            }}
          >
            <View style={{ flexDirection: "row", marginTop: hp("2%") }}>
              <View style={{ flex: 1 }}></View>
              <View style={{ flex: 2 }}>
                <Text style={{ fontSize: hp("2%"), color: "#ff8c00" }}>
                  Join Association
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                  alignItems: "flex-end",
                  marginRight: hp("1%")
                }}
              >
                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}
                >
                  <Text style={{ color: "#000", marginRight: hp("1%") }}>
                    H
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
            <View style={{ marginTop: hp("5%") }}>
              <TouchableOpacity onPress={this.onDOBPress.bind(this)}>
                <View style={styles.datePickerBox}>
                  <Text style={styles.datePickerText}>
                    {this.state.dobText}{" "}
                  </Text>

                  <DatePickerDialog
                    ref="dobDialog"
                    onDatePicked={this.onDOBDatePicked.bind(this)}
                  />
                  <View style={styles.calView}>
                    <Image
                      style={styles.viewDatePickerImageStyle}
                      source={require("../icons/cal.png")}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flex: 0.1,
                  marginTop: hp("5%"),
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                {/* {this.renderButton() ? null : */}
                <Button
                  bordered
                  info
                  style={[styles.button, { backgroundColor: "#ff8c00" }]}
                  onPress={() => this.submitForOwnwer()}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: hp("1.6%"),
                      fontWeight: "500"
                    }}
                  >
                    Join As Owner
                  </Text>
                </Button>
                {/* } */}
                {/* {this.renderButton() ? null : */}
                <Button
                  bordered
                  warning
                  style={[styles.button, { backgroundColor: "#ff8c00" }]}
                  onPress={() => this.submitForTenant()}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: hp("1.6%"),
                      fontWeight: "500"
                    }}
                  >
                    Join As Tenant
                  </Text>
                </Button>
                {/* } */}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  searchTextStyle: {
    height: hp("5.5%"),
    borderWidth: hp("0.2%"),
    borderRadius: hp("3%"),
    borderColor: "#f4f4f4",
    marginHorizontal: hp("1%"),
    marginBottom: hp("2%"),
    paddingLeft: hp("3%"),
    fontSize: hp("1.8%"),
    backgroundColor: "#f4f4f4"
  },
  datePickerBox: {
    margin: hp("1.0%"),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: hp("0.2%"),
    height: hp("4%"),
    borderBottomColor: "#bfbfbf",
    // borderColor: "#bfbfbf",
    padding: 0
  },
  datePickerText: {
    fontSize: hp("1.5%"),
    marginLeft: 5,
    marginRight: 5,
    color: "#474749"
  },
  viewDatePickerImageStyle: {
    width: wp("3%"),
    height: hp("2.2%"),
    marginRight: hp("0.5%")
  },
  progress: {
    justifyContent: "center",
    alignItems: "center"
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
  image1: {
    width: wp("22%"),
    height: hp("12%"),
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
  titleOfScreen: {
    marginTop: hp("1.6%"),
    textAlign: "center",
    fontSize: hp("2%"),
    fontWeight: "bold",
    color: "#ff8c00",
    marginBottom: hp("1.6%")
  },
  button: {
    width: hp("12%"),
    height: hp("5%"),
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: "white",
    justifyContent: "center",
    marginLeft: 30,
    marginRight: 30,
    borderColor: "#fff",
    marginBottom: hp("2%")
  },
  lineAboveAndBelowFlatList: {
    backgroundColor: "lightgray",
    height: hp("0.1%")
  },

  tableView: {
    flexDirection: "column"
  },
  cellView: {
    flexDirection: "row",
    marginLeft: wp("3%"),
    marginRight: wp("1%"),
    marginVertical: hp("1%")
    // justifyContent: "flex-start"
  },
  cellDataInColumn: {
    flexDirection: "column",
    alignItems: "flex-start"

    //justifyContent: "flex-start"
  },
  blockNameFlexStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginVertical: hp("0.5%")
  },
  memberDetailIconImageStyle: {
    width: wp("5%"),
    height: wp("5%")
  },
  blockNameTextStyle: {
    fontSize: hp("2%"),
    // color: "#909091",
    marginLeft: hp("1%"),
    fontWeight: "500"
  },
  noOfUnitsFlex: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: Dimensions.get("window").width
  },
  viewForNoOfUnitsText: {
    justifyContent: "flex-start",
    alignSelf: "center"
  },
  numberOfUnitsTextStyle: {
    fontSize: hp("1.8%"),
    color: "#909091",
    marginLeft: hp("3.5%"),
    fontWeight: "500"
  },
  editButtonViewStyle: {
    marginRight: hp("3%"),
    justifyContent: "space-around",
    flexDirection: "row",
    alignSelf: "center"
  },
  addUnitButton: {
    width: wp("30%"),
    height: hp("3.6%"),
    borderRadius: hp("2%"),
    //borderWidth: hp("0.2%"),
    borderColor: "orange",
    backgroundColor: "orange",
    justifyContent: "center"
  },
  addUnitText: {
    color: "white",
    fontWeight: "700",
    fontSize: hp("1.6%")
  }
});

const mapStateToProps = state => {
  return {
    SelectedAssociationID: state.UserReducer.SelectedAssociationID,

    MyFirstName: state.UserReducer.MyFirstName,
    MyLastName: state.UserReducer.MyLastName,
    MyEmail: state.UserReducer.MyEmail,
    MyMobileNumber: state.UserReducer.MyMobileNumber,
    MyISDCode: state.UserReducer.MyISDCode,

    joinedAssociations: state.JoinAssociationReducer.joinedAssociations,
    champBaseURL: state.OyespaceReducer.champBaseURL,
    oyeURL: state.OyespaceReducer.oyeURL,
    MyAccountID: state.UserReducer.MyAccountID,
    memberList: state.DashboardReducer.memberList
  };
};

export default connect(
  mapStateToProps,
  { updateJoinedAssociation, createUserNotification, getAssoMembers }
)(UnitList);
