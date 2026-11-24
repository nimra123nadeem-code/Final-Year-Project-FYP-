const express = require('express');
require('express-group-routes');
const router = express.Router();

const { orderController } = require('../controllers');
const tryCatch = require('../utils/tryCatch');
const { IS_CUSTOMER } = require('../middlewares');

router.group('/v1', router => {
  router.post('/create-order', IS_CUSTOMER, tryCatch(orderController.createOrder));
  router.post('/update-order', tryCatch(orderController.updateOrder));
  router.delete('/delete-order/:id', IS_CUSTOMER, tryCatch(orderController.deleteOrder));
  router.put('/cancel-order/:id', IS_CUSTOMER, tryCatch(orderController.cancelOrder));
  router.put('/complete-order/:id', IS_CUSTOMER, tryCatch(orderController.completeOrder));
  
  router.get('/order-details/:id', IS_CUSTOMER, tryCatch(orderController.orderDetails));
  router.get('/get-my-orders', IS_CUSTOMER, tryCatch(orderController.getMyOrders));
  router.post('/get-all-orders', IS_CUSTOMER, tryCatch(orderController.getAllOrders));
  router.get('/get-orders-count', IS_CUSTOMER, tryCatch(orderController.getOrdersCount));

  router.post('/add-time-slot', tryCatch(orderController.addTimeSlot));
  router.post('/add-yearly-slot', tryCatch(orderController.addYearlyTimeSlots));
  
  
  router.post('/update-time-slot/:id', tryCatch(orderController.updateTimeSlot));
  router.get('/get-collection-slots', tryCatch(orderController.getCollectionSlots));
  router.get('/get-delivery-slots', tryCatch(orderController.getDeliverySlot));

  
  

});

module.exports = router;
