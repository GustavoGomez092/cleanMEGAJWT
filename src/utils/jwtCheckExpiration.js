import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

config()
const { CLOSE_TO_EXPIRE, TOKEN_EXPIRES } = process.env

export default (decodedToken) => {
  try {
    let expiryTime = decodedToken.exp
    let currentTime = Date.now() / 1000
    let closeToExpire = ((expiryTime - currentTime) / 60 < CLOSE_TO_EXPIRE)
    if (TOKEN_EXPIRES) {
      if (closeToExpire) {
        return true
      }
      return false
    } else {
      return false
    }

  } catch (e) {
    return false
  }
}
