const jwt = require('jsonwebtoken');
const { RESPONSE } = require('../constants');

const verifyToken = async (req, res, next) => {
  const token = req.get('authorization');

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.userInfo = userInfo;

    next();
  } catch (error) {
    res.status(401).json({ result: RESPONSE.UNAUTHORIZED });
  }
};

module.exports = verifyToken;
