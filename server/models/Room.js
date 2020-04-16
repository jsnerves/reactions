import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const SALT_ROUDS = 10

const schema = new mongoose.Schema({
  roomId: String,
  hash: String,
  reactions: [{
    text: String,
    color: String,
    emoji: String
  }]
})

schema.methods.setPassword = function(password) { // "function" to bind this
  const hash = bcrypt.hashSync(password, SALT_ROUDS)
  this.hash = hash
}

schema.methods.isValidPassword = function(password) {
  const isValid = bcrypt.compareSync(password, this.hash)
  return isValid
}

const Room = mongoose.model('Room', schema)

export default Room
