const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const appVersionSchema = new mongoose.Schema(
  {
    ios_version: { type: String, default: '0' },
    android_version: { type: String, default: '0' },
  },
  {
    timestamps: true,
  },
);

appVersionSchema.plugin(uniqueValidator);

const APP_VERSION = mongoose.model('app_version', appVersionSchema);

module.exports = APP_VERSION;
