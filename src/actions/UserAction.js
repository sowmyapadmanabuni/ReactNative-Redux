import { UPDATE_USER_INFO } from "./types";

export const updateUserInfo = ({ prop, value }) => {
  return dispatch => {
    dispatch({
      type: UPDATE_USER_INFO,
      payload: { prop, value }
    });
  };
};
