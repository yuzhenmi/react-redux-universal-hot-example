import createReducer from 'utils/createReducer';
import Immutable from 'immutable';

import { SIGN_IN_SUCCESS } from 'redux/modules/signIn';

const MODULE_NAMESPACE = 'yumfer/currentUser';

const SIGN_OUT = `${MODULE_NAMESPACE}/SIGN_OUT`;

const initialState = Immutable.fromJS({
  isAuthenticated: false,
  authToken: null
});

const handlers = {
  [SIGN_IN_SUCCESS]: function handleOpenModal(state, action) {
    const { authToken } = action;
    return state
      .set('isAuthenticated', true)
      .set('authToken', authToken);
  },

  [SIGN_OUT]: function handleSignOut(state) {
    return state.set('isAuthenticated', false);
  }
};

export default createReducer(initialState, handlers);

export function signOut() {
  return { type: SIGN_OUT };
}
