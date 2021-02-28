import { useMutation } from '@apollo/client';
import React, { useContext } from 'react';
import context from '../../context';
import {
  REMOVE_BOARD_MUTATION,
  REMOVE_CARD_MUTATION,
  REMOVE_COLUMN_MUTATION,
} from '../../helpers/mutations';
import { BOARDS_QUERY, COLUMNS_QUERY } from '../../helpers/queries';
import {
  onRemoveCard,
  onRemoveColumn,
  onRemoveBoard,
} from '../../reducer/actions';
import MiniLoader from '../Loader/MiniLoader';

import './remove-button.scss';

const RemoveButton = ({ buttonType, boardID, columnID, cardID }) => {
  const { dispatch, state } = useContext(context);
  const { currentBoard } = state || {};

  const [removeBoard, { loading: loadingRemoveBoard }] = useMutation(
    REMOVE_BOARD_MUTATION
  );
  const [removeColumn, { loading: loadingRemoveColumn }] = useMutation(
    REMOVE_COLUMN_MUTATION
  );
  const [removeCard, { loading: loadingRemoveCard }] = useMutation(
    REMOVE_CARD_MUTATION
  );

  const onRemoveCardHandler = () => {
    if (global.confirm('Are you sure you want to remove the card?')) {
      dispatch(onRemoveCard(columnID, cardID));
      removeCard({
        variables: { columnId: columnID, cardId: cardID },
        refetchQueries: [
          { query: COLUMNS_QUERY, variables: { boardID: currentBoard.id } },
        ],
      });
    }
  };

  const onRemoveColumnHandler = () => {
    if (global.confirm('Are you sure you want to remove the column?')) {
      dispatch(onRemoveColumn(columnID, cardID));
      removeColumn({
        variables: { boardID: currentBoard.id, columnID },
        refetchQueries: [
          { query: COLUMNS_QUERY, variables: { boardID: currentBoard.id } },
        ],
      });
    }
  };

  const onRemoveBoardHandler = () => {
    if (global.confirm('Are you sure you want to remove the board?')) {
      dispatch(onRemoveBoard(columnID, cardID));
      removeBoard({
        variables: { boardID },
        refetchQueries: [{ query: BOARDS_QUERY }],
      });
    }
  };

  const onClickHandler = (type) => {
    switch (type) {
      case 'card':
        onRemoveCardHandler();
        break;
      case 'column':
        onRemoveColumnHandler();
        break;
      case 'board':
        onRemoveBoardHandler();
        break;

      default:
        break;
    }
  };

  return (
    <button
      className="remove__button"
      onClick={() => onClickHandler(buttonType)}>
      {loadingRemoveBoard || loadingRemoveCard || loadingRemoveColumn ? (
        <div className="remove_button__loader">
          <MiniLoader />
        </div>
      ) : (
        <i className="fa fa-times" aria-hidden="true" />
      )}
    </button>
  );
};

export default RemoveButton;
