import axios from 'axios';
import moment from 'moment';
import { 
            GET_NOTIFICATIONS, 
            NEW_NOTIF_INSTANCE, 
            CREATE_NEW_NOTIFICATION, 
            CREATE_NEW_NOTIFICATION_SUCCESS, 
            CREATE_NEW_NOTIFICATION_FAILED, 
            GET_NOTIFICATIONS_SUCCESS,
            GET_NOTIFICATIONS_FAILED,
            ON_NOTIFICATION_OPEN,
        } from './types';

        
export const createNotification = (data, navigation, navigate, admin) => {
    // console.log(data)
    return (dispatch) => {
        dispatch({ type: CREATE_NEW_NOTIFICATION });

        let headers = {
            "Content-Type": "application/json",
            "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
        }

        let date = moment();
        let formatdate = date._d
        console.log(formatdate)
        // console.log(moment(datee).fromNow())

        if(admin === 'true') {
            axios.post(`http://${global.oyeURL}/oyesafe/api/v1/Notification/Notificationcreate`, {
            // axios.post('http://apidev.oyespace.com/oyesafe/api/v1/Notification/Notificationcreate',{
            ACAccntID: global.MyAccountID,
            ASAssnID: data.associationID,
            NTType: data.ntType,
            NTDesc: data.ntDesc,
            SBUnitID: data.sbUnitID,
            SBMemID: data.sbMemID,
            SBSubID: data.sbSubID,
            SBRoleID: data.sbRoleId,
            ASAsnName: data.associationName,
            MRRolName: data.unitName,
            NTDCreated: formatdate,
            NTDUpdated: formatdate,
            UNOcSDate: data.occupancyDate,
	        UNSldDate : data.soldDate,
            // ntIsActive: false
            }, {
                headers: headers
            })
            .then((response) => {
                let responseData = response.data;
                console.log(responseData)
                dispatch({ type: CREATE_NEW_NOTIFICATION_SUCCESS })
                if(navigate) {
                    let ACAccntIDn = global.MyAccountID;
                    let ASAssnID = data.associationID;
                    axios.get(`http://${global.oyeURL}/oyesafe/api/v1/Notification/GetNotificationListByAssocAccntID/${ACAccntIDn}/${ASAssnID}`, {
                    // axios.get(`http://apidev.oyespace.com/oyesafe/api/v1/Notification/GetNotificationListByAssocAccntID/${ACAccntIDn}/${ASAssnID}`, {
                        headers: {
                            "Content-Type": "application/json",
                            "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
                        }
                    })
                    .then(response => {
                        console.log(response.data)
                        let responseData = response.data.data;
                        if(response.data.success) {
                            console.log(response.data)
                            dispatch({ 
                                type: GET_NOTIFICATIONS_SUCCESS, 
                                payload: responseData.notificationListByAssocAcctID.reverse()
                            })
                        } else {
                            dispatch({ 
                                type: GET_NOTIFICATIONS_FAILED, 
                                payload: ''
                            })
                        }
                    })
                    .catch(error => {
                    console.log(error)
                    console.log(error.message)
                    dispatch({ 
                        type: GET_NOTIFICATIONS_FAILED, 
                        payload: ''
                    })
                    })  
                    console.log(navigation)
                    navigation.navigate('NotificationScreen', {
                        refresh: true
                    });
                }
                // dispatch({ type})
            })
            .catch(error => {
                console.log(error.message);
                dispatch({ type: CREATE_NEW_NOTIFICATION_FAILED })
            })
        } else if(admin === 'false') {
            axios.post(`http://${global.oyeURL}/oyesafe/api/v1/Notification/Notificationcreate`, {
                ACAccntID: global.MyAccountID,
                ASAssnID: data.associationID,
                NTType: data.ntType,
                NTDesc: data.ntDesc,
                SBUnitID: 'resident_user',
                SBMemID: 'resident_user',
                SBSubID: 'resident_user',
                SBRoleID: 'resident_user',
                ASAsnName: 'resident_user',
                MRRolName: 'resident_user',
                NTDCreated: formatdate,
                NTDUpdated: formatdate,
                UNOcSDate: 'resident_user',
	            UNSldDate : 'resident_user',
                // ntIsActive: false
            }, {
                headers: headers
            })
            .then((response) => {
                let responseData = response.data;
                console.log(responseData)
                dispatch({ type: CREATE_NEW_NOTIFICATION_SUCCESS })
                if(navigate) {
                    let ACAccntIDn = global.MyAccountID;
                    let ASAssnID = data.associationID;
                    axios.get(`http://${global.oyeURL}/oyesafe/api/v1/Notification/GetNotificationListByAssocAccntID/${ACAccntIDn}/${ASAssnID}`, {
                        headers: {
                            "Content-Type": "application/json",
                            "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
                        }
                    })
                    .then(response => {
                        console.log(response.data)
                        let responseData = response.data.data;
                        if(response.data.success) {
                            console.log(response.data)
                            dispatch({ 
                                type: GET_NOTIFICATIONS_SUCCESS, 
                                payload: responseData.notificationListByAssocAcctID.reverse()
                            })
                        } else {
                            dispatch({ 
                                type: GET_NOTIFICATIONS_FAILED, 
                                payload: ''
                            })
                        }
                    })
                    .catch(error => {
                    console.log(error)
                    console.log(error.message)
                    dispatch({ 
                        type: GET_NOTIFICATIONS_FAILED, 
                        payload: ''
                    })
                    })  
                    console.log(navigation)
                    navigation.navigate('NotificationScreen', {
                        refresh: true
                    });
                }
                // dispatch({ type})
            })
            .catch(error => {
                console.log(error.message);
                dispatch({ type: CREATE_NEW_NOTIFICATION_FAILED })
            })
        } else if(admin === 'gate_app') {
            axios.post(`http://${global.oyeURL}/oyesafe/api/v1/Notification/Notificationcreate`, {
                ACAccntID: global.MyAccountID,
                ASAssnID: data.associationID,
                NTType: data.ntType,
                NTDesc: data.ntDesc,
                SBUnitID: 'gate_app',
                SBMemID: 'gate_app',
                SBSubID: 'gate_app',
                SBRoleID: 'gate_app',
                ASAsnName: 'gate_app',
                MRRolName: 'gate_app',
                NTDCreated: formatdate,
                NTDUpdated: formatdate,
                UNOcSDate: 'gate_app',
	            UNSldDate : 'gate_app',
                // ntIsActive: false
            }, {
                headers: headers
            })
            .then((response) => {
                let responseData = response.data;
                console.log(responseData)
                dispatch({ type: CREATE_NEW_NOTIFICATION_SUCCESS })
                if(navigate) {
                    let ACAccntIDn = global.MyAccountID;
                    let ASAssnID = data.associationID;
                    axios.get(`http://${global.oyeURL}/oyesafe/api/v1/Notification/GetNotificationListByAssocAccntID/${ACAccntIDn}/${ASAssnID}`, {
                        headers: {
                            "Content-Type": "application/json",
                            "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
                        }
                    })
                    .then(response => {
                        console.log(response.data)
                        let responseData = response.data.data;
                        if(response.data.success) {
                            console.log(response.data)
                            dispatch({ 
                                type: GET_NOTIFICATIONS_SUCCESS, 
                                payload: responseData.notificationListByAssocAcctID.reverse()
                            })
                        } else {
                            dispatch({ 
                                type: GET_NOTIFICATIONS_FAILED, 
                                payload: ''
                            })
                        }
                    })
                    .catch(error => {
                    console.log(error)
                    console.log(error.message)
                    dispatch({ 
                        type: GET_NOTIFICATIONS_FAILED, 
                        payload: ''
                    })
                    })  
                    console.log(navigation)
                    navigation.navigate('NotificationScreen', {
                        refresh: true
                    });
                }
                // dispatch({ type})
            })
            .catch(error => {
                console.log(error.message);
                dispatch({ type: CREATE_NEW_NOTIFICATION_FAILED })
            })
        }
    }
}

