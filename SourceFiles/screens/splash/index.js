/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation, CommonActions} from '@react-navigation/core';
import React, {useEffect} from 'react';
import {ImageBackground} from 'react-native';
import {Block, ImageComponent} from '../../components';
import {hp, wp} from '../../components/responsive';
const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.dispatch({
        ...CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Login',
            },
          ],
        }),
      });
    }, 3800);
  }, []);
  return (
    <Block>
      <ImageBackground
        source={require('../../Assets/Images/icons/splash.gif')}
        style={{flex: 1}}
      />
    </Block>
  );
};

export default Splash;
