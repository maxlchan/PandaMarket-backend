const Auction = require('../models/Auction');

exports.findAllAuctions = async () => {
  try {
    const auctions = await Auction.find();

    return auctions;
  } catch (err) {
    throw new Error(err);
  }
};

exports.createAuction = async (payload) => {
  const { userId } = payload;

  try {
    const auction = await Auction.create({ ...payload, host: userId });

    return auction;
  } catch (err) {
    throw new Error(err);
  }
};

exports.reserveAuction = async (userId, auctionId) => {
  try {
    await Auction.findByIdAndUpdate(auctionId, {
      $addToSet: { reservedUser: userId },
    });
  } catch (err) {
    throw new Error(err);
  }
};

exports.startAuction = async (auctionId) => {
  try {
    const auction = await Auction.findByIdAndUpdate(auctionId, {
      isStarted: true,
    });

    return auction;
  } catch (err) {
    throw new Error(err);
  }
};

exports.finishAuction = async (payload, auctionId) => {
  const { winner, finalPrice } = payload;

  try {
    await Auction.findByIdAndUpdate(auctionId, {
      winner,
      finalPrice,
      isFinished: true,
    });
  } catch (err) {
    throw new Error(err);
  }
};
