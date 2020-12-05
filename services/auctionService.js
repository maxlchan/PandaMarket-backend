const Auction = require('../models/Auction');

exports.createAuction = async (payload) => {
  const { userId } = payload;

  try {
    const auction = await Auction.create({ ...payload, host: userId });

    return auction;
  } catch (error) {
    throw new Error(error);
  }
};
