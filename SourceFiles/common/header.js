import React from 'react';
import {Block, Text} from '../components';
import {hp} from '../components/responsive';

const HeaderPreLogin = ({title, subtitle}) => {
  return (
    <Block flex={false}>
      <Text margin={[hp(5), 0, 0, 0]} center regular purple size={16}>
        {title}
      </Text>
      <Text margin={[hp(2), 0, hp(2), 0]} semibold purple center size={32}>
        {subtitle}
      </Text>
    </Block>
  );
};

export default HeaderPreLogin;
