import * as actionsTypes from '../constants/actions-types'
import * as socketEvents from '../constants/socket-events'

export const getRoomDataRequest = () => ({ type: actionsTypes.GET_ROOM_DATA_REQUEST })
export const getRoomDataSuccess = data => ({ type: actionsTypes.GET_ROOM_DATA_SUCCESS, data })
export const getRoomDataFailure = () => ({ type: actionsTypes.GET_ROOM_DATA_FAILURE })

export const getRoomData = () => ({
  type: 'SOCKET_MIDDLEWARE',
  _SOCKET: true,
  event: socketEvents.GET_ROOM_DATA_REQUEST,
  afterEmit: getRoomDataRequest
})

export const joinRoomRequest = () => ({ type: actionsTypes.JOIN_ROOM_REQUEST })
export const joinRoomSuccess = data => ({ type: actionsTypes.JOIN_ROOM_SUCCESS, data })
export const joinRoomFailure = () => ({ type: actionsTypes.JOIN_ROOM_FAILURE })

export const joinRoom = roomId => ({
  type: 'SOCKET_MIDDLEWARE',
  _SOCKET: true,
  event: socketEvents.JOIN_ROOM_REQUEST,
  afterEmit: joinRoomRequest
})

export const reactRequest = () => ({ type: actionsTypes.REACT_REQUEST })
export const reactSuccess = data => ({ type: actionsTypes.REACT_SUCCESS, data })
export const reactFailure = () => ({ type: actionsTypes.REACT_FAILURE })

export const react = reactionId => ({
  type: 'SOCKET_MIDDLEWARE',
  _SOCKET: true,
  event: socketEvents.REACT_REQUEST,
  data: { reactionId },
  afterEmit: reactRequest
})

export const leaveRoomSuccess = data => ({ type: actionsTypes.LEAVE_ROOM_SUCCESS, data })
