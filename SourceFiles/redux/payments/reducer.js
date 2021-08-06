import {combineReducers} from 'redux';
import {ActionConstants} from '../constants';
const initialState = {
  loading: false,
  data: [],
  error: '',
  isSuccess: false,
};
export function makePayment(state = initialState, action) {
  switch (action.type) {
    case ActionConstants.MAKE_PAYMENT_REQUEST:
      return {
        ...state,
        loading: true,
        isSuccess: false,
      };
    case ActionConstants.MAKE_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.data,
        isSuccess: true,
      };
    case ActionConstants.MAKE_PAYMENT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
        isSuccess: false,
      };
    case ActionConstants.MAKE_PAYMENT_FLUSH:
      return {
        loading: false,
        data: [],
        error: '',
        isSuccess: false,
      };

    default:
      return state;
  }
}

const payment = combineReducers({
  makePayment,
});
export default payment;
