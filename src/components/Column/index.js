import React, { useContext } from "react";
import { Mutation } from "react-apollo";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { REMOVE_COLUMN_MUTATION } from "../../helpers/mutations";
import { COLUMNS_QUERY } from "../../helpers/queries";
import Context from "../../context";
import RemoveButton from "../RemoveButton";

import Card from "../Card";
import AddNewForm from "../AddNewForm";
import "./column.scss";

export default ({ columnID, title, cards, index }) => {
  const { onRemoveColumn, currentBoard } = useContext(Context);
  return cards ? (
    <Mutation
      mutation={REMOVE_COLUMN_MUTATION}
      refetchQueries={[
        { query: COLUMNS_QUERY, variables: { boardID: currentBoard.id } }
      ]}
    >
      {(removeColumn, { loading }) => (
        <Draggable draggableId={columnID} index={index}>
          {({ draggableProps, dragHandleProps, innerRef }) => (
            <div
              className="column"
              {...draggableProps}
              {...dragHandleProps}
              ref={innerRef}
            >
              <div className="column__inner">
                {title && (
                  <div className="column__title-wraper">
                    <div className="column__title">{title}</div>
                    <RemoveButton
                      loading={loading}
                      onClick={() => onRemoveColumn(columnID, removeColumn)}
                    />
                  </div>
                )}
                <Droppable droppableId={columnID}>
                  {(
                    { innerRef, droppableProps, placeholder },
                    { isDraggingOver }
                  ) => (
                    <div
                      className={
                        isDraggingOver
                          ? "column__items column__items__dragging"
                          : "column__items"
                      }
                      ref={innerRef}
                      {...droppableProps}
                    >
                      {cards.map(({ id, ...args }, index) => (
                        <Card
                          key={id}
                          columnID={columnID}
                          cardID={id}
                          index={index}
                          {...args}
                        />
                      ))}
                      {placeholder}
                    </div>
                  )}
                </Droppable>

                <AddNewForm isEmptyColumn={false} columnID={columnID} />
              </div>
            </div>
          )}
        </Draggable>
      )}
    </Mutation>
  ) : (
    <div className="column">
      <AddNewForm isEmptyColumn={true} columnID={columnID} />
    </div>
  );
};
