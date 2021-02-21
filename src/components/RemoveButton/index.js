import { useMutation } from '@apollo/client';
import React, { useContext } from 'react';
import context from '../../context';
import {
  REMOVE_BOARD_MUTATION,
  REMOVE_CARD_MUTATION,
  REMOVE_COLUMN_MUTATION,
} from '../../helpers/mutations';
import { BOARDS_QUERY } from '../../helpers/queries';
import MiniLoader from '../Loader/MiniLoader';

import './remove-button.scss';

const RemoveButton = ({ buttonType, boardID, columnID, cardID }) => {
  const { onRemoveCard, onRemoveColumn } = useContext(context);

  const [removeBoard, { loading: loadingRemoveBoard }] = useMutation(
    REMOVE_BOARD_MUTATION
  );
  const [removeColumn, { loading: loadingRemoveColumn }] = useMutation(
    REMOVE_COLUMN_MUTATION
  );
  const [removeCard, { loading: loadingRemoveCard }] = useMutation(
    REMOVE_CARD_MUTATION
  );

  const onClickHandler = (type) => {
    switch (type) {
      case 'card':
        onRemoveCard(columnID, cardID, removeCard);
        break;
      case 'column':
        onRemoveColumn(columnID, removeColumn);
        break;
      case 'board':
        if (global.confirm('Are you sure you want to remove the board?')) {
          removeBoard({
            variables: { boardID },
            refetchQueries: [{ query: BOARDS_QUERY }],
          });
        }
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
