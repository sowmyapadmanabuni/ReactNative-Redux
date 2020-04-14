/*
 * @Author: Sarthak Mishra 
 * @Date: 2020-03-09 16:13:08 
 * @Last Modified by: Sarthak Mishra
 * @Last Modified time: 2020-04-14 11:36:06
 */


import axios from 'axios';
import gateFirebase from 'firebase';
import moment from 'moment';
import React from 'react';
import { Image, Linking, Platform, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { updateNotificationData, updatePopUpNotification } from '../../actions';


let key = 0;


class NotificationPopUp extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            key: 0,
        }
    }

    componentDidMount() {
        this.setState({
            key: 0,
        })
    }


    render() {
        let isNotification = this.props.isNotificationUnRead;
        let { notificationArray } = this.props;
        console.log('In Notification Pop Up main render:', isNotification, notificationArray[0], this.state.key);
        return (
            <View key={this.state.key} 
            style={{ backgroundColor:'transparent',position:'absolute',justifyContent:'center',alignItems:'center',flex:1,alignSelf:'center' }}
            >
                {notificationArray.length !== 0 && isNotification ? this._renderPopUp(notificationArray[0]) : null}
            </View>
        )
    }


    _renderPopUp(item, index) {
        let { isNotificationUnRead, updateNotificationData, notificationArray } = this.props;
        let notificationData = item;
        let inDate = moment()._d
        let enDate = moment(notificationData.ntdCreated)._d
        let duration = Math.abs(inDate - enDate);
        let days = Math.floor(duration / (1000 * 60 * 60 * 24));
        let hours = Math.floor(duration / (1000 * 60 * 60));
        let mins = Math.floor(duration / (1000 * 60));
        let notificationTime = days > 1 ? moment(notificationData.ntdCreated).format('DD MMM YYYY') : days == 1 ? "Yesterday" : mins >= 120 ? hours + " hours ago" : (mins < 120 && mins >= 60) ? hours + " hour ago"
            : mins == 0 ? "Just now" : mins + " mins ago";
        console.log('In Notification Pop Up:', isNotificationUnRead, item, item, notificationTime);

        return (
            <View key={this.state.key} style={{ justifyContent: 'center', alignItems: 'center',borderTopRightRadius: hp('2'), borderTopLeftRadius: hp('2'), height: hp('35'), width: wp('90'),backgroundColor:"red",top:hp('25'),alignSelf:'center',left:hp('0')}}>
                <View
                    key={this.state.key}
                    style={{
                        width: wp('95'),
                        height: hp('35'), borderBottomLeftRadius: hp('2'), borderBottomRightRadius: hp('2'), borderTopRightRadius: hp('2'), borderTopLeftRadius: hp('2'), backgroundColor: '#ffffff', alignSelf: 'center', top: hp('0')
                    }}
                >

                        <LinearGradient
                            colors={['#581113', '#971510']}
                            style={styles.gradientHeader}>
                            <Text allowFontScaling={false} style={styles.headerText}> {notificationData.visitorlog[0].vlComName} delivery {notificationData.visitorlog[0].vlApprStat === "ExitPending" ? "exiting" : "waiting"} at {notificationData.visitorlog[0].vlengName}</Text>

                        </LinearGradient>
                        <View style={styles.contentArea}>
                            <View style={styles.associationView}>
                                <Text allowFontScaling={false} style={styles.associationText}> {notificationData.asAsnName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: wp('85'), alignSelf: 'center', height: hp('7'), alignItems: 'center' }}>
                                <Text allowFontScaling={false} style={{ height: hp('5.5'), width: wp('35'), fontSize: hp('1.5'), color: '#000', textAlign: 'center' }}> Visiting:
                                <Text
                                        numberOfLines={3}
                                        style={{ width: wp('20'), color: "#00ae6b" }}> {notificationData.visitorlog[0].unUniName}
                                    </Text>
                                </Text>

                                <View >
                                    <Text allowFontScaling={false} style={{ fontSize: hp('1.5'), color: '#000', textAlign: 'center' }}> {notificationTime}</Text>
                                </View>
                            </View>
                            <View style={{ borderWidth: 1, width: hp('54'), borderColor: '#e2e2e2', alignSelf: 'center' }} />
                            <View style={{
                                width: wp('10%'),
                                height: hp('12%'),
                                justifyContent: 'center',
                                alignSelf: 'center', bottom: hp('6'), borderWidth: 0
                            }}>
                                <Image
                                    resizeMode={'cover'}
                                    style={{
                                        borderWidth: 0,
                                        width: wp('15%'),
                                        height: wp('15%'),
                                        borderRadius: wp('7.5%')
                                    }}
                                    source={{ uri: 'data:image/png;base64,' + notificationData.visitorlog[0].vlEntryImg }}
                                />
                                <View style={{ width: wp('50'), height: hp('0'), borderWidth: 0, alignSelf: 'center', left: hp('1'), alignItems: 'center', justifyContent: 'center', top: Platform.OS === 'ios' ? 0 : hp('3') }}>
                                    <Text numberOfLines={1} style={{ color: '#333333', textAlign: 'center' }}>{notificationData.visitorlog[0].vlfName}</Text>
                                    <Text onPress={() => this.initiateCall(notificationData.visitorlog[0].vlMobile)} style={{ color: '#B51414', textAlign: 'center', fontSize: hp('1.5') }}>{notificationData.visitorlog[0].vlMobile}</Text>
                                </View>
                            </View>
                        </View>



                        <View style={{ height: hp('8'), width: wp('95'), backgroundColor: '#F0F0F0', bottom: hp('0'), borderTopRightRadius: hp('2'), borderTopLeftRadius: hp('2'), borderRadius: hp('2'), flexDirection: 'row' }}>
                            <View style={{ height: hp('8'), width: wp('45'), bottom: hp('0'), flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', alignItems: 'center' }}>
                                {/* <Image
                                    resizeMode={'center'}
                                    style={{
                                        borderWidth: 0,
                                        width: wp('5%'),
                                        height: hp('5%'),
                                        marginLeft: hp('2')
                                    }}
                                    source={require('../../../icons/police.png')}
                                /> */}
                                <Text style={{ color: '#14C8E5', textAlign: 'center', fontSize: hp('1.5') }}> </Text>
                            </View>
                            <View>
                                {notificationData.visitorlog[0].vlVisType !== 'Staff' ?
                                    <View style={{ height: hp('8'), width: wp('45'), bottom: hp('0'), borderWidth: 0, flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around', alignItems: 'center' }}>
                                        <TouchableHighlight
                                            underlayColor={'transparent'}
                                            onPress={() => this.acceptGateVisitor(
                                                notificationData.visitorlog[0].vlVisLgID,
                                                0,
                                                notificationData.asAssnID,
                                                notificationData.visitorlog[0].vlApprStat === "Exit Pending" ? "Exit Approved" : "Entry Approved",
                                                notificationData.ntid,
                                                notificationData.visitorlog[0].vlApprdBy,
                                                notificationData.visitorlog[0].vlApprStat
                                            )}
                                            style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 0, left: hp('1') }}>
                                            <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 0, left: hp('1') }}>
                                                <Image
                                                    resizeMode={'center'}
                                                    style={{
                                                        borderWidth: 0,
                                                        width: wp('6%'),
                                                        height: hp('6%'),
                                                        marginLeft: hp('0')
                                                    }}
                                                    source={require('../../../icons/allow.png')}
                                                />
                                                <Text style={{ color: 'green', textAlign: 'center', fontSize: hp('2') }}> Allow</Text>
                                            </View>
                                        </TouchableHighlight>
                                        <TouchableHighlight
                                            underlayColor={'transparent'}
                                            onPress={() => this.denyGateVisitor(
                                                notificationData.visitorlog[0].vlVisLgID,
                                                item.index,
                                                notificationData.asAssnID,
                                                notificationData.visitorlog[0].vlApprStat === "Exit Pending" ? "Exit Rejected" : "Entry Rejected",
                                                notificationData.ntid,
                                                notificationData.visitorlog[0].vlApprdBy,
                                                notificationData.visitorlog[0].vlApprStat
                                            )}
                                            style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 0 }}>
                                            <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 0, left: hp('1') }}>
                                                <Image
                                                    resizeMode={'center'}
                                                    style={{
                                                        borderWidth: 0,
                                                        width: wp('6%'),
                                                        height: hp('6%'),
                                                        marginLeft: hp('0'),
                                                    }}
                                                    source={require('../../../icons/deny_1.png')}
                                                />
                                                <Text style={{ color: '#B51414', textAlign: 'center', fontSize: hp('2') }}> Deny</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    :
                                    <TouchableHighlight
                                        underlayColor={'transparent'}
                                        onPress={() => this.removeNotificationData()}
                                        style={{ flexDirection: 'row', alignSelf: 'flex-end', justifyContent: 'flex-end', alignItems: 'flex-end', borderWidth: 0, left: hp('15') }}>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 0, left: hp('1') }}>
                                            <Image
                                                resizeMode={'center'}
                                                style={{
                                                    borderWidth: 0,
                                                    width: wp('6%'),
                                                    height: hp('6%'),
                                                }}
                                                source={require('../../../icons/allow.png')}
                                            />
                                            <Text style={{ color: 'green', textAlign: 'center', fontSize: hp('2') }}> Ok</Text>
                                        </View>
                                    </TouchableHighlight>}
                            </View>
                        </View>
                </View>
            </View>
        )
    }

    closeModal() {
        console.log("Closing Modal")
        const { updateNotificationData } = this.props;
        updateNotificationData(false);

    }

    initiateCall(number) {
        let phoneNumber = number;
        if (Platform.OS === 'ios') {
            phoneNumber = `telprompt:${number}`;
        } else {
            phoneNumber = `tel:${number}`;
        }

        console.log('Making Call Now:', phoneNumber)

        Linking.canOpenURL(phoneNumber)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Phone number is not available');
                } else {
                    return Linking.openURL(phoneNumber);
                }
            })
            .catch(err => console.log(err));
    };


    async acceptGateVisitor(visitorId, index, associationid, visitorStatus, notifiId, approvedBy, approvalStatus) {


        console.log('SENDING STATUS TO ACCEPT NOTIFICATION', visitorId, index, associationid, visitorStatus, notifiId, approvedBy);

        const headers = {
            'Content-Type': 'application/json',
            'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
        }

        let currentDateOption = {
            method: 'get',
            url: `http://${this.props.oyeURL}/oyesafe/api/v1/GetCurrentDateTime`,
            headers: headers
        };

        let currentDate = await axios(currentDateOption);

        console.log("Current Time:", currentDate);

        let currentTime = currentDate.data.data.currentDateTime;

        let approvalOptions = {
            method: 'post',
            url: `http://${this.props.oyeURL}/oyesafe/api/v1/UpdateApprovalStatus`,
            data: {
                VLApprStat: visitorStatus,
                VLVisLgID: visitorId,
                VLApprdBy: visitorStatus == "Entry Approved" ? this.props.userReducer.MyFirstName : approvedBy,
                VLExAprdBy: visitorStatus == "Exit Approved" ? this.props.userReducer.MyFirstName : "",
            },
            headers: headers
        }
        try {
            let approvalResponse = await axios(approvalOptions);

            console.log("Approval Stat:", approvalResponse);


            if (approvalResponse.status === 200) {
                gateFirebase
                    .database()
                    .ref(`NotificationSync/A_${associationid}/${visitorId}`)
                    .set({
                        buttonColor: '#75be6f',
                        opened: true,
                        newAttachment: false,
                        visitorlogId: visitorId,
                        updatedTime: currentTime,
                        status: visitorStatus,
                    });
                axios.get(
                    `http://${this.props.oyeURL}/oyesafe/api/v1/NotificationActiveStatusUpdate/${notifiId}`,
                    {
                        headers: {
                            'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE',
                            'Content-Type': 'application/json'
                        },
                    },


                )
                    .then(responses => {
                        console.log('NotificationDeleted', responses)
                    })
                    .catch(e => {
                        console.log('RESPONSE2222', e)
                    })


                this.removeNotificationData();
            }
        } catch (error) {
            console.log('error:', error);
            alert("Request already accepted")
            //this.refs.toast.show('Request already accepted');
            this.removeNotificationData();
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
                })
        }
    };


    async denyGateVisitor(visitorId, index, associationid, visitorStatus, notifiId, approvedBy, approvalStatus) {


        console.log('SENDING STATUS TO DENY NOTIFICATION', visitorId, index, associationid, visitorStatus, notifiId, approvedBy);

        const headers = {
            'Content-Type': 'application/json',
            'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
        }

        let currentDateOption = {
            method: 'get',
            url: `http://${this.props.oyeURL}/oyesafe/api/v1/GetCurrentDateTime`,
            headers: headers
        };

        let currentDate = await axios(currentDateOption);

        console.log("Current Time:", currentDate);

        let currentTime = currentDate.data.data.currentDateTime;

        let approvalOptions = {
            method: 'post',
            url: `http://${this.props.oyeURL}/oyesafe/api/v1/UpdateApprovalStatus`,
            data: {
                VLApprStat: visitorStatus,
                VLVisLgID: visitorId,
                VLApprdBy: visitorStatus == "Entry Rejected" ? this.props.userReducer.MyFirstName : approvedBy,
                VLExAprdBy: visitorStatus == "Exit Rejected" ? this.props.userReducer.MyFirstName : "",
            },
            headers: headers
        }
        try {
            let approvalResponse = await axios(approvalOptions);

            console.log("Rejection Stat:", approvalResponse);


            if (approvalResponse.status === 200) {

                axios.get(
                    `http://${this.props.oyeURL}/oyesafe/api/v1/NotificationActiveStatusUpdate/${notifiId}`,
                    {
                        headers: {
                            'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE',
                            'Content-Type': 'application/json'
                        },
                    },


                )
                    .then(responses => {
                        console.log('NotificationDeleted', responses)
                    })
                    .catch(e => {
                        console.log('RESPONSE2222', e)
                    })


                gateFirebase
                    .database()
                    .ref(`NotificationSync/A_${associationid}/${visitorId}`)
                    .set({
                        buttonColor: '#ff0000',
                        opened: true,
                        newAttachment: false,
                        visitorlogId: visitorId,
                        updatedTime: currentTime,
                        status: visitorStatus,
                    });
                this.removeNotificationData()
            }
        } catch (error) {
            console.log('error:', error);
            alert("Request already denied")
            // this.refs.toast.show('Request already denied');
            this.removeNotificationData()
            gateFirebase
                .database()
                .ref(`NotificationSync/A_${associationid}/${visitorId}`)
                .set({
                    buttonColor: '#ff0000',
                    opened: true,
                    newAttachment: false,
                    visitorlogId: visitorId,
                    updatedTime: null,
                    status: visitorStatus
                })
        }
    };



    removeNotificationData() {
        const { notificationArray, updatePopUpNotification, updateNotificationData } = this.props;
        console.log("Notification before splicing:", notificationArray)
        notificationArray.splice(0, 1);
        console.log("Notification after splicing:", notificationArray)
        updatePopUpNotification(notificationArray);
        this.forceUpdate();
        if (notificationArray.length === 0) {
            this.closeModal()
        } else {
            setTimeout(() => {
                updateNotificationData(true)
            }, 1000);
        }
        this.setState({
            key: Math.random()
        })

    }


}


