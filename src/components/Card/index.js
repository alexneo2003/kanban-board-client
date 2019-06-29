import React, { useContext } from "react";
import { Mutation } from "react-apollo";
import { Draggable } from "react-beautiful-dnd";
import { REMOVE_CARD_MUTATION } from "../../helpers/mutations";
import { COLUMNS_QUERY } from "../../helpers/queries";
import Context from "../../context";
import RemoveButton from "../RemoveButton";

import "./card.scss";

export default ({ columnID, cardID, title, index }) => {
  const { onRemoveCard, currentBoard } = useContext(Context);
  return (
    <Mutation
      mutation={REMOVE_CARD_MUTATION}
      refetchQueries={[
        { query: COLUMNS_QUERY, variables: { boardID: currentBoard.id } }
      ]}
    >
      {(removeCard, { loading, error }) => (
        <Draggable draggableId={cardID} index={index}>
          {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
            <div
              className={isDragging ? "card card__dragging" : "card"}
              {...draggableProps}
              {...dragHandleProps}
              ref={innerRef}
            >
              <span className="card__text">{title}</span>
              <RemoveButton
                loading={loading}
                onClick={() => onRemoveCard(columnID, cardID, removeCard)}
              />
            </div>
          )}
        </Draggable>
      )}
    </Mutation>
  );
};
