//Dependency setup
const express = require('express'),
http = require('http'),
app = express(),
server = http.createServer(app),
io = require('socket.io').listen(server),
PORT = process.env.PORT || 3000;


io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');
  let currentUser;

  socket.on('join', (userNickname) => {
    console.log(`${userNickname} se unio al chat`);
    currentUser = userNickname;

    socket.broadcast.emit('joinedchat', userNickname);
  })

  socket.on('new_message', (senderNickname, messageContent) => {
    console.log(`${senderNickname} : ${messageContent}`);

    let message = {
      "message": messageContent,
      "senderNickname": senderNickname
    }

    //Esto se envia a todos, incluido al que lo mando.
    //TODO: Ver si rinde que los chicos cambien la app para que muestre el msj
    //      de una, y dsp lo mande al server.
    //      En ese caso, usar el socket.broadcast.emit
    io.emit('message', message);
  })

  socket.on('disconnect', () => {
    //Validar esto
    console.log(`${currentUser} se desconecto`);

    socket.broadcast.emit('leftchat', currentUser);
  })
})

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
