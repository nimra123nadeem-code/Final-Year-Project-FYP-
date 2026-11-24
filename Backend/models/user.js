const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    first_name: String,
    last_name: String,
    phone_number: String,
    fcm_token: String,
    reset_token: { type: String },
    reset_token_expiration: { type: String },
    postal_code: { type: String },
    region: { type: String },
    cnic: { type: String },
    address: { type: String },
    country: { type: String },
    town: { type: String },
    bundles: [],
    type: { type: String, enum: ['admin', 'user'], required: true },
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(uniqueValidator);

const USER = mongoose.model('user', userSchema);

module.exports = USER;
