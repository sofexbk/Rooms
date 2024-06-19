import { SignUpActionTypes } from '@/pages/Authentification/Actions/ActionTypes';

interface SignUpState {
  loading: boolean;
  error: string | null;
}

const initialState: SignUpState = {
  loading: false,
  error: null,
};

const signUpReducer = (state = initialState, action: any): SignUpState => {
  switch (action.type) {
    case SignUpActionTypes.SIGN_UP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null, // Clear any previous errors when starting a new request
      };
    case SignUpActionTypes.SIGN_UP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case SignUpActionTypes.SIGN_UP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default signUpReducer;
