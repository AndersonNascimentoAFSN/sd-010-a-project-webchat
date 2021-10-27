const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(server, {
  cros: {
    origin: `http//localhost:${PORT}`,
    mthods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  io.emit('nickname', socket.id.substring(0, 16));

  socket.on('nickname', (nick) => {
    io.emit('serverNickname', { nickname: nick });
  });

  socket.on('message', ({ nickname, chatMessage }) => {
    const timestamp = moment().format('DD-MM-yyyy HH:mm:ss A');
    io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
  });
});

app.use(cors());

app.get('/', (req, res) => {
    res.render('client');
});

// app.post('/', (req, res) => {

// });

server.listen(PORT, console.log(`Ouvindo Socket.io server na porta ${PORT}`));
