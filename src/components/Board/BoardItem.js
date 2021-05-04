/* eslint-disable react/jsx-props-no-spreading */
import './boards-list.scss';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { onEditTitle, setCurrentBoard } from '../../reducer/actions';

import AddNewForm from '../AddNewForm';
import EditableTitle from '../EditableTitle';
import Layout from '../Layout';
import { Link } from 'react-router-dom';
import RemoveButton from '../RemoveButton';
import context from '../../context';
import useVisible from '../../helpers/useVisible';

const BoardItem = ({ title, boardID }) => {
  const { state, dispatch } = useContext(context);
  const { editableTitle } = state || {};
  const { ref, isVisible, setIsVisible } = useVisible(false);
  const [cardPosition, setCardPosition] = useState(null);
  const spanRef = useRef(null);

  useEffect(() => {
    const handleSpan = (el) => {
      if (!el) return;
      setCardPosition({
        top: el.current.getBoundingClientRect().top - 12,
        left: el.current.getBoundingClientRect().left - 11,
        height: 112,
        width: 150,
      });
    };

    handleSpan(spanRef);
  }, [spanRef]);

  const onTitleClickHandler = (boardID) => {
    dispatch(onEditTitle(boardID, 'BOARD'));
    setIsVisible(!isVisible);
  };

  return (
    <div className="board_wrapper">
      <Link
        to={`/board/${boardID}`}
        onClick={() => dispatch(setCurrentBoard({ id: boardID, title }))}>
        <div className="boards-list__item">
          <span ref={spanRef} className="board__item__title">
            {title}
          </span>
        </div>
      </Link>
      <button
        className="board_title__edit"
        onClick={() => onTitleClickHandler(boardID)}>
        <i className="far fa-edit" />
      </button>
      {editableTitle && editableTitle.sourceID === boardID && isVisible && (
        <EditableTitle
          parrent="BOARD"
          title={title}
          ref={ref}
          isVisible={isVisible}
          sourceID={boardID}
          cardPosition={cardPosition}
          maxLength={75}
          style={{
            fontWeight: 'bold',
            padding: '8px 2px 6px 7px',
          }}
        />
      )}
      <RemoveButton
        buttonType="board"
        style={{ right: 12 }}
        boardID={boardID}
      />
    </div>
  );
};

export default BoardItem;
