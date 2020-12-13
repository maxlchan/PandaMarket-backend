const createError = require('http-errors');
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const sche = require('nodemailer');
const initLoader = require('./loaders');
const dbLoader = require('./loaders/db');

initLoader(app);
dbLoader();

const { ROUTES, RESPONSE } = require('./constants');

const usersRouter = require('./routes/users');
const auctionsRouter = require('./routes/auctions');

const main = async () => {
  const testAccount = await nodemailer.createTestAccount();
  console.log(testAccount);
};
const mailSender = {
  sendGmail: () => {
    transporter = mailer;
  },
};

main();

app.use(ROUTES.USERS, usersRouter);
app.use(ROUTES.AUTIONS, auctionsRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  console.error(err);

  err.status
    ? res.status(err.status).json({ result: err.message })
    : res.status(500).json({ result: RESPONSE.INTERNAL_SEVER_ERROR });
});

module.exports = app;
