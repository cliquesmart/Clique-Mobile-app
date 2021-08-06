import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Block, ImageComponent, Text} from '../components';
import {hp, wp} from '../components/responsive';
import {light} from '../components/theme/colors';
import NeuView from './neu-element/lib/NeuView';

const HeaderSettings = ({title, rightTitle}) => {
  const {goBack} = useNavigation();
  return (
    <Block center padding={[hp(2), wp(3)]} space="between" flex={false} row>
      <TouchableOpacity onPress={() => goBack()}>
        <NeuView
          concave
          color="#eef2f9"
          width={40}
          height={40}
          borderRadius={20}
          customGradient={['#FAF8F8', '#DCC8FA']}>
          <ImageComponent
            resizeMode="contain"
            height={14}
            width={14}
            name={'BackIcon'}
            color={light.purple}
          />
        </NeuView>
      </TouchableOpacity>
      <Text purple semibold size={20}>
        {title}
      </Text>
      <Text white semibold size={20}>
        {rightTitle || '      '}
      </Text>
    </Block>
  );
};
export default HeaderSettings;
