import React, {Fragment, PureComponent} from 'react';
import {
    ActivityIndicator,
    BackHandler,
    Dimensions,
    FlatList,
    Image,
    Linking,
    Platform,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {connect} from 'react-redux';
import {Card, ListItem, Button} from 'react-native-elements';
import {
    getNotifications,
    onEndReached,
    onNotificationOpen,
    refreshNotifications,
    storeOpenedNotif,
    toggleCollapsible,
    onGateApp
} from '../../actions';
import _ from 'lodash';
import {NavigationEvents} from 'react-navigation';
import Collapsible from 'react-native-collapsible';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import axios from 'axios';
import moment from 'moment';
import firebase from 'react-native-firebase';
import base from '../../base';
import gateFirebase from 'firebase';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import IcoMoonConfig from '../../assets/selection.json';
import timer from 'react-native-timer';
import LottieView from "lottie-react-native";



const Icon = createIconSetFromIcoMoon(IcoMoonConfig);


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

            buttonData: ''
        };
       // this.renderCollapseData = this.renderCollapseData.bind(this);
    }

    componentDidMount() {
        base.utils.validate.checkSubscription(
            this.props.userReducer.SelectedAssociationID
        );
        console.log('Get the deatails',this.props)
        this.props.getNotifications(this.props.oyeURL, this.props.MyAccountID);

        //this.doNetwork(null, this.props.notifications);

        firebase.notifications().removeAllDeliveredNotifications();
        console.log(
            `http://${this.props.oyeURL}/oyesafe/api/v1/GetCurrentDateTime`,
            'timeeee'
        );
        axios
            .get(`http://${this.props.oyeURL}/oyesafe/api/v1/GetCurrentDateTime`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
                }
            })
            .then(res => {
                console.log(res.data, 'current time');
                this.setState({currentTime: res.data.data.currentDateTime});
            })
            .catch(error => {
                console.log(error, 'erro_fetching_data');
                this.setState({currentTime: 'failed'});
            });

        //   alert('mounted');
        //   gateFirebase
        //     .database()
        //     .ref(`NotificationSync/${}`)
        //     .once('value')
        //     .then(snapshot => {
        //       console.log(snapshot.val(), 'value_firebase');
        //     //   alert('here');
        //     })
        //     .catch(error => {
        //       console.log(error, 'error_reading');
        //     //   alert('error');
        //     });
    }

    componentDidUpdate() {
        setTimeout(() => {
            BackHandler.addEventListener('hardwareBackPress', () =>
                this.processBackPress()
            );
        }, 100);
    }

    componentWillUnmount() {
        setTimeout(() => {
            BackHandler.removeEventListener('hardwareBackPress', () =>
                this.processBackPress()
            );
        }, 0);
    }

    processBackPress() {
        console.log('Part');
        const {goBack} = this.props.navigation;
        goBack(null);
    }

    keyExtractor = (item, index) => index.toString();

    onPress = (item, index) => {
        const {notifications, savedNoifId, oyeURL} = this.props;
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
            console.log('Announcement_item', item);
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

    renderIcons = (type, item, index) => {
        const {savedNoifId} = this.props;
        // let status = _.includes(savedNoifId, item.ntid);

        if (type === 'name') {
            if (!item.ntIsActive) {
                return 'mail-read';
            } else {
                return 'ios-mail-unread';
            }
        } else if (type === 'type') {
            if (!item.ntIsActive) {
                return 'octicon';
            } else {
                return 'ionicon';
            }
        } else if (type === 'style') {
            if (!item.ntIsActive) {
                return {backgroundColor: '#fff'};
            } else {
                return {backgroundColor: '#eee'};
            }
        }
    };

    renderTitle = type => {
        if (type === 'Join') {
            return 'Request to Join';
        } else if (type === 'Join_Status') {
            return 'Request to Join Status';
        } else if (type === 'gate_app') {
            return 'Gate App Notification';
        } else if (type === 'Announcement') {
            return 'Announcement';
        }
    };

    renderStyle = active => {
        if (active) {
            return {backgroundColor: '#eee'};
        } else return {backgroundColor: '#fff'};
    };

    gateAppNotif = () => {
        const {details} = this.props.navigation.state.params;
        // console.log("@#@$#$#@%#%#%#%@#%@#%", details.sbMemID);
        fetch(
            `http://${this.props.oyeURL}/oyesafe/api/v1/VisitorLog/GetVisitorLogListByVisLogID/` +
            details.sbMemID,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
                }
            }
        )
            .then(response => response.json())
            .then(responseJson => {
                console.log('Response from server notification list', responseJson);
                this.setState({
                    gateDetails: responseJson.data.visitorLog,
                    Date:
                        responseJson.data.visitorLog.vldCreated.substring(8, 10) +
                        '-' +
                        responseJson.data.visitorLog.vldCreated.substring(5, 7) +
                        '-' +
                        responseJson.data.visitorLog.vldCreated.substring(0, 4),
                    Time: responseJson.data.visitorLog.vlEntryT.substring(11, 16),
                    Date1:
                        responseJson.data.visitorLog.vldUpdated.substring(8, 10) +
                        '-' +
                        responseJson.data.visitorLog.vldUpdated.substring(5, 7) +
                        '-' +
                        responseJson.data.visitorLog.vldUpdated.substring(0, 4),
                    Time1: responseJson.data.visitorLog.vlExitT.substring(11, 16)
                });
                console.log(
                    '@#!@$@#%#%#$^$^$%^$%^Gate Details',
                    this.state.gateDetails,
                    this.state.Date,
                    this.state.Time
                );
            })
            .catch(error => {
                console.log(error);
            });
    };

    renderCollapseData(type, id) {
        console.log('Gate app get data$$$$$$', type, id);
        const {gateDetails} = this.state;
        let value = '';

        if (gateDetails.length <= 0) {
            value = '';
        } else {
            if (type === 'vlGtName') {
                let foundData = _.find(gateDetails, {sbMemID: id});
                console.log('founddata in notification', foundData);
                value = foundData ? foundData.vlGtName : '';
            } else if (type === 'vlfName') {
                let foundData = _.find(gateDetails, {sbMemID: id});
                value = foundData ? foundData.vlfName : '';
            } else if (type === 'vlVisType') {
                let foundData = _.find(gateDetails, {sbMemID: id});
                value = foundData ? foundData.vlVisType : '';
            } else if (type === 'vlComName') {
                let foundData = _.find(gateDetails, {sbMemID: id});
                value = foundData ? foundData.vlComName : ' ';
            } else if (type === 'vlMobile') {
                let foundData = _.find(gateDetails, {sbMemID: id});
                value = foundData ? foundData.vlMobile : '';
            } else if (type === 'vlEntryImg') {
                let foundData = _.find(gateDetails, {sbMemID: id});
                value = foundData ? foundData.vlEntryImg : '';
            } else if (type === 'vlEntryT') {
                let foundData = _.find(gateDetails, {sbMemID: id});
                value = foundData ? moment(foundData.vlEntryT).format('hh:mm A') : '';
            } else if (type === 'vlExitT') {
                let foundData = _.find(gateDetails, {sbMemID: id});
                value = foundData ? moment(foundData.vlExitT).format('hh:mm A') : '';
            } else if (type === 'vldCreated') {
                let foundData = _.find(gateDetails, {sbMemID: id});
                value = foundData
                    ? moment(foundData.vldCreated, 'YYYY-MM-DD').format('DD-MM-YYYY')
                    : '';
            } else if (type === 'vldUpdated') {
                let foundData = _.find(gateDetails, {sbMemID: id});
                value = foundData
                    ? moment(foundData.vldUpdated, 'YYYY-MM-DD').format('DD-MM-YYYY')
                    : '';
            } else if (type === 'vlengName') {
                let foundData = _.find(gateDetails, {sbMemID: id});
                value = foundData ? foundData.vlengName : '';
            } else if (type === 'vlexgName') {
                let foundData = _.find(gateDetails, {sbMemID: id});
                value = foundData ? foundData.vlexgName : '';
            } else if (type === 'vlVisLgID') {
                let foundData = _.find(gateDetails, {sbMemID: id});
                value = foundData ? foundData.vlVisLgID : '';
            } else if (type === 'unUnitID') {
                let foundData = _.find(gateDetails, {sbMemID: id});
                value = foundData ? foundData.unUnitID : '';
            }
            //unUniName
            else if (type === 'unUniName') {
                let foundData = _.find(gateDetails, {sbMemID: id});
                value = foundData ? foundData.unUniName : '';
            }
        }

        console.log('return value', value);
        return value;
    }

    doNetwork = (item, notifications) => {
        let gateDetailsArr = [];

        console.log('Get the data in this API',this.props.notifications,this.props.notifications.length)

        this.props.notifications.map((data, index) => {
            if (data.ntType === 'gate_app') {
                axios
                    .get(
                        `http://${this.props.oyeURL}/oyesafe/api/v1/VisitorLog/GetVisitorLogListByVisLogID/${data.sbMemID}`,
                        //data.sbMemID`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
                            }
                        }
                    )
                    .then(res => {
                        let responseData = res.data.data;

                        for (let i = 0; i < this.props.notifications.length; i++) {
                            if (
                                this.props.notifications[i].sbMemID ===
                                responseData.visitorLog.vlVisLgID
                            ) {
                                console.log(
                                    'Ids equal',
                                    this.props.notifications[i].sbMemID,
                                    responseData.visitorLog.vlVisLgID
                                );
                                console.log(
                                    'RESPONSE$$$',
                                    responseData,
                                    responseData.visitorLog.vlVisLgID
                                );

                                this.props.notifications[i].vlEntryImg =
                                    responseData.visitorLog.vlEntryImg;
                                this.props.notifications[i].vlGtName =
                                    responseData.visitorLog.vlGtName;
                                this.props.notifications[i].vlfName =
                                    responseData.visitorLog.vlfName;
                                this.props.notifications[i].vlVisType =
                                    responseData.visitorLog.vlVisType;
                                this.props.notifications[i].vlComName =
                                    responseData.visitorLog.vlComName;
                                this.props.notifications[i].vlMobile =
                                    responseData.visitorLog.vlMobile;
                                this.props.notifications[i].vlEntryT =
                                    responseData.visitorLog.vlEntryT;
                                this.props.notifications[i].vldCreated =
                                    responseData.visitorLog.vldCreated;
                                this.props.notifications[i].vlengName =
                                    responseData.visitorLog.vlengName;
                                this.props.notifications[i].vlexgName =
                                    responseData.visitorLog.vlexgName;
                                this.props.notifications[i].vldUpdated =
                                    responseData.visitorLog.vldUpdated;
                                this.props.notifications[i].vlExitT =
                                    responseData.visitorLog.vlExitT;
                                this.props.notifications[i].vlVisLgID =
                                    responseData.visitorLog.vlVisLgID;
                                //unUnitID
                                this.props.notifications[i].unUnitID =
                                    responseData.visitorLog.unUnitID;
                                //unUniName
                                this.props.notifications[i].unUniName =
                                    responseData.visitorLog.unUniName;
                                this.props.notifications[i].vlApprStat =
                                    responseData.visitorLog.vlApprStat;
                            }
                        }
                        this.setState(
                            (prevState, newEmployer) => ({
                                gateDetails: prevState.gateDetails.concat([
                                    {...responseData.visitorLog, ...data}
                                ])
                            }),
                            () => {
                            }
                        );
                    })
                    .catch(error => {
                        console.log(error, 'error while fetching networks');
                    });
            }
            console.log('Props  notifications~~~~~', this.props.notifications);
        });
    };

    acceptgateVisitor = (visitorId, index, associationid) => {
        let oldNotif = [...this.props.notifications];
        console.log(visitorId, 'visitorLogid');
        oldNotif[index].opened = true;
        this.props.onGateApp(oldNotif);

        axios
            .get(`http://${this.props.oyeURL}/oyesafe/api/v1/GetCurrentDateTime`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
                }
            })
            .then(res => {
                console.log(res.data, 'current time');
                this.setState({currentTime: res.data.data.currentDateTime});

                  // this.props.navigation.navigate('ResDashBoard');
                axios
                    .post(
                        `http://${this.props.oyeURL}/oyesafe/api/v1/UpdateApprovalStatus`,
                        {
                            VLApprStat: 'Approved',
                            VLVisLgID: visitorId,
                            VLApprdBy:this.props.userReducer.MyFirstName
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
                            }
                        }
                    )
                    .then(responses => {
                        console.log('_RESP_#############@@@@@@@', responses,visitorId);
                        gateFirebase
                            .database()
                            .ref(`NotificationSync/A_${associationid}/${visitorId}`)
                            .set({
                                buttonColor: '#75be6f',
                                opened: true,
                                newAttachment: false,
                                visitorlogId: visitorId,
                                updatedTime: res.data.data.currentDateTime
                                // status:
                            });
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
                this.setState({currentTime: 'failed'});

                gateFirebase
                    .database()
                    .ref(`NotificationSync/A_${associationid}/${visitorId}`)
                    .set({
                        buttonColor: '#75be6f',
                        opened: true,
                        newAttachment: false,
                        visitorlogId: visitorId,
                        updatedTime: null
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

    declinegateVisitor = (visitorId, index, associationid) => {
        console.log(visitorId, 'visitorLogid');
        let oldNotif = [...this.props.notifications];
        oldNotif[index].opened = true;
        this.props.onGateApp(oldNotif);

        axios
            .get(`http://${this.props.oyeURL}/oyesafe/api/v1/GetCurrentDateTime`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
                }
            })
            .then(res => {
                console.log(res.data, 'current time');
                this.setState({currentTime: res.data.data.currentDateTime});
                axios
                    .post(
                        `http://${this.props.oyeURL}/oyesafe/api/v1/UpdateApprovalStatus`,
                        {
                            VLApprStat: 'Rejected',
                            VLVisLgID: visitorId,
                            VLApprdBy:this.props.userReducer.MyFirstName
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
                            }
                        }
                    )
                    .then(response => {
                        console.log('_RESP_#############', response,visitorId);
                        gateFirebase
                            .database()
                            .ref(`NotificationSync/A_${associationid}/${visitorId}`)
                            .set({
                                buttonColor: '#ff0000',
                                opened: true,
                                newAttachment: true,
                                visitorlogId: visitorId,
                                updatedTime: res.data.data.currentDateTime
                            });
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
                this.setState({currentTime: 'failed'});
                gateFirebase
                    .database()
                    .ref(`NotificationSync/A_${associationid}/${visitorId}`)
                    .set({
                        buttonColor: '#ff0000',
                        opened: true,
                        newAttachment: true,
                        visitorlogId: visitorId,
                        updatedTime: null
                    });
                this.props.getNotifications(this.props.oyeURL, this.props.MyAccountID);
                this.props.navigation.navigate('ResDashBoard');

            });
    };



    renderItem = ({item, index}) => {
        console.log('ITEMSOFNOTIFICATION#######', item,index); //11600

        const {savedNoifId, notifications, oyeURL} = this.props;

        let status = _.includes(savedNoifId, item.ntid);
        console.log('ITEMS', item.asAssnID, item.vlVisLgID);
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
        let inDate=new Date()
        let enDate=new Date(item.ntdCreated)
        let duration = Math.abs(inDate-enDate)
        //let duration2=Math.ceil(duration / (1000 * 60 * 60 * 24));
        let days=Math.floor(duration / (1000 * 60 * 60 * 24));
        let hours=Math.floor(duration / (1000 * 60 *60));
        let mins=Math.floor(duration / (1000 *60));
        let valueDis= days >1? moment(item.ntdCreated).format('DD MMM YYYY'): days==1 ? "Yesterday": mins>=120? hours + " hours ago" :(mins<120 && mins>=60)? hours + " hour ago"
            :mins==0 ?"Just now":mins+" mins ago";
        console.log('Gate app Notifications98989898TIME',days,hours,mins,item.ntdCreated,valueDis)
        if(item.ntType !== 'gate_app'){
            return(
                <TouchableOpacity style={{
                    borderRadius: 5, borderColor: base.theme.colors.lightgrey, backgroundColor: base.theme.colors.white,
                    shadowColor: base.theme.colors.greyHead,
                    shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 0.5},
                    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.2,
                    shadowRadius: 0.5, elevation: 3,  borderBottomWidth: 0.5,
                    width:'100%',
                    height:80,
                    marginTop:10,
                }} onPress={() => this.onPress(item, index)}>
                    <View style={{flexDirection:'row',width:'100%',height:80,backgroundColor:base.theme.colors.shadedWhite}}>
                        <View style={{width:'15%',}}>
                            {item.ntType =="Announcement" ?
                            <Image
                                resizeMode={'center'}
                                style={{width:50, height:50,alignItems:'center',justifyContent:'center'}}
                                source={require('../../../icons/notifn_announcement.png')}
                            />
                            : item.ntIsActive ?
                                <Image
                                    resizeMode={'center'}
                                    style={{width:50, height:50,alignItems:'center',justifyContent:'center'}}
                                    source={require('../../../icons/notification2.png')}
                                /> :  <Image
                                        resizeMode={'center'}
                                        style={{width:50, height:50,alignItems:'center',justifyContent:'center'}}
                                        source={require('../../../icons/notification1.png')}
                                    />
                            }

                        </View>
                        <View style={{width:'65%',marginTop:20}}>
                            <Text style={{color:base.theme.colors.black,fontSize:12}}>{item.ntDesc} </Text>
                        </View>
                        <View style={{width:'20%',marginTop:20}}>
                            <Text style={{color:base.theme.colors.grey,fontSize:12}}>{valueDis}</Text>
                        </View>
                    </View>

                </TouchableOpacity>
            )
        }
       else {
            console.log(
                'Gate app Notifications98989898',
                item,
                this.props.mediaupload,
                this.state.gateDetails
            );

            return (
                <TouchableOpacity activeOpacity={0.7} style={{
                    borderRadius: 5, borderColor: base.theme.colors.lightgrey, backgroundColor: base.theme.colors.white,
                    shadowColor: base.theme.colors.greyHead,
                    shadowOffset: {width: 0, height: Platform.OS === 'ios' ? 3 : 0.5},
                    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.2,
                    shadowRadius: 0.5, elevation: 3,  borderBottomWidth: 0.5,
                    width:'100%',
                    marginTop:10,
                }}
                      onPress={() =>{
                          if (item.ntIsActive) {
                          this.props.onNotificationOpen(notifications, index, oyeURL);
                      }
                      this.props.toggleCollapsible(notifications, item.open, index)}}>
                 <View style={{backgroundColor:base.theme.colors.greyCard,
                 }}>
                  <View style={{flexDirection:'row',backgroundColor:base.theme.colors.greyCard,
                      alignItems:'center',justifyContent:'space-between',
                      borderBottomWidth:0.5,borderBottomColor:base.theme.colors.greyHead,height:50}}>
                      {item.ntIsActive? //item.read -->Not updating
                          <Image
                              resizeMode={'center'}
                              style={{width:50, height:50,}}
                              source={require('../../../icons/notification2.png')}
                          />
                          :
                          <Image
                              resizeMode={'center'}
                              style={{width:50, height:50,}}
                              source={require('../../../icons/notification1.png')}
                          />
                      }
                      <Text style={{fontSize:16,color:base.theme.colors.black}}>{item.asAsnName}</Text>
                      <Text style={{fontSize:14,color:base.theme.colors.grey,marginRight:5}}>{valueDis}</Text>

                  </View>
                     <View style={{flexDirection:'row',backgroundColor:base.theme.colors.greyCard,alignItems:'center',
                         justifyContent:'space-between',height:70,}}>
                         <Text style={{marginLeft:10,fontSize:14,color:base.theme.colors.blue,width:160,}}
                         numberOfLines={3}>{ item.vlComName}
                             <Text style={{fontSize:14,color:base.theme.colors.black}}>{' '}{item.vlVisType=="Delivery"? item.vlVisType:""}</Text>
                         </Text>
                         {item.unUniName !=="" ?
                         <Text style={{fontSize:14,color:base.theme.colors.black,width:150,textAlign:'right',marginRight:10,}}>Visiting
                             <Text style={{fontSize:14,color:base.theme.colors.blue,}} numberOfLines={3}>{' '}{item.unUniName}</Text>
                         </Text>
                             :<Text/>}
                     </View>
                 </View>
                    <View style={{backgroundColor:base.theme.colors.white}}>
                        <View style={{alignItems:'center',justifyContent:'flex-end',height:60}}>
                            <Text style={{fontSize:16,color:base.theme.colors.black,marginTop:30}}>{item.vlfName}</Text>

                        </View>
                        {item.ntIsActive?
                        <View style={{alignItems:'center',justifyContent:'flex-end',height:60}}>
                            <LottieView source={require('../../assets/notifblinker.json')} autoPlay loop />
                        </View>
                            :
                            <View/>}
                        <Collapsible duration={100} collapsed={item.open}>
                            <View style={{alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:16,color:base.theme.colors.primary,paddingBottom:10}}>{item.vlMobile}</Text>
                            </View>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                            <Text style={{fontSize:14,color:base.theme.colors.primary,marginLeft:15}}>Entry on :
                                <Text style={{fontSize:14, color:base.theme.colors.black,}}>{ moment(item.ntdCreated).format('DD-MM-YYYY')} {'    '} {moment(item.vlEntryT).format('hh:mm A')}
                            </Text>
                            </Text>
                            <Text style={{fontSize:14,color:base.theme.colors.primary,marginRight:15}}>From:
                                <Text style={{fontSize:14,color:base.theme.colors.black,}}>{' '}{item.vlengName}</Text>
                            </Text>
                        </View>
                        {item.vlexgName !="" && item.vlApprStat !="Expired" ?
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                            <Text style={{fontSize:14,color:base.theme.colors.primary,marginLeft:15}}>Exit on :
                                <Text style={{fontSize:14,color:base.theme.colors.black,}}> {moment(item.vldUpdated, 'YYYY-MM-DD').format(
                                'DD-MM-YYYY'
                            )}{'    '}
                                {moment(item.vlExitT).format('hh:mm A')}</Text>
                            </Text>
                            <Text style={{fontSize:14,color:base.theme.colors.primary,marginRight:15}}>From:
                                <Text style={{fontSize:14,color:base.theme.colors.black,}}>{' '}{item.vlexgName}</Text>
                            </Text>
                        </View>
                            :
                            <View/>}

                            {item.vlApprdBy !=""?
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                            <Text style={{fontSize:16,color:base.theme.colors.primary,alignSelf:'flex-start',marginLeft:15}}>{item.vlApprStat == "Rejected" ?"Entry Rejected by :": "Entry Approved by :" }
                                <Text style={{fontSize:14,color:base.theme.colors.black,}}>{' '}{item.vlApprdBy}</Text>
                            </Text>
                        </View>
                            :
                            <View/>}
                            {item.vlApprStat =="Expired" ?
                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                                    <Text style={{fontSize:16,color:base.theme.colors.primary,alignSelf:'flex-start',marginLeft:15}}>Status:
                                        <Text style={{fontSize:14,color:base.theme.colors.black,}}>{' '}{item.vlApprStat}</Text>
                                    </Text>
                                </View>:
                                <View/>}

                                {item.vlVisType =="Delivery" && item.vlApprStat=="Pending"?
                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',
                                    marginBottom:20,backgroundColor:base.theme.colors.shadedWhite,paddingTop:10,paddingBottom:10,marginTop:10}}>
                                    <Text style={{fontSize:16,color:base.theme.colors.black,marginLeft:20}}>Approve Entry</Text>
                                    <View style={{flexDirection:'row'}}>
                                    <TouchableOpacity onPress={() => {
                                        this.acceptgateVisitor(
                                            item.vlVisLgID,
                                            index,
                                            item.asAssnID
                                        );
                                    }}
                                    style={{flexDirection:'row',marginRight:20,alignItems:'center',justifyContent:'space-between'}}>
                                        <Image
                                            style={{width:30,height:30}}
                                            source={require('../../../icons/allow.png')}
                                        />
                                        <Text style={{fontSize:16,color:base.theme.colors.primary,}}>Allow</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() =>
                                        this.declinegateVisitor(
                                            item.vlVisLgID,
                                            index,
                                            item.asAssnID
                                        )
                                    }  style={{flexDirection:'row',marginRight:20,alignItems:'center',justifyContent:'space-between'}}>
                                        <Image
                                            style={{width:30,height:30}}
                                            source={require('../../../icons/deny.png')}
                                        />
                                        <Text style={{fontSize:16,color:base.theme.colors.red,}}>Deny</Text>
                                    </TouchableOpacity>
                                    </View>

                                </View>:
                                <View/>}
                        </Collapsible>
                        <TouchableOpacity style={{alignSelf: 'center', marginBottom: 10,width:'100%',
                            height:20,alignItems:'center',justifyContent:'center'}} onPress={() =>{
                            if (item.ntIsActive) {
                            this.props.onNotificationOpen(notifications, index, oyeURL);
                        }
                            this.props.toggleCollapsible(notifications, item.open, index)}}>
                            <View style={{
                                width: 45,
                                borderRadius: 15,
                                height:4,
                                backgroundColor: base.theme.colors.lightgrey,
                                alignSelf: 'center'
                            }} >
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{  width: wp('10%'),
                        height: hp('10%'),
                        justifyContent: 'center', alignSelf:'center',
                        alignItems: 'center',position:'absolute',marginTop:80}} >
                        {item.vlEntryImg !="" ?

                            <Image
                                //resizeMode={'center'}
                                style={{width: 80,
                                    height: 80,
                                    borderRadius: 40, position: 'relative'
                                }}
                                source={{uri:`${this.props.mediaupload}` + item.vlEntryImg

                                }}
                            />
                            :
                            <Image
                                //resizeMode={'center'}
                                style={{width: 80,
                                    height: 80,
                                    borderRadius: 40, position: 'relative'
                                }}
                                source={{uri:'https://mediaupload.oyespace.com/' + base.utils.strings.noImageCapturedPlaceholder
                                }}
                            />}

                    </View>
                </TouchableOpacity>
            );
        }
    };


    renderComponent = () => {
        const {
            loading,
            isCreateLoading,
            notifications,
            refresh,
            refreshNotifications,
            oyeURL,
            MyAccountID,
            footerLoading,
            page
        } = this.props;
        // console.log(loading)
        console.log('Data in notification', notifications);

        if (loading) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#fff'
                    }}
                >
                    <ActivityIndicator/>
                </View>
            );
        } else {
            return (
                <Fragment>
                    <FlatList
                        keyExtractor={this.keyExtractor}
                        contentContainerStyle={{flexGrow: 1}}
                        style={{width:'100%',height:'100%'}}
                        ListFooterComponentStyle={{
                            flex: 1,
                            justifyContent: 'flex-end'
                        }}
                        data={notifications}
                        ListFooterComponent={() =>
                            footerLoading ? (
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginVertical: 10
                                    }}
                                >
                                    <ActivityIndicator/>
                                </View>
                            ) : null
                        }
                        renderItem={this.renderItem}
                        extraData={this.props.notifications}
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
                                    refreshNotifications(
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
                    />
                </Fragment>
            );
        }
    };

    render() {
        const {navigation, notifications, oyeURL, MyAccountID} = this.props;
        // const refresh = navigation.getParam("refresh", "NO-ID");
        // console.log(this.state.gateDetails, "gateDetails");
        // console.log("rendered");
        return (
            <View style={styles.container}>
                <NavigationEvents/>

                <SafeAreaView style={{backgroundColor: '#ff8c00'}}>
                    <View style={[styles.viewStyle1, {flexDirection: 'row'}]}>
                        <View style={styles.viewDetails1}>
                            <TouchableOpacity
                                onPress={() => {
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
                        <View style={{flex: 0.2}}></View>
                    </View>
                    <View style={{borderWidth: 1, borderColor: '#ff8c00'}}/>
                </SafeAreaView>

                <View style={{width:'100%',height:'100%'}}>{this.renderComponent()}</View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        width:'100%',
        height:'100%'
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
        shadowOffset: {width: 0, height: 2},
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
        userReducer: state.UserReducer
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
        onGateApp
    }
)(NotificationScreen);