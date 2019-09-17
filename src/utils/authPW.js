import bcrypt from 'bcryptjs'

export default async (pw, hash) => {
  return new Promise((resolve, reject) => {
    try {
      bcrypt.compare(pw, hash).then((res) => {
        resolve(res)
      })
    } catch (e) {
      reject(e)
    }
  })
}
