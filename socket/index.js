const socketIo = require('socket.io');
const config = require('../config');

// const rooms = {
//   roomId: {
//    host: {},
//    members: [],
//    messages: [],
//    winnerList: [],
//    highestBidPriceList: [],
//    isCountdownStart: false,
//    timeCount: null,
//   }
// };

// const members = {
//   sockId: {
//     _id: 'asdasdad32423',
//     name: '김찬중',
//     imageUrl: 'https//:lh3adasd',
//     socketId: 'adsad3234',
//   },
// };

const members = {};
const rooms = {};

const initSocket = (server) => {
  const io = socketIo(server, config.socket);

  io.on('connection', (socket) => {
    console.log('io connect!');
    console.log(socket.id);
    let countdownId;

    socket.on('create room', ({ roomId, user }) => {
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
        isEnd: false,
      };

      rooms[roomId] = newRoom;
      members[socketId] = host;

      socket.join(roomId);
    });

    socket.on('join room', ({ roomId, user }) => {
      const currentRoom = rooms[roomId];
      if (!currentRoom) return;

      const socketId = socket.id;
      const newMember = { ...user, roomId, socketId };
      const currentRoomMembers = currentRoom.members;

      currentRoomMembers.push(newMember);
      members[socketId] = newMember;

      socket.join(roomId);
      io.to(roomId).emit('member join room', socketId, user, currentRoom);
    });

    socket.on('offer', (targetSocketId, event) => {
      socket.to(targetSocketId).emit('offer', socket.id, event.sdp);
    });

    socket.on('answer', (event) => {
      const hostSocketId = rooms[event.roomId].host.socketId;

      socket.to(hostSocketId).emit('answer', socket.id, event.sdp);
    });

    socket.on('candidate', (targetSocketId, event) => {
      socket.to(targetSocketId).emit('candidate', socket.id, event);
    });

    socket.on('send message', (message) => {
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

      io.in(roomId).emit('send message', currentRoom);
    });

    socket.on('send private message', (message) => {
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

      io.in(roomId).emit('send private message', currentRoom);
    });

    socket.on('update highest bid price', (price) => {
      const currentMember = members[socket.id];
      const { roomId, _id, name } = currentMember;
      const currentRoom = rooms[roomId];

      currentRoom.highestBidPriceList.push(price);
      currentRoom.winnerList.push({ _id, name });
      currentRoom.timeCount = null;
      currentRoom.isCountdownStart = false;

      clearInterval(countdownId);

      io.in(roomId).emit('update highest bid price', currentRoom);
    });

    socket.on('countdown', (limitedSeconds) => {
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

        io.in(roomId).emit('countdown', currentRoom);
        currentRoom.timeCount--;
      }, 1000);
    });

    socket.on('broadcast end', () => {
      const { roomId } = members[socket.id];
      const currentRoom = rooms[roomId];

      currentRoom.isEnd = true;
    });

    socket.on('leave room', () => {
      const socketId = socket.id;
      const { roomId } = members[socketId];
      delete members[socketId];

      socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      if (!members[socket.id]) return;

      const leaveMember = members[socket.id];
      const { roomId, _id: leaveMemberId } = leaveMember;
      const currentRoom = rooms[roomId];
      const isHostLeaved = currentRoom && currentRoom.host._id === leaveMemberId;

      delete members[socket.id];

      if (isHostLeaved) {
        delete rooms[roomId];
        socket.leave(roomId);
        socket.broadcast.to(roomId).emit('room broked by host');

        return;
      }

      const currentWinner = currentRoom.winnerList.slice(-1)[0];
      const isWinnerLeaved =
        currentWinner && currentWinner._id === leaveMemberId;

      if (isWinnerLeaved) {
        currentRoom.winnerList.pop();
        currentRoom.highestBidPriceList.pop();

        clearInterval(countdownId);
      }

      const leaveMemberIndex = currentRoom.members.findIndex(
        (member) => member._id === leaveMemberId
      );

      currentRoom.members.splice(leaveMemberIndex, 1);

      socket.leave(roomId);
      socket.broadcast
        .to(roomId)
        .emit('leave room', socket.id, leaveMember.name, currentRoom);
    });
  });
};

module.exports = initSocket;
