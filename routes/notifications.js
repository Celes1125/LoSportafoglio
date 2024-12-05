var express = require('express');
var router = express.Router();
var notificationsController = require ('../controllers/notificationsController')

router.get('/:userId', notificationsController.getAllNotDeleted);
router.post('/', notificationsController.create);
router.patch('/:notId', notificationsController.edit);
router.delete('/', notificationsController.fisicDeleteAll);



module.exports = router;
