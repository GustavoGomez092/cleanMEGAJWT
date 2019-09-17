import bcrypt from 'bcryptjs'

export default (pw) => new Promise((resolve, reject) => {
  bcrypt.hash(pw, 10, (e, hash) => {
    if (e) { reject(e) }
    resolve(hash)
  })
})
