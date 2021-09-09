/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/core';
import React, {useEffect} from 'react';
import {ImageBackground} from 'react-native';
import {Block, ImageComponent} from '../../components';
import {hp, wp} from '../../components/responsive';
const Splash = () => {
  const {navigate} = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigate('Tutorial');
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
