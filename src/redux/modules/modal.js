import createReducer from 'utils/createReducer';
import Immutable from 'immutable';

const MODULE_NAMESPACE = 'yumfer/modal';

export const OPEN_MODAL = `${MODULE_NAMESPACE}/OPEN_MODAL`;
export const CLOSE_MODAL = `${MODULE_NAMESPACE}/CLOSE_MODAL`;

const initialState = Immutable.fromJS({
  modals: []
});

const handlers = {
  [OPEN_MODAL]: function handleOpenModal(state, action) {
    const { component, id, props } = action;
    const modals = state.get('modals');
    return state.set('modals', modals.push(new Immutable.Map({ component, id, props })));
  },

  [CLOSE_MODAL]: function handleCloseModal(state, action) {
    const { id } = action;
    const modals = state.get('modals');
    const modalIndex = modals.findIndex((modal) => {
      return modal.get('id') === id;
    });
    return state.set('modals', modals.delete(modalIndex));
  }
};

export default createReducer(initialState, handlers);

export function openModal(component, id, props) {
  return { type: OPEN_MODAL, component, id, props };
}

export function closeModal(id) {
  return { type: CLOSE_MODAL, id };
}
