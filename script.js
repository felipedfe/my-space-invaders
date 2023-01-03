const myCanvas = document.getElementById("myCanvas")
console.log(myCanvas)

ctx = myCanvas.getContext("2d")
console.log(ctx)

ctx.fillStyle = "#0055FF";

///////

// Globals
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
let idUpdate;
let idEnemyAttacks;

const enemiesList = [];
let aliveEnemies = [];
const enemyWidth = 40;
const enemyHeight = 35;
const enemyGap = 15;
const enemiesSpeed = 0.6;
let enemiesDirectionRight = true;
let attackingEnemyIndex = 0;

let player;
const playerWidth = 30;
const playerHeight = 40;

// let projectile;
const projectileWidth = 7;
const projectileHeight = 14;
const projectileSpeed = 9;

// Classes
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = playerWidth;
    this.height = playerHeight;
    this.projectile = null;
    this.projectileInScreen = false;
    this.pressingLeft = false;
    this.pressingRight = false;
  }

  throwProjectile = () => {
    // Se o projétil não estiver na tela, um novo pode ser lançado
    if (!this.projectileInScreen) {
      this.projectile = new Projectile((this.x + ((this.width / 2) - projectileWidth / 2)), this.y);
      this.projectileInScreen = true;
    }
  }

  moveProjectile = () => {
    this.projectile.y -= projectileSpeed;
    if (this.projectile.y < 0) {
      this.projectileInScreen = false;
    }
  }
}

class Projectile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = projectileWidth;
    this.height = projectileHeight;
  }
}

class Enemy {
  constructor(x, y) {
    this.id = Enemy.generateId();
    this.x = x;
    this.y = y;
    this.width = enemyWidth;
    this.height = enemyHeight;
    this.projectile = null;
    this.projectileInScreen = false;
  }

  static generateId = () => {
    if (!this.latestId) {
      this.latestId = 1
    } else {
      this.latestId += 1
    }
    return this.latestId;
  }

  throwProjectile = () => {
    // if (!this.projectileInScreen) {
    //   this.projectile = new Projectile(20, 20);
    //   this.projectileInScreen = true;
    // }
    this.projectile = new Projectile((this.x + ((this.width / 2) - projectileWidth / 2)), this.y + this.height);
    this.projectileInScreen = true;
  }

  moveProjectile = () => {
    // this.projectile.y += projectileSpeed;
    // if (this.projectile.y > CANVAS_HEIGHT) {
    //   this.projectileInScreen = false;
    // }
    this.projectile.y += projectileSpeed;
    if (this.projectile.y > CANVAS_HEIGHT) {
      this.projectileInScreen = false;
    }
  }
};

// Funções
function printPlayer() {
  ctx.fillRect(player.x, player.y, player.width, player.height)
}

function printProjectile(projectile) {
  ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height)
}

function buildEnemiesList() {
  let x = 0;
  let y = 0;
  for (let l = 0; l < 5; l += 1) {
    for (let i = 0; i < 10; i += 1) {
      const enemy = new Enemy(x, y);
      enemiesList.push(enemy);
      x += (enemyWidth + enemyGap);
    }
    y += (enemyHeight + enemyGap);
    x = 0;
  }

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
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
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
  }
}

function movePlayer() {
  if (player.pressingLeft) player.x -= 5;
  if (player.pressingRight) player.x += 5;
}

function checkPlayerProjectileColision() {
  enemiesList.forEach((enemy, index) => {
    if (enemy.x < (player.projectile.x + player.projectile.width) &&
      (enemy.x + enemy.width) > (player.projectile.x + player.projectile.width) &&
      (enemy.y + enemy.height) > player.projectile.y &&
      (enemy.y < player.projectile.y)
    ) {
      player.projectileInScreen = false;
      aliveEnemies = enemiesList.filter((enemy) => enemy.id !== enemiesList[index].id);
      delete enemiesList[index];
    }
  })
}

function checkEnemyProjectileColision(enemy) {
  if (player.x < (enemy.projectile.x) &&
    (player.x + player.width) > (enemy.projectile.x + enemy.projectile.width) &&
    (player.y + player.height) > enemy.projectile.y &&
    (player.y < enemy.projectile.y)
  ) {
    // player.projectileInScreen = false;
    // aliveEnemies = enemiesList.filter((enemy) => enemy.id !== enemiesList[index].id);
    // delete enemiesList[index];
    console.log("BUM!")
    // player = null;
    gameOver()

  }
  // console.log(enemy.projectile.width)
}

function checkEnemyPlayerColision() {
  enemiesList.forEach((enemy) => {
    if (enemy.x + enemy.width > player.x &&
      enemy.x < player.x &&
      enemy.y + enemy.height > player.y
    ) {
      console.log("ACERTOU!")
    }
  })
}

function gameOver() {
  clearInterval(idUpdate);
  clearInterval(idEnemyAttacks);
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Funções START e UPDATE
function updateScreen() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);     // limpa a tela

  movePlayer();
  printPlayer();
  printEnemies();
  moveEnemies();

  if (player.projectileInScreen) {
    player.moveProjectile();
    printProjectile(player.projectile);
    checkPlayerProjectileColision()
  }

  // aliveEnemies[attackingEnemyIndex].moveProjectile();
  // printProjectile(aliveEnemies[attackingEnemyIndex]);
  if (aliveEnemies[attackingEnemyIndex].projectileInScreen) {
    const attackingEnemy = aliveEnemies[attackingEnemyIndex];
    attackingEnemy.moveProjectile();
    printProjectile(attackingEnemy.projectile);
    checkEnemyProjectileColision(attackingEnemy);
  }
  // printProjectile(aliveEnemies[2]);
  // console.log(attackingEnemyIndex)
  checkEnemyPlayerColision();
}

function startGame() {
  buildEnemiesList();
  player = new Player((CANVAS_WIDTH / 2), (CANVAS_HEIGHT - playerHeight))

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
  idUpdate = setInterval(updateScreen, 20);
}

////////////////////////////////////

startGame();
// delete enemiesList[33]
