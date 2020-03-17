import axios from 'axios';
import moment from 'moment';
import {
  CREATE_NEW_NOTIFICATION,
  CREATE_NEW_NOTIFICATION_FAILED,
  CREATE_NEW_NOTIFICATION_SUCCESS,
  GET_NOTIFICATIONS,
  GET_NOTIFICATIONS_FAILED,
  GET_NOTIFICATIONS_SUCCESS,
  NEW_NOTIF_INSTANCE,
  ON_END_START,
  ON_END_SUCCESS,
  ON_NOTIFICATION_OPEN,
  REFRESH_NOTIFICATION_FAILED,
  REFRESH_NOTIFICATION_START,
  REFRESH_NOTIFICATION_SUCCESS,
  TOGGLE_ADMIN_NOTIFICATION,
  TOGGLE_COLLAPSIBLE,
  ON_GATE_OPEN,
  SEGREGATE_UNIT_NOTIFICATION,
  SEGREGATE_ADMIN_NOTIFICATION,
  SEGREGATE_DUMMY_UNIT_NOTIFICATION,
  SEGREGATE_DUMMY_ADMIN_NOTIFICATION,
  TOGGLE_UNIT_COLLAPSIBLE,
  TOGGLE_ADMIN_COLLAPSIBLE
} from './types';
import _ from 'lodash';
import firebase from 'firebase';
import { notifications } from 'react-native-firebase';

export const segregateUnitNotification = (notification) => {
  console.log('Notification in Unit reducer:',notification)
  return dispatch => {
    dispatch({
      type:SEGREGATE_UNIT_NOTIFICATION,
      payload:notification
    })
  }
}

export const segregateAdminNotification = (notification) => {
  return dispatch => {
    dispatch({
      type:SEGREGATE_ADMIN_NOTIFICATION,
      payload:notification
    })
  }
}

export const segregateDummyUnitNotification = (notification) => {
  console.log('Notification in Unit reducer:',notification)
  return dispatch => {
    dispatch({
      type:SEGREGATE_DUMMY_UNIT_NOTIFICATION,
      payload:notification
    })
  }
}

export const segregateDummyAdminNotification = (notification) => {
  return dispatch => {
    dispatch({
      type:SEGREGATE_DUMMY_ADMIN_NOTIFICATION,
      payload:notification
    })
  }
}

export const getNotifications = (oyeURL, MyAccountID, page, notifications) => {
  return dispatch => {
    let page = 1;
    
    dispatch({ type: GET_NOTIFICATIONS });
    fetch(
      'http://' +
        oyeURL +
        '/oyesafe/api/v1/Notification/GetNotificationListByAccntID/' +
        MyAccountID +
        '/' +
        page,
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
        console.log('GET THE NOTIFICATIONS PLZ',responseJson,oyeURL, MyAccountID)
        let resData = responseJson.data.notificationListByAcctID;
        let userImage=responseJson.data.accountImage.acImgName;
        let activeNotifications = [];

        

        _.forEach(resData, function(value) {
          activeNotifications.push({ ...value, read: false });
        });
        let joinNotif = [];
        let joinStatNotif = [];
        let gateAppNotif = [];
        let announcement = [];

        activeNotifications.map((data, index) => {
          if (data.ntType === 'gate_app') {
            data.vlfName = data.visitorlog[0].vlfName;
            data.unUniName = data.visitorlog[0].unUniName;
            data.vlMobile = data.visitorlog[0].vlMobile;
            gateAppNotif.push({ open:true, ...data });
          } else if (data.ntType === 'Join_Status') {
            joinStatNotif.push({open:true, ...data});
          } else if (data.ntType === 'Join' || data.ntType === 'joinrequest') {
            joinNotif.push({open:true, ...data});
          } else if (data.ntType === 'Announcement') {
            data.vlfName = "Announcement";
            data.unUniName = "Announcement";
            data.vlMobile = "Announcement";
            announcement.push(data);
          }
        });
        

          for(let i=0;i<joinNotif.length;i++){
              joinNotif[i].userImage=userImage
          }
          for(let i=0;i<joinStatNotif.length;i++){
              joinStatNotif[i].userImage=userImage
          }
         // console.log('JOIN NOTIFICATIONS#####',joinNotif,joinStatNotif)
          const uniqueJoinStat = _.uniqBy(joinStatNotif, 'sbSubID');
        const uniqueJoin = _.uniqBy(joinNotif, 'sbSubID');
        let allNotifs = [
          ...gateAppNotif,
          ...uniqueJoinStat,
          ...uniqueJoin,
          ...announcement,
        ];

        

       
        const sorted = [...allNotifs];

         



        let firebaseNoti = [];

        var promises = sorted.map(function(data, index) {
          if (data.ntType !== 'gate_app') {
            firebaseNoti.push({ ...data });
            return firebaseNoti;
          } else {
            let dbRef = firebase
              .database()
              .ref(`NotificationSync/A_${data.asAssnID}/${data.sbMemID}`);

            return dbRef.once('value').then(snapshot => {

              let val = snapshot.val();
              firebaseNoti.push({ ...data, ...val });
            });
          }
        });

       
        let unitNotification = [];
        let adminNotification = [];
        let succ = _.sortBy(allNotifs, ['ntdCreated']).reverse();
        let j=0 ; let k=0;
        for(let i in succ){
          if(succ[i].ntType === "joinrequest" || succ[i].ntType === "Join"){
            succ[i].notifIndex=j
            j=j+1;
            adminNotification.push(succ[i])
          }else{
            succ[i].notifIndex=k
            k=k+1;
            unitNotification.push(succ[i])
          }
        }

        console.log("Unit Notification in reducer::::::",unitNotification,adminNotification)
        
          dispatch({
            type:SEGREGATE_UNIT_NOTIFICATION,
            payload:unitNotification
          })
        
        
          dispatch({
            type:SEGREGATE_DUMMY_UNIT_NOTIFICATION,
            payload:unitNotification
          })

          dispatch({
            type:SEGREGATE_ADMIN_NOTIFICATION,
            payload:adminNotification
          })
        
        
          dispatch({
            type:SEGREGATE_DUMMY_ADMIN_NOTIFICATION,
            payload:adminNotification
          })

          

        Promise.all(promises).then(function(results) {
          let succ = _.sortBy(allNotifs, ['ntdCreated']).reverse();
          dispatch({
            type: GET_NOTIFICATIONS_SUCCESS,
            payload: [...succ]
          });
        });

        // sorted.map((data, index) => {
        //   if (data.ntType !== 'gate_app') {
        //     firebaseNoti.push({ ...data });
        //   } else {
        //     firebase
        //       .database()
        //       .ref(`NotificationSync/A_${data.asAssnID}/${data.sbMemID}`)
        //       .on('value', snapshot => {
        //         let val = snapshot.val();
        //         firebaseNoti.push({ ...data, ...val });
        //         // console.log(snapshot.val(), 'value_firebase');
        //         dispatch({
        //           type: GET_NOTIFICATIONS_SUCCESS,
        //           payload: [...firebaseNoti]
        //         });
        //       });
        //   }
        // });
      })
      .catch(error => {
        console.log(error, 'error fetching notifications');
        dispatch({
          type: GET_NOTIFICATIONS_FAILED,
          payload: []
        });
      });
  };
};

