var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket)=> {
    console.log('User connected: ', socket.id)
    console.log("Hello!");

    socket.on('button press', (value) => {
        io.emit('render press', value);
    });

    socket.on('create circle', () => {
        io.emit('render circle');
    });

    socket.on('pause circles', () => {
        io.emit('pause movement');
    });

})


http.listen(process.env.PORT || 5000, function () {
    console.log('listening on *:5000', process.env.PORT);
});