// const Language = require('../models/Language');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Cliente ${socket.id} acabou de entrar`);
  
    socket.on('updateUsername', (newUsername) => {
      console.log(newUsername);
    // io.emit('updateUsernameList', newUsername);
    });
    socket.on('message', (message) => {
      console.log(message);
      io.emit('message', message);
    });
  });  
};