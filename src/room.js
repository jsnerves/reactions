import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import RoomContainer from './containers/RoomContainer'
import io from 'socket.io-client'


import './styles/main.scss'
import initSocketHandlers from './socket'
import initStore from './store'

const SOCKET_SERVER = window.__SOCKET_SERVER || '127.0.0.1:3000'
const urlSplit = window.location.href.split('/')
const roomId = urlSplit[urlSplit.length - 1]

// every socket request will have roomId
// that we are in
const socket = io(SOCKET_SERVER, {
  query: { roomId }
})

// init store
// socket will be passed to socket middleware to emit events
const store = initStore(socket)

// init socket handlers
// store is needed to dispatch events 
initSocketHandlers(socket, store)

render(
  <Provider store={store}>
    <RoomContainer />
  </Provider>,
  document.getElementById('root')
)