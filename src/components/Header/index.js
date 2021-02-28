import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../../images/kanban_logo.svg';
import Context from '../../context';
import Avatar from '../Avatar';

import './header.scss';
import { setCurrentBoard } from '../../reducer/actions';

const Header = () => {
  const { dispatch, state } = useContext(Context) || {};
  const { owner, currentBoard } = state || {};

  return (
    <header className="header">
      <div className="header__wrapper">
        <Link
          to="/"
          className="header__wrapper"
          onClick={() => dispatch(setCurrentBoard(''))}>
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
