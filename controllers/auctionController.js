const auctionService = require('../services/auctionService');
const userService = require('../services/userService');
const { getPhotoUrl } = require('../middlewares/uploadPhotos');
const { RESPONSE } = require('../constants');

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
  const { _id: userId } = res.locals.userInfo;
  const awsPhotoUrlList = getPhotoUrl(req.files);
  const payload = req.body;
  const { startedDateTime } = payload;

  payload.picturesUrl = awsPhotoUrlList;
  payload.userId = userId;
  payload.startedDateTime = new Date(startedDateTime);

  try {
    const auctionInfo = await auctionService.createAuction(payload);
    await userService.addMyAuction(auctionInfo, userId);

    res.status(201).json({ result: RESPONSE.OK, auctionInfo });
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

    res.status(201).json({ result: RESPONSE.OK })
  } catch (err) {
    console.error(err);
    next(err);
  }
};
