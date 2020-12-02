const express = require('express');
const usersRouter = express.Router();
const ROUTES = require('../constants/routes');

usersRouter.get(ROUTES.HOME, (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = usersRouter;
