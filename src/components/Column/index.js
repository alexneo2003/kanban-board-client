/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import RemoveButton from '../RemoveButton';

import Card from '../Card';
import AddNewForm from '../AddNewForm';
import './column.scss';

const Column = ({ columnID, title, cards, index }) => {
  if (cards) {
    return (
      <Draggable draggableId={columnID} index={index}>
        {({ draggableProps, dragHandleProps, innerRef }) => (
          <div
            className="column"
            {...draggableProps}
            {...dragHandleProps}
            ref={innerRef}>
            <div className="column__inner">
              {title && (
                <div className="column__title-wraper">
                  <div className="column__title">{title}</div>
                  <RemoveButton columnID={columnID} buttonType="column" />
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
                        ? 'column__items column__items__dragging'
                        : 'column__items'
                    }
                    ref={innerRef}
                    {...droppableProps}>
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
    );
  }
  return (
    <div className="column">
      <AddNewForm isEmptyColumn columnID={columnID} />
    </div>
  );
};

export default Column;
