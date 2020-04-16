export default socket => store => next => action => {
  if(!action._SOCKET) return next(action)

  const { event, data, afterEmit } = action
  socket.emit(event, data)
  next(afterEmit())
}
