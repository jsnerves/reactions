import React, { Component } from 'react'
import autoBind from 'react-autobind'
import classNames from 'classnames'
import axios from 'axios'
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import Reaction from './Reaction'
import { CREATE_URL, JOIN_URL } from '../constants/urls'
import '../styles/Create.scss'
import { EMOJI, COLORS } from '../constants/picker-data'
import Password from './Password'
import ReactionPopup from './ReactionPopup'

const DEFAULT_REACTIONS = [
  {
    text: 'That\'s interesting',
    color: COLORS[0],
    emoji: EMOJI[61]
  },
  {
    text: 'I\'m confused',
    color: COLORS[1],
    emoji: EMOJI[38]
  },
  {
    text: 'Thinking hard',
    color: COLORS[2],
    emoji: EMOJI[30]
  },
  {
    text: 'Nah... bored',
    color: COLORS[3],
    emoji: EMOJI[45]
  },
  {
    text: 'I could argue with that',
    color: COLORS[4],
    emoji: EMOJI[32]
  }
]

const EMPTY_REACTION = {
  text: 'I\'m the new one',
  color: COLORS[3],
  emoji: EMOJI[1]
}

const REACTIONS_MAX = 10

class Create extends Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      roomId: '',
      password: '',
      reactions: DEFAULT_REACTIONS,
      err: null,
      editingIndex: null,
      editingReaction: {}
    }
  }

  onInputChange(prop, val) {
    this.setState({ 
      [prop]: val,
      err: null 
    })
  }

  closePopup() {
    this.setState({ editingIndex: null, editingReaction: {} })
  }

  onSaveEditClick() {
    const reactions = Object.assign([], this.state.reactions)
    reactions[this.state.editingIndex] = this.state.editingReaction
    this.setState({ 
      reactions,
      editingIndex: null,
      editingReaction: {} 
    })
  }

  isErrorOfType(type) {
    return this.state.err && this.state.err.type === type
  }

  onReactionClick(index) {
    this.setState({ editingIndex: index, editingReaction: this.state.reactions[index] })
  }

  removeReaction() {
    const reactions = Object.assign([], this.state.reactions)
    reactions.splice(this.state.editingIndex, 1)
    this.setState({ 
      reactions,
      editingIndex: null,
      editingReaction: {}
    })
  }

  onReactionAddClick() {
    const reactions = Object.assign([], this.state.reactions)
    reactions.push(EMPTY_REACTION)
    this.setState({ reactions })
  }

  editReaction(newData) {
    this.setState({ editingReaction: { ...this.state.editingReaction, ...newData } })
  }

  onCreateClick(e) {
    e.preventDefault()

    const { roomId, password, reactions } = this.state;
    axios.post(CREATE_URL, { roomId, password, reactions })
      .then(res => {
        // after successfull creation join room with credentials
        return axios.post(JOIN_URL, { roomId, password })
      })
      .then(res => {
        window.location.href = res.data.redirect
      })
      .catch(err => {
        console.log(err)
        this.setState({ err: err.response.data })
      })
  }

  onReactionsSort({ oldIndex, newIndex }) {
    const reactions = Object.assign([], this.state.reactions)
    const toMove = reactions[oldIndex]
    reactions[oldIndex] = reactions[newIndex]
    reactions[newIndex] = toMove
    this.setState({ reactions })
  }

  render() {
    const { roomId, password, reactions, err, editingIndex, editingReaction } = this.state
    const nameInputClassNames = classNames('input', {
      'input--error': this.isErrorOfType('name')
    })

    const passwordInputClassNames = classNames('input', {
      'input--error': this.isErrorOfType('password')
    })

    const SortableReaction = SortableElement(({ value, reactionIndex }) => {
      return (
        <Reaction 
          onClick={this.onReactionClick}
          index={reactionIndex}
          {...value} />
      )
    })

    const SortableReactions = SortableContainer(({ items }) => (
      <div>
        { items.map((value, index) => {
          return (
            <SortableReaction 
              key={`item-${index}`}
              index={index}
              reactionIndex={index}
              value={value} />
          )
        }) }
      </div>
    ))
        
    return (
      <form 
        className="create"
        onSubmit={this.onCreateClick}>
        {/* NAME */}
        <div className="form-row">
          <label className="label">Name:</label>
          <input 
            value={roomId}
            className={nameInputClassNames}
            onChange={e => this.onInputChange('roomId', e.target.value)} />
          <div className="info">Pick unique name. At least 6 characters long. Use letters, digits and _</div>
          { this.isErrorOfType('name') && (
            <div className="error">{ err.message }</div>
          ) }
        </div>
        
        {/* PASSWORD */}
        <div className="form-row">
          <label className="label">Password:</label>
          <Password 
            value={password}
            inputClass={passwordInputClassNames}
            onChange={e => this.onInputChange('password', e.target.value)} />
          <div className="info">At least 4 characters long</div>
          { this.isErrorOfType('password') && (
            <div className="error">{ err.message }</div>
          ) }
        </div>
        
        {/* REACTIONS */}
        <div className="create__reactions">
          <label className="label">Audience reactions:</label>
          <div className="create__reactions-list">
            <SortableReactions 
              distance={3}
              items={reactions}
              onSortEnd={this.onReactionsSort} />

            <div 
              className="create__bottom">
              { reactions.length <= REACTIONS_MAX && (
                <i 
                  className="create__add-icon fas fa-plus-square"
                  onClick={this.onReactionAddClick} />
              ) }
              <span className="create__bottom-text">max: 10</span>
            </div>
          </div>
        </div>

        <ReactionPopup 
          isOpen={editingIndex !== null}
          onClose={this.closePopup}
          reaction={editingReaction}
          onDataChange={this.editReaction}
          onSave={this.onSaveEditClick}
          onRemove={this.removeReaction} />
        
        {/* BUTTONS */}
        <div 
          className="buttons">
          <button 
            className="button"
            onClick={this.onCreateClick}>Create</button>
        </div>
      </form>
    )
  }
}

export default Create
