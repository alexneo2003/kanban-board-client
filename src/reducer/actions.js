import {
  ADD_NEW_BOARD,
  ADD_NEW_CARD,
  ADD_NEW_COLUMN,
  CHANGE_BOARD_IMAGE,
  EDIT_TITLE,
  INITIALIZE,
  REMOVE_BOARD,
  REMOVE_CARD,
  REMOVE_COLUNM,
  REORDER_CARD,
  REORDER_COLUMN,
  SET_BOARDS,
  SET_COLUMNS,
  SET_CURRENT_BOARD,
  SET_EDIT_TITLE,
  SET_OWNER,
  TYPE_INPUT,
} from './actionTypes';

export const initialize = (columns, board) => ({
  type: INITIALIZE,
  data: { columns, board },
});

export const typeInput = (value) => ({
  type: TYPE_INPUT,
  payload: { value },
});

export const setOwner = (owner) => ({
  type: SET_OWNER,
  payload: {
    owner,
  },
});

export const setBoards = (boards) => ({
  type: SET_BOARDS,
  payload: {
    boards,
  },
});

export const setColumns = (columns) => ({
  type: SET_COLUMNS,
  payload: {
    columns,
  },
});

export const setCurrentBoard = (currentBoard) => ({
  type: SET_CURRENT_BOARD,
  payload: {
    currentBoard,
  },
});

export const addNewCard = (columnID, inputValue) => ({
  type: ADD_NEW_CARD,
  payload: {
    columnID,
    inputValue,
  },
});

export const addNewColumn = () => ({
  type: ADD_NEW_COLUMN,
});

export const addNewBoard = (inputValue) => ({
  type: ADD_NEW_BOARD,
  payload: { inputValue },
});

export const onRemoveCard = (columnID, cardID) => ({
  type: REMOVE_CARD,
  payload: { columnID, cardID },
});

export const onRemoveColumn = (columnID) => ({
  type: REMOVE_COLUNM,
  payload: { columnID },
});

export const onRemoveBoard = (boardID) => ({
  type: REMOVE_BOARD,
  payload: { boardID },
});

export const onEditTitle = (sourceID, sourceType) => ({
  type: EDIT_TITLE,
  payload: { sourceID, sourceType },
});

export const setNewEditTitle = (title, sourceID, sourceType) => ({
  type: SET_EDIT_TITLE,
  payload: { title, sourceID, sourceType },
});

export const changeBoardImageBG = (image) => ({
  type: CHANGE_BOARD_IMAGE,
  payload: { image },
});
