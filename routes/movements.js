var express = require('express');
var router = express.Router();
var movementsController = require ('../controllers/movementsController');
router.post('/getTable/:id', (req, res, next) => { req.app.validateUser (req, res, next)}, movementsController.getTableF)
router.get('/getTable/:id', (req, res, next) => { req.app.validateUser (req, res, next)}, movementsController.getTable)
router.post('/', movementsController.create);
router.get('/userMovements/:userId', movementsController.getAll);
router.get('/:id', movementsController.getById);
router.put('/:id', movementsController.update);
router.delete('/:id', movementsController.delete);
router.delete('/', movementsController.deleteAll);
router.delete('/byPocketId/:id', movementsController.deleteMovementsByPocket)
router.delete('/byUserId/:id', movementsController.deleteMovementsByUser)
router.get('/byPocketId/:id', movementsController.getMovementsByPocket)


module.exports = router;

//router.get('/downloads/:userId', (req, res, next) => { req.app.validateUser (req, res, next)}, movementsController.downloadPDF);
//router.delete('/', (req,res,next) => { req.app.validateUser (req, res, next) },usersController.deleteAll);
//var jwt = require('jsonwebtoken'); // Asegúrate de que JWT esté importado