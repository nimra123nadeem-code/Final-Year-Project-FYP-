const express = require('express');
require('express-group-routes');
const router = express.Router();

const { paymentController } = require('../controllers');
const tryCatch = require('../utils/tryCatch');
const { IS_ADMIN } = require('../middlewares');

router.group('/v1', router => {
  router.get('/stripe-config', tryCatch(paymentController.sendConfigToClient));
  router.post('/add-card', tryCatch(paymentController.addCardToCustomer));
  router.post('/process-payment', tryCatch(paymentController.processPayment)); //depricated
  router.get('/get-customers-cards/:id', tryCatch(paymentController.getCustomersCard));
  router.post('/create-payment-intent', IS_ADMIN, tryCatch(paymentController.createPaymentIntent));
});

module.exports = router;
