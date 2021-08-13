/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {AppState, Linking, StatusBar} from 'react-native';

import FlashMessage from 'react-native-flash-message';
import Navigation from './SourceFiles/Constants/Navigation';
import * as NavigationService from './SourceFiles/Constants/NavigationService';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {ConstantKeys} from './SourceFiles/Constants/ConstantKey';
import {PersistGate} from 'redux-persist/integration/react';
import {sagaMiddleware, store, persistor} from './SourceFiles/redux/store';
import rootSaga from './SourceFiles/redux/saga';
import {Provider} from 'react-redux';
import FcmService from './SourceFiles/utils/noti-services';

sagaMiddleware.run(rootSaga);

var UserCardID = '';

const slides = [
  {
    key: 1,
    title: 'Take Your\nClique Card',
    text: 'The first thing you will need\nis your Clique card.',
    image: require('./SourceFiles/Assets/Images/InitialFlowIcons/ic_intro1.png'),
  },
  {
    key: 2,
    title: 'Put it Behind\nYour Phone',
    text: 'Scan your card with your\nphone to activate it',
    image: require('./SourceFiles/Assets/Images/InitialFlowIcons/ic_intro2.png'),
  },
  {
    key: 3,
    title: 'Put it Behind\nYour Phone',
    text: 'Scan your card with your\nphone to activate it',
    image: require('./SourceFiles/Assets/Images/InitialFlowIcons/ic_intro3.png'),
  },
  {
    key: 4,
    title: 'Create Your\nProfile',
    text: 'Fill up all your information add\nsync your social media profile',
    image: require('./SourceFiles/Assets/Images/InitialFlowIcons/ic_intro4.png'),
  },
  {
    key: 5,
    title: 'Connect With\nYour Friends',
    text: 'Youre ready to connect with your\nfriends and meet new people',
    image: require('./SourceFiles/Assets/Images/InitialFlowIcons/ic_intro5.png'),
  },
];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      userData: {},
      user: {},
      appState: AppState.currentState,
    };
  }

  callProfile = async () => {
    try {
      const value = await AsyncStorage.getItem('user_id');
      if (value !== null) {
        // value previously stored
        NavigationService.navigate('Dashboard');
      } else {
        console.log('User Data: null ' + value);
      }
    } catch (e) {
      console.log('Error : ' + e);
    }
  };

  async componentDidMount() {
    this.callProfile();
    await this.getData();
    AppState.addEventListener('change', this._handleAppStateChange);
    Linking.addEventListener('url', this.handleDeepLink);

    // This is call when app is in kill state & open from Deeplik URL
    const url = await Linking.getInitialURL();
    console.log(' get Initial URL : ' + JSON.stringify(url));

    if (url != null) {
      setTimeout(() => {
        var url1 = url;

        console.log('URL 1 = ' + url1);
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
          params = {},
          match;
        while ((match = regex.exec(url1))) {
          params[match[1]] = match[2];
        }
        console.log('URL PARAM ID : ' + params.userid);

        UserCardID = params.userid;
        console.log('User ID in APP js : ' + this.state.user.user_id);

        if (UserCardID === this.state.user.user_id) {
          NavigationService.navigate('Profile');
        } else {
          NavigationService.navigate('UserProfile', {profile_id: UserCardID});
        }
        // NavigationService.navigate('UserProfile', { profile_id: UserCardID })
      }, 3500);
    }
  }

  componentWillUnmount() {
    // [...]
    UserCardID = '';
    AppState.removeEventListener('change', this._handleAppStateChange);
    Linking.removeEventListener('url', this.handleDeepLink);
  }

  _handleAppStateChange = (nextAppState) => {
    console.log('App State : ' + nextAppState);

    console.log(' Current App State : ' + this.state.appState);

    if (nextAppState === 'active') {
      console.log('App has come to the foreground!' + UserCardID);

      if (UserCardID != '') {
        setTimeout(() => {
          console.log(
            'Timout Call : user ID : ' + JSON.stringify(this.state.user),
          );

          if (UserCardID == this.state.user.user_id) {
            NavigationService.navigate('Profile');
          } else {
            NavigationService.navigate('UserProfile', {profile_id: UserCardID});
          }

          UserCardID = '';
        }, 1000);
      }
    } else {
      console.log('App State not active call: ' + nextAppState);
    }
    this.setState({appState: nextAppState});
  };

  handleDeepLink(e) {
    console.log(' Initial URL is : ' + JSON.stringify(e.url));
    // alert(e.url)

    if (e != null) {
      const route = e.url.replace(/.*?:\/\//g, '');
      // use route to navigate
      // ...
      console.log(' Route is : ' + route);

      var url1 = e.url;

      console.log('URL 1 = ' + url1);
      var regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;
      while ((match = regex.exec(url1))) {
        params[match[1]] = match[2];
      }
      console.log('URL PARAM ID : ' + params.userid);

      UserCardID = params.userid;

      // if(this.state.appState.match(/inactive|background/)){
      //   console.log('App is in background or Inactive : '+this.state.appState)
      // }else{
      //   NavigationService.navigate('UserProfile', { profile_id: params.userid })
      // }
    }
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem(ConstantKeys.USERDATA);
      if (value !== null) {
        // value previously stored
        console.log('User Data APP JS : ' + value);
        var userData = JSON.parse(value);
        var user = userData.user;

        this.setState({userData: userData, user: user});
      } else {
        console.log('User Data: null ' + value);
      }
    } catch (e) {
      console.log('Error : ' + e);
    }
  };

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
