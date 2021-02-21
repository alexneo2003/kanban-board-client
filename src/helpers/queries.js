import { gql } from '@apollo/client';

export const COLUMNS_QUERY = gql`
  query Columns($boardID: String!) {
    getColumns(boardID: $boardID) {
      success
      message
      columns {
        id
        title
        cards {
          id
          title
        }
      }
    }
    getBoardById(id: $boardID) {
      success
      message
      board {
        id
        title
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      success
      message
      user {
        name
        email
        id
      }
    }
  }
`;

export const BOARDS_QUERY = gql`
  query Boards {
    getBoards {
      success
      message
      boards {
        id
        title
      }
    }
  }
`;
