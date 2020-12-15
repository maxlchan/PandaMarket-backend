const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

const mongoose = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

const socket = {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
};

const aws = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'ap-northeast-2',
}

AWS.config.update(aws);
const s3 = new AWS.S3(aws);

module.exports = { mongoose, socket, s3 };
