import React from "react";

import gql from "graphql-tag";
import { Query } from "react-apollo";
const QUERY_HELLO = gql`
  {
    hello
  }
`;

export default () => (
  <Query query={QUERY_HELLO}>
    {({ loading, error, data }) => {
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error :(</div>;

      return <p>{data.hello}</p>;
    }}
  </Query>
);
