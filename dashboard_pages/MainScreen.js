import React, { Component } from 'react';
import {
    StyleSheet, Platform, StatusBar, View, Text, Image, Picker, TextInput, Dimensions,
    TouchableOpacity, YellowBox, ScrollView, Alert,Button
} from 'react-native';
import { connect } from 'react-redux';
// import all basic components
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { withBadge } from 'react-native-elements';
import { DrawerNavigator, StackNavigator, createStackNavigator } from 'react-navigation';
import Pie from 'react-native-pie';
import { openDatabase } from 'react-native-sqlite-storage';
import { Fonts } from '../pages/src/utils/Fonts';
import { RemoteMessage, Notification } from 'react-native-firebase';
import RNExitApp from 'react-native-exit-app';
// import ProgressBarClassic from 'react-native-progress-bar-classic';
import moment from 'moment';
import { Dropdown } from 'react-native-material-dropdown';
import axios from 'axios';
import firebase from 'react-native-firebase';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { newNotifInstance, createNotification, getNotifications } from '../src/actions/NotificationAction';

console.disableYellowBox = true;
var db = openDatabase({ name: global.DB_NAME });
const radiusHeight = Dimensions.get('window').height / 8;
const boxHeight = (Dimensions.get('window').height / 4) + 50;
var date = new Date().getDate();
var month = new Date().getMonth() + 1;
var year = new Date().getFullYear();
var hour = new Date().getHours();
var salutation = 'Good Morning'

class MainScreen extends Component {
    static navigationOptions = {
        tabBarLabel: 'Main Screen',
        drawerIcon: ({tintColor}) => {
            return (
              <Image source={require('../pages/assets/images/OyeSpace.png')}
              style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
            );
        }
        
    }
    
    constructor(props) {
        super(props);

        this.onChangeText = this.onChangeText.bind(this);
        this.onUnitChange = this.onUnitChange.bind(this);

      //  this.typographyRef = this.updateRef.bind(this, 'typography');
       // this.unitDrpDwnRef = this.updateRef.bind(this, 'unitDrpDwn');

        this.state = {
            typography: global.SelectedAssociationID,
            stSelectedUnitID:global.SelectedUnitID,
            guard_tot_count: 0,
            guard_onduty_count: 0,
            units_tot_count: 0,
            units_occupied_count: 0,
            dataSourceAssnPkr: [],
            drop_down_data: [],
            AssnPickerValueHolder: '',
            dataSourceUnitPkr: [],
            stUnit_drop_down_data: [],
            dataSourceAttendance: [],
            dataSourceGuards: [],
            workerID: 0,
            UnitPickerValueHolder: '',
            SubscriptionValidity: '',
            lat: '',
            long: '',
            dataSource: null,
            progress: 60,
            progressWithOnComplete: 0,
            progressCustomized: 0,
            progress1: 40,
            foregroundNotif: null
        };

        increase = (key, value) => {
            this.setState({
              [key]: this.state[key] + value,
        });
    }

        db.transaction(tx => {

            tx.executeSql('SELECT Distinct M.AssociationID, A.AsnName FROM MyMembership M inner Join Association A on M.AssociationID=A.AssnID ', [], (tx, results) => {
                var temp = [];
                let drop_down_data_local = [];
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                    drop_down_data_local.push({ value: results.rows.item(i).AssociationID, label: results.rows.item(i).AsnName, }); // Create your array of data
                    console.log('Results AsnName ', results.rows.item(i).AsnName + ' ' + results.rows.item(i).AssociationID);
                    global.AssociationName = results.rows.item(0).AsnName;
                }
                this.setState({
                    dataSourceAssnPkr: temp,
                });
                this.setState({ drop_down_data: drop_down_data_local }); // Set 
            });
        });

