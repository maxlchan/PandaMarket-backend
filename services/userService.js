const User = require('../models/User');

exports.getUserInfo = async (payload) => {
  const { email, name, imageUrl } = payload;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { email, name, imageUrl },
      { new: true, upsert: true }
    );

    return user;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getUserInfoByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });

    return user;
  } catch (error) {
    throw new Error(error);
  }
};
