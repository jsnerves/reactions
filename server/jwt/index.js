import jwt from 'jsonwebtoken'

export const createToken = (data, secret, expDays=1) => {
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (expDays * 24 * 60 * 60),
    data
  }, secret)
}

export const validateToken = (token, secret) => {
  return jwt.verify(token, secret)
}