export function playerProjectileColision(player, enemy) {
    return (enemy.x < (player.projectile.x + player.projectile.width) &&
        (enemy.x + enemy.width) > (player.projectile.x + player.projectile.width) &&
        (enemy.y + enemy.height) > player.projectile.y &&
        (enemy.y < player.projectile.y))
};

export function enemyProjectileColision(player, enemy) {
    return (player.x < (enemy.projectile.x) &&
        (player.x + player.width) > (enemy.projectile.x + enemy.projectile.width) &&
        (player.y + player.height) > enemy.projectile.y &&
        (player.y < enemy.projectile.y))

}

export function enemyPlayerColision(player, enemy) {
    return (enemy.x + enemy.width > player.x &&
        enemy.x < player.x &&
        enemy.y + enemy.height > player.y)
};
