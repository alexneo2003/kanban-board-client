import React, { useState } from 'react';
// import avatarsList from './avatars.json';
import { ReactComponent as AvatarImg } from '../../images/avatars/001-man-13.svg';
import PopUp from './PopUp';

import './avatar.scss';

const Avatar = () => {
  const [isPopUpShow, togglePopup] = useState(false);
  return (
    <>
      <button
        className="avatar__wrapper"
        onClick={() => togglePopup(!isPopUpShow)}>
        <AvatarImg className="avatar" />
      </button>
      {isPopUpShow && <PopUp />}
    </>
  );
};

export default Avatar;
