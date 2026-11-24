const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const orderSchema = new mongoose.Schema(
  {
    postcode: { type: String},
    address: mongoose.Schema.Types.Mixed,
    address_detail: { type: String },
    company: { type: Boolean },
    individual: { type: Boolean },
    phone_number: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    tax_number: { type: String },
    company_name: { type: String },
    payment_done: { type: Boolean, required: true },
    payment_id: { type: String, required: true },
    delivery_time: { type: String, required: true },
    delivery_date: { type: String, required: true },
    collection_time: { type: String, required: true },
    collection_date: { type: String, required: true },
    driver_instructions_delivery_time: String,
    driver_instructions_collection_time: String,
    special_instructions: String,
    orderPrice: { type: String, required: true },
    serviceFee: { type: String, required: true },
    totalPrice: { type: String, required: true },
    selected_services: [],
    bundles:[],
    orderId:{ type: String },
    addressType: { type: String, enum: ['home', 'office', 'hotel'] },
    frequency: { type: String, enum: ['just once', 'weekly', 'every two weeks', 'every four weeks'] },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled', 'delivered'],
      default: 'pending',
    },

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  },
  { timestamps: true },
);

orderSchema.plugin(uniqueValidator);

const ORDER = mongoose.model('order', orderSchema);
module.exports = ORDER;
