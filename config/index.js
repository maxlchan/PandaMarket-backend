const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const mongoose = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

const nodeMailer = {
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodeMailer);

const aws = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'ap-northeast-2',
};

AWS.config.update(aws);
const s3 = new AWS.S3(aws);

module.exports = { mongoose, s3, transporter };
