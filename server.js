//-стандартные серверные переменные
var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));
console.log("сервер запущен...");
var socket = require('socket.io');
var io = socket(server);
//-список переменных сервера
let playersCountServer = 4; //- (не больше 4) отчёт идёт с нуля 
let playerSetup = 0; //- сетап позиции старта
let serverGOVData;
let serverTridents = [{x: 0,y: 0,size: 0,rotate: 0},{x: 0,y: 0,size: 0,rotate: 0},{x: 0,y: 0,size: 0,rotate: 0},{x: 0,y: 0,size: 0,rotate: 0}];
let serverPlayers = [{x: 0,y: 0,size: 0,text: "enemy/Вражина"},{x: 0,y: 0,size: 0,text: "enemy/Вражина"},{x: 0,y: 0,size: 0,text: "enemy/Вражина"},{x: 0,y: 0,size: 0,text: "enemy/Вражина"},];
let serverPlayersLiveStatus;
let deadPlayers = [];
//-конец списка переменных
io.sockets.on('connection', newConnection);
function newConnection(socket) {
    console.log('new connection:' + socket.id);
    socket.emit('listenServerSetup', playerSetup);
    socket.on('listenServerSetup', definePlayerSetup);
    socket.on('listenPlayersCords', sendToClientPlayersCords);
    socket.on('listenTridentsCords', sendToClientTridentsCords);
    socket.on('listenGameOver', initServerGameover);
    function sendToClientPlayersCords(enemy) {
        for(let i = 0; i < playersCountServer; i++) {
        if(enemy.proxID == i) serverPlayers[i] = enemy;
        }
        for(let i = 0; i < playersCountServer; i++) {
            if(serverPlayers[i].proxID == serverPlayersLiveStatus) { serverPlayers[i] = {x: '', y: '',size: '',text: '', dead: i,}}
    }
        socket.broadcast.emit('listenPlayersCords', serverPlayers);

    };
    function sendToClientTridentsCords(enemyTrident) {
        for(let i = 0; i < playersCountServer; i++) {
        if(enemyTrident.proxID == i) serverTridents[i] = enemyTrident;
        }
        // console.log(serverTridents);
        for(let i = 0; i < playersCountServer; i++) {
            if(serverTridents[i].proxID == serverPlayersLiveStatus) { serverTridents[i] = {x: '', y: '',size: '', dead: i,}}
    }
        socket.broadcast.emit('listenTridentsCords', enemyTrident, serverTridents);
    }
    function definePlayerSetup() {
        playerSetup++;
        if(playerSetup > 3) {playerSetup = 0;}
        console.log(playerSetup);
    }
    function initServerGameover(proxliveStatus) {
        serverPlayersLiveStatus = proxliveStatus;
        // serverGOVData = gameOverStatus;
        socket.broadcast.emit('listenGameOver', serverPlayersLiveStatus);
        // console.log(gameOverStatus + "2");
        console.log(serverPlayersLiveStatus + "сработало");
    }
};