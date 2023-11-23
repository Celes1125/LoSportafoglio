var express = require('express');
var router = express.Router();
var usersController = require ('../controllers/usersController')


router.post('/', usersController.create);
router.get('/', usersController.getAll);
router.get('/:id', usersController.getById);
router.get('/movements/:id', usersController.getUsersMovements);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);
router.post('/login', usersController.login);
router.delete('/', usersController.deleteAll);



module.exports = router;
