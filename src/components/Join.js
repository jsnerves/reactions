import React, { Component } from 'react'
import autoBind from 'react-autobind'
import axios from 'axios'
import classNames from 'classnames'

import { JOIN_URL } from '../constants/urls'
import Password from './Password'

class Join extends Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      roomId: '',
      password: '',
      err: null
    }
  }

  onInputChange(prop, val) {
    this.setState({ 
      [prop]: val,
      err: null
    })
  }

  onButtonClick(e) {
    e.preventDefault()

    const { roomId, password } = this.state

    // reset error messages
    this.setState({ err: null })

    // send request
    axios.post(JOIN_URL, { roomId, password })
      .then(res => {
        window.location.href = res.data.redirect
      })
      .catch(err => {
        console.log(err)
        this.setState({ err: err.response.data })
      })
  }

  isErrorOfType(type) {
    return this.state.err && this.state.err.type === type
  }

  render() {
    const { roomId, password, err } = this.state

    const nameInputClassNames = classNames('input', {
      'input--error': this.isErrorOfType('name')
    })
    const passwordInputClassNames = classNames('password-wrap__input', 'input', {
      'input--error': this.isErrorOfType('password')
    })

    return (
      <form onSubmit={this.onButtonClick}>
        <div className="form-row">
          <label className="label">Name:</label>
          <input 
            value={roomId}
            className={nameInputClassNames}
            onChange={e => this.onInputChange('roomId', e.target.value)} />

          { this.isErrorOfType('name') && (
            <div className="error">{ err.message }</div>
          ) }
        </div>
        
        <div className="form-row">
          <label className="label">Password:</label>
          <Password 
            value={password}
            inputClass={passwordInputClassNames}
            onChange={e => this.onInputChange('password', e.target.value)} />
          { this.isErrorOfType('password') && (
            <div className="error">{ err.message }</div>
          ) }
        </div>
        <div 
          className="buttons">
          <button 
            className="button"
            onClick={this.onButtonClick}>Join</button>
        </div>
      </form>
    )
  }
}

export default Join
