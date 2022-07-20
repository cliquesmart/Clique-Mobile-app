/* eslint-disable dot-notation */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'apisauce';
import qs from 'qs';
import R from 'ramda';
import {APIURL} from './APIURL';

const api = create({
  baseURL: APIURL.BaseURL,
  headers: {
    Accept: 'application/json',
  },
  timeout: 100000,
});

const monitor = (response) => {
  const {
    config: {method, url},
    data,
  } = response;
  console.group(
    `Requesting [${method.toUpperCase()}] ${url}:`,
    response.config.data,
  );
  console.groupEnd();
};
api.addMonitor(monitor);

api.addAsyncRequestTransform((request) => async () => {
  const token = await AsyncStorage.getItem('token');
  const authorization = token ? `Bearer ${token}` : null;
  request.headers['Authorization'] = authorization;
  if (R.contains(request.method, ['get', 'delete', 'post', 'put'])) {
    if (!(request.data instanceof FormData)) {
      request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      request.headers['Authorization'] = authorization;
      request.data = qs.stringify(request.data);
    }
  }
});

api.addAsyncResponseTransform(async (response) => {
  const token = await AsyncStorage.getItem('token');
  const authorization = token ? `Bearer ${token}` : null;
  if (authorization) {
    api.setHeaders({Authorization: authorization});
  }
});

api.addResponseTransform((response) => {
  if (response.problem === 'NETWORK_ERROR') {
    alert('No Internet Connection');

    return null;
  } else if (response.problem === 'TIMEOUT_ERROR') {
    alert('Server not responding please try again');
    return null;
  }
});

export default api;
