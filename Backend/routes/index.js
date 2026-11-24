const express = require('express');
const router = express.Router();

const userRoutes = require('./user');
const orderRoutes = require('./order');
const serviceRoutes = require('./service');
const paymentRoutes = require('./payment');
const commonRoutes = require('./common');
const productRoutes = require('./product');
const cartRoutes = require('./cart');


router.use('/user', userRoutes);
router.use('/order', orderRoutes);
router.use('/service', serviceRoutes);
router.use('/payment', paymentRoutes);
router.use('/common', commonRoutes);
router.use('/product', productRoutes);
router.use('/cart', cartRoutes);


module.exports = router;
