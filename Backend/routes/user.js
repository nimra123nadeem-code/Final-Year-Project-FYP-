const express = require('express');
require('express-group-routes');
const router = express.Router();

const tryCatch = require('../utils/tryCatch');
const { userController } = require('../controllers');
const { IS_CUSTOMER } = require('../middlewares');

router.group('/v1', router => {
  router.post('/sign-up', tryCatch(userController.signUp));
  router.post('/log-in', tryCatch(userController.login));
  router.post('/log-out/:id', tryCatch(userController.logout));
  router.post('/forgot-password', tryCatch(userController.forgotPassword));
  router.post('/reset-password', tryCatch(userController.resetPassword));
  router.post('/update-fcm-token', IS_CUSTOMER, tryCatch(userController.updateFcmToken));
  router.put('/update-profile', IS_CUSTOMER, tryCatch(userController.editUserProfile));
  router.post('/send-push-notification', IS_CUSTOMER, tryCatch(userController.sendPushNotification));
  router.post('/is-email-taken', tryCatch(userController.isEmailTaken));
  router.post('/is-phone-taken', tryCatch(userController.isPhoneTaken));
  router.post('/add-address', IS_CUSTOMER, tryCatch(userController.addUserAddress));
  router.delete('/delete-user/:id', IS_CUSTOMER, tryCatch(userController.deleteUser));
  
  
});

module.exports = router;
