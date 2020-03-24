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
  TOGGLE_ADMIN_COLLAPSIBLE,
  UPDATE_NOTIFICATION_POP_UP,
  ON_UNIT_NOTIFICATION_OPEN,
  ON_ADMIN_NOTIFICATION_OPEN
} from '../actions/types';

const INITIAL_STATE = {
  notifications: [],
  isCreateLoading: true,
  loading: true,
  refreshing: false,
  newNotifInstance: null,
  count: null,
  receiveNotifications: true,
  refresh: false,
  page: 1,
  footerLoading: false,
  unitNotification:[],
  adminNotification:[],
  unitDummyNotification:[],
  adminDummyNotification:[],
  popUpNotification:[]
};

export default (state = INITIAL_STATE, action) => {
  console.log("Notification in reducer:",action)
  switch (action.type) {
    case SEGREGATE_UNIT_NOTIFICATION:
      return {...state,unitNotification:action.payload,loading:false}
      
    case SEGREGATE_ADMIN_NOTIFICATION:
      return {...state,adminNotification:action.payload,loading:false}

      case SEGREGATE_DUMMY_UNIT_NOTIFICATION:
      return {...state,unitDummyNotification:action.payload,loading:false}
      
    case SEGREGATE_DUMMY_ADMIN_NOTIFICATION:
      return {...state,adminDummyNotification:action.payload,loading:false}

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
      return { ...state, loading:false, notifications: action.payload };

    case GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
        refresh: false
      };

    case ON_NOTIFICATION_OPEN:
      return { ...state, notifications: action.payload };
      case ON_UNIT_NOTIFICATION_OPEN:
        return {...state,unitNotification:action.payload}

        case ON_ADMIN_NOTIFICATION_OPEN:
          return {...state,adminNotification:action.payload}

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

      case TOGGLE_UNIT_COLLAPSIBLE:
        return {...state,unitNotification:action.payload}

        case TOGGLE_ADMIN_COLLAPSIBLE:
          return {...state,adminNotification:action.payload}

    case ON_END_START:
      return { ...state, footerLoading: true };

    case ON_END_SUCCESS:
      return {
        ...state,
        notifications: action.payload,
        page: action.page,
        footerLoading: false
      };

    case ON_GATE_OPEN:
      return { ...state, notifications: action.payload };

      case UPDATE_NOTIFICATION_POP_UP:
        return{...state,popUpNotification:action.payload};

    default:
      return state;
  }
};
