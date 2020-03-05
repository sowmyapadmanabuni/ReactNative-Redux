import {applyMiddleware, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import reducers from '../reducers';
import logger from 'redux-logger';
import thunk from 'redux-thunk';


const persistConfig = {
    key: 'root',
    storage: FilesystemStorage,
    whitelist: ['AppReducer', 'UserReducer','DashboardReducer']
    //blacklist: ['DashboardReducer']
};

//const newReducer = combineReducers(reducers,appReducer);

const persistReducers = persistReducer(persistConfig, reducers);

const store = createStore(
    persistReducers, {}, applyMiddleware(thunk)
);

persistStore(store);

export default store;
