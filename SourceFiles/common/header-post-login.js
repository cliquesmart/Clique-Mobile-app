import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Block, ImageComponent, Text} from '../components';
import {hp, wp} from '../components/responsive';
import NeuView from './neu-element/lib/NeuView';

const HeaderPostLogin = ({title, rightTitle}) => {
  const {goBack} = useNavigation();
  return (
    <Block center padding={[hp(2), wp(3)]} space="between" flex={false} row>
      <TouchableOpacity onPress={() => goBack()}>
        <NeuView
          concave
          color={'#775DF2'}
          width={40}
          height={40}
          borderRadius={20}
          customGradient={['#775DF2', '#5A28AE']}>
          <ImageComponent
            resizeMode="contain"
            height={14}
            width={14}
            name={'BackIcon'}
          />
        </NeuView>
      </TouchableOpacity>

      <Text white semibold size={18}>
        {title}
      </Text>
      <Text white semibold size={18}>
        {rightTitle || '      '}
      </Text>
    </Block>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  linear: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});
export default HeaderPostLogin;