export const createNotification = (
  data,
  navigation,
  navigate,
  admin,
  oyeURL,
  MyAccountID
) => {
  return dispatch => {
    dispatch({ type: CREATE_NEW_NOTIFICATION });

    let headers = {
      'Content-Type': 'application/json',
      'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
    };

    let date = moment();
    let formatdate = date._d;
    console.log(oyeURL);
    console.log(data);
    console.log(navigation);

    if (admin === 'true') {
      console.log({
        ACAccntID: MyAccountID,
        ASAssnID: data.associationID,
        NTType: data.ntType,
        NTDesc: data.ntDesc,
        SBUnitID: 'resident_user',
        SBMemID: 'resident_user',
        SBSubID: data.sbSubID,
        SBRoleID: 'resident_user',
        ASAsnName: 'resident_user',
        MRRolName: 'resident_user',
        NTDCreated: formatdate,
        NTDUpdated: formatdate,
        UNOcSDate: 'resident_user',
        UNSldDate: 'resident_user'
      });
      axios
        .post(
          `http://${oyeURL}/oyesafe/api/v1/Notification/Notificationcreate`,
          {
            // axios.post('http://apidev.oyespace.com/oyesafe/api/v1/Notification/Notificationcreate',{
            ACAccntID: MyAccountID,
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
            UNSldDate: data.soldDate
            // ntIsActive: false
          },
          {
            headers: headers
          }
        )
        .then(response => {
          let responseData = response.data;
          // console.log(responseData);
          dispatch({ type: CREATE_NEW_NOTIFICATION_SUCCESS });
          if (navigate) {
            fetch(
              'http://' +
                oyeURL +
                '/oyesafe/api/v1/Notification/GetNotificationListByAccntID/' +
                MyAccountID,
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
                // console.log(responseJson.data.notificationListByAcctID)
                let resData = responseJson.data.notificationListByAcctID;

                let activeNotifications = [];

                _.forEach(resData, function(value) {
                  activeNotifications.push({ ...value, read: false });
                });

                const sorted = _.sortBy(activeNotifications, [
                  'ntdCreated',
                  'ntdUpdated'
                ]).reverse();
                const unique = _.uniqBy(sorted, 'sbSubID');

                // console.log(sorted)
                // console.log(unique)
                

                dispatch({
                  type: GET_NOTIFICATIONS_SUCCESS,
                  payload: unique
                });
              })
              .catch(error => {
                console.log(error);
                dispatch({
                  type: GET_NOTIFICATIONS_FAILED,
                  payload: ''
                });
              });

            navigation.navigate('NotificationScreen', {
              refresh: true
            });
          }
          // dispatch({ type})
        })
        .catch(error => {
          console.log(error.message);
          dispatch({ type: CREATE_NEW_NOTIFICATION_FAILED });
        });
    } else if (admin === 'false') {
      // console.log(data)
      axios
        .post(
          `http://${oyeURL}/oyesafe/api/v1/Notification/Notificationcreate`,
          {
            ACAccntID: MyAccountID,
            ASAssnID: data.associationID,
            NTType: data.ntType,
            NTDesc: data.ntDesc,
            SBUnitID: 'resident_user',
            SBMemID: 'resident_user',
            SBSubID: data.sbSubID,
            SBRoleID: 'resident_user',
            ASAsnName: 'resident_user',
            MRRolName: 'resident_user',
            NTDCreated: formatdate,
            NTDUpdated: formatdate,
            UNOcSDate: 'resident_user',
            UNSldDate: 'resident_user'
            // ntIsActive: false
          },
          {
            headers: headers
          }
        )
        .then(response => {
          let responseData = response.data;
          console.log(responseData);
          dispatch({ type: CREATE_NEW_NOTIFICATION_SUCCESS });
          if (navigate) {
            // dispatch({ type: GET_NOTIFICATIONS });
            fetch(
              'http://' +
                oyeURL +
                '/oyesafe/api/v1/Notification/GetNotificationListByAccntID/' +
                MyAccountID,
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
                // console.log(responseJson.data.notificationListByAcctID)
                let resData = responseJson.data.notificationListByAcctID;

                let activeNotifications = [];

                _.forEach(resData, function(value) {
                  activeNotifications.push({ ...value, read: false });
                });

                const sorted = _.sortBy(activeNotifications, [
                  'ntdCreated',
                  'ntdUpdated'
                ]).reverse();
                const unique = _.uniqBy(sorted, 'sbSubID');

                // console.log(sorted)
                // console.log(unique)

                dispatch({
                  type: GET_NOTIFICATIONS_SUCCESS,
                  payload: unique
                });
              })
              .catch(error => {
                console.log(error);
                dispatch({
                  type: GET_NOTIFICATIONS_FAILED,
                  payload: ''
                });
              });

            navigation.navigate('NotificationScreen', {
              refresh: true
            });
          }
        })
        .catch(error => {
          console.log(error.message);
          dispatch({ type: CREATE_NEW_NOTIFICATION_FAILED });
        });
    } else if (admin === 'gate_app') {
      axios
        .post(
          `http://${oyeURL}/oyesafe/api/v1/Notification/Notificationcreate`,
          {
            ACAccntID: MyAccountID,
            ASAssnID: data.associationID,
            NTType: data.ntType,
            NTDesc: data.ntDesc,
            SBUnitID: 'gate_app',
            SBMemID: 'gate_app',
            SBSubID: data.sbSubID,
            SBRoleID: 'gate_app',
            ASAsnName: 'gate_app',
            MRRolName: 'gate_app',
            NTDCreated: formatdate,
            NTDUpdated: formatdate,
            UNOcSDate: 'gate_app',
            UNSldDate: 'gate_app'
          },
          {
            headers: headers
          }
        )
        .then(response => {
          let responseData = response.data;
          console.log(responseData);
          dispatch({ type: CREATE_NEW_NOTIFICATION_SUCCESS });
          if (navigate) {
            fetch(
              'http://' +
                oyeURL +
                '/oyesafe/api/v1/Notification/GetNotificationListByAccntID/' +
                MyAccountID,
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
                // console.log(responseJson.data.notificationListByAcctID)
                let resData = responseJson.data.notificationListByAcctID;

                let activeNotifications = [];

                _.forEach(resData, function(value) {
                  activeNotifications.push({ ...value, read: false });
                });

                const sorted = _.sortBy(activeNotifications, [
                  'ntdCreated',
                  'ntdUpdated'
                ]).reverse();
                const unique = _.uniqBy(sorted, 'sbSubID');

                console.log(sorted);
                console.log(unique);

                dispatch({
                  type: GET_NOTIFICATIONS_SUCCESS,
                  payload: unique
                });
              })
              .catch(error => {
                console.log('error', error);
                dispatch({
                  type: GET_NOTIFICATIONS_FAILED,
                  payload: ''
                });
              });

            navigation.navigate('NotificationScreen', {
              refresh: true
            });
          }
        })
        .catch(error => {
          console.log(error.message);
          dispatch({ type: CREATE_NEW_NOTIFICATION_FAILED });
        });
    }
  };
};

