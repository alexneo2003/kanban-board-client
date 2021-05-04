import './board.scss';

import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import {
  REORDER_CARD_MUTATION,
  REORDER_COLUMN_MUTATION,
} from '../../helpers/mutations';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { initialize, setColumns, setCurrentBoard } from '../../reducer/actions';
/* eslint-disable react/jsx-props-no-spreading */
import { useMutation, useQuery } from '@apollo/client';

import AddNewForm from '../AddNewForm';
import BigLoader from '../Loader/BigLoader';
import { COLUMNS_QUERY } from '../../helpers/queries';
import Column from '../Column';
import Context from '../../context';
import Layout from '../Layout';
import UnsplashGallery from '../UnsplashGallery';

const Board = withRouter(({ match, history }) => {
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

  const onBackButtonEvent = (e) => {
    e.preventDefault();
    history.push('/');
    dispatch(setCurrentBoard(''));
  };

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);
    };
  }, []);

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
      <div
        className="board"
        style={{ backgroundImage: `url(${currentBoard.image})` }}>
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

      <UnsplashGallery />
    </Layout>
  );
});

export default Board;
