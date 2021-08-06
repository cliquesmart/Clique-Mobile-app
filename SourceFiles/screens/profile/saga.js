import {ActionConstants} from '../../redux/constants';
import {profileSuccess, profileError} from './action';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import {apiCall} from '../../redux/store/api-client';
import {APIURL} from '../../Constants/APIURL';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SaveToken = async (data) => {
  return await AsyncStorage.setItem('token', data.access_token);
};

export function* request(action) {
  try {
    const response = yield call(apiCall, 'POST', APIURL.getTempProfile, {
      user_id: action.payload,
    }); //Get request
    if (response.status === true) {
      yield call(SaveToken, response.data);
      yield put(profileSuccess(response.data.user));
    } else {
      yield put(profileError(response));
    }
  } catch (err) {
    yield put(profileError());
  }
}

export function* profileWatcher() {
  yield all([takeLatest(ActionConstants.PROFILE_REQUEST, request)]);
}

export default profileWatcher;
