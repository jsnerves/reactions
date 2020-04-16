import { fromJS } from 'immutable'
import { createSelector } from 'reselect'

import * as actionsTypes from '../constants/actions-types'
import { reactionsSliceSelector as sliceSelector } from './slice-selectors'

const initialState = fromJS([])

export default (state = initialState, action) => {
  switch(action.type) {
    case actionsTypes.GET_ROOM_DATA_SUCCESS: {
      return fromJS(action.data.reactions)
    }

    default: {
      return state
    }
  }
}

export const reactionsSelector = sliceSelector
