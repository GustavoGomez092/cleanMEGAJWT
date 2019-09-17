import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

config()

const { JWT_SECRET, JWT_EXPIRATION, TOKEN_EXPIRES } = process.env

export default (payload) => new Promise((resolve, reject) => {
  TOKEN_EXPIRES
  ? jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION }, (err, token) => {
      if (err) {
        reject(err)
      }
      resolve(token)
  })
  : jwt.sign(payload, JWT_SECRET, (err, token) => {
      if (err) {
        reject(err)
      }
      resolve(token)
  })
})
