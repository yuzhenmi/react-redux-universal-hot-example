import request from 'superagent';

function formatQueryString(params) {
  const querySubstrings = [];
  for (const key in params) {
    if (!params.hasOwnProperty(key)) {
      continue;
    }
    const value = params[key];
    if (!value) {
      continue;
    }
    querySubstrings.push(key + '=' + value);
  }
  return querySubstrings.join('&');
}

function attachQueryStringToUrl(url, queryString) {
  return url + (queryString && queryString.length > 0 ? '?' + queryString : '');
}

export function get(url, {params: params, headers: headers} = {params: {}, headers: {}}) {
  return new Promise((resolve, reject) => {
    request
      .get(attachQueryStringToUrl(url, formatQueryString(params)))
      .set('Accept', 'application/json')
      .set(headers)
      .end((err, resp) => {
        if (err) {
          reject(err, resp);
        } else {
          resolve(resp.body, resp);
        }
      });
  });
}

export function post(url, {payload: payload, params: params, headers: headers} = {payload: null, params: {}, headers: {}}) {
  return new Promise((resolve, reject) => {
    request
      .post(attachQueryStringToUrl(url, formatQueryString(params)))
      .send(payload)
      .set('Accept', 'application/json')
      .set(headers)
      .end((err, resp) => {
        if (err) {
          reject(err, resp);
        } else {
          resolve(resp.body, resp);
        }
      });
  });
}

export function put(url, {payload: payload, params: params, headers: headers} = {payload: null, params: {}, headers: {}}) {
  return new Promise((resolve, reject) => {
    request
      .put(attachQueryStringToUrl(url, formatQueryString(params)))
      .send(payload)
      .set('Accept', 'application/json')
      .set(headers)
      .end((err, resp) => {
        if (err) {
          reject(err, resp);
        } else {
          resolve(resp.body, resp);
        }
      });
  });
}

export function del(url, {payload: payload, params: params, headers: headers} = {payload: null, params: {}, headers: {}}) {
  return new Promise((resolve, reject) => {
    request
      .del(attachQueryStringToUrl(url, formatQueryString(params)))
      .send(payload)
      .set('Accept', 'application/json')
      .set(headers)
      .end((err, resp) => {
        if (err) {
          reject(err, resp);
        } else {
          resolve(resp.body, resp);
        }
      });
  });
}
