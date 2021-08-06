import {all} from 'redux-saga/effects';
import {paymentWatcher} from './payments/saga';
import {profileWatcher} from '../screens/profile/saga';
export default function* rootSaga() {
  yield all([paymentWatcher(), profileWatcher()]);
}
