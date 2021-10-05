/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {StatusBar} from 'react-native';

import FlashMessage from 'react-native-flash-message';
import Navigation from './SourceFiles/Constants/Navigation';
import {PersistGate} from 'redux-persist/integration/react';
import {sagaMiddleware, store, persistor} from './SourceFiles/redux/store';
import rootSaga from './SourceFiles/redux/saga';
import {Provider} from 'react-redux';

sagaMiddleware.run(rootSaga);

export default class App extends Component {
  render() {
    return (
      <>
        <Provider store={store}>
          <StatusBar barStyle="light-content" />
          <PersistGate loading={null} persistor={persistor}>
            <Navigation />
          </PersistGate>
        </Provider>
        <FlashMessage position="top" />
      </>
    );
  }
}
