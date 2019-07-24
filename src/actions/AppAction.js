import {
  JOIN_ASSOCIATION,
  APPROVE_ADMIN,
  UPDATE_SAVED_NOTIFICATION
} from "./types";

export const updateApproveAdmin = (prevAdmin, newAdmin) => {
  return dispatch => {
    let updatedList = prevAdmin;
    updatedList.push(newAdmin);

    dispatch({
      type: APPROVE_ADMIN,
      payload: updatedList
    });
  };
};

export const storeOpenedNotif = (prevSaved, newNotf) => {
  return dispatch => {
    let updatedList = prevSaved;
    updatedList.push(newNotf);

    dispatch({
      type: UPDATE_SAVED_NOTIFICATION,
      payload: updatedList
    });
  };
};
