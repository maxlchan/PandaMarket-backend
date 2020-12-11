const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  USERS: '/users',
  USER_DETAIL: '/:userId',
  TOKEN: '/token',
  AUTIONS: '/auctions',
  AUTION_DETAIL: '/:auctionId',
  FINISH: '/finish',
  RESERVE: '/reserve',
  UPLOAD: '/upload',
};

const RESPONSE = {
  OK: 'OK',
  FAILURE: 'FAILURE',
  INTERNAL_SEVER_ERROR: 'INTERNAL_SEVER_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
};

module.exports = { ROUTES, RESPONSE };
