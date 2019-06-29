import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Mutation } from "react-apollo";
import Context from "../../context";
import RemoveButton from "../RemoveButton";
import AddNewForm from "../AddNewForm";
import { REMOVE_BOARD_MUTATION } from "../../helpers/mutations";
import { BOARDS_QUERY } from "../../helpers/queries";

import "./boards-list.scss";

const BoardsList = ({ boards }) => {
  const { setCurrentBoard } = useContext(Context);

  const onClickHandler = (id, removeBoard) => {
    if (global.confirm("Are you sure you want to remove the board?")) {
      removeBoard({ variables: { boardID: id } });
    }
  };

  const BoardItem = ({ title, boardID }) => (
    <div style={{ position: "relative" }}>
      <Link
        to={`/board/${boardID}`}
        onClick={() => setCurrentBoard({ id: boardID, title })}
      >
        <div className="boards-list__item">
          <span className="board__item__title">{title}</span>
        </div>
      </Link>

      <Mutation
        mutation={REMOVE_BOARD_MUTATION}
        refetchQueries={[{ query: BOARDS_QUERY }]}
      >
        {(removeBoard, { loading }) => (
          <RemoveButton
            style={{ right: 12 }}
            onClick={() => onClickHandler(boardID, removeBoard)}
            loading={loading}
          />
        )}
      </Mutation>
    </div>
  );

  return (
    <div className="boards-list">
      <div className="container boards-list__container">
        <div className="row">
          {boards.map(({ id, title }) => (
            <div
              className="col-xs-12 col-sm-4 col-md-4 col-lg-3 col-xl-3"
              key={id}
            >
              <BoardItem title={title} boardID={id} />
            </div>
          ))}
          <div className=" col-xs-12 col-sm-4 col-md-4 col-lg-3 col-xl-3">
            <AddNewForm isBoardForm={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardsList;
