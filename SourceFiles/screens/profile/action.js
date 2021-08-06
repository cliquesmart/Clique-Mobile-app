import {ActionConstants} from '../../redux/constants';
// Agent List
export const profileRequest = (payload) => {
  return {
    type: ActionConstants.PROFILE_REQUEST,
    payload,
    res: false,
  };
};
export const profileSuccess = (data) => {
  return {
    type: ActionConstants.PROFILE_SUCCESS,
    data,
    res: true,
  };
};
export const profileError = (error) => {
  return {
    type: ActionConstants.PROFILE_ERROR,
    error,
    res: false,
  };
};
export const profileFlush = () => {
  return {
    type: ActionConstants.PROFILE_FLUSH,
  };
};
