import createReducer from 'utils/createReducer';
import Immutable from 'immutable';
import YumferClient from 'apis/YumferClient';

const MODULE_NAMESPACE = 'yumfer/selectInputIngredientModal';

export const SET_SEARCH_TERM = `${MODULE_NAMESPACE}/SET_SEARCH_TERM`;
export const SEARCH = `${MODULE_NAMESPACE}/SEARCH`;
export const SEARCH_SUCCESS = `${MODULE_NAMESPACE}/SEARCH_SUCCESS`;
export const SEARCH_ERROR = `${MODULE_NAMESPACE}/SEARCH_ERROR`;
export const CLEAR_SEARCH = `${MODULE_NAMESPACE}/CLEAR_SEARCH`;

const initialState = Immutable.fromJS({
  searchTerm: '',
  matchingIngredients: [],
  isSearching: false
});

const handlers = {
  [SET_SEARCH_TERM]: function handleSetSearchTerm(state, action) {
    const { searchTerm } = action;
    return state.set('searchTerm', searchTerm);
  },

  [SEARCH]: function handleSearch(state) {
    return state.set('isSearching', true);
  },

  [SEARCH_SUCCESS]: function handleSearchSuccess(state, action) {
    const { ingredients } = action;
    return state
      .set('isSearching', false)
      .set('matchingIngredients', Immutable.fromJS(ingredients));
  },

  [SEARCH_ERROR]: function handleSearchError(state) {
    return state.set('isSearching', false);
  },

  [CLEAR_SEARCH]: function handleClearSearch() {
    return initialState;
  }
};

export default createReducer(initialState, handlers);

export function setSearchTerm(searchTerm) {
  return dispatch => {
    if (searchTerm.trim().length > 0) {
      dispatch({ type: SET_SEARCH_TERM, searchTerm });
      dispatch({ type: SEARCH, searchTerm });
      YumferClient.searchIngredients({ searchTerm, page: 1, perPage: 10 })
        .then(data => {
          const {ingredients} = data;
          dispatch({ type: SEARCH_SUCCESS, ingredients });
        })
        .then(error => {
          dispatch({ type: SEARCH_ERROR, error });
        });
    } else {
      dispatch({ type: CLEAR_SEARCH });
    }
  };
}