export const newNotifInstance = data => {
  return dispatch => {
    dispatch({
      type: NEW_NOTIF_INSTANCE,
      payload: data
    });
  };
};

export const onNotificationOpen = (notif, index, oyeURL,ntid) => {
  console.log("Notification to be read:",notif,index,oyeURL);
  return dispatch => {
    let newNotif = Object.assign([], notif);
    newNotif[index].read = true;
  
    newNotif[index].ntIsActive = false;

    let headers = {
      'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE',
      'Content-Type': 'application/json'
    };

    console.log("NOTIFICATION READ",newNotif[index]);

    axios
      .get(
        `http://${oyeURL}/oyesafe/api/v1/NotificationActiveStatusUpdate/${ntid}`,
        {
          headers: headers
        }
      )
      .then(res => {
        console.log("On Notification Open:",res.data);
      })
      .catch(error => {
        console.log(error);
      });

    console.log(newNotif[index].ntid);
    dispatch({
      type: ON_NOTIFICATION_OPEN,
      payload: newNotif
    });
  };
};

export const reverseNotification = notification => {
  return dispatch => {
    dispatch({
      type: REVERSE_NOTIFICATION,
      payload: notification.reverse()
    });
  };
};

export const toggleAdminNotification = val => {
  return dispatch => {
    dispatch({
      type: TOGGLE_ADMIN_NOTIFICATION,
      payload: val
    });
  };
};

