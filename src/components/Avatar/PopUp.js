import React from 'react';
import { useMutation } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import { LOGOUT_MUTATION } from '../../helpers/mutations';
import { ME_QUERY } from '../../helpers/queries';

import MiniLoader from '../Loader/MiniLoader';
import './popup.scss';

export default withRouter(({ history }) => {
  const [logout, { loading }] = useMutation(LOGOUT_MUTATION);
  const onHandleClick = (logoutFn) => {
    logoutFn({
      refetchQueries: [{ query: ME_QUERY }],
    });
    history.push('/');
  };
  return (
    <button
      className="avatar__popup"
      onClick={() => onHandleClick(logout)}
      type="button">
      {loading ? <MiniLoader /> : <span>Logout</span>}
    </button>
  );
});