export const getNotifications = (accountId, associationID, admin) => {
    console.log(accountId, associationID, admin )

    return(dispatch) => {
        dispatch({ type: GET_NOTIFICATIONS });
        
        if(admin) {
            axios.get(`http://${global.oyeURL}/oyesafe/api/v1/Notification/GetNotificationListByAssocAccntID/${ACAccntIDn}/${ASAssnID}`, {
            // axios.get(`http://apidev.oyespace.com/oyesafe/api/v1/Notification/GetNotificationListByAssocAccntID/${accountId}/${associationID}`, {
                headers: {
                    "Content-Type": "application/json",
                    "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
                }
            })
            .then(response => {
                let responseData = response.data.data;
                if(response.data.success) {
                    console.log(response.data)
                    dispatch({ 
                        type: GET_NOTIFICATIONS_SUCCESS, 
                        payload: responseData
                    })
                } else {
                    dispatch({ 
                        type: GET_NOTIFICATIONS_FAILED, 
                        payload: ''
                    })
                }
            })
            .catch(error => {
                console.log(error)
                console.log(error.message)
                dispatch({ 
                    type: GET_NOTIFICATIONS_FAILED, 
                    payload: ''
                })
            })
        }
    }
}

export const newNotifInstance = (data) => {
    return (dispatch) => {
        dispatch({
            type: NEW_NOTIF_INSTANCE,
            payload: data
        })
    }
}

export const onNotificationOpen = (notif, index) => {
    console.log(index)
    return (dispatch) => {
        newNotif = Object.assign([], notif);
        newNotif[index].ntIsActive = false;
        newNotif[index].ntIsActive = false;
        console.log(newNotif[index].ntIsActive)
        // newNotif.notificationListByAssocAcctID[index].ntIsActive = false;

        dispatch({
            type: ON_NOTIFICATION_OPEN,
            payload: newNotif,
        })
    }
}

export const reverseNotification = (notification) => {
    return (dispatch) => {
        dispatch({
            type: REVERSE_NOTIFICATION,
            payload: notification.reverse()
        })
    }
}