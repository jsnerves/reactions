import React, { Component } from 'react'
import autoBind from 'react-autobind'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import '../styles/Password.scss'

class Password extends Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      isVisible: false
    }
  }

  onIconClick() {
    this.setState({ isVisible: !this.state.isVisible })
  }

  render() {
    const { value, inputClass, onChange } = this.props
    const { isVisible } = this.state

    const inputClassNames = classNames(inputClass, 'password__input')
    const iconClassNames = classNames('password__icon', {
      'far fa-eye-slash': !isVisible,
      'far fa-eye': isVisible
    })

    return (
      <div className="password">
        <input 
          value={value}
          className={inputClassNames}
          type={isVisible ? 'text' : 'password'}
          onChange={onChange} />
        <i
          className={iconClassNames}
          onClick={this.onIconClick} />
      </div>
    )
  }
}

Password.propTypes = {
  value: PropTypes.string.isRequired,
  inputClass: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Password
