let player;
const playerWidth = 35;
const playerHeight = 45;

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

export default Player;
