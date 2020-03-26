import axios from 'axios';
import * as fb from 'firebase';
import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { Alert, BackHandler, Dimensions, FlatList, Image, ImageBackground, Linking, Platform, ScrollView, StyleSheet, Text, ToastAndroid, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import * as Animatable from 'react-native-animatable';
import CountdownCircle from 'react-native-countdown-circle';
import DeviceInfo from 'react-native-device-info';
import ElevatedView from 'react-native-elevated-view';
import firebase from 'react-native-firebase';
import { Dropdown } from 'react-native-material-dropdown';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import ProgressLoader from 'rn-progress-loader';
import {fetchAssociationByAccountId,
        updateNotificationData,
        updateUnitDropdown, 
        createNotification, 
        createUserNotification,
        getAssoMembers, 
        getDashAssociation,
        getDashAssoSync, 
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
        updateuserRole ,
        updatePopUpNotification
      } from '../../../actions';
import IcoMoonConfig from '../../../assets/selection.json';
import base from '../../../base';
import CardView from '../../../components/cardView/CardView';
import OSButton from '../../../components/osButton/OSButton';
import Style from './Style';

let counter = 0;
var associationLoaded = false;
class Dashboard extends React.Component {
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
      invoicesList: [],
      dropdownIndex:0,
      unitDropdownIndex:0


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


  updateAllTheData(){
    const { MyAccountID } = this.props.userReducer;
    const { oyeURL } = this.props.oyespaceReducer;

    let self = this;
    const { fetchAssociationByAccountId }=self.props
    fetchAssociationByAccountId(oyeURL, MyAccountID,function(data){
      console.log('HERE DATA TO DISPLAY',data,self.props)
      if(data){
        self.requestNotifPermission();
        self.myProfileNet();
        self.props.getNotifications(oyeURL, MyAccountID);
        self.listenRoleChange();
         self.getVehicleList(); 
        self.listenToFirebase(self.props.dropdown);
        self.setState({isLoading:false});
       // self.getPopUpNotifications();
        self.createTopicListener(self.props.dropdown,true)
      }
      else{
        self.myProfileNet();
        self.setState({isLoading:false})
        self.props.navigation.navigate('CreateOrJoinScreen');
      
      }
    })
  }

  

  async componentDidMount() {

    const { MyAccountID } = this.props.userReducer;
    const { oyeURL } = this.props.oyespaceReducer;
    const {updateNotificationData} = this.props;

    let self = this;
    self.setState({isLoading:true});
    updateNotificationData(false);
    self.props.fetchAssociationByAccountId(oyeURL, MyAccountID,function(data){
      console.log('HERE DATA TO DISPLAY',data,self.props)
      if(data){
        self.requestNotifPermission();
        self.myProfileNet();
        self.listenRoleChange();
        self.props.getNotifications(oyeURL, MyAccountID);
        self.getVehicleList(); 
        self.listenToFirebase(self.props.dropdown);
        self.setState({isLoading:false});
        self.getPopUpNotifications();
        self.createTopicListener(self.props.dropdown,true)
      }
      else{
        self.myProfileNet();
        self.setState({isLoading:false})
        self.props.navigation.navigate('CreateOrJoinScreen');
      
      }
    })

    console.log("this.props.dropdown.length:111111111",self.props.dropdown.length,self.props.dropdown)

    this.focusListener = self.props.navigation.addListener('didFocus', () => {
      this.setState({ isSOSSelected: false });
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
      const unsubscribe = NetInfo.addEventListener(state => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        self.setState({
            isConnected:state.isConnected
        })
    });
  }


  async getPopUpNotifications(){
    let self = this;
    const { MyAccountID } = self.props.userReducer;
    const {updatePopUpNotification,updateNotificationData} = self.props;

    let options = {
      method:"get",
      //url:` http://apiuat.oyespace.com/oyesafe/api/v1/Notification/GetNotificationsAsPopup/${MyAccountID}`,
      url:` http://apiuat.oyespace.com/oyesafe/api/v1/Notification/GetNotificationsAsPopup/6437`,
      headers:{
        "X-OYE247-APIKey":"7470AD35-D51C-42AC-BC21-F45685805BBE"
      }
    };

    axios(options).then((response)=>{
      try{
        let sResp = response.data.data.popupNotifications;
        console.log('Data received in data notification pop up fetch:',sResp);
      if(sResp.length !== 0){
        updatePopUpNotification(sResp);
        updateNotificationData(true);
        firebase.notifications().removeAllDeliveredNotifications()
      }else{
        updatePopUpNotification([]);
        updateNotificationData(false);
        firebase.notifications().removeAllDeliveredNotifications()
      }
      }catch(e){
        console.log(e)
      }
      
      
  })
}


  

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.backButtonListener.remove();
   // this.focusListener.remove();
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
      const {updateNotificationData} = this.props;
    }
  }

  listenRoleChange() {
    const { MyAccountID, dropdown } = this.props;
    const {oyeURL} = this.props.oyespaceReducer;
    let path = 'rolechange/' + MyAccountID;
    let roleRef = base.services.frtdbservice.ref(path);
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
          //self.roleCheckForAdmin(self.state.assocId)
          const { fetchAssociationByAccountId }=self.props
          fetchAssociationByAccountId(oyeURL,MyAccountID,()=>{
            self.onAssociationChange(self.state.dropdownIndex,self.state.unitDropdownIndex);
          });
        } else {
          counter = 1;
        }
      } catch (er) {
        console.log('ROLE_CHANGE_FRTDB_ERR', er);
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state)
    );
  }

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
      oyeURL,
      dropdown
    } = this.props;
    console.log("Dashboard reducer Data in Request Notification Permission:", this.props.dashBoardReducer, receiveNotifications);
    dropdown.map(units => {
      if (receiveNotifications) {
        console.log("Listening to firebase:",units)
        let unitArr = units.unit;
        for(let i in unitArr){
          console.log("Listening to firebase Unit:",unitArr[i]);
          firebase
          .messaging()
          .subscribeToTopic(
            '' + MyAccountID + unitArr[i].unUnitID + 'usernotif'
          );
        }
        console.log('date_asAssnID', units.associationId);
        console.log("UNSUBSCRIBING_FROM: " + MyAccountID + 'admin')
        firebase
          .messaging()
          .unsubscribeFromTopic(MyAccountID + 'admin');
        firebase
          .messaging()
          .unsubscribeFromTopic('14948admin');
        firebase.messaging().subscribeToTopic(MyAccountID + 'admin');

        firebase
          .messaging()
          .subscribeToTopic(units.associationId + 'Announcement');

        if (units.roleId === 2 || units.roleId === 3) {
        } else if (units.roleId === 1) {
          console.log("Listening to firebase Subscribing to:",units.associationId+'admin')
          firebase.messaging().subscribeToTopic(units.associationId + 'admin');
          // if (units.meIsActive) {
            
          //   firebase.messaging().subscribeToTopic(units.associationId + 'admin');
          //  }
        }
      } else if (!receiveNotifications) {
        firebase.messaging().unsubscribeFromTopic(MyAccountID + 'admin');
        firebase.messaging().unsubscribeFromTopic(units.associationId + 'admin');
      }
    });
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log("Listening to firebase:Listening to firebase:",enabled,receiveNotifications)
          if (receiveNotifications) {
            this.listenForNotif();
          }
        } else {
          firebase
            .messaging()
            .requestPermission()
            .then(() => {
              if (receiveNotifications) {
                this.listenForNotif();
              }
            })
            .catch(error => {
            });
        }
      });

         
        this.roleCheckForAdmin()
  };

  showLocalNotification = notification => {
    try {
      const channel = new firebase.notifications.Android.Channel(
        'channel_id',
        'Oyespace',
        firebase.notifications.Android.Importance.Max


      ).setDescription('Oyespace channel')
        .setSound('oye_msg_tone.mp3');
      channel.enableLights(true);
      firebase.notifications().android.createChannel(channel);




      const notificationBuild = new firebase.notifications.Notification({
        show_in_foreground: true,
        show_in_background: true,
      });

      notificationBuild
        .setTitle(notification._title)
        .setBody(notification._body)
        .setNotificationId(notification._notificationId)
        .setSound('oye_msg_tone.mp3')
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
        .android.setPriority(firebase.notifications.Android.Priority.Max);

      firebase.notifications().displayNotification(notificationBuild);
      // const {updateNotificationData} = this.props;
      // updateNotificationData(true);
      this.setState({ foregroundNotif: notification._data });
    } catch (e) {
      console.log('FAILED_NOTIF');
    }
  };


  listenForNotif = async () => {
    console.log('HEY IT IS GOING HERE IN GATE APP NOTIFICATION2222222',Notification.permission,this.notificationDisplayedListener);

    if (
      this.notificationDisplayedListener == undefined ||
      this.notificationDisplayedListener == null
    ) {
      let navigationInstance = this.props.navigation;

      this.notificationDisplayedListener = firebase
        .notifications()
        .onNotificationDisplayed(notification => {
           console.log("HEY IT IS GOING HERE IN GATE APP NOTIFICATION2222222",notification);
          // console.log('____________')
          // Process your notification as required
          // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });

        console.log("HEY IT IS GOING HERE IN GATE APP NOTIFICATION2222222:",this.notificationDisplayedListener);

      this.notificationListener = firebase
        .notifications()
        .onNotification(notification => {
          console.log('___________');
          console.log("NOTIFICATION@@@@", notification);
          console.log('NOTIFICATION@@@@____________', notification.data.unitName, notification.data.associationID, notification.data.associationName);

          //  this.changeTheAssociation(notification.data.associationName,notification.data.associationID,)

          if (notification._data.associationID) {
            // this.props.createNotification(notification._data, navigationInstance, false)
          }

          console.log('HEY IT IS GOING HERE IN GATE APP NOTIFICATION111111')
          const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
          const { oyeURL } = this.props.oyespaceReducer;
         // this.updateAllTheData()
          const { fetchAssociationByAccountId }= this.props;
          fetchAssociationByAccountId(this.props.oyeURL,this.props.MyAccountID,()=>{
            this.onAssociationChange(this.state.dropdownIndex,this.state.unitDropdownIndex);
          });
          this.props.getNotifications(oyeURL, MyAccountID);
          this.showLocalNotification(notification);
        });  

      firebase.notifications().onNotificationOpened(notificationOpen => {
        const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
        const { oyeURL } = this.props.oyespaceReducer;
        let details = notificationOpen.notification._data;
        console.log("NOTIFICATION@@@@_______12344", notificationOpen);
        if (notificationOpen.notification._data.admin === 'true') {
          if (notificationOpen.action) {
          }
        } else if (notificationOpen.notification._data.admin === 'false') {
          this.props.refreshNotifications(oyeURL, MyAccountID);
        }

        if (notificationOpen.notification._data.admin === 'true') {
          this.props.refreshNotifications(oyeURL, MyAccountID);
          if (notificationOpen.notification._data.foreground) {
          }
        } else if (notificationOpen.notification._data.admin === 'gate_app') {
          this.props.refreshNotifications(oyeURL, MyAccountID);
        } else if (notificationOpen.notification._data.admin === 'false') {
        }
        if (notificationOpen.notification.data.ntType === "Join") {
          this.changeTheAssociation(notificationOpen.notification.data.associationName, notificationOpen.notification.data.associationID,
            notificationOpen.notification.data.sbUnitID, notificationOpen.notification.data.unitName)
        }
        this.readFBRTB(true);
        this.getPopUpNotifications();
        firebase.notifications().removeAllDeliveredNotifications();
      });
    }
  };

  handleConnectivityChange = isConnected => {
    console.log('CONNECTION DATA', isConnected)
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  async roleCheckForAdmin(index) {
    let self = this;
    console.log("Data:",self.props,self.props.dropdown)
    let data = self.props.dropdown[0];
    self.checkUserRole(data);
    
  }



  listenToFirebase(userAssociation) {
    console.log("User Association", userAssociation)
    let self = this;
    for (let i in userAssociation) {
      let associationId = userAssociation[i].associationId;
      let associationPath = `syncdashboard/isAssociationRefreshing/${associationId}`;
      let countPath = `syncdashboard/isCountRefreshing/${associationId}`
      console.log("Log of association listener:", associationId)
      fb.database().ref(associationPath).on('value', function (snapshot) {
        let receivedData = snapshot.val();
        console.log("Received Data in dashboard:", receivedData);
        if (receivedData !== null) {
          console.log("Update Notification List Now1111")
          self.updateDashboard();
        }
      })
      fb.database().ref(countPath).on('value', function (snapshot) {
        let receivedData = snapshot.val();
        console.log("Received Data in dashboard:", receivedData);
        if (receivedData !== null) {
          console.log("Update Notification List Now")
          self.updateDashboardCount();
        }
      })
    }
  }


  updateDashboardCount() {
    console.log("HItting Here ______________________________________IN dashboard count")
    this.getVehicleList()
  }

  updateDashboard() {
    console.log("Update Dashboard Changes if any------------------------------------>>>>>>>>>>>")
    const{ fetchAssociationByAccountId } =this.props
    fetchAssociationByAccountId(this.props.oyeURL,this.props.MyAccountID,()=>{
      this.onAssociationChange(this.state.dropdownIndex,this.state.unitDropdownIndex);
    });
    let self=this;
    self.props.getNotifications(self.props.oyeURL, self.props.MyAccountID);
   
     }

  async getVehicleList() {
    let self = this;
    // assId:state.DashboardReducer.assId ,
    //uniID: state.DashboardReducer.uniID,
    let associationId = self.props.assId;
    let accountId = self.props.userReducer.MyAccountID;
    let unitId = self.props.uniID;
    console.log('HItting Here ______________________________________IN dashboard count', self.props,associationId, accountId, unitId, self.props.oyeURL)
    fetch(
      `https://${self.props.oyeURL}/oyesafe/api/v1/GetFamilyMemberVehicleCountByAssocAcntUnitID/${associationId}/${accountId}/${unitId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
        }
      }
    ).then(response => 
      response.json())
      .then((responseJson) => {
        console.log("HItting Here ______________________________________IN dashboard count123:", responseJson)
        self.setState({
          vehiclesCount: responseJson.data.vehicleCount+1,
          falmilyMemebCount: responseJson.data.familyMemberCount+1
        });
        const { updateIdDashboard } = this.props;
        updateIdDashboard({
          prop: 'vehiclesCount',
          value: responseJson.data.vehicleCount
        });
        updateIdDashboard({
          prop: 'familyMemberCount',
          value: responseJson.data.familyMemberCount
        });
      })
      .catch(error => {
        console.log("HItting Here ______________________________________IN dashboard count1234:", error)
        updateIdDashboard({
          prop: 'vehiclesCount',
          value: 0
        });
        updateIdDashboard({
          prop: 'familyMemberCount',
          value: 0
        });
      })

  }

 


  changeTheAssociation = (value, assId, unitId, unitName) => {

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

    console.log('Ass index', value, assId, dropdown1, dropdown);
    const { MyAccountID, SelectedAssociationID } = this.props.userReducer;
    const { oyeURL } = this.props.oyespaceReducer;
    this.setState({ assocId: assId });

    // getDashUnits(
    //   assId,
    //   oyeURL,
    //   MyAccountID,
    //   dropdown,
    //   assId,
    //   dropdown1,
    // );

    const { updateIdDashboard } = this.props;
    console.log('updateIdDashboard1', this.props);
    

  

    updateIdDashboard({
      prop: 'uniID',
      value: unitId
    });
    updateIdDashboard({
      prop: 'assId',
      value: assId
    });

    // updateUserInfo({
    //   prop: 'SelectedAssociationID',
    //   value: assId
    // });

    updateSelectedDropDown({
      prop: 'selectedDropdown',
      value: value
    });

    // updateSelectedDropDown({
    //   prop: 'assId',
    //   value: assId
    // });
    // updateUserInfo({
    //   prop: 'SelectedUnitID',
    //   value: unitId
    // });
    // updateIdDashboard({
    //   prop: 'uniID',
    //   value: unitId
    // });
    // updateSelectedDropDown({
    //   prop: 'uniID',
    //   value: unitId
    // });

    updateSelectedDropDown({
      prop: 'selectedDropdown1',
      value: unitName
    });

    console.log('THISPOPPPPPPPP', this.props)

    this.roleCheckForAdmin(assId);
  };

  onAssociationChange = (index,unitIndex) => {
try{
    console.log('GettheselectedAssocitation',  index, this.props.dropdown,unitIndex)

    const { updateUserInfo, dropdown, updateSelectedDropDown, updateUnitDropdown, updateIdDashboard } = this.props;

    this.setState({ assocId: dropdown[index].associationId,dropdownIndex:index });

    console.log('updateIdDashboard1', this.props);
    updateIdDashboard({
      prop: 'assId',
      value: dropdown[index].associationId
    });
    updateIdDashboard({
      prop: 'uniID',
      value: dropdown[index].unit.length === 0 ? "" : dropdown[index].unit[unitIndex].unitId
    });
  

    // updateUserInfo({
    //   prop: 'SelectedAssociationID',
    //   value: dropdown[index].associationId
    // });

    updateSelectedDropDown({
      prop: 'selectedDropdown',
      value: dropdown[index].value
    });

    // updateSelectedDropDown({
    //   prop: 'assId',
    //   value: dropdown[index].associationId
    // });

    updateSelectedDropDown({
      prop: "selectedDropdown1",
      value: dropdown[index].unit.length === 0 ? "" : dropdown[index].unit[0].value
    });

    // updateSelectedDropDown({
    //   prop: "unitID",
    //   value: dropdown[index].unit.length === 0 ? "" : dropdown[index].unit[0].unitId
    // });

    updateUnitDropdown({
      value: dropdown[index].unit,
      associationId: dropdown[index].associationId
    })
  base.utils.validate.checkSubscription(dropdown[index].associationId);
    
  updateUserInfo({
      prop: 'MyOYEMemberID',
      value: dropdown[index].memberId
    });
    updateUserInfo({
      prop: 'SelectedMemberID',
      value: dropdown[index].memberId
    });

    dropdown[index].unit.length === 0 ? "" : this.getVehicleList()
    this.checkUserRole(dropdown[index])
    this.setView(0)
  }catch(e){
    alert("err")
  }
  };


  async checkUserRole(data) {
    const { updateuserRole, updateIdDashboard } = this.props;
    console.log("GettheselectedAssocitation1", data);
    let assId = (data.associationId).toString();
    if (data.roleId === 1 && data.unit.length !==0) {
      let assId = (data.associationId).toString();
      await base.utils.storage.storeData('ADMIN_NOTIF' + assId, assId);
      firebase.messaging().subscribeToTopic(assId)
    } else {
      await base.utils.storage.removeData('ADMIN_NOTIF' + assId);
      firebase.messaging().unsubscribeFromTopic(assId)
    }
    this.setState({
      role: data.roleId
    })

    updateuserRole({
      prop: "role",
      value:data.unit.length === 0?5: data.roleId
    })

    updateIdDashboard({
      prop: "roleId",
      value:data.unit.length === 0?5: data.roleId
    })



  }

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
      this.listenToFirebase(this.props.dropdown);
      this.getVehicleList();
    }
  }

  async getUnitListByAssoc() {
    let self = this;

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
          isDataVisible: true
        });
        self.readFBRTB(false);
        console.log('updateIdDashboard3', this.props);
        self.roleCheckForAdmin(this.state.assocId);
      }
    } catch (error) {
      base.utils.logger.log(error);
    }
  }

  myProfileNet = async () => {
    console.log('AccId@@@@@', this.props);
    let response = await base.services.OyeLivingApi.getProfileFromAccount(
      this.props.userReducer.MyAccountID
    );
    console.log('COMINGHERE_FirstCall', response);
    const { updateUserInfo } = this.props;
    

    updateUserInfo({
      prop: 'userData',
      value: response
    });
    updateUserInfo({
      prop: 'userProfilePic',
      value: response.data.account[0].acImgName
    });
    updateUserInfo({
      prop: 'userQRCode',
      value: response.data.account[0].acisdCode +
      response.data.account[0].acMobile +
      ';'
    });
    
  };


  logMeasurement = async (id, phase, actualDuration, baseDuration) => {
    // see output during DEV
    if (__DEV__) console.log({ id, phase, actualDuration, baseDuration });
  };


  createTopicListener(associationList, _switch) {
    console.log("HEY IT IS GOING HERE IN GATE APP NOTIFICATION2222222:",associationList,_switch,firebase.messaging().hasPermission())
    if (associationList != undefined && associationList.length > 0) {
      try {
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
        let assnList = _.filter(associationList, item => item.unUniName != "");
        for (unit of assnList) {
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
            right: Platform.OS === 'ios' ? hp('1') : hp('2.5'),
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
      updateUserInfo,
      updateDropDownIndex,
      selectedDropdown,
      selectedDropdown1,
      updateSelectedDropDown,
      updateIdDashboard
    } = this.props;
    let maxLen = 23;
    let maxLenUnit = 10;

    console.log("vehiclesCount ", this.props.dashBoardReducer.role, dropdown1.length, selectedView);

    let isAdmin = this.props.dashBoardReducer.role === 1 ? true : false
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
        <View style={{ height: '100%', width: '100%' ,backgroundColor:'white'}}>
          {/* <NavigationEvents onDidFocus={() => this.requestNotifPermission()} /> */}
          {!this.props.isLoading?
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
                      onChangeText={(value, index) => {
                        this.onAssociationChange(index,this.state.unitDropdownIndex);
                        this.props.updateuserRole({
                          prop: 'role',
                          value: dropdown[index].roleId
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
                       
                        updateIdDashboard({
                          prop: 'uniID',
                          value: dropdown1[index].unitId
                        });
                        updateSelectedDropDown({
                          prop: 'selectedDropdown1',
                          value: dropdown1[index].value
                        });
                        this.setState({
                          unitDropdownIndex:index
                        })
                        this.getVehicleList();
                        //    this.updateUnit(value, index);
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
                    <View style={{ flexDirection: 'column', bottom: Platform.OS === 'ios' ? hp('2') : hp('2'), justifyContent: 'center', width: wp('25'), alignSelf: 'center', borderWidth: 0, alignItems: 'center' }}>
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
                  {isAdmin ?
                    <TouchableHighlight
                      underlayColor={'transparent'}
                      onPress={() => this.setView(1)}>
                      <View style={{ flexDirection: 'column', bottom: Platform.OS === 'ios' ? hp('2') : hp('2'), justifyContent: 'center', width: wp('35'), alignSelf: 'center', borderWidth: 0, alignItems: 'center', left: hp('5') }}>
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
                    <View />}
                </View>
              </ImageBackground>

              <View style={{
                height: '6%',
                width: '100%',
                alignItems: 'center',
                backgroundColor: base.theme.colors.white,
                borderColor: base.theme.colors.primary,
                borderWidth: 0,
                position: 'absolute',
                 //marginBottom: hp('5'),
                justifyContent: 'flex-start',
                top: hp('77'),
                flexDirection: 'row'
              }}>

                <View style={{ borderWidth: 0 }}>
                  <Image
                    resizeMode={'cover'}
                    style={{
                      height: hp('10'),
                      width: wp('55'),
                      alignSelf: 'flex-start',
                      borderWidth: 0
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
           :<View/>}
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

  changeToUnit(){
    this.setState({
      isLoading:false
    })
    this.props.navigation.navigate('CreateOrJoinScreen')
  }

  myUnitCard() {
    const { dropdown, dropdown1 } = this.props;
    const { updateIdDashboard } = this.props;
    //this.state.invoicesList
    let invoiceList = this.state.invoicesList;
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
                ? this.changeToNewUnit()
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
            marginTop={20}
            backgroundColor={base.theme.colors.cardBackground}
            textFontSize={Platform.OS === 'ios' ? 8 : 12}

            onCardClick={() =>
              dropdown.length === 0
                ? this.changeToNewUnit()
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

        <ElevatedView elevation={5} style={Style.invoiceCardView}>
          <View style={Style.invoiceHeadingView}>
            <Text style={Style.invoiceText}>Invoices</Text>
            {invoiceList.length > 0 ?
              <TouchableOpacity style={{}} onPress={() => this.props.navigation.navigate('ViewInvoiceList')}>

                <Text style={Style.viewMoreText}>View more</Text>

              </TouchableOpacity>
              :
              <View />}
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
      this.props.dashBoardReducer.uniID, this.props.userReducer.MyAccountID)
    console.log('RESPONSE_INVOICES_RESIDENT', stat)
    try {
      if (stat.success) {
        let invoicesList = stat.data.invoices;
        this.setState({
          invoicesList: invoicesList
        })

      }
    } catch (error) {

      console.log('error', error)
    }
  }

  listOfInvoices(item) {
    console.log('FLATLIST_ITEM_INVOICES', item)
    return (
      <TouchableHighlight underlayColor={'transparent'} onPress={() => this.props.navigation.navigate('ViewInvoice', { item: item })}>
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
            <Text style={Style.dueDate}>Invoice Date {moment(item.item.inGenDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')}</Text>
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
            onCardClick={() => this.props.navigation.navigate('Accounting')}
          />
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center'
          }}
        >
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
    dashBoardReducer: state.DashboardReducer,
    assId:state.DashboardReducer.assId ,
    uniID: state.DashboardReducer.uniID,
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
    getDashAssoSync,
    fetchAssociationByAccountId,
    updateUnitDropdown,
    updateNotificationData,
    updatePopUpNotification
  }
)(Dashboard);