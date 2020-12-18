const schedule = require('node-schedule');
const auctionService = require('../services/auctionService');
const userService = require('../services/userService');
const { RESPONSE, MESSAGE } = require('../constants');
const { getPhotoUrl, sendMail } = require('../utils');

exports.getAllAuctions = async (req, res, next) => {
  try {
    const auctionsInfo = await auctionService.findAllAuctions();

    res.status(200).json({ result: RESPONSE.OK, auctionsInfo });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.createAuction = async (req, res, next) => {
  const { _id: userId, email, name } = res.locals.userInfo;
  const awsPhotoUrlList = getPhotoUrl(req.files);
  const payload = req.body;

  payload.picturesUrl = awsPhotoUrlList;
  payload.userId = userId;

  try {
    const auctionInfo = await auctionService.createAuction(payload);
    const { _id, startedDateTime } = auctionInfo;
    await userService.addMyAuction(auctionInfo, userId);

    schedule.scheduleJob(startedDateTime, () => {
      sendMail(email, name, _id, MESSAGE.AUCTION_TIME_ARRIVED);
    });

    res.status(201).json({ result: RESPONSE.OK, auctionInfo });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.reserveAuction = async (req, res, next) => {
  const { _id: userId } = res.locals.userInfo;
  const { auctionId } = req.params;

  try {
    await auctionService.reserveAuction(userId, auctionId);
    await userService.addReservedAuction(userId, auctionId);

    const updatedAuctionsInfo = await auctionService.findAllAuctions();

    res.status(200).json({ result: RESPONSE.OK, updatedAuctionsInfo });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.startAuction = async (req, res, next) => {
  const { auctionId } = req.params;

  try {
    const { isStarted, reservedUser } = await auctionService.startAuction(
      auctionId
    );

    if (!isStarted) {
      reservedUser.forEach(async (userId) => {
        const { email, name } = await userService.getUserById(userId);
        sendMail(email, name, auctionId, MESSAGE.AUCTION_START);
      });
    }

    res.status(200).json({ result: RESPONSE.OK });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.finishAuction = async (req, res, next) => {
  const { auctionId } = req.params;
  const payload = req.body;

  try {
    await auctionService.finishAuction(payload, auctionId);

    res.status(200).json({ result: RESPONSE.OK });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
