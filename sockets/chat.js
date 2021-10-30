const moment = require('moment');
const messageController = require('../controllers/chat');

const date = moment().format('DD-MM-YYYY HH:mm:ss'); // https://momentjs.com/
const users = [];

let conta = 0;

const initConnection = (io, socket, newNicknName) => {
  socket.on('initConnection', () => {
    io.emit('showNicknamesOfUsersLoggeds', `${newNicknName}`); 
    socket.emit('listOldUsers', users);
  });
};

const saveUserOnArray = (io, socket) => {
  socket.on('saveUserOnArray', (newUserLogged) => {
    if (io.engine.clientsCount > users.length ) {
      conta += 1;
      console.log('tamanho', io.engine.clientsCount)
      console.log('contagem', conta);
      users.push(newUserLogged);
    }
  });
};

const changeNickname = (io, socket) => {
  socket.on('newNickname', ({ newNickname, id }) => {
    users.forEach((user, index) => {
      if (user.id === id)users[index].innerText = newNickname;
    });
    socket.broadcast.emit('changeNickname', { newNickname, id });
  });
};

module.exports = (io) => io.on('connection', async (socket) => {
    const newNicknName = socket.id.slice(0, 16);
    
    initConnection(io, socket, newNicknName);

    saveUserOnArray(io, socket);

    changeNickname(io, socket);
    
    socket.on('message', async ({ chatMessage, nickname }) => {
      const newMessage = `${date} - ${nickname}: ${chatMessage}`;
      io.emit('message', newMessage);
      await messageController.saveMessages({ message: chatMessage, nickname, timestamp: date });
    });
    //socket.disconnect(0);
});
