import React, { Fragment, PureComponent } from 'react';
import {
    ActivityIndicator,
    BackHandler,
    Dimensions,
    FlatList,
    Image,
    Linking,
    Platform,
    RefreshControl,
    SafeAreaView, ScrollView,
    StyleSheet,
    Text, TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View, ImageBackground, TextInput, Alert, KeyboardAvoidingView
} from 'react-native';
import { connect } from 'react-redux';
import { Icon, withBadge } from 'react-native-elements';
import {
    getNotifications,
    onEndReached,
    onNotificationOpen,
    refreshNotifications,
    storeOpenedNotif,
    toggleCollapsible,
    onGateApp,
    createUserNotification,
    toggleAllCollapsible,
    segregateUnitNotification,
    segregateAdminNotification,
    segregateDummyUnitNotification,
    segregateDummyAdminNotification,
    toggleUnitCollapsible,
    toggleAdminCollapsible
} from '../../actions';
import _ from 'lodash';
import { NavigationEvents } from 'react-navigation';
import Collapsible from 'react-native-collapsible';
import {
    heightPercentageToDP,
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import axios from 'axios';
import moment from 'moment';
import firebase, { notifications } from 'react-native-firebase';
import * as fb from 'firebase';
import base from '../../base';
import gateFirebase from 'firebase';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import IcoMoonConfig from '../../assets/selection.json';
import timer from 'react-native-timer';
import LottieView from "lottie-react-native";
import Modal from "react-native-modal";
import CreateSOSStyles from "../SOS/CreateSOSStyles";
import ElevatedView from 'react-native-elevated-view';
import { CLOUD_FUNCTION_URL } from '../../../constant';
import OSButton from "../../components/osButton/OSButton";
import ProgressLoader from 'rn-progress-loader';




//const Icon = createIconSetFromIcoMoon(IcoMoonConfig);


class NotificationScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            gateDetails: [],
            Date: [],
            Time: [],
            Date1: [],
            Time1: [],
            visitorID: [],

            buttonData: '',
            deleteNotList: [],
            selectedImage: "",
            isModalOpen: false,
            headerText: "Notifications",
            selectedView: 0,
            unitNotification: [],
            adminNotification: [],
            searchKeyWord: "",
            userRole: 1,
            unitNotificationCopy: [],
            adminNotificationCopy: [],
            unitIDD: '',
            dataSource: [],
            requestorMob: '',
            data: [],

            dataSource1: [],
            requestorMob1: '',

            dataSource2: [],
            dataSource3: '',
            isModalOpen1: false,
            detailsToReject: {},
            allNotifications: [],
            isLoading: false
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            isModalOpen: false
        })
       // this.segregateNotification();
    }


    componentDidMount() {

        console.log("USer Reducer Data:", this.props.getNotifications);
        this.listenToFirebase()
        this.setState({
            userRole: this.props.dashBoardReducer.role,
            isLoading: true
        })

        if (Platform.OS != 'ios') {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        }

        this.props.getNotifications(this.props.oyeURL,this.props.MyAccountID)



        axios
            .get(`http://${this.props.oyeURL}/oyesafe/api/v1/GetCurrentDateTime`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
                }
            })
            .then(res => {
                this.setState({ currentTime: res.data.data.currentDateTime,isLoading:false }, () => {


                  //  this.segregateNotification();

                });
            })
            .catch(error => {
                this.setState({ currentTime: 'failed' }, () => {
                 //   this.segregateNotification();
                });
            });
    }

    listenToFirebase() {
        let self = this;
        let associationList = self.props.dashBoardReducer.dropdown;

        for (let i in associationList) {
            let associationId = associationList[i].associationId;
            console.log("Association List:", associationList[i]);
            let associationPath = `syncdashboard/isAssociationRefreshing/${associationId}`;
            let announcementPath = `syncdashboard/isAnnouncementRefreshing/${associationId}`;
            fb.database().ref(announcementPath).on('value', function (snapshot) {
                let receivedData = snapshot.val();
                console.log("Received Data while listening to notification:", receivedData,associationId);
                //if(receivedData !== null){
                    
                    self.refreshNotification();
                //}
            })

            if(associationList[i].roleId === 1){
                fb.database().ref(associationPath).on('value', function (snapshot) {
                    let receivedData = snapshot.val();
                    console.log("Received Data while listening to notification:", receivedData,associationId);
                    if(receivedData !== null){

                        self.refreshNotification();
                    }
                })
            }
        }
    }

   refreshNotification(){
        const {getNotifications} = this.props;
        getNotifications(this.props.oyeURL,this.props.MyAccountID,1,this.props.notifications);
        
    }

    segregateNotification() {

        let notificationList = this.props.notifications;
        console.log('Calling this function', notificationList)
        let unitNotification = [];
        let adminNotification = [];

        for (let i in notificationList) {
            if (notificationList[i].ntType === "joinrequest" || notificationList[i].ntType === "Join" || notificationList[i].ntType === "Join_Status") {
                adminNotification.push(notificationList[i])
            } else {
                unitNotification.push(notificationList[i])
            }
        }

        this.props.segregateUnitNotification(unitNotification);
        this.props.segregateAdminNotification(adminNotification);
        this.props.segregateDummyUnitNotification(unitNotification);
        this.props.segregateDummyAdminNotification(adminNotification);

        this.setState({
            unitNotificationCopy: unitNotification,
            adminNotificationCopy: adminNotification,
            isLoading: false
        })

    }


    componentWillUnmount() {

        if (Platform.OS != 'ios') {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        }
    }

    handleBackButtonClick() {
        this.props.toggleAllCollapsible(this.props.notifications);
        this.props.navigation.goBack(null);
        return true;
    }

    processBackPress() {
        const { goBack } = this.props.navigation;
        goBack(null);
    }

    keyExtractor = (item, index) => index.toString();

    onPress = (item, index) => {
        const { notifications, savedNoifId, oyeURL } = this.props;
        if (
            item.ntType === 'Join' ||
            item.ntType === 'Join_Status'

            // item.ntType === "gate_app"
        ) {
            this.props.navigation.navigate('NotificationDetailScreen', {
                details: item,
                index,
                notifications,
                oyeURL,
                savedNoifId,
                ntid: item.ntid
            });
            // this.props.onNotificationOpen(notifications, index, oyeURL);
            // this.props.storeOpenedNotif(savedNoifId, item.ntid);
        } else if (item.ntType === 'Announcement') {
            //Seperate Page i'll write
            this.props.navigation.navigate('NotificationAnnouncementDetailScreen', {
                notifyid: item.acNotifyID,
                associationid: item.asAssnID,
                accountid: item.acAccntID,
                index,
                notifications,
                oyeURL,
                savedNoifId,
                ntid: item.ntid
            });
        }
    };

    acceptgateVisitor = (visitorId, index, associationid, visitorStatus, notifiId, approvedBy) => {


        console.log('SENDING STATUS TO ACCEPT NOTIFICATION', visitorId, index, associationid, visitorStatus, notifiId, approvedBy)
        let oldNotif = [...this.props.notifications];
        oldNotif[index].opened = true;
        this.props.onGateApp(oldNotif);
        let delArray = [];
        if (visitorStatus == "ExitApproved") {
            for (let i = 0; i < oldNotif.length; i++) {

                if (oldNotif[i].vlVisLgID === visitorId) {
                    if (oldNotif[i].ntid != notifiId) {
                        delArray.push({ "NTID": oldNotif[i].ntid })
                    }
                }
            }
        }
        console.log('DELETE ARRAY NOTIFICATION', delArray)

        axios
            .get(`http://${this.props.oyeURL}/oyesafe/api/v1/GetCurrentDateTime`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
                }
            })
            .then(res => {
                this.setState({ currentTime: res.data.data.currentDateTime });

                axios
                    .post(
                        `http://${this.props.oyeURL}/oyesafe/api/v1/UpdateApprovalStatus`,
                        {
                            VLApprStat: visitorStatus,
                            VLVisLgID: visitorId,
                            VLApprdBy: visitorStatus == "EntryApproved" ? this.props.userReducer.MyFirstName : approvedBy,
                            VLExAprdBy: visitorStatus == "ExitApproved" ? this.props.userReducer.MyFirstName : "",

                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
                            }
                        }
                    )
                    .then(responses => {
                        gateFirebase
                            .database()
                            .ref(`NotificationSync/A_${associationid}/${visitorId}`)
                            .set({
                                buttonColor: '#75be6f',
                                opened: true,
                                newAttachment: false,
                                visitorlogId: visitorId,
                                updatedTime: res.data.data.currentDateTime,
                                status: visitorStatus,
                            });

                        axios
                            .delete(
                                `http://${this.props.oyeURL}/oyesafe/api/v1/DeleteOldNotifications`,
                                {
                                    headers: {
                                        'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE',
                                        'Content-Type': 'application/json'
                                    },
                                    data: {
                                        Notification: delArray
                                    }
                                },


                            )
                            .then(responses => {
                                console.log('RESPONSE1111', responses)
                            })
                            .catch(e => {
                                console.log('RESPONSE2222', e)
                            })
                        this.props.getNotifications(this.props.oyeURL, this.props.MyAccountID);
                        this.props.navigation.navigate('ResDashBoard');


                    })
                    .catch(e => {
                        console.log(e);
                        this.props.getNotifications(this.props.oyeURL, this.props.MyAccountID);
                        this.props.navigation.navigate('ResDashBoard');

                    });
            })
            .catch(error => {
                console.log(error, 'erro_fetching_data');
                this.setState({ currentTime: 'failed' });

                gateFirebase
                    .database()
                    .ref(`NotificationSync/A_${associationid}/${visitorId}`)
                    .set({
                        buttonColor: '#75be6f',
                        opened: true,
                        newAttachment: false,
                        visitorlogId: visitorId,
                        updatedTime: null,
                        status: visitorStatus

                        // status:
                    })
                    .then(() => {
                        //    if (item.opened) {
                        //      this.props.onNotificationOpen(notifications, index, oyeURL);
                        //    }
                    });
                this.props.getNotifications(this.props.oyeURL, this.props.MyAccountID);
                this.props.navigation.navigate('ResDashBoard');

            });
    };

    declinegateVisitor = (visitorId, index, associationid, visitorStatus, notifiId, approvedBy) => {
        console.log('SENDING STATUS TO ACCEPT NOTIFICATION!!!!!', visitorId, index, associationid, visitorStatus, notifiId, approvedBy)
        //visitorId, index, associationid, visitorStatus, notifiId, approvedBy
        let oldNotif = [...this.props.notifications];
        oldNotif[index].opened = true;
        this.props.onGateApp(oldNotif);
        let delArray = [];
        if (visitorStatus == "ExitRejected") {
            for (let i = 0; i < oldNotif.length; i++) {

                if (oldNotif[i].vlVisLgID === visitorId) {
                    if (oldNotif[i].ntid != notifiId) {
                        delArray.push({ "NTID": oldNotif[i].ntid })
                    }
                }
            }
        }
        console.log('DELETE ARRAY NOTIFICATION!!!!!!', delArray)


        axios
            .get(`http://${this.props.oyeURL}/oyesafe/api/v1/GetCurrentDateTime`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
                }
            })
            .then(res => {
                console.log(res.data, 'current time');
                this.setState({ currentTime: res.data.data.currentDateTime });
                axios
                    .post(
                        `http://${this.props.oyeURL}/oyesafe/api/v1/UpdateApprovalStatus`,
                        {
                            VLApprStat: visitorStatus,
                            VLVisLgID: visitorId,
                            VLApprdBy: visitorStatus == "EntryRejected" ? this.props.userReducer.MyFirstName : approvedBy,
                            VLExAprdBy: visitorStatus == "ExitRejected" ? this.props.userReducer.MyFirstName : "",
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
                            }
                        }
                    )
                    .then(response => {
                        gateFirebase
                            .database()
                            .ref(`NotificationSync/A_${associationid}/${visitorId}`)
                            .set({
                                buttonColor: '#ff0000',
                                opened: true,
                                newAttachment: false,
                                visitorlogId: visitorId,
                                updatedTime: res.data.data.currentDateTime,
                                status: visitorStatus, //"EntryRejected"

                            });
                        axios
                            .delete(
                                `http://${this.props.oyeURL}/oyesafe/api/v1/DeleteOldNotifications`,
                                {
                                    headers: {
                                        'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE',
                                        'Content-Type': 'application/json'
                                    },
                                    data: {
                                        Notification: delArray
                                    }
                                },
                            )
                            .then(responses => {
                                console.log('RESPONSE1111', responses)
                            })
                            .catch(e => {
                                console.log('RESPONSE2222', e)
                            })
                        this.props.getNotifications(this.props.oyeURL, this.props.MyAccountID);
                        this.props.navigation.navigate('ResDashBoard');
                    })
                    .catch(e => {
                        console.log(e);
                        this.props.getNotifications(this.props.oyeURL, this.props.MyAccountID);
                        this.props.navigation.navigate('ResDashBoard');

                    });
            })
            .catch(error => {
                console.log(error, 'erro_fetching_data');
                this.setState({ currentTime: 'failed' });
                gateFirebase
                    .database()
                    .ref(`NotificationSync/A_${associationid}/${visitorId}`)
                    .set({
                        buttonColor: '#ff0000',
                        opened: true,
                        newAttachment: false,
                        visitorlogId: visitorId,
                        updatedTime: null,
                        status: visitorStatus, //"EntryRejected"

                    });
                this.props.getNotifications(this.props.oyeURL, this.props.MyAccountID);
                this.props.navigation.navigate('ResDashBoard');

            });
    };


    renderItem = ({ item, index }) => {

        const { savedNoifId, notifications, oyeURL } = this.props;

        let status = _.includes(savedNoifId, item.ntid);
        var opens = null;
        gateFirebase
            .database()
            .ref(`NotificationSync/A_${item.asAssnID}/${item.vlVisLgID}`)
            .on('value', function (snapshot) {
                let val = snapshot.val();
                if (val !== null) {
                    console.log(val, 'value_firebase');
                    opens = val.opened;
                    console.log('__OPEN__', opens);
                }
            });
        let inDate = moment()._d
        let enDate = moment(item.ntdCreated)._d
        let duration = Math.abs(inDate - enDate);
        //let duration2=Math.ceil(duration / (1000 * 60 * 60 * 24));
        let days = Math.floor(duration / (1000 * 60 * 60 * 24));
        let hours = Math.floor(duration / (1000 * 60 * 60));
        let mins = Math.floor(duration / (1000 * 60));
        let valueDis = days > 1 ? moment(item.ntdCreated).format('DD MMM YYYY') : days == 1 ? "Yesterday" : mins >= 120 ? hours + " hours ago" : (mins < 120 && mins >= 60) ? hours + " hour ago"
            : mins == 0 ? "Just now" : mins + " mins ago";
        //if(item.ntType !== 'gate_app'){
        if (item.ntType === 'Announcement') {
            return (
                <TouchableOpacity style={{
                    borderRadius: 5, borderColor: base.theme.colors.lightgrey, backgroundColor: base.theme.colors.white,
                    shadowColor: base.theme.colors.greyHead,
                    shadowOffset: { width: 0, height: Platform.OS === 'ios' ? 3 : 0.5 },
                    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.2,
                    shadowRadius: 0.5, elevation: 3, borderBottomWidth: 0.5,
                    width: '100%',
                    height: 80,
                    marginTop: 10,
                    marginBottom: this.props.notifications.length - 1 == index ? 100 : 0
                }} onPress={() => this.onPress(item, index)}>
                    <View style={{ flexDirection: 'row', width: '100%', height: 80, backgroundColor: base.theme.colors.shadedWhite }}>
                        <View style={{ width: '15%', }}>
                            {item.ntType == "Announcement" ?
                                <Image
                                    resizeMode={'center'}
                                    style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}
                                    source={require('../../../icons/notifn_announcement.png')}
                                />
                                : item.ntIsActive ?
                                    <Image
                                        resizeMode={'center'}
                                        style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}
                                        source={require('../../../icons/notification2.png')}
                                    /> : <Image
                                        resizeMode={'center'}
                                        style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}
                                        source={require('../../../icons/notification1.png')}
                                    />
                            }

                        </View>
                        <View style={{ width: '65%', marginTop: 20 }}>
                            <Text style={{ color: base.theme.colors.black, fontSize: 12 }}>{item.ntDesc} </Text>
                        </View>
                        <View style={{ width: '20%', marginTop: 20 }}>
                            <Text style={{ color: base.theme.colors.grey, fontSize: 12 }}>{valueDis}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
        else if (item.ntType !== 'gate_app') {
            return (
                <TouchableOpacity activeOpacity={0.7} style={{
                    borderRadius: 5, borderColor: base.theme.colors.lightgrey, backgroundColor: base.theme.colors.white,
                    shadowColor: base.theme.colors.greyHead,
                    shadowOffset: { width: 0, height: Platform.OS === 'ios' ? 3 : 0.5 },
                    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.2,
                    shadowRadius: 0.5, elevation: 3, borderBottomWidth: 0.5,
                    width: '100%',
                    marginTop: 10,
                    marginBottom: this.props.notifications.length - 1 == index ? 100 : 0,
                    height: item.open === undefined || item.open ? hp('30') : hp('48')
                }}
                    onPress={() => {
                        if (item.ntIsActive) {
                            //this.openNotification(notifications,index,oyeURL)
                            this.props.onNotificationOpen(notifications, index, oyeURL, item.ntid);
                            //  this.toggledCollapsible(notifications, item.open, index, item);
                            this.props.toggleAdminCollapsible(this.props.adminNotification, item.open, index, item)
                            this.expandAdminNotification(this.props.adminNotification, index, item)
                        }
                        else {
                            //this.toggledCollapsible(notifications, item.open, index, item)
                            this.props.toggleAdminCollapsible(this.props.adminNotification, item.open, index, item)
                            this.expandAdminNotification(this.props.adminNotifications, index, item)
                        }

                    }}>


                    <View style={{
                        backgroundColor: base.theme.colors.greyCard
                    }}>
                        <View style={{
                            flexDirection: 'row', backgroundColor: item.vlVisType == "Delivery" && item.vlApprStat == "Entry Pending" && item.ntIsActive ? "#FFE49B" : base.theme.colors.greyCard,
                            alignItems: 'center', justifyContent: 'space-between',
                            borderBottomWidth: 0.5, borderBottomColor: base.theme.colors.greyHead, height: 50
                        }}>
                            {item.ntIsActive ? //item.read -->Not updating
                                <Image
                                    resizeMode={'center'}
                                    style={{ width: 50, height: 50, }}
                                    source={require('../../../icons/notification2.png')}
                                />
                                :
                                <Image
                                    resizeMode={'center'}
                                    style={{ width: 50, height: 50, }}
                                    source={require('../../../icons/notification1.png')}
                                />
                            }
                            <Text style={{ fontSize: 16, color: base.theme.colors.black }}>{item.asAsnName}</Text>
                            <Text style={{ fontSize: 14, color: base.theme.colors.grey, marginRight: 5 }}>{valueDis}</Text>

                        </View>
                        <View style={{ hp: hp('15'), position: 'relative', flexDirection: "row", justifyContent: 'space-around', width: wp('80'), alignSelf: 'center' }}>
                            <Text style={{ width: wp('33'), alignSelf: 'center' }}>{item.mrRolName}</Text>
                            <View style={{ width: wp('33'), alignSelf: 'center' }}>
                                {item.ntType !== 'Join_Status' && item.ntType !== "Join" ? null : this.renderButton(item)}
                            </View>
                            <Text onPress={() => {
                                Platform.OS === 'android'
                                    ? Linking.openURL(`tel:${this.state.requestorMob1}`)
                                    : Linking.openURL(`telprompt:${this.state.requestorMob1}`);
                            }} style={{ width: wp('33'), alignSelf: 'center', borderWidth: 0, textAlign: 'center' }}>{this.state.requestorMob1}</Text>
                        </View>
                    </View>
                    <View style={{ backgroundColor: base.theme.colors.white, top: hp('6') }}>
                        <Collapsible duration={100} collapsed={item.open}

                        >
                            <View
                                style={{
                                    width: '100%',
                                    flexDirection: 'column',
                                    //marginTop: hp('5%'),
                                    marginLeft: hp('2%'),
                                    backgroundColor: 'white'
                                }}
                            >
                                <View>{this.renderDetails(item, notifications, index, oyeURL)}</View>
                                <View
                                    style={{
                                        borderWidth: 1,
                                        borderColor: base.theme.colors.greyCard,
                                        marginTop: hp('1%'),
                                        marginBottom: hp('3%')
                                    }}
                                />
                            </View>
                        </Collapsible>
                        <TouchableOpacity style={{
                            alignSelf: 'center', top: hp('2'), width: '100%',
                            alignItems: 'center', justifyContent: 'center', borderWidth: 0
                        }} onPress={() => {
                            this.expandAdminNotification(notifications, index, item);
                            //this.toggledCollapsible(notifications, item.open, index, item)
                            this.props.toggleCollapsible(notifications, item.open, index, item)
                            if (item.ntIsActive) {
                                //this.openNotification(notifications, index, oyeURL);
                                this.props.onNotificationOpen(notifications, index, oyeURL, item.ntid);
                            }

                        }}>
                            <View style={{
                                width: 45,
                                borderRadius: 15,
                                height: 4,
                                backgroundColor: base.theme.colors.lightgrey,
                                alignSelf: 'center'
                            }} >
                            </View>
                        </TouchableOpacity>

                    </View>
                </TouchableOpacity>
            )
        }
        else {
            console.log("GET THE DETAILS GET THE DETAILS", item)
            return (
                <TouchableOpacity activeOpacity={0.7} style={{
                    borderRadius: 5, borderColor: base.theme.colors.lightgrey, backgroundColor: base.theme.colors.white,
                    shadowColor: base.theme.colors.greyHead,
                    shadowOffset: { width: 0, height: Platform.OS === 'ios' ? 3 : 0.5 },
                    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.2,
                    shadowRadius: 0.5, elevation: 3, borderBottomWidth: 0.5,
                    width: '100%',
                    marginTop: 10,
                    marginBottom: this.props.unitNotification.length - 1 == index ? 100 : 0
                }}
                    onPress={() => {
                        this.props.toggleUnitCollapsible(this.props.unitNotification, item.open, index, item)
                        if (item.ntIsActive) {
                            //this.openNotification(notifications, index, oyeURL);
                            this.props.onNotificationOpen(notifications, index, oyeURL, item.ntid);
                            //this.toggledCollapsible(notifications, item.open, index, item)
                            // this.props.toggleCollapsible(notifications, item.open, index, item)
                            if (item.ntType === "Announcement") {
                                this.props.navigation.navigate('NotificationAnnouncementDetailScreen', {
                                    notifyid: item.acNotifyID,
                                    associationid: item.asAssnID,
                                    accountid: item.acAccntID,
                                    index,
                                    notifications,
                                    oyeURL,
                                    savedNoifId,
                                    ntid: item.ntid
                                });
                            }
                        }
                        else {
                            //this.toggledCollapsible(notifications, item.open, index, item)
                            // this.props.toggleCollapsible(notifications, item.open, index, item)
                        }

                    }}>


                    <View style={{
                        backgroundColor: base.theme.colors.greyCard,
                    }}>
                        <View style={{
                            flexDirection: 'row', backgroundColor: item.vlVisType == "Delivery" && item.vlApprStat == "Entry Pending" && item.ntIsActive ? "#FFE49B" : base.theme.colors.greyCard,
                            alignItems: 'center', justifyContent: 'space-between',
                            borderBottomWidth: 0.5, borderBottomColor: base.theme.colors.greyHead, height: 50
                        }}>
                            {item.ntIsActive ? //item.read -->Not updating
                                <Image
                                    resizeMode={'center'}
                                    style={{ width: 50, height: 50, }}
                                    source={require('../../../icons/notification2.png')}
                                />
                                :
                                <Image
                                    resizeMode={'center'}
                                    style={{ width: 50, height: 50, }}
                                    source={require('../../../icons/notification1.png')}
                                />
                            }
                            <Text style={{ fontSize: 16, color: base.theme.colors.black }}>{item.asAsnName}</Text>
                            <Text style={{ fontSize: 14, color: base.theme.colors.grey, marginRight: 5 }}>{valueDis}</Text>

                        </View>
                        <View style={{
                            flexDirection: 'row', backgroundColor: base.theme.colors.greyCard, alignItems: 'center',
                            justifyContent: 'space-between', height: 70,
                        }}>
                            <Text style={{ marginLeft: 10, fontSize: 14, color: base.theme.colors.blue, width: wp('35'), borderWidth: 0 }}
                                numberOfLines={3}>{item.vlComName}
                                <Text style={{ fontSize: 14, color: base.theme.colors.black }}>{' '}{item.vlVisType == "Delivery" ? item.vlVisType : ""}</Text>
                            </Text>
                            {item.unUniName !== "" ?
                                <View style={{ flexDirection: 'row', width: '40%' }}>
                                    <Text style={{ fontSize: 14, color: base.theme.colors.black, textAlign: 'right', marginRight: 10, }}>Visiting</Text>
                                    <Text style={{ fontSize: 14, color: base.theme.colors.blue, width: 100, }} numberOfLines={3}>{item.unUniName}</Text>
                                </View> :
                                <View />}
                        </View>
                    </View>
                    <View style={{ backgroundColor: base.theme.colors.white }}>
                        <View style={{ alignItems: 'center', justifyContent: 'flex-end', height: 60 }}>
                            <Text style={{ fontSize: 16, color: base.theme.colors.black, marginTop: 30 }}>{item.vlfName}</Text>

                        </View>
                        {/*{ item.vlVisType =="Delivery" && item.vlApprStat=="Pending" && item.ntIsActive ?
                        <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
                            <LottieView style={{width:'30%',}} source={require('../../assets/swipe_arrow.json')} autoPlay loop />
                        </View>
                            :
                            <View/>}*/}
                        <Collapsible duration={100} collapsed={item.open}>
                            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                                {
                                    Platform.OS === 'android'
                                        ? Linking.openURL(`tel:${item.vlMobile}`)
                                        : Linking.openURL(`telprompt:${item.vlMobile}`);
                                }
                            }}>
                                <Text style={{ fontSize: 16, color: base.theme.colors.primary, paddingBottom: 10 }}>{item.vlMobile}</Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 14, color: base.theme.colors.primary, marginLeft: 15 }}>{item.vlVisType == "Kid Exit" ? "Exit on" : "Entry on :"}
                                    <Text style={{ fontSize: 14, color: base.theme.colors.black, }}>{' '}{moment(item.ntdCreated).format('DD-MM-YYYY')} {'    '} {moment(item.vlEntryT).format('hh:mm A')}
                                    </Text>
                                </Text>
                                <Text style={{ fontSize: 14, color: base.theme.colors.primary, marginRight: 15 }}>From:
                                    <Text style={{ fontSize: 14, color: base.theme.colors.black, }}>{' '}{item.vlengName}</Text>
                                </Text>
                            </View>
                            {item.vlApprdBy != "" ?
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <Text style={{ fontSize: 16, color: base.theme.colors.primary, alignSelf: 'flex-start', marginLeft: 15 }}>{item.vlApprStat == "Rejected" ? "Entry Rejected by :" : "Entry Approved by :"}
                                        <Text style={{ fontSize: 14, color: base.theme.colors.black, }}>{' '}{item.vlApprdBy}</Text>
                                    </Text>
                                </View>
                                :
                                <View />}

                            {item.vlexgName != "" && item.vlApprStat != "Expired" ?
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 14, color: base.theme.colors.primary, marginLeft: 15 }}>Exit on   :
                                        <Text style={{ fontSize: 14, color: base.theme.colors.black, }}>{' '}{moment(item.vldUpdated, 'YYYY-MM-DD').format(
                                        'DD-MM-YYYY'
                                    )}{'    '}  {moment(item.vlExitT).format('hh:mm A')}</Text>
                                    </Text>
                                    <Text style={{ fontSize: 14, color: base.theme.colors.primary, marginRight: 15 }}>From:
                                        <Text style={{ fontSize: 14, color: base.theme.colors.black, }}>{' '}{item.vlexgName}</Text>
                                    </Text>
                                </View>
                                :
                                <View />}

                            {item.vlExAprdBy != "" ?
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <Text style={{ fontSize: 16, color: base.theme.colors.primary, alignSelf: 'flex-start', marginLeft: 15 }}>{item.vlApprStat == "Rejected" ? "Exit Rejected by :" : "Exit Approved by :"}
                                        <Text style={{ fontSize: 14, color: base.theme.colors.black, }}>{' '}{item.vlExAprdBy}</Text>
                                    </Text>
                                </View>
                                :
                                <View />}
                            {item.vlApprStat == "Expired" ?
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <Text style={{ fontSize: 16, color: base.theme.colors.primary, alignSelf: 'flex-start', marginLeft: 15 }}>Status  :
                                        <Text style={{ fontSize: 14, color: base.theme.colors.black, }}>{' '}{item.vlApprStat}</Text>
                                    </Text>
                                </View> :
                                <View />}

                            {
                                item.vlVisType === "Delivery" && item.vlApprStat === "Entry Pending" ?
                                    <View style={{
                                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                        marginBottom: 20, backgroundColor: base.theme.colors.shadedWhite, paddingTop: 10, paddingBottom: 10, marginTop: 10
                                    }}>
                                        <Text style={{ fontSize: 16, color: base.theme.colors.black, marginLeft: 20 }}>Approve Entry</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => {
                                                this.acceptgateVisitor(
                                                    item.vlVisLgID,
                                                    index,
                                                    item.asAssnID,
                                                    "EntryApproved",
                                                    item.ntid,
                                                    item.vlApprdBy
                                                );
                                            }} style={{ flexDirection: 'row', marginRight: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Image
                                                    style={{ width: 30, height: 30 }}
                                                    source={require('../../../icons/allow.png')}
                                                />
                                                <Text style={{ fontSize: 16, color: base.theme.colors.primary, }}>Allow</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() =>
                                                this.declinegateVisitor(
                                                    item.vlVisLgID,
                                                    index,
                                                    item.asAssnID,
                                                    "EntryRejected",
                                                    item.ntid,
                                                    item.vlApprdBy

                                                )
                                            } style={{ flexDirection: 'row', marginRight: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Image
                                                    style={{ width: 30, height: 30 }}
                                                    source={require('../../../icons/deny.png')}
                                                />
                                                <Text style={{ fontSize: 16, color: base.theme.colors.red, }}>Deny</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View> :
                                    <View />
                            }

                            {
                                item.vlVisType === "Delivery" && item.vlApprStat === "ExitPending" ?
                                    <View style={{
                                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                        marginBottom: 20, backgroundColor: base.theme.colors.shadedWhite, paddingTop: 10, paddingBottom: 10, marginTop: 10
                                    }}>
                                        <Text style={{ fontSize: 16, color: base.theme.colors.black, marginLeft: 20 }}>Approve Exit</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => {
                                                this.acceptgateVisitor(
                                                    item.vlVisLgID,
                                                    index,
                                                    item.asAssnID,
                                                    "ExitApproved",
                                                    item.ntid,
                                                    item.vlApprdBy

                                                );
                                            }}
                                                style={{ flexDirection: 'row', marginRight: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Image
                                                    style={{ width: 30, height: 30 }}
                                                    source={require('../../../icons/allow.png')}
                                                />
                                                <Text style={{ fontSize: 16, color: base.theme.colors.primary, }}>Allow</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() =>
                                                this.declinegateVisitor(
                                                    item.vlVisLgID,
                                                    index,
                                                    item.asAssnID,
                                                    "ExitRejected",
                                                    item.vlApprdBy
                                                )
                                            } style={{ flexDirection: 'row', marginRight: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Image
                                                    style={{ width: 30, height: 30 }}
                                                    source={require('../../../icons/deny.png')}
                                                />
                                                <Text style={{ fontSize: 16, color: base.theme.colors.red, }}>Deny</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View> :
                                    <View />
                            }
                            {
                                item.vlVisType === "Kid Exit" && item.vlApprStat === "Entry Pending" ?
                                    <View style={{
                                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                        marginBottom: 20, backgroundColor: base.theme.colors.shadedWhite, paddingTop: 10, paddingBottom: 10, marginTop: 10
                                    }}>
                                        <Text style={{ fontSize: 16, color: base.theme.colors.black, marginLeft: 20 }}>Approve Exit</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => {
                                                this.acceptgateVisitor(
                                                    item.vlVisLgID,
                                                    index,
                                                    item.asAssnID,
                                                    "ExitApproved",
                                                    item.ntid,
                                                );
                                            }}
                                                style={{ flexDirection: 'row', marginRight: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Image
                                                    style={{ width: 30, height: 30 }}
                                                    source={require('../../../icons/allow.png')}
                                                />
                                                <Text style={{ fontSize: 16, color: base.theme.colors.primary, }}>Allow</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() =>
                                                this.declinegateVisitor(
                                                    item.vlVisLgID,
                                                    index,
                                                    item.asAssnID,
                                                    "ExitRejected",
                                                    item.ntid,

                                                )
                                            } style={{ flexDirection: 'row', marginRight: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Image
                                                    style={{ width: 30, height: 30 }}
                                                    source={require('../../../icons/deny.png')}
                                                />
                                                <Text style={{ fontSize: 16, color: base.theme.colors.red, }}>Deny</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View> :
                                    <View />
                            }

                        </Collapsible>
                        <TouchableOpacity style={{
                            alignSelf: 'center', marginBottom: 10, width: '100%',
                            height: 20, alignItems: 'center', justifyContent: 'center'
                        }} onPress={() => {
                            if (item.ntIsActive) {
                                //this.openNotification(notifications, index, oyeURL);
                                this.props.onNotificationOpen(notifications, index, oyeURL, item.ntid);
                                //this.toggledCollapsible(notifications, item.open, index, item)
                                this.props.toggleCollapsible(notifications, item.open, index, item)
                            }
                            //this.toggledCollapsible(notifications, item.open, index, item)
                            this.props.toggleCollapsible(notifications, item.open, index, item)
                        }}>
                            <View style={{
                                width: 45,
                                borderRadius: 15,
                                height: 4,
                                backgroundColor: base.theme.colors.lightgrey,
                                alignSelf: 'center'
                            }} >
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{
                        width: wp('10%'),
                        height: hp('10%'),
                        justifyContent: 'center', alignSelf: 'center',
                        alignItems: 'center', position: 'absolute', marginTop: 80
                    }}
                        onPress={() => this._enlargeImage(item.vlEntryImg != "" ? 'data:image/png;base64,'+item.vlEntryImg : 'https://mediaupload.oyespace.com/' + base.utils.strings.noImageCapturedPlaceholder)}
                    >
                        {item.vlEntryImg != "" ?

                            <Image
                                //resizeMode={'center'}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40, position: 'relative'
                                }}
                                source={{uri: 'data:image/png;base64,'+item.vlEntryImg}}
                            />
                            :
                            <Image
                                //resizeMode={'center'}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40, position: 'relative'
                                }}
                                source={{ uri: 'https://mediaupload.oyespace.com/' + base.utils.strings.noImageCapturedPlaceholder }}
                            />}

                    </TouchableOpacity>


                </TouchableOpacity>

            );
        }
    };

    renderDetails = (details, notifications, index, oyeURL) => {
        const { navigation } = this.props;
        //const details = navigation.getParam('details', 'NO-ID');

        return (
            <View >
                <View style={{ marginLeft: hp('2%') }}>
                    <Text style={{ color: '#ff8c00' }}>Current Status</Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: hp('2%') }}>
                    <View style={{ flex: 1 }}>
                        <Text>Occupancy</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                        <Text style={{ color: base.theme.colors.black }}>
                            {this.state.dataSource3} </Text>
                    </View>
                </View>
                <FlatList
                    data={this.state.dataSource2.reverse()}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View
                            style={{ flex: 1, marginLeft: hp('2%'), marginTop: hp('1%') }}
                        >
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text>Resident Name</Text>
                                    </View>
                                    <View style={{ flex: 2 }}>
                                        <Text>  {item.name} </Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 2.5 }}>
                                        <Text>Mobile</Text>
                                    </View>
                                    <View style={{ flex: 5, zIndex: 100 }}>

                                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                                            {
                                                Platform.OS === 'android'
                                                    ? Linking.openURL(`tel:${item.number}`)
                                                    : Linking.openURL(`telprompt:${item.number}`);
                                            }
                                        }}>
                                            <Text style={{ color: base.theme.colors.black }}>
                                                {item.number ? item.number : ''}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                />
                {details.ntJoinStat === "" && details.ntType !== "Join_Status" ?
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'flex-end', marginTop: hp('2') }}>
                        <TouchableOpacity onPress={() => {
                            this.approve(details, notifications, index, oyeURL)
                        }}
                            style={{ flexDirection: 'row', marginRight: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Image
                                style={{ width: 30, height: 30 }}
                                source={require('../../../icons/allow.png')}
                            />
                            <Text style={{ fontSize: 16, color: base.theme.colors.primary, }}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.rejectModal(details, notifications, index, oyeURL)
                        } style={{ flexDirection: 'row', marginRight: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Image
                                style={{ width: 30, height: 30 }}
                                source={require('../../../icons/deny.png')}
                            />
                            <Text style={{ fontSize: 16, color: base.theme.colors.red, }}>Reject</Text>
                        </TouchableOpacity>
                    </View> :
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'flex-end', marginTop: hp('2') }}>
                        <TouchableOpacity style={{ flexDirection: 'row', marginRight: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 16, color: base.theme.colors.primary, }}>{details.ntJoinStat}</Text>
                        </TouchableOpacity>
                    </View>}
                <View
                    style={{
                        borderBottomWidth: 0,
                        borderColor: base.theme.colors.greyCard,
                        marginTop: 10

                    }}
                />

            </View>
        );
    };

    rejectModal(details) {
        console.log('DETAILS@@@@@@@@@@@', details)
        this.setState({
            isModalOpen1: true,
            detailsToReject: details
        })

    }
    renderRejectModal() {
        console.log('REJECT MODAL BOX', this.state.isModalOpen1)
        return (
            <Modal
                style={{ height: '110%', width: '100%', alignSelf: 'center', backgroundColor: 'transparent', alignItems: 'center' }}
                visible={this.state.isModalOpen1}
                transparent={true}
                onRequestClose={() => this.setState({ isModalOpen1: false })}>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    height: hp('100%'),
                    width: wp('100%')
                }}>
                    <View style={{ width: '80%', height: 230, backgroundColor: base.theme.colors.white, borderRadius: 20, elevation: 5, paddingTop: 30, paddingLeft: 15 }}>
                        <Text style={{ fontSize: 16, color: base.theme.colors.black }}> Reason for Rejection</Text>
                        <TextInput
                            onChangeText={(text) => this.setState({ reasonForReject: text })}
                            value={this.state.reasonForReject}
                            style={{
                                width: '80%',
                                fontSize: 12,
                                justifyContent: 'flex-start',
                                // alignItems: 'center',
                                //justifyContent: 'center',
                                height: 100,
                                borderColor: base.theme.colors.greyHead,
                                borderWidth: 1
                            }}
                            multiline={true}
                            maxLength={100}
                            placeholderTextColor={base.theme.colors.grey}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, width: '80%' }}>
                            <OSButton
                                height={'50%'}
                                width={'30%'}
                                oSBText={'Cancel'}
                                borderRadius={10}
                                onButtonClick={() => this.setState({ isModalOpen1: false, reasonForReject: "" })}
                            />
                            <OSButton
                                height={'50%'}
                                width={'30%'}
                                oSBText={'Submit'}
                                borderRadius={10}
                                onButtonClick={() => this.reject(this.state.detailsToReject)}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    approve(item) {
        const { oyeURL, champBaseURL } = this.props;
        console.log('Item in approve:', item);
        let unitPath = `syncdashboard/isUnitRefreshing/${item.asAssnID}/${item.sbUnitID}`;
        let associationPath = `syncdashboard/isAssociationRefreshing/${item.asAssnID}`;
        let requesterPath = `syncdashboard/isMemberRefreshing/${item.sbMemID}`;

        let isUnitNotificationUpdating = 0;
        let isAssocNotificationUpdating = 0;
        let isMemberRefreshing = 0;

        // fb.database().ref(unitPath).on('value',function(snapshot){
        //     let receivedData = snapshot.val();
        //     console.log("Received Data in unit path:",receivedData);
        //     isUnitNotificationUpdating = receivedData===null?0: receivedData.isUnitNotificationUpdating + 1;
        // })

        fb.database().ref(associationPath).on('value', function (snapshot) {
            let receivedData = snapshot.val();
            console.log("Received Data:", receivedData);
            isAssocNotificationUpdating = receivedData === null ? 0 : receivedData.isAssocNotificationUpdating + 1;
        })

        fb.database().ref(requesterPath).on('value', function (snapshot) {
            let receivedData = snapshot.val();
            console.log("Received Data:", receivedData);
            isMemberRefreshing = receivedData === null ? 0 : receivedData.isMemberRefreshing + 1;
        })

        fb.database().ref(associationPath).set({
            isAssocNotificationUpdating
        }).then((data) => {
            console.log('Data:', data);
        }).catch(error => {
            console.log("Error:", error);
        })

        fb.database().ref(requesterPath).set({
            isMemberRefreshing
        }).then((data) => {
            console.log('Data:', data);
        }).catch(error => {
            console.log("Error:", error);
        })

        this.approve1(item)
    }

    approve1(item) {
        const { oyeURL, champBaseURL } = this.props;
        // if (status) {
        //   Alert.alert(
        //     'Oyespace',
        //     'You have already responded to this request!',
        //     [{ text: 'Ok', onPress: () => {} }],
        //     { cancelable: false }
        //   );
        // } else {
        let MemberID = global.MyOYEMemberID;
        this.setState({ loading: true });
        console.log("Approval:", item, oyeURL, champBaseURL);

        const headers = {
            'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
            'Content-Type': 'application/json'
        };

        console.log(
            {
                MRMRoleID: item.sbRoleID,
                MEMemID: item.sbMemID,
                UNUnitID: item.sbUnitID
            },
            'body_memberROle'
        );
        axios
            .get(
                `http://${this.props.oyeURL}/oyesafe/api/v1/NotificationActiveStatusUpdate/${item.ntid}`,
                {
                    headers: {
                        'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE',
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then(() => {
                axios
                    .post(
                        champBaseURL + 'MemberRoleChangeToAdminOwnerUpdate',
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
                        let roleName = item.sbRoleID === 2 ? 'Owner' : 'Tenant';

                        axios
                            .post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
                                sbSubID: item.sbSubID,
                                ntTitle: 'Request Approved',
                                ntDesc:
                                    'Your request to join ' +
                                    item.mrRolName +
                                    ' ' +
                                    ' unit in ' +
                                    item.asAsnName +
                                    ' association as ' +
                                    roleName +
                                    ' has been approved',
                                ntType: 'Join_Status',
                                associationID: item.asAssnID
                            })
                            .then(() => {
                                let DateUnit = {
                                    MemberID: item.sbMemID,
                                    UnitID: item.sbUnitID,
                                    MemberRoleID: item.sbRoleID,
                                    UNSldDate: item.unSldDate,
                                    UNOcSDate: item.unOcSDate
                                };

                                let UpdateTenant = {
                                    MEMemID: item.sbMemID,
                                    UNUnitID: item.sbUnitID,
                                    MRMRoleID: item.sbRoleID
                                };

                                this.props.createUserNotification(
                                    'Join_Status',
                                    this.props.oyeURL,
                                    item.acNotifyID,
                                    1,
                                    'Your request to join ' +
                                    item.mrRolName +
                                    ' ' +
                                    ' unit in ' +
                                    item.asAsnName +
                                    ' association as ' +
                                    roleName +
                                    ' has been approved',
                                    'resident_user',
                                    'resident_user',
                                    item.sbSubID,
                                    'resident_user',
                                    'resident_user',
                                    'resident_user',
                                    'resident_user',
                                    'resident_user',
                                    false,
                                    this.props.MyAccountID
                                );

                                fetch(
                                    `${champBaseURL}Unit/UpdateUnitRoleStatusAndDate`,
                                    {
                                        method: 'POST',
                                        headers: {
                                            'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(DateUnit)
                                    }
                                )
                                    .then(response => response.json())
                                    .then(responseJson => {
                                        fetch(
                                            `http://${this.props.oyeURL}/oyeliving/api/v1/UpdateMemberOwnerOrTenantInActive/Update`,
                                            {
                                                method: 'POST',
                                                headers: {
                                                    'X-Champ-APIKey':
                                                        '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify(UpdateTenant)
                                            }
                                        )
                                            .then(response => response.json())
                                            .then(responseJson_2 => {
                                                console.log(JSON.stringify(UpdateTenant));
                                                console.log(responseJson_2);

                                                let StatusUpdate = {
                                                    NTID: item.ntid,
                                                    NTStatDesc: 'Request Sent'
                                                    //NTStatDesc: responseJson_2.data.string
                                                };

                                                fetch(
                                                    `http://${this.props.oyeURL}/oyesafe/api/v1/NotificationAcceptanceRejectStatusUpdate`,
                                                    {
                                                        method: 'POST',
                                                        headers: {
                                                            'X-OYE247-APIKey':
                                                                '7470AD35-D51C-42AC-BC21-F45685805BBE',
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify(StatusUpdate)
                                                    }
                                                )
                                                    .then(response => {
                                                        response.json();
                                                        console.log('Response', response);
                                                    })
                                                    .then(responseJson_3 => {
                                                        console.log(item.ntid, 'ntid');
                                                        console.log('NTJoinStat');
                                                        axios
                                                            .post(
                                                                `http://${this.props.oyeURL}/oyesafe/api/v1/Notification/NotificationJoinStatusUpdate`,
                                                                {
                                                                    NTID: item.ntid,
                                                                    NTJoinStat: 'Accepted'
                                                                },
                                                                {
                                                                    headers: {
                                                                        'X-OYE247-APIKey':
                                                                            '7470AD35-D51C-42AC-BC21-F45685805BBE',
                                                                        'Content-Type': 'application/json'
                                                                    }
                                                                }
                                                            )
                                                            .then(() => {
                                                                console.log('updated suc');
                                                                this.props.getNotifications(
                                                                    this.props.oyeURL,
                                                                    this.props.MyAccountID
                                                                );
                                                                this.setState({
                                                                    loading: false,
                                                                    date: StatusUpdate.NTStatDesc
                                                                });

                                                                setTimeout(() => {
                                                                    this.props.navigation.navigate('ResDashBoard');
                                                                }, 300);
                                                            })
                                                            .catch(error => {
                                                                console.log('Join Status', error);
                                                                Alert.alert('Join Status', error.message);
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
                                                        console.log('StatusUpdate', error);
                                                        Alert.alert('StatusUpdate', error.message);
                                                        this.setState({ loading: false });
                                                    });
                                            })
                                            .catch(error => {
                                                console.log('Update', error);
                                                Alert.alert('Update', error.message);
                                                this.setState({ loading: false });
                                            });
                                    })
                                    .catch(error => {
                                        console.log('DateUnit', error);
                                        Alert.alert('DateUnit', error.message);
                                        this.setState({ loading: false });
                                    });
                            })
                            .catch(error => {
                                console.log('firebase', error);
                                Alert.alert('firebase', error.message);
                                this.setState({ loading: false });
                            });
                    })
                    .catch(error => {
                        console.log('MemberRoleChange', error);
                        Alert.alert('MemberRoleChange', error.message);
                        this.setState({ loading: false });
                    });
            }).catch(error => {
                console.log("Error:", error);

            })
        // }
    };

    reject = (item, status) => {
        this.setState({
            isModalOpen1: false
        })
        console.log('DETAILS DETAILS', item)
        const { oyeURL } = this.props;
        if (status) {
            Alert.alert(
                'Oyespace',
                'You have already responded to this request!',
                [{ text: 'Ok', onPress: () => { } }],
                { cancelable: false }
            );
        } else {
            this.setState({ loading: true });

            const headers = {
                'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
                'Content-Type': 'application/json'
            };
            axios
                .get(
                    `http://${this.props.oyeURL}/oyesafe/api/v1/NotificationActiveStatusUpdate/${item.ntid}`,
                    {
                        headers: {
                            'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE',
                            'Content-Type': 'application/json'
                        }
                    }
                )
                .then(() => {
                    let roleName = item.sbRoleID === 1 ? 'Owner' : 'Tenant';
                    axios
                        .get(
                            `http://${this.props.oyeURL}/oyeliving/api/v1//Member/UpdateMemberStatusRejected/${item.sbMemID}/${this.state.reasonForReject}`,
                            {
                                headers: {
                                    'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
                                    'Content-Type': 'application/json'
                                }
                            }
                        )
                        .then(succc => {
                            console.log(succc, 'worked');
                            this.setState({ reasonForReject: "" })
                            axios
                                .post(`${CLOUD_FUNCTION_URL}/sendUserNotification`, {
                                    sbSubID: item.sbSubID,
                                    ntTitle: 'Request Declined',
                                    ntDesc:
                                        'Your request to join' +
                                        item.mrRolName +
                                        ' ' +
                                        ' unit in ' +
                                        item.asAsnName +
                                        ' association as ' +
                                        roleName +
                                        ' has been declined',
                                    ntType: 'Join_Status'
                                })
                                .then(() => {
                                    this.props.createUserNotification(
                                        'Join_Status',
                                        this.props.oyeURL,
                                        item.acNotifyID,
                                        1,
                                        'Your request to join' +
                                        item.mrRolName +
                                        ' ' +
                                        ' unit in ' +
                                        item.asAsnName +
                                        ' association as ' +
                                        roleName +
                                        ' has been declined',
                                        'resident_user',
                                        'resident_user',
                                        item.sbSubID,
                                        'resident_user',
                                        'resident_user',
                                        'resident_user',
                                        'resident_user',
                                        'resident_user',
                                        false,
                                        this.props.MyAccountID
                                    );

                                    axios
                                        .post(
                                            `http://${oyeURL}/oyesafe/api/v1/Notification/NotificationJoinStatusUpdate`,
                                            {
                                                NTID: item.ntid,
                                                NTJoinStat: 'Rejected'
                                            },
                                            {
                                                headers: {
                                                    'X-OYE247-APIKey':
                                                        '7470AD35-D51C-42AC-BC21-F45685805BBE',
                                                    'Content-Type': 'application/json'
                                                }
                                            }
                                        )
                                        .then(() => {
                                            let path = `syncdashboard/isAssociationRefreshing/${item.asAssnID}/${item.sbUnitID}`;
                                            //asAssnID
                                            fb.database().ref(path).remove().then((response)=>{
                                                let receivedData = response.val();
                                                console.log("Response!!!!!!!",receivedData)
                        
                                            }).catch((error)=>{
                                                console.log('Response!!!!!!!',error.response)
                                            });

                                            // this.props.getNotifications(
                                            //     this.props.oyeURL,
                                            //     this.props.MyAccountID
                                            // );

                                            this.setState({ loading: false });
                                            // this.props.updateApproveAdmin(
                                            //   this.props.approvedAdmins,
                                            //   item.sbSubID
                                            // );
                                            setTimeout(() => {
                                                this.props.navigation.navigate('ResDashBoard');
                                            }, 300);
                                        })
                                        .catch(error => {
                                            console.log('Join Status', error);
                                            Alert.alert('Join Status', error.message);
                                            this.setState({
                                                loading: false
                                            });
                                        });
                                })
                                .catch(error => {
                                    Alert.alert('@@@@@@@@@@@@@@@', error.message);
                                    this.setState({ loading: false });
                                });
                        })
                        .catch(error => {
                            console.log("update didn't work", error);
                        });
                })
                .catch(error => {
                    // Alert.alert("******************", error.message);
                    console.log(error, 'first api');
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

    _enlargeImage(imageURI) {
        console.log('openimg', imageURI)
        let img = { imageURI }
        this.setState({
            selectedImage: imageURI,
            isModalOpen: true
        })
    }


    _renderModal1() {
        console.log('openimg111111111', this.state.selectedImage)

        return (
            <Modal
                onRequestClose={() => this.setState({ isModalOpen: false })}
                isVisible={this.state.isModalOpen}>
                <View style={{ height: heightPercentageToDP('50%'), justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        style={{
                            height: heightPercentageToDP('50%'),
                            width: heightPercentageToDP('50%'),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        source={{ uri: this.state.selectedImage }}
                    />
                    <TouchableHighlight
                        underlayColor={base.theme.colors.transparent}
                        style={{ top: 20 }}
                        onPress={() => this.setState({ isModalOpen: false })}>
                        <Text style={CreateSOSStyles.emergencyHeader}>Close</Text>
                    </TouchableHighlight>
                </View>
            </Modal>
        )
    }

    renderComponent() {
        const {
            loading,
            isCreateLoading,
            notifications,
            refresh,
            refreshNotifications,
            oyeURL,
            MyAccountID,
            footerLoading,
            getNotifications,
            page
        } = this.props;
        // console.log(loading)
        console.log('Data in notification', this.props);
        let unitNotification = this.props.unitNotification;
        let adminNotification = this.props.adminNotification;
        let selectedView = this.state.selectedView;
        // this.segregateNotification()

        if (loading) {
            return (
                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#fff', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', top: hp('20')
                    }}
                >
                    <ActivityIndicator />
                </View>
            );
        } else {
            return (
                <Fragment>
                    {this.state.selectedView === 0 ?
                        unitNotification.length !== 0 ?
                            <View style={{ height: hp('64'), marginBottom: hp('10') }}>
                                <FlatList
                                    keyExtractor={this.keyExtractor}
                                    contentContainerStyle={{ flexGrow: 1 }}
                                    style={{ width: '100%', height: '100%' }}
                                    ListFooterComponentStyle={{
                                        flex: 1,
                                        justifyContent: 'flex-end'
                                    }}
                                    data={unitNotification}
                                    ListFooterComponent={() =>
                                        footerLoading ? (
                                            <View
                                                style={{
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginVertical: 10
                                                }}
                                            >
                                                <ActivityIndicator />
                                            </View>
                                        ) : null
                                    }
                                    renderItem={this.renderItem}
                                    extraData={this.props.unitNotification}
                                    onEndReachedThreshold={0.5}
                                    onEndReached={() => {
                                        // console.log("End Reached");
                                        // alert("On end")
                                        // this.props.onEndReached(oyeURL, page, notifications, MyAccountID);
                                    }}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refresh}
                                            onRefresh={() => {
                                                
                                                getNotifications(
                                                    oyeURL,
                                                    MyAccountID,
                                                    null,
                                                    notifications
                                                );
                                            }}
                                            progressBackgroundColor="#fff"
                                            tintColor="#ED8A19"
                                            colors={['#ED8A19']}
                                        />
                                    }
                                /></View> : <View style={{ height: hp('30'), width: wp('95'), alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}><Text allowFontScaling={false} style={{ color: base.theme.colors.primary, fontFamily: base.theme.fonts.bold, fontSize: hp('2.5') }}>No Unit Notifications To Display</Text></View> :
                        <View style={{ height: hp('64'), marginBottom: hp('10') }}>
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                contentContainerStyle={{ flexGrow: 1 }}
                                style={{ width: '100%', height: '100%' }}
                                ListFooterComponentStyle={{
                                    flex: 1,
                                    justifyContent: 'flex-end'
                                }}
                                data={adminNotification}
                                ListFooterComponent={() =>
                                    footerLoading ? (
                                        <View
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginVertical: 10
                                            }}
                                        >
                                            <ActivityIndicator />
                                        </View>
                                    ) : null
                                }
                                renderItem={this.renderItem}
                                extraData={this.props.adminNotification}
                                onEndReachedThreshold={0.5}
                                onEndReached={() => {
                                    // console.log("End Reached");
                                    // alert("On end")
                                    // this.props.onEndReached(oyeURL, page, notifications, MyAccountID);
                                }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refresh}
                                        onRefresh={() => {
                                            getNotifications(
                                                oyeURL,
                                                MyAccountID,
                                                null,
                                                notifications
                                            );
                                            //this.doNetwork(null, this.props.notifications)
                                        }}
                                        progressBackgroundColor="#fff"
                                        tintColor="#ED8A19"
                                        colors={['#ED8A19']}
                                    />
                                }
                                ListEmptyComponent={
                                    <View style={{
                                        height: hp('30'), width: wp('95'), alignSelf: 'center',
                                        justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <Text allowFontScaling={false}
                                            style={{
                                                color: base.theme.colors.primary, fontFamily: base.theme.fonts.bold,
                                                fontSize: hp('2.5')
                                            }}>No Admin Notifications To Display</Text>
                                    </View>
                                }
                            />
                        </View>
                    }
                </Fragment>
            );
        }
    };

    setView(param) {
        this.setState({ selectedView: param })
    }

    render() {
        const { navigation, notifications, oyeURL, MyAccountID, loading } = this.props;
        // const refresh = navigation.getParam("refresh", "NO-ID");
        // console.log(this.state.gateDetails, "gateDetails");
        // console.log("rendered");
        console.log('All Notification:', loading)
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <View style={{ height: hp('7'), width: wp('100'), alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    <Text allowFontScaling={false} style={{ fontFamily: base.theme.fonts.bold, color: base.theme.colors.primary }}>{this.state.headerText}</Text>
                </View>
                {this.renderAdminView()}

                {this._renderModal1()}

                <KeyboardAvoidingView>
                    {this.state.isModalOpen1 ?
                        this.renderRejectModal() : null}
                    <ProgressLoader
                        isHUD={true}
                        isModal={true}
                        visible={this.state.isLoading}
                        color={base.theme.colors.primary}
                        hudColor={"#FFFFFF"}
                    />
                </KeyboardAvoidingView>

            </View>
        );
    }

    renderHeader() {
        return (
            <SafeAreaView style={{ backgroundColor: '#ff8c00' }}>
                <View style={[styles.viewStyle1, { flexDirection: 'row' }]}>
                    <View style={styles.viewDetails1}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.toggleAllCollapsible(this.props.notifications);
                                this.props.navigation.navigate('ResDashBoard');
                            }}
                        >
                            <View
                                style={{
                                    height: hp('4%'),
                                    width: wp('15%'),
                                    alignItems: 'flex-start',
                                    justifyContent: 'center'
                                }}
                            >
                                <Image
                                    resizeMode="contain"
                                    source={require('../../../icons/back.png')}
                                    style={styles.viewDetails2}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Image
                            style={[styles.image1]}
                            source={require('../../../icons/OyespaceSafe.png')}
                        />
                    </View>
                    <View style={{ flex: 0.2 }}></View>
                </View>
                <View style={{ borderWidth: 1, borderColor: '#ff8c00' }} />
            </SafeAreaView>
        )
    }


    renderAdminView() {
        let selectedView = this.state.selectedView;
        let isAdmin = this.state.userRole === 1 ? true : false;
        console.log("User Role:", isAdmin, this.state.selectedView);

        return (
            (isAdmin) ?
                <ImageBackground
                    resizeMode={'stretch'}
                    style={{ width: wp('110'), height: hp('100'), alignSelf: 'center' }}
                    source={selectedView === 0 ? require('../../../icons/myunit_notifn.png') : require('../../../icons/admin_notifn.png')}>
                    <View style={{ flexDirection: 'row', top: hp('5'), justifyContent: 'space-between', width: wp('78'), alignSelf: 'center', alignItems: 'center', height: hp('10'), borderWidth: 0 }}>
                        <TouchableHighlight
                            underlayColor={'transparent'}
                            style={{ borderWidth: 0, bottom: hp('2.5'), height: hp('10') }}
                            onPress={() => this.setView(0)}>
                            <View style={{ flexDirection: 'row', top: hp('3'), justifyContent: 'center', right: hp('2'), width: wp('35'), alignSelf: 'flex-start', borderWidth: 0, alignItems: 'center' }}>
                                <Text allowFontScaling={false} style={{ top: hp('0.5'), fontSize: hp('2') }}>My Unit(s)</Text>
                                {this.renderUnitBadge()}
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={'transparent'}
                            style={{ borderWidth: 0, bottom: hp('2.5'), height: hp('10') }}
                            onPress={() => this.setView(1)}>
                            <View style={{ flexDirection: 'row', top: hp('3'), justifyContent: 'flex-start', width: wp('35'), alignSelf: 'flex-start', borderWidth: 0, alignItems: 'flex-start', left: hp('5') }}>
                                <Text allowFontScaling={false} style={{ top: hp('0.5'), fontSize: hp('2') }}>Admin</Text>
                                {this.renderAdminBadge()}
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={{ marginTop: hp('5'), width: wp('100'), alignSelf: 'center' }}>
                        {this.renderSearch()}
                        {this.renderComponent()}
                    </View>
                </ImageBackground>
                :
                <ElevatedView
                    elevation={10}
                    style={{
                        width: wp('100'), height: hp('105'), backgroundColor: 'white', borderTopLeftRadius: hp('7'), borderTopRightRadius: hp('7'),
                        shadowColor: 'black',
                        shadowOpacity: 1.0,
                    }}
                >
                    <View>
                        <View style={{ flexDirection: 'row', top: hp('1'), justifyContent: 'center', width: wp('25'), alignSelf: 'center', height: hp('10'), alignItems: 'center' }}>
                            <Text allowFontScaling={false} style={{ fontSize: hp('2') }} >My Unit(s)</Text>
                            {this.renderUnitBadge()}
                        </View>
                    </View>
                    <View style={{ marginTop: hp('5') }}>
                        {this.renderSearch()}
                        {this.renderComponent()}
                    </View>
                </ElevatedView>
        )
    }

    searchText(text) {
        this.setState({ searchKeyWord: text }, () => {
            this.filterNotificationList(text)
        })
    }


    filterNotificationList(text) {
        let selectedView = this.state.selectedView;
        let notificationList = selectedView === 0 ? this.props.unitDummyNotification : this.props.adminDummyNotification;
        let newArr = [];

        let formattedText = text.toLowerCase();
        console.log("============================================:", notificationList, formattedText);
        if (text.length !== 0 || text.length !== null) {

            if (notificationList.length !== 0) {
                for (let i in notificationList) {

                    if (selectedView === 0) {
                        let associationName = notificationList[i].asAsnName;
                        let unitName = notificationList[i].unUniName;
                        let ntType = notificationList[i].ntType;
                        console.log("DJNVKJVB:", ntType);

                        if ((associationName.toLowerCase()).includes(formattedText) || (unitName.toLowerCase()).includes(formattedText)
                            || ntType.toLowerCase().includes(formattedText) || notificationList[i].ntDesc.toLowerCase().includes(formattedText) || notificationList[i].vlfName.toLowerCase().includes(formattedText)
                            || notificationList[i].vlMobile.toLowerCase().includes(formattedText)) {
                            console.log("KLNVKGDVJHBD<CNJDVBV<NVNBJDBC<JCHJKRHE<JHJKR:", notificationList[i])
                            newArr.push(notificationList[i])
                        }
                    } else {
                        if ((notificationList[i].asAsnName.toLowerCase()).includes(formattedText) || (notificationList[i].mrRolName.toLowerCase()).includes(formattedText) || (notificationList[i].ntDesc.toLowerCase()).includes(formattedText)) {
                            console.log("KLNVKGDVJHBD<CNJDVBV<NVNBJDBC<JCHJKRHE<JHJKR:", notificationList[i])
                            newArr.push(notificationList[i])
                        }
                    }
                }
            }
        }
        else {
            newArr.push(notificationList)
        }

        console.log("Notitification after search:", notificationList)

        if (selectedView === 0) {
            this.props.segregateUnitNotification(newArr)
        } else {
            this.props.segregateAdminNotification(newArr);
        }

    }

    renderUnitBadge() {
        const { notifications } = this.props;
        let count = 0;
        console.log("Selected View:", this.state.selectedView, notifications);

        notifications.map((data, index) => {
            if (data.ntIsActive && (data.ntType !== "joinrequest" && data.ntType !== "Join" && data.ntType !== "Join_Status")) {
                count += 1;
            }
        });
        console.log('Notification Count:', count);
        const BadgedIcon = withBadge(count)(Icon);
        if (count >= 1) {
            return (
                <BadgedIcon
                    color="#FF8C00"
                    type="material"
                    name="notifications"
                    size={hp('4%')}
                />
            );
        } else
            return (
                <Icon
                    color="#FF8C00"
                    type="material"
                    name="notifications"
                    size={hp('4%')}
                />
            );
    }

    renderAdminBadge() {
        const { notifications } = this.props;
        let count = 0;
        console.log("Selected View:", this.state.selectedView, notifications);

        notifications.map((data, index) => {
            if (data.ntIsActive && (data.ntType === "joinrequest" || data.ntType === "Join" || data.ntType === "Join_Status")) {
                count += 1;
            }
        });
        console.log('Notification Count:', count);
        const BadgedIcon = withBadge(count)(Icon);
        if (count >= 1) {
            return (
                <BadgedIcon
                    color="#FF8C00"
                    type="material"
                    name="notifications"
                    size={hp('4%')}
                />
            );
        } else
            return (
                <Icon
                    color="#FF8C00"
                    type="material"
                    name="notifications"
                    size={hp('4%')}
                />
            );
    }

    renderSearch() {
        let value = 'dnjnd'
        return (
            <View style={{ height: hp('3.5'), flexDirection: 'row', width: wp('95'), alignSelf: 'center', borderColor: 'gray', borderBottomWidth: 1 }}>
                <TextInput
                    placeholder={"Search"}
                    style={{ height: Platform.OS === "ios" ? hp('3') : hp('6'), width: wp('80'), alignSelf: 'center' }}
                    onChangeText={text => this.searchText(text)}
                    value={this.state.searchKeyWord}
                />
                <Image
                    resizeMode={'center'}
                    style={{
                        width: hp('6%'),
                        height: hp('6%'), marginRight: hp('0'), bottom: hp('2')
                    }}
                    source={require('../../../icons/search.png')}
                />
            </View>

        )
    }





    renderButton = (item) => {
        const { loading, adminStatLoading, adminStat } = this.state;
        const { navigation } = this.props;
        const details = item

        let subId = details.sbSubID;
        // let status = _.includes(approvedAdmins, subId);
        // let status = false;
        let val = details.ntDesc.split(' ')
        let status;


        if (details.ntType === 'gate_app') {
            return null;
        }
        else {
            {
                status = (
                    <TouchableOpacity style={{
                        width: wp('10%'),
                        height: hp('10%'),
                        justifyContent: 'center', alignSelf: 'center', borderWidth: 0,
                        alignItems: 'center', marginLeft: 0, position: 'relative', top: hp('3')
                    }}
                        onPress={() => this._enlargeImage(details.userImage != "" ? "https://mediaupload.oyespace.com/" + details.userImage : 'https://mediaupload.oyespace.com/' + base.utils.strings.noImageCapturedPlaceholder)}
                    >
                        {details.userImage != "" ?

                            <Image
                                style={{
                                    width: 100 - 20,
                                    height: 100 - 20,
                                    borderRadius: 50 - 10, position: 'absolute'
                                }}
                                source={{ uri: "https://mediaupload.oyespace.com/" + details.userImage }}
                            />
                            :
                            <Image
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40, position: 'absolute'
                                }}
                                source={{ uri: 'https://mediaupload.oyespace.com/' + base.utils.strings.noImageCapturedPlaceholder }}
                            />}
                    </TouchableOpacity>
                );
            }
        }
        return status;

    };


    expandAdminNotification(notifications, index, details) {
        const { navigation, champBaseURL } = this.props;
        //const details = navigation.getParam('details', 'NO-ID');
        console.log(details, 'detailssss hitting here');

        let roleId;

        if (parseInt(details.sbRoleID) === 2) {
            roleId = 6;
        } else {
            roleId = 7;
        }

        axios
            .post(
                `${this.props.champBaseURL}/Member/GetMemberJoinStatus`,
                {
                    ACAccntID: details.acNotifyID,
                    UNUnitID: details.sbUnitID,
                    ASAssnID: details.asAssnID
                },
                {
                    headers: {
                        'X-Champ-APIKey': '1FDF86AF-94D7-4EA9-8800-5FBCCFF8E5C1',
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then(res => {
                this.setState({ adminStatLoading: false });
                let data = res.data.data;

                console.log(data, res, 'adminData');
                if (data) {
                    if (
                        data.member.meJoinStat === 'Accepted' &&
                        data.member.mrmRoleID === details.sbRoleID &&
                        data.member.meIsActive
                    ) {
                        this.setState({ adminStat: 'Accepted' });
                    } else if (
                        data.member.meJoinStat === 'Rejected' &&
                        parseInt(data.member.mrmRoleID) === roleId
                        //  data.member.meIsActive
                    ) {
                        this.setState({ adminStat: 'Rejected' });
                    }
                }
            })
            .catch(error => {
                console.log(error, 'adminDataError');
                this.setState({ adminStatLoading: false });
            });

        fetch(
            `http://${this.props.oyeURL}/oyeliving/api/v1/GetAccountListByAccountID/${details.acNotifyID}`,
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
                console.log('Response Json', responseJson);
                this.setState({
                    dataSource1: responseJson.data.account,
                    requestorMob1: responseJson.data.account[0].acMobile
                });
                console.log(
                    'Mobile Number1:',
                    this.state.dataSource,
                    this.state.requestorMob1
                );
            })
            .catch(error => {
                console.log(error);
            });
        fetch(
            `http://${this.props.oyeURL}/oyeliving/api/v1/UnitOwner/GetUnitOwnerListByUnitID/${details.sbUnitID}`,
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
                console.log('Response Json', responseJson);
                this.setState({
                    data: responseJson.data.unitsByUnitID,
                    dataSource: responseJson.data.unitsByUnitID[0],
                    requestorMob: responseJson.data.unitsByUnitID[0].uoMobile
                });
                console.log('Mobile Number:', this.state.dataSource);
            })
            .catch(error => {
                console.log(error);
            });

        fetch(
            //http://api.oyespace.com/oyeliving/api/v1/Unit/GetUnitListByUnitID/35894
            `http://${this.props.oyeURL}/oyeliving/api/v1/Unit/GetUnitListByUnitID/${details.sbUnitID}`,
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
                console.log('Response Json', responseJson);
                console.log(
                    'Owner Tenant length',
                    responseJson.data.unit.owner.length,
                    responseJson.data.unit.tenant.length
                );
                let arr1 = [];
                let self = this;
                let arr2 = [];
                for (let i = 0; i < responseJson.data.unit.owner.length; i++) {
                    for (let j = 0; j < responseJson.data.unit.tenant.length; j++) {
                        arr1.push({
                            name:
                                responseJson.data.unit.owner[i].uofName +
                                ' ' +
                                responseJson.data.unit.owner[i].uolName,
                            number: responseJson.data.unit.owner[i].uoMobile
                        });
                        // arr1.push(responseJson.data.unit.owner[i])
                        arr2.push({
                            name:
                                responseJson.data.unit.tenant[j].utfName +
                                ' ' +
                                responseJson.data.unit.tenant[j].utlName,
                            number: responseJson.data.unit.tenant[j].utMobile
                        });

                        // arr2.push(responseJson.data.unit.tenant[j])
                    }
                }

                let dArr1 = arr1[0];
                let dArr2 = arr2[0];

                console.log('ARARARARRARA:', arr1, arr2)
                self.setState({
                    dataSource2: [arr1, arr2],
                    dataSource3: responseJson.data.unit.unOcStat
                }, () => {
                      this.props.toggleAdminCollapsible(this.props.adminNotification, details.open, index, details)
                });
                console.log('DataSource2', this.state.dataSource2);
            })
            .catch(error => {
                console.log(error);
            });


    }








}



const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        width: '100%',
        height: '100%'
    },
    img: {
        width: hp('12%'),
        height: hp('12%'),
        borderColor: 'orange',
        borderRadius: hp('6%'),
        // marginTop: hp("3%"),
        borderWidth: hp('0.2%')
    },

    viewStyle1: {
        backgroundColor: '#fff',
        height: hp('7%'),
        width: Dimensions.get('screen').width,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
        position: 'relative'
    },
    image1: {
        width: wp('34%'),
        height: hp('18%'),
        marginRight: hp('3%')
    },

    viewDetails1: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 3
    },
    viewDetails2: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: hp('3%'),
        height: hp('3%'),
        marginTop: 5
        // marginLeft: 10
    }
});

