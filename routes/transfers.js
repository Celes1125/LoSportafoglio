var express = require('express');
var router = express.Router();
var transfersController = require ('../controllers/transfersController');


router.post('/', transfersController.create);
router.get('/', transfersController.getAll);
router.get('/:id', transfersController.getById);
router.delete('/:id', transfersController.delete);
router.delete('/', transfersController.deleteAll);

module.exports = router;