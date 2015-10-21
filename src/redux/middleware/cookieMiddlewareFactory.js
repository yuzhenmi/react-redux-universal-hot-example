export default function cookieMiddlewareFactory(cookies) {
  return (function _cookieMiddlewareFactory(_cookies) {
    return () => next => action => {
      next({...action, cookies: _cookies});
    };
  })(cookies);
}
