import { createStore, compose, applyMiddleware } from 'redux';
import { AsyncStorage } from 'react-native';
import { persistReducer, persistStore } from 'redux-persist';
import reducers from '../reducers';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
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