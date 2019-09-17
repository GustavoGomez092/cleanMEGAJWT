import { ApolloError } from 'apollo-server-express'
import utils from '../utils'
import { Check } from 'check-tfm'

const { authPW, registerJWT, hashPW, jwtCheckExpiration } = utils

// Random String generator

export default {
  Query: {
    me: async (root, args, { User, token: { payload, error } }, info) => {
      try {
        // Check if the authorization header was received
        if (!payload) { throw new Error(error) }
        // If there is a payload ensure that there is a user with the payload
        let requester = await User.model.findById(payload.id)
        // Return an error if no user found with that id
        if (!requester) { throw new Error('User not found') }
        return requester
      } catch (e) {
        throw new ApolloError(e.message)
      }
    },
    tokenRevision: async (root, args, { User, token: { payload, error }, tokenString }, info) => {
      try {
        // Check if the authorization header was received
        if (!payload) { throw new Error(error) }
        // If there is a payload ensure that there is a user with the payload
        let requester = await User.model.findById(payload.id)
        // Return an error if no user found with that id
        if (!requester) { throw new Error('Invalid payload') }

        let check = jwtCheckExpiration(payload)
        if (check) {
          return await registerJWT({ id: requester._id })
        } else { return tokenString.split(' ')[1] }
      } catch (e) {
        throw new ApolloError(e.message)
      }
    }
  },
  Mutation: {
    createUser: async (root, args, { User, token: { payload, error } }, info) => {
      try {
        // Check if there is any user within the database
        let usersCount = await User.model.estimatedDocumentCount()

        // If user exists then validate
        if (usersCount) {
          // Check if the authorization header was received
          if (!payload) { throw new Error(error) }

          // If there is a payload ensure that there is a user with the payload
          let requester = await User.model.findById(payload.id)

          // Return an error if no user found with that id
          if (!requester) { throw new Error('Invalid payload') }

          // If user found proceed to verify that the user is an admin
          let { response } = Check.that(requester.role).is('admin')

          // If the user does not meet the minimum requirements return error
          if (!response) { throw new Error('Insufficient permissions for this request') }

          // Check if a user has already been created with that id
          let user = await User.model.findOne({ email: args.email })

          if (user) { throw new Error('Email address already enrolled') }
        }

        // Check that the data received complies with the user model
        let validation = User.validation.validate(args)

        // If there are any errors return them
        if (validation.error) { throw new Error(validation.error) }

        // IF no error proceed to hash the password
        let hashedPW = await hashPW(args.password)

        // If the user meets the above criteria proceed to create user
        let newUser = new User.model({
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          password: hashedPW,
          role: args.role ? args.role : 'user'
        })


        // save and return the user
        return newUser.save()
      } catch (e) {
        throw new ApolloError(e.message)
      }
    },
    login: async (root, { email, password }, { User }, info) => {
      try {
        // Check if the user exists
        let user = await User.model.findOne({ email })

        // If no user return error
        if (!user) { throw new Error('Email or Password incorrect') }

        // If the user was found ensure that the password matches the hash
        let matchedPW = await authPW(password, user.password)

        // If password doesnt match return error
        if (!matchedPW) { throw new Error('Email or password incorrect') }

        // If the password match then preoceed to create and return the token
        return registerJWT({ id: user.id })
      } catch (e) {
        throw new ApolloError(e.message)
      }
    }
  }
}
