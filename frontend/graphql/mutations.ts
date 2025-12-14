import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
      originalPrice
      discountPrice
      discountPercentage
      supermarketId
      image
      createdAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      originalPrice
      discountPrice
      discountPercentage
      supermarketId
      image
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const CREATE_SUPERMARKET = gql`
  mutation CreateSupermarket($input: SupermarketInput!) {
    createSupermarket(input: $input) {
      id
      name
      address
      description
      latitude
      longitude
      color
      createdAt
    }
  }
`;

export const UPDATE_SUPERMARKET = gql`
  mutation UpdateSupermarket($id: ID!, $input: SupermarketInput!) {
    updateSupermarket(id: $id, input: $input) {
      id
      name
      address
      description
      latitude
      longitude
      color
      updatedAt
    }
  }
`;

export const DELETE_SUPERMARKET = gql`
  mutation DeleteSupermarket($id: ID!) {
    deleteSupermarket(id: $id)
  }
`;

export const UPDATE_PUSH_TOKEN = gql`
  mutation UpdatePushToken($pushToken: String!) {
    updatePushToken(pushToken: $pushToken) {
      id
      name
      email
      pushToken
    }
  }
`;

export const CREATE_OR_UPDATE_USER = gql`
  mutation CreateOrUpdateUser($input: UserInput!) {
    createOrUpdateUser(input: $input) {
      id
      name
      email
      createdAt
    }
  }
`;
