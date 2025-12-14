const { gql } = require('graphql-tag');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    pushToken: String
    createdAt: String
  }

  type Product {
    id: ID!
    name: String!
    originalPrice: Float!
    discountPrice: Float!
    discountPercentage: Int!
    supermarketId: String!
    image: String
    createdAt: String
    updatedAt: String
  }

  type Supermarket {
    id: ID!
    name: String!
    address: String
    description: String
    latitude: Float!
    longitude: Float!
    color: String
    createdAt: String
    updatedAt: String
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  input ProductInput {
    name: String!
    originalPrice: Float!
    discountPrice: Float!
    discountPercentage: Int!
    supermarketId: String!
    image: String
  }

  input SupermarketInput {
    name: String!
    address: String
    description: String
    latitude: Float!
    longitude: Float!
    color: String
  }

  input UserInput {
    firebaseUid: String!
    email: String!
    name: String!
  }

  type Query {
    me: User
    products: [Product!]!
    product(id: ID!): Product
    supermarkets: [Supermarket!]!
    supermarket(id: ID!): Supermarket
  }

  type Mutation {
    login(email: String!, password: String!): AuthResponse!
    register(name: String!, email: String!, password: String!): AuthResponse!
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
    createSupermarket(input: SupermarketInput!): Supermarket!
    updateSupermarket(id: ID!, input: SupermarketInput!): Supermarket!
    deleteSupermarket(id: ID!): Boolean!
    updatePushToken(pushToken: String!): User!
    createOrUpdateUser(input: UserInput!): User!
  }
`;

module.exports = typeDefs;

