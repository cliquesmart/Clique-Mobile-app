import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import {config} from '../../utils/config';
export const paymentApi = async (data) => {
  const token = await AsyncStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `${token}`,
  };
  return axios({
    method: 'post',
    // url: `${config.Api_Url}/customer/mission-make-payment`,
    headers,
    data: data,
  });
};
