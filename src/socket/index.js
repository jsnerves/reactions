import * as socketEvents from '../constants/socket-events'
import * as actions from '../actions'

export default (socket, store) => {

  socket.on('connect', () => {
    console.log('connect', socket.id)
    store.dispatch(actions.getRoomData())
    store.dispatch(actions.joinRoom())
  })

  socket.on(socketEvents.GET_ROOM_DATA_SUCCESS, data => {
    store.dispatch(actions.getRoomDataSuccess(data))
  })

  socket.on(socketEvents.GET_ROOM_DATA_FAILURE, data => {
    store.dispatch(actions.getRoomDataFailure(data))
  })
  
  socket.on(socketEvents.JOIN_ROOM_SUCCESS, data => {
    store.dispatch(actions.joinRoomSuccess(data))
  })

  socket.on(socketEvents.JOIN_ROOM_FAILURE, data => {
    store.dispatch(actions.joinRoomFailure(data))
  })

  socket.on(socketEvents.LEAVE_ROOM_SUCCESS, data => {
    store.dispatch(actions.leaveRoomSuccess(data))
  })
  
  socket.on(socketEvents.REACT_SUCCESS, data => {
    store.dispatch(actions.reactSuccess(data))
  })
  
  socket.on('reconnect', () => {
    console.log('reconnect')
  })
  
  socket.on('disconnect', () => {
    console.log('disconnect')
  })
  
  socket.on('error', err => {
    console.log('ERROR', err)
  })
}



