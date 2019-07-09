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
// import {connect} from 'react-redux';

class NotificationDetailScreen extends Component {
  state = {
    loading: false,
    date: ""
  };

  approve = (item, status) => {
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
                      console.log(
                        `https://${
                          this.props.oyeURL
                        }/oyeliving/api/v1/NotificationAcceptanceRejectStatusUpdate`
                      );
                      StatusUpdate = {
                        NTID: item.ntid,
                        // NTStatDesc: "Request Sent"
                        NTStatDesc: responseJson_2.data.string
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
                        .then(response => response.json())
                        .then(responseJson_3 => {
                          this.props.getNotifications(
                            this.props.oyeURL,
                            this.props.MyAccountID
                          );
                          this.props.updateApproveAdmin(
                            this.props.approvedAdmins,
                            item.sbSubID
                          );
                          this.setState({
                            loading: false,
                            date: StatusUpdate.NTStatDesc
                          });
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
          this.props.champBaseURL + `GetMemberListByMemberID/${item.sbMemID}`,
          {
            headers: headers
          }
        )
        .then(() => {
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
                .post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
                  sbSubID: item.sbSubID,
                  ntTitle: "Request Declined",
                  ntDesc:
                    "Your request to join" +
                    item.mrRolName +
                    " unit in " +
                    item.asAsnName +
                    " association as " +
                    roleName +
                    " has been declined",
                  ntType: "Join_Status"
                })
                .then(() => {
                  this.setState({ loading: false });
                  this.props.updateApproveAdmin(
                    this.props.approvedAdmins,
                    item.sbSubID
                  );
                  setTimeout(() => {
                    this.props.navigation.navigate("ResDashBoard");
                  }, 300);
                })
                .catch(error => {
                  Alert.alert("@@@@@@@@@@@@@@@", error.message);
                  this.setState({ loading: false });
                });
            })
            .catch(error => {
              Alert.alert("******************", error.message);
              this.setState({ loading: false });
            });
        })
        .catch(error => {
          Alert.alert("#################", error.message);
          this.setState({ loading: false });
        });
    }
  };

  renderButton = () => {
    const { loading } = this.state;
    const { navigation, approvedAdmins } = this.props;
    const details = navigation.getParam("details", "NO-ID");

    let subId = details.sbSubID;
    let status = _.includes(approvedAdmins, subId);
    // console.log(status);

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
        if (status === true) {
          return <Text> {this.state.date || details.ntStatDesc}</Text>;
        } else {
          return (
            <View style={styles.buttonContainer}>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                <Avatar
                  onPress={() => this.reject(details, status)}
                  overlayContainerStyle={{ backgroundColor: "red" }}
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
                  onPress={() => this.approve(details, status)}
                  overlayContainerStyle={{ backgroundColor: "orange" }}
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
        }
      }
    }
  };

  render() {
    const { navigation } = this.props;
    const details = navigation.getParam("details", "NO-ID");
    // console.log(this.state);
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
