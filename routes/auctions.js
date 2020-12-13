const express = require('express');
const auctionsRouter = express.Router();
const auctionController = require('../controllers/auctionController');
const { ROUTES } = require('../constants');
const verifyToken = require('../middlewares/verifyToken');
const { uploadPhoto } = require('../middlewares/uploadPhotos');

auctionsRouter.get(ROUTES.HOME, auctionController.getAllAuctions);

auctionsRouter.post(
  ROUTES.HOME,
  verifyToken,
  uploadPhoto,
  auctionController.createAuction
);

auctionsRouter.put(
  `${ROUTES.AUTION_DETAIL}${ROUTES.RESERVE}`,
  verifyToken,
  auctionController.reserveAuction
);

auctionsRouter.put(
  `${ROUTES.AUTION_DETAIL}${ROUTES.START}`,
  verifyToken,
  auctionController.startAuction
);

auctionsRouter.put(
  `${ROUTES.AUTION_DETAIL}${ROUTES.FINISH}`,
  verifyToken,
  auctionController.finishAuction
);

module.exports = auctionsRouter;
