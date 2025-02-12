var express = require('express');
var router = express.Router();
var walletsController = require ('../controllers/walletsController')


router.post('/', walletsController.create);
router.get('/all/:userId', walletsController.getAll);
router.get('/notDeleted/:userId', walletsController.getAllNotDeleted);
router.get('/:id', walletsController.getById);
router.put('/:id', walletsController.update);
router.delete('/:id', walletsController.fisicDelete);
router.patch('/:id', walletsController.logicDelete);
router.delete('/', walletsController.fisicDeleteAll);
router.get('/pockets/:id', walletsController.getPocketsOfWallet)


module.exports = router;