import createReducer from 'utils/createReducer';
import Immutable from 'immutable';
import YumferClient from 'apis/YumferClient';

const MODULE_NAMESPACE = 'yumfer/signIn';

export const SET_EMAIL = `${MODULE_NAMESPACE}/SET_EMAIL`;
export const SET_PASSWORD = `${MODULE_NAMESPACE}/SET_PASSWORD`;
export const SIGN_IN = `${MODULE_NAMESPACE}/SIGN_IN`;
export const SIGN_IN_SUCCESS = `${MODULE_NAMESPACE}/SIGN_IN_SUCCESS`;
export const SIGN_IN_ERROR = `${MODULE_NAMESPACE}/SIGN_IN_ERROR`;

const initialState = Immutable.fromJS({
  email: '',
  password: '',
  isSigningIn: false
});

const handlers = {
  [SET_EMAIL]: function handleSetEmail(state, action) {
    const { email } = action;
    return state.set('email', email);
  },

  [SET_PASSWORD]: function handleSetPassword(state, action) {
    const { password } = action;
    return state.set('password', password);
  },

  [SIGN_IN]: function handleSignIn(state) {
    return state.set('isSigningIn', true);
  },

  [SIGN_IN_SUCCESS]: function handleSignInSuccess(state) {
    return state.set('isSigningIn', false);
  },

  [SIGN_IN_ERROR]: function handleSignInError(state) {
    return state.set('isSigningIn', false);
  },
};

export default createReducer(initialState, handlers);

export function setEmail(email) {
  return { type: SET_EMAIL, email };
}

export function setPassword(password) {
  return { type: SET_PASSWORD, password };
}

export function signIn(email, password) {
  return dispatch => {
    dispatch({ type: SIGN_IN, email, password });
    YumferClient.signIn({ email, password })
      .then(data => {
        const authToken = data.jwt;
        dispatch({ type: SIGN_IN_SUCCESS, authToken });
      })
      .then(error => {
        dispatch({ type: SIGN_IN_ERROR, error });
      });
  };
}
