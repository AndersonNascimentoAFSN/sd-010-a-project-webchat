const moment = require('moment');

module.exports = (io) => io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id} `);

  socket.on('message', (data) => {
    const { nickname, chatMessage } = data;
    io.emit('message', `${moment().format('DD-MM-yyyy h:mm:ss a')} - ${nickname}: ${chatMessage}`);
  });
});