        db.transaction(tx => {

            tx.executeSql('SELECT Distinct M.OYEUnitID, A.UnitName FROM MyMembership M inner Join OyeUnit A on M.OYEUnitID=A.UnitID and M.AssociationID=' + global.SelectedAssociationID, [], (tx, results) => {
                var temp = [];
                let unit_drop_down_data_local = [];
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                    unit_drop_down_data_local.push({ value: results.rows.item(i).OYEUnitID, label: results.rows.item(i).UnitName, }); // Create your array of data
                    
                    console.log('dataSourceUnitPkr UnitID ' + i, results.rows.item(i).UnitName + ' ' + results.rows.item(i).OYEUnitID);
                }
                this.setState({
                    dataSourceUnitPkr: temp,
                });
                this.setState({ stUnit_drop_down_data: unit_drop_down_data_local }); // Set 

            });
        });

        this.fnSet_After_Association_Selected();

        this.fnSet_MemberID_Role();
    }

    onChangeText(text) {
       // [ 'typography']
            // .map((name) => ({ name, ref: this[name] }))
            // .filter(({ ref }) => ref && ref.isFocused())
            // .forEach(({ name, ref }) => {
              //  this.setState({ [name]: text });
            // });
            this.setState({ typography: text });
            global.SelectedAssociationID = this.state.typography;
          //  global.AssociationName = this.state.dataSourceAssnPkr[index].AsnName;
            this.fnSet_After_Association_Selected();

    }

    onUnitChange(text) {
        // [ 'stSelectedUnitID', 'unitDrpDwn', 'typography']
            // .map((name) => ({ name, ref: this[name] }))
            // .filter(({ ref }) => ref && ref.isFocused())
            // .forEach(({ name, ref }) => {
                // this.setState({ stSelectedUnitID: text });
            // });
            this.setState({ stSelectedUnitID: text });
            global.SelectedUnitID = this.state.stSelectedUnitID;
            //  global.AssociationName = this.state.dataSourceAssnPkr[index].AsnName;
            //  this.fnSet_After_Association_Selected();

    }

    //updateRef(name, ref) {
      //  this[name] = ref;
    //}

    fnSet_After_Association_Selected() {

        db.transaction(tx => {

            tx.executeSql('SELECT Distinct M.OYEUnitID, A.UnitName FROM MyMembership M inner Join OyeUnit A on M.OYEUnitID=A.UnitID and M.AssociationID=' + global.SelectedAssociationID, [], (tx, results) => {
                var temp = [];
                let unit_drop_down_data_local = [];
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                    unit_drop_down_data_local.push({ value: results.rows.item(i).OYEUnitID, label: results.rows.item(i).UnitName, }); // Create your array of data
                    console.log('dataSourceUnitPkr UnitID', results.rows.item(i).UnitName + ' ' + results.rows.item(i).OYEUnitID);
                    global.AssociationUnitName = results.rows.item(0).UnitName;
                    global.SelectedUnitID = results.rows.item(0).OYEUnitID;
                    this.setState({ stSelectedUnitID: global.SelectedUnitID });
                }
                if (results.rows.length == 0) {
                    console.log('count dataSourceUnitPkr ', value + ' ' + value);
                    this.syncUnits(global.SelectedAssociationID);
                }
                this.setState({
                    dataSourceUnitPkr: temp,
                });
                this.setState({ stUnit_drop_down_data: unit_drop_down_data_local }); // Set 

            });
        });

        db.transaction(tx => {
            tx.executeSql('SELECT Distinct AttendanceID FROM Attendance where AssociationID=' + global.SelectedAssociationID, [], (tx, results) => {
                console.log('Results', results.rowsAffected);

                this.setState({
                    guard_onduty_count: results.rows.length,
                });
            });
        });

        db.transaction(tx => {
            tx.executeSql('SELECT Distinct WorkID FROM Workers where AssnID=' + global.SelectedAssociationID, [], (tx, results) => {
                console.log('Results', results.rowsAffected);

                this.setState({
                    guard_tot_count: results.rows.length,
                });
                if (results.rows.length > 0) {
                    this.setState({
                        workerID: results.rows.item(0).WorkID,
                    });
                }
            });
        });

        db.transaction(tx => {
            tx.executeSql('SELECT Distinct OwnerId FROM UnitOwner where OwnerAssnID=' + global.SelectedAssociationID, [], (tx, results) => {
                console.log('Results', results.rowsAffected);
                this.setState({
                    units_occupied_count: results.rows.length,
                });
            });
        });

        db.transaction(tx => {
            tx.executeSql('SELECT Distinct NofUnit FROM Association where AssnID=' + global.SelectedAssociationID, [], (tx, results) => {
                console.log('Results', results.rowsAffected);
                this.setState({
                    units_tot_count: results.rows.item(0).NofUnit,
                });
            });
        });

    }

    fnSet_MemberID_Role() {
        db.transaction(txMyMem => {
            txMyMem.executeSql('SELECT * FROM MyMembership where AssociationID=' + global.SelectedAssociationID + ' and OYEUnitID=' + global.SelectedUnitID, [], (txMyMem, resultsMyMem) => {
                console.log('MainScreen Results MyMembership ', resultsMyMem.rows.length + ' ');

                if (resultsMyMem.rows.length > 0) {
                    console.log('MainScreen Results MyMembership', resultsMyMem.rows.item(0).AssociationID + ' ' + resultsMyMem.rows.item(0).OYEUnitID + ' '
                        + resultsMyMem.rows.item(0).MobileNumber + ' ' + resultsMyMem.rows.item(0).OYEMemberRoleID + ' ');

                    for (let i = 0; i < resultsMyMem.rows.length; ++i) {
                        console.log('MainScreen Results UnitID', resultsMyMem.rows.item(i).OYEUnitID + ' ' + resultsMyMem.rows.item(i).OYEMemberID);
                        //  this.innsert(results.rows.item(i).UnitID,results.rows.item(i).UnitName,results.rows.item(i).Type);
                        global.SelectedRole = resultsMyMem.rows.item(0).OYEMemberRoleID;
                        global.SelectedMemberID = resultsMyMem.rows.item(0).OYEMemberID;
                    }

                }

            });
        });
    }

    Admin = () => {
        //http://localhost:54400/champ/api/v1/Member/GetMemberListByAccountID/{AccountID}
        const urlUnitList = global.champBaseURL + 'Member/GetMemberListByAccountID/' +  global.MyAccountID
        // console.log(urlUnitList)
        fetch(urlUnitList, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
          },
        })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            dataSource: responseJson.data.memberListByAccount,
            isLoading: false
          });
        })
    
        .catch((error) => {
          console.log(error)
        })
        
    }

    requestNotifPermission = () => {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    this.listenForNotif()
                    // user has permissions
                } else {
                    firebase.messaging().requestPermission()
                    .then(() => {
                        this.listenForNotif()
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
        }

        let ACAccntID = global.MyAccountID;
        axios.get(`http://apidev.oyespace.com/oyeliving/api/v1/GetAssociationListByAccountID/${ACAccntID}`, {
            headers: headers
        })
        .then(response => {
            let responseData = response.data.data;

            responseData.associationByAccount.map((association) => {
                console.log('***********')
                console.log(association.asAsnName)
                console.log(association.asAssnID)
                console.log('***********')
                firebase.messaging().subscribeToTopic(association.asAssnID + 'admin')
            })
        })
    }

    showLocalNotification = (notification) => {
        console.log(notification)
        const channel = new firebase.notifications.Android.Channel('channel_id', 'Oyespace', firebase.notifications.Android.Importance.Max)
        .setDescription('Oyespace channel');
        channel.enableLights(true);
        // channel.enableVibration(true);
        // channel.vibrationPattern([500]);
        firebase.notifications().android.createChannel(channel);

        
        const notificationBuild = new firebase.notifications.Notification({
            sound: 'default',
            show_in_foreground: true,
        })
        .setTitle(notification._title)
        .setBody(notification._body)
        .setNotificationId(notification._notificationId)
        // .setSound('default')
        .setData({
            ...notification._data,
            foreground: true
        })
        .android.setColor('#FF8C00')
        .android.setLargeIcon('ic_notif')
        .android.setAutoCancel(true)
        .android.setSmallIcon('ic_stat_ic_notification')
        .android.setChannelId('channel_id')
        .android.setVibrate("default")
        // .android.setChannelId('notification-action')
        .android.setPriority(firebase.notifications.Android.Priority.Max)

        firebase.notifications().displayNotification(notificationBuild);
        this.setState({ foregroundNotif: notification._data })
    }

    listenForNotif = () => {
        let navigationInstance = this.props.navigation;
        // Display the notification
        this.messageListener = firebase.messaging().onMessage((remoteMessage) => {
            // Process your message as required
            // console.log('___________')
            // console.log(remoteMessage)
            // console.log('___________')
        });

        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
            // console.log('___________')
            // console.log(notification)
            // console.log('____________') 
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });

        this.notificationListener = firebase.notifications().onNotification((notification) => {

            console.log('___________')
            console.log(notification)
            console.log('____________')

            if(notification._data.associationID) {
                // this.props.createNotification(notification._data, navigationInstance, false)
            }  

            this.showLocalNotification(notification);

        });

        firebase.notifications().onNotificationOpened((notificationOpen) => {
            if(notificationOpen.notification._data.admin === 'true') {
                if(notificationOpen.action) {
                    this.props.newNotifInstance(notificationOpen.notification);
                    this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, 'true')
                    // this.props.createNotification(notificationOpen.notification)
                }
            } else {
                // this.props.newNotifInstance(notificationOpen.notification);
                // this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, false)
            }

            if(notificationOpen.notification._data.admin === 'true') {
                if(notificationOpen.notification._data.foreground) {
                    this.props.newNotifInstance(notificationOpen.notification);
                    this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, 'true')
                }
            } else if (notificationOpen.notification._data.admin === 'gate_app') {
                    this.props.newNotifInstance(notificationOpen.notification);
                    this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, 'gate_app')
                // this.props.newNotifInstance(notificationOpen.notification);
                // this.props.createNotification(notificationOpen.notification._data, navigationInstance, true, false)
            }
        });
        
    }
    
    componentDidMount() {
        this.Admin();
        this.requestNotifPermission();
        this.getBlockList();
        // this.props.getNotifications(global.MyAccountID, 2, true)

        //   const url1 = 'http://192.168.1.39:80/oye247/api/v1/GetWorkersList'
        const url1 = 'http://' + global.oyeURL + '/oyesafe/api/v1/Subscription/GetLatestSubscriptionByAssocID/' + global.SelectedAssociationID
        fetch(url1, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    //dataSource: responseJson.data.workers.filter(x => x.associationID == global.SelectedAssociationID), 
                    // dataSource: responseJson.data.workers.filter(x => x.asAssnID == 25),
                    isLoading: false
                })
                console.log('Subscription res', responseJson);
                if (responseJson.success) {
                    // console.log('ravii workers', responseJson);
                    console.log('Subscription count', responseJson.data.subscription);
                    this.setState({
                        SubscriptionValidity: responseJson.data.subscription.sueDate,
                    });
                    console.log('Subscription ', responseJson.data.subscription.sueDate);

                } else {
                    console.log('Subscription ', 'else ');
                    //   const url1 = 'http://192.168.1.39:80/oye247/api/v1/GetWorkersList'
                    const url3 = 'http://' + global.oyeURL + '/oyesafe/api/v1/Subscription/Create'
                    member = {
                        "ASAssnID": global.SelectedAssociationID,
                        "SULPymtD": moment(new Date()).format('YYYY-MM-DD'),//"2018-01-26",// yearToday+"-"+monthToday+"-"+dateToday,
                        "SULPymtBy": 2,
                        "SUNoofUnit": this.state.units_tot_count,
                        "PRID": 4,
                        "PYID": 1,

                    }
                    console.log('Subscription ', url3 + ' start ' + JSON.stringify(member));

                    fetch(url3, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                        },
                        body: JSON.stringify(member)
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            this.setState({
                                //dataSource: responseJson.data.workers.filter(x => x.associationID == global.SelectedAssociationID), 
                                isLoading: false
                            })
                            console.log('Subscription res', responseJson);
                            if (responseJson.success) {
                                // console.log('ravii workers', responseJson);
                                //isBefore(new Date(), add(new Date(), 1, 'day'));
                                //const date = new Date(2016, 6, 1); // J

                            } else {
                                console.log('Subscription ', 'else ');

                            }
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }
            })
            .catch((error) => {
                console.log(error)
            })

        this.getAttendance_byAssociationID();

        navigator.geolocation.getCurrentPosition((position) => {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            console.log('componentdidmount gps ', lat + ' ' + long);
            const currentposition = JSON.stringify(position);
            console.log('componentdidmount gps ', currentposition);
            this.setState({ currentposition, lat, long });
            console.log('componentdidmount lat ', this.state.lat + ',' + this.state.long);
        });

        db.transaction(tx => {
            tx.executeSql('delete FROM UnitParkingID ', [], (tx, results) => {
                console.log('Results UnitParkingID delete ', results.rowsAffected);
            });
        });
        //http://api.oyespace.com/oyeliving/api/v1/UnitParking/GetUnitParkingListByAssocID/30
        //const url2 = 'http://'+global.oyeURL+'/oye247/api/v1/Attendance/GetAttendanceListByStartDateAndAssocID/' + global.SelectedAssociationID+'/2018-11-26'
        const url3 = global.champBaseURL + 'UnitParking/GetUnitParkingListByAssocID/' + global.SelectedAssociationID
        console.log('Parking', url3)
        fetch(url3, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('attendance anu', responseJson + ' ' + url3);
                if (responseJson.success) {
                    // console.log('ravii attendance', responseJson);
                    console.log('Unit Parking count', responseJson.data.unitParkingByAssocID.length);
                    for (let i = 0; i < responseJson.data.unitParkingByAssocID.length; ++i) {
                        // temp.push(results.rows.item(i));
                        console.log('Results ParkingID', responseJson.data.unitParkingByAssocID[i].upid + ' '
                            + responseJson.data.unitParkingByAssocID[i].asAssnID);
                        if (responseJson.data.unitParkingByAssocID[i].asAssnID == global.SelectedAssociationID) {
                            console.log('Parking ID', responseJson.data.unitParkingByAssocID[i].asAssnID + ' '
                                + responseJson.data.unitParkingByAssocID[i].upid);
                            this.insert_UnitParkingID(responseJson.data.unitParkingByAssocID[i].upid,
                                responseJson.data.unitParkingByAssocID[i].asAssnID);
                        } else {
                            console.log('Parking ID null', responseJson.data.attendanceListByAssocID[i].atAttndID + ' '
                                + responseJson.data.attendanceListByAssocID[i].atsDate);
                        }
                    }
                } else {
                    //alert('Not a Member');
                }
            })
            .catch((error) => {
                console.log('Parking ID ' + error)
            })

           
    }

    getBlockList = () =>{
        db.transaction(tx => {
        tx.executeSql('delete FROM Blocks where AssnID=' + global.SelectedAssociationID, [], (tx, results) => {
        console.log('Results Blocks delete ', results.rowsAffected);
        });
        });
        console.log('ff')
        const url = 'http://apidev.oyespace.com/oyeliving/api/v1/Block/GetBlockListByAssocID/'+global.SelectedAssociationID;
        
        console.log(url)
        fetch(url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
        },
        
        })
        .then((response) => response.json())
        .then((responseJson) => {
        if (responseJson.success) {
        console.log('ravi blocks', responseJson);
        console.log('Blocks count', responseJson.data.blocksByAssoc.length + ' ');
        for (let i = 0; i < responseJson.data.blocksByAssoc.length; ++i) {
        // temp.push(results.rows.item(i));
        console.log('Results Blocks', responseJson.data.blocksByAssoc[i].blBlockID + ' '
        + responseJson.data.blocksByAssoc[i].asAssnID);
        this.insert_BlockDetails(responseJson.data.blocksByAssoc[i].blBlockID,
        responseJson.data.blocksByAssoc[i].blBlkName, responseJson.data.blocksByAssoc[i].blBlkType,
        responseJson.data.blocksByAssoc[i].blNofUnit, responseJson.data.blocksByAssoc[i].asAssnID);
        }
        
        } else {
        //alert('Not a Member');
        
        }
        
        })
        
        .catch((error) => {
        console.log(error)
        })
        
    }

    insert_BlockDetails(block_id, block_name, block_type, block_units, AssociationID) {
        db.transaction(function (tx) {
        tx.executeSql(
        'INSERT INTO Blocks (BlockID, BlockName, BlockType, BlockUnits, AssnID ) VALUES (?,?,?,?,?)',
        [block_id, block_name, block_type, block_units, AssociationID],
        (tx, results) => {
        console.log('Results Attendance', results.rowsAffected);
        }
        );
        });
    }
        

    insert_UnitParkingID(unitparking_id, association_id) {
        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO UnitParkingID (UPID, AssociationID) VALUES (?,?)',
                [unitparking_id, association_id],
                (tx, results) => {
                    console.log('Results UnitParkingID', results.rowsAffected);
                }
            );
        });
    }

    getAttendance_byAssociationID() {
        db.transaction(tx => {
            tx.executeSql('delete  FROM Attendance where AssociationID=' + global.SelectedAssociationID, [], (tx, results) => {
                console.log('Results Attendance delete ', results.rowsAffected);
            });
        });

        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        //GetAttendanceListByStartDateAndAssocID/66/12-10-2018
        //http://api.oyespace.com/oye247/api/v1/Attendance/GetAttendanceListByStartDateAndAssocID/66/12-10-2018
        //const url2 = 'http://'+global.oyeURL+'/oye247/api/v1/Attendance/GetAttendanceListByStartDateAndAssocID/' + global.SelectedAssociationID+'/2018-11-26'
        const url2 = 'http://' + global.oyeURL + '/oye247/api/v1/Attendance/GetAttendanceListByStartDateAndAssocID/' + global.SelectedAssociationID + '/' + month + '-' + date + '-' + year
        console.log('attendance ' + date + ' ' + month + ' ' + year + ' ' + url2);
        fetch(url2, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {

                console.log('attendance responseJson', responseJson + ' ' + url2);

                if (responseJson.success) {
                    //   console.log('ravii attendance', responseJson);
                    console.log('attendance count', responseJson.data.attendanceListByAttendyID.length + ' ');
                    for (let i = 0; i < responseJson.data.attendanceListByAttendyID.length; ++i) {
                        //     temp.push(results.rows.item(i));
                        console.log('Results attendance', responseJson.data.attendanceListByAttendyID[i].atAttndID + ' '
                            + responseJson.data.attendanceListByAttendyID[i].wkWorkID);
                        //"attendanceListByAssocID": [    {    "atAttndID": 3,      "atAtyID": 0,
                        //  "atsDate": "2018-11-12T00:00:00",   "ateDate": "2018-02-25T00:00:00",   "atsTime": "1900-01-01T06:22:50",
                        //  "ateTime": "2018-11-13T02:25:23",   "atEntryPt": "MainGate",     "atExitPt": "Gardern",
                        //  "wkWorkID": 8,     "wsWrkSTID": 8,     "atgpsPnt": "12.2323 323.23262",
                        //  "atimeiNo": "546546546",     "atMemType": "Guard",      "atAtdType": "Wok",
                        //  "meMemID": 2,    "asAssnID": 25,     "atdCreated": "2018-11-12T00:00:00",
                        //   "atdUpdated": "0001-01-01T00:00:00",              "atIsActive": true          }
                        if (responseJson.data.attendanceListByAssocID[i].atsDate == year + '-' + month + '-' + date + 'T00:00:00') {
                            console.log('today attendance', responseJson.data.attendanceListByAssocID[i].atAttndID + ' '
                                + responseJson.data.attendanceListByAssocID[i].atsDate);
                            this.insert_GuardAttendance(responseJson.data.attendanceListByAssocID[i].atAttndID,
                                responseJson.data.attendanceListByAssocID[i].asAssnID, responseJson.data.attendanceListByAssocID[i].wkWorkID,
                                responseJson.data.attendanceListByAssocID[i].atimeiNo, responseJson.data.attendanceListByAssocID[i].atsDate,
                                responseJson.data.attendanceListByAssocID[i].ateDate, responseJson.data.attendanceListByAssocID[i].atsTime,
                                responseJson.data.attendanceListByAssocID[i].ateTime);
                        } else {
                            console.log('not today attendance', responseJson.data.attendanceListByAssocID[i].atAttndID + ' '
                                + responseJson.data.attendanceListByAssocID[i].atsDate);
                        }
                        this.setState({
                            dataSourceAttendance: responseJson.data.attendanceListByAssocID,
                        })

                    }

                } else {
                    //alert('Not a Member');

                }

            })
            .catch((error) => {
                console.log('attendance ' + error)
            })
    }

    insert_GuardAttendance(attendance_id, association_id, guard_id, imei_no, start_date, end_date, start_time, end_time) {
        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO Attendance (AttendanceID, AssociationID, GuardID, ImeiNo, StartDate, EndDate, StartTime, ' +
                ' EndTime ) VALUES (?,?,?,?,?,?,?,?)',
                [attendance_id, association_id, guard_id, imei_no, start_date, end_date, start_time, end_time],
                (tx, results) => {
                    console.log('Results Attendance', results.rowsAffected);
                }
            );
        });
    }

    exitApp = () => {
        RNExitApp.exitApp();
    };
    
    createEmergency = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            console.log('createEmergency gps ', lat + ' ' + long);
            const currentposition = JSON.stringify(position);
            console.log('createEmergency gps ', currentposition);
            this.setState({ currentposition, lat, long });
            console.log('createEmergency lat ', this.state.lat + ',' + this.state.long);
        });

        if (this.state.guard_tot_count != 0) {
            console.log('createEmergency ', 'start ' + this.state.workerID);
            anu = {
                "TTTktTyID": 1,
                "TKGPSPnt": this.state.lat + ',' + this.state.long,
                "TKRaisdBy": global.MyFirstName + ' ' + global.MyLastName,
                "TKRBCmnts": "Emergency",
                "TKRBEvid": "Emergency",
                "WKWorkID": this.state.workerID,
                "MEMemID": global.MyOYEMemberID,
                "TKEmail": "",
                "TKMobile": global.MyMobileNumber,
                "UNUnitID": global.SelectedUnitID,
                "ASAssnID": global.SelectedAssociationID
            }

            console.log('createEmergency ', anu)
            fetch('http://' + global.oyeURL + '/oye247/api/v1/Ticketing/Create',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
                    },
                    body: JSON.stringify(anu)
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log('createEmergency responseJson ', responseJson);

                    if (responseJson.success) {
                        const imgName = 'Association' + global.SelectedAssociationID + 'INCIDENT' + responseJson.data.ticketingID + 'N' + '0' + '.jpg';
                        console.log('ram', imgName);
                        if (this.state.imgPath) {
                            var data = new FormData();
                            data.append('Test', { uri: this.state.imgPath, name: imgName, type: 'image/jpg' });
                            const config = {
                                method: 'POST',
                                headers: { "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1", "content-type": "multipart/form-data" },
                                body: data
                            };
                            console.log("Config", config);
                            fetch('http://cohapi.careofhomes.com/champ/api/v1/association/upload', config).then(responseData => {
                                console.log("sucess==>");
                                console.log(responseData._bodyText);
                                console.log(responseData);
                                //  alert("Image uploaded done! Image path=\nhttp://cohapi.careofhomes.com/Images/selfie.jpg")
                                //  this.props.navigation.navigate('ViewIncidentList');
                            }).catch(err => {
                                console.log("err==>");
                                alert("Error with image upload!")
                                //  this.props.navigation.navigate('GuardListScreen');
                                console.log(err);
                            });
                        }
                        fcmMsg = {
                            "data": {
                                "activt": 'Emergency',
                                "unitID": global.SelectedUnitID,
                                "associationID": global.SelectedAssociationID,
                                "name": global.MyFirstName + " " + global.MyLastName,
                                "mob": global.MyMobileNumber,
                                "incidentId": responseJson.data.ticketingID,
                                "gps": '',//this.state.lat + ',' + this.state.long,
                                "gmtdatetime": moment(new Date()).format('YYYY-MM-DD HH:mm'),
                            },
                            "to": "/topics/AllGuards" + global.SelectedAssociationID,
                        }
                        console.log('fcmMsg ', fcmMsg);
                        fetch('https://fcm.googleapis.com/fcm/send',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    "Authorization": "key=AAAAZFz1cFA:APA91bHV9vd8g4zSMR13q_IYrNmza0e0m0EgG4BJxzaQOcH3Nc3RRrTfYNyRryEgz0iDQwXhP-XYHAGOIcgYjLOf2KnwYp-6_9XKNdiYzjakfnFFruYz89BXpc474OWJBU_ZzCScV6Zy",
                                },
                                body: JSON.stringify(fcmMsg)
                            })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                console.log('suvarna', responseJson);
                                alert('Alerted Guards successfully');

                            })
                            .catch((error) => {
                                console.error(error);
                                alert('caught error in fcmMsg');
                            });

                    } else {
                        console.log('createEmergency', 'failed');
                        Alert.alert('Alert', 'failed..!',
                            [
                                { text: 'Ok', onPress: () => { } },
                            ],
                            { cancelable: false }
                        );
                    }

                    console.log('suvarna', 'hi');
                })
                .catch((error) => {
                    console.error(error);
                    console.log('createEmergency err ', error);
                    alert('caught error in create');

                });
        } else {
            alert('No on Duty Guards ');
        }
    };

    deleteUser = () => {
        var that = this;
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM  Account ',
                [],
                (tx, results) => {
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            'Log Out User',
                            'Successfull',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => that.props.navigation.navigate('MobileValid'),
                                },
                            ],
                            { cancelable: false }
                        );
                    } else {
                        alert('Logged Out Failed');
                    }
                }
            );
        });
    };

    onAssnPickerValueChange = (value, index) => {
        global.SelectedAssociationID = value;
        global.AssociationName = this.state.dataSourceAssnPkr[index].AsnName;
        console.log('Results dataSourceAssnPkr AssID', value + ' ' + global.AssociationName);

        this.setState(
            {
                "AssnPickerValueHolder": value
            },

            () => {
                // here is our callback that will be fired after state change.
                //Alert.alert("Throttlemode", this.state.AssnPickerValueHolder+' ' +global.SelectedAssociationID);
                console.log('SelectedAssociationID ', this.state.AssnPickerValueHolder + ' ' + global.SelectedAssociationID);

            }
        );
        this.fnSet_After_Association_Selected();

        this.fnSet_MemberID_Role();
        this.getAttendance_byAssociationID();
    }

    onUnitPickerValueChange = (value, index) => {
        global.SelectedUnitID = value;
        global.AssociationUnitName = this.state.dataSourceUnitPkr[index].UnitName;

        console.log('Results dataSourceUnitPkr UnitID', value + ' ' + global.AssociationUnitName);
        this.setState(
            {
                "UnitPickerValueHolder": value
            },

            () => {
                // here is our callback that will be fired after state change.
                //Alert.alert("Throttlemode", this.state.AssnPickerValueHolder+' ' +global.SelectedAssociationID);
                console.log('SelectedUnitID ', this.state.UnitPickerValueHolder + ' ' + global.SelectedUnitID);

            }
        );

        this.fnSet_MemberID_Role();
    }

    syncUnits(assnID) {

        const url = global.champBaseURL + 'Unit/GetUnitListByAssocID/' + assnID;
        console.log('syncUnits start ', url);
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('unitlist in ', responseJson)
                this.setState({
                    isLoading: false
                })

                if (responseJson.success) {
                    console.log('ravii', responseJson);
                    console.log('responseJson count unit ', responseJson.data.unit.length);
                    db.transaction(tx => {
                        tx.executeSql('delete  FROM OyeUnit where AssociationID=' + assnID, [], (tx, results) => {
                            console.log('Results Attendance delete ', results.rowsAffected);
                        });
                    });
                    for (let i = 0; i < responseJson.data.unit.length; ++i) {
                        //     temp.push(results.rows.item(i));

                        console.log('Results unit', responseJson.data.unit[i].unUniName + ' ' + responseJson.data.unit[i].unUnitID);

                        this.insert_units(responseJson.data.unit[i].unUnitID,
                            responseJson.data.unit[i].asAssnID,
                            responseJson.data.unit[i].unUniName, responseJson.data.unit[i].unUniType,
                            responseJson.data.unit[i].flFloorID, responseJson.data.unit[i].unIsActive,
                            responseJson.data.unit[i].parkingLotNumber);

                    }

                    db.transaction(tx => {

                        tx.executeSql('SELECT Distinct M.OYEUnitID, A.UnitName FROM MyMembership M inner Join OyeUnit A on M.OYEUnitID=A.UnitID and M.AssociationID=' + global.SelectedAssociationID, [], (tx, results) => {
                            var temp = [];
                            let unit_drop_down_data_local = [];
                            for (let i = 0; i < results.rows.length; ++i) {
                                temp.push(results.rows.item(i));
                                unit_drop_down_data_local.push({ value: results.rows.item(i).OYEUnitID, label: results.rows.item(i).UnitName, }); // Create your array of data
                                console.log('dataSourceUnitPkr UnitID', results.rows.item(i).UnitName + ' ' + results.rows.item(i).OYEUnitID);
                                global.AssociationUnitName = results.rows.item(0).UnitName;
                                global.SelectedUnitID = results.rows.item(0).OYEUnitID;
                            }

                            this.setState({
                                dataSourceUnitPkr: temp,
                            });
                            this.setState({ stUnit_drop_down_data: unit_drop_down_data_local }); // Set 

                        });
                    });

                    this.fnSet_MemberID_Role();

                } else {
                    console.log('failurre')
                }
            })
            .catch((error) => {
                this.setState({

                    isLoading: false
                })
                console.log(error)
                console.log('unitlist err ', error)

            })
    }

    insert_units(unit_id, association_id, UnitName, type, admin_account_id, created_date_time, parking_slot_number
    ) {
        db.transaction(function (tx) {
            //// OyeUnit(UnitID integer , " +
            //" AssociationID integer , UnitName VARCHAR(20) ,  Type VARCHAR(20) , AdminAccountID integer , " +
            //" CreatedDateTime VARCHAR(20),  ParkingSlotNumber VARCHAR(20) )
            tx.executeSql(
                'INSERT INTO OyeUnit (UnitID, AssociationID, UnitName, Type, AdminAccountID, CreatedDateTime,  ' +
                '  ParkingSlotNumber ) VALUES (?,?,?,?,?,?,?)',
                [unit_id, association_id, UnitName, type, admin_account_id, created_date_time, parking_slot_number],
                (tx, results) => {
                    console.log('INSERT oyeUnits ', results.rowsAffected + ' ' + association_id);

                }
            );
        });
    }

    renderAdmin = () => {
        // if(this.state.dataSource) {
        //     if(this.state.dataSource[0].mrmRoleID === 3 && this.state.dataSource[0].asAssnID === global.SelectedAssociationID) {
        //         return (
        //             <View style={{flexDirection:'column',width:Dimensions.get('window').width/4,height:50,justifyContent:'center',alignItems:'center',}}>
        //                 <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}}
        //                     onPress={() => this.props.navigation.navigate('AdminFunction')}>
        //                     <Image source={require('../pages/assets/images/my_visitors_orange.png')} style={{width:25,height:25,justifyContent:'center',alignItems:'center'}}/>
        //                     <Text style={{ fontSize: 12, color: 'black'}}>Admin</Text>
        //                 </TouchableOpacity>
        //             </View>
        //         )
        //     } else {
        //         return null
        //     }
        // } else return null
        return (
            <View style={{flexDirection:'column',width:Dimensions.get('window').width/4,height:50,justifyContent:'center',alignItems:'center',}}>
                <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}}
                    onPress={() => this.props.navigation.navigate('AdminFunction')}>
                    <Image source={require('../pages/assets/images/my_visitors_orange.png')} style={{width:25,height:25,justifyContent:'center',alignItems:'center'}}/>
                    <Text style={{ fontSize: 12, color: 'black'}}>Admin</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderNotifIcon = () => {
        const { notificationCount } = this.props;
        const BadgedIcon = withBadge(notificationCount)(FontAwesome);

        if(notificationCount >= 1) {
            return (
                <View style={{ marginTop: '40%'}}>
                    <BadgedIcon 
                        type="font-awesome"
                        name="bell" 
                        size={30} 
                        color="#ED8A19"
                        onPress={() => this.props.navigation.navigate('NotificationScreen')}
                    />
                </View>
            )
        } else {
            return (
                <FontAwesome 
                    name="bell" 
                    size={30} 
                    color="#ED8A19" 
                    style={{ marginTop: '40%'}} 
                    onPress={() => this.props.navigation.navigate('NotificationScreen')}
                />
            )
        }
    }
    
    render() {
        {/* <View style={styles.container}>
        <Text>Main</Text>
        <Button onPress={() => this.props.navigation.navigate("Detail")} title="Detail Page" />
      </View> */}
        hour = new Date().getHours();
        if (hour < 12) {
            salutation = 'Good Morning';
        } else if (hour >= 12 && hour < 17) {
            salutation = 'Good Afternoon';
        } else if (hour >= 17 && hour < 24) {
            salutation = 'Good Evening';
        }

        const barWidth = Dimensions.get('window').width - 160;
        const progressCustomStyles = {
        backgroundColor: 'red', 
        borderRadius: 0,
        borderColor: 'orange',
        };
    // const series = [(this.state.units_occupied_count/this.state.units_tot_count) * 100,((this.state.units_tot_count-this.state.units_occupied_count)/ this.state.units_tot_count)*100 ];
        const series = [60,40]
        let data = [{
        "name": "Occupied",
        "population": (this.state.units_occupied_count/this.state.units_tot_count) * 100
      }, {
        "name": "Vacant",
        "population": ((this.state.units_tot_count-this.state.units_occupied_count)/ this.state.units_tot_count)*100 
      }]
        return (

            <View style={{
                paddingTop: 2, backgroundColor: 'white', height: '100%',
                marginTop: 1,
            }}>
            <View style={{flexDirection:'row'}}>
            
            {/* <TouchableOpacity 
                style={{paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 1, alignItems: 'center', flexDirection: 'row',
                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',marginTop:'5%'}}
                    onPress={() => this.props.navigation.navigate('SideMenu')} >
                <Image source={require('../pages/assets/images/menu_button.png')}
                    style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
            </TouchableOpacity> */}
                <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfileScreen')}>
                    <Image
                        source={{ uri: global.viewImageURL + 'PERSON' + global.MyAccountID + '.jpg' }}
                        style={[styles.profileImg, {borderWidth:1,borderColor:'orange'}]}
                    />

                </TouchableOpacity>
                

                {/* <View style={{flex:4,alignContent:'flex-start',marginLeft:5}}>
                            <MyHeader navigation={this.props.navigation} title="Menu"
                            style={{ height: 50, width: 80}}  />
                </View>  */}
                <View style={{ flex: 5,alignItems:'center',justifyContent:'center',marginLeft:60}}>
                    <Image source={require('../pages/assets/images/OyespaceRebrandingLogo.png')}
                        style={{height: 40, width: 95, marginTop: 45,marginBottom:5}} />
                </View> 
                <View style={{ flex: 3,alignItems:'center',justifyContent:'center',}}>
                    {this.renderNotifIcon()}
                    {/* <Image source={require('../pages/assets/images/notifications-button.png')} style={{height:30, width:30, marginTop:'35%'}}/> */}
                </View>    
            </View>
            
            <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>
            <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View>

            
                <ScrollView style={{ backgroundColor: 'white', flexDirection: "column" }}>
                

                    <View style={{
                        marginLeft: '2%', marginTop: 2, paddingRight: 20, flexDirection:'column',
                        borderRadius: 5, flex: 6, backgroundColor: 'white',
                        width: '100%',
                    }}>
                    
                    <View style={{flexDirection:'row'}}>                    
                    <View style={{flex:1,color: 'white', backgroundColor: 'white',}}></View>
                    <View style={{flex: 4,color: '#000000', padding: 10, textAlign: 'center'}}>
                        <Text style={{flex: 4,color: '#000000', fontSize: 15, padding: 10, textAlign: 'center'}}>{salutation} {global.MyFirstName}</Text>
                    </View>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity
                                        style={{flex: 2,alignItems:'flex-end',justifyContent:'flex-end',
                                        borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                        }}
                                        onPress={() => this.props.navigation.navigate('SOS')}  /*Products is navigation name*/>
                                        <Image source={require('../pages/assets/images/sos.png')}
                                            style={{position:'absolute', height: 45, width: 45, }} />
                                        <Text style={{ fontSize: 12, color: 'white',marginBottom:12,marginRight:8, alignItems:"center",justifyContent:'center' }}>SOS</Text>
                        </TouchableOpacity>       
                    </View>  
                    </View>

                    </View>

                    <View style={{flex:1, flexDirection:'row', alignItems:'center',justifyContent:'center'}}>
                        <View style={{ marginLeft: 15, paddingRight: 15,width:200 }}>
                            <Dropdown
                                ref={this.typographyRef}
                                value={global.AssociationName}
                                onChangeText={this.onChangeText}
                                label='Association Name'
                                data={this.state.drop_down_data}
                            />
                        </View>
                        {/* <View style={{ marginLeft: 15, paddingRight: 15, width:80 }}>
                            <Dropdown
                                ref={this.unitDrpDwnRef}
                                value={global.AssociationUnitName}
                                onChangeText={this.onUnitChange}
                                label='Block Name'
                                data={this.state.stUnit_drop_down_data}
                            />
                        </View> */}
                        <View style={{ marginLeft: 15, paddingRight: 15, width:80 }}>
                            <Dropdown
                                ref={this.unitDrpDwnRef}
                                value={global.AssociationUnitName}
                                onChangeText={this.onUnitChange}
                                label='Unit Name'
                                data={this.state.stUnit_drop_down_data}
                            />
                        </View>
                    </View>
                    
                      
                    <View style={[styles.rectangle,{flexDirection:'column'}]}>
                        <View>
                            <Text style={{ fontSize: 13, color: 'black', margin: 5,fontWeight:'bold',alignItems:'center' }}>Resident List</Text>
                        </View>
                        {/* <View style={[styles.gauge, {flex:1, marginBottom:100}]}>
                                <Image style={{width:100,height:100}} source={require('../pages/assets/images/pasted_mage.png')}/>
                                <Text style={styles.gaugeText}>{((this.state.units_occupied_count / this.state.units_tot_count)*100).toFixed(0)}%</Text>
                        </View>                         */}
                        {/* <View> */}
                                
                            
                            {/* <Pie
                             radius={100}
                             //completly filled pie chart with radius 70
                             series={[50,50]}
                             innerRadius={80}
                            //  data={data}
                            //values to show and color sequentially
                             colors={['orange', 'blue']}
                             style={{ alignSelf: 'center' }}
                            /> */}
                           
                            
                        {/* </View> */}
                        
                        <View style={{flexDirection: 'column', marginLeft: '2%',}}>
                            <View style={{flexDirection:'column',}}>
                                <Text style={{marginLeft:40}}>Occupied {this.state.units_occupied_count}/{this.state.units_tot_count}</Text>
                                <View style={{flexDirection:'row', width:200, marginTop:5,marginRight:80,marginLeft:70,justifyContent:'center',alignItems:'center'}}>
                                <ProgressBarAnimated
                                width={barWidth}
                                value={(this.state.units_occupied_count/this.state.units_tot_count) * 100}
                                backgroundColorOnComplete="orange"
                                />
                                <View style={{marginLeft:5}}>
                                <Text>{((this.state.units_occupied_count/this.state.units_tot_count) * 100).toFixed(0)}%</Text>        
                                </View>
                                </View>   
                            </View>
                            
                            <View style={{flexDirection:'column'}}>
                                <Text style={{marginLeft:40}}>Vacant</Text>
                                <View style={{flexDirection:'row',width:200,marginTop:5,marginRight:80,marginLeft:70,justifyContent:'center',alignItems:'center'}}>
                                    <ProgressBarAnimated
                                    width={barWidth}
                                    value={((this.state.units_tot_count-this.state.units_occupied_count)/ this.state.units_tot_count)*100}
                                    color="blue"
                                    backgroundColorOnComplete='blue'
                                    />
                                    <View style={{marginLeft:5}}>
                                    <Text>{(((this.state.units_tot_count-this.state.units_occupied_count)/ this.state.units_tot_count)*100).toFixed(0)}%</Text>
                                    </View>
                                </View>   
                            </View>
                        </View>
                        <View>
                            <View>
                                <TouchableOpacity
                                style={{
                                    paddingTop: 2, paddingRight: 12, paddingLeft: 12, flex: 1, alignItems: 'center',
                                    paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
                                }}
                                onPress={() => this.props.navigation.navigate('ViewmembersScreen')}  /*Products is navigation name*/>
                                <Image source={require('../pages/assets/images/eye_orange.png')}
                                    style={{ height: 20, width: 25, margin: 2, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 13, color: 'black', paddingBottom: 10 }}>View Resident List</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                            
                    </View>
                    <View style={{ marginLeft: '2%', marginRight: '2%', marginBottom:30 }}>
                        <Text>Subscription Valid till: {this.state.SubscriptionValidity}
                        </Text>
                </View>
                </ScrollView>
                
                <View style={{flexDirection:'row',width:Dimensions.get('window').width,marginTop:'5%',justifyContent:'center',alignItems:'center', bottom:30 }}>
                {/* <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width/4,height:50}}>
                    <Image source={require('../pages/assets/images/OyeSpace.png')} style={{width:25,height:25,justifyContent:'center',alignItems:'center'}}/>
                    <Text style={{fontSize:12,color: 'black'}}>Dash</Text>
                </View> */}
                <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width/4,height:50}}>
                    <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}}
                        onPress={() => this.props.navigation.navigate('InvitedGuestListScreen')}>
                         <Image source={require('../pages/assets/images/invite_guest_orange.png')} style={{width:25,height:25,justifyContent:'center',alignItems:'center'}}/>
                         <Text style={{ fontSize: 12, color: 'black'}}>My Guests</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'column',width:Dimensions.get('window').width/4,height:50,justifyContent:'center',alignItems:'center',}}>
                    <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}}
                        onPress={() => this.props.navigation.navigate('GuardListScreen')}>
                        <Image source={require('../pages/assets/images/eye_orange.png')} style={{width:25,height:25,justifyContent:'center',alignItems:'center'}}/>
                        <Text style={{ fontSize: 12, color: 'black'}}>My Guards</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'column',width:Dimensions.get('window').width/4,height:50,justifyContent:'center',alignItems:'center',}}>
                    <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}}
                        onPress={() => this.props.navigation.navigate('ViewVisitorsScreen')}>
                        <Image source={require('../pages/assets/images/my_visitors_orange.png')} style={{width:25,height:25,justifyContent:'center',alignItems:'center'}}/>
                        <Text style={{ fontSize: 12, color: 'black'}}>My Visitors</Text>
                    </TouchableOpacity>
                </View>                
                {this.renderAdmin()}
            </View>
                
                <View style={[styles.navItemStyle,{position:'relative',left:0,right:0,bottom:20, flexDirection:"row",backgroundColor: 'lightgrey',height:30,}]}>
                    <Text style={{flex:1,justifyContent:'center',alignSelf:'center',paddingLeft:'10%', }} onPress={this.deleteUser.bind(this)}>Log Out</Text>
                </View>
            </View>
        );
    }
}

