var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));
console.log("сервер запущен...");
var socket = require('socket.io');
var io = socket(server);
let playerSetup = 1;
io.sockets.on('connection', newConnection);
function newConnection(socket) {
    console.log('new connection:' + socket.id);
    socket.emit('serverSetup', playerSetup);
    socket.on('serverSetup', local);
    socket.on('cords', sendBack);
    socket.on('tridentServer', sendBackTrident);
    function sendBack(enemy) {
        socket.broadcast.emit('cords', enemy);
        // console.log(enemy);
    };
    function sendBackTrident(enemyTrident) {
        socket.broadcast.emit('tridentServer', enemyTrident);
    }
    function local() {
        playerSetup++;
        if(playerSetup > 2) {playerSetup = 1;}
        console.log(playerSetup);
    }
};