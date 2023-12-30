const mongoose = require('../bin/mongodb')
const errorMessages = require('../utils/errorMessages')
const validators = require('../utils/validators')
const bcrypt = require('bcrypt')

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, errorMessages.general.required],
      validate: {
        validator: function (input) {
          return validators.isValidName(input)
        },
        message: errorMessages.users.wrongName
      }
    },
    email: {
      type: String,
      required: [true, errorMessages.general.required],
      unique: true,
      validate: {
        validator: function (input) {
          return validators.emailValidate(input)
        },
        message: errorMessages.users.wrongEmail
      }

    },
    password: {
      type: String,
      required: [true, errorMessages.general.required],
      validate: {
        validator: function (value) {
          return validators.isGoodPassword(value)
        }, 
        message: errorMessages.users.wrongPassword
      }

    },
    movements: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'movements'

    }
  }

)
usersSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10)
  next()
}
)

module.exports = mongoose.model("users", usersSchema);