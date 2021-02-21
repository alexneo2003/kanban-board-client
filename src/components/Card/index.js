/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import RemoveButton from '../RemoveButton';

import './card.scss';

const Card = ({ columnID, cardID, title, index }) => {
  return (
    <Draggable draggableId={cardID} index={index}>
      {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
        <div
          className={isDragging ? 'card card__dragging' : 'card'}
          {...draggableProps}
          {...dragHandleProps}
          ref={innerRef}>
          <span className="card__text">{title}</span>
          <RemoveButton columnID={columnID} cardID={cardID} buttonType="card" />
        </div>
      )}
    </Draggable>
  );
};

export default Card;
