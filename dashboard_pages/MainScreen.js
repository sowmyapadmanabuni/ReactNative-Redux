import {ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Card, CardItem} from "native-base";
import {Dropdown} from "react-native-material-dropdown";
import {VictoryPie} from "victory-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import React from "react";
import {connect} from "react-redux";
// import all basic components
import {NavigationEvents} from "react-navigation";
import firebase from "react-native-firebase";
import axios from "axios";
import _ from "lodash";
import {
    createNotification,
    createUserNotification,
    getAssoMembers,
    getDashAssociation,
    getDashSub,
    getDashUnits,
    getNotifications,
    newNotifInstance,
    refreshNotifications,
    updateApproveAdmin,
    updateDropDownIndex,
    updateJoinedAssociation,
    updateUserInfo
} from "../src/actions";

class Dashboard extends React.Component {
    static navigationOptions = {
        title: "Dashboard",
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            datasource: null,
            datasource1: [],
            dropdown: [],
            dropdown1: [],
            datasource2: null,
            data1: [],
            value: null,
            associationid: null,
            ownername: "",
            tenantname: "",
            unitname: "",
            unitid: "",
            uoMobile: ""
        };
    }

    renderSubscription = () => {
        const {datasource, SelectedAssociationID} = this.props;

        console.log(datasource);

        if (!SelectedAssociationID) {
            return (
                <Text style={{alignSelf: "center", fontSize: hp("2%")}}>
                    No Subscriptions Available
                </Text>
            );
        } else if (!datasource) {
            return (
                <Text style={{alignSelf: "center", fontSize: hp("2%")}}>
                    No Subscriptions Available
                </Text>
            );
        } else {
            return (
                <Text style={{alignSelf: "center", fontSize: hp("2%")}}>
                    Subscription valid until:
                    {datasource ? datasource.data.subscription.sueDate : null}
                </Text>
            );
        }
    };

    requestNotifPermission = () => {
        const {
            MyAccountID,
            champBaseURL,
            receiveNotifications,
            oyeURL
        } = this.props;

        firebase
            .messaging()
            .hasPermission()
            .then(enabled => {
                if (enabled) {
                    if (receiveNotifications) {
                        this.listenForNotif();
                    }
                    // user has permissions
                } else {
                    firebase
                        .messaging()
                        .requestPermission()
                        .then(() => {
                            if (receiveNotifications) {
                                this.listenForNotif();
                            }
                            // User has authorised
                        })
                        .catch(error => {
                            // User has rejected permissions
                        });
                    // user doesn't have permission
                }
            });

        var headers = {
            "Content-Type": "application/json",
            "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
        };

        axios
            .get(`${champBaseURL}/GetAssociationListByAccountID/${MyAccountID}`, {
                headers: headers
            })
            .then(response => {
                let responseData = response.data.data;

                responseData.associationByAccount.map(association => {
                    // console.log('***********')
                    // console.log(association.asAsnName)
                    // console.log(association.asAssnID)
                    // console.log('***********')
                    // if (receiveNotifications) {
                    //   firebase
                    //     .messaging()
                    //     .subscribeToTopic(association.asAssnID + "admin");
                    //   // console.log(association.asAssnID);
                    // } else if (!receiveNotifications) {
                    //   firebase
                    //     .messaging()
                    //     .unsubscribeFromTopic(association.asAssnID + "admin");
                    // }
                });
            });

        axios
            .get(
                `http://${oyeURL}/oyeliving/api/v1/Member/GetMemberListByAccountID/${MyAccountID}`,
                {
                    headers: headers
                }
            )
            .then(response => {
                let data = response.data.data.memberListByAccount;
                // console.log("dataoye", data);
                data.map(units => {
                    // console.log(units.unUnitID + "admin");
                    // console.log(units.mrmRoleID + "role");
                    if (receiveNotifications) {
                        if (units.mrmRoleID === 2 || units.mrmRoleID === 3) {
                            if (units.meIsActive) {
                                firebase.messaging().subscribeToTopic(units.unUnitID + "admin");
                            }
                        }
                    } else if (!receiveNotifications) {
                        firebase.messaging().unsubscribeFromTopic(units.unUnitID + "admin");
                    }
                });
            });
    };

    showLocalNotification = notification => {
        // console.log(notification);
        const channel = new firebase.notifications.Android.Channel(
            "channel_id",
            "Oyespace",
            firebase.notifications.Android.Importance.Max
        ).setDescription("Oyespace channel");
        channel.enableLights(true);
        // channel.enableVibration(true);
        // channel.vibrationPattern([500]);
        firebase.notifications().android.createChannel(channel);

        const notificationBuild = new firebase.notifications.Notification({
            sound: "default",
            show_in_foreground: true
        })
            .setTitle(notification._title)
            .setBody(notification._body)
            .setNotificationId(notification._notificationId)
            // .setSound('default')
            .setData({
                ...notification._data,
                foreground: true
            })
            .android.setColor("#FF9100")
            .android.setLargeIcon("ic_notif")
            .android.setAutoCancel(true)
            .android.setSmallIcon("ic_stat_ic_notification")
            .android.setChannelId("channel_id")
            .android.setVibrate("default")
            // .android.setChannelId('notification-action')
            .android.setPriority(firebase.notifications.Android.Priority.Max);

        firebase.notifications().displayNotification(notificationBuild);
        this.setState({foregroundNotif: notification._data});
    };

    listenForNotif = () => {
        let navigationInstance = this.props.navigation;

        this.notificationDisplayedListener = firebase
            .notifications()
            .onNotificationDisplayed(notification => {
                // console.log('___________')
                // console.log(notification)
                // console.log('____________')
                // Process your notification as required
                // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
            });

        this.notificationListener = firebase
            .notifications()
            .onNotification(notification => {
                // console.log('___________')
                // console.log(notification)
                // console.log('____________')

                if (notification._data.associationID) {
                    // this.props.createNotification(notification._data, navigationInstance, false)
                }

                this.showLocalNotification(notification);
            });

        firebase.notifications().onNotificationOpened(notificationOpen => {
            const {MyAccountID} = this.props.userReducer;
            const {oyeURL} = this.props.oyespaceReducer;
            let details = notificationOpen.notification._data;
            if (notificationOpen.notification._data.admin === "true") {
                if (notificationOpen.action) {
                    // this.props.newNotifInstance(notificationOpen.notification);
                    // this.props.createNotification(
                    //   notificationOpen.notification._data,
                    //   navigationInstance,
                    //   true,
                    //   "true",
                    //   this.props.oyeURL,
                    //   this.props.MyAccountID
                    // );
                    // this.props.createNotification(notificationOpen.notification)
                }
                // this.props.newNotifInstance(notificationOpen.notification);
                // this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, false)
            } else if (notificationOpen.notification._data.admin === "false") {
                this.props.createUserNotification(
                    "Join_Status",
                    oyeURL,
                    MyAccountID,
                    1,
                    details.ntDesc,
                    "resident_user",
                    "resident_user",
                    details.sbSubID,
                    "resident_user",
                    "resident_user",
                    "resident_user",
                    "resident_user",
                    "resident_user",
                    true
                );
                // this.props.navigation.navigate("NotificationScreen");
            }

            if (notificationOpen.notification._data.admin === "true") {
                this.props.refreshNotifications(oyeURL, MyAccountID);
                if (notificationOpen.notification._data.foreground) {
                    // this.props.newNotifInstance(notificationOpen.notification);
                    // this.props.createNotification(
                    //   notificationOpen.notification._data,
                    //   navigationInstance,
                    //   true,
                    //   "true",
                    //   this.props.oyeURL,
                    //   this.props.MyAccountID
                    // );
                }
            } else if (notificationOpen.notification._data.admin === "gate_app") {
                this.props.refreshNotifications(oyeURL, MyAccountID);
                // this.props.newNotifInstance(notificationOpen.notification);
                // this.props.createNotification(
                //   notificationOpen.notification._data,
                //   navigationInstance,
                //   true,
                //   "gate_app",
                //   this.props.oyeURL,
                //   this.props.MyAccountID
                // );
                // this.props.newNotifInstance(notificationOpen.notification);
                // this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, false)
            } else if (notificationOpen.notification._data.admin === "false") {
            }
            // this.props.getNotifications(oyeURL, MyAccountID);
            this.props.navigation.navigate("NotificationScreen");
        });
    };

    didMount = () => {
        const {getDashSub, getDashAssociation, getAssoMembers} = this.props;
        const {MyAccountID, SelectedAssociationID} = this.props.userReducer;
        const {oyeURL} = this.props.oyespaceReducer;
        // this.props.updateApproveAdmin([]);

        getDashSub(oyeURL, SelectedAssociationID);
        getDashAssociation(oyeURL, MyAccountID);
        getAssoMembers(oyeURL, MyAccountID);
        this.requestNotifPermission();
        // this.getBlockList();
        this.props.getNotifications(oyeURL, MyAccountID);
    };

    onAssociationChange = (value, index) => {
        const {
            associationid,
            getDashUnits,
            updateUserInfo,
            memberList,
            notifications,
            dropdown
        } = this.props;
        const {MyAccountID, SelectedAssociationID} = this.props.userReducer;
        const {oyeURL} = this.props.oyespaceReducer;

        getDashUnits(associationid[index].id, oyeURL, notifications, MyAccountID);

        updateUserInfo({
            prop: "SelectedAssociationID",
            value: dropdown[index].associationId
        });

        let memId = _.find(memberList, function (o) {
            return o.asAssnID === dropdown[index].associationId;
        });

        updateUserInfo({
            prop: "MyOYEMemberID",
            value: memId.meMemID
        });

        updateUserInfo({
            prop: "SelectedMemberID",
            value: dropdown[index].memberId
        });
    };

    render() {
        const {
            dropdown,
            dropdown1,
            residentList,
            sold,
            unsold,
            isLoading,
            sold2,
            unsold2,
            updateUserInfo
        } = this.props;
        return (
            <View style={{flex: 1}}>
                <NavigationEvents onDidFocus={() => this.didMount()}/>
                {/* <Header
          firstName={this.props.MyFirstName}
          navigate={this.props.navigation}
        /> */}

                <View style={styles.container}>
                    <View style={styles.textWrapper}>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "column",
                                height: hp("60%")
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    height: hp("12%"),
                                    marginTop: hp("0.2%")
                                }}
                            >
                                <Card style={{flex: 0.7}}>
                                    <CardItem style={{flexDirection: "row", height: hp("10%")}}>
                                        <Image
                                            style={styles.image1}
                                            source={require("../icons/buil.png")}
                                        />
                                        <Dropdown
                                            containerStyle={{flex: 1, width: wp("10%")}}
                                            label="Building Complex Name"
                                            value="Building Complex Name"
                                            data={dropdown}
                                            textColor="#000"
                                            fontSize={hp("2%")}
                                            dropdownPosition={-2}
                                            // labelHeight={hp("1%")}
                                            labelPadding={hp("1%")}
                                            labelSize={hp("1%")}
                                            onChangeText={(value, index) =>
                                                this.onAssociationChange(value, index)
                                            }
                                        />
                                    </CardItem>
                                </Card>
                                <Card style={{flex: 0.3}}>
                                    <CardItem style={{height: hp("10%")}}>
                                        {isLoading ? (
                                            <View style={styles.progress}>
                                                <ActivityIndicator size="large" color="#fff"/>
                                            </View>
                                        ) : (
                                            <Dropdown
                                                containerStyle={{flex: 1, width: wp("10%")}}
                                                label="Unit"
                                                value="Unit"
                                                data={dropdown1}
                                                textColor="#000"
                                                fontSize={hp("2%")}
                                                dropdownPosition={-3}
                                                onChangeText={(value, index) => {
                                                    updateUserInfo({
                                                        prop: "SelectedUnitID",
                                                        value: dropdown1[index].unitId
                                                    });
                                                    console.log(value);
                                                    console.log(index);
                                                }}
                                            />
                                        )}
                                    </CardItem>
                                </Card>
                            </View>

                            {isLoading ? (
                                <View style={styles.progress}>
                                    <ActivityIndicator size="large" color="#F3B431"/>
                                </View>
                            ) : (
                                <View style={{flexDirection: "row", height: hp("32%")}}>
                                    {/* {isLoading ? <ActivityIndicator /> : null } */}

                                    <Card style={{flex: 0.5}}>
                                        <CardItem style={{height: hp("27%")}}>
                                            <View style={{flexDirection: "column"}}>
                                                <View style={{flexDirection: "row"}}>
                                                    <Text style={styles.text1}>Occupied</Text>
                                                    <Text style={styles.text2}>{sold2}</Text>
                                                    <Image
                                                        style={styles.image2}
                                                        source={require("../icons/ww.png")}
                                                    />
                                                </View>

                                                <View>
                                                    <VictoryPie
                                                        colorScale={["#ff8c00", "#D0D0D0"]}
                                                        innerRadius={hp("6.5%")}
                                                        radius={hp("8.5%")}
                                                        data={[sold, unsold]}
                                                        width={wp("39%")}
                                                        height={hp("22%")}
                                                        labels={() => null}
                                                    />

                                                    <View style={styles.gauge}>
                                                        <Text
                                                            style={[styles.gaugeText, {color: "#FF8C00"}]}
                                                        >
                                                            {sold}%
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </CardItem>
                                    </Card>
                                    <Card style={{flex: 0.5}}>
                                        <CardItem style={{height: hp("27%")}}>
                                            <View style={{flexDirection: "column"}}>
                                                <View style={{flexDirection: "row"}}>
                                                    <Text style={styles.text3}>Vacant</Text>
                                                    <Text style={styles.text4}>{unsold2}</Text>
                                                    <Image
                                                        style={styles.image3}
                                                        source={require("../icons/hhhh.png")}
                                                    />
                                                </View>

                                                <View>
                                                    <VictoryPie
                                                        colorScale={["#45B591", "#D0D0D0"]}
                                                        innerRadius={hp("6.5%")}
                                                        radius={hp("8.5%")}
                                                        data={[unsold, sold]}
                                                        width={wp("39%")}
                                                        height={hp("22%")}
                                                        labels={() => null}
                                                    />
                                                    <View style={styles.gauge}>
                                                        <Text
                                                            style={[styles.gaugeText, {color: "#45B591"}]}
                                                        >
                                                            {unsold}%
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </CardItem>
                                    </Card>
                                </View>
                            )}
                            <View style={{height: hp("7%")}}>
                                <TouchableOpacity
                                    // onPress={() => this.props.navigation.navigate('ViewmembersScreen')}
                                    onPress={() => {
                                        this.props.navigation.navigate("ViewmembersScreen", {
                                            data: residentList
                                        });
                                    }}
                                >
                                    <Card
                                        style={{
                                            height: hp("5%"),
                                            alignItems: "center",
                                            flexDirection: "row"
                                        }}
                                    >
                                        <Image
                                            source={require("../icons/eye.png")}
                                            style={styles.image4}
                                        />
                                        <Text style={{alignSelf: "center", color: "black"}}>
                                            View Resident List
                                        </Text>
                                    </Card>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.view1}>
                            <View style={{flexDirection: "column"}}>
                                <Card style={styles.card}>
                                    {/* <CardItem Style={styles.cardItem}> */}
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate("InvitedGuestListScreen")
                                        }
                                    >
                                        <View style={{flexDirection: "column"}}>
                                            <View
                                                style={{
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginTop: hp("2%")
                                                }}
                                            >
                                                <Image
                                                    style={{
                                                        width: hp("4%"),
                                                        height: hp("3.1%"),
                                                        marginBottom: hp("0.55%")
                                                    }}
                                                    source={require("../icons/guests.png")}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <Text style={{fontSize: hp("1.5%")}}>Guests</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    {/* </CardItem> */}
                                    <View style={styles.view2}/>
                                </Card>
                            </View>

                            <View style={{flexDirection: "column"}}>
                                <Card style={styles.card}>
                                    {/* <CardItem Style={styles.cardItem}> */}
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate("GuardListScreen")
                                        }
                                    >
                                        <View style={{flexDirection: "column"}}>
                                            <View
                                                style={{
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginTop: hp("2%")
                                                }}
                                            >
                                                <Image
                                                    style={{
                                                        width: hp("4%"),
                                                        height: hp("3.1%"),
                                                        marginBottom: hp("0.55%")
                                                    }}
                                                    source={require("../icons/guards.png")}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <Text style={{fontSize: hp("1.5%")}}>Guards</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    {/* </CardItem> */}
                                    <View style={styles.view2}/>
                                </Card>
                            </View>

                            <View style={{flexDirection: "column"}}>
                                <Card style={styles.card}>
                                    {/* <CardItem Style={styles.cardItem}> */}
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate("ViewVisitorsScreen")
                                        }
                                    >
                                        <View style={{flexDirection: "column"}}>
                                            <View
                                                style={{
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginTop: hp("2%")
                                                }}
                                            >
                                                <Image
                                                    style={{
                                                        width: hp("4%"),
                                                        height: hp("3.1%"),
                                                        marginBottom: hp("0.55%")
                                                    }}
                                                    source={require("../icons/deliveries.png")}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <Text style={{fontSize: hp("1.5%")}}>Deliveries</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    {/* </CardItem> */}
                                    <View style={styles.view2}/>
                                </Card>
                            </View>
                            <View style={{flexDirection: "column"}}>
                                <Card style={styles.card}>
                                    {/* <CardItem Style={styles.cardItem}> */}
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate("AdminFunction")
                                        }
                                    >
                                        <View
                                            style={{
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginTop: hp("2%")
                                            }}
                                        >
                                            <View
                                                style={{
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <Image
                                                    style={{
                                                        width: hp("4%"),
                                                        height: hp("3.1%"),
                                                        marginBottom: hp("0.55%")
                                                    }}
                                                    source={require("../icons/admin.png")}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <Text style={{fontSize: hp("1.5%")}}>Admin</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    {/* </CardItem> */}
                                    <View style={styles.view2}/>
                                </Card>
                            </View>
                        </View>
                        <View style={{height: hp("5%")}}>
                            <Card style={styles.card1}>
                                {this.renderSubscription()}
                                {/* <Text style={{alignSelf:'center',fontSize:hp("2%")}}>Subscription valid until:{this.state.datasource ? this.state.datasource.data.subscription.sueDate : null}</Text> */}
                            </Card>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#fff",
        paddingLeft: hp("0.7%")
    },
    progress: {
        justifyContent: "center",
        alignItems: "center"
    },
    card: {
        borderBottomWidth: 1,
        flexDirection: "column",
        width: Dimensions.get("window").width / 4 - 10,
        height: hp("9%"),
        alignItems: "center"
    },
    cardItem: {
        flexDirection: "column",
        borderColor: "orange",
        borderWidth: hp("10%")
        // borderBottomWidth:30,
    },
    textWrapper: {
        height: hp("85%"), // 70% of height device screen
        width: wp("97%") // 80% of width device screen
    },
    gaugeText: {
        backgroundColor: "transparent",
        color: "#000",
        fontSize: hp("3%")
    },
    image1: {
        width: wp("6%"),
        height: hp("3%"),
        marginRight: 10,
        justifyContent: "space-between"
    },
    image2: {
        height: hp("2%"),
        width: hp("2%"),
        justifyContent: "flex-end",
        alignItems: "flex-end",
        marginBottom: hp("2.4%"),
        marginTop: hp("2.4%")
    },
    text1: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flex: 5,
        color: "#FF8C00",
        marginBottom: hp("2.4%"),
        marginTop: hp("2.4%")
    },
    text2: {
        justifyContent: "flex-end",
        alignItems: "flex-end",
        color: "#FF8C00",
        marginBottom: hp("2.4%"),
        marginTop: hp("2.4%")
    },
    text3: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flex: 1,
        color: "#45B591",
        marginBottom: hp("2.4%"),
        marginTop: hp("2.4%")
    },
    text4: {
        justifyContent: "flex-end",
        alignItems: "flex-end",
        color: "#45B591",
        marginBottom: hp("2.4%"),
        marginTop: hp("2.4%")
    },
    image3: {
        height: hp("2%"),
        width: hp("2%"),
        justifyContent: "flex-end",
        alignItems: "flex-end",
        marginBottom: hp("2.4%"),
        marginTop: hp("2.4%")
    },
    image4: {
        width: wp("5%"),
        height: hp("2%"),
        justifyContent: "flex-start",
        marginLeft: hp("1%"),
        marginRight: hp("1%")
    },
    view1: {
        flexDirection: "row",
        margin: hp("0.5%"),
        alignItems: "center",
        justifyContent: "center",
        bottom: 0,
        height: hp("12%")
    },
    view2: {
        borderWidth: hp("0.8%"),
        borderBottomEndRadius: hp("0.8%"),
        borderBottomStartRadius: hp("0.8%"),
        borderColor: "orange",
        width: Dimensions.get("window").width / 4 - 10,
        marginTop: hp("0.8%")
    },
    card1: {
        height: hp("4%"),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff6e5",
        marginBottom: hp("2%")
    },
    gauge: {
        position: "absolute",
        width: wp("40%"),
        height: hp("22%"),
        alignItems: "center",
        justifyContent: "center"
    }
});

