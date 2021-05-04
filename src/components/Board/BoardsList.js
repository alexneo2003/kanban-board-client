/* eslint-disable react/jsx-props-no-spreading */
import './boards-list.scss';

import AddNewForm from '../AddNewForm';
import BoardItem from './BoardItem';
import Layout from '../Layout';
import React from 'react';

const BoardsList = React.memo(function BoardsList({ boards }) {
  return (
    <Layout>
      <div className="boards-list">
        <div className="container boards-list__container">
          <div className="row">
            {boards.map(({ id, title }) => (
              <div
                className="col-xs-12 col-sm-4 col-md-4 col-lg-3 col-xl-3"
                key={id}>
                <BoardItem title={title} boardID={id} />
              </div>
            ))}
            <div className=" col-xs-12 col-sm-4 col-md-4 col-lg-3 col-xl-3">
              <AddNewForm isBoardForm style={{ margin: 0 }} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
});

export default BoardsList;
