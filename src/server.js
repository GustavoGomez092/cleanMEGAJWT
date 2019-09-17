import '@babel/polyfill'
import { ApolloServer, ApolloError } from 'apollo-server-express'
import express from 'express'
import { config } from 'dotenv'
import resolvers from './resolvers'
import typeDefs from './typeDefs'
import mongoose from 'mongoose'
import models from './models'
import { createServer } from 'http'
import enforce from 'express-sslify'
import helmet from 'helmet'
import Utils from './utils'

const { jwtAuth } = Utils;

(async () => {
  try {
    config()
    // Import env variables
    const {
      PORT,
      NODE_ENV,
      DB_URI,
      DB_PASS,
      DB_USER,
      DB_URI_DEV,
      DB_PASS_DEV,
      DB_USER_DEV
    } = process.env

    const app = express()

    // Enable Protection headers
    if (NODE_ENV === 'production') {
      app.use(enforce.HTTPS({ trustProtoHeader: true }))
      try {
        app.use(helmet())
      } catch (error) {
        console.log(error)
      }
      app.disable('x-powered-by')
    }

    // USE DEVELOPMENT CREDENTIALS WHILE IN DEVELOPMENT
    let USER, PASSWORD, URI

    if (NODE_ENV === 'development') {
      USER = DB_USER_DEV
      PASSWORD = DB_PASS_DEV
      URI = DB_URI_DEV
    } else {
      USER = DB_USER
      PASSWORD = DB_PASS
      URI = DB_URI
    }

    await mongoose.connect(
      `mongodb+srv://${USER}:${PASSWORD}@${URI}`,
      {
        reconnectTries: 100,
        reconnectInterval: 500,
        autoReconnect: true,
        useNewUrlParser: true,
        dbName: 'DebtManagerDB',
        useUnifiedTopology: true
      }
    )

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      playground: NODE_ENV !== 'production',
      context: async ({ req, connection }) => {
        if (connection) {
          return connection.context
        } else if (req) {
          const token = await jwtAuth(req.headers.authorization)
          const tokenString = req.headers.authorization
          return {
            ...models,
            token,
            tokenString
          }
        }
      },
      formatError: (error) => {
        console.log(error)
        if (error.originalError instanceof ApolloError) {
          return error
        }
        throw new ApolloError(`${error}`)
      },
      debug: NODE_ENV !== 'production'
    })

    server.applyMiddleware({ app })

    const httpServer = createServer(app)
    server.installSubscriptionHandlers(httpServer)

    httpServer.listen({ port: PORT }, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
      console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
    })
  } catch (e) {
    console.log(e)
    throw new Error(`Internal Server error: ${e.message}`)
  }
})()
