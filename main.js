import Player from './classes/player.js';
import Enemy from './classes/enemy.js';
import {
  playerProjectileColision,
  enemyProjectileColision,
  enemyPlayerColision
} from './helpers/collisionChecks.js';

const myCanvas = document.getElementById("myCanvas");
const backgroundImg = document.getElementById("background");
const playerSprite = document.getElementById("ship");
const enemySpriteSheet = document.getElementById("enemies");
let enemySpritePos = 0;
console.log(myCanvas)

window.ctx = myCanvas.getContext("2d");
console.log(ctx);

ctx.fillStyle = "#ecf53d";

///////////////////////////

// Config
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 500;
let idUpdate;
let idEnemyAttacks;

const enemiesList = [];
let aliveEnemies = [];
const enemyWidth = 50;
const enemyHeight = 45;
const enemyGap = 0;
const enemiesSpeed = 0.6;
let enemiesDirectionRight = true;
let attackingEnemyIndex = 0;

let player;
const playerWidth = 35;
const playerHeight = 45;

const spriteWidth = enemySpriteSheet.width / 10;
const spriteHeight = enemySpriteSheet.height / 10;
const enemyImageHash = {};

// Funções
function printBackground() {
  ctx.drawImage(backgroundImg, 0, 0);
  // ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function printPlayer() {
  // ctx.fillRect(player.x, player.y, player.width, player.height)
  ctx.drawImage(playerSprite, player.x, player.y, player.width, player.height)
}

function printProjectile(projectile) {
  ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height)
}

function buildEnemiesList() {
  let x = 0;
  let y = 0;
  for (let l = 0; l < 5; l += 1) {
    for (let i = 0; i < 10; i += 1) {
      const enemy = new Enemy(x, y, enemyWidth, enemyHeight);
      enemiesList.push(enemy);
      x += (enemyWidth + enemyGap);

      // Para gerar partes de uma imagem gigante
      // enemyImageHash[enemy.id] = [spriteWidth * i, spriteHeight * l, spriteWidth, spriteHeight];
    }
    y += (enemyHeight + enemyGap);
    x = 0;
  }
  // console.log("=====>", enemyImageHash)

  // aliveEnemies é gerada para que os inimigos ainda vivos possam ficar em uma lista com 
  // índices ordenados (para que a função Math.random possa funcionar). A expressão
  // delete enemiesList[index] apaga o item da lista, mas seu índice continua no array, logo
  // se Math.random acessasse um índice sem inimigo um erro seria gerado.
  aliveEnemies = enemiesList;
  console.log(aliveEnemies)
}

function printEnemies() {
  for (let enemy of enemiesList) {
    if (enemy) {
      ctx.drawImage(enemySpriteSheet, enemySpritePos, 0, 160, 140, enemy.x, enemy.y, enemy.width, enemy.height);
      // ctx.drawImage(enemySpriteSheet, ...enemyImageHash[enemy.id],enemy.x, enemy.y, enemy.width, enemy.height)

    }
  }
}


function moveEnemies() {
  enemiesList.forEach((enemy) => {
    if (enemiesDirectionRight) {
      enemy.x += enemiesSpeed
    } else {
      enemy.x -= enemiesSpeed
    }
    // Se os inimigos encostam nas extremidades a direção deles muda e eles descem um pouco no eixo y 
    if ((enemy.x > (CANVAS_WIDTH - enemy.width)) || enemy.x < 0) {
      enemiesDirectionRight = !enemiesDirectionRight;
      enemiesList.forEach((enemy) => enemy.y += (enemy.height))
    }
  });
}

function enemyAttacks() {
  if (aliveEnemies.length > 0) {
    const randomIndex = Math.floor(Math.random() * (aliveEnemies.length))
    console.log(aliveEnemies);
    console.log(`inimigo ${aliveEnemies[randomIndex].id} ataca`)
    attackingEnemyIndex = randomIndex;
    aliveEnemies[attackingEnemyIndex].throwProjectile()
    console.log(randomIndex)
    // if (enemySpritePos === 0) {
    //   enemySpritePos = 160
    // } else {
    //   enemySpritePos = 0
    // }

    if (enemySpritePos === 0) {
      enemySpritePos = 160
    } else {
      enemySpritePos = 0
    }
  }
}

function movePlayer() {
  if (player.pressingLeft) player.x -= 5;
  if (player.pressingRight) player.x += 5;
};

function gameOver() {
  clearInterval(idUpdate);
  clearInterval(idEnemyAttacks);
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Funções START e UPDATE
function updateScreen() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);     // limpa a tela

  movePlayer();
  printBackground();
  printPlayer();
  printEnemies();
  moveEnemies();

  if (player.projectileInScreen) {
    player.moveProjectile();
    printProjectile(player.projectile);
    playerProjectileColision(player, enemiesList);
    enemiesList.forEach((enemy, index) => {
      if (playerProjectileColision(player, enemy)) {
        player.projectileInScreen = false;
        aliveEnemies = enemiesList.filter((enemy) => enemy.id !== enemiesList[index].id);
        // Quadrado pisca quando inimigo é acertado
        ctx.fillRect(enemy.x, enemy.y, enemyWidth, enemyHeight);
        delete enemiesList[index];
      }
    })
  }

  // aliveEnemies[attackingEnemyIndex].moveProjectile();
  // printProjectile(aliveEnemies[attackingEnemyIndex]);
  if (aliveEnemies[attackingEnemyIndex]?.projectileInScreen) {
    const attackingEnemy = aliveEnemies[attackingEnemyIndex];
    attackingEnemy.moveProjectile();
    printProjectile(attackingEnemy.projectile);
    if (enemyProjectileColision(player, attackingEnemy)) {
      console.log("BUM!")
      gameOver()
    }
  }
  // printProjectile(aliveEnemies[2]);
  // console.log(attackingEnemyIndex)
  // checkEnemyPlayerColision();
  enemiesList.forEach((enemy) => {
    if (enemyPlayerColision(player, enemy)) {
      console.log("ACERTOU!")
    }
  })
  window.requestAnimationFrame(updateScreen);
}

function startGame() {
  // document.location.href = '/stage-2';
  // funcao();
  buildEnemiesList();
  player = new Player((CANVAS_WIDTH / 2), ((CANVAS_HEIGHT - playerHeight) - 4), playerWidth, playerHeight);

  document.addEventListener("keydown", (event) => {
    if (event.key === "a" || event.key === "A") {
      player.throwProjectile()
    }
    if (event.key === "ArrowLeft") {
      player.pressingLeft = true;
      player.pressingRight = false;
    }
    else if (event.key === "ArrowRight") {
      player.pressingLeft = false;
      player.pressingRight = true;
    }
  })

  document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") {
      player.pressingLeft = false;
    }
    else if (event.key === "ArrowRight") {
      player.pressingRight = false;
    }
  })

  idEnemyAttacks = setInterval(enemyAttacks, 1000);
  // idUpdate = setInterval(updateScreen, 20);
  window.requestAnimationFrame(updateScreen);
}

////////////////////////////////////

window.onload = startGame();
// delete enemiesList[33]
