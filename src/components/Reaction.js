import React from 'react'
import twemoji from 'twemoji'
import PropTypes from 'prop-types'

import '../styles/Reaction.scss'

const Reaction = ({ onClick, emoji, color, text, index }) => {
  return(
    <div 
      className="reaction"
      onClick={() => onClick(index)}>
      <div className="reaction__emoji"
        dangerouslySetInnerHTML={{
          __html: twemoji.parse(emoji)
        }}>
      </div>
      <div 
        className="reaction__body"
        style={{ backgroundColor: color }}>
        <span className="reaction__text">{ text }</span>  
      </div>
    </div>
  )
}

Reaction.propTypes = {
  onClick: PropTypes.func.isRequired,
  emoji: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired
}

export default Reaction
