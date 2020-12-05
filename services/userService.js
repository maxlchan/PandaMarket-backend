const User = require('../models/User');

exports.getOrCreateUser = async (payload) => {
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

exports.getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });

    return user;
  } catch (error) {
    throw new Error(error);
  }
};

exports.addMyAuction = async (payload, userId) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { myAuctions: payload },
    });
  } catch (error) {
    throw new Error(error);
  }
};