const typographyData = [
    { value: 'Display2', label: 'Display 2' },
    { value: 'Display1', label: 'Display 1' },
    { value: 'Headline' },
    { value: 'Title' },
    { value: 'Subheading' },
    { value: 'Body' },
    { value: 'Caption' },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    navItemStyle: {
        // padding: 10,
        justifyContent:'flex-end'
    },
    gauge: {
        position: 'absolute',
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
      },
      gaugeText: {
        backgroundColor: 'transparent',
        color: '#000',
        fontSize: 24,
      },
      
    rectangle: {
        flex:1,
        backgroundColor:
          'white', padding:
          10, borderColor:
          'orange',
  
        marginLeft: 50,
        marginRight: 50, marginTop:
          5, borderRadius:
          10, borderWidth:
          1,
          flexDirection: "column", backgroundColor: 'white', padding: 10, alignItems: 'center',
  
      },
      profileImg: {  height: 50, width: 50, borderRadius: 25,marginTop:35,marginLeft:20 },
});

const mapStateToProps = state => {
    return {
        isCreateLoading: state.NotificationReducer.isCreateLoading,
        notificationCount: state.NotificationReducer.notificationCount,
    }
}

export default connect(mapStateToProps, { newNotifInstance, createNotification, getNotifications })(MainScreen);

