const { gql } = require('graphql-tag');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    role: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    addUser(name: String!, role: String!): User!
  }
`;
