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
}

module.exports = { mongoose, socket };
