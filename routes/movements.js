var express = require('express');
var router = express.Router();
var movementsController = require ('../controllers/movementsController');


router.post('/', movementsController.create);
router.get('/', movementsController.getAll);
router.get('/:id', movementsController.getById);
router.put('/:id', movementsController.update);
router.delete('/:id', movementsController.delete);
router.delete('/', movementsController.deleteAll);
router.delete('/byPocketId/:id', movementsController.deleteMovementsByPocket)
router.delete('/byUserId/:id', movementsController.deleteMovementsByUser)
router.get('/byPocketId/:id', movementsController.getMovementsByPocket)


module.exports = router;
