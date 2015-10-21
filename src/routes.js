import React from 'react';
import {Route} from 'react-router';
import App from 'containers/App';
import Home from 'containers/Home';
import SignIn from 'containers/SignIn';
import NewRecipe from 'containers/NewRecipe';
import NotFound from 'containers/NotFound';

export default (store) => {
  return (
    <Route component={App}>
      <Route path="/" component={Home} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/new-recipe" component={NewRecipe} />
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
