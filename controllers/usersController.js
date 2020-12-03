const jwt = require('jsonwebtoken');
const { RESPONSE } = require('../constants');
const userService = require('../services/userService');

exports.login = async (req, res, next) => {
  const payload = req.body;

  try {
    const { _id, email, name, imageUrl } = await userService.getUserInfo(payload);
    const userInfo = { _id, email, name, imageUrl };
    const token = jwt.sign({ _id, email, name }, process.env.JWT_SECRET);

    res.status(200).json({ result: RESPONSE.OK, userInfo, token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.loginByToken = async (req, res, next) => {
  const token = req.get('authorization');

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    const { _id, email, name, imageUrl } = await userService.getUserInfoByEmail(decodedUser.email);
    const userInfo = { _id, email, name, imageUrl };

    res.status(200).json({ result: RESPONSE.OK, userInfo });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
