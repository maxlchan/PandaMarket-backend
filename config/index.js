const dotenv = require('dotenv');
dotenv.config();

const dbUrl = process.env.MONGO_DB_URL;
const mongoose = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

module.exports = { dbUrl, mongoose };
