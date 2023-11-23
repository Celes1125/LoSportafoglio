var express = require('express');
var router = express.Router();
var vendorsController = require ('../controllers/vendorsController')


router.post('/', vendorsController.create);
router.get('/', vendorsController.getAll);
router.get('/:id', vendorsController.getById);
router.put('/:id', vendorsController.update);
router.delete('/:id', vendorsController.delete);
router.delete('/', vendorsController.deleteAll);


module.exports = router;