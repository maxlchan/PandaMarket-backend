const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3 } = require('../config');

const uploadPhoto = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'panda-market',
    acl: 'public-read-write',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, Object.assign({}, req.body));
    },
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
}).array('image', 5);

module.exports = uploadPhoto;
