import { gql } from 'apollo-server-express'

export default gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    middleName: String
    email: String!
    password: String!
    role: String!
    firstLogin: Boolean!
  }

extend type Query {
  me: User!
  tokenRevision: String!
}
  extend type Mutation {
    createUser (
      email: String!
      firstName: String!
      lastName: String!
      password: String!
      role: String
    ): User
    login (
      email: String!
      password: String!
    ): String
  }

`
