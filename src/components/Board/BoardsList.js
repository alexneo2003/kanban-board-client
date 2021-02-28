import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Context from '../../context';
import RemoveButton from '../RemoveButton';
import AddNewForm from '../AddNewForm';

import './boards-list.scss';
import Layout from '../Layout';
import { setCurrentBoard } from '../../reducer/actions';

const BoardsList = React.memo(function BoardsList({ boards }) {
  const { dispatch } = useContext(Context);

  const BoardItem = ({ title, boardID }) => (
    <div style={{ position: 'relative' }}>
      <Link
        to={`/board/${boardID}`}
        onClick={() => dispatch(setCurrentBoard({ id: boardID, title }))}>
        <div className="boards-list__item">
          <span className="board__item__title">{title}</span>
        </div>
      </Link>
      <RemoveButton
        buttonType="board"
        style={{ right: 12 }}
        boardID={boardID}
      />
    </div>
  );

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
