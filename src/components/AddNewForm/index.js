import React, { useState, useContext, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Context from '../../context';
import {
  ADD_COLUMN_MUTATION,
  ADD_CARD_MUTATION,
  ADD_BOARD_MUTATION,
} from '../../helpers/mutations';
import MiniLoader from '../Loader/MiniLoader';

import './add-new-form.scss';

export default ({ columnID, isEmptyColumn, isBoardForm }) => {
  const [isShowTextarea, onShowTextarea] = useState(false);
  const {
    addNewCard,
    addNewColumn,
    addNewBoard,
    newCardText,
    setNewCardText,
  } = useContext(Context);
  const inputRef = useRef(null);

  const [addBoard, { loading: loadingAddBoard }] = useMutation(
    ADD_BOARD_MUTATION,
    {
      onCompleted: () => onShowTextarea(false),
    }
  );
  const [addColumn, { loading: loadingAddColumn }] = useMutation(
    ADD_COLUMN_MUTATION,
    {
      onCompleted: () => onShowTextarea(false),
    }
  );
  const [addCard, { loading: loadingAddCard }] = useMutation(
    ADD_CARD_MUTATION,
    {
      onCompleted: () => onShowTextarea(false),
    }
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isShowTextarea]);

  const AddNewButton = () => {
    return (
      <button
        className="add-new-card__button"
        onClick={() => onShowTextarea(true)}
        type="button">
        <i className="fa fa-plus" aria-hidden="true" />
        <div className="add-new-card__button_text">
          {isBoardForm
            ? 'Создать новую доску'
            : isEmptyColumn
            ? 'Добавить еще одну колонку'
            : 'Добавить еще одну карточку'}
        </div>
      </button>
    );
  };

  const onSubmitHandler = (e) => {
    if (isBoardForm) {
      addNewBoard(e, addBoard, isBoardForm);
    } else if (isEmptyColumn) {
      addNewColumn(e, addColumn, isBoardForm);
    } else {
      addNewCard(e, columnID, addCard, isBoardForm);
    }
  };

  const AddNewTextArea = () => {
    if (loadingAddBoard || loadingAddColumn || loadingAddCard) {
      return (
        <div style={{ margin: 9 }}>
          <MiniLoader />
        </div>
      );
    }
    return (
      <form className="add-new-card__textarea" onSubmit={onSubmitHandler}>
        <textarea
          ref={inputRef}
          placeholder="Ввести заголовок для этой карточки"
          onChange={(e) => setNewCardText(e.target.value)}
          value={newCardText}
          required
        />
        <div className="add-new-card__textarea-submit">
          <button type="submit">
            {isBoardForm
              ? 'Добавить доску'
              : isEmptyColumn
              ? 'Добавить колонку'
              : 'Добавить карточку'}
          </button>
          <i
            className="fa fa-times"
            aria-hidden="true"
            onClick={() => onShowTextarea(false)}
          />
        </div>
      </form>
    );
  };

  return isShowTextarea ? <AddNewTextArea /> : <AddNewButton />;
};
