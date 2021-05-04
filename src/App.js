import './styles.scss';
import 'flexboxgrid2/flexboxgrid2.css';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React, { useEffect, useReducer } from 'react';
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import reducer, { defaultState } from './reducer/reducer';

import Board from './components/Board';
import Context from './context';
import MainScreen from './components/MainScreen';
import logger from './reducer/logger';

const isProduction = process.env.NODE_ENV === 'production';

const client = new ApolloClient({
  uri: !isProduction
    ? 'http://localhost:4000/graphql'
    : 'https://kanban-server.vercel.app/graphql',
  credentials: 'include',
  cache: new InMemoryCache(),
});

const App = () => {
  const [state, dispatch] = useReducer(
    isProduction ? reducer : logger(reducer),
    defaultState
  );

  const store = React.useMemo(() => ({ state, dispatch }), [state]);

  useEffect(
    () => () => {
      window.location.reload();
    },
    []
  );

  return (
    <ApolloProvider client={client}>
      <Context.Provider value={store}>
        <Router>
          <Switch>
            <Route exact path="/" component={MainScreen} />
            <Route path="/board/:id" component={Board} />
            <Redirect to="/" />
          </Switch>
        </Router>
      </Context.Provider>
    </ApolloProvider>
  );
};

export default App;
