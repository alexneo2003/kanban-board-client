import React, { useState, useContext, useRef, useEffect } from "react";
import { Mutation } from "react-apollo";
import Context from "../../context";
import {
  ADD_COLUMN_MUTATION,
  ADD_CARD_MUTATION,
  ADD_BOARD_MUTATION
} from "../../helpers/mutations";
import { BOARDS_QUERY, COLUMNS_QUERY } from "../../helpers/queries";
import MiniLoader from "../Loader/MiniLoader";

import "./add-new-form.scss";

export default ({ columnID, isEmptyColumn, isBoardForm }) => {
  const [isShowTextarea, onShowTextarea] = useState(false);
  const {
    addNewCard,
    addNewColumn,
    addNewBoard,
    newCardText,
    setNewCardText,
    currentBoard
  } = useContext(Context);
  let inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isShowTextarea]);

  const addNewButton = (
    <div className="add-new-card__button" onClick={() => onShowTextarea(true)}>
      <i className="fa fa-plus" aria-hidden="true" />
      <div className="add-new-card__button_text">
        {isBoardForm
          ? "Создать новую доску"
          : isEmptyColumn
          ? "Добавить еще одну колонку"
          : "Добавить еще одну карточку"}
      </div>
    </div>
  );

  const addNewTextArea = (
    <Mutation
      mutation={
        isBoardForm
          ? ADD_BOARD_MUTATION
          : isEmptyColumn
          ? ADD_COLUMN_MUTATION
          : ADD_CARD_MUTATION
      }
      refetchQueries={[
        {
          query: isBoardForm ? BOARDS_QUERY : COLUMNS_QUERY,
          variables: { boardID: currentBoard.id }
        }
      ]}
      onCompleted={() => onShowTextarea(false)}
    >
      {(addNew, { loading, error, called }) => {
        if (loading)
          return (
            <div style={{ margin: 9 }}>
              <MiniLoader />
            </div>
          );
        return (
          !loading && (
            <form
              className="add-new-card__textarea"
              onSubmit={e => {
                isBoardForm
                  ? addNewBoard(e, addNew)
                  : isEmptyColumn
                  ? addNewColumn(e, addNew)
                  : addNewCard(e, columnID, addNew);
              }}
            >
              <textarea
                ref={inputRef}
                placeholder="Ввести заголовок для этой карточки"
                onChange={e => setNewCardText(e.target.value)}
                value={newCardText}
                required
              />
              <div className="add-new-card__textarea-submit">
                <button type="submit">
                  {isBoardForm
                    ? "Добавить доску"
                    : isEmptyColumn
                    ? "Добавить колонку"
                    : "Добавить карточку"}
                </button>
                <i
                  className="fa fa-times"
                  aria-hidden="true"
                  onClick={() => onShowTextarea(false)}
                />
              </div>
            </form>
          )
        );
      }}
    </Mutation>
  );
  return isShowTextarea ? addNewTextArea : addNewButton;
};
