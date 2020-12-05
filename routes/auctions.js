const express = require('express');
const auctionsRouter = express.Router();
const auctionController = require('../controllers/auctionController');
const { ROUTES } = require('../constants');
const verifyToken = require('../middlewares/verifyToken');
const { uploadPhoto } = require('../middlewares/uploadPhotos');

auctionsRouter.post(ROUTES.HOME, verifyToken, uploadPhoto.array('image', 5), auctionController.createAuction);

module.exports = auctionsRouter;
