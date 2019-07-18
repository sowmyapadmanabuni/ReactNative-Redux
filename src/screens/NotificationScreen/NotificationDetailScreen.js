import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    Platform,
    TouchableOpacity,
    Easing
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
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import _ from "lodash";
import ZoomImage from 'react-native-zoom-image';
import { Card } from "native-base";
// import {connect} from 'react-redux';
import moment from 'moment';

class NotificationDetailScreen extends Component {
    state = {
        loading: false,
        date: "",
        gateDetails: "",
        Date: "",
        Time: "",
        Date1: "",
        Time1: ""
    };

    approve = (item, status) => {
        if (status) {
            Alert.alert(
                "Oyespace",
                "You have already responded to this request!",
                [{ text: "Ok", onPress: () => { } }],
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

            axios.post(this.props.champBaseURL + "MemberRoleChangeToAdminOwnerUpdate",
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

                    axios.post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
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

                            fetch(`${this.props.champBaseURL}Unit/UpdateUnitRoleStatusAndDate`,
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
                                    fetch(`http://${this.props.oyeURL}/oyeliving/api/v1/UpdateMemberOwnerOrTenantInActive/Update`,
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
                                            console.log(`https://${this.props.oyeURL}/oyeliving/api/v1/NotificationAcceptanceRejectStatusUpdate`
                                            );
                                            StatusUpdate = {
                                                NTID: item.ntid,
                                                // NTStatDesc: "Request Sent"
                                                NTStatDesc: responseJson_2.data.string
                                            };

                                            fetch(`http://${this.props.oyeURL}/oyesafe/api/v1/NotificationAcceptanceRejectStatusUpdate`,
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
                [{ text: "Ok", onPress: () => { } }],
                { cancelable: false }
            );
        } else {
            this.setState({ loading: true });

            const headers = {
                "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
                "Content-Type": "application/json"
            };

            axios.get(this.props.champBaseURL + `GetMemberListByMemberID/${item.sbMemID}`,
                {
                    headers: headers
                }
            )
                .then(() => {
                    axios.get(`http://${this.props.oyeURL}/oyesafe/api/v1/NotificationActiveStatusUpdate/${item.ntid}`,
                        {
                            headers: {
                                "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                                "Content-Type": "application/json"
                            }
                        }
                    )
                        .then(() => {
                            let roleName = item.sbRoleID === 1 ? "Owner" : "Tenant";
                            axios.post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
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
                                        // this.props.navigation.navigate("ResDashBoard");
                                    }, 3000);
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

    componentDidMount() {
        this.gateAppNotif();
    }

    gateAppNotif = () => {
        const { details } = this.props.navigation.state.params;
        console.log("@#@$#$#@%#%#%#%@#%@#%", details.sbMemID);
        fetch(`http://${this.props.oyeURL}/oyesafe/api/v1/VisitorLog/GetVisitorLogListByVisLogID/` +
            details.sbMemID,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
                }
            }
        )
            .then(response => response.json())
            .then(responseJson => {
                console.log("Manas", responseJson);
                this.setState({
                    gateDetails: responseJson.data.visitorLog,
                    Date: responseJson.data.visitorLog.vldCreated.substring(8,10)+"-"+responseJson.data.visitorLog.vldCreated.substring(5,7)+"-"+responseJson.data.visitorLog.vldCreated.substring(0,4),
                    Time: responseJson.data.visitorLog.vlEntryT.substring(11, 16),
                    Date1: responseJson.data.visitorLog.vldUpdated.substring(8,10)+"-"+responseJson.data.visitorLog.vldUpdated.substring(5,7)+"-"+responseJson.data.visitorLog.vldUpdated.substring(0,4),
                    Time1: responseJson.data.visitorLog.vlExitT.substring(11, 16)
                });
                console.log(
                    "@#!@$@#%#%#$^$^$%^$%^Gate Details",
                    this.state.gateDetails,
                    this.state.Date,
                    this.state.Time
                );
            })
            .catch(error => {
                console.log(error);
            });
    };

    renderButton = () => {
        const { loading } = this.state;
        const { navigation, approvedAdmins } = this.props;
        const details = navigation.getParam("details", "NO-ID");

        let subId = details.sbSubID;
        let status = _.includes(approvedAdmins, subId);
        // let status = false;
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
                return (
                    <Card style={{ height: hp("60%"), margin: hp("30%") }}>
                        <View style={{ flexDirection: "column" }}>
                            <View style={{ flexDirection: "column", }}>
                                <View
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "18%",
                                    }}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        {/* <Text style={{ fontSize: hp('2%') }}>{this.state.gateDetails !== null
                      ? this.state.gateDetails.vlGtName
                      : ""}</Text> */}
                                        <Text style={{ fontSize: hp('2%') }}>{this.state.gateDetails !== null
                                            ? this.state.gateDetails.vlGtName
                                            : ""} Association</Text>
                                    </View>

                                </View>
                                <View
                                    style={{ borderWidth: hp("0.1%"), borderColor: "#c3c3c3" }}
                                />

                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    {this.state.gateDetails.vlEntryImg == "" ? (
                                        <ZoomImage
                                            imgStyle={styles.img}
                                            // style={styles.img}
                                            source={require('../../../icons/placeholderImg.png')}
                                            duration={300}
                                            enableScaling={false}
                                            easingFunc={Easing.bounce} />
                                    ) : (
                                        <ZoomImage
                                            imgStyle={styles.img}
                                            // style={styles.img}
                                            source={{
                                                uri: this.props.imageUrl + this.state.gateDetails.vlEntryImg
                                            }}
                                            duration={300}
                                            enableScaling={false}
                                            easingFunc={Easing.bounce}
                                        />

                                    )}
                                </View>

                            </View>

                            <View
                                style={{
                                    flexDirection: "column",
                                    margin: hp("1%"),
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <View>
                                    <Text style={{ fontSize: hp('2%') }}>
                                        {this.state.gateDetails !== null
                                            ? this.state.gateDetails.vlfName
                                            : ""}
                                    </Text>
                                </View>
                                <View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            margin: hp("1%"),
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={{ color: "#000" }}>
                                                {this.state.gateDetails !== null
                                                    ? this.state.gateDetails.vlVisType
                                                    : ""}{" "}
                                            </Text>
                                            <Text style={{ color: "#38bcdb" }}>
                                                {this.state.gateDetails !== null
                                                    ? this.state.gateDetails.vlComName
                                                    : ""}{" "}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        {
                                            Platform.OS === "android"
                                                ? Linking.openURL(
                                                `tel:${this.state.gateDetails.vlMobile}`
                                                )
                                                : Linking.openURL(
                                                `tel:${this.state.gateDetails.vlMobile}`
                                                );
                                        }
                                    }}
                                >
                                    <View style={{ flexDirection: "row" }}>
                                        <View>
                                            <Text style={{ color: "#ff8c00" }}>
                                                {this.state.gateDetails !== null
                                                    ? this.state.gateDetails.vlMobile
                                                    : ""}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                width: hp("2%"),
                                                height: hp("2%"),
                                                marginLeft: hp("0.5%")
                                            }}
                                        >
                                            <Image
                                                style={{
                                                    width: hp("2%"),
                                                    height: hp("2%")
                                                }}
                                                source={require("../../../icons/call.png")}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    flexDirection: "column",

                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            margin: hp("3%"),
                                            alignItems: "stretch"
                                        }}
                                    >
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={{ color: "#ff8c00" }}>Entry On: </Text>
                                            <View style={{ flexDirection: "row" }}>
                                                <Text>
                                                    {this.state.Date !== null ? this.state.Date : ""}{" "}
                                                </Text>
                                                <Text>
                                                    {this.state.Time !== null ? this.state.Time : ""}
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={{ flexDirection: "row", marginLeft: hp("3%") }}
                                        >
                                            <Text style={{color:'#ff8c00'}}>From: </Text>
                                            <Text>
                                                {this.state.gateDetails !== null
                                                    ? this.state.gateDetails.vlengName
                                                    : ""}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    {this.state.gateDetails.vlExitT !== null ?
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                marginLeft: hp("3%"),
                                            }}
                                        >
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={{ color: "#ff8c00" }}>Exit On: </Text>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Text>
                                                        {this.state.Date1 !== null ? this.state.Date1 : ""}{" "}
                                                    </Text>
                                                    <Text>
                                                        {this.state.Time1 !== null ? this.state.Time1 : ""}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View
                                                style={{ flexDirection: "row", marginLeft: hp("4.5%") }}
                                            >
                                                <Text style={{color:'#ff8c00'}}>From: </Text>
                                                <Text>
                                                    {this.state.gateDetails !== null
                                                        ? this.state.gateDetails.vlexgName
                                                        : ""}
                                                </Text>
                                            </View>
                                        </View>

                                        : ""
                                    }



