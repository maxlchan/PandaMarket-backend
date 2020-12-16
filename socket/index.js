const socketIo = require('socket.io');
const { SOCKET_EVENT } = require('../constants');

const rooms = {};
const members = {};

const initSocket = (server) => {
  const io = socketIo(server);

  io.on(SOCKET_EVENT.CONNECTION, (socket) => {
    socket.on(SOCKET_EVENT.CREATE_ROOM, ({ roomId, user }) => {
      if (rooms[roomId]) return;

      const socketId = socket.id;
      const host = { ...user, roomId, socketId };
      const newRoom = {
        host,
        members: [],
        messages: [],
        privateMessages: [],
        winnerList: [],
        highestBidPriceList: [],
        isCountdownStart: false,
        timeCount: null,
        isFinished: false,
      };

      rooms[roomId] = newRoom;
      members[socketId] = host;
      socket.join(roomId);
    });

    socket.on(SOCKET_EVENT.JOIN_ROOM, ({ roomId, user }) => {
      const currentRoom = rooms[roomId];
      if (!currentRoom) return;

      const socketId = socket.id;
      const newMember = { ...user, roomId, socketId };
      const currentRoomMembers = currentRoom.members;
      const isInRoom = currentRoomMembers.find((member) => {
        return member._id === user._id;
      });

      if (!isInRoom) currentRoomMembers.push(newMember);

      members[socketId] = newMember;
      socket.join(roomId);

      io.to(roomId).emit(SOCKET_EVENT.MEMBER_JOIN_ROOM, socketId, currentRoom);
    });

    socket.on(SOCKET_EVENT.OFFER, (targetSocketId, event) => {
      socket.to(targetSocketId).emit(SOCKET_EVENT.OFFER, socket.id, event.sdp);
    });

    socket.on(SOCKET_EVENT.ANSWER, (event) => {
      const { host } = rooms[event.roomId];

      socket.to(host.socketId).emit(SOCKET_EVENT.ANSWER, socket.id, event.sdp);
    });

    socket.on(SOCKET_EVENT.CANDIDATE, (targetSocketId, event) => {
      socket.to(targetSocketId).emit(SOCKET_EVENT.CANDIDATE, socket.id, event);
    });

    socket.on(SOCKET_EVENT.SEND_MESSAGE, (message) => {
      const currentMember = members[socket.id];
      const { roomId, name, imageUrl, _id: currentMemberId } = currentMember;
      const currentRoom = rooms[roomId];
      const currentMessages = currentRoom.messages;
      const isHost = currentRoom.host._id === currentMemberId;

      const messageData = {
        message,
        name,
        imageUrl,
        isHost,
        ownerId: currentMemberId,
      };

      currentMessages.push(messageData);

      io.in(roomId).emit('change room status', currentRoom);
    });

    socket.on(SOCKET_EVENT.SEND_PRIVATE_MESSAGE, (message) => {
      const currentMember = members[socket.id];
      const { roomId, name, imageUrl, _id: currentMemberId } = currentMember;
      const currentRoom = rooms[roomId];
      const currentPrivateMessages = currentRoom.privateMessages;
      const isHost = currentRoom.host._id === currentMemberId;

      const messageData = {
        message,
        name,
        imageUrl,
        isHost,
        ownerId: currentMemberId,
      };

      currentPrivateMessages.push(messageData);

      io.in(roomId).emit(SOCKET_EVENT.CHANGE_ROOM_STATUS, currentRoom);
    });

    let countdownId;

    socket.on(SOCKET_EVENT.UPDATE_HIGHEST_BID_PRICE, (price) => {
      const currentMember = members[socket.id];
      const { roomId, _id, name } = currentMember;
      const currentRoom = rooms[roomId];

      currentRoom.highestBidPriceList.push(price);
      currentRoom.winnerList.push({ _id, name });
      currentRoom.timeCount = null;
      currentRoom.isCountdownStart = false;

      clearInterval(countdownId);

      const payload = { name, price };

      io.in(roomId).emit(SOCKET_EVENT.CHANGE_ROOM_STATUS, currentRoom);
      io.in(roomId).emit(SOCKET_EVENT.UPDATE_HIGHEST_BID_PRICE, payload);
    });

    socket.on(SOCKET_EVENT.COUNTDOWN, (limitedSeconds) => {
      const { roomId } = members[socket.id];
      const currentRoom = rooms[roomId];

      timeCount = limitedSeconds;

      currentRoom.timeCount = limitedSeconds;
      currentRoom.isCountdownStart = true;

      countdownId = setInterval(() => {
        if (currentRoom.timeCount === -1) {
          clearInterval(countdownId);
          return;
        }

        io.in(roomId).emit(SOCKET_EVENT.CHANGE_ROOM_STATUS, currentRoom);
        currentRoom.timeCount--;
      }, 1000);
    });

    socket.on(SOCKET_EVENT.FINISH_BROADCAST, () => {
      const { roomId } = members[socket.id];
      const currentRoom = rooms[roomId];

      currentRoom.isFinished = true;
    });

    socket.on(SOCKET_EVENT.LEAVE_ROOM, () => {
      const socketId = socket.id;
      const { roomId } = members[socketId];

      delete members[socketId];
      socket.leave(roomId);
    });

    socket.on(SOCKET_EVENT.DISCONNECT, () => {
      const socketId = socket.id;
      const leaveMember = members[socketId];

      if (!leaveMember) return;

      delete members[socketId];

      const { roomId, _id: leaveMemberId } = leaveMember;
      const currentRoom = rooms[roomId];
      const isHostLeaved = currentRoom && currentRoom.host._id === leaveMemberId;

      if (isHostLeaved) {
        delete rooms[roomId];
        socket.leave(roomId);
        socket.broadcast.to(roomId).emit(SOCKET_EVENT.ROOM_BROKED_BY_HOST);

        return;
      }

      const currentRoomMembers = currentRoom.members;
      const currentWinnerList = currentRoom.winnerList;
      const currentHighestBidPriceList = currentRoom.highestBidPriceList;
      const currentWinner = currentWinnerList.slice(-1)[0];
      const isWinnerLeaved = currentWinner && (currentWinner._id === leaveMemberId);

      if (isWinnerLeaved) {
        currentRoom.isCountdownStart = false;
        currentRoom.timeCount = null;

        clearInterval(countdownId);
      }

      for (let i = 0; i < currentWinnerList.length; i++) {
        if (currentWinnerList[i]._id === leaveMemberId) {
          currentWinnerList.splice(i, 1);
          currentHighestBidPriceList.splice(i, 1);
          i--;
        };
      }

      const leaveMemberIndex = currentRoomMembers.findIndex((member) => {
        return member._id === leaveMemberId;
      });

      currentRoomMembers.splice(leaveMemberIndex, 1);

      socket.leave(roomId);

      socket.broadcast
        .to(roomId)
        .emit(SOCKET_EVENT.LEAVE_ROOM, socketId, currentRoom);
    });
  });
};

module.exports = initSocket;
