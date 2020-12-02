const express = require('express');
const auctionsRouter = express.Router();
const ROUTES = require('../constants/routes');

auctionsRouter.get(ROUTES.HOME, (req, res, next) => {
  res.render('index', { title: 'Express' });
});

module.exports = auctionsRouter;
