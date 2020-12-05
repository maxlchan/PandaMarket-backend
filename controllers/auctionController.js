const { RESPONSE } = require('../constants');
const auctionService = require('../services/auctionService');
const { getPhotoUrl } = require('../middlewares/uploadPhotos');
const userService = require('../services/userService');

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
  } catch (error) {
    console.error(error);
    next(error);
  }
};