export const refreshNotifications = (
  oyeURL,
  MyAccountID,
  page,
  notifications
) => {
  return dispatch => {
    let page = 1;
    // console.log("Notification_URLS", oyeURL, MyAccountID);
    // console.log(
    //   "http://" +
    //     oyeURL +
    //     "/oyesafe/api/v1/Notification/GetNotificationListByAccntID/" +
    //     MyAccountID +
    //     "/" +
    //     page
    // );
    dispatch({
      type: REFRESH_NOTIFICATION_START
    });
    fetch(
      'http://' +
        oyeURL +
        '/oyesafe/api/v1/Notification/GetNotificationListByAccntID/' +
        MyAccountID +
        '/' +
        page,
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
        console.log('Check list', responseJson);
        let resData = responseJson.data.notificationListByAcctID;
        console.log('resData', resData);
        let activeNotifications = [];

        _.forEach(resData, function(value) {
          activeNotifications.push({ ...value, read: false });
        });

         console.log("REFRESH_NOTIFICATION@@@@@____",activeNotifications);
        let joinNotif = [];
        let joinStatNotif = [];
        let gateAppNotif = [];
        let announcement = [];

        activeNotifications.map((data, index) => {
          if (data.ntType === 'gate_app') {
            gateAppNotif.push({ open: true, ...data });
          } else if (data.ntType === 'Join_Status') {
            joinStatNotif.push(data);
          } else if (data.ntType === 'Join') {
            joinNotif.push(data);
          } else if (data.ntType === 'Announcement') {
            announcement.push(data);
          }
        });

        const uniqueJoinStat = _.uniqBy(joinStatNotif, 'sbSubID');
        const uniqueJoin = _.uniqBy(joinNotif, 'sbSubID');
        let allNotifs = [
          ...gateAppNotif,
          ...uniqueJoinStat,
          ...uniqueJoin,
          ...announcement
        ];

        let unitNotification = [];
        let adminNotification = [];
        for(let i in resData){
          if(resData[i].ntType === "joinrequest" || resData[i].ntType === "Join"){
            adminNotification.push(resData[i])
          }else{
            unitNotification.push(resData[i])
          }
        }

        // const sorted = _.sortBy(allNotifs, [
        //   "ntdCreated",
        //   "ntdUpdated"
        // ]).reverse();

        console.log('allNotifs', allNotifs);
        const sorted = [...allNotifs];

                 allNotifs.map((data, index) => {
         if (data.ntType === 'gate_app') {
         axios
               .get(
                 `http://${oyeURL}/oyesafe/api/v1/VisitorLog/GetVisitorLogListByVisLogID/${data.sbMemID}`,
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
                 console.log('RESPONSE DATA IN REFRESH NOTIFICATIONS',responseData,allNotifs)
                 for (let i = 0; i < allNotifs.length; i++) {
                   if (
                     allNotifs[i].sbMemID === responseData.visitorLog.vlVisLgID
                   ) {
                     console.log(
                       '&&&&&&&&&&&&&&&&',
                       allNotifs[i].sbMemID,
                       responseData,
                       responseData.visitorLog.vlVisLgID
                     );
                     allNotifs[i].vlEntryImg =
                       responseData.visitorLog.vlEntryImg;
                     allNotifs[i].vlGtName = responseData.visitorLog.vlGtName;
                   allNotifs[i].vlfName = responseData.visitorLog.vlfName;
                    allNotifs[i].vlVisType = responseData.visitorLog.vlVisType;
                    allNotifs[i].vlComName = responseData.visitorLog.vlComName;
                    allNotifs[i].vlMobile = responseData.visitorLog.vlMobile;
                    allNotifs[i].vlEntryT = responseData.visitorLog.vlEntryT;
                    allNotifs[i].vldCreated =
                       responseData.visitorLog.vldCreated;
                    allNotifs[i].vlengName = responseData.visitorLog.vlengName;
                     allNotifs[i].vlexgName = responseData.visitorLog.vlexgName;
                     allNotifs[i].vldUpdated =responseData.visitorLog.vldUpdated; //date
                    allNotifs[i].vlExitT = responseData.visitorLog.vlExitT; //time
                    allNotifs[i].vlVisLgID = responseData.visitorLog.vlVisLgID;
                    allNotifs[i].unUnitID = responseData.visitorLog.unUnitID;
                    allNotifs[i].unUniName = responseData.visitorLog.unUniName;
                    allNotifs[i].vlApprStat = responseData.visitorLog.vlApprStat;
                    allNotifs[i].vlApprdBy = responseData.visitorLog.vlApprdBy;
                       allNotifs[i].vlSelfImg = responseData.visitorLog.vlSelfImg;

                   }
                 }
               })
               .catch(error => {
                 console.log(error, 'error while fetching networks');
               });
           }
           console.log('Props  notifications~~~~~', allNotifs);
         });
          console.log('NOTIFICATIONS_NOTIFICATIONS######', allNotifs);


          let firebaseNoti = [];
          var promises = sorted.map(function(data, index) {
          if (data.ntType !== 'gate_app') {
            firebaseNoti.push({ ...data });
            return firebaseNoti;
          } else {
            let dbRef = firebase
              .database()
              .ref(`NotificationSync/A_${data.asAssnID}/${data.sbMemID}`);

            return dbRef.once('value').then(snapshot => {
              let val = snapshot.val();
              firebaseNoti.push({ ...data, ...val });
              // return firebaseNoti;
              // console.log(snapshot.val(), 'value_firebase');
              // dispatch({
              //   type: GET_NOTIFICATIONS_SUCCESS,
              //   payload: [...firebaseNoti]
              // });
            });
          }
        });

        // Promise.all(promises).then(function(results) {
        //   dispatch({
        //     type: REFRESH_NOTIFICATION_SUCCESS,
        //     payload: [...firebaseNoti]
        //   });
        // });

        segregateUnitNotification(unitNotification);
        segregateAdminNotification(adminNotification);
        segregateDummyAdminNotification(adminNotification);
        segregateDummyUnitNotification(unitNotification);

        Promise.all(promises).then(function(results) {
          let succ = _.sortBy(allNotifs, ['ntdCreated']).reverse();
          dispatch({
            type: REFRESH_NOTIFICATION_SUCCESS,
            payload: [...succ]
          });
        });

        // sorted.map((data, index) => {
        //   if (data.ntType !== 'gate_app') {
        //     firebaseNoti.push({ ...data });
        //   } else {
        //     firebase
        //       .database()
        //       .ref(`NotificationSync/A_${data.asAssnID}/${data.sbMemID}`)
        //       .on('value', snapshot => {
        //         let val = snapshot.val();
        //         firebaseNoti.push({ ...data, ...val });
        //         // console.log(snapshot.val(), 'value_firebase');
        //         dispatch({
        //           type: REFRESH_NOTIFICATION_SUCCESS,
        //           payload: [...firebaseNoti]
        //         });
        //       });
        //   }
        // });
      })
      .catch(error => {
        console.log(error, 'error fetching notifications');
        dispatch({
          type: REFRESH_NOTIFICATION_FAILED
          // payload: []
        });
      });
  };
};

