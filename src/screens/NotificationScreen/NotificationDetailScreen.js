import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image
} from "react-native";
import { Button, Header, Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { CLOUD_FUNCTION_URL } from "../../../constant";
import { connect } from "react-redux";
import {
  updateApproveAdmin,
  getNotifications,
  createUserNotification
} from "../../actions";

import _ from "lodash";
// ("ntJoinStat");
class NotificationDetailScreen extends Component {
  state = {
    loading: false,
    date: "",
    reqStatus: ""
  };

  approve = (item, status) => {
    const { oyeURL } = this.props;
    if (status) {
      Alert.alert(
        "Oyespace",
        "You have already responded to this request!",
        [{ text: "Ok", onPress: () => {} }],
        { cancelable: false }
      );
    } else {
      let MemberID = global.MyOYEMemberID;
      this.setState({ loading: true });
      console.log(item);

      const headers = {
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
        "Content-Type": "application/json"
      };

      axios
        .post(
          this.props.champBaseURL + "MemberRoleChangeToAdminOwnerUpdate",
          {
            MRMRoleID: item.sbRoleID,
            MEMemID: item.sbMemID,
            UNUnitID: item.sbUnitID
          },
          {
            headers: headers
          }
        )
        .then(response => {
          let roleName = item.sbRoleID === 2 ? "Owner" : "Tenant";

          axios
            .post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
              sbSubID: item.sbSubID,
              ntTitle: "Request Approved",
              ntDesc:
                "Your request to join " +
                item.mrRolName +
                " " +
                " unit in " +
                item.asAsnName +
                " association as " +
                roleName +
                " has been approved",
              ntType: "Join_Status",
              associationID: item.asAssnID
            })
            .then(() => {
              DateUnit = {
                MemberID: item.sbMemID,
                UnitID: item.sbUnitID,
                MemberRoleID: item.sbRoleID,
                UNSldDate: item.unSldDate,
                UNOcSDate: item.unOcSDate
              };

              UpdateTenant = {
                MEMemID: item.sbMemID,
                UNUnitID: item.sbUnitID,
                MRMRoleID: item.sbRoleID
              };

              this.props.createUserNotification(
                "Join_Status",
                this.props.oyeURL,
                item.ACNotifyID,
                1,
                "Your request to join " +
                  item.mrRolName +
                  " " +
                  " unit in " +
                  item.asAsnName +
                  " association as " +
                  roleName +
                  " has been approved",
                "resident_user",
                "resident_user",
                item.sbSubID,
                "resident_user",
                "resident_user",
                "resident_user",
                "resident_user",
                "resident_user",
                false,
                this.props.MyAccountID
              );

              fetch(
                `${this.props.champBaseURL}Unit/UpdateUnitRoleStatusAndDate`,
                {
                  method: "POST",
                  headers: {
                    "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(DateUnit)
                }
              )
                .then(response => response.json())
                .then(responseJson => {
                  fetch(
                    `http://${
                      this.props.oyeURL
                    }/oyeliving/api/v1/UpdateMemberOwnerOrTenantInActive/Update`,
                    {
                      method: "POST",
                      headers: {
                        "X-Champ-APIKey":
                          "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify(UpdateTenant)
                    }
                  )
                    .then(response => response.json())
                    .then(responseJson_2 => {
                      console.log(JSON.stringify(UpdateTenant));
                      console.log(responseJson_2);

                      StatusUpdate = {
                        NTID: item.ntid,
                        NTStatDesc: "Request Sent"
                        //NTStatDesc: responseJson_2.data.string
                      };

                      fetch(
                        `http://${
                          this.props.oyeURL
                        }/oyesafe/api/v1/NotificationAcceptanceRejectStatusUpdate`,
                        {
                          method: "POST",
                          headers: {
                            "X-OYE247-APIKey":
                              "7470AD35-D51C-42AC-BC21-F45685805BBE",
                            "Content-Type": "application/json"
                          },
                          body: JSON.stringify(StatusUpdate)
                        }
                      )
                        .then(response => {
                          response.json();
                          console.log("Response", response);
                        })
                        .then(responseJson_3 => {
                          console.log(item.ntid, "ntid");
                          console.log("NTJoinStat");
                          axios
                            .post(
                              `http://${oyeURL}/oyesafe/api/v1/Notification/NotificationJoinStatusUpdate`,
                              {
                                NTID: item.ntid,
                                NTJoinStat: "Accepted"
                              },
                              {
                                headers: {
                                  "X-OYE247-APIKey":
                                    "7470AD35-D51C-42AC-BC21-F45685805BBE",
                                  "Content-Type": "application/json"
                                }
                              }
                            )
                            .then(() => {
                              console.log("updated suc");
                              this.props.getNotifications(
                                this.props.oyeURL,
                                this.props.MyAccountID
                              );
                              this.setState({
                                loading: false,
                                date: StatusUpdate.NTStatDesc
                              });

                              setTimeout(() => {
                                this.props.navigation.navigate("ResDashBoard");
                              }, 300);
                            })
                            .catch(error => {
                              console.log("Join Status", error);
                              Alert.alert("Join Status", error.message);
                              this.setState({
                                loading: false
                              });
                            });

                          // this.props.updateApproveAdmin(
                          //   this.props.approvedAdmins,
                          //   item.sbSubID
                          // );
                        })
                        .catch(error => {
                          console.log("StatusUpdate", error);
                          Alert.alert("StatusUpdate", error.message);
                          this.setState({ loading: false });
                        });
                    })
                    .catch(error => {
                      console.log("Update", error);
                      Alert.alert("Update", error.message);
                      this.setState({ loading: false });
                    });
                })
                .catch(error => {
                  console.log("DateUnit", error);
                  Alert.alert("DateUnit", error.message);
                  this.setState({ loading: false });
                });
            })
            .catch(error => {
              console.log("firebase", error);
              Alert.alert("firebase", error.message);
              this.setState({ loading: false });
            });
        })
        .catch(error => {
          console.log("MemberRoleChange", error);
          Alert.alert("MemberRoleChange", error.message);
          this.setState({ loading: false });
        });
    }
  };

  reject = (item, status) => {
    const { oyeURL } = this.props;
    if (status) {
      Alert.alert(
        "Oyespace",
        "You have already responded to this request!",
        [{ text: "Ok", onPress: () => {} }],
        { cancelable: false }
      );
    } else {
      this.setState({ loading: true });

      const headers = {
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
        "Content-Type": "application/json"
      };
      axios
        .get(
          `http://${
            this.props.oyeURL
          }/oyesafe/api/v1/NotificationActiveStatusUpdate/${item.ntid}`,
          {
            headers: {
              "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
              "Content-Type": "application/json"
            }
          }
        )
        .then(() => {
          let roleName = item.sbRoleID === 1 ? "Owner" : "Tenant";
          axios
            .get(
              `http://${
                this.props.oyeURL
              }/oyeliving/api/v1//Member/UpdateMemberStatusRejected/${
                item.sbMemID
              }`,
              {
                headers: {
                  "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
                  "Content-Type": "application/json"
                }
              }
            )
            .then(succc => {
              console.log(succc, "worked");
              axios
                .post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
                  sbSubID: item.sbSubID,
                  ntTitle: "Request Declined",
                  ntDesc:
                    "Your request to join" +
                    item.mrRolName +
                    " " +
                    " unit in " +
                    item.asAsnName +
                    " association as " +
                    roleName +
                    " has been declined",
                  ntType: "Join_Status"
                })
                .then(() => {
                  this.props.createUserNotification(
                    "Join_Status",
                    this.props.oyeURL,
                    item.acNotifyID,
                    1,
                    "Your request to join" +
                      item.mrRolName +
                      " " +
                      " unit in " +
                      item.asAsnName +
                      " association as " +
                      roleName +
                      " has been declined",
                    "resident_user",
                    "resident_user",
                    item.sbSubID,
                    "resident_user",
                    "resident_user",
                    "resident_user",
                    "resident_user",
                    "resident_user",
                    false,
                    this.props.MyAccountID
                  );

                  axios
                    .post(
                      `http://${oyeURL}/oyesafe/api/v1/Notification/NotificationJoinStatusUpdate`,
                      {
                        NTID: item.ntid,
                        NTJoinStat: "Rejected"
                      },
                      {
                        headers: {
                          "X-OYE247-APIKey":
                            "7470AD35-D51C-42AC-BC21-F45685805BBE",
                          "Content-Type": "application/json"
                        }
                      }
                    )
                    .then(() => {
                      this.props.getNotifications(
                        this.props.oyeURL,
                        this.props.MyAccountID
                      );

                      this.setState({ loading: false });
                      // this.props.updateApproveAdmin(
                      //   this.props.approvedAdmins,
                      //   item.sbSubID
                      // );
                      setTimeout(() => {
                        this.props.navigation.navigate("ResDashBoard");
                      }, 300);
                    })
                    .catch(error => {
                      console.log("Join Status", error);
                      Alert.alert("Join Status", error.message);
                      this.setState({
                        loading: false
                      });
                    });
                })
                .catch(error => {
                  Alert.alert("@@@@@@@@@@@@@@@", error.message);
                  this.setState({ loading: false });
                });
            })
            .catch(error => {
              console.log("update didn't work", error);
            });
        })
        .catch(error => {
          // Alert.alert("******************", error.message);
          console.log(error, "first api");
          this.setState({ loading: false });
        });
      // })
      // .catch(error => {
      //   // Alert.alert("#################", error.message);
      //   console.log(error, "last");
      //   this.setState({ loading: false });
      // });
    }
  };

  renderButton = () => {
    const { loading } = this.state;
    const { navigation, approvedAdmins } = this.props;
    const details = navigation.getParam("details", "NO-ID");

    let subId = details.sbSubID;
    // let status = _.includes(approvedAdmins, subId);
    // let status = false;

    let status;

    if (loading) {
      return (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <ActivityIndicator />
        </View>
      );
    } else {
      if (details.ntType === "Join_Status") {
        return null;
      } else if (details.ntType === "gate_app") {
        return null;
      } else {
        if (details.ntJoinStat) {
          if (details.ntJoinStat === "Accepted") {
            status = (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text> {this.state.date || "Request Accepted"} </Text>
              </View>
            );
          } else if (details.ntJoinStat === "Rejected") {
            status = (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text>{this.state.date || "Rejected"}</Text>
              </View>
            );
          }
        } else {
          status = (
            <View style={styles.buttonContainer}>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                <Avatar
                  onPress={() => this.reject(details)}
                  overlayContainerStyle={{
                    backgroundColor: "red"
                  }}
                  rounded
                  icon={{
                    name: "close",
                    type: "font-awesome",
                    size: 15,
                    color: "#fff"
                  }}
                />
                <Text style={{ color: "red" }}> Reject </Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                <Avatar
                  onPress={() => this.approve(details)}
                  overlayContainerStyle={{
                    backgroundColor: "orange"
                  }}
                  rounded
                  icon={{
                    name: "check",
                    type: "font-awesome",
                    size: 15,
                    color: "#fff"
                  }}
                />
                <Text style={{ color: "orange" }}> Approve </Text>
              </View>
            </View>
          );
          // if (details.ntJoinStat.length <= 0) {
          //   status = (
          //     <View
          //       style={{
          //         alignItems: "center",
          //         justifyContent: "center"
          //       }}
          //     >
          //       <Text>{this.state.date || "Rejected"}</Text>
          //     </View>
          //   );
          // } else {
          //   status = (
          //     <View style={styles.buttonContainer}>
          //       <View
          //         style={{
          //           flexDirection: "column",
          //           justifyContent: "flex-start",
          //           alignItems: "center"
          //         }}
          //       >
          //         <Avatar
          //           onPress={() => this.reject(details)}
          //           overlayContainerStyle={{
          //             backgroundColor: "red"
          //           }}
          //           rounded
          //           icon={{
          //             name: "close",
          //             type: "font-awesome",
          //             size: 15,
          //             color: "#fff"
          //           }}
          //         />
          //         <Text style={{ color: "red" }}> Reject </Text>
          //       </View>
          //       <View
          //         style={{
          //           flexDirection: "column",
          //           justifyContent: "flex-start",
          //           alignItems: "center"
          //         }}
          //       >
          //         <Avatar
          //           onPress={() => this.approve(details)}
          //           overlayContainerStyle={{
          //             backgroundColor: "orange"
          //           }}
          //           rounded
          //           icon={{
          //             name: "check",
          //             type: "font-awesome",
          //             size: 15,
          //             color: "#fff"
          //           }}
          //         />
          //         <Text style={{ color: "orange" }}> Approve </Text>
          //       </View>
          //     </View>
          //   );
          // }
        }
      }

      return status;
    }
  };

  render() {
    const { navigation } = this.props;
    const details = navigation.getParam("details", "NO-ID");
    return (
      <View style={styles.container}>
        <Header
          leftComponent={{
            icon: "arrow-left",
            color: "#ED8A19",
            type: "material-community",
            onPress: () => navigation.pop()
          }}
          containerStyle={{
            borderBottomColor: "#ED8A19",
            borderBottomWidth: 2
          }}
          centerComponent={
            <Image
              source={require("../../../pages/assets/images/OyeSpace.png")}
              style={{ height: 90, width: 90 }}
            />
          }
          backgroundColor="#fff"
        />
        <Text style={styles.titleStyle}> {details.ntDesc} </Text>
        {/* {this.renderButton()} */}
        {details.ntType === "Join_Status" ? null : this.renderButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // marginTop: 15,
  },

  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15
  },

  titleStyle: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center"
  }
});

const mapStateToProps = state => {
  return {
    approvedAdmins: state.AppReducer.approvedAdmins,
    champBaseURL: state.OyespaceReducer.champBaseURL,
    oyeURL: state.OyespaceReducer.oyeURL,
    MyAccountID: state.UserReducer.MyAccountID
  };
};

export default connect(
  mapStateToProps,
  { updateApproveAdmin, getNotifications, createUserNotification }
)(NotificationDetailScreen);
