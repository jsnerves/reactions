import { createStore, applyMiddleware, compose } from 'redux'
import { Map } from 'immutable'
import thunk from 'redux-thunk'
import reducer from '../reducers'

import socketMiddleware from '../middleware/socket-middleware'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const initialState = new Map()

export default socket => createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk, socketMiddleware(socket)))
)
