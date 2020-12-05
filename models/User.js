const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    imageUrl: { type: String },
    myAuctions: [{ type: Schema.Types.ObjectId, ref: 'Auction' }],
    reservedAuctions: [{ type: Schema.Types.ObjectId, ref: 'Auction' }],
  },
  schemaOptions
);

module.exports = mongoose.model('User', UserSchema);
