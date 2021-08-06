import {persistStore, persistReducer} from 'redux-persist';
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';

const composeEnhancers = composeWithDevTools({
  // Specify here name, actionsBlacklist, actionsCreators and other options
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware();
let store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware, logger)),
);
let persistor = persistStore(store);

export {store, persistor, sagaMiddleware};
