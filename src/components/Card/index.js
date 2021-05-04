import './card.scss';

/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useEffect, useRef, useState } from 'react';

import { Draggable } from 'react-beautiful-dnd';
import EditableTitle from '../EditableTitle';
import RemoveButton from '../RemoveButton';
import context from '../../context';
import { onEditTitle } from '../../reducer/actions';
import useVisible from '../../helpers/useVisible';

const Card = ({ columnID, cardID, title, index, isEditableTitle }) => {
  const { state, dispatch } = useContext(context);
  const { ref, isVisible, setIsVisible } = useVisible(false);
  const [cardPosition, setCardPosition] = useState(null);

  const spanRef = useRef(null);

  useEffect(() => {
    const handleSpan = (el) => {
      if (!el) return;
      setCardPosition({
        top: el.current.getBoundingClientRect().top - 14,
        left: el.current.getBoundingClientRect().left - 11,
        height: el.current.getBoundingClientRect().height + 18 + 37,
      });
    };

    handleSpan(spanRef);
  }, [spanRef]);

  const buttonize = (handlerFn) => {
    return {
      role: 'button',
      onClick: handlerFn,
      onKeyDown: (event) => {
        if (event.keycode === 13) handlerFn(event);
      },
    };
  };

  const onTitleClickHandler = () => {
    dispatch(onEditTitle(cardID, 'CARD'));
    setIsVisible(!isVisible);
  };

  return (
    <Draggable draggableId={cardID} index={index}>
      {({ draggableProps, dragHandleProps, innerRef }, { isDragging }) => (
        <div
          className={isDragging ? 'card card__dragging' : 'card'}
          {...draggableProps}
          {...dragHandleProps}
          ref={innerRef}>
          <span
            ref={spanRef}
            className="card__text"
            style={{ cursor: 'text' }}
            {...buttonize(onTitleClickHandler)}>
            {title}
          </span>
          {isEditableTitle &&
            isEditableTitle.sourceID === cardID &&
            isVisible && (
              <EditableTitle
                parrent="CARD"
                title={title}
                ref={ref}
                isVisible={isVisible}
                sourceID={cardID}
                cardPosition={cardPosition}
              />
            )}
          <RemoveButton columnID={columnID} cardID={cardID} buttonType="card" />
        </div>
      )}
    </Draggable>
  );
};

export default Card;
