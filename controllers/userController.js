const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const { RESPONSE } = require('../constants');

exports.login = async (req, res, next) => {
  const payload = req.body;

  try {
    const userInfo = await userService.getOrCreateUser(payload);
    const { _id, email, name } = userInfo;
    const token = jwt.sign({ _id, email, name }, process.env.JWT_SECRET);

    res.status(200).json({ result: RESPONSE.OK, userInfo, token });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.loginByToken = async (req, res, next) => {
  const token = req.get('authorization');

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    const userInfo = await userService.getUserByEmail(decodedUser.email);

    // await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));

    res.status(200).json({ result: RESPONSE.OK, userInfo });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
