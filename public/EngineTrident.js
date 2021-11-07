const canvas = document.getElementById('canvas');
canvas.width = 1000;
canvas.height = 1000;
const ctx = canvas.getContext('2d');
var socket;
socket = io.connect('http://localhost:3000');
let playerDraw = () => {
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
let tridentDraw = () => {
    ctx.beginPath();
    ctx.translate(trident.x, trident.y);
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
let testY = 500;
let testX = 500;
let test = () => {
    ctx.beginPath();
    ctx.arc(Player.x + angleX, Player.y + angleY, 100, 0, 2 * Math.PI, false);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgb(254, 173, 39)';
    ctx.stroke();
    ctx.closePath();
};
let fiveArc = () => {
    ctx.beginPath();
    ctx.arc(30,50, 50, 0, 2* Math.PI, false);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(enemyReceived.x,enemyReceived.y, enemyReceived.size, 0, 2* Math.PI, false);
    ctx.fillStyle = "pink";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgb(254, 173, 39)';
    ctx.fillStyle = '#004777';
    ctx.font = "40px Arial";
    ctx.fillText(enemyReceived.text, enemyReceived.x - 50, enemyReceived.y);
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(470,90, 50, 0, 2* Math.PI, false);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(810,666, 50, 0, 2* Math.PI, false);
    ctx.fill();
    ctx.closePath();

};
let Player = {x: 500, y: 500, size: 100, text: "Player",};
let movementAngle;
let canvasX = 0;
let canvasY = 0;
let clientX;
let clientY;
let angleX = 0;
let angleY = 0;
let startPlayerControl = false;
let trident = { x: 500, y: 500,rotate: 27, moveRotate(x) { trident.rotate = x; }};
let rotate = true;
let Qpressed = false;
let LeapStatus = false;
let tridentmoveY;
let tridentmoveX;
let leapActive = 1;
let timerTridentShot = 0;
let timerLeap = 0;
let statusQ = 0;
let statusW = 0;
let scorePlaces = {
    first: Player.text,
    second: "unnamed",
    third: "unnamed",
    fourth: "unnamed",
};
let enemy;
let enemyReceived = {
    x: "",
    y: "",
    size: "",
    text: "enemy/Вражина",
};
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
    if(Qpressed) {
    let collisionX = trident.x;
    let collisionY = trident.y;
    for(let i = 0; i < 35; i++) { 
        collisionX += tridentmoveX *10;
        collisionY += tridentmoveY *10;
    };
    if(collisionX - 10 < 80 && collisionX + 10 > -20) {
        if(collisionY - 10 < 100 && collisionY + 10 > 0) {alert("crash")};
    };
    };
    // console.log(Player.y);

};
function Multiplayer() {
    enemy = {
        x: Player.x,
        y: Player.y,
        size: Player.size,
        text: Player.text,
    };
    socket.on('cords', income); //- получение данных с сервера
    socket.emit('cords', enemy); //- отправка данных на сервер
    
};
function income(enemy) {
    enemyReceived = {
        x: enemy.x,
        y: enemy.y,
        size: enemy.size,
        text: enemy.text,
    }
    console.log(enemy);
};
function DrawAll() {
    ctx.clearRect(-1000, -1000, 2000, 2000);
    ctx.translate(-canvasX,-canvasY);
    fiveArc();
    test();
    mapBorder();
    PlayerControl();
    TridentShot();
    tridentDraw();
    scoreUI();
    cooldownUI();
    playerDraw();
    Leap();
    Collision();
    Multiplayer();
    requestAnimationFrame(DrawAll);
};
window.onload = DrawAll();
//проблема с перемещением координат смещения angle