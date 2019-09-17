import { gql } from 'apollo-server-express'

export default gql`
  """
    The address type contains the users physical address information, including a reference to the user
  """
  type Address {
    id: ID!
    title: String!
    addressLine1: String!
    addressLine2: String
    zip: Int
    city: String!
    state: String
    country: String!
    province: String
    owner: User
  }

`
