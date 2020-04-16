import React, { Component } from 'react'
import autoBind from 'react-autobind'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import '../styles/Audience.scss'

class Audience extends Component {
  constructor() {
    super()
    autoBind(this)
    this.state = {
    }
  }

  getReaction(reactionId) {
    if (reactionId === null) return {}

    const reaction = this.props.reactions[reactionId]

    return {
      backgroundColor: reaction.color
    }
  }

  render() {
    const { audience, userId } = this.props

    return (
      <div className="audience">
        { audience.map(el => {
          const user = el[0]
          const isMe = userId === user
          const reaction = el[1]
          const userClassNames = classNames('audience__user', {
            'audience__user--me': isMe
          })

          return (
            <div 
              key={user}
              className={userClassNames}
              style={{ 
                backgroundColor: reaction ? reaction.color : undefined 
              }}>{ isMe && 'me' }</div>
          )
        }) }
      </div>
    )
  }
}

Audience.propTypes = {
  audience: PropTypes.array.isRequired,
  reactions: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired
}

export default Audience
