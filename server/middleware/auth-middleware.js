import cookie from 'cookie'

import { validateToken } from '../jwt'
import createError from '../errors'

// checks if token for specific room is valid
// so roomId should be passed with request
// adds authData { roomId, userId } to the res object (socket object)

const authErr = createError('Authentication error', 401)

export const expressAuthMiddleware = secret => (req, res, next) => {
  const { roomId } = req.params // roomId passed as params
  const token = req.cookies[roomId] // token for specific room
  const userId = req.cookies.userId
  let tokenObj

  try {
    tokenObj = validateToken(token, secret)
  } catch (err) {
    return next(authErr)
  }

  req.authData = { ...tokenObj.data, userId }
  next()
}

export const socketAuthMiddleware = secret => (socket, next) => {
  const { roomId } = socket.handshake.query // roomId passed in query
  const parsedCookies = cookie.parse(socket.handshake.headers.cookie)
  const token = parsedCookies[roomId] // token for specific room
  const userId = parsedCookies.userId
  let tokenObj
  try {
    tokenObj = validateToken(token, secret)
  } catch (err) {
    return next(authErr)
  }

  socket.authData = { ...tokenObj.data, userId }
  next()
}