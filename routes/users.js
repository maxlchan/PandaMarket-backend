const express = require('express');
const usersRouter = express.Router();
const userController = require('../controllers/userController');
const verifyToken= require('../middlewares/verifyToken');
const { ROUTES } = require('../constants');

usersRouter.post(ROUTES.LOGIN, userController.login);
usersRouter.post(
  `${ROUTES.LOGIN}${ROUTES.TOKEN}`,
  verifyToken,
  userController.loginByToken
);

module.exports = usersRouter;
