import Projectile from './projectile.js';
import { CANVAS_HEIGHT } from '../main.js';

export default class Enemy {
    constructor(
        x, y, enemyWidth,
        enemyHeight,
        projectileHeight = 14,
        projectileWidth = 7,
        projectileSpeed = 9
    ) {
        this.id = Enemy.generateId();
        this.x = x;
        this.y = y;
        this.width = enemyWidth;
        this.height = enemyHeight;
        this.projectileSpeed = projectileSpeed;
        this.projectileWidth = projectileWidth;
        this.projectileHeight = projectileHeight;
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
        this.projectile = new Projectile(
            (this.x + ((this.width / 2) - this.projectileWidth / 2)),
            this.y + this.height,
            this.projectileWidth,
            this.projectileHeight);
        this.projectileInScreen = true;
    }

    moveProjectile = () => {
        // this.projectile.y += projectileSpeed;
        // if (this.projectile.y > CANVAS_HEIGHT) {
        //   this.projectileInScreen = false;
        // }
        this.projectile.y += this.projectileSpeed;
        if (this.projectile.y > CANVAS_HEIGHT) {
            this.projectileInScreen = false;
        }
    }
};