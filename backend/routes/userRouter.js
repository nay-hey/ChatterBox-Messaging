const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/Auth');

router.route('/').get(auth.checkUserAuthentication, userController.sendUsers);

router.route('/auth').post(userController.sendCurrentUser);

router.route('/register').post(userController.registerUser);

router.route('/login').post(userController.loginUser);

router.route('/logout').post(userController.logoutUser);

module.exports = router;
