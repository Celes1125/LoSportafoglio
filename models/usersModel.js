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

    },
    creationDate: {
      type: Date,
      default: Date.now,
      immutable: true     
    },
    lastLoginDate: {
      type: Date,
      default: null // Se actualizará manualmente en la lógica de login
    },
    isFirstLogin: {
      type: Boolean,
      default: true // Empieza como true cuando se crea el usuario   
  }
}

)
/*usersSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10)
  next()
}
)*/

// cambié esta función de modo que no realice el hash de la password cada
// vez que cambio el user ( cuando hago user.save ). Caso contrario, el primer login
// va exc pero ya el segundo no coincide el hash!!!

usersSchema.pre("save", function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});


module.exports = mongoose.model("users", usersSchema);