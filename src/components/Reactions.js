import React, { Component } from 'react'
import autoBind from 'react-autobind'
import PropTypes from 'prop-types'

import Reaction from './Reaction'

class Reactions extends Component {
  constructor() {
    super()
    autoBind(this)
    this.state = {
    }
  }

  render() {
    const { reactions, onReact } = this.props

    return (
      <div className="reactions">
        { reactions.map((r, i) => (
          <Reaction 
            key={i}
            index={i} 
            text={r.text}
            emoji={r.emoji}
            color={r.color}
            onClick={reactionId => onReact(reactionId)}/>
        )) }
      </div>
    )
  }
}

Reactions.propTypes = {
  reactions: PropTypes.array.isRequired,
  onReact: PropTypes.func.isRequired
}

export default Reactions
