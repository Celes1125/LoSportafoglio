var express = require('express');
var router = express.Router();
var vendorsController = require ('../controllers/vendorsController')

router.post('/', vendorsController.create);
router.get('/all/:userId', vendorsController.getAll);
router.get('/notDeleted/:userId', vendorsController.getAllNotDeleted);
router.get('/:id', vendorsController.getById);
router.put('/:id', vendorsController.update);
router.patch('/:id', vendorsController.logicDelete);
router.delete('/:id', vendorsController.fisicDelete);
router.delete('/', vendorsController.fisicDeleteAll);

module.exports = router;