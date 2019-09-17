import mongoose, {
  Schema
} from 'mongoose'
import Joi from '@hapi/joi'

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'user'
  },
  firstLogin: {
    type: Boolean,
    default: true,
    required: true
  }
}, {
  timestamps: true
})

const validation = Joi.object().keys({
  firstName: Joi.string().required().max(50),
  lastName: Joi.string().required().max(50),
  middleName: Joi.string().max(50),
  email: Joi.string().required().email({ minDomainSegments: 2 }).max(100),
  password: Joi.string().required()
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).error(new Error('The password must be at least: - 8 characters long - Contain 1 uppercase letter - Contain 1 number - Contain 1 special character'))
    .max(100),
  role: Joi.string()
})

export default {
  model: mongoose.model('User', UserSchema),
  validation: validation
}
