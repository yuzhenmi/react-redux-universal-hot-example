import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import newRecipe from './newRecipe';
import modal from './modal';
import signIn from './signIn';
import currentUser from './currentUser';

export default combineReducers({
  router: routerStateReducer,
  newRecipe,
  modal,
  signIn,
  currentUser
});
