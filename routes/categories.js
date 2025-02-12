var express = require('express');
var router = express.Router();
var categoriesController = require ('../controllers/categoriesController')


router.post('/', categoriesController.create);
router.get('/all/:userId', categoriesController.getAll);
router.get('/notDeleted/:userId', categoriesController.getAllNotDeleted);
router.get('/:id', categoriesController.getById);
router.put('/:id', categoriesController.update);
router.patch('/:id', categoriesController.logicDelete)
router.delete('/:id', categoriesController.fisicDelete);
router.delete('/', categoriesController.deleteAll);


module.exports = router;
