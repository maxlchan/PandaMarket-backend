const express = require('express');
const usersRouter = express.Router();
const userController = require('../controllers/userController');
const { ROUTES } = require('../constants');

usersRouter.post(ROUTES.LOGIN, userController.login);
usersRouter.post(`${ROUTES.LOGIN}${ROUTES.TOKEN}`, userController.loginByToken);

module.exports = usersRouter;
