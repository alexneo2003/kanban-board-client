import { gql } from "apollo-boost";

export const COLUMNS_QUERY = gql`
  query Columns($boardID: String!) {
    columns(boardID: $boardID) {
      id
      title
      cards {
        id
        title
      }
    }
    boardById(id: $boardID) {
      id
      title
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      name
      email
      id
    }
  }
`;

export const BOARDS_QUERY = gql`
  query Boards {
    boards {
      id
      title
    }
  }
`;
