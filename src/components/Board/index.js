/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import BigLoader from '../Loader/BigLoader';
import Context from '../../context';
import { COLUMNS_QUERY } from '../../helpers/queries';
import {
  REORDER_COLUMN_MUTATION,
  REORDER_CARD_MUTATION,
} from '../../helpers/mutations';
import Column from '../Column';

import './board.scss';
import Layout from '../Layout';
import AddNewForm from '../AddNewForm';
import { initialize, setColumns, setCurrentBoard } from '../../reducer/actions';

const Board = ({ match }) => {
  const { state, dispatch } = useContext(Context);

  const [draggingResult, setDraggingResult] = useState({});
  const [redirect, setRedirect] = useState(false);
  const { data, loading } = useQuery(COLUMNS_QUERY, {
    variables: { boardID: match.params.id },
    fetchPolicy: 'network-only',
  });

  const { columns: columnsState, currentBoard } = state || {};

  const [reorderColumn] = useMutation(REORDER_COLUMN_MUTATION);
  const [reorderCard] = useMutation(REORDER_CARD_MUTATION);

  const onCompletedHandle = (dataFn) => {
    const {
      getColumns: { columns },
      getBoardById: { board },
    } = dataFn;
    dispatch(setColumns(columns));
    dispatch(setCurrentBoard(board));
    // dispatch(initialize(columns, board));
  };

  useEffect(() => {
    if (!loading && data) {
      if (data.getBoardById) {
        setRedirect(false);
        onCompletedHandle(data);
      }
    } else {
      setRedirect(true);
    }
  }, [data]);

  useEffect(() => {
    const {
      type,
      draggableId,
      source,
      destination,
      reorderFn,
    } = draggingResult;
    if (type === 'column') {
      if (source.index !== destination.index) {
        dispatch({
          type: 'REORDER_COLUMN',
          payload: {
            source: source.index,
            destination: destination.index,
          },
        });
        reorderFn({
          variables: {
            boardID: currentBoard.id,
            columnID: draggableId,
            source: source.index,
            destination: destination.index,
          },
        });
      }
    }
    if (type === 'DEFAULT') {
      dispatch({
        type: 'REORDER_CARD',
        payload: {
          sourceColumnID: source.droppableId,
          destinationColumnID: destination.droppableId,
          sourcePosition: source.index,
          destinationPosition: destination.index,
        },
      });
      reorderFn({
        variables: {
          cardID: draggableId,
          sourceColumnID: source.droppableId,
          destinationColumnID: destination.droppableId,
          sourcePosition: source.index,
          destinationPosition: destination.index,
        },
      });
    }
  }, [draggingResult]);

  const onDragEnd = (result) => {
    const { type, draggableId, source, destination } = result;
    setDraggingResult({
      type,
      draggableId,
      source,
      destination,
      reorderFn: result.type === 'column' ? reorderColumn : reorderCard,
    });
  };

  if (loading) return <BigLoader />;

  if (redirect && !data) {
    return <Redirect push to="/" />;
  }

  return (
    <Layout>
      <div className="board">
        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column">
            {({ innerRef, droppableProps, placeholder }) => (
              <div
                className="board__container"
                ref={innerRef}
                {...droppableProps}>
                {columnsState &&
                  columnsState.map(({ id, ...args }, index) => (
                    <Column key={id} columnID={id} index={index} {...args} />
                  ))}
                {placeholder}

                <div className="column">
                  <AddNewForm isEmptyColumn />
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </Layout>
  );
};

export default Board;
