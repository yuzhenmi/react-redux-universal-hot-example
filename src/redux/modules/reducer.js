import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import newRecipe from './newRecipe';
import modal from './modal';
import selectInputIngredientModal from './selectInputIngredientModal';

export default combineReducers({
  router: routerStateReducer,
  newRecipe,
  modal,
  selectInputIngredientModal
});
