const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userJwtSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    token: { type: String },
    iat: { type: Date },
    exp: { type: Date },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const USER_JWT = model('user_jwt', userJwtSchema);

module.exports = USER_JWT;