// export const refreshNotifications = (
//   oyeURL,
//   MyAccountID,
//   page,
//   notifications
// ) => {
//   return dispatch => {
//     let page = 1;
//     dispatch({
//       type: REFRESH_NOTIFICATION_START
//     });

//     fetch(
//       'http://' +
//         oyeURL +
//         '/oyesafe/api/v1/Notification/GetNotificationListByAccntID/' +
//         MyAccountID +
//         '/' +
//         page,
//       {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
//         }
//       }
//     )
//       .then(response => response.json())
//       .then(responseJson => {
//         let resData = responseJson.data.notificationListByAcctID;

//         let activeNotifications = [];

//         _.forEach(resData, function(value) {
//           activeNotifications.push({ ...value, read: false });
//         });

//         console.log(activeNotifications, 'activeNotifications');
//         // console.log("sorted", sorted);
//         let joinNotif = [];
//         let joinStatNotif = [];
//         let gateAppNotif = [];
//         let announcement = [];
//         activeNotifications.map((data, index) => {
//           if (data.ntType === 'gate_app') {
//             gateAppNotif.push({ open: true, ...data });
//           } else if (data.ntType === 'Join_Status') {
//             joinStatNotif.push(data);
//           } else if (data.ntType === 'Join') {
//             joinNotif.push(data);
//           } else if (data.ntType === 'Announcement') {
//             announcement.push(data);
//           }
//         });

//         const uniqueJoinStat = _.uniqBy(joinStatNotif, 'sbSubID');
//         const uniqueJoin = _.uniqBy(joinNotif, 'sbSubID');
//         // const uniqueJoinStat = [...joinStatNotif];
//         // const uniqueJoin = [...joinNotif];
//         let allNotifs = [
//           ...gateAppNotif,
//           ...uniqueJoinStat,
//           ...uniqueJoin,
//           ...announcement
//         ];

