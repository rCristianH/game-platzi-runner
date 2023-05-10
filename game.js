const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const btnDown = document.querySelector("#down");
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const pResult = document.querySelector("#result");

let elementsSize;
let canvasSize;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined,
};
const giftPosition = {
  x: undefined,
  y: undefined,
};
let enemyPositions = [];

//Activa las funciones
window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);
showRecord();

function fixNumber(n) {
  return Number(n.toFixed(2));
}

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }
  canvasSize = Number(canvasSize.toFixed(0));
  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementsSize = canvasSize / 10;
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}
function startGame() {
  game.font = elementsSize + "px Verdana";
  game.textAlign = "end";

  const map = maps[level];

  if (!map) {
    gameWin();
    return;
  }
  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
  }
  const mapRows = map.trim().split("\n");
  const mapRowCols = mapRows.map((row) => row.trim().split(""));
  showLives();
  enemyPositions = [];
  game.clearRect(0, 0, canvasSize, canvasSize);
  /* For anidado que rellena la grilla del juego reemplazando los caracteres por emojis */
  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementsSize.toFixed(3) * (colI + 1);
      const posY = elementsSize.toFixed(3) * (rowI + 1);
      if (col == "O") {
        //Condicional para que cuando se reinicie no se elimine el jugador
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
        }
      } else if (col == "I") {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == "X") {
        enemyPositions.push({
          x: posX,
          y: posY,
        });
      }

      game.fillText(emoji, posX, posY);
    });
  });

  movePlayer();
}

function movePlayer() {
  if (playerPosition.x < elementsSize) playerPosition.x = elementsSize;
  if (playerPosition.y < elementsSize) playerPosition.y = elementsSize;
  if (playerPosition.x > elementsSize * 10)
    playerPosition.x = elementsSize * 10;
  if (playerPosition.y > elementsSize * 10)
    playerPosition.y = elementsSize * 10;
  //Detecta la colision con el siguiento nivel
  const giftCollisionX =
    playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY =
    playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;
  if (giftCollision) {
    levelWin();
  }
  //Colision  con enemigo
  const enemyCollision = enemyPositions.find((enemy) => {
    const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
    const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
    return enemyCollisionX && enemyCollisionY;
  });

  if (enemyCollision) {
    levelFail();
  }

  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}
function levelWin() {
  level++;
  startGame();
}
function levelFail() {
  lives--;
  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}
function gameWin() {
  console.log("¡Terminaste el juego!");
  timePlayer = Date.now() - timeStart;
  let getRecord = localStorage.getItem("recordTime");
  if (!getRecord || getRecord > timePlayer) {
    localStorage.setItem("recordTime", timePlayer);
  }

  console.log(localStorage.getItem("recordTime"));
  clearInterval(timeInterval);
  setTimeout(() => {
    lives = 0;
    levelFail();
  }, 3000);
}
function showLives() {
  const heartsArray = Array(lives).fill(emojis["HEART"]); // [1,2,3]

  spanLives.innerHTML = "";
  heartsArray.forEach((heart) => spanLives.append(heart));
}
function showTime() {
  spanTime.innerHTML = Date.now() - timeStart;
}
function showRecord() {
  spanRecord.innerHTML = localStorage.getItem("recordTime");
}

window.addEventListener("keydown", pressKey);
btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);

//Dectecta cual fue la tecla pulsada
function pressKey(event) {
  switch (event.key) {
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowDown":
      moveDown();
      break;
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    default:
      break;
  }
}

function moveUp() {
  playerPosition.y -= elementsSize;
  startGame();
}
function moveLeft() {
  playerPosition.x -= elementsSize;
  startGame();
}
function moveRight() {
  playerPosition.x += elementsSize;
  startGame();
}
function moveDown() {
  playerPosition.y += elementsSize;
  startGame();
}
