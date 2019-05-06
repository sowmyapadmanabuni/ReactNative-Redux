import { 
	NEW_NOTIF_INSTANCE, 
	CREATE_NEW_NOTIFICATION, 
	CREATE_NEW_NOTIFICATION_SUCCESS, 
	CREATE_NEW_NOTIFICATION_FAILED,
	GET_NOTIFICATIONS,
	GET_NOTIFICATIONS_FAILED,
	GET_NOTIFICATIONS_SUCCESS,
	ON_NOTIFICATION_OPEN,
} from "../actions/types";

const INITIAL_STATE = {
	notifications: [

	],
	isCreateLoading: true,
	loading: true,
	refreshing: false,
	newNotifInstance: null,
	count: null
}

export default (state = INITIAL_STATE,  action) => {
	switch(action.type) {
		case NEW_NOTIF_INSTANCE:
			return { ...state, newNotifInstance: action.payload };

		case CREATE_NEW_NOTIFICATION:
			return { ...state, isCreateLoading: true };

		case CREATE_NEW_NOTIFICATION_SUCCESS:
			return { ...state, isCreateLoading: false };

		case CREATE_NEW_NOTIFICATION_FAILED:
			return { ...state, isCreateLoading: false };

		case GET_NOTIFICATIONS:
			return { ...state, loading: true }

		case GET_NOTIFICATIONS_FAILED:
			return { ...state, loading: false }

		case GET_NOTIFICATIONS_SUCCESS:
			return { ...state, loading: false, notifications: action.payload }

		case ON_NOTIFICATION_OPEN:
			return { ...state, notifications: action.payload }
			
		default:
			return state;
	}
}