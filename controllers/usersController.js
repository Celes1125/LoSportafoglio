const usersModel = require('../models/usersModel');
const errorMessages = require('../utils/errorMessages');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const movementsModel = require('../models/movementsModel')

module.exports = {

  create: async function (req, res, next) {
    try {
      const user = new usersModel(
        {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password


        }
      )
      const document = await user.save()
      res.json(document)

    } catch (e) {
      next(e)
    }

  },

  getAll: async function (req, res, next) {
    try {
      const users = await usersModel.find().populate({
        path: "movements",
        model: "movements"
      })
      res.send(users)

    } catch (e) {
      next(e)
    }
  },

  getById: async function (req, res, next) {
    async function findById(id) {
      //busco el usuario
      try {
        const user = await usersModel.findById(id)
        return user

      } catch (e) {
        return null
      }
    }
    //busco los movimientos asociados al usuario
    try {
      const user = await findById(req.params.id)
      if (!user) {
        res.json({ "message": errorMessages.users.noUser})
      }
      const movements = await movementsModel.find({user: user._id})
      if (!movements){
        res.json (user)
      }
      //Muestro al usuario con sus movimientos
      const userWithMovements = {
        ...user.toObject(),
        movements: movements
      }
      res.json(userWithMovements)     


    } catch (e) {
      next(e)
    }
  },

  update: async function (req, res, next) {

    try {
      const user = await usersModel.updateOne({ _id: req.params.id }, req.body)
      res.json(user)

    } catch (e) {
      next(e)
    }
  },

  delete: async function (req, res, next) {
    try {
      const user = await usersModel.deleteOne({ _id: req.params.id });
      res.json(user)

    } catch (e) {
      next(e)
    }
  },

  login: async function (req, res, next) {
    try {
      const { email, password } = req.body
      const user = await usersModel.findOne({ email })
     if (!user) {
        return res.json({ message: "wrong email" })     
      }
      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ userId: user._id }, req.app.get('secretKey'), { expiresIn: "1h" })
        res.json({ token: token })
      } else {
        res.json({ message: "wrong password" })
        return
      }
    } catch (e) {
      next(e)
    }

  },

  deleteAll: async function (req, res, next) {
    try {
      // Comprobar si la colección de usuarios está vacía
      const usersCount = await usersModel.countDocuments()
      if (usersCount === 0) {
        return res.json({ message: "No existen usuarios a eliminar" })
      }

      // Eliminar todos los usuarios
      await usersModel.deleteMany()
      res.json({ message: "Todos los usuarios han sido eliminados" })
    } catch (e) {
      next(e)
    }
  },

  getUsersMovements: async function (req, res, next) {

    async function getUsersMovements(id) {
      try {
        const movements = await movementsModel.find({user: id})
        return movements
      } catch (e) {
        return null
      }
    }
    try{
      const usersMovements = await getUsersMovements(req.params.id)
      if(!usersMovements){
        res.json({message: "no existen movimientos"})
        return
      }
      res.json(usersMovements)
    }catch(e){
      next(e)
    }



  }

  


}