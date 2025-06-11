const usersModel = require('../models/usersModel');
const categoriesModel = require('../models/categoriesModel');
const vendorsModel = require('../models/vendorsModel');
const errorMessages = require('../utils/errorMessages');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const movementsModel = require('../models/movementsModel');
const { Buffer } = require('buffer');

const usersController = {
  create: async function (req, res, next) {
    try {
      const user = new usersModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      const document = await user.save();
      return res.status(201).json(document);
    } catch (e) {
      return next(e);
    }
  },

  getAll: async function (req, res, next) {
    try {
      const users = await usersModel.find();
      return res.json(users);
    } catch (e) {
      return next(e);
    }
  },

  getById: async function (req, res, next) {
    try {
      const user = await usersModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: errorMessages.users.noUser });
      }

      const movements = await movementsModel.find({ user: user._id });
      const userWithMovements = {
        ...user.toObject(),
        movements: movements || []
      };

      return res.json(userWithMovements);
    } catch (e) {
      return next(e);
    }
  },

  update: async function (req, res, next) {
    try {
      const user = await usersModel.updateOne({ _id: req.params.id }, req.body);
      return res.json(user);
    } catch (e) {
      return next(e);
    }
  },

  delete: async function (req, res, next) {
    try {
      const user = await usersModel.deleteOne({ _id: req.params.id });
      return res.json(user);
    } catch (e) {
      return next(e);
    }
  },

  deleteAll: async function (req, res, next) {
    try {
      const usersCount = await usersModel.countDocuments();
      if (usersCount === 0) {
        return res.status(404).json({ message: "No existen usuarios a eliminar" });
      }

      await usersModel.deleteMany();
      return res.json({ message: "Todos los usuarios han sido eliminados" });
    } catch (e) {
      return next(e);
    }
  },

  getUsersMovements: async function (req, res, next) {
    try {
      const movements = await movementsModel.find({ user: req.params.id });
      return res.json(movements || []);
    } catch (e) {
      return next(e);
    }
  },

  getUserIdByToken: async function (req, res, next) {
    try {
      const token = req.params.token || req.headers.token;
      if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
      }

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = JSON.parse(Buffer.from(base64, 'base64').toString());

      if (decodedToken?.userId) {
        return res.json(decodedToken.userId);
      }

      return res.status(401).json({ message: "Token no válido" });
    } catch (e) {
      return next(e);
    }
  },

  getUserByEmail: async function (req, res, next) {
    try {
      const email = req.query.email;
      if (!email) {
        return res.status(400).json({ message: "Email no proporcionado" });
      }

      const user = await usersModel.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      return res.json(user);
    } catch (e) {
      return next(e);
    }
  },

  loadDefaultCategories: async function (user) {
    const demoCategoriesData = [
      { name: 'BANCA' },
      { name: 'EDUCACIÓN' },
      { name: 'GG' },
      { name: 'INDUMENTARIA' },
      { name: 'INGRESOS' },
      { name: 'OTROS' },
      { name: 'SALUD' },
      { name: 'TELECOM' },
      { name: 'TRANSPORTE' },
      { name: 'VIVIENDA' },
    ];

    if (!user || !user._id) {
      throw new Error('Se requiere un usuario válido con _id para cargar categorías.');
    }

    try {
      for (const categoryData of demoCategoriesData) {
        const categoryInstance = new categoriesModel({
          name: categoryData.name,
          creator: user._id
        });
        await categoryInstance.save();
      }
      console.log(`Categorías predeterminadas cargadas para el usuario ${user._id}`);
    } catch (error) {
      console.error(`Error al cargar categorías para el usuario ${user._id}:`, error);
      throw error;
    }
  },

  loadDefaultVendors: async function (user) {
    const demoVendorsData = [
      { name: 'tweens for service' },
      { name: 'inps' },
      { name: 'tigros' },
      { name: 'dipiu' },
      { name: 'hao li lai' },
      { name: 'remax' },
      { name: 'enel' },
      { name: 'italiana assicurazione' },
      { name: 'otros' },
      { name: 'la lucente' },
      { name: 'farmacia' },
      { name: 'amazon' },
      { name: 'aliexpress' },
      { name: 'parquimetro' },
      { name: 'cz store' },
      { name: 'lidl' },
      { name: 'action' },
      { name: 'tuttomerce' },
      { name: 'bar/café' },
      { name: 'disney' },
      { name: 'netflix' },
      { name: 'intesa san paolo' },
      { name: 'mcdonalds' },
      { name: 'fastweb' },
      { name: 'ahorros' },
    ];

    if (!user || !user._id) {
      throw new Error('Se requiere un usuario válido con _id para cargar los proveedores.');
    }

    try {
      for (const vendorData of demoVendorsData) {
        const vendorInstance = new vendorsModel({
          name: vendorData.name,
          creator: user._id
        });
        await vendorInstance.save();
      }
      console.log(`Proveedores predeterminados cargados para el usuario ${user._id}`);
    } catch (error) {
      console.error(`Error al cargar proveedores para el usuario ${user._id}:`, error);
      throw error;
    }
  },

  login: async function (req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son requeridos" });
      }

      const user = await usersModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      // Generar token
      const token = jwt.sign(
        { userId: user._id },
        //req.app.get('secretKey'),
        process.env.SECRET_KEY, // Leyendo directamente del entorno
        { expiresIn: "10h" }
      );

      // Manejo del primer login
      if (user.isFirstLogin) {
        try {
          await Promise.all([
            usersController.loadDefaultCategories(user),
            usersController.loadDefaultVendors(user)
          ]);
          
          user.isFirstLogin = false;
          user.lastLoginDate = new Date();
          await user.save();
        } catch (e) {
          console.error('Error loading defaults:', e);
          // Continuamos a pesar del error, pero podrías decidir manejarlo diferente
        }
      } else {
        user.lastLoginDate = new Date();
        await user.save();
      }

      return res.json({
        token: token        
      });
    } catch (e) {
      console.error('Login error:', e);
      return next(e);
    }
  }
};

module.exports = usersController;