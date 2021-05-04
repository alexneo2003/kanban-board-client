/* eslint-disable react/jsx-props-no-spreading */
import './style.scss';

import React, { useContext, useEffect, useRef, useState } from 'react';

import { EDIT_TITLE_MUTATION } from '../../helpers/mutations';
import context from '../../context';
import { setNewEditTitle } from '../../reducer/actions';
import { useMutation } from '@apollo/client';

const EditableTitle = React.forwardRef(function EditableTitle(
  { title, isVisible, sourceID, cardPosition, parrent, ...restProps },
  ref
) {
  const [value, setValue] = useState(title);
  const { state, dispatch } = useContext(context);
  const { editableTitle } = state || {};
  const [editTitle] = useMutation(EDIT_TITLE_MUTATION);

  const inputValueRef = useRef(value);

  useEffect(() => {
    ref.current.focus();
    ref.current.selectionStart = ref.current.value.length;
    ref.current.selectionEnd = ref.current.value.length;
  }, [isVisible]);

  useEffect(() => {
    inputValueRef.current = value;
  }, [value]);

  useEffect(() => {
    function editTitleMutation(newTitle, ID, type) {
      dispatch(setNewEditTitle(newTitle, ID, type));
      setTimeout(() => {
        editTitle({
          variables: {
            title: newTitle,
            sourceID: ID,
            sourceType: type,
          },
        });
      }, 150);
    }

    return () => {
      console.log('unMoumt');
      // console.log('title', title);
      // console.log('debouncedValue', debouncedValue);
      // console.log('inputValueRef', inputValueRef);
      // console.log('title !== debouncedValue', title !== debouncedValue);
      if (title !== inputValueRef.current) {
        editTitleMutation(
          inputValueRef.current,
          editableTitle.sourceID,
          editableTitle.sourceType
        );
      }
    };
  }, [inputValueRef]);

  const onInputChange = (e) => {
    setValue(e.target.value);
  };

  console.log('...restProps.style', restProps.style);

  if (parrent === 'CARD' || parrent === 'BOARD') {
    return (
      <div
        style={{
          background: 'rgba(0,0,0,.6)',
          color: '#fff',
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 10,
        }}>
        <textarea
          {...restProps}
          style={{
            top: cardPosition.top,
            left: cardPosition.left,
            height: cardPosition.height,
            width: cardPosition.width,
            ...restProps.style,
          }}
          className="edit-title-input edit-title-input__text"
          ref={ref}
          type="text"
          value={value}
          onChange={onInputChange}
          onBlur={(e) => console.log(e.target.value)}
        />
      </div>
    );
  }

  return (
    <textarea
      className="edit-title-input edit-title-input__text"
      ref={ref}
      type="text"
      value={value}
      onChange={onInputChange}
      onBlur={(e) => console.log(e.target.value)}
      {...restProps}
    />
  );
});

export default EditableTitle;
