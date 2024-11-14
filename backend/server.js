// подключаение библиотеку к проекту
const WebSocket = require("ws");

//  создание подключения
const wss = new WebSocket.Server({ port: 8080 });

// Слушем WebSocket
wss.on("connection", (ws) => {
  console.log("Подключился новый клиент!");

  // сообщение от сервера
  ws.send(
    JSON.stringify({
      type: "system",
      userName: "system",
      content: "Добро пожаловать в чат!",
    })
  );

  // сообщение от клиента. событие massege
  ws.on("message", (message) => {
    let parseMessage;
    try {
      parseMessage = JSON.parse(message);

      console.log(
        "Получено сообщение: " + parseMessage.userName + parseMessage.content
      );
    } catch (error) {
      console.log("Ошибка соединения: " + error);
      return;
    }

    // во всех WebSockeтах получаем список клиентов
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log("в форич" + parseMessage.userName + parseMessage.content);
        client.send(JSON.stringify(parseMessage));
      }
    });
  });
});

console.log("Сервер запущен");
