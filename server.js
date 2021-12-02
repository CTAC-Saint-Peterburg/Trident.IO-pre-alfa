var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));
console.log("сервер запущен...");
var socket = require('socket.io');
var io = socket(server);
let playerSetup = 0;
let serverGOVData;
let serverTridents = [{x: 0,y: 0,size: 0,rotate: 0},{x: 0,y: 0,size: 0,rotate: 0},{x: 0,y: 0,size: 0,rotate: 0},{x: 0,y: 0,size: 0,rotate: 0}];
let serverPlayers = [{x: 0,y: 0,size: 0,text: "enemy/Вражина"},{x: 0,y: 0,size: 0,text: "enemy/Вражина"},{x: 0,y: 0,size: 0,text: "enemy/Вражина"},{x: 0,y: 0,size: 0,text: "enemy/Вражина"},];
io.sockets.on('connection', newConnection);
function newConnection(socket) {
    console.log('new connection:' + socket.id);
    socket.emit('serverSetup', playerSetup);
    socket.on('serverSetup', local);
    socket.on('cords', sendBack);
    socket.on('tridentServer', sendBackTrident);
    socket.on('serverGameover', initServerGameover);
    function sendBack(enemy) {
        if(enemy.proxID == 0) serverPlayers[0] = enemy;
        if(enemy.proxID == 1) serverPlayers[1] = enemy;
        if(enemy.proxID == 2) serverPlayers[2] = enemy;
        if(enemy.proxID == 3) serverPlayers[3] = enemy;
        socket.broadcast.emit('cords', serverPlayers);
        // console.log(serverPlayers);
    };
    function sendBackTrident(enemyTrident) {
        if(enemyTrident.proxID == 0) serverTridents[0] = enemyTrident;
        if(enemyTrident.proxID == 1) serverTridents[1] = enemyTrident;
        if(enemyTrident.proxID == 2) serverTridents[2] = enemyTrident;
        if(enemyTrident.proxID == 3) serverTridents[3] = enemyTrident;
        // console.log(serverTridents);
        socket.broadcast.emit('tridentServer', enemyTrident, serverTridents);
    }
    function local() {
        playerSetup++;
        if(playerSetup > 3) {playerSetup = 0;}
        console.log(playerSetup);
    }
    function initServerGameover(gameOverStatus) {
        serverGOVData = gameOverStatus;
        socket.broadcast.emit('serverGameover', serverGOVData);
        console.log(gameOverStatus + "2");
    }
};