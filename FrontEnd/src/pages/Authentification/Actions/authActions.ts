import { SignUpActionTypes } from './ActionTypes';
import { Dispatch } from 'redux';
import { AxiosError } from 'axios';
import axiosInstance from '../../../apiConfig';

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  phoneNumber: string;
  dateOfBirth: string;
}

interface AxiosErrorResponse {
  response: {
    data: any;
    status: number;
    statusText: string;
  };
}

export const signUpRequest = (formData: FormData) => async (dispatch: Dispatch<any>) => {
  dispatch({ type: SignUpActionTypes.SIGN_UP_REQUEST });
  try {
    const response = await axiosInstance.post('/api/register', formData);
    dispatch({ type: SignUpActionTypes.SIGN_UP_SUCCESS, payload: response.data });
    return response; // Return the response to handle it in the component
  } catch (error) {
    const axiosError = error as AxiosError<AxiosErrorResponse>;
    if (axiosError.response) {
      dispatch({ type: SignUpActionTypes.SIGN_UP_FAILURE, payload: axiosError.response.data });
    } else {
      dispatch({ type: SignUpActionTypes.SIGN_UP_FAILURE, payload: 'An error occurred' });
    }
    throw error; // Re-throw the error to handle it in the component
  }
};

export const signUpSuccess = (data: any) => ({
  type: SignUpActionTypes.SIGN_UP_SUCCESS,
  payload: data,
});

export const signUpFailure = (error: any) => ({
  type: SignUpActionTypes.SIGN_UP_FAILURE,
  payload: error,
});