// import React, { Component } from 'react';
// import {
//     StyleSheet, Platform, StatusBar, View, Text, Image, Picker, TextInput, Dimensions,
//     TouchableOpacity, YellowBox, ScrollView, Alert
// } from 'react-native';
// // import all basic components
// import { DrawerNavigator, StackNavigator, createStackNavigator } from 'react-navigation';
// //import Pie from 'react-native-pie';
// import { openDatabase } from 'react-native-sqlite-storage';
// //import { Fonts } from '../pages/src/utils/Fonts';
// import RNExitApp from 'react-native-exit-app';
// //import ProgressBarClassic from 'react-native-progress-bar-classic';
// import moment from 'moment';

// console.disableYellowBox = true;
// var db = openDatabase({ name: global.DB_NAME });
// const radiusHeight = Dimensions.get('window').height / 8;
// const boxHeight = (Dimensions.get('window').height / 4) + 50;
// var date = new Date().getDate();
// var month = new Date().getMonth() + 1;
// var year = new Date().getFullYear();
// var hour = new Date().getHours();
// var salutation = 'Good Morning'

// class MainScreen extends Component {

//     constructor(props) {
//         super(props);

//         this.state = {
//             guard_tot_count: 0,
//             guard_onduty_count: 0,
//             units_tot_count: 0,
//             units_occupied_count: 0,
//             dataSourceAssnPkr: [],
//             AssnPickerValueHolder: '',
//             dataSourceUnitPkr: [],
//             dataSourceAttendance: [],
//             dataSourceGuards: [],
//             workerID: 0,
//             UnitPickerValueHolder: '',
//             SubscriptionValidity: '',
//             lat: '',
//             long: '',
//         };

