import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIURL} from '../../Constants/APIURL';
import {create} from 'apisauce';

/**
 * Create an Axios Client with defaults
 */

const getToken = async () => await AsyncStorage.getItem('access-token');

const client = create({
  baseURL: APIURL.BaseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cache-Control': 'no-cache',
  },
  timeout: 100000,
  // auth: { Authorization: 'Bearer ' + { getToken } }
});

/**
 * Request Wrapper with default success/error actions
 */
export const apiCall = function (method, route, body = null, token = null) {
  console.log(method, route, body, 'method, route, body');
  const onSuccess = function (response) {
    console.log('Request Successful!', response);
    return response.data;
  };
  client.addResponseTransform((response) => {
    if (response.problem == 'NETWORK_ERROR') {
      alert('No Internet Connection');

      return null;
      // Toast.showWithGravity(ValidationMsg.InternetConnection, Toast.SHORT, Toast.CENTER);
    } else if (response.problem == 'TIMEOUT_ERROR') {
      alert('Server not responding please try again');
      return null;
      // Toast.showWithGravity(ValidationMsg.Server_Not_Responding, Toast.SHORT, Toast.CENTER);
    }
  });

  const onError = function (error) {
    console.log('Request Failed:', error.config);

    if (error.response) {
      // Request was made but server responded with something
      // other than 2xx
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      console.log('Headers:', error.response.headers);
    } else {
      // Something else happened while setting up the request
      // triggered the error
      console.log('Error Message:', error.message);
    }

    return Promise.reject(error.response || error.message);
  };

  return client({
    method,
    url: route,
    data: body,
  })
    .then(onSuccess)
    .catch(onError);
};
