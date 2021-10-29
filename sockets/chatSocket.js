/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */

const moment = require('moment');
const { saveMsgModel } = require('../models/chatModel');

const messageMoment = moment().format('DD-MM-yyyy HH:mm:ss A');
const userList = [];

module.exports = (io) => {
  io.on('connection', (socket) => {
    const { id } = socket;
    const randomNick = id.substr(0, 16);

    userList.push({
      id,
      genericUser: randomNick,
    });

    io.emit('addNewUser', randomNick);
    io.emit('refreshList', userList);

    socket.on('message', async ({ chatMessage, nickname }) => {
      io.emit('message', `${messageMoment} - ${nickname}: ${chatMessage}`);
      await saveMsgModel({ message: chatMessage, nickname, timestamp: messageMoment });
    });

    socket.on('replaceUser', ({ oldUser, newUser }) => {
      userList.forEach(({ genericUser }, i) => {
        if (genericUser === oldUser) userList[i].genericUser = newUser;
      });
      io.emit('refreshList', userList);
    });

    socket.on('disconnect', () => {
      userList.forEach((user, i) => {
        if (user.id === socket.id) userList.splice(i, 1);
      });
      console.log(userList);
      io.emit('refreshList', userList);
    });
  });
};