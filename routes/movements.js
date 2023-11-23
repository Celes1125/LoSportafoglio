var express = require('express');
var router = express.Router();
var movementsController = require ('../controllers/movementsController');


router.post('/', movementsController.create);
router.get('/', movementsController.getAll);
router.get('/:id', movementsController.getById);
router.put('/:id', movementsController.update);
router.delete('/:id', movementsController.delete);
router.delete('/', movementsController.deleteAll)


module.exports = router;
