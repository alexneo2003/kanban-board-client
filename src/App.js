import React, { useState, useEffect, useReducer } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { BOARDS_QUERY, COLUMNS_QUERY } from './helpers/queries';
import Board from './components/Board';
import Context from './context';
import MainScreen from './components/MainScreen';
import reducer from './reducer';

import './styles.scss';
import 'flexboxgrid2/flexboxgrid2.css';

const client = new ApolloClient({
  uri:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000/graphql'
      : 'https://kanban-server.vercel.app/graphql',
  credentials: 'include',
  cache: new InMemoryCache(),
});

const App = () => {
  const uniqID = () => Math.round(Math.random() * 10000000);
  const [owner, setOwner] = useState(undefined);
  const [newCardText, setNewCardText] = useState('');
  const [data, setData] = useState({});
  const [currentBoard, setCurrentBoard] = useState({});
  const [state, dispatch] = useReducer(reducer, null);

  useEffect(
    () => () => {
      window.location.reload();
    },
    []
  );

  const addNewBoard = (e, addBoard, isBoardForm) => {
    e.preventDefault();
    addBoard({
      variables: { title: newCardText },
      refetchQueries: [
        {
          query: isBoardForm ? BOARDS_QUERY : COLUMNS_QUERY,
          variables: { boardID: currentBoard.id },
        },
      ],
    });
    setNewCardText('');
  };

  const addNewCard = (e, columnID, addCard, isBoardForm) => {
    e.preventDefault();
    const newData = {
      columns: data.columns.map((col) => {
        if (col.id === columnID) {
          return {
            ...col,
            cards: [
              ...col.cards,
              {
                title: newCardText,
                id: uniqID(),
              },
            ],
          };
        }
        return col;
      }),
    };
    setData(newData);

    addCard({
      variables: {
        boardID: currentBoard.id,
        columnID,
        cardInput: { title: newCardText },
      },
      refetchQueries: [
        {
          query: isBoardForm ? BOARDS_QUERY : COLUMNS_QUERY,
          variables: { boardID: currentBoard.id },
        },
      ],
    });
    setNewCardText('');
  };

  const addNewColumn = (e, addColumn, isBoardForm) => {
    e.preventDefault();
    const newData = {
      columns: data.columns
        ? [...data.columns, { title: newCardText, id: uniqID(), cards: [] }]
        : [{ title: newCardText, id: uniqID(), cards: [] }],
    };
    setData(newData);
    addColumn({
      variables: { boardID: currentBoard.id, title: newCardText },
      refetchQueries: [
        {
          query: isBoardForm ? BOARDS_QUERY : COLUMNS_QUERY,
          variables: { boardID: currentBoard.id },
        },
      ],
    });
    setNewCardText('');
  };

  const onRemoveCard = (columnID, cardID, removeCard) => {
    if (global.confirm('Are you sure you want to remove the card')) {
      setData({
        columns: data.columns.map((column) => {
          if (column.id === columnID) {
            return {
              ...column,
              cards: column.cards.filter((card) => card.id !== cardID),
            };
          }
          return column;
        }),
      });
      removeCard({
        variables: { columnId: columnID, cardId: cardID },
        refetchQueries: [
          { query: COLUMNS_QUERY, variables: { boardID: currentBoard.id } },
        ],
      });
    }
  };

  const onRemoveColumn = (columnID, removeColumn) => {
    if (global.confirm('Are you sure you want to remove the column')) {
      setData({
        columns: data.columns.filter((column) => column.id !== columnID),
      });
      removeColumn({
        variables: { boardID: currentBoard.id, columnID },
        refetchQueries: [
          { query: COLUMNS_QUERY, variables: { boardID: currentBoard.id } },
        ],
      });
    }
  };

  return (
    <ApolloProvider client={client}>
      <Context.Provider
        value={{
          state,
          dispatch,
          data,
          setData,
          addNewCard,
          addNewColumn,
          addNewBoard,
          newCardText,
          setNewCardText,
          onRemoveCard,
          onRemoveColumn,
          owner,
          setOwner,
          currentBoard,
          setCurrentBoard,
        }}>
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
