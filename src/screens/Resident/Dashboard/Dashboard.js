import React, { PureComponent } from 'react';
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
  ToastAndroid,
  NetInfo,
  ImageBackground,
    ScrollView,FlatList
} from 'react-native';
import base from '../../../base';
import { connect } from 'react-redux';
import CardView from '../../../components/cardView/CardView';
import { Dropdown } from 'react-native-material-dropdown';
import ElevatedView from 'react-native-elevated-view';
import OSButton from '../../../components/osButton/OSButton';
import { showMessage, hideMessage } from 'react-native-flash-message';
import Style from './Style';
import axios from 'axios';
import firebase, { Firebase } from 'react-native-firebase';
import { Button } from 'native-base';
import _ from 'lodash';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import * as fb from 'firebase';
import CountdownCircle from 'react-native-countdown-circle';
import * as Animatable from 'react-native-animatable';
import BackgroundTimer from 'react-native-background-timer';


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
} from '../../../actions';
import ProgressLoader from 'rn-progress-loader';
import { NavigationEvents } from 'react-navigation';
import timer from 'react-native-timer';

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import IcoMoonConfig from '../../../assets/selection.json';
import moment from 'moment';
import strings from "../../../base/utils/strings";
import DeviceInfo from 'react-native-device-info';
import announcement from "../../../../assocition_pages/announcement";
import NotificationScreen from '../../NotificationScreen/NotificationScreen';


const Icon = createIconSetFromIcoMoon(IcoMoonConfig);

