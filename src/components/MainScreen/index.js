import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import BigLoader from '../Loader/BigLoader';
import { BOARDS_QUERY, ME_QUERY } from '../../helpers/queries';
import BoardsList from '../Board/BoardsList';

import './main-screen.scss';
import context from '../../context';
import LoginScreen from '../LoginScreen';
import Layout from '../Layout';

const MainScreen = () => {
  const { owner, setOwner } = useContext(context);
  const [boards, setBoards] = useState(undefined);
  const { data: userData, loadingMe } = useQuery(ME_QUERY);
  const { data: boardsData, loading, error } = useQuery(BOARDS_QUERY);

  useEffect(() => {
    if (userData) {
      if (userData.me.success) {
        setOwner(userData.me.user.name);
      } else {
        setOwner(undefined);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (!loading && boardsData) {
      setBoards(boardsData.getBoards.boards);
    }
  }, [boardsData]);

  if (loadingMe || loading) return <BigLoader />;
  if (error) return <div>Error :(</div>;

  if (!owner) {
    return <LoginScreen />;
  }

  return (
    <Layout>
      <main className="main-screen">
        {boards && <BoardsList boards={boards} />}
      </main>
    </Layout>
  );
};

export default MainScreen;
