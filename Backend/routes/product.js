const express = require('express');
require('express-group-routes');
const router = express.Router();

const { productController } = require('../controllers');
const tryCatch = require('../utils/tryCatch');

// const { IS_CUSTOMER } = require('../middlewares');

router.group('/v1', router => {
  router.post('/create-product', tryCatch(productController.createProduct));
  router.get('/get-all-products', tryCatch(productController.getAllProducts));
  // router.get('/get-service', tryCatch(serviceController.getService));
  // router.delete('/delete-service/:id', IS_CUSTOMER, tryCatch(serviceController.deleteService));
  //router.patch('/update-service/:id', tryCatch(serviceController.updateService));
  // router.post('/create-deal', tryCatch(serviceController.createDeal));
  // router.post('/fake-data', serviceController.fakeService);
});

module.exports = router;
