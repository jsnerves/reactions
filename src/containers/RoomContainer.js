import React, { Component } from 'react'
import { connect } from 'react-redux'

import Room from '../components/Room'
import {
  react
} from '../actions'
import {
  reactionsSelector,
  audienceFullReactionsSelector,
  userIdSelector
} from '../reducers/audience'

class RoomContainer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Room {...this.props} />
    )
  }
}

const mapStateToProps = state => {
  return {
    audience: audienceFullReactionsSelector(state).toJS(),
    reactions: reactionsSelector(state).toJS(),
    userId: userIdSelector(state)
  }
}

export default connect(mapStateToProps, {
  react
})(RoomContainer)
