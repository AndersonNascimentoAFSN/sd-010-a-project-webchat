const client = window.io();

const sendBtn = document.getElementById('send-btn');
const input = document.getElementById('message');
const list = document.getElementById('list');
const users = document.getElementById('users');
const nickBtn = document.getElementById('nickname-button');
const nickInput = document.getElementById('nickname-box');

const saveNick = () => {
  if (nickInput.value) {
    sessionStorage.setItem('nickname', nickInput.value);
  }
  nickInput.value = '';
};

const getNick = () => {
  const nickname = sessionStorage.getItem('nickname');
  return nickname;
};

nickBtn.addEventListener('click', saveNick);

const createMsg = (msg) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = msg;
  list.append(li);
};

const createNewUser = (id) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.innerText = id;
  users.append(li);
};

sendBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const nickname = getNick() || client.id.substring(0, 16);
  if (input.value) {
    client.emit('message', { chatMessage: input.value, nickname });
  }
  input.value = '';
});

client.on('message', (msg) => createMsg(msg));

client.on('newUser', (allUsers) => {
  users.innerText = '';
  allUsers.forEach((id) => createNewUser(id));
});