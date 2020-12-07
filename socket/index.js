const socketIo = require('socket.io');

// const rooms = {
//   roomId: {
//     users: [
//       {
//         _id: 'asdasdad32423',
//         name: '김찬중',
//         imageUrl: 'https//:lh3adasd',
//         socketId: 'adsad3234',
//       },
//     ],
//     winnerList: ['a2asdjhakj23a', '423adasdas'],
//     priceList: [1000, 5000],
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
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('io connect!');
    console.log(socket.id);
    socket.on('create room', ({ roomId, user }) => {
      const socketId = socket.id;
      const host = { ...user, roomId, socketId };

      const newRoom = {
        host,
        members: [],
        currentWinnerIdStack: [],
        currentHighPriceStack: [],
      };

      rooms[roomId] = newRoom;
      members[socketId] = host;

      socket.join(roomId);
    });

    socket.on('join room', ({ roomId, user }) => {
      if (!rooms[roomId]) return;

      const socketId = socket.id;
      const newMember = { ...user, roomId, socketId: socket.id };

      rooms[roomId].members.push(newMember);
      members[socketId] = newMember;

      socket.join(roomId);

      socket.broadcast.to(roomId).emit('member join room', socket.id);
    });

    socket.on('offer', (targetSocketId, event) => {
      console.log(1232132);
      socket.to(targetSocketId).emit('offer', socket.id , event.sdp);
    });

    socket.on('answer', (event) => {
      const hostSocketId = rooms[event.roomId].host.socketId;

      socket.to(hostSocketId).emit('answer', socket.id, event.sdp);
    });

    socket.on('candidate', (targetSocketId, event) => {
      io.to(targetSocketId).emit('candidate', socket.id, event);
    });

    socket.on('disconnect', () => {
      if (!members[socket.id]) return;

      const leaveMember = members[socket.id];
      const { roomId } = leaveMember;
      const isHostLeaved = rooms[roomId].host._id === leaveMember._id;

      delete members[socket.id];

      if (isHostLeaved) {
        console.log(33333333);
        // delete rooms[roomId];
        // socket.broadcast.to(roomId).emit('auction broked');
      }

      // const leaveMemberIndex = rooms[roomId].members.findIndex(
      //   (member) => member.socketId === socket.id
      // );

      // rooms.members.splice(leaveMemberIndex, 1);
      // socket.leave(roomId);
    });
  });
};

module.exports = initSocket;
