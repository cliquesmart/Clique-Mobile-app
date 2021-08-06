import React from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import {light} from './theme/colors';

const styles = StyleSheet.create({
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgb(255,255,255)',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
  },
});

const ActivityLoader = () => {
  return (
    <ActivityIndicator
      size="large"
      color={light.secondary}
      style={styles.loader}
    />
  );
};

export default ActivityLoader;
