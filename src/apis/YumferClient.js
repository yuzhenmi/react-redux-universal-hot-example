import * as request from 'utils/request';
let cookies;
if (__CLIENT__) {
  cookies = require('js-cookie');
}

const BASE_URL = 'http://localhost:4000';

function getAuthToken() {
  if (__SERVER__) {
    return null;
  }

  return cookies.get('aT');
}

export default {
  searchIngredients: function searchIngredients({ searchTerm, page, perPage }) {
    const url = `${BASE_URL}/v1/ingredients`;
    return request.get(url, {
      params: { q: searchTerm, page, perPage },
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
  },

  submitNewRecipe: function submitNewRecipe({ name, summary, steps }) {
    const url = `${BASE_URL}/v1/recipes`;
    return request.post(url, {
      payload: { name, summary, steps },
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
  },

  signIn: function signIn({ email, password }) {
    const url = `${BASE_URL}/v1/auth/auth_token`;
    return request.post(url, {
      payload: { auth: { email, password } }
    });
  }
};