//         db.transaction(tx => {

//             tx.executeSql('SELECT Distinct M.AssociationID, A.AsnName FROM MyMembership M inner Join Association A on M.AssociationID=A.AssnID ', [], (tx, results) => {
//                 var temp = [];
//                 for (let i = 0; i < results.rows.length; ++i) {
//                     temp.push(results.rows.item(i));
//                     console.log('Results AsnName ', results.rows.item(i).AsnName + ' ' + results.rows.item(i).AssociationID);
//                     global.AssociationName = results.rows.item(0).AsnName;
//                 }
//                 this.setState({
//                     dataSourceAssnPkr: temp,
//                 });
//             });
//         });

//         db.transaction(tx => {

//             tx.executeSql('SELECT Distinct M.OYEUnitID, A.UnitName FROM MyMembership M inner Join OyeUnit A on M.OYEUnitID=A.UnitID and M.AssociationID=' + global.SelectedAssociationID, [], (tx, results) => {
//                 var temp = [];
//                 for (let i = 0; i < results.rows.length; ++i) {
//                     temp.push(results.rows.item(i));
//                     console.log('dataSourceUnitPkr UnitID ' + i, results.rows.item(i).UnitName + ' ' + results.rows.item(i).OYEUnitID);
//                 }
//                 this.setState({
//                     dataSourceUnitPkr: temp,
//                 });
//             });
//         });

//         this.fnSet_After_Association_Selected();

//         this.fnSet_MemberID_Role();
//     }

//     fnSet_After_Association_Selected() {

//         db.transaction(tx => {

//             tx.executeSql('SELECT Distinct M.OYEUnitID, A.UnitName FROM MyMembership M inner Join OyeUnit A on M.OYEUnitID=A.UnitID and M.AssociationID=' + global.SelectedAssociationID, [], (tx, results) => {
//                 var temp = [];
//                 for (let i = 0; i < results.rows.length; ++i) {
//                     temp.push(results.rows.item(i));
//                     console.log('dataSourceUnitPkr UnitID', results.rows.item(i).UnitName + ' ' + results.rows.item(i).OYEUnitID);
//                     global.AssociationUnitName = results.rows.item(0).UnitName;
//                     global.SelectedUnitID = results.rows.item(0).OYEUnitID;
//                 }
//                 if (results.rows.length == 0) {
//                     console.log('count dataSourceUnitPkr ', value + ' ' + value);
//                     this.syncUnits(global.SelectedAssociationID);
//                 }
//                 this.setState({
//                     dataSourceUnitPkr: temp,
//                 });
//             });
//         });

//         db.transaction(tx => {
//             tx.executeSql('SELECT Distinct AttendanceID FROM Attendance where AssociationID=' + global.SelectedAssociationID, [], (tx, results) => {
//                 console.log('Results', results.rowsAffected);

//                 this.setState({
//                     guard_onduty_count: results.rows.length,
//                 });
//             });
//         });

//         db.transaction(tx => {
//             tx.executeSql('SELECT Distinct WorkID FROM Workers where AssnID=' + global.SelectedAssociationID, [], (tx, results) => {
//                 console.log('Results', results.rowsAffected);

//                 this.setState({
//                     guard_tot_count: results.rows.length,
//                 });
//                 if (results.rows.length > 0) {
//                     this.setState({
//                         workerID: results.rows.item(0).WorkID,
//                     });
//                 }
//             });
//         });

//         db.transaction(tx => {
//             tx.executeSql('SELECT Distinct OwnerId FROM UnitOwner where OwnerAssnID=' + global.SelectedAssociationID, [], (tx, results) => {
//                 console.log('Results', results.rowsAffected);
//                 this.setState({
//                     units_occupied_count: results.rows.length,
//                 });
//             });
//         });

//         db.transaction(tx => {
//             tx.executeSql('SELECT Distinct NofUnit FROM Association where AssnID=' + global.SelectedAssociationID, [], (tx, results) => {
//                 console.log('Results', results.rowsAffected);
//                 this.setState({
//                     units_tot_count: results.rows.item(0).NofUnit,
//                 });
//             });
//         });

//     }

//     fnSet_MemberID_Role() {
//         db.transaction(txMyMem => {
//             txMyMem.executeSql('SELECT * FROM MyMembership where AssociationID=' + global.SelectedAssociationID + ' and OYEUnitID=' + global.SelectedUnitID, [], (txMyMem, resultsMyMem) => {
//                 console.log('MainScreen Results MyMembership ', resultsMyMem.rows.length + ' ');

//                 if (resultsMyMem.rows.length > 0) {
//                     console.log('MainScreen Results MyMembership', resultsMyMem.rows.item(0).AssociationID + ' ' + resultsMyMem.rows.item(0).OYEUnitID + ' '
//                         + resultsMyMem.rows.item(0).MobileNumber + ' ' + resultsMyMem.rows.item(0).OYEMemberRoleID + ' ');

//                     for (let i = 0; i < resultsMyMem.rows.length; ++i) {
//                         console.log('MainScreen Results UnitID', resultsMyMem.rows.item(i).OYEUnitID + ' ' + resultsMyMem.rows.item(i).OYEMemberID);
//                         //  this.innsert(results.rows.item(i).UnitID,results.rows.item(i).UnitName,results.rows.item(i).Type);
//                         global.SelectedRole = resultsMyMem.rows.item(0).OYEMemberRoleID;
//                         global.SelectedMemberID = resultsMyMem.rows.item(0).OYEMemberID;
//                     }

//                 }

//             });
//         });
//     }

//     componentWillUpdate(nextProps, nextState) {
//         if (this.state.guard_tot_count == nextState.guard_tot_count) {
//             // alert('componentWillUpdate if');
//         } else {
//             // alert('componentWillUpdate else');
//         }
//     }

//     componentDidMount() {
//         console.log('componentdidmount')

