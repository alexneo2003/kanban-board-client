import React from "react";
import { Query } from "react-apollo";
import BigLoader from "../Loader/BigLoader";
import { BOARDS_QUERY } from "../../helpers/queries";
import BoardsList from "../Board/BoardsList";

import "./main-screen.scss";

const MainScreen = () => (
  <main className="main-screen">
    <Query query={BOARDS_QUERY}>
      {({ data, loading, error }) => {
        if (loading) return <BigLoader />;
        if (error) return <div>Error :(</div>;
        return <BoardsList boards={data.boards} />;
      }}
    </Query>
  </main>
);

export default MainScreen;
