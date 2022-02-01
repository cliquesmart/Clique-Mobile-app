import React from 'react';
import {ImageComponent} from '.';
import Block from './Block';
import Text from './Text';
import {t2} from './theme/fontsize';

const EmptyFile = ({text}) => {
  return (
    <Block center middle>
      <Text size={22} purple semibold margin={[t2, 0, 0]}>
        {text || 'No Data'}
      </Text>
    </Block>
  );
};

export default EmptyFile;
