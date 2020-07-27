import React from 'react';
import { Switch, Route } from 'react-router';
// import * as routes from '../constants/routes.json';
import App from './App';
import HomePage from './components/HomePage';
import QueriesPage from './components/QueriesPage';

export default () => (
  <App>
    <Switch>
      <Route path="/" component={QueriesPage} />
      <Route path="/queries/" component={HomePage} />
    </Switch>
  </App>
);