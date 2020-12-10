const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const AuctionSchema = new Schema(
  {
    title: { type: String, required: true },
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    picturesUrl: [{ type: String, required: true }],
    description: { type: String, required: true },
    initalPrice: { type: Number, required: true },
    winner: { type: Schema.Types.ObjectId, ref: 'User' },
    finalPrice: { type: Number },
    startedDateTime: { type: Date, required: true },
    isStarted: { type: Boolean, default: false },
    isFinished: { type: Boolean, default: false },
    host: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    winner: { type: Schema.Types.ObjectId, ref: 'User' },
    reservedUser: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  schemaOptions
);

module.exports = mongoose.model('Auction', AuctionSchema);
