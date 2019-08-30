import React, { PureComponent } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  BackHandler,
  ToastAndroid
} from "react-native";
import base from "../../../base";
import { connect } from "react-redux";
import CardView from "../../../components/cardView/CardView";
import { Dropdown } from "react-native-material-dropdown";
import ElevatedView from "react-native-elevated-view";
import OSButton from "../../../components/osButton/OSButton";
import { showMessage, hideMessage } from "react-native-flash-message";
import Style from "./Style";
import axios from "axios";
import firebase from "react-native-firebase";
import { Button } from "native-base";
import _ from "lodash";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from "react-native-responsive-screen";
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
  updateSelectedDropDown,
  updateUserInfo,
  updateuserRole,
  getDashAssoSync
} from "../../../actions";
import ProgressLoader from "rn-progress-loader";
import { NavigationEvents } from "react-navigation";
import timer from "react-native-timer";

const Profiler = React.unstable_Profiler;
var counter = 0;
class Dashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      myUnitCardHeight: "80%",
      myUnitCardWidth: "25%",
      adminCardHeight: "60%",
      adminCardWidth: "20%",
      offersCardHeight: "60%",
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
      vehiclesCount: null,
      visitorCount: null,
      role: "",
      assdNameHide: false,
      unitNameHide: false,
      isDataLoading: false,
      isDataVisible: false,
      isNoAssJoin: false
    };
    this.backButtonListener = null;
    this.currentRouteName = "Main";
    this.lastBackButtonPress = null;
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    this.setState({
      isDataLoading: true,
      isDataVisible: true
    });
    this.getListOfAssociation();
    this.myProfileNet();
    this.listenRoleChange();
  }

  listenRoleChange() {
    const { MyAccountID, dropdown } = this.props;
    let path = "rolechange/" + MyAccountID;
    let roleRef = base.services.frtdbservice.ref(path);
    //roleRef.off(path);
    let self = this;
    roleRef.on("value", function(snapshot) {
      //alert(JSON.stringify(snapshot.val()))
      self.roleCheckForAdmin(self.state.assocId);
      self.requestNotifPermission();
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // return (
    return (
      !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state)
    );
    // );
  }

  componentDidUpdate() {
    if (Platform.OS === "android") {
      this.backButtonListener = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (this.currentRouteName !== "Main") {
            return false;
          }

          if (this.lastBackButtonPress + 2000 >= new Date().getTime()) {
            BackHandler.exitApp();
            return true;
          }
          if (this.state.isSelectedCard === "UNIT") {
            BackHandler.exitApp();
          } else {
            this.changeCardStatus("UNIT");
          }

          this.lastBackButtonPress = new Date().getTime();

          return true;
        }
      );
    }
  }

  handleBackButtonClick() {
    console.log("DNDJVL");
    // this.props.navigation.goBack(null);
    // return true;
  }

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
      .get(
        `http://${oyeURL}/oyeliving/api/v1/Member/GetMemberListByAccountID/${MyAccountID}`,
        {
          headers: headers
        }
      )
      .then(response => {
        console.log(response, "fetched");
        let data = response.data.data.memberListByAccount;
         console.log("dataoye", data);
        firebase.messaging().subscribeToTopic(MyAccountID + "admin");
        data.map(units => {
          console.log("role_units", units.mrmRoleID);
          if (receiveNotifications) {
            //alert(MyAccountID + "admin");
            firebase
              .messaging()
              .subscribeToTopic(
                "" + MyAccountID + units.unUnitID + "usernotif"
              );
            //alert(""+MyAccountID+units.unUnitID+"usernotif")
            firebase.messaging().subscribeToTopic(MyAccountID + "admin");
            if (units.mrmRoleID === 2 || units.mrmRoleID === 3) {
            } else if (units.mrmRoleID === 1) {
              console.log(units, "units");
              if (units.meIsActive) {
                //firebase.messaging().unsubscribeFromTopic(units.asAssnID+ "admin");
                firebase.messaging().subscribeToTopic(units.asAssnID + "admin");
              } else {
                firebase
                  .messaging()
                  .unsubscribeFromTopic(units.asAssnID + "admin");
              }
            }
          } else if (!receiveNotifications) {
            // firebase.messaging().unsubscribeFromTopic(units.unUnitID + "admin");
            firebase.messaging().unsubscribeFromTopic(MyAccountID + "admin");
            firebase.messaging().unsubscribeFromTopic(units.asAssnID + "admin");
          }
        });

        // if(data != undefined && data!=null && data.length > 0){
        //     let val = data.find(o => o.mrmRoleID === 1);
        //     if(val == undefined || val == null){
        //       //firebase.messaging().unsubscribeFromTopic(MyAccountID + "admin");
        //       firebase.messaging().unsubscribeFromTopic(units.asAssnID + "admin");
        //       firebase.messaging().unsubscribeFromTopic(val.asAssnID + "admin");
        //     }
        // }
      });
  };

  showLocalNotification = notification => {
    try {
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
        .android.setAutoCancel(true)
        .android.setColor("#FF9100")
        .android.setLargeIcon("ic_notif")
        .android.setSmallIcon("ic_stat_ic_notification")
        .android.setChannelId("channel_id")
        .android.setVibrate("default")
        .setSound("default")

        // .android.setChannelId('notification-action')
        .android.setPriority(firebase.notifications.Android.Priority.Max);

      firebase.notifications().displayNotification(notificationBuild);
      this.setState({ foregroundNotif: notification._data });
    } catch (e) {
      console.log("FAILED_NOTIF");
    }
  };

  listenForNotif = () => {
    if (
      this.notificationDisplayedListener == undefined ||
      this.notificationDisplayedListener == null
    ) {
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

          showMessage({
            message: notification.title,
            description: notification.body,
            type: "default",
            backgroundColor: "#FF9100",
            onPress: () => {
              this.props.navigation.navigate("NotificationScreen");
            }
          });
        });

      firebase.notifications().onNotificationOpened(notificationOpen => {
        const { MyAccountID } = this.props.userReducer;
        const { oyeURL } = this.props.oyespaceReducer;
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
          this.props.refreshNotifications(oyeURL, MyAccountID);
          // this.props.createUserNotification(
          //     "Join_Status",
          //     oyeURL,
          //     MyAccountID,
          //     1,
          //     details.ntDesc,
          //     "resident_user",
          //     "resident_user",
          //     details.sbSubID,
          //     "resident_user",
          //     "resident_user",
          //     "resident_user",
          //     "resident_user",
          //     "resident_user",
          //     true
          // );
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
    }
  };

  onChangeText = () => {};

  didMount = () => {
    const { getDashSub, getDashAssociation, getAssoMembers } = this.props;
    const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
    const { oyeURL } = this.props.oyespaceReducer;

    getDashSub(oyeURL, SelectedAssociationID);
    getDashAssociation(oyeURL, MyAccountID);
    getAssoMembers(oyeURL, MyAccountID);
    this.requestNotifPermission();
    // this.getBlockList();
    this.props.getNotifications(oyeURL, MyAccountID);
  };

  syncData = () => {
    const {
      getDashAssociation,
      getAssoMembers,
      getDashSub,
      getDashAssoSync
    } = this.props;

    const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
    const { oyeURL } = this.props.oyespaceReducer;

    this.requestNotifPermission();
    // this.props.getNotifications(oyeURL, MyAccountID);

    // getDashSub(oyeURL, SelectedAssociationID);
    getDashAssoSync(oyeURL, MyAccountID);
    // getAssoMembers(oyeURL, MyAccountID);
    this.requestNotifPermission();
  };

  componentDidMount() {
    const {
      getDashSub,
      getDashAssociation,
      getAssoMembers,
      receiveNotifications
    } = this.props;
    const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
    const { oyeURL } = this.props.oyespaceReducer;
    this.roleCheckForAdmin = this.roleCheckForAdmin.bind(this);
    // getAssoMembers(oyeURL, MyAccountID);
    this.requestNotifPermission();
    // this.getBlockList();
    this.props.getNotifications(oyeURL, MyAccountID);

    if (!this.props.called) {
      this.didMount();
    }

    timer.setInterval(
      this,
      "syncData",
      () => {
        this.syncData();
        // alert("hererereerrrereer");
      },
      5000
    );
  }

  async roleCheckForAdmin(index) {
    try {
      let responseJson = await base.services.OyeLivingApi.getUnitListByAssoc(
        this.state.assocId
      );
      let role = "";
      console.log("roleCheckForAdmin_", responseJson);
      //responseJson.data.members.splice(0,1);
      console.log("Manas", responseJson, responseJson.data);
      for (let i = 0; i < responseJson.data.members.length; i++) {
        //alert(responseJson.data.members[i].mrmRoleID)
        console.log(
          "Get_Ids",
          this.props.userReducer.MyAccountID,
          responseJson.data.members[i].acAccntID,
          this.state.assocId,
          responseJson.data.members[i].asAssnID,
          responseJson.data.members[i].mrmRoleID,
          responseJson.data.members[i].unUniName + "name"
        );
        if (
          responseJson.data.members[i].meIsActive &&
          this.props.userReducer.MyAccountID ===
            responseJson.data.members[i].acAccntID &&
          parseInt(this.state.assocId) === responseJson.data.members[i].asAssnID
        ) {
          console.log(
            "Id_eq",
            this.props.userReducer.MyAccountID,
            responseJson.data.members[i].acAccntID,
            responseJson.data.members[i].mrmRoleID
          );
          role = responseJson.data.members[i].mrmRoleID;
        }
      }
      console.log(role, "role");
      this.setState(
        {
          role: role
        },
        () => {
          const { updateuserRole } = this.props;
          console.log("Role123456:", updateuserRole);
          updateuserRole({
            prop: "role",
            value: role
          });
          console.log("ROLE_UPDATE", role);
        }
      );
       this.checkUnitIsThere();
      // })
      // .catch(error => {
      //   this.setState({ error, loading: false });
      // });
    } catch (err) {
      //alert(err)
      console.log("ROLECHECK_ERROR", err);
    }
  }

  static getAssociationList() {
    this.getAssociationList();
  }

  async getListOfAssociation() {
    let self = this;
    let oyeURL = this.props.oyeURL;
    self.setState({ isLoading: true });

    // let stat = await base.services.OyeLivingApi.getAssociationListByAccountId(
    //   this.props.userReducer.MyAccountID
    // );

    let stat = await axios.get(
      `${this.props.champBaseURL}/Member/GetMemberListByAccountID/${this.props.userReducer.MyAccountID}`,
      {
        headers: {
          "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Response_Association: ", stat);

    try {
      if (stat && stat.data.success) {
        this.setState({
          isNoAssJoin: false
        });
        let assocList = [];
        for (let i = 0; i < stat.data.data.memberListByAccount.length; i++) {
          if (stat.data.data.memberListByAccount[i].asAsnName !== "") {
            assocList.push({
              value: stat.data.data.memberListByAccount[i].asAsnName,
              details: stat.data.data.memberListByAccount[i]
            });
          }
        }
        let sortedArr = assocList.sort(
          base.utils.validate.compareAssociationNames
        ); //open chrome
        console.log("Sorted and All Asc List", sortedArr, assocList);

        let removedDuplicates = _.uniqBy(sortedArr, "value");
        console.log("Removed duplicates", sortedArr, assocList);

        self.setState({
          assocList: removedDuplicates,
          assocName: sortedArr[0].details.asAsnName,
          assocId: sortedArr[0].details.asAssnID
        });
        const { updateIdDashboard } = this.props;
        console.log("updateIdDashboard1", this.props);
        updateIdDashboard({
          prop: "assId",
          value: sortedArr[0].details.asAssnID
        });
        // updateIdDashboard({ prop: "memberList", value: sortedArr });
        const { updateUserInfo } = this.props;
        updateUserInfo({
          prop: "SelectedAssociationID",
          value: sortedArr[0].details.asAssnID
        });

        self.getUnitListByAssoc();
      } else if (!stat.data.success) {
        this.setState({
          isNoAssJoin: true
        });
        Alert.alert(
          "Join association",

          "Please join in any association to access Data  ?",
          [
            {
              text: "Yes",
              onPress: () =>
                this.props.navigation.navigate("CreateOrJoinScreen")
            },
            { text: "No", style: "cancel" }
          ]
        );
      }
    } catch (error) {
      base.utils.logger.log(error);
    }
  }

  onAssociationChange = (value, index) => {
    const {
      associationid,
      getDashUnits,
      updateUserInfo,
      memberList,
      notifications,
      dropdown,
      updateSelectedDropDown,
      dropdown1
    } = this.props;
    console.log("Ass index", value, index, dropdown[index]);
    const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
    const { oyeURL } = this.props.oyespaceReducer;
    this.setState({ assocId: dropdown[index].associationId });

    // console.log(value, "Valuessss");
    getDashUnits(
      dropdown[index].associationId,
      oyeURL,
      MyAccountID,
      dropdown,
      dropdown[index].associationId,
      dropdown1
    );

    const { updateIdDashboard } = this.props;
    console.log("updateIdDashboard1", this.props);
    updateIdDashboard({
      prop: "assId",
      value: dropdown[index].associationId
    });

    updateUserInfo({
      prop: "SelectedAssociationID",
      value: dropdown[index].associationId
    });

    updateSelectedDropDown({
      prop: "selectedDropdown",
      value: dropdown[index].value
    });

    updateSelectedDropDown({
      prop: "assId",
      value: dropdown[index].associationId
    });

    // let memId = _.find(memberList, function(o) {
    //   return o.asAssnID === dropdown[index].associationId;
    // });

    updateUserInfo({
      prop: "MyOYEMemberID",
      value: dropdown[index].memberId
    });
    updateUserInfo({
      prop: "SelectedMemberID",
      value: dropdown[index].memberId
    });
    this.roleCheckForAdmin(dropdown[index].associationId);
    this.getUnitListByAssoc();
    // this.setState({ role:dropdown[index].roleId });
  };

  checkUnitIsThere() {
    const { dropdown1 } = this.props;
    console.log(
      "CheckUnit;s is there",
      this.props,
      this.props.dashBoardReducer.uniID,
      dropdown1,
      dropdown1.length
    );
    if (dropdown1.length === 0) {
      this.setState({
        vehiclesCount: 0,
        falmilyMemebCount: 0
      });
    } else {
      this.getVehicleList();
      this.myFamilyListGetData();
    }
  }

  async getUnitListByAssoc() {
    let self = this;
    //self.setState({isLoading: true})
    const { updateIdDashboard } = this.props;

    console.log("APi1233", self.state.assocId);
    let stat = await base.services.OyeLivingApi.getUnitListByAssoc(
      self.state.assocId
    );
    self.setState({ isLoading: false, isDataLoading: false });
    console.log("STAT123", stat, self.state.assocId);

    try {
      if (stat && stat.data) {
        let unitList = [];
        for (let i = 0; i < stat.data.members.length; i++) {
          if (stat.data.members[i].unUniName !== "") {
            unitList.push({
              value: stat.data.members[i].unUniName,
              details: stat.data.members[i]
            });
          }
        }
        console.log("JGjhgjhg", unitList, unitList[0].details.unUnitID);

        self.setState({
          unitList: unitList,
          unitName: unitList[0].value,
          // unitId: unitList[0].details.unUnitID,
          isDataVisible: true
        });
        console.log("updateIdDashboard3", this.props);
        // updateIdDashboard({
        //     prop: "uniID",
        //     value: unitList[0].details.unUnitID
        // });

        self.roleCheckForAdmin(this.state.assocId);
      }
    } catch (error) {
      base.utils.logger.log(error);
    }
  }

  updateUnit(value, index) {
    let self = this;
    let unitList = self.state.unitList;
    let unitName, unitId;
    console.log("DKVMKODVND:", unitList, value, index);
    for (let i = 0; i < unitList.length; i++) {
      if (value === unitList[i].value) {
        unitName = unitList[i].details.asAsnName;
        unitId = unitList[i].details.unUnitID;
      }
    }
    console.log("DKVMhghgghhgh", value, unitId);
    self.setState({
      unitName: value,
      unitId: unitId
    });
    //  const {updateIdDashboard} = this.props;
    // updateIdDashboard({prop: "uniID", value: unitId});
    self.checkUnitIsThere();
    //self.getVehicleList();
  }

  getVehicleList = unitId => {
    console.log("Get ID for vehicle", this.props.dashBoardReducer.uniID);

    fetch(
      `http://${this.props.oyeURL}/oyeliving/api/v1/Vehicle/GetVehicleListByUnitID/${this.props.dashBoardReducer.uniID}`,
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
          "VehicleRespponse####",
          this.props.dashBoardReducer.uniID,
          responseJson
        );
        this.setState({
          //Object.keys(responseJson.data.unitsByBlockID).length
          vehiclesCount: responseJson.data.vehicleListByUnitID.length
        });
      })
      .catch(error => {
        this.setState({ loading: false });
        this.setState({
          //Object.keys(responseJson.data.unitsByBlockID).length
          vehiclesCount: 0
        });
        console.log("error in net call", error);
      });
  };

  myProfileNet = async () => {
    console.log("AccId@@@@@", this.props);
    let response = await base.services.OyeLivingApi.getProfileFromAccount(
      this.props.userReducer.MyAccountID
    );
    console.log("Joe", response);
    const { updateUserInfo } = this.props;
    updateUserInfo({
      prop: "userData",
      value: response
    });
    updateUserInfo({
      prop: "userProfilePic",
      value: response.data.account[0].acImgName
    });
  };

  async myFamilyListGetData() {
    this.setState({ loading: true });
    console.log(
      "Data sending to get family",
      this.props,
      this.props.dashBoardReducer.assId,
      this.props.dashBoardReducer.uniID,
      this.props.userReducer.MyAccountID
    );
    let myFamilyList = await base.services.OyeSafeApiFamily.myFamilyList(
      this.props.dashBoardReducer.uniID,
      this.props.dashBoardReducer.assId,
      this.props.userReducer.MyAccountID
    );
    console.log("Get Family Data", myFamilyList);

    this.setState({ isLoading: false, loading: false });
    try {
      if (myFamilyList.success && myFamilyList.data) {
        this.setState({
          falmilyMemebCount: myFamilyList.data.familyMembers.length
        });
      }
    } catch (error) {
      this.setState({
        falmilyMemebCount: 0,
        loading: false
      });
    }
  }

  getVisitorList = () => {
    fetch(
      `http://${this.props.oyeURL}/oyeliving/api/v1/Vehicle/GetVehicleListByMemID/${this.props.dashBoardReducer.assId}`,
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
        this.setState({ loading: false });
        console.log(error);
      });
  };

  logMeasurement = async (id, phase, actualDuration, baseDuration) => {
    // see output during DEV
    if (__DEV__) console.log({ id, phase, actualDuration, baseDuration });
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
      updateDropDownIndex,
      selectedDropdown,
      selectedDropdown1,
      updateSelectedDropDown,
      updateIdDashboard
    } = this.props;
    let associationList = this.state.assocList;
    let unitList = this.state.unitList;
    let maxLen = 25;
    let maxLenUnit = 10;
    let text = "ALL THE GLITTERS IS NOT GOLD";
    console.log("Hfhfhgfhfhhgfhgfgh", dropdown.length, dropdown1.length);

    return (
      // <Profiler id={"Dashboard"} onRender={this.logMeasurement}>
      <View style={{ height: "100%", width: "100%" }}>
        <NavigationEvents onDidFocus={() => this.requestNotifPermission()} />
        {!this.props.isLoading ? (
          <View style={Style.container}>
            <View style={Style.dropDownContainer}>
              <View style={Style.leftDropDown}>
                {this.state.assdNameHide === false ? (
                  <Dropdown
                    value={
                      selectedDropdown.length > maxLen
                        ? selectedDropdown.substring(0, maxLen - 2) + "..."
                        : selectedDropdown
                    }
                    label="Association Name"
                    baseColor="rgba(0, 0, 0, 1)"
                    data={dropdown}
                    containerStyle={{
                      width: "100%"
                    }}
                    textColor={base.theme.colors.black}
                    inputContainerStyle={{
                      borderBottomColor: "transparent"
                    }}
                    dropdownOffset={{ top: 10, left: 0 }}
                    dropdownPosition={dropdown.length > 2 ? -5 : -2}
                    rippleOpacity={0}
                    // onChangeText={(value, index) =>
                    //   this.onAssociationChange(value, index)
                    // }
                    onChangeText={(value, index) => {
                      this.onAssociationChange(value, index);
                      updateDropDownIndex(index);
                      this.setState({
                        associationSelected: true
                      });
                    }}
                  />
                ) : (
                  <View />
                )}
              </View>
              <View style={Style.rightDropDown}>
                {this.state.unitNameHide === false ? (
                  <Dropdown
                    // value={this.state.unitName}
                    value={
                      selectedDropdown1.length > maxLenUnit
                        ? selectedDropdown1.substring(0, maxLenUnit - 3) + "..."
                        : selectedDropdown1
                    }
                    containerStyle={{
                      width: "95%"
                      /*width: "70%",
                      marginLeft: "30%",
                      borderBottomWidth: hp("0.05%"),
                      borderBottomColor: "#474749"*/
                    }}
                    label="Unit"
                    baseColor="rgba(0, 0, 0, 1)"
                    data={dropdown1}
                    inputContainerStyle={{
                      borderBottomColor: "transparent"
                    }}
                    textColor="#000"
                    dropdownOffset={{ top: 10, left: 0 }}
                    dropdownPosition={
                      dropdown1.length > 2 ? -4 : dropdown1.length < 2 ? -2 : -3
                    }
                    rippleOpacity={0}
                    // onChangeText={(value, index) => {
                    //   this.updateUnit(value, index);
                    // }}
                    onChangeText={(value, index) => {
                      updateUserInfo({
                        prop: "SelectedUnitID",
                        value: dropdown1[index].unitId
                      });
                      updateIdDashboard({
                        prop: "uniID",
                        value: dropdown1[index].unitId
                      });
                      updateSelectedDropDown({
                        prop: "uniID",
                        value: dropdown1[index].unitId
                      });
                      updateSelectedDropDown({
                        prop: "selectedDropdown1",
                        value: dropdown1[index].value
                      });
                      this.updateUnit(value, index);

                      // console.log(value);
                      // console.log(index);
                    }}
                    // itemTextStyle={{}}
                  />
                ) : (
                  <View />
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
                iconWidth={Platform.OS === "ios" ? 35 : 20}
                iconHeight={Platform.OS === "ios" ? 35 : 20}
                cardIcon={require("../../../../icons/my_unit.png")}
                onCardClick={() => this.changeCardStatus("UNIT")}
                textWeight={"bold"}
                textFontSize={10}
                disabled={this.state.isSelectedCard === "UNIT"}
              />
              {this.state.role === 1 ? (
                <CardView
                  height={this.state.adminCardHeight}
                  width={this.state.adminCardWidth}
                  cardText={"Admin"}
                  textWeight={"bold"}
                  iconWidth={Platform.OS === "ios" ? 35 : 20}
                  iconHeight={Platform.OS === "ios" ? 35 : 20}
                  onCardClick={() => this.changeCardStatus("ADMIN")}
                  cardIcon={require("../../../../icons/user.png")}
                  disabled={this.state.isSelectedCard === "ADMIN"}
                />
              ) : (
                <View />
              )}

              {/* <CardView
                        height={this.state.offersCardHeight}
                        width={this.state.offersCardWidth}
                        cardText={'Offers Zone'}
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
                  onPress={() => Linking.openURL("mailto:happy@oyespace.com")}
                  //onPress={()=>this.props.navigation.navigate("schedulePatrolling")}
                >
                  <Image
                    style={Style.supportIcon}
                    source={require("../../../../icons/Group771.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View />
        )}
        <ProgressLoader
          isHUD={true}
          isModal={true}
          visible={this.props.isLoading}
          color={base.theme.colors.primary}
          hudColor={"#FFFFFF"}
        />
      </View>
      // </Profiler>
    );
  }

  changeCardStatus(status) {
    this.setState({
      isSelectedCard: status
    });
    if (status == "UNIT") {
      this.setState({
        myUnitCardHeight: "80%",
        myUnitCardWidth: "26%",
        adminCardHeight: "70%",
        adminCardWidth: "22%",
        offersCardHeight: "70%",
        offersCardWidth: "20%",

        assdNameHide: false,
        unitNameHide: false
      });
    } else if (status == "ADMIN") {
      this.setState({
        myUnitCardHeight: "70%",
        myUnitCardWidth: "22%",
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
        myUnitCardWidth: "22%",
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
    const { dropdown1 } = this.props;
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
            cardCount={this.state.falmilyMemebCount}
            marginTop={20}
            iconWidth={Platform.OS === "ios" ? 40 : 35}
            iconHeight={Platform.OS === "ios" ? 40 : 20}
            onCardClick={() =>
              this.state.isNoAssJoin
                ? this.props.navigation.navigate("CreateOrJoinScreen")
                : dropdown1.length === 0
                ? alert("Unit is not available")
                : this.props.navigation.navigate("MyFamilyList")
            }
            backgroundColor={base.theme.colors.cardBackground}
          />
          <CardView
            height={"100%"}
            width={"25%"}
            cardText={"Vehicles"}
            iconWidth={Platform.OS === "ios" ? 40 : 25}
            iconHeight={Platform.OS === "ios" ? 40 : 20}
            cardIcon={require("../../../../icons/vehicle.png")}
            cardCount={this.state.vehiclesCount}
            marginTop={20}
            backgroundColor={base.theme.colors.cardBackground}
            onCardClick={() =>
              this.state.isNoAssJoin
                ? this.props.navigation.navigate("CreateOrJoinScreen")
                : dropdown1.length === 0
                ? alert("Unit is not available")
                : this.props.navigation.navigate("MyVehicleListScreen")
            }
          />
          <CardView
            height={"100%"}
            width={"25%"}
            cardText={"Visitors"}
            cardIcon={require("../../../../icons/view_all_visitors.png")}
            marginTop={20}
            iconWidth={Platform.OS === "ios" ? 40 : 35}
            iconHeight={Platform.OS === "ios" ? 40 : 20}
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
          {/*<Button
            bordered
            style={styles.button1}
            onPress={() => this.props.navigation.navigate("schedulePatrolling")}
          >
            <Text>Patrolling</Text>
          </Button>*/}
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

  myUnit() {}

  goToFirstTab() {
    const { dropdown1 } = this.props;
    this.state.isNoAssJoin
      ? this.props.navigation.navigate("CreateOrJoinScreen")
      : dropdown1.length === 0
      ? alert("Unit is not available")
      : this.props.navigation.navigate("firstTab");
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
    selectedDropdown: state.DashboardReducer.selectedDropdown,
    selectedDropdown1: state.DashboardReducer.selectedDropdown1,
    sold: state.DashboardReducer.sold,
    unsold: state.DashboardReducer.unsold,
    sold2: state.DashboardReducer.sold2,
    unsold2: state.DashboardReducer.unsold2,
    isLoading: state.DashboardReducer.isLoading,
    memberList: state.DashboardReducer.memberList,
    called: state.DashboardReducer.called,

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
    updateIdDashboard,
    updateSelectedDropDown,
    updateuserRole,
    getDashAssoSync
  }
)(Dashboard);
