import './column.scss';

import { Draggable, Droppable } from 'react-beautiful-dnd';
/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';

import AddNewForm from '../AddNewForm';
import Card from '../Card';
import EditableTitle from '../EditableTitle';
import RemoveButton from '../RemoveButton';
import context from '../../context';
import { onEditTitle } from '../../reducer/actions';
import useVisible from '../../helpers/useVisible';

const Column = ({ columnID, title, cards, index }) => {
  const { state, dispatch } = useContext(context);
  const { editableTitle } = state || {};
  const { ref, isVisible, setIsVisible } = useVisible(false);

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
    dispatch(onEditTitle(columnID, 'COLUMN'));
    setIsVisible(!isVisible);
  };

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
                  {editableTitle &&
                  editableTitle.sourceID === columnID &&
                  isVisible ? (
                    <EditableTitle
                      parrent="COLUMN"
                      title={title}
                      ref={ref}
                      isVisible={isVisible}
                      sourceID={columnID}
                      style={{
                        margin: 6,
                        padding: '7px 2px 6px 6px',
                        fontWeight: 'bold',
                        backgroundColor: 'white',
                        boxShadow: 'inset 0 0 0 2px #0079bf',
                      }}
                    />
                  ) : (
                    <>
                      <div
                        className="column__title"
                        style={{ cursor: 'text' }}
                        {...buttonize(onTitleClickHandler)}>
                        {title}
                      </div>
                      <RemoveButton columnID={columnID} buttonType="column" />
                    </>
                  )}
                </div>
              )}
              <Droppable droppableId={columnID}>
                {(
                  { innerRef: cardInnerRef, droppableProps, placeholder },
                  { isDraggingOver }
                ) => (
                  <div
                    className={
                      isDraggingOver
                        ? 'column__items column__items__dragging'
                        : 'column__items'
                    }
                    ref={cardInnerRef}
                    {...droppableProps}>
                    {cards.map(({ id, ...args }, i) => (
                      <Card
                        isEditableTitle={editableTitle}
                        key={id}
                        columnID={columnID}
                        cardID={id}
                        index={i}
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
