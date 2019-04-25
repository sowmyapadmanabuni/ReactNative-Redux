import axios from 'axios';
import { 
            GET_NOTIFICATIONS, 
            NEW_NOTIF_INSTANCE, 
            CREATE_NEW_NOTIFICATION, 
            CREATE_NEW_NOTIFICATION_SUCCESS, 
            CREATE_NEW_NOTIFICATION_FAILED, 
            GET_NOTIFICATIONS_SUCCESS,
            GET_NOTIFICATIONS_FAILED,
            ON_NOTIFICATION_OPEN
        } from './types';

export const createNotification = (data, navigation, navigate) => {
    return (dispatch) => {
        console.log('_________')
        console.log(data)
        console.log(navigation)
        dispatch({ type: CREATE_NEW_NOTIFICATION });

        let headers = {
            "Content-Type": "application/json",
            "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
        }

        axios.post('http://apidev.oyespace.com/oyesafe/api/v1/Notification/Notificationcreate',{
            ACAccntID: global.MyAccountID,
            ASAssnID: data.associationID,
            NTType: data.ntType,
            NTDesc: data.ntDesc,
            SBUnitID: data.sbUnitID,
            SBMemID: data.sbMemID,
            SBSubID: data.sbSubID,
            SBRoleID: data.sbRoleId,
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
                axios.get(`http://apidev.oyespace.com/oyesafe/api/v1/Notification/GetNotificationListByAssocAccntID/${ACAccntIDn}/${ASAssnID}`, {
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

export const getNotifications = (accountId, associationID, admin) => {
    console.log(accountId, associationID, admin )

    return(dispatch) => {
        dispatch({ type: GET_NOTIFICATIONS });
        
        if(admin) {
            axios.get(`http://apidev.oyespace.com/oyesafe/api/v1/Notification/GetNotificationListByAssocAccntID/${accountId}/${associationID}`, {
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
    return (dispatch) => {
        newNotif = Object.assign({}, notif);
        newNotif.notificationListByAssocAcctID[index].ntIsActive = false;

        dispatch({
            type: ON_NOTIFICATION_OPEN,
            payload: newNotif,
        })
    }
}