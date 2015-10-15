import React from 'react';
import {Route} from 'react-router';
import App from 'containers/App';
import NotFound from 'containers/NotFound';
import Home from 'containers/Home';
import NewRecipe from 'containers/NewRecipe';

export default (store) => {
  return (
    <Route component={App}>
      <Route path="/" component={Home} />
      <Route path="/new-recipe" component={NewRecipe} />
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
