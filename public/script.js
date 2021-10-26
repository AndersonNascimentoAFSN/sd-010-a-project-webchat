const client = window.io();

const inputNick = document.querySelector('#nickname');
const btnNickName = document.querySelector('#nickname-button');
const listUsers = document.querySelector('#content-list');
const listMessages = document.querySelector('#content-messages');
const inputMessage = document.querySelector('#message');
const btnSend = document.querySelector('#send-button');

const createListUsers = (user) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.innerHTML = user;
  return li;
};

const createListMessage = (message) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerHTML = message;
  return li;
};

let nickname = '';

btnSend.addEventListener('click', (ev) => {
  ev.preventDefault();
  if (inputMessage.value) {
    const nick = nickname || client.id.substring(0, 16);
    client.emit('message', { chatMessage: inputMessage.value, nickname: nick });
    inputMessage.value = '';
  }
});

btnNickName.addEventListener('click', (ev) => {
  ev.preventDefault();
  if (inputNick.value) {
    nickname = inputNick.value;
    client.emit('nicknameChange', nickname);
    inputNick.value = '';
  }
});

client.on('message', (formattedMsg) => {
  console.log(formattedMsg);
  listMessages.append(createListMessage(formattedMsg));
});

client.on('allUsers', (usersList) => {
  listUsers.innerHTML = '';
  usersList.forEach((user) => listUsers.append(createListUsers(user)));
});