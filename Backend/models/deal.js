const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const dealSchema = new mongoose.Schema(
  {
    image: { type: String },
    description: { type: String },
    price: { type: String, required: true },
    category: { type: String, required: true },
    sub_category: { type: String, required: true },
    title: { type: String, unique: true, required: true },
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'service', required: true },
  },
  {
    timestamps: true,
  },
);

dealSchema.plugin(uniqueValidator);

const DEAL = mongoose.model('deal', dealSchema);

module.exports = DEAL;