//         allNotifs.map((data, index) => {
//           if (data.ntType === 'gate_app') {
//             axios
//               .get(
//                 `http://${oyeURL}/oyesafe/api/v1/VisitorLog/GetVisitorLogListByVisLogID/${data.sbMemID}`,
//                 //data.sbMemID`,
//                 {
//                   headers: {
//                     'Content-Type': 'application/json',
//                     'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
//                   }
//                 }
//               )
//               .then(res => {
//                 let responseData = res.data.data;
//                 for (let i = 0; i < allNotifs.length; i++) {
//                   if (
//                     allNotifs[i].sbMemID === responseData.visitorLog.vlVisLgID
//                   ) {
//                     console.log(
//                       '&&&&&&&&&&&&&&&&',
//                       allNotifs[i].sbMemID,
//                       responseData,
//                       responseData.visitorLog.vlVisLgID
//                     );
//                     allNotifs[i].vlEntryImg =
//                       responseData.visitorLog.vlEntryImg;
//                     allNotifs[i].vlGtName = responseData.visitorLog.vlGtName;
//                     allNotifs[i].vlfName = responseData.visitorLog.vlfName;
//                     allNotifs[i].vlVisType = responseData.visitorLog.vlVisType;
//                     allNotifs[i].vlComName = responseData.visitorLog.vlComName;
//                     allNotifs[i].vlMobile = responseData.visitorLog.vlMobile;
//                     allNotifs[i].vlEntryT = responseData.visitorLog.vlEntryT;
//                     allNotifs[i].vldCreated =
//                       responseData.visitorLog.vldCreated;
//                     allNotifs[i].vlengName = responseData.visitorLog.vlengName;
//                     allNotifs[i].vlexgName = responseData.visitorLog.vlexgName;
//                     allNotifs[i].vldUpdated =
//                       responseData.visitorLog.vldUpdated; //date
//                     allNotifs[i].vlExitT = responseData.visitorLog.vlExitT; //time
//                   }
//                 }
//               })
//               .catch(error => {
//                 console.log(error, 'error while fetching networks');
//               });
//           }
//           console.log('Props  notifications~~~~~', allNotifs);
//         });

//         // const sorted = _.sortBy(allNotifs, ["ntdUpdated"]);
//         const sorted = _.sortBy(allNotifs, ['ntdCreated']).reverse();

//         let firebaseNoti = [];

//         sorted.map((data, index) => {
//           if (data.ntType !== 'gate_app') {
//             firebaseNoti.push({ ...data });
//           } else {
//             firebase
//               .database()
//               .ref(`NotificationSync/A_${data.asAssnID}/${data.sbMemID}`)
//               .on('value', snapshot => {
//                 let val = snapshot.val();
//                 firebaseNoti.push({ ...data, ...val });
//                 console.log(snapshot.val(), 'value_firebases');
//               });
//           }
//         });

//         dispatch({
//           type: REFRESH_NOTIFICATION_SUCCESS,
//           payload: [...firebaseNoti]
//         });
//       })
//       .catch(error => {
//         console.log(error);
//         dispatch({
//           type: REFRESH_NOTIFICATION_FAILED
//         });
//       });
//   };
// };