//         //   const url1 = 'http://192.168.1.39:80/oye247/api/v1/GetWorkersList'
//         const url1 = 'http://' + global.oyeURL + '/oyesafe/api/v1/Subscription/GetLatestSubscriptionByAssocID/' + global.SelectedAssociationID
//         fetch(url1, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
//             },
//         })
//             .then((response) => response.json())
//             .then((responseJson) => {
//                 this.setState({
//                     //dataSource: responseJson.data.workers.filter(x => x.associationID == global.SelectedAssociationID), 
//                     // dataSource: responseJson.data.workers.filter(x => x.asAssnID == 25),
//                     isLoading: false
//                 })
//                 console.log('Subscription res', responseJson);
//                 if (responseJson.success) {
//                     // console.log('ravii workers', responseJson);
//                     console.log('Subscription count', responseJson.data.subscription);
//                     this.setState({
//                         SubscriptionValidity: responseJson.data.subscription.sueDate,
//                     });
//                     console.log('Subscription ', responseJson.data.subscription.sueDate);

//                 } else {
//                     console.log('Subscription ', 'else ');
//                     //   const url1 = 'http://192.168.1.39:80/oye247/api/v1/GetWorkersList'
//                     const url3 = 'http://' + global.oyeURL + '/oyesafe/api/v1/Subscription/Create'
//                     member = {
//                         "ASAssnID": global.SelectedAssociationID,
//                         "SULPymtD": moment(new Date()).format('YYYY-MM-DD'),//"2018-01-26",// yearToday+"-"+monthToday+"-"+dateToday,
//                         "SULPymtBy": 2,
//                         "SUNoofUnit": this.state.units_tot_count,
//                         "PRID": 4,
//                         "PYID": 1,

//                     }
//                     console.log('Subscription ', url3 + ' start ' + JSON.stringify(member));

//                     fetch(url3, {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                             "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
//                         },
//                         body: JSON.stringify(member)
//                     })
//                         .then((response) => response.json())
//                         .then((responseJson) => {
//                             this.setState({
//                                 //dataSource: responseJson.data.workers.filter(x => x.associationID == global.SelectedAssociationID), 
//                                 isLoading: false
//                             })
//                             console.log('Subscription res', responseJson);
//                             if (responseJson.success) {
//                                 // console.log('ravii workers', responseJson);
//                                 //isBefore(new Date(), add(new Date(), 1, 'day'));
//                                 //const date = new Date(2016, 6, 1); // J

//                             } else {
//                                 console.log('Subscription ', 'else ');

//                             }
//                         })
//                         .catch((error) => {
//                             console.log(error)
//                         })
//                 }
//             })
//             .catch((error) => {
//                 console.log(error)
//             })

//         this.getAttendance_byAssociationID();

//         navigator.geolocation.getCurrentPosition((position) => {
//             lat = position.coords.latitude;
//             long = position.coords.longitude;
//             console.log('componentdidmount gps ', lat + ' ' + long);
//             const currentposition = JSON.stringify(position);
//             console.log('componentdidmount gps ', currentposition);
//             this.setState({ currentposition, lat, long });
//             console.log('componentdidmount lat ', this.state.lat + ',' + this.state.long);
//         });

//         db.transaction(tx => {
//             tx.executeSql('delete FROM UnitParkingID ', [], (tx, results) => {
//                 console.log('Results UnitParkingID delete ', results.rowsAffected);
//             });
//         });
//         //http://api.oyespace.com/oyeliving/api/v1/UnitParking/GetUnitParkingListByAssocID/30
//         //const url2 = 'http://'+global.oyeURL+'/oye247/api/v1/Attendance/GetAttendanceListByStartDateAndAssocID/' + global.SelectedAssociationID+'/2018-11-26'
//         const url3 = global.champBaseURL + 'UnitParking/GetUnitParkingListByAssocID/' + global.SelectedAssociationID
//         console.log('Parking', url3)
//         fetch(url3, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
//             },
//         })
//             .then((response) => response.json())
//             .then((responseJson) => {
//                 console.log('attendance anu', responseJson + ' ' + url3);
//                 if (responseJson.success) {
//                     // console.log('ravii attendance', responseJson);
//                     console.log('Unit Parking count', responseJson.data.unitParkingByAssocID.length);
//                     for (let i = 0; i < responseJson.data.unitParkingByAssocID.length; ++i) {
//                         // temp.push(results.rows.item(i));
//                         console.log('Results ParkingID', responseJson.data.unitParkingByAssocID[i].upid + ' '
//                             + responseJson.data.unitParkingByAssocID[i].asAssnID);
//                         if (responseJson.data.unitParkingByAssocID[i].asAssnID == global.SelectedAssociationID) {
//                             console.log('Parking ID', responseJson.data.unitParkingByAssocID[i].asAssnID + ' '
//                                 + responseJson.data.unitParkingByAssocID[i].upid);
//                             this.insert_UnitParkingID(responseJson.data.unitParkingByAssocID[i].upid,
//                                 responseJson.data.unitParkingByAssocID[i].asAssnID);
//                         } else {
//                             console.log('Parking ID null', responseJson.data.attendanceListByAssocID[i].atAttndID + ' '
//                                 + responseJson.data.attendanceListByAssocID[i].atsDate);
//                         }
//                     }
//                 } else {
//                     //alert('Not a Member');
//                 }
//             })
//             .catch((error) => {
//                 console.log('Parking ID ' + error)
//             })

//     }

//     insert_UnitParkingID(unitparking_id, association_id) {
//         db.transaction(function (tx) {
//             tx.executeSql(
//                 'INSERT INTO UnitParkingID (UPID, AssociationID) VALUES (?,?)',
//                 [unitparking_id, association_id],
//                 (tx, results) => {
//                     console.log('Results UnitParkingID', results.rowsAffected);
//                 }
//             );
//         });
//     }

//     getAttendance_byAssociationID() {
//         db.transaction(tx => {
//             tx.executeSql('delete  FROM Attendance where AssociationID=' + global.SelectedAssociationID, [], (tx, results) => {
//                 console.log('Results Attendance delete ', results.rowsAffected);
//             });
//         });

//         var date = new Date().getDate();
//         var month = new Date().getMonth() + 1;
//         var year = new Date().getFullYear();

//         //GetAttendanceListByStartDateAndAssocID/66/12-10-2018
//         //http://api.oyespace.com/oye247/api/v1/Attendance/GetAttendanceListByStartDateAndAssocID/66/12-10-2018
//         //const url2 = 'http://'+global.oyeURL+'/oye247/api/v1/Attendance/GetAttendanceListByStartDateAndAssocID/' + global.SelectedAssociationID+'/2018-11-26'
//         const url2 = 'http://' + global.oyeURL + '/oye247/api/v1/Attendance/GetAttendanceListByStartDateAndAssocID/' + global.SelectedAssociationID + '/' + month + '-' + date + '-' + year
//         console.log('attendance ' + date + ' ' + month + ' ' + year + ' ' + url2);
//         fetch(url2, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
//             },
//         })
//             .then((response) => response.json())
//             .then((responseJson) => {

//                 console.log('attendance responseJson', responseJson + ' ' + url2);

//                 if (responseJson.success) {
//                     //   console.log('ravii attendance', responseJson);
//                     console.log('attendance count', responseJson.data.attendanceListByAttendyID.length + ' ');
//                     for (let i = 0; i < responseJson.data.attendanceListByAttendyID.length; ++i) {
//                         //     temp.push(results.rows.item(i));
//                         console.log('Results attendance', responseJson.data.attendanceListByAttendyID[i].atAttndID + ' '
//                             + responseJson.data.attendanceListByAttendyID[i].wkWorkID);
//                         //"attendanceListByAssocID": [    {    "atAttndID": 3,      "atAtyID": 0,
//                         //  "atsDate": "2018-11-12T00:00:00",   "ateDate": "2018-02-25T00:00:00",   "atsTime": "1900-01-01T06:22:50",
//                         //  "ateTime": "2018-11-13T02:25:23",   "atEntryPt": "MainGate",     "atExitPt": "Gardern",
//                         //  "wkWorkID": 8,     "wsWrkSTID": 8,     "atgpsPnt": "12.2323 323.23262",
//                         //  "atimeiNo": "546546546",     "atMemType": "Guard",      "atAtdType": "Wok",
//                         //  "meMemID": 2,    "asAssnID": 25,     "atdCreated": "2018-11-12T00:00:00",
//                         //   "atdUpdated": "0001-01-01T00:00:00",              "atIsActive": true          }
//                         if (responseJson.data.attendanceListByAssocID[i].atsDate == year + '-' + month + '-' + date + 'T00:00:00') {
//                             console.log('today attendance', responseJson.data.attendanceListByAssocID[i].atAttndID + ' '
//                                 + responseJson.data.attendanceListByAssocID[i].atsDate);
//                             this.insert_GuardAttendance(responseJson.data.attendanceListByAssocID[i].atAttndID,
//                                 responseJson.data.attendanceListByAssocID[i].asAssnID, responseJson.data.attendanceListByAssocID[i].wkWorkID,
//                                 responseJson.data.attendanceListByAssocID[i].atimeiNo, responseJson.data.attendanceListByAssocID[i].atsDate,
//                                 responseJson.data.attendanceListByAssocID[i].ateDate, responseJson.data.attendanceListByAssocID[i].atsTime,
//                                 responseJson.data.attendanceListByAssocID[i].ateTime);
//                         } else {
//                             console.log('not today attendance', responseJson.data.attendanceListByAssocID[i].atAttndID + ' '
//                                 + responseJson.data.attendanceListByAssocID[i].atsDate);
//                         }
//                         this.setState({
//                             dataSourceAttendance: responseJson.data.attendanceListByAssocID,
//                         })

//                     }

//                 } else {
//                     //alert('Not a Member');

//                 }

//             })
//             .catch((error) => {
//                 console.log('attendance ' + error)
//             })
//     }

//     insert_GuardAttendance(attendance_id, association_id, guard_id, imei_no, start_date, end_date, start_time, end_time) {
//         db.transaction(function (tx) {
//             tx.executeSql(
//                 'INSERT INTO Attendance (AttendanceID, AssociationID, GuardID, ImeiNo, StartDate, EndDate, StartTime, ' +
//                 ' EndTime ) VALUES (?,?,?,?,?,?,?,?)',
//                 [attendance_id, association_id, guard_id, imei_no, start_date, end_date, start_time, end_time],
//                 (tx, results) => {
//                     console.log('Results Attendance', results.rowsAffected);
//                 }
//             );
//         });
//     }

//     exitApp = () => {
//         RNExitApp.exitApp();
//     };
//     createEmergency = () => {
//         navigator.geolocation.getCurrentPosition((position) => {
//             lat = position.coords.latitude;
//             long = position.coords.longitude;
//             console.log('createEmergency gps ', lat + ' ' + long);
//             const currentposition = JSON.stringify(position);
//             console.log('createEmergency gps ', currentposition);
//             this.setState({ currentposition, lat, long });
//             console.log('createEmergency lat ', this.state.lat + ',' + this.state.long);
//         });

