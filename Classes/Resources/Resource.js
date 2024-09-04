class Resource {

    static checkEveryFrame = [];
    static radius;
    static radiusTiles;
    static type = 'Resource';
    static health = 3;

    constructor(j, i, playerMade) {
        this.j = j;
        this.i = i;
        this.x = j+0.5;
        this.y = i+0.5;
        this.classType = "Resource";
        this.health = Resource.health;
        this.healthBar = new HealthBar(j, i, this);
        this.angle = Math.random()*2*Math.PI;
        if(playerMade) {
            this.playerMade = true;
            this.constructor.count++;
        }
    }

    static build(x, y) {
        if(this.count >= this.buildLimit) {

            return false;
        }
        if(House.house != null && Math.abs(x-House.house.x) <= 1 && Math.abs(y-House.house.y) <= 1) {
            return false;
        }
        if(Player.player.materials.wood >= this.cost.wood && Player.player.materials.stone >= this.cost.stone && Player.player.materials.food >= this.cost.food) {
            Player.player.materials.wood -= this.cost.wood;
            Player.player.materials.stone -= this.cost.stone;
            Player.player.materials.food -= this.cost.food;
            board[y][x] = new this(x, y, true);
            return true;
        } else {
            return false;
        }
    }

    checkEntityCollision(obj) {
        if((obj.x-this.x)**2 + (obj.y-this.y)**2 < (obj.constructor.radiusTiles + Resource.radiusTiles)**2) {
            return this;
        }
        return null;
    }

    hit(obj = Player.player) {
        if(!Render.checkEveryFrame.includes(this)) {
            Render.checkEveryFrame.push(this);
        }
        this.hitInfo = {
            time: 0,
            dx: this.x - Player.player.x,
            dy: this.y - Player.player.y
        }
        if(Player.player.resourceDamage > 0) {
            this.healthBar.timeSinceLastCall = 0;
            this.health -= obj.resourceDamage;
            if(this.health <= 0) {
                if(this.playerMade === true) {
                    this.constructor.count--;
                }
                board[this.i][this.j] = null;
                Render.checkEveryFrame.splice(Render.checkEveryFrame.indexOf(this), 1);
            }
        }
    }

    update() {
        if(this.hitInfo !== undefined) {

            this.hitInfo.time += deltaTime;

            //Terminates the animation if the 200ms is up
            if(this.hitInfo.time > 200) {
                this.hitInfo = undefined;
                Render.checkEveryFrame.splice(Render.checkEveryFrame.indexOf(this), 1);
            } else {
                let c = 84/tilesHigh*Math.sin(Math.PI * this.hitInfo.time/200); //200 is `ms` count, graphed in desmos to make smooth curve
                let arr = normalizeSum(this.hitInfo.dx, this.hitInfo.dy, c);
                this.hitInfo.dx = arr[0];
                this.hitInfo.dy = arr[1];
            }
        }
        if(this.healthBar.timeSinceLastCall < 3500) {
            this.healthBar.update();
        }
        if(this.healthBar.timeSinceLastCall > 3000 && this.health != Resource.health) {
            this.health = Resource.health;
        }
    }

    draw(x, y) {
        if(this.hitInfo !== undefined) {
            x += this.hitInfo.dx;
            y += this.hitInfo.dy;
        }
        let obj = {
            "Rock": 1,
            "Gold": 1,
            "Bush": 2,
            "Tree": 3
        };
        if(ctx.globalAlpha != 1) {
            let alpha = ctx.globalAlpha;
            Render.queue[obj[this.constructor.name]].push(() => {
                ctx.globalAlpha = alpha;
                Canvas.drawWithAngle(x, y, this.angle, this.constructor.image, this.constructor.drawRadiusTiles*2*tileWidth);
                ctx.globalAlpha = 1;
            });
        } else {
            Render.queue[obj[this.constructor.name]].push(() => {
                Canvas.drawWithAngle(x, y, this.angle, this.constructor.image, this.constructor.drawRadiusTiles*2*tileWidth);
            });
        }
    }
}