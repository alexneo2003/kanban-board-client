import React, { useState, useContext, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import {
  ADD_COLUMN_MUTATION,
  ADD_CARD_MUTATION,
  ADD_BOARD_MUTATION,
} from '../../helpers/mutations';
import MiniLoader from '../Loader/MiniLoader';

import './add-new-form.scss';
import context from '../../context';
import { BOARDS_QUERY, COLUMNS_QUERY } from '../../helpers/queries';
import { addNewBoard, addNewCard, addNewColumn } from '../../reducer/actions';

const AddNewForm = ({ columnID, isEmptyColumn, isBoardForm }) => {
  const { dispatch, state } = useContext(context);
  const [isShowTextarea, onShowTextarea] = useState(false);
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

  const { currentBoard } = state || {};

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

  const addNewCardHandler = async (inputValue) => {
    addCard({
      variables: {
        boardID: currentBoard.id,
        columnID,
        cardInput: { title: inputValue },
      },
      refetchQueries: [
        {
          query: isBoardForm ? BOARDS_QUERY : COLUMNS_QUERY,
          variables: { boardID: currentBoard.id },
        },
      ],
    });
    dispatch(addNewCard(columnID, inputValue));
  };

  const addNewColumnHandler = (inputValue) => {
    addColumn({
      variables: { boardID: currentBoard.id, title: inputValue },
      refetchQueries: [
        {
          query: isBoardForm ? BOARDS_QUERY : COLUMNS_QUERY,
          variables: { boardID: currentBoard.id },
        },
      ],
    });
    dispatch(addNewColumn(inputValue));
  };

  const addNewBoardHandler = (inputValue) => {
    addBoard({
      variables: { title: inputValue },
      refetchQueries: [
        {
          query: isBoardForm ? BOARDS_QUERY : COLUMNS_QUERY,
          variables: { boardID: currentBoard.id },
        },
      ],
    });
    dispatch(addNewBoard(inputValue));
  };

  const onSubmitHandler = (e, inputValue) => {
    e.preventDefault();

    const value = inputValue.trim();

    if (value.length < 3 || value === '') {
      alert('The input value requires length more than 2 symbols');
    } else if (isBoardForm) {
      addNewBoardHandler(inputValue);
    } else if (isEmptyColumn) {
      addNewColumnHandler(inputValue);
    } else {
      addNewCardHandler(inputValue);
    }
  };

  const AddNewTextArea = ({ onFormSubmit }) => {
    const [inputVal, setValue] = useState('');
    const onChangeHandler = (event) => {
      setValue(event.target.value);
    };
    if (loadingAddBoard || loadingAddColumn || loadingAddCard) {
      return (
        <div style={{ margin: 9 }}>
          <MiniLoader />
        </div>
      );
    }

    return (
      <form
        className={
          isBoardForm
            ? 'add-new-card__textarea add-new-card__textarea__board'
            : 'add-new-card__textarea'
        }
        onSubmit={(e) => onFormSubmit(e, inputVal)}>
        <textarea
          ref={inputRef}
          placeholder="Ввести заголовок для этой карточки"
          onChange={onChangeHandler}
          value={inputVal}
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

  return isShowTextarea ? (
    <AddNewTextArea onFormSubmit={onSubmitHandler} />
  ) : (
    <AddNewButton />
  );
};

export default AddNewForm;
