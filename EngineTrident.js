//инициализируем канвас
const canvas = document.getElementById('canvas');
canvas.width = 2000; //- ширина canvas
canvas.height = 2000; //- высота canvas
const ctx = canvas.getContext('2d');
//- Функция очистки canvas (полной)
let ClearCanvas = () => {
    ctx.clearRect(-1000, -1000, 3000, 3000); //полная очистка canvas
};
//-------------------
// переменная Player
let Player = {
    y: canvas.width / 2,
    x: canvas.height / 2,
    size: 150,
    text: "Player",
    color: "yellow",
    imgSkin: "",
    id: "1",
};
//- Функция отрисовки Player
let PlayerDraw = () => {
    ctx.beginPath();
    ctx.resetTransform(); //- обнуление  translate
    ctx.arc(Player.x, Player.y, Player.size, 0, 2 * Math.PI, false); //0 параметр размера отвечает за радиус отображения круга
    ctx.fillStyle = Player.color;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = '#004777';
    ctx.font = "40px Arial";
    ctx.fillText(Player.text, Player.x - 50, Player.y);
};
//---- тестывые круги
let test = () => {
    ctx.beginPath();
    ctx.translate(canvas.width/2-canvasX,canvas.height/2-canvasY);
    ctx.arc(60, 10, 50, 0, 2 * Math.PI, false);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(100, 200, 50, 0, 2 * Math.PI, false);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(200, 900, 50, 0, 2 * Math.PI, false);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
};
//----
//Функция управления игроком и переменные координат по X Y
let clientY = canvas.width / 2;
let clientX = canvas.height / 2;
let canvasX = 0;
let canvasY = 0;
let movementAngle;
let angleX = 0;
let angleY = 0;
let startPlayerControl = true; //- костыль
    canvas.addEventListener("click", (event) => {
         clientY = event.clientY;
         clientX = event.clientX;
         startPlayerControl = false; //- костыль
    }); //слушаем наличие кликов по canvas
    function PlayerControl() {
        if (!startPlayerControl) { //- костыль
            movementAngle = Math.atan2(clientY - Player.y, clientX - Player.x); //- высисляем угол в радианах
            //  console.log(movementAngle);
            angleX = Math.cos(movementAngle);
            // console.log(angleX);
            angleY = Math.sin(movementAngle);
            // console.log(angleY);
            canvasX += angleX; // canvas и угол по x до цели
            canvasY += angleY; // canvas и угол по y до цели
        }
    };
//Фунция глобальной отрисовки других функций DrawAll();
function DrawAll() {
    ClearCanvas(); //- Вызов функции очитки canvas
    PlayerControl(); //функция управления игрока мышкой
    PlayerDraw(); //функция отрисовки игрока
    test();
    requestAnimationFrame(DrawAll); //№1 вызов запускает цикл перерисовки DrawAll
};
//-------------------------------------------------------
window.onload = DrawAll(); // после загрузки страницы вызываем все функции на canvas
//-------------------------------------------------------
