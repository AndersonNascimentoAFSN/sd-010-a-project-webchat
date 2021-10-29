const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').createServer(app);

const EXPRESS_PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/assets', express.static('./assets/javascripts'));
app.use('/assets', express.static('./assets/css'));

app.use(cors());
app.use(bodyParser.json());
const io = require('socket.io')(server, {
  cors: {
    origin: `http://localhost:${EXPRESS_PORT}`,
    methods: ['GET', 'POST'],
  },
});

let users = [];

function newData(chatMessage, nickname) {
  const data = new Date();
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const dataAtual = `${dia}-${mes}-${ano}`;
  const horaAtual = `${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`;
  const newMessage = `${dataAtual} ${horaAtual} ${nickname} : ${chatMessage}`;
  return newMessage;
}

const newMessageFunc = ({ chatMessage, nickname }) => {
      const find = users.find((user) => user === nickname);
      if (find) {
          const newMessage = newData(chatMessage, nickname);
          io.emit('message', newMessage);
      }
};

function newNickFunc(data) {
  const newArr = users.map((user) => {
    if (user === data.oldNick) return data.newNick;
    return user;
  });
  users = newArr;
  io.emit('newConnect', users);
}
io.on('connection', (socket) => {
  io.emit('newUser', socket.id);
  socket.on('message', (data) => newMessageFunc(data));
  socket.on('newNick', (data) => newNickFunc(data));
 
  socket.on('newConnect', (id) => {
    users.push(id);
    console.log(users);
    io.emit('newConnect', users);
  });
  socket.on('disconnect', () => {
    const newArr = users.filter((user) => user !== socket.id.substring(4));
    users = newArr;
    io.emit('newConnect', users);
  });
});

app.get('/', (_req, res) => {
    res.render('webchat/index.ejs');
    });

// app.post('/user', async (req, res) => {
//     const {nickName} = req
//     const newUser = await User.createUser();
// });

server.listen(EXPRESS_PORT, () => {
  console.log('Server escutando na porta 3000');
});
