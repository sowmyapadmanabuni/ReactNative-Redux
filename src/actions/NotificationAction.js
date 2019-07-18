import axios from "axios";
import moment from "moment";
import {
  GET_NOTIFICATIONS,
  NEW_NOTIF_INSTANCE,
  CREATE_NEW_NOTIFICATION,
  CREATE_NEW_NOTIFICATION_SUCCESS,
  CREATE_NEW_NOTIFICATION_FAILED,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAILED,
  ON_NOTIFICATION_OPEN,
  TOGGLE_ADMIN_NOTIFICATION,
  REFRESH_NOTIFICATION_START,
  REFRESH_NOTIFICATION_SUCCESS,
  REFRESH_NOTIFICATION_FAILED,
  TOGGLE_COLLAPSIBLE
} from "./types";
import _ from "lodash";

export const getNotifications = (oyeURL, MyAccountID) => {
  return dispatch => {
    dispatch({ type: GET_NOTIFICATIONS });
    fetch(
      "http://" +
        oyeURL +
        "/oyesafe/api/v1/Notification/GetNotificationListByAccntID/" +
        MyAccountID,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
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
          if (data.ntType === "gate_app") {
            gateAppNotif.push({ open: true, ...data });
          } else if (data.ntType === "Join_Status") {
            joinStatNotif.push(data);
          } else if (data.ntType === "Join") {
            joinNotif.push(data);
          }
        });

        const uniqueJoinStat = _.uniqBy(joinStatNotif, "sbSubID");
        const uniqueJoin = _.uniqBy(joinNotif, "sbSubID");
        let allNotifs = [...gateAppNotif, ...uniqueJoinStat, ...uniqueJoin];

        const sorted = _.sortBy(allNotifs, [
          "ntdCreated",
          "ntdUpdated"
        ]).reverse();

        sorted.map(data => {
          console.log(data.ntIsActive);
        });

        dispatch({
          type: GET_NOTIFICATIONS_SUCCESS,
          payload: sorted
        });
      })
      .catch(error => {
        // console.log(error);
        dispatch({
          type: GET_NOTIFICATIONS_FAILED,
          payload: ""
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
      "Content-Type": "application/json",
      "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
    };

    let date = moment();
    let formatdate = date._d;
    console.log(oyeURL);
    console.log(data);
    console.log(navigation);

    if (admin === "true") {
      console.log({
        ACAccntID: MyAccountID,
        ASAssnID: data.associationID,
        NTType: data.ntType,
        NTDesc: data.ntDesc,
        SBUnitID: "resident_user",
        SBMemID: "resident_user",
        SBSubID: data.sbSubID,
        SBRoleID: "resident_user",
        ASAsnName: "resident_user",
        MRRolName: "resident_user",
        NTDCreated: formatdate,
        NTDUpdated: formatdate,
        UNOcSDate: "resident_user",
        UNSldDate: "resident_user"
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
              "http://" +
                oyeURL +
                "/oyesafe/api/v1/Notification/GetNotificationListByAccntID/" +
                MyAccountID,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
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
                  "ntdCreated",
                  "ntdUpdated"
                ]).reverse();
                const unique = _.uniqBy(sorted, "sbSubID");

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
                  payload: ""
                });
              });

            navigation.navigate("NotificationScreen", {
              refresh: true
            });
          }
          // dispatch({ type})
        })
        .catch(error => {
          console.log(error.message);
          dispatch({ type: CREATE_NEW_NOTIFICATION_FAILED });
        });
    } else if (admin === "false") {
      // console.log(data)
      axios
        .post(
          `http://${oyeURL}/oyesafe/api/v1/Notification/Notificationcreate`,
          {
            ACAccntID: MyAccountID,
            ASAssnID: data.associationID,
            NTType: data.ntType,
            NTDesc: data.ntDesc,
            SBUnitID: "resident_user",
            SBMemID: "resident_user",
            SBSubID: data.sbSubID,
            SBRoleID: "resident_user",
            ASAsnName: "resident_user",
            MRRolName: "resident_user",
            NTDCreated: formatdate,
            NTDUpdated: formatdate,
            UNOcSDate: "resident_user",
            UNSldDate: "resident_user"
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
              "http://" +
                oyeURL +
                "/oyesafe/api/v1/Notification/GetNotificationListByAccntID/" +
                MyAccountID,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
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
                  "ntdCreated",
                  "ntdUpdated"
                ]).reverse();
                const unique = _.uniqBy(sorted, "sbSubID");

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
                  payload: ""
                });
              });

            navigation.navigate("NotificationScreen", {
              refresh: true
            });
          }
        })
        .catch(error => {
          console.log(error.message);
          dispatch({ type: CREATE_NEW_NOTIFICATION_FAILED });
        });
    } else if (admin === "gate_app") {
      axios
        .post(
          `http://${oyeURL}/oyesafe/api/v1/Notification/Notificationcreate`,
          {
            ACAccntID: MyAccountID,
            ASAssnID: data.associationID,
            NTType: data.ntType,
            NTDesc: data.ntDesc,
            SBUnitID: "gate_app",
            SBMemID: "gate_app",
            SBSubID: data.sbSubID,
            SBRoleID: "gate_app",
            ASAsnName: "gate_app",
            MRRolName: "gate_app",
            NTDCreated: formatdate,
            NTDUpdated: formatdate,
            UNOcSDate: "gate_app",
            UNSldDate: "gate_app"
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
              "http://" +
                oyeURL +
                "/oyesafe/api/v1/Notification/GetNotificationListByAccntID/" +
                MyAccountID,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
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
                  "ntdCreated",
                  "ntdUpdated"
                ]).reverse();
                const unique = _.uniqBy(sorted, "sbSubID");

                console.log(sorted);
                console.log(unique);

                dispatch({
                  type: GET_NOTIFICATIONS_SUCCESS,
                  payload: unique
                });
              })
              .catch(error => {
                console.log("error", error);
                dispatch({
                  type: GET_NOTIFICATIONS_FAILED,
                  payload: ""
                });
              });

            navigation.navigate("NotificationScreen", {
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

export const onNotificationOpen = (notif, index, oyeURL) => {
  console.log(index);
  return dispatch => {
    newNotif = Object.assign([], notif);
    newNotif[index].read = true;
    newNotif[index].read = true;
    newNotif[index].ntIsActive = false;
    newNotif[index].ntIsActive = false;

    let headers = {
      "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE",
      "Content-Type": "application/json"
    };

    console.log(newNotif[index]);

    axios
      .get(
        `http://${oyeURL}/oyesafe/api/v1/NotificationActiveStatusUpdate/${
          newNotif[index].ntid
        }`,
        {
          headers: headers
        }
      )
      .then(res => {
        console.log(res.data);
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

export const refreshNotifications = (oyeURL, MyAccountID) => {
  return dispatch => {
    dispatch({
      type: REFRESH_NOTIFICATION_START
    });

    fetch(
      "http://" +
        oyeURL +
        "/oyesafe/api/v1/Notification/GetNotificationListByAccntID/" +
        MyAccountID,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson.data.notificationListByAcctID);
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
          if (data.ntType === "gate_app") {
            gateAppNotif.push({ open: true, ...data });
          } else if (data.ntType === "Join_Status") {
            joinStatNotif.push(data);
          } else if (data.ntType === "Join") {
            joinNotif.push(data);
          }
        });

        const uniqueJoinStat = _.uniqBy(joinStatNotif, "sbSubID");
        const uniqueJoin = _.uniqBy(joinNotif, "sbSubID");
        let allNotifs = [...gateAppNotif, ...uniqueJoinStat, ...uniqueJoin];

        const sorted = _.sortBy(allNotifs, [
          "ntdCreated",
          "ntdUpdated"
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
  };
};

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
  refresh
) => {
  return dispatch => {
    let headers = {
      "Content-Type": "application/json",
      "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
    };

    let formatdate = moment().format("YYYY-MMMM-ddd, hh:mm:ss");
    // let date = moment();
    // let formatdate = date._d;
    // alert(refresh);
    // console.log(notifType);
    if (notifType === "Join") {
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
            UNSldDate: soldDate
          },
          {
            headers: headers
          }
        )
        .then(res => {
          console.log("notification created succ", res.data.data);
        })
        .catch(error => {
          console.log("notification not created succ", error);
        });
    } else if (notifType === "Join_Status") {
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
            UNSldDate: soldDate
          },
          {
            headers: headers
          }
        )
        .then(res => {
          // console.log("notification joinstatus succ", res.data.data);
          refreshNotifications(oyeURL, accountID);
          if (refresh) {
            dispatch({
              type: REFRESH_NOTIFICATION_START
            });
            fetch(
              "http://" +
                oyeURL +
                "/oyesafe/api/v1/Notification/GetNotificationListByAccntID/" +
                accountID,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "X-OYE247-APIKey": "7470AD35-D51C-42AC-BC21-F45685805BBE"
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
                  if (data.ntType === "gate_app") {
                    gateAppNotif.push({
                      open: true,
                      ...data
                    });
                  } else if (data.ntType === "Join_Status") {
                    joinStatNotif.push(data);
                  } else if (data.ntType === "Join") {
                    joinNotif.push(data);
                  }
                });
                const uniqueJoinStat = _.uniqBy(joinStatNotif, "sbSubID");
                const uniqueJoin = _.uniqBy(joinNotif, "sbSubID");
                let allNotifs = [
                  ...gateAppNotif,
                  ...uniqueJoinStat,
                  ...uniqueJoin
                ];
                const sorted = _.sortBy(allNotifs, [
                  "ntdCreated",
                  "ntdUpdated"
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
          console.log("notification not joinstatus succ", error);
        });
    } else if (notifType === "gate_app") {
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
            UNSldDate: soldDate
          },
          {
            headers: headers
          }
        )
        .then(res => {
          console.log("notification joinstatus succ", res.data.data);
          // getNotifications(oyeURL, accountID);
        })
        .catch(error => {
          console.log("notification not joinstatus succ", error);
        });
    }
  };
};

export const toggleCollapsible = (prevData, value, index) => {
  return dispatch => {
    let newVal = prevData;
    newVal[index].open = !value;
    dispatch({
      type: TOGGLE_COLLAPSIBLE,
      payload: [...newVal]
    });
  };
};
