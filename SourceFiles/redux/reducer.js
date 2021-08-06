import {combineReducers} from 'redux';
import payment from './payments/reducer';
import profile from '../screens/profile/reducer';
import location from './location/reducer';

const rootreducer = combineReducers({
  payment,
  profile,
  location,
});
export default rootreducer;
