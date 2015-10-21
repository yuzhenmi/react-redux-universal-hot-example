import createReducer from 'utils/createReducer';
import Immutable from 'immutable';

import { SIGN_IN_SUCCESS } from 'redux/modules/signIn';

const MODULE_NAMESPACE = 'yumfer/currentUser';

export const SIGN_OUT = `${MODULE_NAMESPACE}/SIGN_OUT`;
export const CHECK_AUTHENTICATION = `${MODULE_NAMESPACE}/CHECK_AUTHENTICATION`;

const initialState = Immutable.fromJS({
  isAuthenticated: false,
  authToken: null
});

const handlers = {
  [SIGN_IN_SUCCESS]: function handleOpenModal(state, action) {
    const { authToken, cookies } = action;
    cookies.set('aT', authToken);
    return state
      .set('isAuthenticated', true)
      .set('authToken', authToken);
  },

  [SIGN_OUT]: function handleSignOut(state, action) {
    const { cookies } = action;
    cookies.remove('aT');
    return state.set('isAuthenticated', false);
  },

  [CHECK_AUTHENTICATION]: function handleCheckAuthentication(state, action) {
    const { cookies } = action;
    const authToken = cookies.get('aT');
    return state
      .set('isAuthenticated', !!authToken)
      .set('authToken', authToken);
  }
};

export default createReducer(initialState, handlers);

export function signOut() {
  return { type: SIGN_OUT };
}

export function checkAuthentication() {
  return { type: CHECK_AUTHENTICATION };
}
