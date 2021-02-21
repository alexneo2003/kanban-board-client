import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../../images/kanban_logo.svg';
import Context from '../../context';
import Avatar from '../Avatar';

import './header.scss';

const Header = () => {
  const { owner, currentBoard, setCurrentBoard } = useContext(Context);

  return (
    <header className="header">
      <div className="header__wrapper">
        <Link
          to="/"
          className="header__wrapper"
          onClick={() => setCurrentBoard('')}>
          <Logo className="header__logo" />
          <span className="header__owner">{owner}</span>
        </Link>
        {currentBoard.title && (
          <pre className="header__breadcrumb">{` / ${currentBoard.title}`}</pre>
        )}
        <Avatar />
      </div>
    </header>
  );
};
export default Header;
