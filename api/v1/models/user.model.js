const mongoose = require('mongoose')
const generate = require('../../../helper/generate')

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: {
      type: String,
      default: generate.generateRandomString(20),
    },
    phone: String,
    avatar: String,

    status: {
      type: String,
      default: 'active',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deleteAt: Date,
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema, 'users')

module.exports = User
