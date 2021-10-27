const socket = window.io();
    const buttonMessage = document.getElementById('send-message');
    const buttonNickname = document.getElementById('nickname-button');

    buttonNickname.addEventListener('click', (_e) => {
      const nicknameInput = document.getElementById('nickname-input');
      if (!nicknameInput.value) {
        alert('O nickname não pode ser vazio');
      } else {
        sessionStorage.setItem('nickname', nicknameInput.value);
      }
    });

    buttonMessage.addEventListener('click', (_e) => {
      const messageInput = document.getElementById('input-message');

      const nickname = sessionStorage.getItem('nickname');
      if (!nickname) {
        alert('Você deve adicionar um nickname antes de enviar a mensagem!!');
        return;
      }

      if (!messageInput.value) {
        alert('A messagem não pode ser vazia');
        return;
      } 
      
      socket.emit('message', { nickname, chatMessage: messageInput.value });
    });

    const createMessage = (message) => {
      const messagesUl = document.querySelector('#messages');
      const li = document.createElement('li');
      li.innerText = message;
      messagesUl.appendChild(li);
    };

    socket.on('message', (message) => createMessage(message));