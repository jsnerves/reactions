import { fromJS, Map } from 'immutable'
import { createSelector } from 'reselect'

import * as actionsTypes from '../constants/actions-types'
import { audienceSliceSelector as sliceSelector } from './slice-selectors'

const initialState = fromJS({
  reactions: [],
  listById: {},
  userId: null,
  userReactionId: null
})

const getFakeAudience = (n) => {
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const result = {}
  for(let i = 0; i < n; i++) {
    result[Math.random()] = getRandomInt(0, 5)
  }

  return result
}

export default (state = initialState, action) => {
  switch(action.type) {
    case actionsTypes.GET_ROOM_DATA_SUCCESS: {
      return state
        .set('reactions', fromJS(action.data.reactions))
        .set('listById', fromJS(getFakeAudience(199)))
    }

    case actionsTypes.JOIN_ROOM_SUCCESS: {
      const { userId, isOwn } = action.data
      let newState = state

      if(isOwn) {
        newState = newState
          .set('userId', userId)
      }

      return newState.setIn(['listById', userId], null)
    }

    case actionsTypes.REACT_SUCCESS: {
      const { userId, reactionId, isOwn } = action.data
      let newState = state

      if(isOwn) {
        newState = newState
          .set('userId', userId)
          .set('userReactionId', reactionId)
      }

      return newState.setIn(['listById', userId], reactionId)
    }

    case actionsTypes.LEAVE_ROOM_SUCCESS: {
      return state.remove(action.data.userId)
    }

    default: {
      return state
    }
  }
}

export const userIdSelector = createSelector(
  sliceSelector,
  state => state.get('userId')
)

export const reactionsSelector = createSelector(
  sliceSelector,
  state => state.get('reactions')
)

export const audienceFullReactionsSelector = createSelector(
  sliceSelector,
  state => state.get('listById').map(reactionId => {
    return reactionId === null ? null : state.getIn(['reactions', reactionId])
  }).entrySeq()
)

export const dominantReactionSelector = createSelector(
  sliceSelector,
  state => state
)