//         if (this.state.guard_tot_count != 0) {
//             console.log('createEmergency ', 'start ' + this.state.workerID);
//             anu = {
//                 "TTTktTyID": 1,
//                 "TKGPSPnt": this.state.lat + ',' + this.state.long,
//                 "TKRaisdBy": global.MyFirstName + ' ' + global.MyLastName,
//                 "TKRBCmnts": "Emergency",
//                 "TKRBEvid": "Emergency",
//                 "WKWorkID": this.state.workerID,
//                 "MEMemID": global.MyOYEMemberID,
//                 "TKEmail": "",
//                 "TKMobile": global.MyMobileNumber,
//                 "UNUnitID": global.SelectedUnitID,
//                 "ASAssnID": global.SelectedAssociationID
//             }

//             console.log('createEmergency ', anu)
//             fetch('http://' + global.oyeURL + '/oye247/api/v1/Ticketing/Create',
//                 {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
//                     },
//                     body: JSON.stringify(anu)
//                 })
//                 .then((response) => response.json())
//                 .then((responseJson) => {
//                     console.log('createEmergency responseJson ', responseJson);

//                     if (responseJson.success) {
//                         const imgName = 'Association' + global.SelectedAssociationID + 'INCIDENT' + responseJson.data.ticketingID + 'N' + '0' + '.jpg';
//                         console.log('ram', imgName);
//                         if (this.state.imgPath) {
//                             var data = new FormData();
//                             data.append('Test', { uri: this.state.imgPath, name: imgName, type: 'image/jpg' });
//                             const config = {
//                                 method: 'POST',
//                                 headers: { "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1", "content-type": "multipart/form-data" },
//                                 body: data
//                             };
//                             console.log("Config", config);
//                             fetch('http://cohapi.careofhomes.com/champ/api/v1/association/upload', config).then(responseData => {
//                                 console.log("sucess==>");
//                                 console.log(responseData._bodyText);
//                                 console.log(responseData);
//                                 //  alert("Image uploaded done! Image path=\nhttp://cohapi.careofhomes.com/Images/selfie.jpg")
//                                 //  this.props.navigation.navigate('ViewIncidentList');
//                             }).catch(err => {
//                                 console.log("err==>");
//                                 alert("Error with image upload!")
//                                 //  this.props.navigation.navigate('GuardListScreen');
//                                 console.log(err);
//                             });
//                         }
//                         fcmMsg = {
//                             "data": {
//                                 "activt": 'Emergency',
//                                 "unitID": global.SelectedUnitID,
//                                 "associationID": global.SelectedAssociationID,
//                                 "name": global.MyFirstName + " " + global.MyLastName,
//                                 "mob": global.MyMobileNumber,
//                                 "incidentId": responseJson.data.ticketingID,
//                                 "gps": '',//this.state.lat + ',' + this.state.long,
//                                 "gmtdatetime": moment(new Date()).format('YYYY-MM-DD HH:mm'),
//                             },
//                             "to": "/topics/AllGuards" + global.SelectedAssociationID,
//                         }
//                         console.log('fcmMsg ', fcmMsg);
//                         fetch('https://fcm.googleapis.com/fcm/send',
//                             {
//                                 method: 'POST',
//                                 headers: {
//                                     'Content-Type': 'application/json',
//                                     "Authorization": "key=AAAAZFz1cFA:APA91bHV9vd8g4zSMR13q_IYrNmza0e0m0EgG4BJxzaQOcH3Nc3RRrTfYNyRryEgz0iDQwXhP-XYHAGOIcgYjLOf2KnwYp-6_9XKNdiYzjakfnFFruYz89BXpc474OWJBU_ZzCScV6Zy",
//                                 },
//                                 body: JSON.stringify(fcmMsg)
//                             })
//                             .then((response) => response.json())
//                             .then((responseJson) => {
//                                 console.log('suvarna', responseJson);
//                                 alert('Alerted Guards successfully');

//                             })
//                             .catch((error) => {
//                                 console.error(error);
//                                 alert('caught error in fcmMsg');
//                             });

//                     } else {
//                         console.log('createEmergency', 'failed');
//                         Alert.alert('Alert', 'failed..!',
//                             [
//                                 { text: 'Ok', onPress: () => { } },
//                             ],
//                             { cancelable: false }
//                         );
//                     }

//                     console.log('suvarna', 'hi');
//                 })
//                 .catch((error) => {
//                     console.error(error);
//                     console.log('createEmergency err ', error);
//                     alert('caught error in create');

//                 });
//         } else {
//             alert('No on Duty Guards ');
//         }
//     };

//     deleteUser = () => {
//         var that = this;
//         db.transaction(tx => {
//             tx.executeSql(
//                 'DELETE FROM  Account ',
//                 [],
//                 (tx, results) => {
//                     console.log('Results', results.rowsAffected);
//                     if (results.rowsAffected > 0) {
//                         Alert.alert(
//                             'Log Out User',
//                             'Successfull',
//                             [
//                                 {
//                                     text: 'Ok',
//                                     onPress: () => that.props.navigation.navigate('MobileValid'),
//                                 },
//                             ],
//                             { cancelable: false }
//                         );
//                     } else {
//                         alert('Logged Out Failed');
//                     }
//                 }
//             );
//         });
//     };
//     onAssnPickerValueChange = (value, index) => {
//         global.SelectedAssociationID = value;
//         global.AssociationName = this.state.dataSourceAssnPkr[index].AsnName;
//         console.log('Results dataSourceAssnPkr AssID', value + ' ' + global.AssociationName);

//         this.setState(
//             {
//                 "AssnPickerValueHolder": value
//             },

//             () => {
//                 // here is our callback that will be fired after state change.
//                 //Alert.alert("Throttlemode", this.state.AssnPickerValueHolder+' ' +global.SelectedAssociationID);
//                 console.log('SelectedAssociationID ', this.state.AssnPickerValueHolder + ' ' + global.SelectedAssociationID);

//             }
//         );
//         this.fnSet_After_Association_Selected();

//         this.fnSet_MemberID_Role();
//         this.getAttendance_byAssociationID();
//     }
//     onUnitPickerValueChange = (value, index) => {
//         global.SelectedUnitID = value;
//         global.AssociationUnitName = this.state.dataSourceUnitPkr[index].UnitName;

//         console.log('Results dataSourceUnitPkr UnitID', value + ' ' + global.AssociationUnitName);
//         this.setState(
//             {
//                 "UnitPickerValueHolder": value
//             },

//             () => {
//                 // here is our callback that will be fired after state change.
//                 //Alert.alert("Throttlemode", this.state.AssnPickerValueHolder+' ' +global.SelectedAssociationID);
//                 console.log('SelectedUnitID ', this.state.UnitPickerValueHolder + ' ' + global.SelectedUnitID);

//             }
//         );

//         this.fnSet_MemberID_Role();
//     }

//     syncUnits(assnID) {

//         const url = global.champBaseURL + 'Unit/GetUnitListByAssocID/' + assnID;
//         console.log('syncUnits start ', url);
//         fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 "X-Champ-APIKey": "1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1",
//             },
//         })
//             .then((response) => response.json())
//             .then((responseJson) => {
//                 console.log('unitlist in ', responseJson)
//                 this.setState({
//                     isLoading: false
//                 })

//                 if (responseJson.success) {
//                     console.log('ravii', responseJson);
//                     console.log('responseJson count unit ', responseJson.data.unit.length);
//                     db.transaction(tx => {
//                         tx.executeSql('delete  FROM OyeUnit where AssociationID=' + assnID, [], (tx, results) => {
//                             console.log('Results Attendance delete ', results.rowsAffected);
//                         });
//                     });
//                     for (let i = 0; i < responseJson.data.unit.length; ++i) {
//                         //     temp.push(results.rows.item(i));

//                         console.log('Results unit', responseJson.data.unit[i].unUniName + ' ' + responseJson.data.unit[i].unUnitID);

//                         this.insert_units(responseJson.data.unit[i].unUnitID,
//                             responseJson.data.unit[i].asAssnID,
//                             responseJson.data.unit[i].unUniName, responseJson.data.unit[i].unUniType,
//                             responseJson.data.unit[i].flFloorID, responseJson.data.unit[i].unIsActive,
//                             responseJson.data.unit[i].parkingLotNumber);

//                     }

//                     db.transaction(tx => {

//                         tx.executeSql('SELECT Distinct M.OYEUnitID, A.UnitName FROM MyMembership M inner Join OyeUnit A on M.OYEUnitID=A.UnitID and M.AssociationID=' + global.SelectedAssociationID, [], (tx, results) => {
//                             var temp = [];
//                             for (let i = 0; i < results.rows.length; ++i) {
//                                 temp.push(results.rows.item(i));
//                                 console.log('dataSourceUnitPkr UnitID', results.rows.item(i).UnitName + ' ' + results.rows.item(i).OYEUnitID);
//                                 global.AssociationUnitName = results.rows.item(0).UnitName;
//                                 global.SelectedUnitID = results.rows.item(0).OYEUnitID;
//                             }

//                             this.setState({
//                                 dataSourceUnitPkr: temp,
//                             });
//                         });
//                     });

//                     this.fnSet_MemberID_Role();

//                 } else {
//                     console.log('failurre')
//                 }
//             })
//             .catch((error) => {
//                 this.setState({

//                     isLoading: false
//                 })
//                 console.log(error)
//                 console.log('unitlist err ', error)

//             })
//     }

//     insert_units(unit_id, association_id, UnitName, type, admin_account_id, created_date_time, parking_slot_number
//     ) {
//         db.transaction(function (tx) {
//             //// OyeUnit(UnitID integer , " +
//             //" AssociationID integer , UnitName VARCHAR(20) ,  Type VARCHAR(20) , AdminAccountID integer , " +
//             //" CreatedDateTime VARCHAR(20),  ParkingSlotNumber VARCHAR(20) )
//             tx.executeSql(
//                 'INSERT INTO OyeUnit (UnitID, AssociationID, UnitName, Type, AdminAccountID, CreatedDateTime,  ' +
//                 '  ParkingSlotNumber ) VALUES (?,?,?,?,?,?,?)',
//                 [unit_id, association_id, UnitName, type, admin_account_id, created_date_time, parking_slot_number],
//                 (tx, results) => {
//                     console.log('INSERT oyeUnits ', results.rowsAffected + ' ' + association_id);

//                 }
//             );
//         });
//     }

//     render() {
//         {/* <View style={styles.container}>
//         <Text>Main</Text>
//         <Button onPress={() => this.props.navigation.navigate("Detail")} title="Detail Page" />
//       </View> */}
//         hour = new Date().getHours();
//         if (hour < 12) {
//             salutation = 'Good Morning';
//         } else if (hour >= 12 && hour < 17) {
//             salutation = 'Good Afternoon';
//         } else if (hour >= 17 && hour < 24) {
//             salutation = 'Good Evening';
//         }
//         return (

