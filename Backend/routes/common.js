const express = require('express');
require('express-group-routes');
const router = express.Router();

const { commonController } = require('../controllers');
const tryCatch = require('../utils/tryCatch');

router.group('/v1', router => {
  router.get('/app-version', tryCatch(commonController.getAppVersion));
});

module.exports = router;
