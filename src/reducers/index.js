import { combineReducers } from 'redux';
import NotificationReducer from './NotificationReducer';
import AppReducer from './AppReducer';
import DashboardReducer from './DashboardReducer';
import UserReducer from './UserReducer';

export default combineReducers({
	NotificationReducer: NotificationReducer,
	AppReducer: AppReducer,
	DashboardReducer: DashboardReducer,
	UserReducer: UserReducer
})