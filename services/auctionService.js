const Auction = require('../models/Auction');

exports.findAllAuctions = async () => {
  try {
    const auctions = await Auction.find();

    return auctions;
  } catch (error) {
    throw new Error(error);
  }
}

exports.createAuction = async (payload) => {
  const { userId } = payload;

  try {
    const auction = await Auction.create({ ...payload, host: userId });

    return auction;
  } catch (error) {
    throw new Error(error);
  }
};
