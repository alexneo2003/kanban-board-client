/* eslint-disable no-case-declarations */
import { v4 as uuid } from 'uuid';
import {
  INITIALIZE,
  SET_OWNER,
  SET_BOARDS,
  REORDER_COLUMN,
  REORDER_CARD,
  TYPE_INPUT,
  SET_CURRENT_BOARD,
  ADD_NEW_CARD,
  ADD_NEW_COLUMN,
  ADD_NEW_BOARD,
  REMOVE_CARD,
  REMOVE_COLUNM,
  REMOVE_BOARD,
  SET_COLUMNS,
} from './actionTypes';

export const defaultState = {
  owner: '',
  currentBoard: {
    id: undefined,
    title: undefined,
  },
};

export default (state = defaultState, action) => {
  const {
    inputValue,
    boardID,
    columnID,
    cardID,
    source,
    destination,
    sourceColumnID,
    destinationColumnID,
    sourcePosition,
    destinationPosition,
  } = action.payload || {};

  switch (action.type) {
    case INITIALIZE:
      return { ...state, ...action.data };

    case SET_OWNER:
      return { ...state, owner: action.payload.owner };

    case SET_BOARDS:
      return { ...state, boards: action.payload.boards };

    case SET_COLUMNS:
      return { ...state, columns: action.payload.columns };

    case SET_CURRENT_BOARD:
      return { ...state, currentBoard: action.payload.currentBoard };

    case REORDER_COLUMN:
      // const { source, destination } = action.payload;

      const sourceClone = Array.from(state.columns);
      const [deletedColumn] = sourceClone.splice(source, 1);
      sourceClone.splice(destination, 0, deletedColumn);
      return { ...state, columns: sourceClone };

    case REORDER_CARD:
      // const {
      //   sourceColumnID,
      //   destinationColumnID,
      //   sourcePosition,
      //   destinationPosition,
      // } = action.payload;
      let orderedCard;

      const columnsClone = Array.from(state.columns);
      const newColumns = columnsClone.map((column) => {
        if (column.id === sourceColumnID) {
          orderedCard = column.cards[sourcePosition];
          const newCards = column.cards.filter(
            (card, i) => i !== sourcePosition
          );
          return { ...column, cards: newCards };
        }
        return column;
      });
      const resultColumns = newColumns.map((column) => {
        if (column.id === destinationColumnID) {
          const clonedCards = [...column.cards];
          clonedCards.splice(destinationPosition, 0, orderedCard);
          return {
            ...column,
            cards: clonedCards,
          };
        }
        return column;
      });
      return { ...state, columns: resultColumns };

    case ADD_NEW_CARD:
      return {
        ...state,
        columns: state.columns.map((col) => {
          if (col.id === columnID) {
            return {
              ...col,
              cards: [
                ...col.cards,
                {
                  title: inputValue,
                  id: uuid(),
                },
              ],
            };
          }
          return col;
        }),
      };

    case ADD_NEW_COLUMN:
      return {
        ...state,
        columns: state.columns
          ? [...state.columns, { title: inputValue, id: uuid(), cards: [] }]
          : [{ title: inputValue, id: uuid(), cards: [] }],
      };

    case ADD_NEW_BOARD:
      return {
        ...state,
        boards: state.boards
          ? [...state.boards, { title: inputValue, id: uuid() }]
          : [{ title: inputValue, id: uuid() }],
      };

    case REMOVE_CARD:
      return {
        ...state,
        columns: state.columns.map((column) => {
          if (column.id === columnID) {
            return {
              ...column,
              cards: column.cards.filter((card) => card.id !== cardID),
            };
          }
          return column;
        }),
      };

    case REMOVE_COLUNM:
      return {
        ...state,
        columns: state.columns.filter((column) => column.id !== columnID),
      };

    case REMOVE_BOARD:
      return {
        ...state,
        boards: state.boards.filter((board) => board.id !== boardID),
      };

    default:
      return state;
  }
};