export const createUserNotification = (
  notifType,
  oyeURL,
  accountID,
  associationID,
  ntDesc,
  sbUnitID,
  sbMemID,
  sbSubID,
  sbRoleId,
  associationName,
  unitName,
  occupancyDate,
  soldDate,
  refresh,
  senderId,
  mobileNumber,
  announcement
) => {
  return dispatch => {
    let headers = {
      'Content-Type': 'application/json',
      'X-OYE247-APIKey': '7470AD35-D51C-42AC-BC21-F45685805BBE'
    };

    let formatdate = moment().format('YYYY-MMMM-ddd, hh:mm:ss');
    // let date = moment();
    // let formatdate = date._d;
    // alert(refresh);
    // console.log(notifType);
    if (notifType === 'Join') {
      console.log(
        {
          ACAccntID: accountID,
          ASAssnID: associationID,
          NTType: notifType,
          NTDesc: ntDesc,
          SBUnitID: sbUnitID,
          SBMemID: sbMemID,
          SBSubID: sbSubID,
          SBRoleID: sbRoleId,
          ASAsnName: associationName,
          MRRolName: unitName,
          NTDCreated: formatdate,
          NTDUpdated: formatdate,
          UNOcSDate: occupancyDate,
          UNSldDate: soldDate,
          ACNotifyID: senderId,
          NTMobile :mobileNumber
        },
        'join_request_body'
      );
      axios
        .post(
          `http://${oyeURL}/oyesafe/api/v1/Notification/Notificationcreate`,
          {
            ACAccntID: accountID,
            ASAssnID: associationID,
            NTType: notifType,
            NTDesc: ntDesc,
            SBUnitID: sbUnitID,
            SBMemID: sbMemID,
            SBSubID: sbSubID,
            SBRoleID: sbRoleId,
            ASAsnName: associationName,
            MRRolName: unitName,
            NTDCreated: formatdate,
            NTDUpdated: formatdate,
            UNOcSDate: occupancyDate,
            UNSldDate: soldDate,
            ACNotifyID: senderId
          },
          {
            headers: headers
          }
        )
        .then(res => {
          console.log('notification created succ', res.data.data);
        })
        .catch(error => {
          console.log('notification not created succ', error);
        });
    } else if (notifType === 'Join_Status') {
      console.log(
        notifType,
        oyeURL,
        accountID,
        associationID,
        ntDesc,
        sbUnitID,
        sbMemID,
        sbSubID,
        sbRoleId,
        associationName,
        unitName,
        occupancyDate,
        soldDate,
        refresh,
        senderId
      );
      axios
        .post(
          `http://${oyeURL}/oyesafe/api/v1/Notification/Notificationcreate`,
          {
            ACAccntID: accountID,
            ASAssnID: associationID,
            NTType: notifType,
            NTDesc: ntDesc,
            SBUnitID: sbUnitID,
            SBMemID: sbMemID,
            SBSubID: sbSubID,
            SBRoleID: sbRoleId,
            ASAsnName: associationName,
            MRRolName: unitName,
            NTDCreated: formatdate,
            NTDUpdated: formatdate,
            UNOcSDate: occupancyDate,
            UNSldDate: soldDate,
            ACNotifyID: senderId,
            NTMobile :mobileNumber
          },
          {
            headers: headers
          }
        )
        .then(res => {
          console.log('notification joinstatus succ', res.data.data);
          refreshNotifications(oyeURL, accountID);
          if (refresh) {
            dispatch({
              type: REFRESH_NOTIFICATION_START
            });
            fetch(
              'http://' +
                oyeURL +
                '/oyesafe/api/v1/Notification/GetNotificationListByAccntID/' +
                accountID,
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
                // console.log(responseJson.data.notificationListByAcctID);
                let resData = responseJson.data.notificationListByAcctID;
                let activeNotifications = [];
                _.forEach(resData, function(value) {
                  activeNotifications.push({
                    ...value,
                    read: false
                  });
                });
                // console.log("sorted", sorted);
                let joinNotif = [];
                let joinStatNotif = [];
                let gateAppNotif = [];
                activeNotifications.map((data, index) => {
                  if (data.ntType === 'gate_app') {
                    gateAppNotif.push({
                      open: true,
                      ...data
                    });
                  } else if (data.ntType === 'Join_Status') {
                    joinStatNotif.push(data);
                  } else if (data.ntType === 'Join') {
                    joinNotif.push(data);
                  }
                });
                const uniqueJoinStat = _.uniqBy(joinStatNotif, 'sbSubID');
                const uniqueJoin = _.uniqBy(joinNotif, 'sbSubID');
                let allNotifs = [
                  ...gateAppNotif,
                  ...uniqueJoinStat,
                  ...uniqueJoin
                ];
                const sorted = _.sortBy(allNotifs, [
                  'ntdCreated',
                  'ntdUpdated'
                ]).reverse();
                dispatch({
                  type: REFRESH_NOTIFICATION_SUCCESS,
                  payload: [...sorted]
                });
              })
              .catch(error => {
                console.log(error);
                dispatch({
                  type: REFRESH_NOTIFICATION_FAILED
                });
              });
          }
          // getNotifications(oyeURL, accountID);
        })
        .catch(error => {
          console.log('notification not joinstatus succ', error);
        });
    } else if (notifType === 'gate_app') {
      axios
        .post(
          `http://${oyeURL}/oyesafe/api/v1/Notification/Notificationcreate`,
          {
            ACAccntID: accountID,
            ASAssnID: associationID,
            NTType: notifType,
            NTDesc: ntDesc,
            SBUnitID: sbUnitID,
            SBMemID: sbMemID,
            SBSubID: sbSubID,
            SBRoleID: sbRoleId,
            ASAsnName: associationName,
            MRRolName: unitName,
            NTDCreated: formatdate,
            NTDUpdated: formatdate,
            UNOcSDate: occupancyDate,
            UNSldDate: soldDate,
            ACNotifyID: senderId
          },
          {
            headers: headers
          }
        )
        .then(res => {
          console.log('notification joinstatus succ', res.data.data);
          // getNotifications(oyeURL, accountID);
        })
        .catch(error => {
          console.log('notification not joinstatus succ', error);
        });
    } else if (notifType === 'Announcement') {
      console.log(
        {
          ACAccntID: accountID,
          ASAssnID: associationID,
          NTType: notifType,
          NTDesc: ntDesc,
          SBUnitID: sbUnitID,
          SBMemID: sbMemID,
          SBSubID: sbSubID,
          SBRoleID: sbRoleId,
          ASAsnName: associationName,
          MRRolName: unitName,
          NTDCreated: formatdate,
          NTDUpdated: formatdate,
          UNOcSDate: occupancyDate,
          UNSldDate: soldDate,
          ACNotifyID: announcement
        },
        'notification_create_announcment'
      );
      axios
        .post(
          `http://${oyeURL}/oyesafe/api/v1/Notification/Notificationcreate`,
          {
            ACAccntID: accountID,
            ASAssnID: associationID,
            NTType: notifType,
            NTDesc: ntDesc,
            SBUnitID: sbUnitID,
            SBMemID: sbMemID,
            SBSubID: sbSubID,
            SBRoleID: sbRoleId,
            ASAsnName: associationName,
            MRRolName: unitName,
            NTDCreated: formatdate,
            NTDUpdated: formatdate,
            UNOcSDate: occupancyDate,
            UNSldDate: soldDate,
            ACNotifyID: announcement
          },
          {
            headers: headers
          }
        )
        .then(res => {
          console.log('notification joinstatus succ', res.data.data);
          // getNotifications(oyeURL, accountID);
        })
        .catch(error => {
          console.log('notification not joinstatus succ', error);
        });
    }
  };
};

