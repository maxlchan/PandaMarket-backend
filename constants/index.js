const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  USERS: '/users',
  USER_DETAIL: '/:userId',
  TOKEN: '/token',
  AUTIONS: '/auctions',
  AUTION_DETAIL: '/:auctionId',
  START: '/start',
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

const SOCKET_EVENT = {
  CONNECTION: 'connection',
  CREATE_ROOM: 'create room',
  JOIN_ROOM: 'join room',
  LEAVE_ROOM: 'leave room',
  OFFER: 'offer',
  ANSWER: 'answer',
  CANDIDATE: 'candidate',
  UPDATE_HIGHEST_BID_PRICE: 'update highest bid price',
  SEND_MESSAGE: 'send message',
  COUNTDOWN: 'countdown',
  MEMBER_JOIN_ROOM: 'member join room',
  CHANGE_ROOM_STATUS: 'change room status',
  FINISH_BROADCAST: 'finish broadcast',
  ROOM_BROKED_BY_HOST: 'room broked by host',
  SEND_PRIVATE_MESSAGE: 'send private message',
  DISCONNECT: 'disconnect',
};

module.exports = { ROUTES, RESPONSE, SOCKET_EVENT };