//             <View style={{
//                 paddingTop: 2, backgroundColor: 'white',height:'100%',
//                 marginTop: 1
//             }}>
//                 <View>
//                     {/*  <View
//             style={{
//               paddingTop: 2, paddingRight: 2, paddingLeft: 2, flexDirection: 'row', paddingBottom: 2,
//               borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
//             }}>
//             <TouchableOpacity onPress={() =>  navigation.openDrawer()}
//               style={{ flex: 1, alignSelf:'center' }}>
//               <Image source={require('../pages/assets/images/menu_button.png')}
//                 style={{ height: 25, width: 25, marginLeft: 10, alignSelf: 'center' }} />
//             </TouchableOpacity>
//             <Text style={{ flex: 2, paddingLeft: 5, fontSize: 14, color: 'black', alignContent: 'flex-start', alignSelf: 'center' }}> </Text>
//             <View style={{ flex: 6, alignSelf: 'center' }}>
//               <Image source={require('../pages/assets/images/OyeSpace_hor.png')}
//                 style={{
//                   height: 35, width: 105, margin: 5,
//                   alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
//                 }} />
//             </View>
//             <View style={{ flex: 3, alignSelf: 'center' }}>
//             <View style={{ flex: 1, color: 'white', backgroundColor: 'white', }} >
//                             <Text style={{
//                                 justifyContent: 'flex-end', textAlign: 'center',
//                                 fontSize: 13, padding: 10, color: 'white', backgroundColor: 'red',
//                             }}
//                                 onPress={this.createEmergency.bind(this)}
//                             >SOS</Text>
//                         </View>
//             </View>
//           </View>
//           <View style={{ backgroundColor: 'lightgrey', flexDirection: "row", width: '100%', height: 1, }}></View> */}
//                 <View style={{
//         backgroundColor: '#ffffff',
//         flexDirection: "row",
//         marginTop: 15
//       }}>
//      {/*  <Image
//              source={require('../pages/assets/images/menu_button.png')}
//             style={{ width: 30, height: 30, marginLeft: 15 ,alignSelf: 'flex-start',
//           }}
//           />
//           <Text style={{
//             color: '#000000', fontSize: 13, fontFamily: Fonts.Tahoma,
//             textAlign: 'center'
//           }}> Dashboard</Text> */}
//           <TouchableOpacity
//                                 style={{
//                                     paddingTop: 2, paddingRight: 2, paddingLeft: 2, flex: 2, alignItems: 'center', flexDirection: 'row',
//                                     paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
//                                 }}
//                                 onPress={() => this.props.navigation.navigate('SideMenu')}  /*Products is navigation name*/>
//                                 <Image source={require('../pages/assets/images/menu_button.png')}
//                                     style={{ height: 25, width: 25, margin: 5, alignSelf: 'center' }} />
//                                 <Text style={{ fontSize: 12, paddingLeft: 5,  color: 'black', alignSelf: 'center' }}>Dashboard</Text>
//                             </TouchableOpacity>
//       </View> 
//       <View style={{
//         backgroundColor: 'lightgrey',
//         flexDirection: "row",
//         height:1,width:'100%'

//       }}>
    
         
//       </View> 
//                 </View>
//                 <ScrollView style={{ backgroundColor: 'white', flexDirection: "column" }}>
//                     {/* <Text>Guards Attendance {global.SelectedAssociationID} {global.SelectedUnitID}  {global.MyEmail}
//             {global.MyMobileNumber} {global.SelectedRole} {global.SelectedRole1}
//            </Text>Subscription Valid till: {this.state.SubscriptionValidity} */}

//                     <View style={{
//                         marginLeft: '2%', marginTop: 2, paddingRight: 20, flexDirection: 'row',
//                         borderRadius: 5, flex: 6, backgroundColor: 'white',
//                         width: '100%',
//                     }}>
//                         <View style={{
//                             flex: 1,
//                             color: 'white', backgroundColor: 'white',
//                         }} >
//                         </View>
//                         <Text style={{
//                             flex: 4,
//                             color: '#000000', fontSize: 13, padding: 10, 
//                             fontWeight: 'bold', textAlign: 'center'
//                         }}>{salutation} {global.MyFirstName},
//           </Text>
//                         {/*   */}
//                         <View style={{ flex: 1, color: 'white', backgroundColor: 'white', }} >
//                             <Text style={{
//                                 justifyContent: 'flex-end', textAlign: 'center',
//                                 fontSize: 13, padding: 10, color: 'white', backgroundColor: 'red',
//                             }}
//                                 onPress={this.createEmergency.bind(this)}
//                             >SOS</Text>
//                         </View>

//                     </View>
//                     <View style={{ flexDirection: "row" }}>
//                         <Picker
//                             selectedValue={this.state.AssnPickerValueHolder}
//                             style={{ width: '60%' }}
//                             onValueChange={this.onAssnPickerValueChange} >

//                             {this.state.dataSourceAssnPkr.map((item, key) => (
//                                 <Picker.Item label={item.AsnName} value={item.AssociationID} key={key} />)
//                             )}

//                         </Picker>
//                         {/*   onValueChange={(itemValue, itemIndex) => {global.SelectedAssociationID=itemValue}} >
//  */}
//                         <Picker
//                             selectedValue={this.state.UnitPickerValueHolder}
//                             style={{ width: '40%' }}
//                             onValueChange={this.onUnitPickerValueChange} >

//                             {this.state.dataSourceUnitPkr.map((item, key) => (
//                                 <Picker.Item label={item.UnitName} value={item.OYEUnitID} key={key} />)
//                             )}

//                         </Picker>
//                         {/* onValueChange={(itemValue, itemIndex) => { global.SelectedUnitID = itemValue }} */}
//                     </View>
//                     {/*  <ProgressBarClassic
//                     label={'Guards'}
//   progress={20}
//   valueStyle={'default'}
// />  */}
//                     <View style={{
//                         flexDirection: "column", backgroundColor: 'white', padding: 10, borderColor: '#ED8A19',
//                         margin: '2%', borderRadius: 5, borderWidth: 1, width: '96%', alignItems: 'center',
//                     }}>

//                         {/* <Pie
//                             radius={radiusHeight}
//                             //completly filled pie chart with radius 70
//                             series={[25, 30, 45]}
//                             innerRadius={radiusHeight - 30}
//                             //values to show and color sequentially
//                             colors={['#ED8A19', '#5B618A', '#E3D081']}
//                             style={{ alignSelf: 'center' }}
//                         />  */}
//                         <Image source={require('../pages/assets/images/guard_piechart_dashboard.png')}
//                             style={{ height: 80, width: 50, margin: 2, alignSelf: 'center' }} />
//                         {/*  <ProgressBarClassic
//                     label={'Guards'}
//   progress={20}
//   valueStyle={'default'}
// />  */}
//                         <Text style={{ fontSize: 13, color: 'black', margin: 5 }} >Guards Attendance {this.state.guard_onduty_count}/{this.state.guard_tot_count}</Text>
//                         <View style={{
//                             flexDirection: 'column', marginLeft: '2%', marginTop: 2, height: 40, backgroundColor: 'white',
//                         }}>

//                             {/* <ProgressBarClassic
//                     label={'Guards'} 
//                     fillColor={'red'} 
//           backgroundColor={'white'} 
//           borderColor={'#2f96F3'} 
//   progress={20}
//   valueStyle={'default'}
// /> */}
//                             <TouchableOpacity
//                                 style={{
//                                     paddingTop: 2, paddingRight: 12, paddingLeft: 12, flex: 1, alignItems: 'center',
//                                     paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
//                                 }}
//                                 onPress={() => this.props.navigation.navigate('GuardListScreen')}  /*Products is navigation name*/>
//                                 <Image source={require('../pages/assets/images/eye_orange.png')}
//                                     style={{ height: 20, width: 25, margin: 2, alignSelf: 'center' }} />
//                                 <Text style={{ fontSize: 13,  color: 'black', paddingBottom: 10 }}> View Guard List </Text>
//                             </TouchableOpacity>
//                         </View>

//                     </View>
//                     <View style={{
//                         flexDirection: "column", backgroundColor: 'white', padding: 10, borderColor: '#ED8A19',
//                         margin: '2%', borderRadius: 5, borderWidth: 1, width: '96%', alignItems: 'center',
//                     }}>
//                         {/*    <Pie
//                             radius={radiusHeight}
//                             //completly filled pie chart with radius 70
//                             series={[25, 30, 45]}
//                             innerRadius={radiusHeight - 30}
//                             //values to show and color sequentially
//                             colors={['#ED8A19', '#5B618A', '#E3D081']}
//                         />  */}
//                         <Image source={require('../pages/assets/images/pasted_mage.png')}
//                             style={{ height: 80, width: 80, margin: 2, alignSelf: 'center' }} />
//                         <Text style={{ fontSize: 13, color: 'black', margin: 5 }} >Occupied {this.state.units_occupied_count}/{this.state.units_tot_count}</Text>

//                         <View style={{
//                             flexDirection: 'column', marginLeft: '2%', marginTop: 5, height: 40, backgroundColor:
//                                 'white',
//                         }}>

//                             <TouchableOpacity
//                                 style={{
//                                     paddingTop: 2, paddingRight: 12, paddingLeft: 12, flex: 1, alignItems: 'center',
//                                     paddingBottom: 2, borderColor: 'white', borderRadius: 0, borderWidth: 2, textAlign: 'center',
//                                 }}
//                                 onPress={() => this.props.navigation.navigate('ViewmembersScreen')}  /*Products is navigation name*/>
//                                 <Image source={require('../pages/assets/images/eye_orange.png')}
//                                     style={{ height: 20, width: 25, margin: 2, alignSelf: 'center' }} />
//                                 <Text style={{ fontSize: 13, color: 'black', paddingBottom: 10 }}> View Members </Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                     <View >

//                         {/*  <Mybutton
//               title="Log OUT "
//               customClick={this.deleteUser.bind(this)}
//             /> */}


//                         {/*  <Mybutton
//               title="NotificationScreen   "
//               customClick={() => this.props.navigation.navigate('NotificationScreen')}
//             />
//             <Mybutton
//               title="NotificationScreen  2 "
//               customClick={() => this.props.navigation.navigate('NotificationScreen2')}
//             />
           
//  */}
//                         {/*  <Mybutton
//               title="Image Upload"
//               customClick={() => this.props.navigation.navigate('UploadImageScreen')}
//             /> */}
//                         {/* <Mybutton
//                             title="BottomNavigationScreen"
//                             customClick={() => this.props.navigation.navigate('BottomNavigationScreen')}
//                         />
//                         <Mybutton
//                             title="ResDashBoard"
//                             customClick={() => this.props.navigation.navigate('ResDashBoard')}
//                         /> */}
//                     </View>
//                     <View style={{ backgroundColor: 'white', flexDirection: "row" }}>
//                         {/*  <Mybutton
//               title="Exit "
//               customClick={this.exitApp.bind(this)}
//             /> */}
//                     </View>
//                     <View style={{ backgroundColor: 'white', flexDirection: "row" }}>

//                         {/* <Pie
//           radius={70}
//           //completly filled pie chart with radius 70
//           innerRadius={40}
//           //to make donut pie chart define inner radius
//           series={[10, 20, 30, 40]}
//           //values to show and color sequentially
//           colors={['#f00', '#0f0', '#00f', '#ff0']}
//         />
//         <Text>Donut Pie Chart</Text>
//           <Pie
//             radius={70}
//             //completly filled pie chart with radius 100
//             innerRadius={65}
//             series={[55]}
//             //values to show and color sequentially
//             colors={['#f00']}
//             backgroundColor="#ddd"
//           /> */}
//                     </View>

//                 </ScrollView>
//                 {/*  <View style={{ flexDirection: "row",height:'100%',width:'50%', position: 'absolute',
//     top: 0, left: 0,backgroundColor:'yellow' }}>
//            </View> */}
//             </View>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center'
//     }
// });

// export default MainScreen;