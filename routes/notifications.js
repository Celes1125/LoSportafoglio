var express = require('express');
var router = express.Router();
var notificationsController = require ('../controllers/notificationsController')

router.get('/:userId', notificationsController.getAllNotDeleted);
router.post('/', notificationsController.create);
router.put('/:notId', notificationsController.update);
router.delete('/', notificationsController.fisicDeleteAll);



module.exports = router;
