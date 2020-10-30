import * as mongoose from 'mongoose'
import { validateCPF } from '../common/validators'
import * as bcrypt from 'bcrypt'
import { environment } from '../common/environment'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 80,
    minlength: 3,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  gender: {
    type: String,
    required: false,
    enum: ['Male', 'Female'],
  },
  cpf: {
    type: String,
    required: false,
    validate: {
      validator: validateCPF,
      message: '{PATH}: Invalid CPF ({VALUE})',
    },
  },
})

export interface UserDocument extends mongoose.Document {
  name: String
  email: String
  password: String
  gender: String
  cpf: String
}

const hashPassword = (obj, next) => {
  bcrypt
    .hash(obj.password, environment.security.saltRounds)
    .then((hash) => {
      obj.password = hash
      next()
    })
    .catch(next)
}

const saveMiddleware = function (next) {
  if (!this.isModified('password')) {
    next()
  } else {
    hashPassword(this, next)
  }
}

const updateMiddleware = function (next) {
  if (!this.getUpdate().password) {
    next()
  } else {
    hashPassword(this.getUpdate(), next)
  }
}

// Document middlewares
userSchema.pre('save', saveMiddleware)
userSchema.pre('findAndModify', updateMiddleware)
userSchema.pre('update', updateMiddleware)

export const User = mongoose.model<UserDocument>('User', userSchema)
