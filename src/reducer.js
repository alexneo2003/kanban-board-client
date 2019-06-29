export default (state, action) => {
  switch (action.type) {
    case "INITIALIZE":
      return { ...action.data };
    case "REORDER_COLUMN":
      const { source, destination } = action.payload;
      let deletedColumn = state.columns.splice(source, 1);
      state.columns.splice(destination, 0, deletedColumn[0]);
      return { ...state };

    case "REORDER_CARD":
      const {
        sourceColumnID,
        destinationColumnID,
        sourcePosition,
        destinationPosition
      } = action.payload;
      let orderedCard = null;
      state.columns.map(column => {
        if (column.id === sourceColumnID) {
          orderedCard = column.cards.splice(sourcePosition, 1);
        }
        return column;
      });
      state.columns.map(column => {
        if (column.id === destinationColumnID) {
          return column.cards.splice(destinationPosition, 0, orderedCard[0]);
        }
        return column;
      });
      return { ...state };

    default:
      return state;
  }
};
