const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const cart = new mongoose.Schema(
  {
    product: {
      type: Object,
      required: true
    }
  },
  {
    timestamps: true
  }
);


cart.plugin(uniqueValidator);

const CART = mongoose.model('cart', cart);

module.exports = CART;

