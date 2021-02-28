import React, { useContext, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import BigLoader from '../Loader/BigLoader';
import { BOARDS_QUERY, ME_QUERY } from '../../helpers/queries';
import BoardsList from '../Board/BoardsList';

import './main-screen.scss';
import context from '../../context';
import LoginScreen from '../LoginScreen';
import { setBoards, setOwner } from '../../reducer/actions';

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
