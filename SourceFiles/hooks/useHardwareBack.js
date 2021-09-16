import {BackHandler} from 'react-native';
import {useEffect} from 'react';

const useHardwareBack = (handler) => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handler);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handler);
    };
  }, [handler]);
};

export default useHardwareBack;
