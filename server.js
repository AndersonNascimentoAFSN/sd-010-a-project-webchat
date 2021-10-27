const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, '/views/public')));
app.set('views', path.join(__dirname, '/views/public'));

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use('/', (_req, res) => {
  res.render('index.html');
});

const messages = [];

io.on('connection', (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.emit('previuosMessages', messages);

  socket.on('sendMessage', (data) => {
    messages.push(data);
    console.log(data);
    socket.broadcast.emit('recivedMessage', data);
  });
});

server.listen(3000, () => {
  console.log('Servidor online!');
  console.log('http://localhost:3000');
});