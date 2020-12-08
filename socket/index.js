const socketIo = require('socket.io');

// const rooms = {
//   roomId: {
//     members: [
//       {
//         _id: 'asdasdad32423',
//         name: '김찬중',
//         imageUrl: 'https//:lh3adasd',
//         socketId: 'adsad3234',
//       },
//     ],
//     messages: [],
//     winnerList: ['a2asdjhakj23a', '423adasdas'],
//     highestPriceList: [1000, 5000],
//   },
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
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('io connect!');
    console.log(socket.id);

    socket.on('create room', ({ roomId, user }) => {
      const socketId = socket.id;
      const host = { ...user, roomId, socketId };

      const newRoom = {
        host,
        members: [],
        messages: [],
        winnerList: [],
        highestPriceList: [],
      };

      rooms[roomId] = newRoom;
      members[socketId] = host;

      socket.join(roomId);
    });

    socket.on('join room', ({ roomId, user }, callback) => {
      const currentRoom = rooms[roomId];
      if (!currentRoom) return;

      const newMember = { ...user, roomId, socketId: socket.id };
      const socketId = socket.id;
      const currentRoomMessages = currentRoom.messages;
      const currentHighestPrice = currentRoom.highestPriceList.slice(-1)[0];
      const currentWinner = currentRoom.winnerList.slice(-1)[0];
      const currentRoomMembers = currentRoom.members;

      currentRoomMembers.push(newMember);
      members[socketId] = newMember;
      socket.join(roomId);
      socket.broadcast.to(roomId).emit('member join room', socketId, user);

      callback(
        currentRoomMessages,
        currentHighestPrice,
        currentWinner && currentWinner.name,
        currentRoomMembers.length
      );
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

    socket.on('send message', (message, roomId) => {
      const currentRoom = rooms[roomId];
      const currentMember = members[socket.id];
      const { name, imageUrl } = currentMember;
      const isHost = currentRoom.host._id === currentMember._id;

      const messageData = { message, name, imageUrl, isHost };
      const { messages } = rooms[roomId];

      console.log(messageData);
      messages.push(messageData);
      io.in(roomId).emit('send message', messages);
    });

    socket.on('update highest bid price', (price) => {
      const currentMember = members[socket.id];
      const { roomId, _id, name } = currentMember;
      const currentRoom = rooms[roomId];

      currentRoom.highestPriceList.push(price);
      currentRoom.winnerList.push({ _id, name });

      console.log(currentRoom.winnerList);
      io.in(roomId).emit('update highest bid price', price, name);
    });

    socket.on('leave', (roomId) => {
      socket.leave(roomId);
    });

    socket.on('disconnect', (reason) => {
      if (!members[socket.id]) return;

      const leaveMember = members[socket.id];
      const { roomId } = leaveMember;
      const isHostLeaved = rooms[roomId].host._id === leaveMember._id;

      delete members[socket.id];

      if (isHostLeaved) {
        delete rooms[roomId];
        socket.broadcast.to(roomId).emit('room broked by host');

        return;
      }

      const leaveMemberIndex = rooms[roomId].members.findIndex(
        (member) => member.socketId === socket.id
      );

      rooms[roomId].members.splice(leaveMemberIndex, 1);

      socket.leave(roomId);
      socket.broadcast
        .to(roomId)
        .emit('member leave room', socket.id, leaveMember.name);
    });
  });
};

module.exports = initSocket;
