import JWT from 'jsonwebtoken'
import { config } from 'dotenv'

config()

const {
  JWT_SECRET
} = process.env

export default async (jwt) => {
  // Check if token received
  if (!jwt) {
    return {
      payload: null,
      error: 'Please provide an authorization header with a valid token'
    }
  }

  // Check if the token comes with the Bearer prefix
  if (!jwt.toLowerCase().includes('bearer')) {
    return {
      payload: null,
      error: 'Bearer prefix not included in the Authorization header'
    }
  }

  // If the bearer prefix is included proceed to decrypt
  return JWT.verify(jwt.split(' ')[1], JWT_SECRET, (error, decoded) => {
    // If the jwt cant verify return error
    if (error) {
      return {
        error: error.message,
        payload: null
      }
    }
    return {
      error: null,
      payload: decoded
    }
  })
}
