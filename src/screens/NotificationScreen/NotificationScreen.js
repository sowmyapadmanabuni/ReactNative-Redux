import React, { Component } from "react";
import {
    View,
    Image,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Text,
    Platform,
    Linking,
    RefreshControl,
    TouchableWithoutFeedback,
    Easing,
    TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { ListItem, Header, Card } from "react-native-elements";
import {
    onNotificationOpen,
    storeOpenedNotif,
    getNotifications,
    refreshNotifications,
    toggleCollapsible
} from "../../actions";
import _ from "lodash";
import { NavigationEvents } from "react-navigation";
import Collapsible from "react-native-collapsible";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import ZoomImage from "react-native-zoom-image";

class NotificationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gateDetails: "",
            Date: "",
            Time: "",
            Date1: "",
            Time1: ""
        };
    }
    componentDidMount() {
        // console.log("didmount");
        // this.gateAppNotif()
        this.doNetwork();
    }
    keyExtractor = (item, index) => index.toString();

    onPress = (item, index) => {
        const { notifications, savedNoifId } = this.props;
        if (
            item.ntType === "Join" ||
            item.ntType === "Join_Status" ||
            item.ntType === "gate_app"
        ) {
            this.props.navigation.navigate("NotificationDetailScreen", {
                details: item
            });

            this.props.onNotificationOpen(notifications, index);
            this.props.storeOpenedNotif(savedNoifId, item.ntid);
        }
    };

    renderIcons = (type, item, index) => {
        const { savedNoifId } = this.props;

        let status = _.includes(savedNoifId, item.ntid);
        // if(index === 0) {
        //     console.log('ststus', !status || item.read)
        //     console.log('sat only', !status)
        //     console.log('read', item.read)
        // }

        if (type === "name") {
            if (status || item.read) {
                // console.log('here')
                // return 'ios-mail-unread'
                return "mail-read";
            } else {
                // console.log('here2')
                // return 'mail-read'
                return "ios-mail-unread";
            }
        } else if (type === "type") {
            if (status || item.read) {
                return "octicon";
                // return 'ionicon'
            } else {
                // return 'octicon'
                return "ionicon";
            }
        } else if (type === "style") {
            if (status || item.read) {
                return { backgroundColor: "#fff" };
            } else {
                return { backgroundColor: "#eee" };
            }
        }
    };

    renderTitle = type => {
        if (type === "Join") {
            return "Request to Join";
        } else if (type === "Join_Status") {
            return "Request to Join Status";
        } else if (type === "gate_app") {
            return "Gate App Notification";
        }
    };

    gateAppNotif = () => {
        const { details } = this.props.navigation.state.params;
        console.log("@#@$#$#@%#%#%#%@#%@#%", details.sbMemID);
        fetch(
            `http://${
                this.props.oyeURL
                }/oyesafe/api/v1/VisitorLog/GetVisitorLogListByVisLogID/` +
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
                    Date:
                        responseJson.data.visitorLog.vldCreated.substring(8, 10) +
                        "-" +
                        responseJson.data.visitorLog.vldCreated.substring(5, 7) +
                        "-" +
                        responseJson.data.visitorLog.vldCreated.substring(0, 4),
                    Time: responseJson.data.visitorLog.vlEntryT.substring(11, 16),
                    Date1:
                        responseJson.data.visitorLog.vldUpdated.substring(8, 10) +
                        "-" +
                        responseJson.data.visitorLog.vldUpdated.substring(5, 7) +
                        "-" +
                        responseJson.data.visitorLog.vldUpdated.substring(0, 4),
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

    doNetwork = (item, notifications) => {
        console.log("242#$@$@#$", item, notifications);
        for (let i in notifications) {
            if (item === notifications[i].ntid) {
                console.log("Notification", notifications[i].sbMemID);
                //10906
                fetch(
                    `http://${
                        this.props.oyeURL
                        }/oyesafe/api/v1/VisitorLog/GetVisitorLogListByVisLogID/${
                        notifications[i].sbMemID
                        }`,
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
                            Date:
                                responseJson.data.visitorLog.vldCreated.substring(8, 10) +
                                "-" +
                                responseJson.data.visitorLog.vldCreated.substring(5, 7) +
                                "-" +
                                responseJson.data.visitorLog.vldCreated.substring(0, 4),
                            Time: responseJson.data.visitorLog.vlEntryT.substring(11, 16),
                            Date1:
                                responseJson.data.visitorLog.vldUpdated.substring(8, 10) +
                                "-" +
                                responseJson.data.visitorLog.vldUpdated.substring(5, 7) +
                                "-" +
                                responseJson.data.visitorLog.vldUpdated.substring(0, 4),
                            Time1: responseJson.data.visitorLog.vlExitT.substring(11, 16)
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }
    };

    renderItem = ({ item, index }) => {
        const { savedNoifId, notifications } = this.props;
        let status = _.includes(savedNoifId, item.ntid);
        if (item.ntType !== "gate_app") {
            return (
                // <View>
                //   <ListItem
                //     onPress={() => this.onPress(item, index)}
                //     // bottomDivider
                //     title={this.renderTitle(item.ntType, item)}
                //     subtitle={item.ntDesc}
                //     leftIcon={{
                //       // name:   (!item.read || !status) ? 'ios-mail-unread' : 'mail-read',
                //       name: this.renderIcons("name", item, index),
                //       // type:  (!item.read || !status) ? 'ionicon' : 'octicon',
                //       type: this.renderIcons("type", item, index),
                //       color: "#ED8A19"
                //     }}
                //     containerStyle={this.renderIcons("style", item, index)}
                //     // containerStyle={(!item.read || !status) ?
                //     //     { backgroundColor: '#eee'} :
                //     //     { backgroundColor: '#fff' }
                //     // }
                //   />
                //   <Text style={{marginLeft:hp('6%')}}> {item.ntdUpdated}</Text>
                //   <View style={{ borderWidth: hp('0.1%'), borderColor: "#c3c3c3" }} />
                // </View>
                <Card>
                    {item.ntType !== "gate_app" ? (
                        <ListItem
                            onPress={() => this.onPress(item, index)}
                            title={this.renderTitle(item.ntType, item)}
                            subtitle={item.ntDesc}
                            leftIcon={{
                                name: this.renderIcons("name", item, index),
                                type: this.renderIcons("type", item, index),
                                color: "#ED8A19"
                            }}
                            containerStyle={this.renderIcons("style", item, index)}
                        />
                    ) : (
                        <View style={{ flex: 1 }}>
                            <View>
                                <Text>Gate App Notification</Text>
                            </View>
                            <Collapsible
                                duration={100}
                                style={{ flex: 1 }}
                                collapsed={item.open}
                            >
                                <View style={{ backgroundColor: "#ED8A19" }}>
                                    <Text> {item.ntDesc}</Text>
                                </View>
                            </Collapsible>
                        </View>
                    )}
                    <Text> {item.ntdUpdated}</Text>
                </Card>
            );
        } else {
            return (
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.props.toggleCollapsible(notifications, item.open, index);
                    }}
                >
                    <Card>
                        {item.ntType !== "gate_app" ? (
                            <ListItem
                                onPress={() => this.onPress(item, index)}
                                title={this.renderTitle(item.ntType, item)}
                                subtitle={item.ntDesc}
                                leftIcon={{
                                    name: this.renderIcons("name", item, index),
                                    type: this.renderIcons("type", item, index),
                                    color: "#ED8A19"
                                }}
                                containerStyle={this.renderIcons("style", item, index)}
                            />
                        ) : (
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: "column" }}>
                                    <Text>Gate App Notification</Text>
                                    <Text>{item.ntDesc} </Text>
                                </View>

                                <Collapsible
                                    duration={300}
                                    style={{ flex: 1 }}
                                    collapsed={item.open}
                                    align="center"
                                    onAnimationEnd={() =>
                                        this.doNetwork(item.ntid, notifications)
                                    }
                                >
                                    {item.sbMemID === 0 ? (
                                        <View>
                                            <Text>No Data</Text>
                                        </View>
                                    ) : (
                                        <View style={{ flexDirection: "column" }}>
                                            <View
                                                style={{
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <View style={{ flexDirection: "row" }}>
                                                    <Text style={{ fontSize: hp("2%") }}>
                                                        {this.state.gateDetails !== null
                                                            ? this.state.gateDetails.vlGtName
                                                            : ""}{" "}
                                                        Association
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: "row" }}>
                                                <View
                                                    style={{
                                                        alignItems: "flex-start",
                                                        justifyContent: "flex-start"
                                                    }}
                                                >
                                                    {this.state.gateDetails.vlEntryImg == "" ? (
                                                        <Image
                                                            style={styles.img}
                                                            // style={styles.img}
                                                            source={require("../../../icons/placeholderImg.png")}
                                                        />
                                                    ) : (
                                                        <Image
                                                            style={styles.img}
                                                            // style={styles.img}
                                                            source={{
                                                                uri:
                                                                    "http://mediaupload.oyespace.com" +
                                                                    this.state.gateDetails.vlEntryImg
                                                            }}
                                                        />
                                                    )}
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        justifyContent: "flex-start",
                                                        alignItems: "flex-start"
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            marginLeft: hp("1%"),
                                                            flexDirection: "column"
                                                        }}
                                                    >
                                                        <Text style={{ fontSize: hp("2%") }}>
                                                            {this.state.gateDetails !== null
                                                                ? this.state.gateDetails.vlfName
                                                                : ""}
                                                        </Text>
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
                                                    <View
                                                        style={{
                                                            width: hp("18%"),
                                                            alignItems: "flex-end"
                                                        }}
                                                    >
                                                        <View style={{}}>
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    {
                                                                        Platform.OS === "android"
                                                                            ? Linking.openURL(
                                                                            `tel:${
                                                                                this.state.gateDetails.vlMobile
                                                                                }`
                                                                            )
                                                                            : Linking.openURL(
                                                                            `tel:${
                                                                                this.state.gateDetails.vlMobile
                                                                                }`
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
                                                    </View>
                                                </View>
                                            </View>

                                            <View
                                                style={{
                                                    flexDirection: "column"
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
                                                            <Text style={{ color: "#ff8c00" }}>
                                                                Entry On:{" "}
                                                            </Text>
                                                            <View style={{ flexDirection: "row" }}>
                                                                <Text>
                                                                    {this.state.Date !== null
                                                                        ? this.state.Date
                                                                        : ""}{" "}
                                                                </Text>
                                                                <Text>
                                                                    {this.state.Time !== null
                                                                        ? this.state.Time
                                                                        : ""}
                                                                </Text>
                                                            </View>
                                                        </View>

                                                        <View
                                                            style={{
                                                                flexDirection: "row",
                                                                marginLeft: hp("3%")
                                                            }}
                                                        >
                                                            <Text style={{ color: "#ff8c00" }}>From: </Text>
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
                                                    {this.state.gateDetails.vlExitT !== null ? (
                                                        <View
                                                            style={{
                                                                flexDirection: "row",
                                                                marginLeft: hp("3%")
                                                            }}
                                                        >
                                                            <View style={{ flexDirection: "row" }}>
                                                                <Text style={{ color: "#ff8c00" }}>
                                                                    Exit On:{" "}
                                                                </Text>
                                                                <View style={{ flexDirection: "row" }}>
                                                                    <Text>
                                                                        {this.state.Date1 !== null
                                                                            ? this.state.Date1
                                                                            : ""}{" "}
                                                                    </Text>
                                                                    <Text>
                                                                        {this.state.Time1 !== null
                                                                            ? this.state.Time1
                                                                            : ""}
                                                                    </Text>
                                                                </View>
                                                            </View>

                                                            <View
                                                                style={{
                                                                    flexDirection: "row",
                                                                    marginLeft: hp("4.5%")
                                                                }}
                                                            >
                                                                <Text style={{ color: "#ff8c00" }}>From: </Text>
                                                                <Text>
                                                                    {this.state.gateDetails !== null
                                                                        ? this.state.gateDetails.vlexgName
                                                                        : ""}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    ) : (
                                                        ""
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </Collapsible>
                            </View>
                        )}
                        <Text> {item.ntdUpdated}</Text>
                    </Card>
                </TouchableWithoutFeedback>
            );
        }
    };

    onRefresh = () => {};

    renderComponent = () => {
        const {
            loading,
            isCreateLoading,
            notifications,
            refresh,
            refreshNotifications,
            oyeURL,
            MyAccountID
        } = this.props;
        // console.log(loading)
        // console.log(isCreateLoading)
        if (loading) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#fff"
                    }}
                >
                    <ActivityIndicator />
                </View>
            );
        } else {
            return (
                <FlatList
                    keyExtractor={this.keyExtractor}
                    data={notifications}
                    renderItem={this.renderItem}
                    extraData={this.props.notifications}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={() => refreshNotifications(oyeURL, MyAccountID)}
                            progressBackgroundColor="#fff"
                            tintColor="#ED8A19"
                            colors={["#ED8A19"]}
                        />
                    }
                />
            );
        }
    };

    render() {
        const { navigation, notifications, oyeURL, MyAccountID } = this.props;
        const refresh = navigation.getParam("refresh", "NO-ID");
        return (
            <View style={styles.container}>
                <NavigationEvents />
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
                {this.renderComponent()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1
    },
    img: {
        width: hp("5%"),
        height: hp("5%"),
        borderColor: "orange",
        borderRadius: hp("2.5%"),
        // marginTop: hp("3%"),
        borderWidth: hp("0.2%")
    }
});

const mapStateToProps = state => {
    return {
        notifications: state.NotificationReducer.notifications,
        isCreateLoading: state.NotificationReducer.isCreateLoading,
        loading: state.NotificationReducer.loading,
        savedNoifId: state.AppReducer.savedNoifId,
        oyeURL: state.OyespaceReducer.oyeURL,
        MyAccountID: state.UserReducer.MyAccountID,
        refresh: state.NotificationReducer.refresh
    };
};

export default connect(
    mapStateToProps,
    {
        onNotificationOpen,
        storeOpenedNotif,
        getNotifications,
        refreshNotifications,
        toggleCollapsible
    }
)(NotificationScreen);