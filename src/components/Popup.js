import React from 'react'
import PropTypes from 'prop-types'

import '../styles/Popup.scss'

const Popup = ({ isOpen, onClose, children }) => {
  if(!isOpen) return null

  return (
    <div className="popup">
      <div 
        className="popup__background"
        onClick={onClose}>        
      </div>
      <div className="popup__content">
        { children }
      </div>
    </div>
  )
}

Popup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired
}

Popup.defaultProps = {
  isOpen: true
}

export default Popup
