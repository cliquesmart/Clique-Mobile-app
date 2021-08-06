import {ActionConstants} from '../constants';
// Agent List
export const makePaymentRequest = (payload) => {
  return {
    type: ActionConstants.MAKE_PAYMENT_REQUEST,
    payload,
    res: false,
  };
};
export const makePaymentSuccess = (data) => {
  return {
    type: ActionConstants.MAKE_PAYMENT_SUCCESS,
    data,
    res: true,
  };
};
export const makePaymentError = (error) => {
  return {
    type: ActionConstants.MAKE_PAYMENT_ERROR,
    error,
    res: false,
  };
};
export const makePaymentFlush = () => {
  return {
    type: ActionConstants.MAKE_PAYMENT_FLUSH,
  };
};
