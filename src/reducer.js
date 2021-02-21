/* eslint-disable no-case-declarations */

export default (state, action) => {
  switch (action.type) {
    case 'INITIALIZE':
      return { ...action.data };
    case 'REORDER_COLUMN':
      const { source, destination } = action.payload;

      const sourceClone = Array.from(state.columns);
      const [deletedColumn] = sourceClone.splice(source, 1);
      sourceClone.splice(destination, 0, deletedColumn);
      return { ...state, columns: sourceClone };

    case 'REORDER_CARD':
      const {
        sourceColumnID,
        destinationColumnID,
        sourcePosition,
        destinationPosition,
      } = action.payload;
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

    default:
      return state;
  }
};
