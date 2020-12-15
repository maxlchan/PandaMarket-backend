exports.getPhotoUrl = (photosInfo) => {
  return photosInfo.map((photo) => photo.location);
};
