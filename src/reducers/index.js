import { combineReducers } from 'redux';
import NotificationReducer from './NotificationReducer';
import AppReducer from './AppReducer';

export default combineReducers({
	NotificationReducer: NotificationReducer,
	AppReducer: AppReducer
})