const mapStateToProps = state => {
    return {
        notifications: state.NotificationReducer.notifications,
        isCreateLoading: state.NotificationReducer.isCreateLoading,
        loading: state.NotificationReducer.loading,
        savedNoifId: state.AppReducer.savedNoifId,
        oyeURL: state.OyespaceReducer.oyeURL,
        mediaupload: state.OyespaceReducer.mediaupload,
        MyAccountID: state.UserReducer.MyAccountID,
        refresh: state.NotificationReducer.refresh,
        page: state.NotificationReducer.page,
        footerLoading: state.NotificationReducer.footerLoading,
        userReducer: state.UserReducer,
        dashBoardReducer: state.DashboardReducer,
        champBaseURL: state.OyespaceReducer.champBaseURL,
        unitNotification: state.NotificationReducer.unitNotification,
        adminNotification: state.NotificationReducer.adminNotification,
        unitDummyNotification:state.NotificationReducer.unitDummyNotification,
        adminDummyNotification: state.NotificationReducer.adminDummyNotification,
    };

};

export default connect(
    mapStateToProps,
    {
        onNotificationOpen,
        storeOpenedNotif,
        getNotifications,
        refreshNotifications,
        toggleCollapsible,
        onEndReached,
        onGateApp,
        createUserNotification,
        toggleAllCollapsible,
        segregateUnitNotification,
        segregateAdminNotification,
        segregateDummyUnitNotification,
        segregateDummyAdminNotification,
        toggleUnitCollapsible,
        toggleAdminCollapsible
    }
)(NotificationScreen);
