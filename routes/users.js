var express = require('express');
var router = express.Router();
var usersController = require ('../controllers/usersController')


router.post('/', usersController.create);
router.get('/email', usersController.getUserByEmail);
router.get('/token/:token', usersController.getUserIdByToken)
router.get('/', usersController.getAll);
router.get('/:id', usersController.getById);
router.get('/movements/:id', usersController.getUsersMovements);

router.put('/:id', usersController.update);
router.post('/login', usersController.login);
router.delete('/:id', (req,res,next) => { req.app.validateUser (req, res, next) },usersController.delete);
//router.delete('/', (req,res,next) => { req.app.validateUser (req, res, next) },usersController.deleteAll);
router.delete('/', usersController.deleteAll);



module.exports = router;
