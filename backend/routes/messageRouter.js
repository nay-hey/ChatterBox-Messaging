const router = require('express').Router();

const messageController = require('../controllers/messageController');
const auth = require('../middleware/Auth');

router
  .route('/')
  .post(auth.checkUserAuthentication, messageController.sendSingleMessage);
router
  .route('/:id')
  .get(auth.checkUserAuthentication, messageController.sendAllMessage);
router
  .route('/:id')
  .delete(auth.checkUserAuthentication, messageController.deleteChat);
module.exports = router;
