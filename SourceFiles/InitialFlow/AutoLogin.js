import React, {Component} from 'react';
import {View, Text, LogBox, Image, Dimensions} from 'react-native';

//Constants
import {ConstantKeys} from '../Constants/ConstantKey';
import {IMG} from '../Constants/ImageConstant';
import {CommonColors} from '../Constants/ColorConstant';

//Third Party
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

export default class AutoLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  performTimeConsumingTask = async () => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve('result');
      }, 2500),
    );
  };

  async componentDidMount() {
    LogBox.ignoreAllLogs = true;
    const data = await this.performTimeConsumingTask();
    if (data !== null) {
      this.getIsTutorial();
    }
  }

  getIsTutorial = async () => {
    try {
      const value = await AsyncStorage.getItem(ConstantKeys.IS_SKIP_TUTORIAL);
      if (value !== null) {
        // value previously stored
        console.log('Is Skip Tutorial Data: ' + value);

        this.getData();
      } else {
        console.log('Is Skip Tutorial Data: null ' + value);

        const props = this.props;
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Tutorial'}],
          }),
        );
      }
    } catch (e) {
      // error reading value
      // this.props.navigation.replace('Login')
      console.log('Error : ' + e);
    }
  };

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem(ConstantKeys.USERDATA);
      if (value !== null) {
        // value previously stored
        console.log('User Data: ' + value);
        var userData = JSON.parse(value);

        var social = userData.user.social_data;

        console.log(' Social Data in Auto Login : ' + social);

        if (social == undefined || social.length == 0) {
          this.props.navigation.navigate('RegisterEmail', {
            is_from_autoLogin: true,
          });
        } else {
          const props = this.props;
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Dashboard'}],
            }),
          );
        }
      } else {
        console.log('User Data: null ' + value);

        const props = this.props;
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
      }
    } catch (e) {
      // error reading value
      const props = this.props;
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
      console.log('Error : ' + e);
    }
  };

  render() {
    let logoBannerImg = IMG.InitialFlow.Clique;
    let Background = IMG.OtherFlow.Background;

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: CommonColors.primaryColor,
        }}>
        <FastImage
          source={Background}
          resizeMode={FastImage.resizeMode.cover}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }}
        />

        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={logoBannerImg}
            style={{width: '70%', height: 150, resizeMode: 'contain'}}
          />
        </View>
      </View>
    );
  }
}