                                </View>

                                {/* <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <View style={{flexDirection:'row'}}>
                    <Text style={{color:'#ff8c00'}}>Entry Approved by: </Text>
                    <Text>Pawan Verma</Text>
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <Image/>
                  </View>
                </View> */}
                                {/* <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <View style={{flexDirection:'row'}}>
                    <Text style={{color:'#ff8c00'}}>Exit Approved by: </Text>
                    <Text>Sunil Raman</Text>
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <Image/>
                  </View>
                </View> */}

                            </View>

                        </View>
                    </Card>

                );
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

                {details.ntType === "gate_app" ? (
                    <Text style={styles.gateTitle}> Gate App Notification </Text>
                ) : (
                    <Text style={styles.titleStyle}> {details.ntDesc} </Text>
                )}
                {/* <Text style={styles.titleStyle}> {details.ntDesc} </Text> */}
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
    },
    gateTitle: {
        fontSize: hp("2.3%"),
        marginTop: hp("2%"),
        marginBottom: hp("2%"),
        textAlign: "center",
        color: "#ff8c00"
    },
    img: {
        width: hp("14%"),
        height: hp("14%"),
        borderColor: "orange",
        borderRadius: hp("7%"),
        marginTop: hp("3%"),
        borderWidth: hp("0.2%")
    }
});

const mapStateToProps = state => {
    return {
        approvedAdmins: state.AppReducer.approvedAdmins,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oyeURL: state.OyespaceReducer.oyeURL,
        MyAccountID: state.UserReducer.MyAccountID,
        imageUrl: state.OyespaceReducer.imageUrl
    };
};

export default connect(
    mapStateToProps,
    { updateApproveAdmin, getNotifications, createUserNotification }
)(NotificationDetailScreen);