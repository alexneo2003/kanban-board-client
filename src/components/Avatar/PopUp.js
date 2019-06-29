import React from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";
import { LOGOUT_MUTATION } from "../../helpers/mutations";
import { ME_QUERY } from "../../helpers/queries";
import "./popup.scss";

export default withRouter(({ history }) => {
  const onHandleClick = (client, logout) => {
    logout();
    client.clearStore().then(() => {
      client.resetStore();
      history.push("/");
    });
  };
  return (
    <Mutation mutation={LOGOUT_MUTATION} refetchQueries={[{ query: ME_QUERY }]}>
      {(logout, { client }) => (
        <div className="avatar__popup">
          <ul>
            <li onClick={() => onHandleClick(client, logout)}>Logout</li>
          </ul>
        </div>
      )}
    </Mutation>
  );
});