// export const toggleCollapsible = (prevData, value, index,item) => {
//   return dispatch => {
//     let newVal = prevData;
//     console.log("sfsfgs:",prevData, value, index,item)
//     for (let i in prevData){
//       if(item.ntid === prevData[i].ntid){
//         newVal[i].open = !value;
//       }
//       else{
//         newVal[i].open = true;
//       }
//     }
//     console.log("New Value:",...newVal,index,value);
//     dispatch({
//       type: TOGGLE_COLLAPSIBLE,
//       payload: [...newVal]
//     });
//   };
// };

export const toggleUnitCollapsible = (prevData, value, index,item) => {
  return dispatch => {
    let newVal = prevData;
    console.log("sfsfgs:",prevData, value, index,item)
    for (let i in prevData){
      if(item.ntid === prevData[i].ntid){
        newVal[i].open = !value;
      }
      else{
        newVal[i].open = true;
      }
    }
    console.log("New Value:",...newVal,index,value);
    dispatch({
      type: TOGGLE_UNIT_COLLAPSIBLE,
      payload: [...newVal]
    });
  };
};

export const toggleAdminCollapsible = (prevData, value, index,item) => {
  return dispatch => {
    let newVal = prevData;
    console.log("sfsfgs:",prevData, value, index,item)
    for (let i in prevData){
      if(item.ntid === prevData[i].ntid){
        newVal[i].open = !value;
      }
      else{
        newVal[i].open = true;
      }
    }
    console.log("New Value:",...newVal,index,value);
    dispatch({
      type: TOGGLE_ADMIN_COLLAPSIBLE,
      payload: [...newVal]
    });
  };
};


export const toggleAllCollapsible = (prevData) => {
  console.log("prev data to be closed:",prevData);
  return dispatch => {
    let newVal = prevData;
    for (let i in prevData){
      prevData[i].open = true
    }
  
  dispatch({
    type:TOGGLE_COLLAPSIBLE,
    payload:[...newVal]
  })
}
}

export const onEndReached = (
  oyeURL,
  prevPage,
  prevNotifications,
  MyAccountID
) => {
  return dispatch => {
    dispatch({
      type: ON_END_START
    });
    console.log(prevPage, 'prevPage');
    let page = prevPage + 1;

    fetch(
      'http://' +
        oyeURL +
        '/oyesafe/api/v1/Notification/GetNotificationListByAccntID/' +
        MyAccountID +
        '/' +
        page,
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
        console.log(responseJson, page, 'redddd');
        let resData = responseJson.data.notificationListByAcctID;

        let activeNotifications = [];

        _.forEach(resData, function(value) {
          activeNotifications.push({ ...value, read: false });
        });

        // console.log("sorted", sorted);
        let joinNotif = [];
        let joinStatNotif = [];
        let gateAppNotif = [];

        activeNotifications.map((data, index) => {
          if (data.ntType === 'gate_app') {
            gateAppNotif.push({ open: true, ...data });
          } else if (data.ntType === 'Join_Status') {
            joinStatNotif.push(data);
          } else if (data.ntType === 'Join') {
            joinNotif.push(data);
          }
        });

        const uniqueJoinStat = _.uniqBy(joinStatNotif, 'sbSubID');
        const uniqueJoin = _.uniqBy(joinNotif, 'sbSubID');
        let allNotifs = [...gateAppNotif, ...uniqueJoinStat, ...uniqueJoin];

        // const sorted = _.sortBy(allNotifs, [
        //   "ntdCreated",
        //   "ntdUpdated"
        // ]).reverse();

        let newNotifications = [...prevNotifications, ...allNotifs];

        const sorted = _.sortBy(newNotifications, ['ntdCreated']).reverse();

        dispatch({
          type: ON_END_SUCCESS,
          payload: sorted,
          page
        });
      })
      .catch(error => {
        console.log(error, 'on end');
        // dispatch({
        //   type: GET_NOTIFICATIONS_FAILED,
        //   payload: []
        // });
      });
  };
};

export const onGateApp = notifications => {
  return dispatch => {
    dispatch({
      type: ON_GATE_OPEN,
      payload: notifications
    });
  };
};

export const toggleCollapsible = (prevData, value, index) => {
  console.log('GETTHEDATAOFNOTFICATION',prevData,value,index)
  return dispatch => {
    let newVal = prevData;
    newVal[index].open = !value;
    dispatch({
      type: TOGGLE_COLLAPSIBLE,
      payload: [...newVal]
    });
  };
};
