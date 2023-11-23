var express = require('express');
var router = express.Router();
var walletsController = require ('../controllers/walletsController')


router.post('/', walletsController.create);
router.get('/', walletsController.getAll);
router.get('/:id', walletsController.getById);
router.put('/:id', walletsController.update);
router.delete('/:id', walletsController.delete);
router.delete('/', walletsController.deleteAll);


module.exports = router;