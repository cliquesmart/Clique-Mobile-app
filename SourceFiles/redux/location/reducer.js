import {ActionConstants} from '../constants';
const initialState = {
  loading: false,
  data: [],
  error: '',
};
export function location(state = initialState, action) {
  switch (action.type) {
    case ActionConstants.LOCATION_SUCCESS:
      return {
        ...state,
        loading: true,
        data: action.data,
      };
    case ActionConstants.LOCATION_ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}

export default location;
