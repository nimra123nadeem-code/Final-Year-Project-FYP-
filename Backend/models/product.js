const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const products = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }, // image filename or URL
    category: { type: String }, // image filename or URL
    
  },
  {
    _id: true,
  },
);

products.plugin(uniqueValidator);

const PRODUCTS = mongoose.model('products', products);

module.exports = PRODUCTS;
