import http from 'http'
import express from 'express'
import socketIO from 'socket.io'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import uuid from 'uuid/v4'
import path from 'path'
import fs from 'fs'
import mongoose from 'mongoose'

import * as socketEvents from './src/constants/socket-events'
import { createToken } from './server/jwt'
import { socketAuthMiddleware, expressAuthMiddleware } from './server/middleware/auth-middleware'
import Room from './server/models/Room'
import createError from './server/errors'
import template from './server/template'
import validate, { PATTERNS } from './server/validate'
import getIP from './get-ip'

const { HOST, PORT } = getIP()
const SECRET = 'secret'
const DB = 'mongodb://localhost/reactions'

// INIT APP
//=========
mongoose.connect(DB)
const app = express()
const server = http.Server(app)
const io = socketIO(server)

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(cookieParser())

// API
//=====
app.post('/api/create', (req, res, next) => {
  const { roomId, reactions, password } = req.body

  // validate roomId
  const roomIdValidation = validate(roomId, [
    { name: 'pattern', param: PATTERNS.word, message: 'Room name has invalid characters' },
    { name: 'minLength', param: 6, message: 'Room name is too short' }
  ])

  if(!roomIdValidation.valid) {
    return next(createError(roomIdValidation.message, 400, { type: 'name' }))
  }

  // validate password
  const passwordValidation = validate(password, [
    { name: 'minLength', param: 4, message: 'Password is too short' }
  ])

  if(!passwordValidation.valid) {
    return next(createError(passwordValidation.message, 400, { type: 'password' }))
  }

  // check is roomId already exists
  Room.findOne({ roomId }, (err, room) => {
    if(err) return next(createError())

    if(room) {
      return next(createError('This name is already taken', 409, { type: 'name' }))
    }

    // create new room and save it
    const newRoom = new Room({ roomId, reactions })
    newRoom.setPassword(password)

    newRoom.save((err) => {
      if(err) return next(createError())
      res.end()
    })
  })
})

app.post('/api/join', (req, res, next) => {
  const { roomId, password } = req.body

  // find room with this roomId
  Room.findOne({ roomId }, (err, room) => {

    if(err) return next(createError())

    // if no room with this roomId
    if(!room) {
      return next(createError('No room found', 401, { type: 'name'}))
    }

    // if password is NOT valid
    if(!room.isValidPassword(password)) {
      return next(createError('Wrong password', 401, { type: 'password'}))
    }

    // if cookie doesn't have userId create it
    // otherwise existing userId will be used as identifier
    if(!req.cookies.userId) {
      const userId = uuid()
      res.cookie('userId', userId)
    }

    // set cookie roomId=token
    const token = createToken({ roomId }, SECRET)
    res.cookie(roomId, token)

    // send redirect info
    res.send({ redirect: `/rooms/${roomId}` })
  })
})


// ROOTS
//=======
// use authentication
app.get('/rooms/:roomId', expressAuthMiddleware(SECRET), (req, res) => {
  res.send(template(
    fs.readFileSync(path.join(__dirname, 'public', 'room.html')).toString(),
    { socket: `${HOST}:${PORT}` }
  ))
})

app.get('/error', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'error.html'))
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// global error middleware
app.use((err, req, res, next) => {
  // UNCOUGHT ERRORS
  if(!err._custom) {
    console.log(err)
    return res.status(500).send('Something went wrong')
  }

  // CUSTOM ERRORS
  // detect ajax
  if(req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.status(err.code).send(err)
  } else {
    res.redirect('/error')
  }
})

// SOCKET
//=======
const STATE = {
  db: {},

  set(keys, value) {
    let target = this.db;
    const last =  keys.pop()

    for(let key of keys) {
      if(!target[key]) target[key] = {}
      target = target[key]
    }

    target[last] = value
  },

  get(keys) {
    let target = this.db

    for(let key of keys) {
      target = target[key]
    }

    return target
  },

  remove(keys, value) {
    let target = this.db;
    const last =  keys.pop()

    for(let key of keys) {
      if(!target[key]) target[key] = {}
      target = target[key]
    }

    delete target[last]
  },
}

// use authentication
io.use(socketAuthMiddleware(SECRET))

io.on('connection', socket => {
  const { roomId, userId } = socket.authData
  
  // GET ROOM DATA
  socket.on(socketEvents.GET_ROOM_DATA_REQUEST, () => {
    // if room is empty
    if(!STATE.get([roomId])) STATE.set([roomId], {})

    // get room reactions list
    Room.findOne({ roomId }, (err, room) => {
      
      // emit success event
      socket.emit(socketEvents.GET_ROOM_DATA_SUCCESS, {
        audience: STATE.get([roomId]),
        reactions: room.reactions
      })
    })
  })

  // JOIN ROOM
  socket.on(socketEvents.JOIN_ROOM_REQUEST, () => {
    // join the room
    socket.join(roomId, err => {
      // emit error event
      if(err) return socket.emit(socketEvents.JOIN_ROOM_FAILURE)

      // add user to state
      STATE.set([roomId, userId], null)

      // let user know his reaction
      // isOwn flag is needed
      socket.emit(socketEvents.JOIN_ROOM_SUCCESS, { userId, isOwn: true })

      // let other clients in the room know that user joined the room
      socket.to(roomId).emit(socketEvents.JOIN_ROOM_SUCCESS, { userId })
    })
  })

  // REACT
  socket.on(socketEvents.REACT_REQUEST, ({ reactionId }) => {
    // set reaction to the state
    STATE.set([roomId, userId], reactionId)

    // let user know his reaction
    // isOwn flag is needed
    socket.emit(socketEvents.REACT_SUCCESS, { userId, reactionId, isOwn: true })

    // let other client know user's reaction
    socket.to(roomId).emit(socketEvents.REACT_SUCCESS, { userId, reactionId })
  })

  socket.on('disconnect', () => {
    // remove from state
    STATE.remove([roomId, userId])

    socket.leave(roomId, err => {
      // let other clients in the room know that user leave the room
      io.to(roomId).emit(socketEvents.LEAVE_ROOM_SUCCESS, { userId })
    })
  })

})


// RUN SERVER
//============
server.listen(PORT, HOST, () => {
  console.log(`\n\n\nServer is running on http://${HOST}:${PORT}`)
})
