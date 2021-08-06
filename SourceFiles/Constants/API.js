/* eslint-disable dot-notation */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'apisauce';
import qs from 'qs';
import R from 'ramda';
// import Toast from 'react-native-simple-toast';
import {APIURL} from './APIURL';

const api = create({
  baseURL: APIURL.BaseURL,
  headers: {
    Accept: 'application/json',
    // Authorization: 'Bearer',
  },
  timeout: 100000,
});
// console.log('Bearer ' + JSON.parse(getToken()));

const monitor = (response) => {
  const {
    config: {method, url},
    data,
    status,
  } = response;
  console.group(`Requesting [${method.toUpperCase()}] ${url}:`);
  console.log('Response Status:', status);
  console.log('Response Data:', data);
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
  console.log(authorization);
  if (authorization) {
    api.setHeaders({Authorization: authorization});
  }
});
// const serverRequestModifier = async (req) => {
//   const token = await AsyncStorage.getItem('token');
//   const authorization = token ? `Bearer ${token}` : null;
//   if (authorization) {
//     api.setHeaders({Authorization: authorization});
//   }
// };

api.addResponseTransform((response) => {
  if (response.problem == 'NETWORK_ERROR') {
    alert('No Internet Connection');

    return null;
    // Toast.showWithGravity(ValidationMsg.InternetConnection, Toast.SHORT, Toast.CENTER);
  } else if (response.problem == 'TIMEOUT_ERROR') {
    alert('Server not responding please try again');
    return null;
    // Toast.showWithGravity(ValidationMsg.Server_Not_Responding, Toast.SHORT, Toast.CENTER);
  }

  //console.log('Response Data:', JSON.stringify(response.data));
  /* if (response.data.erro !== undefined) {
      response.ok = false;
      let message = (typeof response.data.erro === 'object')
          ? response.data.erro.mensagem
          : response.data.erro;

      if (!message) {
          message = 'Erro desconhecido';
      }

      response.data = { message };
  } else {
      const data = response.data.item || response.data.itens || null;
      if (response.data['access-token'] !== undefined) {
          data.tokenapi = response.data['access-token'];
      }
      if (response.data.total_itens !== undefined) {
          response.count = +response.data.total_itens;
      }
      response.data = data;
  } */
});

export default api;
