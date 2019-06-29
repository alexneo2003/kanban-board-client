import React, { useContext, useState, useEffect, useReducer } from "react";
import { Query, Mutation } from "react-apollo";
import { Redirect } from "react-router-dom";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import BigLoader from "../Loader/BigLoader";
import Context from "../../context";
import { COLUMNS_QUERY } from "../../helpers/queries";
import {
  REORDER_COLUMN_MUTATION,
  REORDER_CARD_MUTATION
} from "../../helpers/mutations";
import Column from "../Column";

import "./board.scss";

const Board = ({ match }) => {
  const {
    setData,
    setCurrentBoard,
    currentBoard,
    state,
    dispatch
  } = useContext(Context);
  const [draggingResult, setDraggingResult] = useState({});

  useEffect(() => {
    const { type, draggableId, source, destination, reorder } = draggingResult;
    if (type === "column") {
      if (source.index !== destination.index) {
        dispatch({
          type: "REORDER_COLUMN",
          payload: {
            source: source.index,
            destination: destination.index
          }
        });
        reorder({
          variables: {
            boardID: currentBoard.id,
            columnID: draggableId,
            source: source.index,
            destination: destination.index
          }
        });
      }
    }
    if (type === "DEFAULT") {
      dispatch({
        type: "REORDER_CARD",
        payload: {
          sourceColumnID: source.droppableId,
          destinationColumnID: destination.droppableId,
          sourcePosition: source.index,
          destinationPosition: destination.index
        }
      });
      reorder({
        variables: {
          cardID: draggableId,
          sourceColumnID: source.droppableId,
          destinationColumnID: destination.droppableId,
          sourcePosition: source.index,
          destinationPosition: destination.index
        }
      });
    }
  }, [draggingResult]);

  const onDragEnd = (result, reorder) => {
    const { type, draggableId, source, destination } = result;
    setDraggingResult({ type, draggableId, source, destination, reorder });
  };

  const onCompletedHandle = data => {
    console.log("onCompletedHandle");
    setData(data);
    setCurrentBoard(data.boardById);
    dispatch({
      type: "INITIALIZE",
      data: data
    });
  };

  return (
    <div className="board">
      <Query
        query={COLUMNS_QUERY}
        variables={{ boardID: match.params.id }}
        fetchPolicy="network-only"
        onCompleted={onCompletedHandle}
      >
        {({ data, loading, error }) => {
          if (loading) return <BigLoader />;
          if (error) return <div>Error :(</div>;
          if (data.boardById === null) {
            return <Redirect to="/" />;
          }
          return (
            <Mutation
              mutation={
                draggingResult.type === "column"
                  ? REORDER_COLUMN_MUTATION
                  : REORDER_CARD_MUTATION
              }
              refetchQueries={[
                {
                  query: COLUMNS_QUERY,
                  variables: { boardID: currentBoard.id }
                }
              ]}
            >
              {reorder => (
                <>
                  <DragDropContext
                    onDragEnd={result => onDragEnd(result, reorder)}
                  >
                    <Droppable
                      droppableId="all-columns"
                      direction="horizontal"
                      type="column"
                    >
                      {({ innerRef, droppableProps, placeholder }) => (
                        <div
                          className="board__container"
                          ref={innerRef}
                          {...droppableProps}
                        >
                          {state &&
                            state.columns.map(({ id, ...args }, index) => (
                              <Column
                                key={id}
                                columnID={id}
                                index={index}
                                {...args}
                              />
                            ))}
                          {placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  <Column />
                </>
              )}
            </Mutation>
          );
        }}
      </Query>
    </div>
  );
};

export default Board;
