import { createStore, compose, applyMiddleware } from 'redux';
import { AsyncStorage } from 'react-native';
import { persistReducer, persistStore } from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage'
import reducers from '../reducers';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

// console.log(reducers)
const persistConfig = {
	// timeout: 0,
	key: 'root',
	storage: FilesystemStorage, 
	whitelist: ['NotificationReducer'],
};

const persistReducers = persistReducer(persistConfig, reducers);

const store = createStore(
	persistReducers,
	{},
	compose(
		applyMiddleware(thunk, logger),
	)
);

persistStore(store);

export default store;