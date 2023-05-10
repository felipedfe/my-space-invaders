import Projectile from './projectile.js';

export default class Player {
  constructor(
    x, y, playerWidth,
    playerHeight,
    projectileWidth = 7,
    projectileHeight = 14,
    projectileSpeed = 9
  ) {
    this.x = x;
    this.y = y;
    this.width = playerWidth;
    this.height = playerHeight;
    this.projectileSpeed = projectileSpeed;
    this.projectileWidth = projectileWidth;
    this.projectileHeight = projectileHeight;
    this.projectile = null;
    this.projectileInScreen = false;
    this.pressingLeft = false;
    this.pressingRight = false;
  }

  throwProjectile = () => {
    // Se o projétil não estiver na tela, um novo pode ser lançado
    if (!this.projectileInScreen) {
      this.projectile = new Projectile(
        (this.x + ((this.width / 2) - this.projectileWidth / 2)),
        this.y,
        this.projectileWidth,
        this.projectileHeight
      );
      this.projectileInScreen = true;
    }
  }

  moveProjectile = () => {
    this.projectile.y -= this.projectileSpeed;
    if (this.projectile.y < 0) {
      this.projectileInScreen = false;
    }
  }
};
