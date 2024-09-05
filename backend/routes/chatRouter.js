const router = require('express').Router();

const chatController = require('../controllers/chatController');
const auth = require('../middleware/Auth');

router
  .route('/')
  .post(auth.checkUserAuthentication, chatController.sendSingleChat)
  .get(auth.checkUserAuthentication, chatController.sendAllChats);

router
  .route('/group')
  .post(auth.checkUserAuthentication, chatController.createGroupChat);

router
  .route('/grouprename')
  .post(auth.checkUserAuthentication, chatController.renameGroup);

router
  .route('/groupadd')
  .post(auth.checkUserAuthentication, chatController.addToGroup);

router
  .route('/groupremove')
  .post(auth.checkUserAuthentication, chatController.removeFromGroup);

module.exports = router;
