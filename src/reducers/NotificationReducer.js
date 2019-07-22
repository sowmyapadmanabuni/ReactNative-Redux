import {
  NEW_NOTIF_INSTANCE,
  CREATE_NEW_NOTIFICATION,
  CREATE_NEW_NOTIFICATION_SUCCESS,
  CREATE_NEW_NOTIFICATION_FAILED,
  GET_NOTIFICATIONS,
  GET_NOTIFICATIONS_FAILED,
  GET_NOTIFICATIONS_SUCCESS,
  ON_NOTIFICATION_OPEN,
  TOGGLE_ADMIN_NOTIFICATION,
  REFRESH_NOTIFICATION_START,
  REFRESH_NOTIFICATION_FAILED,
  REFRESH_NOTIFICATION_SUCCESS,
  TOGGLE_COLLAPSIBLE
} from "../actions/types";

const INITIAL_STATE = {
  notifications: [],
  isCreateLoading: true,
  loading: true,
  refreshing: false,
  newNotifInstance: null,
  count: null,
  receiveNotifications: true,
  refresh: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NEW_NOTIF_INSTANCE:
      return { ...state, newNotifInstance: action.payload };

    case CREATE_NEW_NOTIFICATION:
      return { ...state, isCreateLoading: true };

    case CREATE_NEW_NOTIFICATION_SUCCESS:
      return { ...state, isCreateLoading: false };

    case CREATE_NEW_NOTIFICATION_FAILED:
      return { ...state, isCreateLoading: false };

    case GET_NOTIFICATIONS:
      return { ...state, loading: true };

    case GET_NOTIFICATIONS_FAILED:
      return { ...state, loading: false, notifications: action.payload };

    case GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
        refresh: false
      };

    case ON_NOTIFICATION_OPEN:
      return { ...state, notifications: action.payload };

    case TOGGLE_ADMIN_NOTIFICATION:
      return { ...state, receiveNotifications: action.payload };

    case REFRESH_NOTIFICATION_START:
      return { ...state, refresh: true };

    case REFRESH_NOTIFICATION_SUCCESS:
      return { ...state, refresh: false, notifications: action.payload };

    case REFRESH_NOTIFICATION_FAILED:
      return { ...state, refresh: false };

    case TOGGLE_COLLAPSIBLE:
      return { ...state, notifications: action.payload };

    default:
      return state;
  }
};
