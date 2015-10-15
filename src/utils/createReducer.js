import Immutable from 'immutable';

export default function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action = {}) {
    const handler = handlers[action.type];
    const immutableState = Immutable.Iterable.isIterable(immutableState) ? state : Immutable.fromJS(state);
    if (handler) {
      return handler(immutableState, action);
    }
    return immutableState;
  };
}
