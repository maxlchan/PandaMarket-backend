const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  USERS: '/users',
  USER_DETAIL: '/:userId',
  TOKEN: '/token',
  AUCTIONS: '/auctions',
  AUCTION_DETAIL: '/:auctionId',
  START: '/start',
  FINISH: '/finish',
  RESERVE: '/reserve',
  UPLOAD: '/upload',
  BROADCAST: '/broadcast',
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

const MESSAGE = {
  AUCTION_TIME_ARRIVED: '[🐼팬더마켓] 예약하신 경매물품의 시간이 임박했습니다',
  AUCTION_START: '[🐼팬더마켓] 예약하신 경매가 시작되었습니다',
};

const CLIENT_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://www.pandamarket.live'
    : 'http://localhost:3000';

module.exports = { ROUTES, RESPONSE, SOCKET_EVENT, MESSAGE, CLIENT_BASE_URL };
