class UntargetedProjectile extends Projectile {

    constructor(x, y, speed, dy, dx, obj) {
        super(x, y, speed, undefined, obj);
        this.dy = dy;
        this.dx = dx;
        this.angle = Math.atan2(dy, dx);
    }

    update() {
        super.update();
        let nearestEnemy = Enemy.search(this, this.obj.projectileRadiusTiles*2);
        if(nearestEnemy != null) {
            nearestEnemy.timeSinceLastStun = 0;
            nearestEnemy.lastStunTime = this.obj.stats[this.obj.level-1].stunTime;
            Projectile.projectiles.splice(Projectile.projectiles.indexOf(this), 1);
            nearestEnemy.hit(this.obj.stats[this.obj.level-1]);
        }
    }
}