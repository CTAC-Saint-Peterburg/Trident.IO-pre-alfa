//выстрел работает только на правый угол !Решить проблему
//разобраться с внутренними таймерами
//инициализируем канвас
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
//------------------------------------
//Переменная с параметрами Игрока под управлением пользователя
let Player = {
    y: 2000,
    x: 2000,
    size: 150,
    text: "Player",
    color: "yellow",
    imgSkin: "",
    id: "1",
    moveUp(x) { Player.y -= x;},
    moveDown(x) { Player.y += x;},
    moveLeft(x) { Player.x -= x;},
    moveRight(x) { Player.x += x;},

};
//Переменная с параметрами Трезубца под управлением рлоьзователя
let Trident = {
    y: Player.y,
    x: Player.x,
    rotate: 0,
    moveRotate(x) { Trident.rotate = x + 0; },
    moveUp(x) { Trident.y -= x; },
    moveDown(x) { Trident.y += x; },
    moveLeft(x) { Trident.x -= x; },
    moveRight(x) { Trident.x += x; },
};
//-------------------------------------------------------------
//---------------------------------------------------------
//Функция управления размерами Канваса
function canvasSize() {
  //  canvas.width = innerWidth; //ширина всего окна
  //  canvas.height = innerHeight; //высота всего окна
    canvas.width = 4000;
    canvas.height = 4000;
};
//-----------------------------------------------------------
//Функция отрисовки Player
let PlayerDraw = () => {
    ctx.beginPath();
    ctx.arc(`${Player.x}`, `${Player.y}`, `${Player.size}`, 0, 2 * Math.PI, false); //0 параметр размера отвечает за радиус отображения круга
    ctx.fillStyle = `${Player.color}`;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = '#004777';
    ctx.font = "40px Arial";
    ctx.fillText(`${Player.text}`, `${Player.x - 50}`, `${Player.y}`);
};
//--------------------------------------------------------
//Функция отрисовки трезубца
let TridentDrawStatus = true; //переменая проверки необходимости отрисовки
let TridentDraw = () => {
    if (!TridentDrawStatus) return false; //проверка состояния необходимости отрисовки
    Trident.moveRotate(Math.atan2(clickY - Player.y, clickX - Player.x) * 180 / Math.PI); //направление трезубца --нужно найти решение лучше
    ctx.translate(Player.x, Player.y); //***-нужно поменять после теста
    ctx.rotate(Trident.rotate * Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(170, 0); //смещение относительно первоначальной точки
    ctx.lineTo(320, 0); //первое значение x затем y
    ctx.lineTo(320, 40);
    ctx.lineTo(400, 40);
    ctx.moveTo(320, 0);
    ctx.lineTo(400, 0);
    ctx.moveTo(320, 0);
    ctx.lineTo(320, -40);
    ctx.lineTo(400, -40); //можно устранить менусовые значения при проблемах
    ctx.lineWidth = 15;
    ctx.stroke();
    
}
//Функция управления игроком и переменные координат по X Y
let clickY = {};
let clickX = {};
function PlayerControl() {
    canvas.addEventListener("click", (event) => {
         clickY = event.clientY;
        clickX = event.clientX;
    }); //слушаем наличие кликов по канвасу
    //сдвигаемся на единицу в сторону координат клика
    if (clickX < Player.x - Player.size) Player.moveLeft(1);
    if (clickX > Player.x + Player.size) Player.moveRight(1);
    if (clickY < Player.y - Player.size) Player.moveUp(1);
    if (clickY > Player.y + Player.size) Player.moveDown(1);
   
};
//Функция стрельбы трезубцем !требует доработки 
let shotY = {};
let shotX = {};
let disX;
let disY;
    window.addEventListener("keyup", (event) => {
        if (event.code == 'KeyQ') {
            TridentDrawStatus = false;
            Trident.x = Player.x;
            Trident.y = Player.y;
            shotY = clickY;
            shotX = clickX;
            TridentShotAngle = Math.atan2(clickY - Trident.y, clickX - Trident.x);
            console.log(TridentShotAngle);
            TridentVelocityX = Math.cos(TridentShotAngle);
            console.log(TridentVelocityX);
            TridentVelocityY = Math.sin(TridentShotAngle);
            console.log(TridentVelocityY);

        };
    });
//требует доработки
let TridentShotAngle;
let TridentVelocityX;
let TridentVelocityY;
function TridentShot() { 
    if (!TridentDrawStatus) {
        ctx.translate(Trident.x, Trident.y); //***-нужно поменять после теста
        ctx.rotate(Trident.rotate * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(170, 0); //смещение относительно первоначальной точки
        ctx.lineTo(320, 0); //первое значение x затем y
        ctx.lineTo(320, 40);
        ctx.lineTo(400, 40);
        ctx.moveTo(320, 0);
        ctx.lineTo(400, 0);
        ctx.moveTo(320, 0);
        ctx.lineTo(320, -40);
        ctx.lineTo(400, -40); //можно устранить менусовые значения при проблемах
        ctx.lineWidth = 15;
        ctx.stroke();
        Trident.x += TridentVelocityX * 5;
        Trident.y += TridentVelocityY * 5;
        setTimeout(() => { TridentDrawStatus = true; Trident.x = Player.x }, 20000); //через 10 секунда восстанавливаем значение
    };
};
//-------------------------------------------------------
//Функцция прыжка keyW
let LeapStatus = false; //начальный статус прыжка
window.addEventListener("keyup", (event) => {
    if (event.code == 'KeyW') {
        LeapStatus = true; //изменяем статус прыжка по нажатию w
        console.log("kek");
        }
});
function Leap() {
    if (LeapStatus) {
        if (clickX < Player.x - Player.size) Player.moveLeft(5);
        if (clickX > Player.x + Player.size) Player.moveRight(5);
        if (clickY < Player.y - Player.size) Player.moveUp(5);
        if (clickY > Player.y + Player.size) Player.moveDown(5);
        setTimeout(() => { LeapStatus = false }, 3000); //через 3 секунды восстанавливаем начальное значение
    };
};
//--------------------------------------------------------
//Фунция глобальной отрисовки других функций DrawAll();
function DrawAll() {
    canvasSize(); //функция задаёт параметры canvas
    PlayerDraw(); //функция отрисовки игрока
    TridentDraw(); //функция отрислвки трезубца
    TridentShot(); //функция отрисовки после вызова
    Leap(); //функция ускорения "w"
    PlayerControl(); //функция управления круга игрока
    requestAnimationFrame(DrawAll); //№1 вызов запускает цикл перерисовки DrawAll
};
//-------------------------------------------------------
window.onload = DrawAll(); // после загрузки страницы вызываем canvas
//-------------------------------------------------------