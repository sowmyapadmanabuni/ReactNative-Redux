import React from "react";
import {
    Dimensions,
    Image,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from "react-native";
import base from "../../../base";
import {connect} from "react-redux";
import CardView from "../../../components/cardView/CardView";
import {Dropdown} from "react-native-material-dropdown";
import ElevatedView from "react-native-elevated-view";
import OSButton from "../../../components/osButton/OSButton";
import Style from "./Style";
import axios from "axios";
import firebase from "react-native-firebase";
import {Button} from "native-base";


import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
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
    updateIdDashboard,
    updateJoinedAssociation,
    updateUserInfo,
} from "../../../actions";
import {NavigationEvents} from "react-navigation";
import ProgressLoader from "rn-progress-loader";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            myUnitCardHeight: "80%",
            myUnitCardWidth: "25%",
            adminCardHeight: "70%",
            adminCardWidth: "20%",
            offersCardHeight: "70%",
            offersCardWidth: "20%",
            isSelectedCard: "UNIT",
            isLoading: false,
            assocList: [],
            assocName: "",
            assocId: "",
            unitList: [],
            unitName: "",
            unitId: null,
            falmilyMemebCount: null,
            vechiclesCount: null,
            visitorCount: null,
            role: "",
            assdNameHide: false,
            unitNameHide: false,
            isDataLoading: false,
            isDataVisible: false
        };
    }

    componentWillMount() {
       this.setState({
            isDataLoading: true
        });
        this.getListOfAssociation();
        this.getVehicleList();
    }

    // requestNotifPermission = () => {
    //   const {
    //     MyAccountID,
    //     champBaseURL,
    //     receiveNotifications,
    //     oyeURL
    //   } = this.props;

    //   firebase
    //     .messaging()
    //     .hasPermission()
    //     .then(enabled => {
    //       if (enabled) {
    //         if (receiveNotifications) {
    //           this.listenForNotif();
    //         }
    //         // user has permissions
    //       } else {
    //         firebase
    //           .messaging()
    //           .requestPermission()
    //           .then(() => {
    //             if (receiveNotifications) {
    //               this.listenForNotif();
    //             }
    //             // User has authorised
    //           })
    //           .catch(error => {
    //             // User has rejected permissions
    //           });
    //         // user doesn't have permission
    //       }
    //     });

    //   var headers = {
    //     "Content-Type": "application/json",
    //     "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1"
    //   };

    //   axios
    //     .get(`${champBaseURL}/GetAssociationListByAccountID/${MyAccountID}`, {
    //       headers: headers
    //     })
    //     .then(response => {
    //       let responseData = response.data.data;

    //       responseData.associationByAccount.map(association => {
    //         // console.log('***********')
    //         // console.log(association.asAsnName)
    //         // console.log(association.asAssnID)
    //         // console.log('***********')
    //         if (receiveNotifications) {
    //           firebase
    //             .messaging()
    //             .subscribeToTopic(association.asAssnID + "admin");
    //           // console.log(association.asAssnID);
    //         } else if (!receiveNotifications) {
    //           firebase
    //             .messaging()
    //             .unsubscribeFromTopic(association.asAssnID + "admin");
    //         }
    //       });
    //     });

    //   axios
    //     .get(
    //       `http://${oyeURL}/oyeliving/api/v1/Member/GetMemberListByAccountID/${MyAccountID}`,
    //       {
    //         headers: headers
    //       }
    //     )
    //     .then(response => {
    //       let data = response.data.data.memberListByAccount;
    //       // console.log("dataoye", data);
    //       data.map(units => {
    //         // console.log(units.unUnitID + "admin");
    //         // console.log(units.mrmRoleID + "role");
    //         if (receiveNotifications) {
    //           if (units.mrmRoleID === 2 || units.mrmRoleID === 3) {
    //             // console.log(units.unUnitID + "admin");
    //             firebase.messaging().subscribeToTopic(units.unUnitID + "admin");
    //           }
    //         } else if (!receiveNotifications) {
    //           firebase.messaging().unsubscribeFromTopic(units.unUnitID + "admin");
    //         }
    //       });
    //     });
    // };

    // showLocalNotification = notification => {
    //   // console.log(notification);
    //   const channel = new firebase.notifications.Android.Channel(
    //     "channel_id",
    //     "Oyespace",
    //     firebase.notifications.Android.Importance.Max
    //   ).setDescription("Oyespace channel");
    //   channel.enableLights(true);
    //   // channel.enableVibration(true);
    //   // channel.vibrationPattern([500]);
    //   firebase.notifications().android.createChannel(channel);

    //   const notificationBuild = new firebase.notifications.Notification({
    //     sound: "default",
    //     show_in_foreground: true
    //   })
    //     .setTitle(notification._title)
    //     .setBody(notification._body)
    //     .setNotificationId(notification._notificationId)
    //     // .setSound('default')
    //     .setData({
    //       ...notification._data,
    //       foreground: true
    //     })
    //     .android.setColor("#FF9100")
    //     .android.setLargeIcon("ic_notif")
    //     .android.setAutoCancel(true)
    //     .android.setSmallIcon("ic_stat_ic_notification")
    //     .android.setChannelId("channel_id")
    //     .android.setVibrate("default")
    //     // .android.setChannelId('notification-action')
    //     .android.setPriority(firebase.notifications.Android.Priority.Max);

    //   firebase.notifications().displayNotification(notificationBuild);
    //   this.setState({ foregroundNotif: notification._data });
    // };

    // listenForNotif = () => {
    //   let navigationInstance = this.props.navigation;

    //   this.notificationDisplayedListener = firebase
    //     .notifications()
    //     .onNotificationDisplayed(notification => {
    //       // console.log('___________')
    //       // console.log(notification)
    //       // console.log('____________')
    //       // Process your notification as required
    //       // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    //     });

    //   this.notificationListener = firebase
    //     .notifications()
    //     .onNotification(notification => {
    //       // console.log('___________')
    //       // console.log(notification)
    //       // console.log('____________')

    //       if (notification._data.associationID) {
    //         // this.props.createNotification(notification._data, navigationInstance, false)
    //       }

    //       this.showLocalNotification(notification);
    //     });

    //   firebase.notifications().onNotificationOpened(notificationOpen => {
    //     const { MyAccountID } = this.props.userReducer;
    //     const { oyeURL } = this.props.oyespaceReducer;
    //     let details = notificationOpen.notification._data;
    //     if (notificationOpen.notification._data.admin === "true") {
    //       if (notificationOpen.action) {
    //         // this.props.newNotifInstance(notificationOpen.notification);
    //         // this.props.createNotification(
    //         //   notificationOpen.notification._data,
    //         //   navigationInstance,
    //         //   true,
    //         //   "true",
    //         //   this.props.oyeURL,
    //         //   this.props.MyAccountID
    //         // );
    //         // this.props.createNotification(notificationOpen.notification)
    //       }
    //       // this.props.newNotifInstance(notificationOpen.notification);
    //       // this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, false)
    //     } else if (notificationOpen.notification._data.admin === "false") {
    //       this.props.createUserNotification(
    //         "Join_Status",
    //         oyeURL,
    //         MyAccountID,
    //         1,
    //         details.ntDesc,
    //         "resident_user",
    //         "resident_user",
    //         details.sbSubID,
    //         "resident_user",
    //         "resident_user",
    //         "resident_user",
    //         "resident_user",
    //         "resident_user",
    //         true
    //       );
    //       // this.props.navigation.navigate("NotificationScreen");
    //     }

    //     if (notificationOpen.notification._data.admin === "true") {
    //       this.props.refreshNotifications(oyeURL, MyAccountID);
    //       if (notificationOpen.notification._data.foreground) {
    //         // this.props.newNotifInstance(notificationOpen.notification);
    //         // this.props.createNotification(
    //         //   notificationOpen.notification._data,
    //         //   navigationInstance,
    //         //   true,
    //         //   "true",
    //         //   this.props.oyeURL,
    //         //   this.props.MyAccountID
    //         // );
    //       }
    //     } else if (notificationOpen.notification._data.admin === "gate_app") {
    //       this.props.refreshNotifications(oyeURL, MyAccountID);
    //       // this.props.newNotifInstance(notificationOpen.notification);
    //       // this.props.createNotification(
    //       //   notificationOpen.notification._data,
    //       //   navigationInstance,
    //       //   true,
    //       //   "gate_app",
    //       //   this.props.oyeURL,
    //       //   this.props.MyAccountID
    //       // );
    //       // this.props.newNotifInstance(notificationOpen.notification);
    //       // this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, false)
    //     } else if (notificationOpen.notification._data.admin === "false") {
    //     }
    //     // this.props.getNotifications(oyeURL, MyAccountID);
    //     this.props.navigation.navigate("NotificationScreen");
    //   });
    // };

    // onChangeText = () => {
    //   // console.log("hhhhhhhhhhhhhh",this.state.data1)
    // };

    // didMount = () => {
    //   const { getDashSub, getDashAssociation, getAssoMembers } = this.props;
    //   const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
    //   const { oyeURL } = this.props.oyespaceReducer;
    //   // this.props.updateApproveAdmin([]);

    //   getDashSub(oyeURL, SelectedAssociationID);
    //   getDashAssociation(oyeURL, MyAccountID);
    //   getAssoMembers(oyeURL, MyAccountID);
    //   this.requestNotifPermission();
    //   // this.getBlockList();
    //   this.props.getNotifications(oyeURL, MyAccountID);
    //   console.log("Notification");
    // };

    // componentDidMount() {
    //   console.log("Notification");
    //   const { getDashSub, getDashAssociation, getAssoMembers } = this.props;
    //   const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
    //   const { oyeURL } = this.props.oyespaceReducer;
    //   // this.props.updateApproveAdmin([]);

    //   getDashSub(oyeURL, SelectedAssociationID);
    //   getDashAssociation(oyeURL, MyAccountID);
    //   getAssoMembers(oyeURL, MyAccountID);
    //   this.requestNotifPermission();
    //   // this.getBlockList();
    //   this.props.getNotifications(oyeURL, MyAccountID);
    // }
    //   onAssociationChange = (value, index) => {
    //     const {
    //       associationid,
    //       getDashUnits,
    //       updateUserInfo,
    //       memberList,
    //       notifications,
    //       dropdown
    //     } = this.props;
    //     const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
    //     const { oyeURL } = this.props.oyespaceReducer;

    //     getDashUnits(associationid[index].id, oyeURL, notifications, MyAccountID);
    //     updateUserInfo({
    //       prop: "SelectedAssociationID",
    //       value: dropdown[index].associationId
    //     });

    //     let memId = _.find(memberList, function(o) {
    //       return o.asAssnID === dropdown[index].associationId;
    //     });

    //     updateUserInfo({
    //       prop: "MyOYEMemberID",
    //       value: memId.meMemID
    //     });

    //     updateUserInfo({
    //       prop: "SelectedMemberID",
    //       value: dropdown[index].memberId
    //     });
    //   };

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
                    if (receiveNotifications) {
                        firebase
                            .messaging()
                            .subscribeToTopic(association.asAssnID + "admin");
                    } else if (!receiveNotifications) {
                        firebase
                            .messaging()
                            .unsubscribeFromTopic(association.asAssnID + "admin");
                    }
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
            })
            .catch(error => {
                console.log(error);
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
                console.log("___________");
                console.log(notification);
                console.log("____________");

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

    onChangeText = () => {
        // console.log("hhhhhhhhhhhhhh",this.state.data1)
    };

    didMount = () => {
        const {getDashSub, getDashAssociation, getAssoMembers} = this.props;
        const {MyAccountID, SelectedAssociationID} = this.props.userReducer;
        const {oyeURL} = this.props.oyespaceReducer;

        getDashSub(oyeURL, SelectedAssociationID);
        getDashAssociation(oyeURL, MyAccountID);
        getAssoMembers(oyeURL, MyAccountID);
        this.requestNotifPermission();
        // this.getBlockList();
        this.props.getNotifications(oyeURL, MyAccountID);
    };

    componentDidMount() {
        console.log("Notification");
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
    }

    //   onAssociationChange = (value, index) => {
    //     const {
    //       associationid,
    //       getDashUnits,
    //       updateUserInfo,
    //       memberList,
    //       notifications,
    //       dropdown
    //     } = this.props;
    //     const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
    //     const { oyeURL } = this.props.oyespaceReducer;

    //     getDashUnits(associationid[index].id, oyeURL, notifications, MyAccountID);
    //     updateUserInfo({
    //       prop: "SelectedAssociationID",
    //       value: dropdown[index].associationId
    //     });

    //     let memId = _.find(memberList, function(o) {
    //       return o.asAssnID === dropdown[index].associationId;
    //     });

    //     updateUserInfo({
    //       prop: "MyOYEMemberID",
    //       value: memId.meMemID
    //     });

    //     updateUserInfo({
    //       prop: "SelectedMemberID",
    //       value: dropdown[index].memberId
    //     });
    //   };


    roleCheckForAdmin = () => {
        console.log("Association id123123123123", this.state.assocId);
        fetch(
            `http://${
                this.props.oyeURL
            }/oyeliving/api/v1/Member/GetMemUniOwnerTenantListByAssoc/${
                this.state.assocId
            }`,
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
                console.log(
                    "Manas",
                    responseJson,
                    responseJson.data,
                    responseJson.data.members
                );
                console.log(
                    "MRMRoleid",
                    responseJson.data.members[0].mrmRoleID,
                    responseJson.data.members.mrmRoleID
                );

                this.setState({
                    role: responseJson.data.members[0].mrmRoleID
                });
            })
            .catch(error => {
                this.setState({error, loading: false});
            });
    };


    static getAssociationList() {
        this.getAssociationList();
    }


    async getListOfAssociation() {
        let self = this;
        let oyeURL = this.props.oyeURL;
        self.setState({isLoading: true});
        console.log("APi", base.utils.strings.oyeLivingDashBoard);
        let stat = await base.services.OyeLivingApi.getAssociationListByAccountId(
            this.props.userReducer.MyAccountID
        );
        console.log("data from stat", stat);

        try {
            if (stat && stat.data) {
                let assocList = [];
                for (let i = 0; i < stat.data.memberListByAccount.length; i++) {
                    if (stat.data.memberListByAccount[i].asAsnName !== "") {
                        assocList.push({
                            value: stat.data.memberListByAccount[i].asAsnName,
                            details: stat.data.memberListByAccount[i]
                        });
                    }
                }


                let sortedArr = assocList.sort(base.utils.validate.compareAssociationNames);
                console.log("DJBHVD:", sortedArr, assocList);

                self.setState({
                    assocList: sortedArr,
                    assocName: sortedArr[0].details.asAsnName,
                    assocId: sortedArr[0].details.asAssnID
                });
                const {updateIdDashboard} = this.props;
                console.log("updateIdDashboard1", this.props);
                updateIdDashboard({
                    prop: "assId",
                    value: sortedArr[0].details.asAssnID
                });
                updateIdDashboard({prop: "memberList", value: sortedArr});
                const {updateUserInfo} = this.props;
                updateUserInfo({prop: "SelectedAssociationID", value: sortedArr[0].details.asAssnID});

                const {getDashUnits} = this.props;
                getDashUnits(sortedArr[0].details.asAssnID, oyeURL);
            }
            self.getUnitListByAssoc();
            self.roleCheckForAdmin();
        } catch (error) {
            base.utils.logger.log(error);
        }
    }

    onAssociationChange(value, index) {
        console.log("on Aschange", value, index);
        let self = this;
        let oyeURL = this.props.oyeURL;
        let assocList = self.state.assocList;
        let assocName, assocId;
        for (let i = 0; i < assocList.length; i++) {
            if (i === index) {
                assocName = assocList[i].details.asAsnName;
                assocId = assocList[i].details.asAssnID;
            }
        }
        self.setState({
            assocName: value,
            assocId: assocId
        });
        const {updateIdDashboard} = this.props;
        console.log("updateIdDashboard2", this.props);
        updateIdDashboard({prop: "assId", value: assocId});
        const {updateUserInfo} = this.props;
        updateUserInfo({prop: "SelectedAssociationID", value: assocId});
        const {getDashUnits} = this.props;
        getDashUnits(assocId, oyeURL);
        self.getUnitListByAssoc();
        self.roleCheckForAdmin();
    }

    async getUnitListByAssoc() {
        let self = this;
        //self.setState({isLoading: true})
        console.log("APi1233", self.state.assocId);
        let stat = await base.services.OyeLivingApi.getUnitListByAssoc(
            this.state.assocId
        );
        self.setState({isLoading: false, isDataLoading: false});
        console.log("STAT123", stat);

        try {
            if (stat && stat.data) {
                let unitList = [];
                for (let i = 0; i < stat.data.members.length; i++) {
                    //if (stat.data.members[i].unUniName) {
                    let Unit = "";
                    if (
                        !stat.data.members[i].unUniName ||
                        stat.data.members[i].unUniName === ""
                    ) {
                        console.log("No Unit name", stat.data.members[i].unUniName);
                        // Unit = "Unit" + i;
                        Unit = stat.data.members[i].unUniName;
                    } else {
                        Unit = stat.data.members[i].unUniName;
                    }
                    unitList.push({value: Unit, details: stat.data.members[i]});
                    //}
                }
                console.log("JGjhgjhg", unitList, unitList[0].details.unUnitID);

                self.setState({
                    unitList: unitList,
                    unitName: unitList[0].value,
                    unitId: unitList[0].details.unUnitID,
                    isDataVisible: true
                });
                const {updateIdDashboard} = this.props;
                console.log("updateIdDashboard3", this.props);
                updateIdDashboard({
                    prop: "uniID",
                    value: unitList[0].details.unUnitID
                });

                self.roleCheckForAdmin();
            }
        } catch (error) {
            base.utils.logger.log(error);
        }
    }

    updateUnit(value, index) {
        console.log("Unit123", value, index, this.state.unitList);
        let self = this;
        let unitList = self.state.unitList;
        let unitName, unitId;
        for (let i = 0; i < unitList.length; i++) {
            if (i === index) {
                unitName = unitList[i].details.asAsnName;
                unitId = unitList[i].details.unUnitID;
            }
        }
        self.setState({
            unitName: value,
            unitId: unitId
        });
        const {updateIdDashboard} = this.props;
        console.log("updateIdDashboard5", this.props);
        updateIdDashboard({prop: "uniID", value: unitId});
    }

    getVehicleList = () => {
        fetch(
            `http://${this.props.oyeURL}/oyeliving/api/v1/Vehicle/GetVehicleListByMemID/${
                this.props.dashBoardReducer.assId
            }`,
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
                    //Object.keys(responseJson.data.unitsByBlockID).length
                    vechiclesCount: Object.keys(responseJson.data.vehicleListByMemID)
                        .length
                });
            })
            .catch(error => {
                this.setState({loading: false});
                console.log(error);
            });
    };

    getFamilyMemberList = () => {
        fetch(
            `http://apidev.oyespace.com/oyeliving/api/v1/Vehicle/GetVehicleListByMemID/${
                this.props.dashBoardReducer.assId
            }`,
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
                    //Object.keys(responseJson.data.unitsByBlockID).length
                    vechiclesCount: Object.keys(responseJson.data.vehicleListByMemID)
                        .length
                });
            })
            .catch(error => {
                this.setState({loading: false});
                console.log(error);
            });
    };

    getVisitorList = () => {
        fetch(
            `http://apidev.oyespace.com/oyeliving/api/v1/Vehicle/GetVehicleListByMemID/${
                this.props.dashBoardReducer.assId
            }`,
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
                    //Object.keys(responseJson.data.unitsByBlockID).length
                    vechiclesCount: Object.keys(responseJson.data.vehicleListByMemID)
                        .length
                });
            })
            .catch(error => {
                this.setState({loading: false});
                console.log(error);
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
            updateUserInfo,
            updateDropDownIndex
        } = this.props;


        let associationList = this.state.assocList;
        let unitList = this.state.unitList;
        return (
            <View style={{height: "100%", width: "100%"}}>
                {this.state.isDataVisible ?
                    <View style={Style.container}>
                        <NavigationEvents onDidFocus={() => this.didMount()}/>
                        <View style={Style.dropDownContainer}>
                            <View style={Style.leftDropDown}>
                                {this.state.assdNameHide === false ? (
                                    <Dropdown
                                        value={this.state.assocName}
                                        label="Association Name"
                                        baseColor="rgba(0, 0, 0, 1)"
                                        data={associationList}
                                        textColor={base.theme.colors.black}
                                        inputContainerStyle={{borderBottomColor: "transparent"}}
                                        dropdownOffset={{top: 10, left: 0}}
                                        dropdownPosition={-4}
                                        rippleOpacity={0}
                                        onChangeText={(value, index) =>
                                            this.onAssociationChange(value, index)
                                        }
                                    />
                                ) : (
                                    <View/>
                                )}
                            </View>
                            <View style={Style.rightDropDown}>
                                {this.state.unitNameHide === false ? (
                                    <Dropdown
                                        value={this.state.unitName}
                                        label="Unit"
                                        baseColor="rgba(0, 0, 0, 1)"
                                        data={unitList}
                                        inputContainerStyle={{borderBottomColor: "transparent"}}
                                        textColor="#000"
                                        dropdownOffset={{top: 10, left: 0}}
                                        dropdownPosition={-3}
                                        rippleOpacity={0}
                                        onChangeText={(value, index) => {
                                            this.updateUnit(value, index);
                                        }}
                                    />
                                ) : (
                                    <View/>
                                )}
                            </View>
                        </View>
                        {this.state.isSelectedCard === "UNIT"
                            ? this.myUnitCard()
                            : this.state.isSelectedCard === "ADMIN"
                                ? this.adminCard()
                                : this.offersZoneCard()}
                        <View style={Style.bottomCards}>
                            <CardView
                                height={this.state.myUnitCardHeight}
                                width={this.state.myUnitCardWidth}
                                cardText={"My Unit"}
                                iconWidth={Platform.OS === "ios" ? 22 : 18}
                                iconHeight={Platform.OS === "ios" ? 22 : 16}
                                cardIcon={require("../../../../icons/my_unit.png")}
                                onCardClick={() => this.changeCardStatus("UNIT")}
                                disabled={this.state.isSelectedCard === "UNIT"}
                            />
                            {this.state.role === 1 ? (
                                <CardView
                                    height={this.state.adminCardHeight}
                                    width={this.state.adminCardWidth}
                                    cardText={"Admin"}
                                    iconWidth={Platform.OS === "ios" ? 22 : 18}
                                    iconHeight={Platform.OS === "ios" ? 22 : 18}
                                    onCardClick={() => this.changeCardStatus("ADMIN")}
                                    cardIcon={require("../../../../icons/user.png")}
                                    disabled={this.state.isSelectedCard === "ADMIN"}
                                />
                            ) : (
                                <View/>
                            )}

                            {/* <CardView
                        height={this.state.offersCardHeight}
                        width={this.state.offersCardWidth}
                        cardText={'Offers Zone'}
                        iconWidth={Platform.OS==='ios'?18:18}
                        iconHeight={Platform.OS==='ios'?16:16}
                        cardIcon={require("../../../../icons/offers.png")}
                        backgroundColor={base.theme.colors.rosePink}
                        onCardClick={() => this.changeCardStatus("OFFERS")}
                        disabled={this.state.isSelectedCard=== "OFFERS"}
                    /> */}
                        </View>
                        <View style={Style.supportContainer}>
                            <View style={Style.subSupportView}>
                                <TouchableOpacity
                                    onPress={() => {
                                        {
                                            Platform.OS === "android"
                                                ? Linking.openURL(`tel:+919343121121`)
                                                : Linking.openURL(`tel:+919343121121`);
                                        }
                                    }}
                                >
                                    <Image
                                        style={[Style.supportIcon]}
                                        source={require("../../../../icons/call1.png")}
                                    />
                                </TouchableOpacity>
                                {/* <TouchableOpacity>
              <Image
                style={Style.supportIcon}
                source={require("../../../../icons/chat.png")}
              />
            </TouchableOpacity> */}
                                <TouchableOpacity
                                    onPress={() => {
                                        Linking.openURL("mailto:happy@oyespace.com");
                                    }}
                                >
                                    <Image
                                        style={Style.supportIcon}
                                        source={require("../../../../icons/Group771.png")}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View> : <View/>}
                <ProgressLoader isHUD={true} isModal={true} visible={this.state.isDataLoading}
                                color={base.theme.colors.primary}
                                hudColor={"#FFFFFF"}/>
            </View>
        );
    }

    changeCardStatus(status) {
        this.setState({
            isSelectedCard: status
        });
        if (status == "UNIT") {

            this.setState({
                myUnitCardHeight: "80%",
                myUnitCardWidth: "25%",
                adminCardHeight: "70%",
                adminCardWidth: "20%",
                offersCardHeight: "70%",
                offersCardWidth: "20%",

                assdNameHide: false,
                unitNameHide: false
            });
        } else if (status == "ADMIN") {
            this.setState({
                myUnitCardHeight: "70%",
                myUnitCardWidth: "20%",
                adminCardHeight: "80%",
                adminCardWidth: "25%",
                offersCardHeight: "70%",
                offersCardWidth: "20%",

                assdNameHide: true,
                unitNameHide: true
            });
        } else if (status == "OFFERS") {
            this.setState({
                myUnitCardHeight: "70%",
                myUnitCardWidth: "20%",
                adminCardHeight: "70%",
                adminCardWidth: "20%",
                offersCardHeight: "80%",
                offersCardWidth: "25%"
            });
        }
    }

    navigateToScreen() {
        this.props.navigation.navigate("");
    }

    myUnitCard() {
        let invoiceList = [
            {
                invoiceNumber: 528,
                bill: "12,300",
                dueDate: "11-May-2019",
                status: "NOT PAID"
            },
            {
                invoiceNumber: 527,
                bill: "12,800",
                dueDate: "8-May-2019",
                status: "PAID"
            }
        ];
        return (
            <ElevatedView elevation={6} style={Style.mainElevatedView}>
                <View style={Style.elevatedView}>
                    <CardView
                        height={"100%"}
                        width={"25%"}
                        cardText={" Family Members"}
                        cardIcon={require("../../../../icons/view_all_visitors.png")}
                        // cardCount={5}
                        marginTop={20}
                        iconWidth={Platform.OS==='ios'?35:35}
                        iconHeight={Platform.OS==='ios'?20:20}
                        onCardClick={() => this.props.navigation.navigate("MyFamilyList")}
                        backgroundColor={base.theme.colors.cardBackground}
                    />
                    <CardView
                        height={"100%"}
                        width={"25%"}
                        cardText={"Vehicles"}
                        iconWidth={Platform.OS==='ios'?30:30}
                        iconHeight={Platform.OS==='ios'?30:30}
                        cardIcon={require("../../../../icons/vehicle.png")}
                        cardCount={this.state.vechiclesCount}
                        marginTop={20}
                        backgroundColor={base.theme.colors.cardBackground}
                        onCardClick={() =>
                            this.props.navigation.navigate("MyVehicleListScreen")
                        }
                    />
                    <CardView
                        height={"100%"}
                        width={"25%"}
                        cardText={"Visitors"}
                        cardIcon={require("../../../../icons/view_all_visitors.png")}
                        // cardCount={2}
                        marginTop={20}
                        iconWidth={Platform.OS==='ios'?35:35}
                        iconHeight={Platform.OS==='ios'?20:20}
                        iconBorderRadius={0}
                        backgroundColor={base.theme.colors.cardBackground}
                        onCardClick={() => this.goToFirstTab()}
                    />
                </View>

                <View style={Style.elevatedViewSub}>
                    {/* <CardView
                        height={"100%"}
                        width={"39%"} cardText={'Documents'}
                        cardIcon={require("../../../../icons/report.png")}
                        cardCount={0}
                        backgroundColor={base.theme.colors.shadedWhite}
                    />
                    <CardView
                        height={"100%"}
                        width={"39%"} cardText={'Tickets'}
                        cardIcon={require("../../../../icons/tickets.png")}
                        cardCount={2}
                        backgroundColor={base.theme.colors.shadedWhite}
                    /> */}
                </View>
                {/* <ElevatedView elevation={0} style={Style.invoiceCardView}>
                    <View style={Style.invoiceHeadingView}>
                        <Text style={Style.invoiceText}>Invoices</Text>
                        <TouchableOpacity>
                            <Text style={Style.viewMoreText}>View more</Text>
                        </TouchableOpacity>
                    </View>
                    {invoiceList.length > 0 ?
                        <ScrollView style={Style.scrollView}>
                            <FlatList
                                data={invoiceList}
                                extraData={this.state}
                                style={Style.inVoiceFlatList}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={(item) => this.listOfInvoices(item)}
                            />
                        </ScrollView>
                        :
                        <View style={Style.noDataView}>
                            <Text style={Style.noDataMsg}>No Invoices</Text>
                        </View>
                    }
                </ElevatedView>
            */}
            </ElevatedView>
        );
    }

    adminCard() {
        return (
            <ElevatedView elevation={6} style={Style.mainElevatedView}>
                {/* <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity>
            <Text>Roll Management</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("ViewAlllVisitorsPage");
            }}
          >
            <Text>View All Visitors</Text>
          </TouchableOpacity>
        </View> */}

                {/* <View style={{ flexDirection: "row", height: hp("32%") }}>
                  <Card style={{ flex: 0.5 }}>
                    <CardItem style={{ height: hp("27%") }}>
                      <View style={{ flexDirection: "column" }}>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.text1}>Occupied</Text>
                          <Text style={styles.text2}>{sold2}</Text>
                          <Image
                            style={styles.image2}
                            source={require("../../../../icons/ww.png")}
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
                              style={[styles.gaugeText, { color: "#FF8C00" }]}
                            >
                              {sold}%
                            </Text>
                          </View>
                        </View>
                      </View>
                    </CardItem>
                  </Card>
                  <Card style={{ flex: 0.5 }}>
                    <CardItem style={{ height: hp("27%") }}>
                      <View style={{ flexDirection: "column" }}>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.text3}>Vacant</Text>
                          <Text style={styles.text4}>{unsold2}</Text>
                          <Image
                            style={styles.image3}
                            source={require("../../../../icons/hhhh.png")}
                          />
                        </View>
                        <View>
                          <VictoryPie
                            colorScale={["#45B591", "#D0D0D0"]}
                            innerRadius={hp("6.5%")}
                            radius={hp("8.5%")}
                            data={[sold, unsold]}
                            width={wp("39%")}
                            height={hp("22%")}
                            labels={() => null}
                          />
                          <View style={styles.gauge}>
                            <Text
                              style={[styles.gaugeText, { color: "#45B591" }]}
                            >
                              {unsold}%
                            </Text>
                          </View>
                        </View>
                      </View>
                    </CardItem>
                  </Card>
                </View> */}

                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center"
                    }}
                >
                    <Button
                        bordered
                        style={styles.button1}
                        onPress={() => this.props.navigation.navigate("ViewmembersScreen")}
                    >
                        <Text>Role Management</Text>
                    </Button>

                    <Button
                        bordered
                        style={styles.button1}
                        onPress={() =>
                            this.props.navigation.navigate("ViewAlllVisitorsPage")
                        }
                    >
                        <Text>View All Visitors</Text>
                    </Button>

                </View>
            </ElevatedView>
        );
    }

    offersZoneCard() {
        return (
            <ElevatedView elevation={6} style={Style.mainElevatedView}>
                <Text>OFFERS ZONE</Text>
            </ElevatedView>
        );
    }

    listOfInvoices(item) {
        base.utils.logger.log(item);
        return (
            <TouchableHighlight underlayColor={"transparent"}>
                <View style={Style.invoiceView}>
                    <View style={Style.invoiceSubView}>
                        <Text style={Style.invoiceNumberText}>
                            Invoice No. {item.item.invoiceNumber}
                        </Text>
                        <Text style={Style.billText}>
                            <Text style={Style.rupeeIcon}>{"\u20B9"}</Text>
                            {item.item.bill}
                        </Text>
                    </View>
                    <View style={Style.invoiceSubView}>
                        <Text style={Style.dueDate}>Due No. {item.item.dueDate}</Text>
                        <OSButton
                            height={"80%"}
                            width={"25%"}
                            borderRadius={15}
                            oSBBackground={
                                item.item.status === "PAID"
                                    ? base.theme.colors.grey
                                    : base.theme.colors.primary
                            }
                            oSBText={item.item.status === "PAID" ? "Paid" : "Pay Now"}
                        />
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    myUnit() {
    }

    goToFirstTab() {
        const {updateIdDashboard} = this.props;
        console.log("updateIdDashboard", this.props);
        updateIdDashboard({prop: "assId", value: this.state.assocId});
        updateIdDashboard({prop: "uniID", value: this.state.unitId});
        const {updateUserInfo} = this.props;
        updateUserInfo({prop: "SelectedAssociationID", value: this.state.assocId});


        this.props.navigation.navigate("firstTab");
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
    button1: {
        width: hp("30%"),
        justifyContent: "center",
        marginBottom: hp("2%")
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
        receiveNotifications: state.NotificationReducer.receiveNotifications,
        dashBoardReducer: state.DashboardReducer
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
        refreshNotifications,
        updateIdDashboard
    }
)(Dashboard);