import React, { Component } from 'react'
import autoBind from 'react-autobind'
import classNames from 'classnames'

import Join from './Join'
import Create from './Create'
import '../styles/Start.scss'

class Start extends Component {
  constructor() {
    super()
    autoBind(this)
    this.state = {
      isJoin: false
    }
  }

  onTabClick(isJoin) {
    this.setState({ isJoin })
  }

  render() {
    const { isJoin } = this.state
    const joinTabClassNames = classNames('start__tab', { 
      'start__tab--active': isJoin
    })
    const createTabClassNames = classNames('start__tab', { 
      'start__tab--active': !isJoin
    })
    return (
      <div className="container">
        <div className="container__inner">
          <div className="start__tabs">
            <div
              className={joinTabClassNames} 
              onClick={() => this.onTabClick(true)}>
              Join
            </div>
            <div
              className={createTabClassNames} 
              onClick={() => this.onTabClick(false)}>
              Create
            </div>
          </div>
          <div className="start__content">
            { isJoin ? (
              <Join />
            ) : (
              <Create />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Start
