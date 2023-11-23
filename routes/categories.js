var express = require('express');
var router = express.Router();
var categoriesController = require ('../controllers/categoriesController')


router.post('/', categoriesController.create);
router.get('/', categoriesController.getAll);
router.get('/:id', categoriesController.getById);
router.put('/:id', categoriesController.update);
router.delete('/:id', categoriesController.delete);
router.delete('/', categoriesController.deleteAll);


module.exports = router;
