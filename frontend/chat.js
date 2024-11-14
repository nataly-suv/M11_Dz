const chat = document.querySelector("#chat");
const messageForm = document.querySelector("#messageForm");
const messageInput = document.querySelector("#messageInput");

// клиент подключился к сокету
const socket = new WebSocket("ws://localhost:8080");

// проверка наличия имени пользователя в localStorage
if (!localStorage.getItem("user")) {
  const userNameInput = prompt("Введите имя");
  localStorage.setItem("user", JSON.stringify(userNameInput));
}

//когда произошло успешное открытие
socket.onopen = (e) => {
  console.log("Соединение успешное");
};

// получаем сообщение от сервера. onmessage - При получении сообщения
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  const messageElem = document.createElement("div");

  if (message.type === "system") {
    messageElem.classList.add("system-message");
    messageElem.textContent = message.content;
  } else {
    messageElem.classList.add("chat__messegeBox");
    messageElem.innerHTML = `
      <div class="chat__messegeItem">
        <span class="chat__userName">${message.userName}: </span>
        <span class="chat__messege">${message.content}</span>
      </div>
    `;
  }
  chat.appendChild(messageElem);
  chat.scrollTop = chat.scrollHeight;
};

// при закрытии сокета
socket.onclose = (event) => {
  if (event.wasClean) {
    console.log(
      `Соединение закрыто чисто, код=${event.code} причина=${event.reason}`
    );
  } else {
    console.log("Соединение прервано");
  }
};

// при вызникновении ошибок
socket.onerror = (error) => {
  console.log(`Ошибка ${error.message}`);
};

// отправка сообщений
messageForm.onsubmit = (e) => {
  // прерывание стандартных дейстий
  e.preventDefault();
  if (messageInput.value) {
    const message = {
      type: "user",
      userName: JSON.parse(localStorage.getItem("user")),
      content: messageInput.value,
    };
    socket.send(JSON.stringify(message));
    messageInput.value = "";
  }
};
