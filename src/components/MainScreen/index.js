import './main-screen.scss';

import { BOARDS_QUERY, ME_QUERY } from '../../helpers/queries';
import React, { useContext, useEffect } from 'react';
import { setBoards, setOwner } from '../../reducer/actions';

import BigLoader from '../Loader/BigLoader';
import BoardsList from '../Board/BoardsList';
import LoginScreen from '../LoginScreen';
import context from '../../context';
import { useQuery } from '@apollo/client';

const MainScreen = React.memo(function MainScreen() {
  const { dispatch, state } = useContext(context);
  const { data: userData, loadingMe } = useQuery(ME_QUERY);
  const { data: boardsData, loading, error } = useQuery(BOARDS_QUERY);

  const { owner, boards } = state || {};

  useEffect(() => {
    if (userData) {
      if (userData.me.success) {
        dispatch(setOwner(userData.me.user.name));
      } else {
        dispatch(setOwner(undefined));
      }
    }
  }, [userData]);

  useEffect(() => {
    if (!loading && boardsData) {
      if (boardsData.getBoards.success) {
        dispatch(setBoards(boardsData.getBoards.boards));
      }
    }
  }, [boardsData]);

  if (loadingMe || loading) return <BigLoader />;
  if (error) return <div>Error :(</div>;

  if (!owner) {
    return <LoginScreen />;
  }

  return (
    <main className="main-screen">
      {boards && <BoardsList boards={boards} />}
    </main>
  );
});

export default MainScreen;
