import * as request from 'utils/request';
import cookies from 'cookies-js';

const BASE_URL = 'http://localhost:4000';

function getAuthToken() {
  if (__SERVER__) {
    return null;
  }

  return cookies.get('aT') || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NDQ4ODQzNzksImF1ZCI6bnVsbCwic3ViIjoxfQ.KfmGEFCy6Ndqm5ncINY6Zyc1OYQGQWVzDbaUtaL8ihs';
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
  }
};
