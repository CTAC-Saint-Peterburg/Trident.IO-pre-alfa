const canvas = document.getElementById('canvas');
canvas.width = 1000;
canvas.height = 1000;
const ctx = canvas.getContext('2d');
var socket;
socket = io.connect('http://localhost:3000');
let playerDraw = () => { //-отрисовка игрока (поверх конваса)
    ctx.beginPath();
    ctx.resetTransform();
    ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI, false);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgb(254, 173, 39)';
    ctx.stroke();
    ctx.fillStyle = '#004777';
    ctx.font = "40px Arial";
    ctx.fillText(Player.text, canvas.width / 2 - 50, canvas.height / 2);
    ctx.closePath();
};
let tridentDraw = () => { //-отрисовка трезубца (поверх конваса)
    ctx.beginPath();
    ctx.translate(trident.x - canvasX, trident.y - canvasY);
    if(rotate) {trident.moveRotate(Math.atan2(clientY - canvas.height / 2, clientX - canvas.width / 2) * 180 / Math.PI)};
    ctx.rotate(trident.rotate * Math.PI / 180);
    ctx.strokeStyle = '#37393a';
    ctx.moveTo(170, 0); 
    ctx.lineTo(320, 0); 
    ctx.lineTo(320, 40);
    ctx.lineTo(400, 40);
    ctx.moveTo(320, 0);
    ctx.lineTo(400, 0);
    ctx.moveTo(320, 0);
    ctx.lineTo(320, -40);
    ctx.lineTo(400, -40); 
    ctx.lineWidth = 15;
    ctx.stroke();
    ctx.resetTransform();
    ctx.closePath();

};
let humanPlayer = () => { //-отрисовка игрока (под слоем который рисуется в playerDraw)
    ctx.beginPath();
    ctx.arc(Player.x + angleX, Player.y + angleY, 100, 0, 2 * Math.PI, false);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgb(254, 173, 39)';
    ctx.stroke();
    ctx.closePath();
};
let countPlayers = 4; //-количество игроков
let proxySetup; //-зугрузка стартовой позиции
let allEnemies = [{},{},{},{},{}]; //-массив всех игроков
let startSetup = [{cX: -1000, cY: 0, pX: -500, pY: 500, tX: -500, tY: 500},{cX: 1000, cY: 0, pX: 1500, pY: 500, tX: 1500, tY: 500}, {cX: -1000, cY: -1200, pX: -500, pY: -700, tX: -500, tY: -700}, {cX: 1000, cY: -1200, pX: 1500, pY: -700, tX: 1500, tY: -700}]; //-стартовые координаты
let allTridents = [{},{},{},{}]; //-массив всех трезубцев
let proxyTridents; //-трезубцы для (мултиплеера)
let checkVar; //-переменная для проверки коллизий
let Player = {x: 500, y: 500, size: 100, text: "Player",}; //-переменная хранит начальные координаты игрока
let movementAngle; //-переменная хранит функцию Math.atan2 создаёт арктангенс между игроком и точкой на экране куда был осущёствлён клик
let canvasX = 0; //-камера канваса(область видимости по  X)
let canvasY = 0; //-камера канваса(область видимости по  Y)
let clientX; //-клик клиента по X
let clientY; //-клик клиента по Y
let angleX = 0; //-косинус от movementAngle (осуществляем движение на канвасе)
let angleY = 0; //-синус от movementAngle (осуществляем движение на канвасе)
let startPlayerControl = false;
let trident = { x: 500, y: 500,rotate: 27, moveRotate(x) { trident.rotate = x; }}; //-обьект начальных данных трезубца
let rotate = true; //-проверка на необходимость вычисления угла отрисовки трезубца
let Qpressed = false; //-проверка нажата ли Q
let LeapStatus = false; //-провека нажата ли W
let tridentmoveY; //-движение трезубца по Y
let tridentmoveX; //-движение трезубца по X
let leapActive = 1; //-множитель ускорения по нажатию W (начальное 1 при активации 4)
let timerTridentShot = 0;
let timerLeap = 0;
let statusQ = 0;
let statusW = 0;
let gameOverStatus = false;
let gameResult; //- в работе
class StartsetupPositon {
    constructor(cX,cY,pX,pY,tX,tY) {
        this.cX = cX;
        this.cY = cY;
        this.pX = pX;
        this.pY = pY;
        this.tX = tX;
        this.tY = tY;
    }
    load() {
        canvasX = this.cX;
        canvasY = this.cY;
        Player.x = this.pX;
        Player.y = this.pY;
        trident.x = this.tX;
        trident.y = this.tY;
}
};
class Enemyspawner {
    constructor(eX,eY,eSize,eColor, eText) {
        this.x = eX;
        this.y = eY;
        this.size = eSize;
        this.color = eColor;
        this.text = eText;
    }
    draw() {
    ctx.beginPath();
    ctx.arc(this.x,this.y, this.size, 0, 2* Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.fillStyle = '#004777';
    ctx.font = "40px Arial";
    ctx.fillText(this.text, this.x - 50, this.y);
    ctx.closePath();
    }
};
let allEnemiesDraw = () => {
    allEnemies[0] = new Enemyspawner(300,200,400, "brown", "blah blah blah");
    allEnemies[1] = new Enemyspawner(enemyReceived[0].x,enemyReceived[0].y,enemyReceived[0].size, "pink", enemyReceived[0].text);
    allEnemies[2] = new Enemyspawner(enemyReceived[1].x,enemyReceived[1].y,enemyReceived[1].size, "pink", enemyReceived[1].text);
    allEnemies[3] = new  Enemyspawner(enemyReceived[2].x,enemyReceived[2].y,enemyReceived[2].size, "pink", enemyReceived[2].text);
    allEnemies[4] = new Enemyspawner(enemyReceived[3].x,enemyReceived[3].y,enemyReceived[3].size, "pink", enemyReceived[3].text);
    for(let i = 0; i <= countPlayers; i++) {
    allEnemies[i].draw();
    }
};
class Tridentsspawner {
    constructor(tX, tY, tRotate) {
        this.x = tX;
        this.y = tY;
        this.rotate = tRotate;
    }
    draw() {
    ctx.beginPath();
    ctx.resetTransform();
    ctx.translate(this.x - canvasX, this.y - canvasY);
    ctx.rotate(this.rotate * Math.PI / 180);
    ctx.strokeStyle = '#37393a';
    ctx.moveTo(170, 0); 
    ctx.lineTo(320, 0); 
    ctx.lineTo(320, 40);
    ctx.lineTo(400, 40);
    ctx.moveTo(320, 0);
    ctx.lineTo(400, 0);
    ctx.moveTo(320, 0);
    ctx.lineTo(320, -40);
    ctx.lineTo(400, -40); 
    ctx.lineWidth = 15;
    ctx.stroke();
    ctx.resetTransform();
    ctx.closePath();
    }
};
let enemyTridentReceivedDraw = () => {
    for(let i =0; i < 4; i++) {
    allTridents[i] = new Tridentsspawner(enemyTridentReceived[i].x, enemyTridentReceived[i].y, enemyTridentReceived[i].rotate);
    allTridents[i].draw();
    }
};
class Collisionchecker {
    constructor(eX,eY,eSize) {
        this.x = eX; //- координаты соперника
        this.y = eY;
        this.size = eSize;
    }
    collision() {
        if(Qpressed) {
            let collisionX = trident.x;
            let collisionY = trident.y;
            for(let i = 0; i < 35; i++) { 
                collisionX += tridentmoveX *10;
                collisionY += tridentmoveY *10;
            };
            if(collisionX - 10 < this.x + this.size && collisionX + 10 > this.x - this.size) {
                if(collisionY - 10 < this.y + this.size && collisionY + 10 > this.y - this.size) {serverGameOver(), gameOverStatusText = gameOverText.win, gameOverText.kills++, timerTridentShot = 200};
            };
            };
    }
};
let scorePlaces = {
    first: Player.text,
    second: "unnamed",
    third: "unnamed",
    fourth: "unnamed",
};
let enemy;
let enemyTrident;
let enemyTridentReceived = [{x: 0,y: 0,size: 0,rotate: 0},{x: 0,y: 0,size: 0,rotate: 0},{x: 0,y: 0,size: 0,rotate: 0},{x: 0,y: 0,size: 0,rotate: 0}];
let enemyReceived = [{x: 0,y: 0,size: 0,text: "enemy/Вражина"},{x: 0,y: 0,size: 0,text: "enemy/Вражина"},{x: 0,y: 0,size: 0,text: "enemy/Вражина"},{x: 0,y: 0,size: 0,text: "enemy/Вражина"}];
let gameOverText = {
    lose: "You Lose",
    win: "Victory",
    kills: 0,
};
let gameOverStatusText = gameOverText.lose;
canvas.addEventListener("click", (event) => {
    clientY = event.clientY;
    clientX = event.clientX;
    startPlayerControl = true;
});
window.addEventListener("keyup", (event) => {
    if (event.code == 'KeyQ') {
        if(!Qpressed) { tridentmoveX = angleX, tridentmoveY = angleY};
        Qpressed = true; //- Q нажата
        rotate = false; //- останавливаем вычисление угла отрисовки
        console.log("Q");
    };
});
window.addEventListener("keyup", (event) => {
    if (event.code == 'KeyW') {
        LeapStatus = true; //изменяем статус прыжка по нажатию w
        console.log("kek");
        }
});
function PlayerControl() {
    if (startPlayerControl) {
        movementAngle = Math.atan2(clientY - canvas.height / 2, clientX - canvas.height / 2);
        angleX = Math.cos(movementAngle);
        // console.log(angleX);
        angleY = Math.sin(movementAngle);
        canvasX += angleX * leapActive; 
        canvasY += angleY * leapActive;
        if(!Qpressed) {
        trident.x += angleX * leapActive;
        trident.y += angleY * leapActive;
        };
        Player.x += angleX * leapActive;
        Player.y += angleY * leapActive;
        // console.log(canvasX);
        startPlayerControl = true;
    }
    };
 function TridentShot() {
        if(Qpressed) {
            trident.x += tridentmoveX * 5;
            trident.y += tridentmoveY * 5;
            timerTridentShot++;
            if(timerTridentShot >= 200) {Qpressed = false, rotate = true, timerTridentShot = 0, trident.x = Player.x, trident.y = Player.y};
        }
    };
function Leap() {
        if (LeapStatus) {
            leapActive = 4; // баф х4 начальной скорости
            timerLeap++;
            if(timerLeap >= 200) {LeapStatus = false, leapActive = 1, timerLeap = 0}; //-возращение начальных значений при 200 тиков
        };
    };
 let mapBorder = () => {
    ctx.beginPath();       
    ctx.moveTo(-1000, -1000);    
    ctx.lineTo(-1000, 1000);
    ctx.lineTo(2000, 1000);
    ctx.lineTo(2000, -1000);
    ctx.lineTo(-1015, -1000);
    ctx.moveTo(-1015, -1000);
    ctx.moveTo(-15, 0);
    ctx.lineTo(1000, 0);
    ctx.lineWidth = 30;
    ctx.strokeStyle = 'orange'; 
    ctx.stroke();
    ctx.closePath();
 };
 let scoreUI = () => {
    ctx.beginPath();
    ctx.rect(800, 10, 200, 170);
    ctx.fillStyle = "rgba(57, 47, 90, 0.3)";
    ctx.fill();
    ctx.font = "25px Arial";
    ctx.fillStyle = "#fff8f0";
    ctx.fillText("Leaderboard", 830, 40);
    ctx.font = "18px Arial";
    ctx.fillText("1-" + scorePlaces.first, 850, 70);
    ctx.fillText("2-" + scorePlaces.second, 850, 100);
    ctx.fillText("3-" + scorePlaces.third, 850, 130);
    ctx.fillText("4-" + scorePlaces.fourth, 850, 160);
    ctx.closePath();
 };
 let cooldownUI = () => {
    ctx.beginPath();
    ctx.rect(650, 700, 80, 80);
    ctx.fillStyle = "rgba(57, 47, 90, 0.4)";
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.rect(800, 700, 80, 80);
    ctx.fillStyle = "rgba(57, 47, 90, 0.4)";
    ctx.fill();
    ctx.closePath();
    if(!Qpressed) {
    ctx.beginPath();
    ctx.moveTo(690,770);
    ctx.lineTo(690,710);
    ctx.moveTo(670,735);
    ctx.lineTo(710,735);
    ctx.moveTo(673,735);
    ctx.lineTo(673,710);
    ctx.moveTo(707,735);
    ctx.lineTo(707,710);
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Q", 680, 820);
    ctx.closePath();
    };
    if(!LeapStatus) {
    ctx.beginPath();
    ctx.arc(840, 740, 20, 0, 2 * Math.PI, false);
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.moveTo(840,760);
    ctx.lineTo(870,750);
    ctx.moveTo(840,760);
    ctx.lineTo(870,760);
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("W", 825, 820);
    ctx.closePath();
    };
    ctx.beginPath();
    ctx.fill();
    ctx.font = "70px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(statusQ, 670, 760);
    ctx.closePath();
    if(timerTridentShot == 0){statusQ = ""};
    if(timerTridentShot >= 1 && timerTridentShot < 50) {statusQ = 3};
    if(timerTridentShot >= 50 && timerTridentShot < 150) {statusQ = 2};
    if(timerTridentShot >= 150 && timerTridentShot < 200) {statusQ = 1};
    ctx.beginPath();
    ctx.fill();
    ctx.font = "70px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(statusW, 820, 760);
    ctx.closePath();
    if(timerLeap == 0){statusW = ""};
    if(timerLeap >= 1 && timerLeap < 50) {statusW = 3};
    if(timerLeap >= 50 && timerLeap < 150) {statusW = 2};
    if(timerLeap >= 150 && timerLeap < 200) {statusW = 1};
 };
function Collision() {
    if(Player.x - Player.size < -1000 || Player.x + Player.size > 2000) {startPlayerControl = false};
    if(Player.y - Player.size < -1000 || Player.y + Player.size > 1000) {startPlayerControl = false};
    for(let i = 0; i < 4; i++) {
    checkVar = new Collisionchecker(enemyReceived[i].x,enemyReceived[i].y,enemyReceived[i].size);
    checkVar.collision();
    } 
};
let proxID; //-123 123
function Multiplayer() {
    enemy = {
        x: Player.x,
        y: Player.y,
        size: Player.size,
        text: Player.text,
        proxID: proxID,
    };
    enemyTrident = {
        x: trident.x,
        y: trident.y,
        rotate: trident.rotate,
        proxID: proxID,
    };
    socket.on('cords', income); //- получение данных о координатах с сервера
    socket.emit('cords', enemy); //- отправка данных о координатах на сервер
    socket.on('tridentServer', incomeTrident);
    socket.emit('tridentServer', enemyTrident);
    socket.on('serverGameover', incomeServerGameover);
    
};
function income(serverPlayers) {
    // console.log(serverPlayers);
    enemyReceived = serverPlayers;
    // console.log(enemy);
};
function incomeTrident(enemyTrident, serverTridents) {
    proxyTridents = serverTridents;
    // console.log(serverTridents);
    enemyTridentReceived = serverTridents;
    // console.log(enemyTrident);
};
function gameOverUI() {
    if(gameOverStatus) {
    ctx.beginPath()
    ctx.rect(0, 0, 1000, 1000);
    ctx.fillStyle = "rgba(57, 47, 90, 0.5)";
    ctx.fill();
    ctx.beginPath();
    ctx.beginPath();
    ctx.rect(200, 200, 600, 400);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
    ctx.font = "50px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(gameOverStatusText, 400, 280);
    ctx.font = "50px Arial";
    ctx.fillStyle = "orange";
    // ctx.textAlign = 'center'; - потом настрою
    ctx.fillText("Kills:" + gameOverText.kills, 430, 380);
    ctx.closePath();
    startPlayerControl = false;
    }
};
function gameSetup() {
    console.log("setup complete");
    socket.on('serverSetup', setup);
    
};
function setup(playerSetup) {
    proxID = playerSetup;
    console.log(playerSetup);
    socket.emit('serverSetup');
    proxySetup = new StartsetupPositon(startSetup[playerSetup].cX,startSetup[playerSetup].cY, startSetup[playerSetup].pX,startSetup[playerSetup].pY, startSetup[playerSetup].tX,startSetup[playerSetup].tY);
    proxySetup.load();
    // if(playerSetup > 1) {
    //     canvasY = -800;
    //     Player.y = -300;
    //     trident.y = -300;
    // }
};
function serverGameOver() {
    if(!gameOverStatus) {
    gameOverStatus = true;
    socket.emit('serverGameover', gameOverStatus);
    console.log(gameOverStatus, + "1");
}
};
function incomeServerGameover(serverGOVData) {
    console.log("mda"+ serverGOVData);
    gameOverStatus = serverGOVData;
};
function DrawAll() {
    ctx.clearRect(-1000, -1000, 2000, 2000);
    ctx.translate(-canvasX,-canvasY);
    Multiplayer();
    allEnemiesDraw();
    humanPlayer();
    mapBorder();
    enemyTridentReceivedDraw();
    tridentDraw();
    PlayerControl();
    TridentShot();
    scoreUI();
    cooldownUI();
    playerDraw();
    gameOverUI();
    Leap();
    Collision();
    requestAnimationFrame(DrawAll);
};
window.onload = DrawAll(), gameSetup();
//проблема с перемещением координат смещения angle