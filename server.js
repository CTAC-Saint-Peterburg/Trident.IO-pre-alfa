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
let playerSetup = {Pcords: 0, currentRoom: 0}; //- сетап позиции старта //roomsUpdate
let serverTridents = [{x: 0,y: 0,size: 0,rotate: 0},{x: 0,y: 0,size: 0,rotate: 0},{x: 0,y: 0,size: 0,rotate: 0},{x: 0,y: 0,size: 0,rotate: 0}];
let serverPlayers = [{x: 0,y: 0,size: 0,text: "enemy/Вражина"},{x: 0,y: 0,size: 0,text: "enemy/Вражина"},{x: 0,y: 0,size: 0,text: "enemy/Вражина"},{x: 0,y: 0,size: 0,text: "enemy/Вражина"},];
let serverPlayersLiveStatus;

//-----------------
let serverAllRooms = new Array(); //roomsUpdate
let serverAllUsers = 0; //roomsUpdate
let howManyRoomsNeed; //roomsUpdate
let roomsUpdateTest; //roomUpdate
//-------------------------
//-конец списка переменных

//- заметка serverAllRooms[1][2][3] [1]-номер комнаты|| [2]-данные [0]трезубца и [1]игрока|| [3]- [i]- итерации по значениям 
io.sockets.on('connection', newConnection);
function newConnection(socket) {
    serverAllUsers++ //roomsUpdate
    howManyRoomsNeed = Math.ceil(serverAllUsers/4); //roomsUpdate
    for(let i = serverAllRooms.length; i < howManyRoomsNeed; i++) { //roomsUpdate //for change
        serverAllRooms.push([Array.from(serverPlayers), Array.from(serverTridents)]); //roomsUpdate
        }
        //-------------------------------------------------------------------------
    socket.join(howManyRoomsNeed - 1); //roomsUpdate
    playerSetup.currentRoom = howManyRoomsNeed - 1; //roomUpdate
    //-logs
    console.log(socket.rooms); //roomsUpdate
    console.log(roomsUpdateTest);
    // console.log('rooms' + howManyRoomsNeed + 'users' + serverAllUsers);  //roomsUpdate
    //-Endlogs
    socket.emit('listenServerSetup', playerSetup);
    socket.on('listenServerSetup', definePlayerSetup);
    socket.on('listenPlayersCords', sendToClientPlayersCords);
    socket.on('listenTridentsCords', sendToClientTridentsCords);
    socket.on('listenGameOver', initServerGameover);
    function sendToClientPlayersCords(enemy) {
        for(let i = 0; i < playersCountServer; i++) {
        if(enemy.proxID == i) serverAllRooms[0][0][i] = enemy;
        }
        for(let i = 0; i < playersCountServer; i++) {
            if(serverAllRooms[0][0][i].proxID == serverPlayersLiveStatus) { serverAllRooms[0][0][i] = {x: '', y: '',size: '',text: '', dead: i,}}
    }
        socket.to(0).emit('listenPlayersCords', serverAllRooms);

    };
    function sendToClientTridentsCords(enemyTrident) {
        for(let i = 0; i < playersCountServer; i++) {
        if(enemyTrident.proxID == i) serverAllRooms[0][1][i] = enemyTrident;
        }
        // console.log(serverTridents);
        for(let i = 0; i < playersCountServer; i++) {
            if(serverAllRooms[0][1][i].proxID == serverPlayersLiveStatus) { serverAllRooms[0][1][i] = {x: '', y: '',size: '', dead: i,}}
    }
        socket.to(0).emit('listenTridentsCords', enemyTrident, serverAllRooms);
    }
    function definePlayerSetup(clientSideRoom) {
        roomsUpdateTest = clientSideRoom;
        playerSetup.Pcords++;
        if(playerSetup.Pcords > 3) {playerSetup.Pcords = 0;}
        // console.log(playerSetup.Pcords);
    }
    function initServerGameover(proxliveStatus) {
        serverPlayersLiveStatus = proxliveStatus;
        // serverGOVData = gameOverStatus;
        socket.to(0).emit('listenGameOver', serverPlayersLiveStatus);
        // console.log(gameOverStatus + "2");
        // console.log(serverPlayersLiveStatus + "сработало");
    }
};