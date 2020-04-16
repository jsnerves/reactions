import React from 'react'
import classNames from 'classnames'
import twemoji from 'twemoji'
import PropTypes from 'prop-types'

import Popup from './Popup'
import { COLORS, EMOJI } from '../constants/picker-data'

const ReactionPopup = ({ isOpen, onClose, reaction, onDataChange, onSave, onRemove }) => {
  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}>
      
      <div>
        <div className="form-row">
          <input
            value={reaction.text}
            onChange={e => onDataChange({ text: e.target.value })}
            className="input" />
        </div>

        {/* COLORS */}
        <div className="reaction__picks">
          { COLORS.map((c, i) => {
            const pickClassNames = classNames('reaction__pick', { 'reaction__pick--active': c === reaction.color })
            return (
              <div 
                key={i}
                className={pickClassNames}
                onClick={() => onDataChange({ color: c })}>
                <div className="reaction__pick-color" style={{ backgroundColor: c }} />
              </div>
            )
          }) }
        </div>
        
        {/* EMOJI */}
        <div className="reaction__picks">
          { EMOJI.map((e, i) => {
            const pickClassNames = classNames('reaction__pick', { 'reaction__pick--active': e === reaction.emoji })
            return (
              <div 
                key={i}
                className={pickClassNames}
                onClick={() => onDataChange({ emoji: e })}
                dangerouslySetInnerHTML={{
                  __html: twemoji.parse(e)
                }}>
              </div>
            )
          }) }
        </div>
        
        {/* BUTTONS */}
        <span
          className="reaction__delete"
          onClick={onRemove}>Delete</span>

        <div className="buttons">
          <button 
            className="button"
            onClick={onSave}>Save</button>
          <button 
            className="button"
            onClick={onClose}>Cancel</button>
        </div>
      </div>

    </Popup>
  )
}

ReactionPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired, 
  reaction: PropTypes.object.isRequired, 
  onDataChange: PropTypes.func.isRequired, 
  onSave: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
}

ReactionPopup.defaultProps = {
  isOpen: false
}

export default ReactionPopup