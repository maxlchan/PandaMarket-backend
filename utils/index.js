const { transporter } = require('../config');
const { ROUTES, CLIENT_BASE_URL } = require('../constants');

exports.getPhotoUrl = (photosInfo) => {
  return photosInfo.map((photo) => photo.location);
};

exports.sendMail = async (email, name, auctionId, subject) => {
  try {
    await transporter.sendMail({
      from: '"팬더 마켓🐼"',
      to: email,
      subject,
      html: `<h3>안녕하세요 ${name}님. 팬더 마켓입니다.</h3>
        <a href=${CLIENT_BASE_URL}${ROUTES.AUCTIONS}/${auctionId}${ROUTES.BROADCAST}>해당 주소</a>
        <span>로 입장해주세요.</span>`,
    });
  } catch (err) {
    console.error(err);
  }
};
