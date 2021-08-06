import {ActionConstants} from '../../redux/constants';
const initialState = {
  loading: false,
  data: [],
  error: '',
  isSuccess: false,
};
export function profile(state = initialState, action) {
  switch (action.type) {
    case ActionConstants.PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        isSuccess: false,
      };
    case ActionConstants.PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.data,
        isSuccess: true,
      };
    case ActionConstants.PROFILE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
        isSuccess: false,
      };
    case ActionConstants.PROFILE_FLUSH:
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

export default profile;
