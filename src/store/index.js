import { createStore, compose, applyMiddleware } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage'
import reducers from '../reducers';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

const persistConfig = {
	key: 'root',
	storage: FilesystemStorage,
	whitelist: ['NotificationReducer', 'AppReducer', 'UserReducer'],
	//blacklist: ['DashboardReducer']
};

const persistReducers = persistReducer(persistConfig, reducers);

const store = createStore(
	persistReducers,
	{},
	compose(
		applyMiddleware(thunk, logger),
	)
);

persistStore(store)
// alert(JSON.stringify(persistor))

export default store;