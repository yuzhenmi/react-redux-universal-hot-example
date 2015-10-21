import { SIGN_OUT } from 'redux/modules/currentUser';

export default function handleYumferClientError(error, dispatch) {
  if (error.status === 401) {
    dispatch({ type: SIGN_OUT });
  }
}
