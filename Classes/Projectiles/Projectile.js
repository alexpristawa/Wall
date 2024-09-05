class Projectile {

    static projectiles = [];

    constructor(x, y, speed, target, obj) {
        this.x = x;
        this.y = y;
        this.ogX = x;
        this.ogY = y;
        this.speed = speed;
        this.target = target;
        this.obj = obj;
        this.radius = obj.constructor.projectileRadiusTiles;
        if(target === undefined) {
            this.range = this.obj.stats[this.obj.level-1].range;
        } else {
            this.range = this.obj.constructor.stats[this.obj.level-1].range;
        }
        Projectile.projectiles.push(this);
    }

    static updateProjectiles() {
        for(let i = Projectile.projectiles.length-1; i >= 0; i--) {
            Projectile.projectiles[i].update();
        }
        for(let i = 0; i < Projectile.projectiles.length; i++) {
            Projectile.projectiles[i].draw();
        }
    }

    update() {
        if(this.target !== undefined) {
            if(this.target != null) {
                this.endGoal = {x: this.target.x, y: this.target.y};
            }
            if(this.target != null && this.target.health <= 0) {
                this.target = null;
            }
        }
        let dy;
        let dx;
        if(this.target === undefined) {
            dx = this.dx;
            dy = this.dy;
        } else if(this.target != null) {
            dy = this.target.y-this.y;
            dx = this.target.x-this.x;
        } else {
            dy = this.endGoal.y-this.y;
            dx = this.endGoal.x-this.x;
        }
        [dy, dx] = normalizeSum(dy, dx, this.speed/deltaFrames);

        this.dy = dy;
        this.dx = dx;

        this.x += dx;
        this.y += dy;

        if(this.target !== undefined) {
            if(this.target != null && (this.x-this.target.x)**2 + (this.y-this.target.y)**2 < (this.radius+this.target.radiusTiles)**2) {
                if(this.obj.constructor.aoe == false) {
                    let killed = this.target.hit(this.obj.constructor.stats[this.obj.level-1]);
                    if(killed) {
                        this.obj.target = null;
                    }
                } else {
                    let killed = this.target.hit(this.obj.constructor.stats[this.obj.level-1]);
                    let allEnemies = Enemy.searchForAll({x: this.target.x, y: this.target.y}, this.obj.constructor.stats[this.obj.level-1].splashRange);
                    allEnemies.forEach(obj => {obj.hit(this.obj.constructor.stats[this.obj.level-1])});
                    if(killed) {
                        this.obj.target = null;
                    }
                }
                Projectile.projectiles.splice(Projectile.projectiles.indexOf(this), 1);
                return;
            } else if(this.target == null && this.obj.constructor.aoe && this.endGoal != undefined && (this.x-this.endGoal.x)**2 + (this.y-this.endGoal.y)**2 < (this.radius*1.5)**2) {
                let allEnemies = Enemy.searchForAll({x: this.endGoal.x, y: this.endGoal.y}, this.obj.constructor.stats[this.obj.level-1].splashRange);
                allEnemies.forEach(obj => {obj.hit(this.obj.constructor.stats[this.obj.level-1])});
                Projectile.projectiles.splice(Projectile.projectiles.indexOf(this), 1);
                return;
            }
        }

        if((this.x-this.ogX)**2 + (this.y-this.ogY)**2 > this.range**2) {
            Projectile.projectiles.splice(Projectile.projectiles.indexOf(this), 1);
        }

        if(isNaN(this.x) || isNaN(this.y)) {
            Projectile.projectiles.splice(Projectile.projectiles.indexOf(this), 1);
        }
    }

    draw() {
        let x = (this.x-frame.sx)*tileWidth;
        let y = (this.y-frame.sy)*tileWidth;
        if(this.target !== undefined) {
            if(this.target != null) this.angle = Math.atan2(this.target.y-this.y, this.target.x-this.x);
        }
        if(this.target === undefined) {
            let radius = this.obj.projectileRadiusTiles*tileWidth;
            Canvas.drawWithAngle(x, y, this.angle, this.obj.projectileImage, 2*radius);
        } else {
            let radius = this.obj.constructor.projectileRadiusTiles*tileWidth;
            Canvas.drawWithAngle(x, y, this.angle, this.obj.constructor.projectileImage, 2*radius);
        }
        //ctx.drawImage(this.obj.constructor.projectileImage, x-radius, y-radius, 2*radius, 2*radius);
    }
}