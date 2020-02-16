import React, { useState, useEffect, useReducer } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Query } from "react-apollo";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { ME_QUERY } from "./helpers/queries";
import LoginScreen from "./components/LoginScreen";
import Board from "./components/Board";
import Context from "./context";
import MainScreen from "./components/MainScreen";
import Layout from "./components/Layout";
import BigLoader from "./components/Loader/BigLoader";
import reducer from "./reducer";

import "./styles.scss";
import "flexboxgrid2/flexboxgrid2.css";

const client = new ApolloClient({
  uri:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000/graphql"
      : "https://kanban-server.now.sh",
  credentials: "include"
});

const App = () => {
  const uniqID = () => {
    return Math.round(Math.random() * 10000000);
  };

  const [newCardText, setNewCardText] = useState("");
  const [data, setData] = useState({});

  const [owner, setOwner] = useState("");
  const [currentBoard, setCurrentBoard] = useState({});

  const [state, dispatch] = useReducer(reducer, null);

  useEffect(() => {
    return () => {
      window.location.reload();
    };
  }, []);

  const addNewBoard = (e, addBoard) => {
    e.preventDefault();
    addBoard({
      variables: { title: newCardText }
    });
    setNewCardText("");
  };

  const addNewCard = (e, columnID, addCard) => {
    e.preventDefault();
    const newData = {
      columns: data.columns.map(col => {
        if (col.id === columnID) {
          return {
            ...col,
            cards: [
              ...col.cards,
              {
                title: newCardText,
                id: uniqID()
              }
            ]
          };
        }
        return col;
      })
    };
    setData(newData);

    addCard({
      variables: {
        boardID: currentBoard.id,
        columnID: columnID,
        cardInput: { title: newCardText }
      }
    });
    setNewCardText("");
  };

  const addNewColumn = (e, addColumn) => {
    e.preventDefault();
    const newData = {
      columns: data.columns
        ? [...data.columns, { title: newCardText, id: uniqID(), cards: [] }]
        : [{ title: newCardText, id: uniqID(), cards: [] }]
    };
    setData(newData);
    addColumn({ variables: { boardID: currentBoard.id, title: newCardText } });
    setNewCardText("");
  };

  const onRemoveCard = (columnID, cardID, removeCard) => {
    if (global.confirm("Are you sure you want to remove the card")) {
      setData({
        columns: data.columns.map(column => {
          if (column.id === columnID) {
            return {
              ...column,
              cards: column.cards.filter(card => card.id !== cardID)
            };
          }
          return column;
        })
      });
      removeCard({ variables: { columnId: columnID, cardId: cardID } });
    }
  };

  const onRemoveColumn = (columnID, removeColumn) => {
    if (global.confirm("Are you sure you want to remove the column")) {
      setData({
        columns: data.columns.filter(column => {
          return column.id !== columnID;
        })
      });
      removeColumn({
        variables: { boardID: currentBoard.id, columnID: columnID }
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
          setCurrentBoard
        }}
      >
        <Query query={ME_QUERY} notifyonnetworkstatuschange={false}>
          {({ data, loading, error, networkStatus }) => {
            if (networkStatus === 1) return <div />;
            if (loading) return <BigLoader />;
            if (error) return <div>Error :(</div>;
            if (data.me === null) {
              return <LoginScreen />;
            } else {
              setOwner(data.me.name);
            }
            return (
              <Router>
                <Layout>
                  <Switch>
                    <Route exact path="/" component={MainScreen} />
                    <Route path="/board/:id" component={Board} />
                    <Redirect to="/" />
                  </Switch>
                </Layout>
              </Router>
            );
          }}
        </Query>
      </Context.Provider>
    </ApolloProvider>
  );
};

export default App;
