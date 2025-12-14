import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      originalPrice
      discountPrice
      discountPercentage
      supermarketId
      image
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      id
      name
      originalPrice
      discountPrice
      discountPercentage
      supermarketId
      image
      createdAt
      updatedAt
    }
  }
`;

export const GET_SUPERMARKETS = gql`
  query GetSupermarkets {
    supermarkets {
      id
      name
      address
      description
      latitude
      longitude
      color
      createdAt
      updatedAt
    }
  }
`;

export const GET_SUPERMARKET_BY_ID = gql`
  query GetSupermarketById($id: ID!) {
    supermarket(id: $id) {
      id
      name
      address
      description
      latitude
      longitude
      color
      createdAt
      updatedAt
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      name
      email
      createdAt
    }
  }
`;
