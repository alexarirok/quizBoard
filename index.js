var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
app.use(express.static(__dirname + '/statics'));
io.on('connection', function (socket) {
    console.log('a user Logged in');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('online', function (msg) {
        io.emit('online', msg);
    })

    socket.on('quizReady', function (msg) {
        io.emit('quizReady', msg);
    })
    socket.on('reset', function () {
        io.emit('reset');
    })
    socket.on('timeout',function(){
        io.emit('timeout');
    })
    socket.on('end',function(){
        io.emit('end');
    })
    socket.on('myScore',function(score){
        io.emit('myScore', score);
    })
    socket.on('sendAnswer', function (msg) {
        io.emit('sendAnswer', msg);
        console.log(msg);
    })

})


http.listen(3000, function () {
    console.log('Localhost:3000')
})