const styles = StyleSheet.create({
    container: {
        height: hp('35'), width: wp('90'),
        alignSelf: 'center',
        borderRadius: hp('2'), alignSelf: 'center', backgroundColor: '#fff'
    },
    gradientHeader: {
        height: hp('6'), width: wp('95'), borderTopRightRadius: hp('2'),
        borderTopLeftRadius: hp('2'), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderWidth: 0
    },
    headerText: {
        fontSize: hp('2.2'), color: '#fff', width: wp('80'), textAlign: 'center'
    },
    contentArea: {
        flexDirection: 'column',
        height: hp('25'),
        borderWidth: 0
    },
    associationView: { justifyContent: 'center', height: hp('5'), alignSelf: 'center', borderWidth: 0 },
    associationText: { fontSize: hp('2.2'), color: '#000', textAlign: 'center' }
})

const mapStateToProps = state => {
    console.log('State in NotificationPopUp:', state);
    return {
        isNotificationUnRead: state.DashboardReducer.isNotification,
        notificationArray: state.NotificationReducer.popUpNotification,
        userReducer: state.UserReducer,
        oyeURL: state.OyespaceReducer.oyeURL,

    }
}



export default connect(mapStateToProps, { updateNotificationData, updatePopUpNotification })(NotificationPopUp);