const mapStateToProps = state => {
    return {
        isCreateLoading: state.NotificationReducer.isCreateLoading,
        notificationCount: state.NotificationReducer.notificationCount,
        notifications: state.NotificationReducer.notifications,
        joinedAssociations: state.AppReducer.joinedAssociations,
        datasource: state.DashboardReducer.datasource,
        dropdown: state.DashboardReducer.dropdown,
        dropdown1: state.DashboardReducer.dropdown1,
        associationid: state.DashboardReducer.associationid,
        residentList: state.DashboardReducer.residentList,
        sold: state.DashboardReducer.sold,
        unsold: state.DashboardReducer.unsold,
        sold2: state.DashboardReducer.sold2,
        unsold2: state.DashboardReducer.unsold2,
        isLoading: state.DashboardReducer.isLoading,
        memberList: state.DashboardReducer.memberList,

        // Oyespace variables and user variables
        MyFirstName: state.UserReducer.MyFirstName,
        MyAccountID: state.UserReducer.MyAccountID,
        SelectedAssociationID: state.UserReducer.SelectedAssociationID,
        userReducer: state.UserReducer,

        // Oyespace urls
        oyeURL: state.OyespaceReducer.oyeURL,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        oyespaceReducer: state.OyespaceReducer,
        receiveNotifications: state.NotificationReducer.receiveNotifications
    };
};

export default connect(
    mapStateToProps,
    {
        newNotifInstance,
        createNotification,
        getNotifications,
        updateJoinedAssociation,
        getDashSub,
        getDashAssociation,
        getDashUnits,
        updateUserInfo,
        getAssoMembers,
        updateApproveAdmin,
        updateDropDownIndex,
        createUserNotification,
        refreshNotifications
    }
)(Dashboard);
