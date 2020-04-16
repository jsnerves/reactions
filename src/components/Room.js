import React, { Component } from 'react'
import autoBind from 'react-autobind'
import PropTypes from 'prop-types'

import Audience from './Audience'
import Reactions from './Reactions'


class Room extends Component {
  constructor() {
    super()
    autoBind(this)
    this.state = {
    }
  }

  render() {
    const { audience, reactions, userId, react } = this.props

    return (
      <div className="container">
        <div className="container__inner">
          <Audience 
            audience={audience}
            reactions={reactions}
            userId={userId} />
          <Reactions 
            reactions={reactions}
            onReact={react} />
        </div>
      </div>
    )
  }
}

Room.propTypes = {
  audience: PropTypes.array.isRequired,
  reactions: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired,
  react: PropTypes.func.isRequired
}

export default Room