const Profiler = React.unstable_Profiler;
let counter = 0;
var associationLoaded = false;
class Dashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      myUnitCardHeight: Platform.OS === 'ios' ? '90%' : '80%',
      myUnitCardWidth: '25%',
      adminCardHeight: '60%',
      adminCardWidth: '20%',
      offersCardHeight: '60%',
      offersCardWidth: '20%',
      isSelectedCard: 'UNIT',
      isLoading: false,
      assocList: [],
      assocName: '',
      assocId: '',
      unitList: [],
      unitName: '',
      unitId: null,
      falmilyMemebCount: null,
      //vehiclesCount: null,
      vehiclesCount: 0,
      visitorCount: null,
      role: '',
      assdNameHide: false,
      unitNameHide: false,
      isDataLoading: false,
      isDataVisible: false,
      isNoAssJoin: false,
      isSOSSelected: false,
      isConnected: true,
      myUnitIconWidth: Platform.OS === 'ios' ? 30 : 20,
      myUnitIconHeight: Platform.OS === 'ios' ? 30 : 20,
      myAdminIconWidth: Platform.OS === 'ios' ? 20 : 20,
      myAdminIconHeight: Platform.OS === 'ios' ? 20 : 20,
      selectedView: 0,
      invoicesList:[]


    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.backButtonListener = null;
    this.currentRouteName = 'Main';
    this.lastBackButtonPress = null;
  }


  static navigationOptions = {
    drawerLabel: 'Dashboard',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../../../../icons/my_unit.png')}
        style={[styles.icon, { tintColor: tintColor }]}
      />
    ),
  };

  componentWillMount() {
    this.setState({
      isDataLoading: true,
      isDataVisible: true,
    });
    this.getListOfAssociation();
    this.myProfileNet();
    this.listenRoleChange();
    this.getInvoiceMethodsList();

    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.setState({ isSOSSelected: false });
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    console.log('API LEVEL#######', DeviceInfo.getAPILevel())
    console.log('API LEVEL#######1111111', DeviceInfo.getBaseOS())
    console.log('API LEVEL#######444444', DeviceInfo.getSystemVersion())  
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    this.backButtonListener.remove();
    this.focusListener.remove();
  }

  handleBackButtonClick() {
    if (Platform.OS === 'android') {
      if (this.state.isSelectedCard === 'UNIT') {
        ToastAndroid.show('Press again to exit app', ToastAndroid.SHORT);

        var doubleClick = BackHandler.addEventListener('hardwareBackPress', () => {
          BackHandler.exitApp()
        });
        setTimeout(
          () => {
            doubleClick.remove()
          },
          1500
        );
      } else if (this.state.isSelectedCard !== 'UNIT') {
        this.changeCardStatus('UNIT');
      }
      this.lastBackButtonPress = new Date().getTime();
      return true;
    }
  }

  readFBRTB(isNotificationClicked) {
    const { dropdown } = this.props;
    let count = 0;
    for (let i in dropdown) {
      let SelectedAssociationID = parseInt(dropdown[i].associationId);
      let MyAccountID = this.props.userReducer.MyAccountID;
      let self = this;
      fb.database()
        .ref('SOS/' + SelectedAssociationID + '/' + MyAccountID + '/')
        .on('value', function (snapshot) {
          let receivedData = snapshot.val();
          snapshot.val();
          if (receivedData !== null) {
            count = count + 1;
            if (receivedData.isActive && receivedData.userId) {
              self.props.navigation.navigate('sosScreen', {
                isActive: true,
                images:
                  receivedData.emergencyImages === undefined
                    ? []
                    : receivedData.emergencyImages
              });
            }
          }
        });
    }

    if (count === 0 && isNotificationClicked) {
      console.log("COMING HERE")
      this.props.navigation.navigate('NotificationScreen');
    }
  }

  navigateToNotificationScreen() { }

  listenRoleChange() {
    const { MyAccountID, dropdown } = this.props;
    let path = 'rolechange/' + MyAccountID;
    let roleRef = base.services.frtdbservice.ref(path);
    //roleRef.off(path);
    let self = this;
    roleRef.on('value', async function (snapshot) {
      try {
        if (counter != 0) {
          console.log(JSON.stringify(snapshot.val()));
          console.log('ROLE_CHANGE_FRTDB', snapshot.val().role);
          if (snapshot.val().role != undefined && snapshot.val().role != 1) {
            let resp = await firebase.messaging().deleteToken();
            firebase.initializeApp(base.utils.strings.firebaseconfig);
          }

          let firebaseMessaging = firebase.messaging();
          let tok = await firebaseMessaging.getToken();
          self.requestNotifPermission();
          self.roleCheckForAdmin(self.state.assocId);
        } else {
          counter = 1;
        }
      } catch (er) {
        console.log('ROLE_CHANGE_FRTDB_ERR', er);
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // return (
    return (
      !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state)
    );
    // );
  }

  /*componentDidUpdate() {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        this.backButtonListener = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
              if (this.currentRouteName !== 'Main') {
                console.log("<< 1 >>");
                this.props.navigation.goBack(null);
                //return false;
              }
              if (this.lastBackButtonPress + 2000 >= new Date().getTime()) {
                console.log("<< 2 >>");
                this.props.navigation.goBack(null);
                this.showExitAlert();
                // BackHandler.exitApp();
                return true;
              }
              if (this.state.isSelectedCard === 'UNIT') {
                //this.props.navigation.goBack(null);
                console.log("<< 3 >>");
                this.showExitAlert();
                //this.props.navigation.goBack(null);
                BackHandler.exitApp();
              } else {
                console.log("<< else >>")
                this.changeCardStatus('UNIT');
              }

              this.lastBackButtonPress = new Date().getTime();

              return true;
            }
        );
      }, 100);
    }
  }*/

  showExitAlert() {
    Alert.alert(
      'Exit Notification',
      'Are you sure,You want to exit ?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => {
            BackHandler.exitApp();
            return true;
          }
        }
      ],
      { cancelable: false }
    );
  }

  requestNotifPermission = () => {
    const {
      MyAccountID,
      champBaseURL,
      receiveNotifications,
      oyeURL
    } = this.props;
    console.log("Dashborad reducer Data in Request Notification Permission:",this.props.dashBoardReducer);
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
      'Content-Type': 'application/json',
      'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
    };

    axios
      .get(
        `http://${oyeURL}/oyeliving/api/v1/Member/GetMemberListByAccountID/${MyAccountID}`,
        {
          headers: headers
        }
      )
      .then(response => {
        console.log("respons ", response);
        let data = response.data.data.memberListByAccount;
        console.log(data, 'memList');

        //UNCOMMENT_IF_ROLLBACK///////************************///////////
        firebase.messaging().subscribeToTopic('' + MyAccountID + 'admin');
        //************************///////////
        data.map(units => {
          if (receiveNotifications) {
            //alert(MyAccountID + "admin");
            firebase
              .messaging()
              .subscribeToTopic(
                '' + MyAccountID + units.unUnitID + 'usernotif'
              );
            console.log('date_asAssnID', units.asAssnID);
            //alert(""+MyAccountID+units.unUnitID+"usernotif")
            console.log("UNSUBSCRIBING_FROM: " + MyAccountID + 'admin')
            firebase
              .messaging()
              .unsubscribeFromTopic(MyAccountID + 'admin');
            firebase
              .messaging()
              .unsubscribeFromTopic('14948admin');
            //UNCOMMENT_IF_ROLLBACK///////************************///////////
            firebase.messaging().subscribeToTopic(MyAccountID + 'admin');
            //************************///////////

            // firebase.messaging().sendMessage("topic here")
            // firebase.messaging().subscribeToTopic( + 'admin');
            // alert(MyAccountID + 'admin');
            // firebase.messaging().subscribeToTopic('7548admin');

            firebase
              .messaging()
              .subscribeToTopic(units.asAssnID + 'Announcement');

            if (units.mrmRoleID === 2 || units.mrmRoleID === 3) {
              // console.log(units, 'units');
              // firebase.messaging().subscribeToTopic(units.unUnitID + 'admin');
              // alert(units.unUnitID + 'admin');
            } else if (units.mrmRoleID === 1) {
              // console.log(units, 'unitsadmin');

              //UNCOMMENT_IF_ROLLBACK///////************************///////////
              firebase.messaging().subscribeToTopic(units.asAssnID + 'admin');
              //************************///////////

              // console.log(units.asAssnID + 'admin', 'subadmin');
              // if (units.asAssnID + 'admin' === '7548admin') {
              //   alert('Accepted');
              // }
              if (units.meIsActive) {
                //firebase.messaging().unsubscribeFromTopic(units.asAssnID+ "admin");
                //UNCOMMENT_IF_ROLLBACK///////************************///////////
                firebase.messaging().subscribeToTopic(units.asAssnID + 'admin');
                //************************///////////

              } else {
                firebase
                  .messaging()
                  .unsubscribeFromTopic(units.asAssnID + 'admin');
              }
            }
          } else if (!receiveNotifications) {
            // firebase.messaging().unsubscribeFromTopic(units.unUnitID + "admin");
            firebase.messaging().unsubscribeFromTopic(MyAccountID + 'admin');
            firebase.messaging().unsubscribeFromTopic(units.asAssnID + 'admin');
          }
        });
        this.roleCheckForAdmin();
      });
  };

  showLocalNotification = notification => {
    try {

      // console.log(notification);
      const channel = new firebase.notifications.Android.Channel(
        'channel_id',
        'Oyespace',
        //firebase.notifications.Android.Importance.High
        firebase.notifications.Android.Importance.Max


      ).setDescription('Oyespace channel')
        .setSound('oye_msg_tone.mp3');
      //.setSound('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      channel.enableLights(true);
      // channel.enableVibration(true);
      // channel.vibrationPattern([500]);
      firebase.notifications().android.createChannel(channel);




      const notificationBuild = new firebase.notifications.Notification({
        //sound: 'default',
        //sound: 'oye_sms.mp3',
        show_in_foreground: true,
        show_in_background: true,
      });

      notificationBuild
        .setTitle(notification._title)
        .setBody(notification._body)
        .setNotificationId(notification._notificationId)
        //.setSound(channel.sound)
        .setSound('oye_msg_tone.mp3')
        // .setSound('oye_msg_tone')
        //.setSound('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')
        .setData({
          ...notification._data,
          foreground: true
        })
        .android.setAutoCancel(true)
        .android.setColor('#FF9100')
        .android.setLargeIcon('ic_notif')
        .android.setSmallIcon('ic_stat_ic_notification')
        .android.setChannelId('channel_id')
        .android.setVibrate([1000, 1000])
        //setSound('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')



        // .android.setChannelId('notification-action')
        .android.setPriority(firebase.notifications.Android.Priority.Max);

      firebase.notifications().displayNotification(notificationBuild);
      this.setState({ foregroundNotif: notification._data });
    } catch (e) {
      console.log('FAILED_NOTIF');
    }
  };
  // showLocalNotification = notification => {
  //   try {

  //      console.log("showLocalNotification",notification);
  //     const channel = new firebase.notifications.Android.Channel(
  //       'Oyespace',
  //       'Oyespace',
  //       firebase.notifications.Android.Importance.High
  //     ).setDescription('Oyespace')
  //         .setSound('oye_msg_tone');
  //   //.setSound('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
  //     channel.enableLights(true);
  //     // channel.enableVibration(true);
  //     // channel.vibrationPattern([500]);
  //     firebase.notifications().android.createChannel(channel);


  //     const channel_for = new firebase.notifications.Android.Channel(
  //       'oye_channel',
  //       'oye_channel',
  //       firebase.notifications.Android.Importance.High
  //     ).setDescription('oye_channel')
  //         .setSound('oye_msg_tone');
  //         channel_for.enableLights(true);
  //         channel_for.enableVibration(true);
  //         channel_for.vibrationPattern([500]);
  //     firebase.notifications().android.createChannel(channel_for);

  //     const notificationBuild = new firebase.notifications.Notification({
  //       //sound: 'default',
  //       //sound: 'oye_msg_tone',
  //       show_in_foreground: true,
  //       show_in_background: true,
  //     })
  //       .setTitle(notification._title)
  //       .setBody(notification._body)
  //       .setNotificationId(notification._notificationId)
  //         //.setSound(channel.sound)
  //         .setSound('oye_msg_tone')
  //         //.setSound('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')
  //       .setData({
  //         ...notification._data,
  //         foreground: true
  //       })
  //       .android.setAutoCancel(true)
  //       .android.setColor('#FF9100')
  //       .android.setLargeIcon('ic_notif')
  //       .android.setSmallIcon('ic_stat_ic_notification')
  //       .android.setChannelId('Oyespace')
  //       .android.setVibrate([1000,1000])
  //       .setSound('oye_msg_tone')

  //         //setSound('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')


  //       // .android.setChannelId('notification-action')
  //       .android.setPriority(firebase.notifications.Android.Priority.High);
  //       console.log("DISPLAY")
  //     firebase.notifications().displayNotification(notificationBuild);
  //     this.setState({ foregroundNotif: notification._data });
  //   } catch (e) {
  //     console.log('FAILED_NOTIF',e);
  //   }
  // };

  listenForNotif = () => {
    console.log('HEY IT IS GOING HERE IN GATE APP NOTIFICATION2222222')

    if (
      this.notificationDisplayedListener == undefined ||
      this.notificationDisplayedListener == null
    ) {
      let navigationInstance = this.props.navigation;

      this.notificationDisplayedListener = firebase
        .notifications()
        .onNotificationDisplayed(notification => {
          // console.log(notification)
          // console.log('____________')
          // Process your notification as required
          // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });

      this.notificationListener = firebase
        .notifications()
        .onNotification(notification => {
          console.log('___________');
          console.log("NOTIFICATION@@@@",notification);
          console.log('NOTIFICATION@@@@____________', notification.data.unitName,notification.data.associationID,notification.data.associationName);

           //  this.changeTheAssociation(notification.data.associationName,notification.data.associationID,)

          if (notification._data.associationID) {
            // this.props.createNotification(notification._data, navigationInstance, false)
          }

          console.log('HEY IT IS GOING HERE IN GATE APP NOTIFICATION111111')
          const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
          const { oyeURL } = this.props.oyespaceReducer;
          //this.props.refreshNotifications(oyeURL, MyAccountID);
          this.props.getNotifications(oyeURL, MyAccountID);


          this.showLocalNotification(notification);

          // showMessage({
          //   message: notification.title,
          //   description: notification.body,
          //   type: "default",
          //   backgroundColor: "#FF9100",
          //   onPress: () => {
          //     this.props.navigation.navigate("NotificationScreen");
          //   }
          // });
        });

      firebase.notifications().onNotificationOpened(notificationOpen => {
        const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
        const { oyeURL } = this.props.oyespaceReducer;
        let details = notificationOpen.notification._data;
        if (notificationOpen.notification._data.admin === 'true') {
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
        } else if (notificationOpen.notification._data.admin === 'false') {
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

        if (notificationOpen.notification._data.admin === 'true') {
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
        } else if (notificationOpen.notification._data.admin === 'gate_app') {
          //  this.props.getNotifications(oyeURL, MyAccountID);

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
        } else if (notificationOpen.notification._data.admin === 'false') {
        }
        // this.props.getNotifications(oyeURL, MyAccountID);
        console.log(
          '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@'
        );
      
       // ntType

        console.log('GET THE NOTIFICATION DATA',notificationOpen.notification.data)
        if(notificationOpen.notification.data.ntType==="Join"){
          this.changeTheAssociation(notificationOpen.notification.data.associationName,notificationOpen.notification.data.associationID,
              notificationOpen.notification.data.sbUnitID, notificationOpen.notification.data.unitName)
        }

        this.readFBRTB(true);
        //this.props.navigation.navigate('NotificationScreen');
      });
    }
  };

  onChangeText = () => { };

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
    console.log("")
    const {
      getDashAssociation,
      getAssoMembers,
      getDashSub,
      allAssociations,
      getDashAssoSync
    } = this.props;
    console.log('SYNC_FUNCTION@@@@@');
    console.log("userReducer>> ", this.props.userReducer);
    const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
    const { oyeURL } = this.props.oyespaceReducer;

    this.requestNotifPermission();

    if (allAssociations != undefined && allAssociations.length > 0 && !associationLoaded) {
      console.log("RENDER_ALLASSOC", allAssociations)
      associationLoaded = true;
      this.createTopicListener(allAssociations, true)
    }

    // this.props.getNotifications(oyeURL, MyAccountID);

    // getDashSub(oyeURL, SelectedAssociationID);
    getDashAssoSync(oyeURL, MyAccountID);
    // getAssoMembers(oyeURL, MyAccountID);
  };

  async componentDidMount() {
    const {
      getDashSub,
      getDashAssociation,
      getAssoMembers,
      receiveNotifications,
      dropdown, allAssociations
    } = this.props;

    const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
    const { oyeURL } = this.props.oyespaceReducer;

    console.log('Props in dashboard did mount ####', this.props)
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);

    console.log("allAssociations_DIDM", allAssociations)

    //    const fcmToken = await firebase.messaging().getToken();
    // if (fcmToken) {
    //     // user has a device token
    //     console.log("FCM_TOKEN:",fcmToken)
    //     let tok = await firebase.messaging().unsubscribeFromTopic("14948_STAFFENTRY_40858");
    //     console.log("FCM_TOKEN:",tok)
    // } else {
    //     // user doesn't have a device token yet
    //     console.log("FCM_TOKEN: NOT AVAILABLE")
    // }

    this.roleCheckForAdmin = this.roleCheckForAdmin.bind(this);
    // getAssoMembers(oyeURL, MyAccountID);
    this.requestNotifPermission();
    // this.getBlockList();
    this.props.getNotifications(oyeURL, MyAccountID);
    // let self = this;
    //   fb.database().ref('SOS/' + SelectedAssociationID + "/" + MyAccountID + "/").on('value', function (snapshot) {
    //     let receivedData = snapshot.val();
    //     console.log("ReceiveddataDash", snapshot.val());
    //     if (receivedData !== null) {
    //       if(receivedData.isActive && receivedData.userId){
    //        self.props.navigation.navigate("sosScreen",{isActive:true,images:receivedData.emergencyImages===undefined?[]:receivedData.emergencyImages})
    //       }

    //         }
    //     });

    //Adding an event listner on focus
    //So whenever the screen will have focus it will set the state to zero

    if (!this.props.called) {
      this.didMount();
    }

    this.syncData();

    // BackgroundTimer.runBackgroundTimer(()=>{
    //   console.log()
    //   this.syncData()
    // },5000)
      // timer.setInterval(
      //            this,
      //            'syncData',
      //            async () => {
      //              console.log("I am Timer");
      //              this.syncData();
      //            },
      //            5000
      //        );
    }


  handleConnectivityChange = isConnected => {
    console.log('CONNECTION DATA', isConnected)
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  async roleCheckForAdmin(index) {
    const { dropdown, dropdown1 } = this.props;
    console.log("this.state.assocId ", this.state.assocId);
    console.log('Check unit and Association available@@@', dropdown, dropdown1);
    try {
      let responseJson = await base.services.OyeLivingApi.getUnitListByAssoc(
        this.state.assocId
      );
      let role = '';
      let isAdminFound = false;
      console.log('roleCheckForAdmin_', responseJson);
      //responseJson.data.members.splice(0,1);

      for (let i = 0; i < responseJson.data.members.length; i++) {
        //alert(responseJson.data.members[i].mrmRoleID)
        let assnId = '' + responseJson.data.members[i].asAssnID;
        assnId = assnId.trim() + 'admin';

        if (
          responseJson.data.members[i].meIsActive &&
          this.props.userReducer.MyAccountID ===
          responseJson.data.members[i].acAccntID &&
          parseInt(this.state.assocId) === responseJson.data.members[i].asAssnID
        ) {
          console.log(
            'Id_eq',
            this.props.userReducer.MyAccountID,
            responseJson.data.members[i].acAccntID,
            responseJson.data.members[i].mrmRoleID
          );
          role = responseJson.data.members[i].mrmRoleID;
          if (role === 1) {
            isAdminFound = true;
          }
          // else{
          //   console.log("UNSUBSCRIBED_FROM_",assnId)
          //   //await base.utils.storage.removeData('ADMIN_NOTIF'+assnId);
          //   //firebase.messaging().unsubscribeFromTopic(assnId)
          // }
        } else {
          //console.log("UNSUBSCRIBED_USER_FROM_",assnId)
          //firebase.messaging().unsubscribeFromTopic(assnId)
        }
      }

      let assnId = '' + this.state.assocId + 'admin';
      if (isAdminFound) {
        role = 1;
        console.log(assnId);
        //let subscription = await base.utils.storage.retrieveData('ADMIN_NOTIF'+assnId);
        console.log('SUBSCRIBED_TO_', assnId);
        // if(subscription == null || subscription == undefined){

        await base.utils.storage.storeData('ADMIN_NOTIF' + assnId, assnId);
        ///ROLLBACK///////
        firebase.messaging().subscribeToTopic(assnId);
        //************************///////////

        // if (assnId === '7548admin') {
        //   // alert('Sub');
        // }
        // }
      } else {
        console.log('UNSUBSCRIBED_FROM_', assnId);
        await base.utils.storage.removeData('ADMIN_NOTIF' + assnId);
        /* if (assnId === '7548admin') {
         // alert('Unsub');
        }*/
        firebase.messaging().unsubscribeFromTopic(assnId);
      }

      console.log(role, 'role');
      this.setState(
        {
          role: role
        },
        () => {
          const { updateuserRole } = this.props;
          console.log('Role123456:', updateuserRole);
          updateuserRole({
            prop: 'role',
            value: role
          });
          const { updateIdDashboard } = this.props;
          updateIdDashboard({
            prop: 'roleId',
            value: role
          });
          console.log('ROLE_UPDATE', role);
        }
      );
      // })
      // .catch(error => {
      //   this.setState({ error, loading: false });
      // let userAssociation = this.props.dashBoardReducer.dropdown;
      // fetch(
      //   `http://apidev.oyespace.com/oyeliving/api/v1/Member/GetMemberListByAccountID/${this.props.userReducer.MyAccountID}`,
      //   {
      //     method: 'GET',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
      //     }
      //   }
      // ).then(response => response.json())
      // .then(responseJson => {
      //   console.log("res in data receving: ", responseJson);
      //   })
      //   .catch(error=>{
      //   console.log("Error:",error)
      // })
      this.listenToFirebase(userAssociation);
      // });
      this.checkUnitIsThere();
    } catch (err) {
      //alert(err)
      console.log('ROLECHECK_ERROR', err);
    }
  }

  

  listenToFirebase(userAssociation){
    let self = this;
    for (let i in userAssociation){
      let associationId = userAssociation[i].associationId;
      let associationPath = `syncdashboard/isAssociationRefreshing/${associationId}`;
      fb.database().ref(associationPath).on('value',function(snapshot){
        let receivedData = snapshot.val();
        console.log("Received Data in dashboard:",receivedData);
        if(receivedData !== null){
        //  if(receivedData.isAssocNotificationUpdating>0){
            console.log("Update Notification List Now")
            self.updateDashboard();
            
          //   firebase.database().ref(associationPath).remove().then((response)=>{
          //     let receivedData = response.val();
          //     console.log("Response!!!!!!!",receivedData)

          // }).catch((error)=>{
          //     console.log('Response!!!!!!!',error.response)
          // });
         // }
        }
        
    })
    }
  }

  updateDashboard(){
    let self = this;
    console.log("Update Dashboard Changes if any------------------------------------>>>>>>>>>>>")
    self.props.getNotifications(self.props.oyeURL, self.props.MyAccountID);
  }

  static getAssociationList() {
    this.getAssociationList();
  }

  async getListOfAssociation() {
    let self = this;
    let oyeURL = this.props.oyeURL;
    self.setState({ isLoading: true });

    axios
      .get(
        `${this.props.champBaseURL}/Member/GetMemberListByAccountID/${this.props.userReducer.MyAccountID}`,
        {
          headers: {
            'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
            'Content-Type': 'application/json'
          }
        }
      )
      .then(stat => {
        console.log(
          'API data for association list',
          this.props.userReducer,
          this.props.userReducer.MyAccountID,
          this.props.oyeURL
        );

        console.log('Response_Association: ', stat);

        try {
          if (stat && stat.data.success) {
            this.setState({
              isNoAssJoin: false
            });
            let assocList = [];
            for (
              let i = 0;
              i < stat.data.data.memberListByAccount.length;
              i++
            ) {
              if (stat.data.data.memberListByAccount[i].asAsnName !== '') {
                assocList.push({
                  value: stat.data.data.memberListByAccount[i].asAsnName,
                  details: stat.data.data.memberListByAccount[i]
                });
              }
            }
            let sortedArr = assocList.sort(
              base.utils.validate.compareAssociationNames
            ); //open chrome
            console.log('Sorted and All Asc List', sortedArr, assocList);

            let removedDuplicates = _.uniqBy(sortedArr, 'value');
            console.log('Removed duplicates', sortedArr, assocList);

            self.setState({
              assocList: removedDuplicates,
              assocName: sortedArr[0].details.asAsnName,
              assocId: sortedArr[0].details.asAssnID
            });
            const { updateIdDashboard } = this.props;
            console.log('updateIdDashboard1', this.props);
            updateIdDashboard({
              prop: 'assId',
              value: sortedArr[0].details.asAssnID
            });
            // updateIdDashboard({ prop: "memberList", value: sortedArr });
            const { updateUserInfo } = this.props;
            updateUserInfo({
              prop: 'SelectedAssociationID',
              value: sortedArr[0].details.asAssnID
            });
            base.utils.validate.checkSubscription(
              this.props.userReducer.SelectedAssociationID
            );
            self.getUnitListByAssoc();
          } else if (!stat.data.success) {
            this.setState({
              isNoAssJoin: true
            });
            this.props.navigation.navigate('CreateOrJoinScreen')

            /* Alert.alert(
               'Join association',

               'Please join in any association to access Data  ?',
               [
                 {
                   text: 'Yes',
                   onPress: () =>
                     this.props.navigation.navigate('CreateOrJoinScreen')
                 },
                 { text: 'No', style: 'cancel' }
               ]
             );*/
          }
        } catch (error) {
          console.log('Error details', error);
          this.setState({
            isNoAssJoin: true
          });
          this.props.navigation.navigate('CreateOrJoinScreen')

          /*Alert.alert(
            'Join association',

            'Please join in any association to access Data  ?',
            [
              {
                text: 'Yes',
                onPress: () =>
                  this.props.navigation.navigate('CreateOrJoinScreen')
              },
              { text: 'No', style: 'cancel' }
            ]
          );*/
        }
      })
      .catch(error => {
        console.log('Error in list of Association', error);
        this.setState({
          isNoAssJoin: true
        });

        this.props.navigation.navigate('CreateOrJoinScreen')

        /*Alert.alert(
          'Join association',

          'Please join in any association to access Data  ?',
          [
            {
              text: 'Yes',
              onPress: () =>
                this.props.navigation.navigate('CreateOrJoinScreen')
            },
            { text: 'No', style: 'cancel' }
          ]
        );*/
      });
  }


  changeTheAssociation = (value, assId,unitId,unitName) => {

    const {
      associationid,
      getDashUnits,
      updateUserInfo,
      memberList,
      notifications,
      dropdown,
      updateSelectedDropDown,
      dropdown1,
    } = this.props;

    console.log('Ass index', value, assId,dropdown1,dropdown);
    const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
    const { oyeURL } = this.props.oyespaceReducer;
    this.setState({ assocId: assId});

    getDashUnits(
        assId,
        oyeURL,
        MyAccountID,
        dropdown,
        assId,
        dropdown1
    );

    const { updateIdDashboard } = this.props;
    console.log('updateIdDashboard1', this.props);
    updateIdDashboard({
      prop: 'assId',
      value: assId
    });

    updateUserInfo({
      prop: 'SelectedAssociationID',
      value: assId
    });

    updateSelectedDropDown({
      prop: 'selectedDropdown',
      value: value
    });

    updateSelectedDropDown({
      prop: 'assId',
      value: assId
    });
    updateUserInfo({
      prop: 'SelectedUnitID',
      value: unitId
    });
    updateIdDashboard({
      prop: 'uniID',
      value:unitId
    });
    updateSelectedDropDown({
      prop: 'uniID',
      value: unitId
    });
    updateSelectedDropDown({
      prop: 'selectedDropdown1',
      value:unitName
    });

    console.log('THISPOPPPPPPPP',this.props)

    this.roleCheckForAdmin(assId);
   // this.getUnitListByAssoc();
    //this.setView(0)
    // this.setState({ role:dropdown[index].roleId });
  };

  onAssociationChange = (value, index) => {

    const {
      associationid,
      getDashUnits,
      updateUserInfo,
      memberList,
      notifications,
      dropdown,
      updateSelectedDropDown,
      dropdown1,
    } = this.props;

    console.log('Ass index', value, index, dropdown[index]);
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
    console.log('updateIdDashboard1', this.props);
    updateIdDashboard({
      prop: 'assId',
      value: dropdown[index].associationId
    });
    updateIdDashboard({
      prop: 'familyMemberCount',
      value: ""
    });
    updateIdDashboard({
      prop: 'vehiclesCount',
      value: ""
    });

    updateUserInfo({
      prop: 'SelectedAssociationID',
      value: dropdown[index].associationId
    });

    updateSelectedDropDown({
      prop: 'selectedDropdown',
      value: dropdown[index].value
    });

    updateSelectedDropDown({
      prop: 'assId',
      value: dropdown[index].associationId
    });


    base.utils.validate.checkSubscription(dropdown[index].associationId);

    // let memId = _.find(memberList, function(o) {
    //   return o.asAssnID === dropdown[index].associationId;
    // });

    updateUserInfo({
      prop: 'MyOYEMemberID',
      value: dropdown[index].memberId
    });
    updateUserInfo({
      prop: 'SelectedMemberID',
      value: dropdown[index].memberId
    });
    this.roleCheckForAdmin(dropdown[index].associationId);
    this.getUnitListByAssoc();
    this.setView(0)
    // this.setState({ role:dropdown[index].roleId });
  };

  checkUnitIsThere() {
    const { dropdown1 } = this.props;
    console.log(
      'CheckUnit;s is there',
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
      const { updateIdDashboard } = this.props;
      updateIdDashboard({
        prop: 'familyMemberCount',
        value: ""
      });
      updateIdDashboard({
        prop: 'vehiclesCount',
        value: ""
      });
    } else {
      console.log("<< INSIDE >>");
      this.getVehicleList();
      this.myFamilyListGetData();
    }
  }

  async getUnitListByAssoc() {
    let self = this;
    //self.setState({isLoading: true})
    const { updateIdDashboard } = this.props;

    console.log('APi1233', self.state.assocId);
    let stat = await base.services.OyeLivingApi.getUnitListByAssoc(
      self.state.assocId
    );
    self.setState({ isLoading: false, isDataLoading: false });
    console.log('STAT123', stat, self.state.assocId);

    try {
      if (stat && stat.data) {
        let unitList = [];
        for (let i = 0; i < stat.data.members.length; i++) {
          if (stat.data.members[i].unUniName !== '') {
            unitList.push({
              value: stat.data.members[i].unUniName,
              details: stat.data.members[i]
            });
          }
        }
        console.log('JGjhgjhg', unitList, unitList[0].details.unUnitID);

        self.setState({
          unitList: unitList,
          unitName: unitList[0].value,
          // unitId: unitList[0].details.unUnitID,
          isDataVisible: true
        });
        self.readFBRTB(false);
        console.log('updateIdDashboard3', this.props);
        // updateIdDashboard({
        //     prop: "uniID",
        //     value: unitList[0].details.unUnitID
        // });
        self.roleCheckForAdmin(this.state.assocId);
        self.getInvoiceMethodsList();
      }
    } catch (error) {
      base.utils.logger.log(error);
    }
  }

  updateUnit(value, index) {
    console.log("updateUnit: ", value, index);
    let self = this;
    let unitList = self.state.unitList;
    let unitName, unitId;
    console.log('DKVMKODVND:', unitList, value, index);
    for (let i = 0; i < unitList.length; i++) {
      if (value === unitList[i].value) {
        unitName = unitList[i].details.asAsnName;
        unitId = unitList[i].details.unUnitID;
      }
    }
    console.log('DKVMhghgghhgh', value, unitId);
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
    console.log('Get ID for vehicle', this.props.dashBoardReducer.uniID);

    fetch(
      `http://${this.props.oyeURL}/oyeliving/api/v1/Vehicle/GetVehicleListByUnitID/${this.props.dashBoardReducer.uniID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log("res: ", responseJson);
        console.log(
          'VehicleRespponse####',
          this.props.dashBoardReducer.uniID,
          responseJson
        );

        console.log("vehicle count: ", responseJson.data.vehicleListByUnitID.length);
        this.setState({
          //Object.keys(responseJson.data.unitsByBlockID).length
          vehiclesCount: responseJson.data.vehicleListByUnitID.length
        });
        const { updateIdDashboard } = this.props;
        updateIdDashboard({
          prop: 'vehiclesCount',
          value: responseJson.data.vehicleListByUnitID.length
        });
        console.log("res>> ", responseJson.data.vehicleListByUnitID.length)
      })
      .catch(error => {
        console.log("catch ", error);
        this.setState({ loading: false });
        this.setState({
          //Object.keys(responseJson.data.unitsByBlockID).length
          vehiclesCount: 0
        });
        const { updateIdDashboard } = this.props;
        updateIdDashboard({
          prop: 'vehiclesCount',
          value: 0
        });
        console.log('error in net call', error);
      });
  };

  myProfileNet = async () => {
    console.log('AccId@@@@@', this.props);
    let response = await base.services.OyeLivingApi.getProfileFromAccount(
      this.props.userReducer.MyAccountID
    );
    console.log('Joe', response);
    const { updateUserInfo } = this.props;
    updateUserInfo({
      prop: 'userData',
      value: response
    });
    updateUserInfo({
      prop: 'userProfilePic',
      value: response.data.account[0].acImgName
    });
  };


  async myFamilyListGetData() {
    this.setState({ loading: true });
    console.log(
      'Data sending to get family',
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
    console.log('Get Family Data', myFamilyList);

    this.setState({ isLoading: false, loading: false });
    try {
      if (myFamilyList.success && myFamilyList.data) {
        let familyData=myFamilyList.data.familyMembers
        let reqData=[]
        for(let i=0;i<familyData.length;i++){
          if(familyData[i].acAccntID !== this.props.userReducer.MyAccountID){
            reqData.push(familyData[i])
          }
        }
        this.setState({
          falmilyMemebCount: reqData.length
        });
        const { updateIdDashboard } = this.props;
        console.log('updateIdDashboard1', this.props);
        updateIdDashboard({
          prop: 'familyMemberCount',
          value: reqData.length
        });
      }
    } catch (error) {
      this.setState({
        falmilyMemebCount: 0,
        loading: false
      });
      const { updateIdDashboard } = this.props;
      console.log('updateIdDashboard1', this.props);
      updateIdDashboard({
        prop: 'familyMemberCount',
        value: 0
      });
    }
  }

  getVisitorList = () => {
    fetch(
      `http://${this.props.oyeURL}/oyeliving/api/v1/Vehicle/GetVehicleListByMemID/${this.props.dashBoardReducer.assId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1'
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log('Manas', responseJson);
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


  createTopicListener(associationList, _switch) {
    if (associationList != undefined && associationList.length > 0) {


      try {
        // const fcmToken_ = firebase.messaging().getToken();
        console.log("STARTE ROVEKING")
        // firebase.messaging().getToken().then(s=>{
        //   console.log("STARTE ROVEKING_TOK",s)
        // })



        firebase.messaging().hasPermission().
          then((enabled) => {
            if (enabled) {
              messaging.getToken()
                .then(token => { console.log("FCMTOKE::", token) })
                .catch(error => { console.log("FCMTOKE::", error) });
            } else {
              messaging.requestPermission()
                .then(() => { console.log("FCMTOKE::GOTPERMISSION") })
                .catch(error => { console.log("FCMTOKE::NOPERMISSION") });
            }
          })
          .catch(error => { console.log("FCMTOKE::NOPERMISSION_CATCH") });


        // let resp =  firebase.messaging().deleteToken().then((st)=>{
        //   console.log("DELETE_TOK",st)
        // });
        //       firebase.initializeApp(base.utils.strings.firebaseconfig);
        // console.log("REVOKING",resp)

        console.log("createTopicListener", associationList)
        let assnList = _.filter(associationList, item => item.unUniName != "");
        console.log("createTopicListener_2", assnList)
        for (unit of assnList) {
          console.log("createTopicListener_3", unit)


          if (_switch) {
            console.log("SUBSCRIBING_TOPIS", unit.asAssnID + "_STAFFENTRY_" + unit.unUnitID)
            firebase.messaging().subscribeToTopic(unit.asAssnID + "_STAFFENTRY_" + unit.unUnitID).then((s) => {
              console.log('subscribeToTopicSTST', s)
            });
            firebase.messaging().subscribeToTopic(unit.asAssnID + "_STAFFEXIT_" + unit.unUnitID);
            firebase.messaging().subscribeToTopic(unit.asAssnID + "_VENDORENTRY_" + unit.unUnitID);
            firebase.messaging().subscribeToTopic(unit.asAssnID + "_VENDOREXIT_" + unit.unUnitID);
          } else {
            console.log("UNSUBSCRIBING_TOPIS", unit.asAssnID + "_STAFFENTRY_" + unit.unUnitID)
            firebase.messaging().unsubscribeFromTopic(unit.asAssnID + "_STAFFENTRY_" + unit.unUnitID).then((s) => {
              console.log('unsubscribeFromTopic', s)
            });
            firebase.messaging().unsubscribeFromTopic(unit.asAssnID + "_STAFFEXIT_" + unit.unUnitID);
            firebase.messaging().unsubscribeFromTopic(unit.asAssnID + "_VENDORENTRY_" + unit.unUnitID);
            firebase.messaging().unsubscribeFromTopic(unit.asAssnID + "_VENDOREXIT_" + unit.unUnitID);
          }
        }
      } catch (e) {
        console.log("ERROR REVOKING ", e)
      }
    }
  }

  setView(param) {
    this.setState({ selectedView: param })
  }

  renderSOS() {
    if (this.props.dropdown.length == 0) {
      return (
        <View />
      )
    }
    else {
      return (
        <View
          style={{
            alignSelf: 'flex-end',
            height: 50,
            width: 50,
            justifyContent: 'center',
            marginTop: hp('52%'),
            position: 'absolute',
            right: Platform.OS === 'ios'? hp('1'):hp('2.5'),
           // backgroundColor:'pink'
          }}
        >
          {!this.state.isSOSSelected ? (
            <TouchableHighlight
              underlayColor={base.theme.colors.transparent}
              onPress={() => this.selectSOS()}
            >
              <Image
                style={{
                  width: wp('18%'),
                  height: hp('10%'),
                  right: 20,
                  justifyContent: 'center'
                }}
                source={require('../../../../icons/sos_btn.png')}
              />
            </TouchableHighlight>
          ) : (
              <View style={{ flexDirection: 'row', right: 45 }}>
                <TouchableHighlight
                  style={{ alignSelf: 'flex-end', right: 2 }}
                  underlayColor={base.theme.colors.transparent}
                  onPress={() => this.selectSOS()}
                >
                  <Text
                    style={{
                      alignSelf: 'flex-end',
                      right: 5,
                      color: base.theme.colors.red
                    }}
                  >
                    Cancel
                      </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={base.theme.colors.transparent}
                  onPress={() =>
                    this.props.navigation.navigate('sosScreen', {
                      isActive: false
                    })
                  }
                >
                  <CountdownCircle
                    seconds={5}
                    radius={25}
                    borderWidth={7}
                    color={base.theme.colors.primary}
                    updateText={(elapsedSeconds, totalSeconds) =>
                      ('' + totalSeconds - elapsedSeconds).toString() + '\nsec'
                    }
                    bgColor="#fff"
                    textStyle={{ fontSize: 15, textAlign: 'center' }}
                    onTimeElapsed={() =>
                      this.props.navigation.navigate('sosScreen', {
                        isActive: false
                      })
                    }
                  />
                </TouchableHighlight>
              </View>
            )}
        </View>
      )
    }
  }


  render() {

    let selectedView = this.state.selectedView;

    const {
      dropdown,
      dropdown1,
      allAssociations,
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
    let maxLen = 23;
    let maxLenUnit = 10;
    let text = 'ALL THE GLITTERS IS NOT GOLD';
    console.log(
      'To check the @@@@@@',
      dropdown.length,
      dropdown1.length,
      this.props
    );

    console.log("vehiclesCount ", this.props.dashBoardReducer.role, dropdown1.length,selectedView);

    let isAdmin = this.props.dashBoardReducer.role === 1?true:false
       //selectedView=isAdmin?1:0

    //console.log("RENDER_ALLASSOC_0",allAssociations)


    if (!this.state.isConnected) {
      console.log('CHECK NET!!!!!!', this.state.isConnected)

      return (
        <View style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'flex-start', marginTop: Platform.OS === 'ios' ? 50 : 100 }}>
          <TouchableOpacity style={{ height: '50%', width: '100%', }}
            onPress={() =>
              NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange)}>
            <Image
              resizeMode={Platform.OS === 'ios' ? 'contain' : 'center'}
              style={{ height: '100%', width: '100%', }}
              source={require('../../../../icons/nointernet1.png')}
            />
          </TouchableOpacity>
        </View>
      )

    }
    else {
      console.log('CHECK NET!!!!!!@@@@@', this.state.isConnected);

      return (
        <View style={{ height: '100%', width: '100%' }}>
          <NavigationEvents onDidFocus={() => this.requestNotifPermission()} />
          {!this.props.isLoading ? (
            <View style={Style.container}>
              <View style={Style.dropDownContainer}>
                <View style={Style.leftDropDown}>
                  {this.state.assdNameHide === false ? (
                    <Dropdown
                      value={
                        selectedDropdown.length > maxLen
                          ? selectedDropdown.substring(0, maxLen - 2) + '...'
                          : selectedDropdown
                      }
                      label="Association Name"
                      baseColor="rgba(0, 0, 0, 1)"
                      data={dropdown}
                      containerStyle={{
                        width: '100%'
                      }}
                      textColor={base.theme.colors.black}
                      inputContainerStyle={{
                        borderBottomColor: 'transparent'
                      }}
                      dropdownOffset={{ top: 10, left: 0 }}
                      dropdownPosition={dropdown.length > 2 ? -5 : -2}
                      rippleOpacity={0}
                      // onChangeText={(value, index) =>
                      //   this.onAssociationChange(value, index)
                      // }
                      onChangeText={(value, index) => {
                        this.onAssociationChange(value, index);

                        this.props.updateuserRole({
                          prop: 'role',
                          value: dropdown[index].roleId
                        });
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
                          ? selectedDropdown1.substring(0, maxLenUnit - 3) + '...'
                          : selectedDropdown1
                      }
                      containerStyle={{
                        width: '95%'
                        /*width: "70%",
                                marginLeft: "30%",
                                borderBottomWidth: hp("0.05%"),
                                borderBottomColor: "#474749"*/
                      }}
                      label="Unit"
                      baseColor="rgba(0, 0, 0, 1)"
                      data={dropdown1}
                      inputContainerStyle={{
                        borderBottomColor: 'transparent'
                      }}
                      textColor="#000"
                      dropdownOffset={{ top: 10, left: 0 }}
                      dropdownPosition={
                        dropdown1.length > 2 ? -4 : dropdown1.length < 2 ? -2 : -3
                      }
                      rippleOpacity={0}
                      // onChangeText={(value, index) => {
                      //   console.log("value/index ",value, index);
                      //   this.updateUnit(value, index);
                      // }}
                      onChangeText={(value, index) => {
                        updateUserInfo({
                          prop: 'SelectedUnitID',
                          value: dropdown1[index].unitId
                        });
                        updateIdDashboard({
                          prop: 'uniID',
                          value: dropdown1[index].unitId
                        });
                        updateSelectedDropDown({
                          prop: 'uniID',
                          value: dropdown1[index].unitId
                        });
                        updateSelectedDropDown({
                          prop: 'selectedDropdown1',
                          value: dropdown1[index].value
                        });
                        this.updateUnit(value, index);
                      }}
                    // itemTextStyle={{}}
                    />
                  ) : (
                      <View />
                    )}
                </View>
              </View>

              <ImageBackground
                resizeMode={'stretch'}
                source={selectedView === 0 ? require('../../../../icons/myunit_dashboard.png') : require("../../../../icons/admin_dashboard.png")}
                style={{ height: ('90%'), marginTop: hp('0'), width: ('100%'), alignSelf: 'center' }}>

                {this.state.selectedView === 0
                  ? this.myUnitCard()
                  : this.state.selectedView === 1
                    ? this.adminCard()
                    : this.offersZoneCard()}
                {this.renderSOS()}

                <View style={{ flexDirection: 'row', top: hp('23'), justifyContent: 'space-between', width: wp('65'), alignSelf: 'center', borderWidth: 0, alignItems: 'flex-end' }}>
                  <TouchableHighlight
                    underlayColor={'transparent'}
                    onPress={() => this.setView(0)}>
                    <View style={{ flexDirection: 'column', bottom: Platform.OS === 'ios'? hp('2'):hp('2'), justifyContent: 'center', width: wp('25'), alignSelf: 'center', borderWidth: 0, alignItems: 'center' }}>
                      <Image
                        resizeMode={'contain'}
                        style={{
                          width: hp('4%'),
                          height: hp('4%'),
                        }}
                        source={require('../../../../icons/my_unit.png')}
                      />
                      <Text allowFontScaling={false}>My Unit</Text>

                    </View>
                  </TouchableHighlight>
                  {isAdmin?
                  <TouchableHighlight
                    underlayColor={'transparent'}
                    onPress={() =>  this.setView(1)}>
                    <View style={{ flexDirection: 'column', bottom: Platform.OS === 'ios'? hp('2'):hp('2'), justifyContent: 'center', width: wp('35'), alignSelf: 'center', borderWidth: 0, alignItems: 'center', left: hp('5') }}>
                      <Image
                        resizeMode={'contain'}
                        style={{
                          width: hp('3%'),
                          height: hp('3%'),
                        }}
                        source={require('../../../../icons/user.png')}
                      />
                      <Text allowFontScaling={false}>Admin</Text>

                    </View>
                  </TouchableHighlight>
                      :
                      <View/>}
                </View>
              </ImageBackground>

              <View style={{height: '6%',
                            width: '100%',
                            alignItems: 'center',
                            backgroundColor: base.theme.colors.white,
                            borderColor: base.theme.colors.primary,
                            borderWidth: 0,
                            position:'absolute',
                           // marginBottom: hp('5'),
                            justifyContent: 'flex-start',
                            top:hp('82'),
                            flexDirection: 'row'
              }}>

                              <View style={{borderWidth:0}}>
                              <Image
                    resizeMode={'cover'}
                      style={{height: hp('10'),
                        width: wp('55'),
                        alignSelf:'flex-start',
                        borderWidth:0
                       }}
                      source={require('../../../../icons/bottomImg.png')}
                    />
                              </View>
                <View style={Style.subSupportView}>
                  <TouchableOpacity
                    onPress={() => {
                      {
                        Platform.OS === 'android'
                          ? Linking.openURL(`tel:9343121121`)
                          : Linking.openURL(`tel:9343121121`);
                      }
                    }}
                  >
                    <Image
                    resizeMode={'cover'}
                  //    style={Style.supportIcon}
                      source={require('../../../../icons/call1.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity

                  >
                    <Image
                    resizeMode={'cover'}
                     // style={Style.supportIcon}
                      source={require('../../../../icons/chat_1.png')}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => Linking.openURL('mailto:happy@oyespace.com')}
                  >
                    <Image
                    resizeMode={'cover'}
                     // style={Style.supportIcon}
                      source={require('../../../../icons/email1.png')}
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
            hudColor={'#FFFFFF'}
          />
        </View>
      );
    }


  }

  changeCardStatus(status) {
    this.setState({
      isSelectedCard: status
    });
    if (status === 'UNIT') {
      this.setState({
        myUnitCardHeight: Platform.OS === 'ios' ? '90%' : '80%',
        myUnitCardWidth: '26%',
        adminCardHeight: '70%',
        adminCardWidth: '22%',
        offersCardHeight: '70%',
        offersCardWidth: '20%',
        myUnitIconWidth: Platform.OS === 'ios' ? 30 : 20,
        myUnitIconHeight: Platform.OS === 'ios' ? 30 : 20,
        myAdminIconWidth: Platform.OS === 'ios' ? 20 : 20,
        myAdminIconHeight: Platform.OS === 'ios' ? 20 : 20,

        assdNameHide: false,
        unitNameHide: false
      });
    } else if (status === 'ADMIN') {
      this.setState({
        myUnitCardHeight: Platform.OS === 'ios' ? '80%' : '70%',
        myUnitCardWidth: '22%',
        adminCardHeight: '80%',
        adminCardWidth: '25%',
        offersCardHeight: '70%',
        offersCardWidth: '20%',
        myUnitIconWidth: Platform.OS === 'ios' ? 20 : 20,
        myUnitIconHeight: Platform.OS === 'ios' ? 20 : 20,
        myAdminIconWidth: Platform.OS === 'ios' ? 30 : 20,
        myAdminIconHeight: Platform.OS === 'ios' ? 30 : 20,


        assdNameHide: true,
        unitNameHide: true
      });
    } else if (status === 'OFFERS') {
      this.setState({
        myUnitCardHeight: Platform.OS === 'ios' ? '80%' : '70%',
        myUnitCardWidth: '22%',
        adminCardHeight: '70%',
        adminCardWidth: '20%',
        offersCardHeight: '80%',
        offersCardWidth: '25%'
      });
    }
  }

  navigateToScreen() {
    this.props.navigation.navigate('');
  }

  getPaymentGateWay() {
    //   console.log('GET THE PROPS DATA',this.props,this.props.navigation.state.params.htmlCode)
    axios
      .post(
        `http://${this.props.oyeURL}/oyeliving/api/v1/PaymentICICI/Create`,
        {
          "chargetotal": "2222",
          "customerID": 9539
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
            'Authorization': 'my-auth-token'
          }
        }
      )
      .then(response => {
        console.log('RESPONSE >>>>>', response);
        setTimeout(_ => this.getICICInter(response), 1000)
      }).catch(error => console.log("ERROR", error))
  }

  getICICInter(response) {
    let paymentData = response.data.data.paymentICICI;
    console.log('RESPONSE !!!!!!', paymentData)
    const reqData = new FormData();
    // reqData.append('txntype',paymentData.txntype)
    // reqData.append('timezone',paymentData.timezone)
    // reqData.append('txndatetime',paymentData.txndatetime)
    // reqData.append('hash_algorithm',paymentData.hash_algorithm)
    // reqData.append('hash',paymentData.response_hash)
    // reqData.append('storename',paymentData.storename)
    // reqData.append('mode',paymentData.mode)
    // reqData.append('currency',paymentData.currency)
    // reqData.append('responseSuccessURL',paymentData.pgStatURL)
    // reqData.append('responseFailURL',paymentData.pgStatURL)
    // reqData.append('language',paymentData.language)
    // reqData.append('chargetotal',paymentData.chargetotal)
    // reqData.append('oid',paymentData.oid);


    let iciciForm = {
      txntype: paymentData.txntype, //'sale'
      timezone: paymentData.timezone, //'Asia/Calcutta',
      txndatetime: paymentData.txndatetime, //this.utilService.getDateTime(),//,
      hash_algorithm: paymentData.hash_algorithm,
      hash: paymentData.response_hash,
      storename: paymentData.storename, //'3300002052',
      mode: paymentData.mode, // "payonly" ,
      currency: paymentData.currency,
      responseSuccessURL: paymentData.pgStatURL,
      responseFailURL: paymentData.pgStatURL,
      language: paymentData.language, //"en_US",
      chargetotal: paymentData.chargetotal,
      // oid: paymentData.oid
    };

    reqData.append("iciciForm", JSON.stringify(iciciForm));

    console.log('REQ DATA', iciciForm);
    let fd = JSON.stringify(reqData);

    setTimeout(() => {
      axios
        .post(
          `https://test.ipg-online.com/connect/gateway/processing`,
          {
            reqData
          }
        )
        .then(response => {
          console.log('RESPONSE >>>>>', response);
          this.props.navigation.navigate('privacyPolicy', { htmlCode: response.data })
        }).catch(error => { console.log('ERROR', error) })
    }, 1000)
  }

  myUnitCard() {
    const { dropdown, dropdown1 } = this.props;
    //this.state.invoicesList
    let invoiceList =this.state.invoicesList;
    console.log('FamilyList count', this.props.dashBoardReducer);
    return (
      <View style={Style.mainElevatedView}>
        <View style={Style.elevatedView}>
          <CardView
            height={'100%'}
            width={'25%'}
            cardText={' Family'}
            cardIcon={require('../../../../icons/view_all_visitors.png')}
            cardCount={this.props.dashBoardReducer.familyMemberCount}
            marginTop={20}
            iconWidth={Platform.OS === 'ios' ? hp('5') : 35}
            iconHeight={Platform.OS === 'ios' ? hp('5') : 20}
            textFontSize={Platform.OS === 'ios' ? 8 : 12}

            onCardClick={() =>

               dropdown.length === 0
                   ? this.props.navigation.navigate('CreateOrJoinScreen')
                   : dropdown1.length === 0
                   ? alert('Unit is not available')
                   : this.props.navigation.navigate('MyFamilyList')
            }

            backgroundColor={base.theme.colors.cardBackground}
          />
          <CardView
            height={'100%'}
            width={'25%'}
            cardText={'Vehicles'}
            iconWidth={Platform.OS === 'ios' ? hp('5') : 25}
            iconHeight={Platform.OS === 'ios' ? hp('5') : 20}
            cardIcon={require('../../../../icons/vehicle.png')}
            cardCount={this.props.dashBoardReducer.vehiclesCount}
            //cardCount={this.state.vehiclesCount}
            marginTop={20}
            backgroundColor={base.theme.colors.cardBackground}
            textFontSize={Platform.OS === 'ios' ? 8 : 12}

            onCardClick={() =>
              dropdown.length === 0
                ? this.props.navigation.navigate('CreateOrJoinScreen')
                : dropdown1.length === 0
                  ? alert('Unit is not available')
                  : this.props.navigation.navigate('MyVehicleListScreen')
            }
          />
          <CardView
            height={'100%'}
            width={'25%'}
            cardText={'Visitors'}
            cardIcon={require('../../../../icons/view_all_visitors.png')}
            marginTop={20}
            iconWidth={Platform.OS === 'ios' ? hp('5') : 35}
            iconHeight={Platform.OS === 'ios' ? hp('5') : 20}
            iconBorderRadius={0}
            backgroundColor={base.theme.colors.cardBackground}
            textFontSize={Platform.OS === 'ios' ? 8 : 12}

            onCardClick={() => this.goToFirstTab()}
          />
        </View>
        {/*<View style={Style.elevatedViewSub}>
           <CardView
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
                    />
        </View>*/}
        <ElevatedView elevation={5} style={Style.invoiceCardView}>
                    <View style={Style.invoiceHeadingView}>
                        <Text style={Style.invoiceText}>Invoices</Text>
                      {invoiceList.length > 0?
                        <TouchableOpacity style={{}} onPress={()=>this.props.navigation.navigate('ViewInvoiceList')}>

                          <Text style={Style.viewMoreText}>View more</Text>

                        </TouchableOpacity>
                          :
                          <View/>}
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



      </View>
    );
  }

  async getInvoiceMethodsList() {

    let stat = await base.services.OyeLivingApi.getTheInvoicesOfResident(this.props.dashBoardReducer.assId,
        this.props.dashBoardReducer.uniID,this.props.userReducer.MyAccountID)
    console.log('RESPONSE_INVOICES_RESIDENT',stat)
    try {
      if (stat.success) {
        let invoicesList=stat.data.invoices;
        this.setState({
          invoicesList:invoicesList
        })

    }} catch (error) {

      console.log('error', error)
    }
  }

  listOfInvoices(item) {
    console.log('FLATLIST_ITEM_INVOICES',item)
    return (
        <TouchableHighlight underlayColor={'transparent'} onPress={()=>this.props.navigation.navigate('ViewInvoice',{item:item})}>
          <View style={Style.invoiceView}>
            <View style={Style.invoiceSubView}>
              <Text style={Style.invoiceNumberText}>
                Invoice No. {item.item.inNumber}
              </Text>
              <Text style={Style.billText}>
                <Text style={Style.rupeeIcon}>{'\u20B9'}</Text>
                {item.item.inTotVal}
              </Text>
            </View>
            <View style={Style.invoiceSubView}>
              <Text style={Style.dueDate}>Invoice Date {moment(item.item.inGenDate,'YYYY-MM-DD').format('DD-MMM-YYYY')}</Text>
{/*
              <Text style={Style.dueDate}>Due on. {moment(item.item.inGenDate,'YYYY-MM-DD').format('DD-MMM-YYYY')}</Text>
*/}
              <OSButton
                  height={'80%'}
                  width={'25%'}
                  borderRadius={15}
                  oSBBackground={
                    item.item.inPaid === 'Yes'
                        ? base.theme.colors.grey
                        : base.theme.colors.primary
                  }
                  oSBText={item.item.inPaid === 'Yes' ? 'Paid' : 'Pay Now'}
                  oSBTextSize={11}
              />
            </View>
          </View>
        </TouchableHighlight>
    );
  }

  selectSOS() {
    this.setState({
      isSOSSelected: !this.state.isSOSSelected
    });
  }

  adminCard() {
    const AnimatedTouchable = Animatable.createAnimatableComponent(
      TouchableOpacity
    );
    return (
      <ElevatedView elevation={0} style={Style.mainElevatedView}>
        <AnimatedTouchable
          animation={'wobble'}
          delay={1000}
          duration={1000}
          onPress={() => this.props.navigation.navigate('Announcement')
          }
        >
          <View
            style={{
              alignItems: 'flex-end'
            }}
          >
            <Image
              style={{
                width: hp('5%'),
                height: hp('5%'),
                marginRight: hp('2%')
              }}
              source={require('../../../../icons/announcement.png')}
            />
            {/*  */}
          </View>
        </AnimatedTouchable>
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

        <View style={{ ...Style.elevatedView, marginTop: hp('3%') }}>
          <CardView
            height={'100%'}
            width={'25%'}
            cardText={'Roles'}
            cardIcon={require('../../../../icons/role.png')}
            marginTop={20}
            iconWidth={Platform.OS === 'ios' ? hp('5') : 35}
            iconHeight={Platform.OS === 'ios' ? hp('5') : 20}
            textFontSize={Platform.OS === 'ios' ? 8 : 12}
            onCardClick={() =>
              this.props.navigation.navigate('ViewmembersScreen')
            }
            backgroundColor={base.theme.colors.cardBackground}
          />
          <CardView
            height={'100%'}
            width={'25%'}
            cardText={'Visitors'}
            iconWidth={Platform.OS === 'ios' ? hp('5') : 35}
            iconHeight={Platform.OS === 'ios' ? hp('5') : 20}
            textFontSize={Platform.OS === 'ios' ? 8 : 12}
            cardIcon={require('../../../../icons/view_all_visitors.png')}
            marginTop={20}
            backgroundColor={base.theme.colors.cardBackground}
            onCardClick={() =>
              this.props.navigation.navigate('ViewAlllVisitorsPage')
            }
          />
          <CardView
            height={'100%'}
            width={'25%'}
            cardText={'Patrolling'}
            cardIcon={require('../../../../icons/patrolling.png')}
            marginTop={20}
            iconWidth={Platform.OS === 'ios' ? hp('5') : 35}
            iconHeight={Platform.OS === 'ios' ? hp('5') : 20}
            textFontSize={Platform.OS === 'ios' ? 8 : 12}
            iconBorderRadius={0}
            backgroundColor={base.theme.colors.cardBackground}
            onCardClick={() =>
              this.props.navigation.navigate('schedulePatrolling')
            }
          />
        </View>
        <View style={{ ...Style.elevatedView, marginTop: 20 }}>

          <CardView
            height={'100%'}
            width={'25%'}
            cardText={'Accounting'}
            iconWidth={Platform.OS === 'ios' ? 40 : 25}
            iconHeight={Platform.OS === 'ios' ? 40 : 20}
            cardIcon={require('../../../../icons/vehicle.png')}
            marginTop={20}
            backgroundColor={base.theme.colors.cardBackground}
            // onCardClick={() => this.props.navigation.navigate('oyeLiving')}
            onCardClick={() => this.props.navigation.navigate('Accounting')}
          />
          {/* <CardView
            height={'100%'}
            width={'25%'}
            cardText={'Subscription'}
            cardIcon={require('../../../../icons/subscription_management.png')}
            marginTop={20}
            iconWidth={Platform.OS === 'ios' ? 40 : 35}
            iconHeight={Platform.OS == = 'ios' ? 40 : 20}
            onCardClick={() =>
              this.props.navigation.navigate('subscriptionManagement')
            }
            backgroundColor={base.theme.colors.cardBackground}
          />
           <CardView
            height={'100%'}
            width={'25%'}
            cardText={'Accounting'}
            iconWidth={Platform.OS === 'ios' ? 40 : 25}
            iconHeight={Platform.OS === 'ios' ? 40 : 20}
            cardIcon={require('../../../../icons/vehicle.png')}
            marginTop={20}
            backgroundColor={base.theme.colors.cardBackground}
            onCardClick={() => this.props.navigation.navigate('oyeLiving')}
           // onCardClick={() => this.props.navigation.navigate('Accounting')}
          />
            {/* <CardView
            height={'100%'}
            width={'25%'}
            cardText={'Reports'}
            cardIcon={require('../../../../icons/reports.png')}
            marginTop={20}
            iconWidth={Platform.OS === 'ios' ? 40 : 35}
            iconHeight={Platform.OS === 'ios' ? 40 : 20}
            iconBorderRadius={0}
            backgroundColor={base.theme.colors.cardBackground}
            onCardClick={() => this.props.navigation.navigate('reportsTab')}
          /> */}
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center'
          }}
        >
          {/* <Button
                bordered
                style={styles.button1}
                onPress={() => this.props.navigation.navigate('ViewmembersScreen')}
            >
              <Text>Role Management</Text>
            </Button> */}

          {/* <Button
                bordered
                style={styles.button1}
                onPress={() =>
                    this.props.navigation.navigate('ViewAlllVisitorsPage')
                }
            >
              <Text>View All Visitors</Text>
            </Button> */}
          {/* <Button
                bordered
                style={styles.button1}
                onPress={() => this.props.navigation.navigate('schedulePatrolling')}
            >
              <Text>Patrolling</Text>
            </Button> */}
          {/* <Button
                bordered
                style={styles.button1}
                onPress={() =>
                    this.props.navigation.navigate('subscriptionManagement')
                }
            >
              <Text>Subscription</Text>
            </Button> */}
          {/* <Button
                bordered
                style={styles.button1}
                onPress={() => this.props.navigation.navigate("oyeLiving")}
            >
              <Text>Accounting</Text>
            </Button> */}
          {/* <Button
              bordered
              style={styles.button1}
              onPress={() => this.props.navigation.navigate("reportsTab")}
          >
            <Text>Reports</Text>
          </Button> */}

          {/* <AnimatedTouchable
            animation={'swing'}
            onPress={() => this.props.navigation.navigate('Announcement')}
          >
          <Image source={require('../../../../icons/add.png')}/>
          </AnimatedTouchable> */}
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



  myUnit() { }

  goToFirstTab() {
    const { dropdown, dropdown1 } = this.props;
    dropdown.length === 0
      ? this.props.navigation.navigate('CreateOrJoinScreen')
      : dropdown1.length === 0
        ? alert('Unit is not available')
        : this.props.navigation.navigate('firstTab');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    paddingLeft: hp('0.7%')
  },
  progress: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  button1: {
    width: hp('30%'),
    justifyContent: 'center',
    marginBottom: hp('2%')
  },
  card: {
    borderBottomWidth: 1,
    flexDirection: 'column',
    width: Dimensions.get('window').width / 4 - 10,
    height: hp('9%'),
    alignItems: 'center'
  },
  cardItem: {
    flexDirection: 'column',
    borderColor: 'orange',
    borderWidth: hp('10%')
    // borderBottomWidth:30,
  },
  textWrapper: {
    height: hp('85%'), // 70% of height device screen
    width: wp('97%') // 80% of width device screen
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: hp('3%')
  },
  image1: {
    width: wp('6%'),
    height: hp('3%'),
    marginRight: 10,
    justifyContent: 'space-between'
  },
  image2: {
    height: hp('2%'),
    width: hp('2%'),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: hp('2.4%'),
    marginTop: hp('2.4%')
  },
  text1: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 5,
    color: '#FF8C00',
    marginBottom: hp('2.4%'),
    marginTop: hp('2.4%')
  },
  text2: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    color: '#FF8C00',
    marginBottom: hp('2.4%'),
    marginTop: hp('2.4%')
  },
  text3: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
    color: '#45B591',
    marginBottom: hp('2.4%'),
    marginTop: hp('2.4%')
  },
  text4: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    color: '#45B591',
    marginBottom: hp('2.4%'),
    marginTop: hp('2.4%')
  },
  image3: {
    height: hp('2%'),
    width: hp('2%'),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: hp('2.4%'),
    marginTop: hp('2.4%')
  },
  image4: {
    width: wp('5%'),
    height: hp('2%'),
    justifyContent: 'flex-start',
    marginLeft: hp('1%'),
    marginRight: hp('1%')
  },
  view1: {
    flexDirection: 'row',
    margin: hp('0.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    height: hp('12%')
  },
  view2: {
    borderWidth: hp('0.8%'),
    borderBottomEndRadius: hp('0.8%'),
    borderBottomStartRadius: hp('0.8%'),
    borderColor: 'orange',
    width: Dimensions.get('window').width / 4 - 10,
    marginTop: hp('0.8%')
  },
  card1: {
    height: hp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff6e5',
    marginBottom: hp('2%')
  },
  gauge: {
    position: 'absolute',
    width: wp('40%'),
    height: hp('22%'),
    alignItems: 'center',
    justifyContent: 'center'
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
    allAssociations: state.DashboardReducer.allAssociations,
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
