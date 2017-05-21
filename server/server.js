const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected');

  socket.on('disconnect', () => {
    console.log('user was disconnected');
  });

  socket.emit('newMessage', {
    from: 'admin',
    text: 'welcome to the chat',
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit('newMessage', {
    from: 'admin',
    text: 'new User joined the chat',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', (message) => {
    console.log('new message arrived:', message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });

    // socket.broadcast.emit('newMessage', {
    //     from: message.from,
    //     text: message.text,
    //     createdAt: new Date().getTime()
    // });
  });

});

server.listen(port, () => {
  console.log(`app listening to port ${port}`);
});

// console.log(__dirname + '/../public');
// console.log(publicPath);
