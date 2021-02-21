import { gql } from '@apollo/client';

export const ADD_COLUMN_MUTATION = gql`
  mutation AddColumn($boardID: String!, $title: String!) {
    addColumn(boardID: $boardID, title: $title) {
      success
      message
    }
  }
`;

export const ADD_CARD_MUTATION = gql`
  mutation AddCard(
    $boardID: String!
    $columnID: String!
    $cardInput: CardInput!
  ) {
    addCard(boardID: $boardID, columnID: $columnID, cardInput: $cardInput) {
      success
      message
    }
  }
`;

export const ADD_BOARD_MUTATION = gql`
  mutation AddBoard($title: String!) {
    addBoard(title: $title) {
      success
      message
    }
  }
`;

export const REMOVE_BOARD_MUTATION = gql`
  mutation RemoveBoard($boardID: String!) {
    removeBoard(boardID: $boardID) {
      success
      message
    }
  }
`;

export const REMOVE_COLUMN_MUTATION = gql`
  mutation RemoveColumn($boardID: String!, $columnID: String!) {
    removeColumn(boardID: $boardID, columnID: $columnID) {
      success
      message
    }
  }
`;

export const REMOVE_CARD_MUTATION = gql`
  mutation RemoveCard($columnId: String!, $cardId: String!) {
    removeCard(columnId: $columnId, cardId: $cardId) {
      success
      message
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
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

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const REORDER_COLUMN_MUTATION = gql`
  mutation ReorderColumn(
    $boardID: String!
    $columnID: String!
    $source: Int!
    $destination: Int!
  ) {
    reorderColumn(
      boardID: $boardID
      columnID: $columnID
      source: $source
      destination: $destination
    ) {
      success
      message
    }
  }
`;

export const REORDER_CARD_MUTATION = gql`
  mutation ReorderCard(
    $cardID: String!
    $sourceColumnID: String!
    $destinationColumnID: String!
    $sourcePosition: Int!
    $destinationPosition: Int!
  ) {
    reorderCard(
      cardID: $cardID
      sourceColumnID: $sourceColumnID
      destinationColumnID: $destinationColumnID
      sourcePosition: $sourcePosition
      destinationPosition: $destinationPosition
    ) {
      success
      message
    }
  }
`;
