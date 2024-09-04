class Building {

    static i;
    static button;
    static type = 'Building';
    static checkEveryFrame = [];
    static everyFrameArr = ['Production', "Combat"];
    static buildings =  [];
    static levelColors = [
        {
            bg: 'rgb(133, 100, 61)',
            border: 'rgb(74, 55, 33)'
        },
        {
            bg: 'rgb(117, 112, 99)',
            border: 'rgb(84, 80, 72)'
        }
    ];

    constructor(j, i) {
        this.level = 1;
        this.j = j;
        if(j != -1) {
            this.constructor.count++;
            this.health = this.constructor.stats[0].health;
            this.i = i;
            this.x = j + 0.5;
            this.y = i + 0.5;
            board[i][j] = this;
            this.classType = 'Building';
            this.solid = true;
            this.healthBar = new HealthBar(j, i, this);

            Building.buildings.push(this);
            if(Building.everyFrameArr.includes(this.constructor.role)) {
                Render.checkEveryFrame.push(this);
            }
        }
    }

    static build(x, y) {
        if(House.house == null && this.name != "House") {
            return false;
        }
        if(this.buildLimit != undefined && this.count >= this.buildLimit) {
            return false;
        }
        if(Player.player.materials.wood >= this.cost[0].wood && Player.player.materials.stone >= this.cost[0].stone && Player.player.materials.food >= this.cost[0].food && Player.player.materials.gold >= this.cost[0].gold) {
            Player.player.materials.wood -= this.cost[0].wood;
            Player.player.materials.stone -= this.cost[0].stone;
            Player.player.materials.food -= this.cost[0].food;
            Player.player.materials.gold -= this.cost[0].gold;
            new this(x, y);
            return true;
        } else {
            return false;
        }
    }

    upgrade() {
        if(this.level < this.constructor.stats.length && (this.level < House.house.level || this.constructor.name == "House") ) {
            if(Player.player.materials.wood >= this.constructor.cost[this.level].wood && Player.player.materials.stone >= this.constructor.cost[this.level].stone && Player.player.materials.food >= this.constructor.cost[this.level].food && Player.player.materials.gold >= this.constructor.cost[this.level].gold) {
                Player.player.materials.wood -= this.constructor.cost[this.level].wood;
                Player.player.materials.stone -= this.constructor.cost[this.level].stone;
                Player.player.materials.food -= this.constructor.cost[this.level].food;
                Player.player.materials.gold -= this.constructor.cost[this.level].gold;
                
                this.level++;
                this.health = this.constructor.stats[this.level-1].health;
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    checkEntityCollision(obj) {

        // Square properties
        const squareHalfLength = 0.5;
        const squareLeft = this.x - squareHalfLength;
        const squareRight = this.x + squareHalfLength;
        const squareTop = this.y + squareHalfLength;
        const squareBottom = this.y - squareHalfLength;

        // Find the closest point on the square to the circle's center
        const closestX = Math.max(squareLeft, Math.min(obj.x, squareRight));
        const closestY = Math.max(squareBottom, Math.min(obj.y, squareTop));

        // Calculate the distance between the circle's center and this closest point
        const distanceX = obj.x - closestX;
        const distanceY = obj.y - closestY;

        // If the distance is less than the circle's radius, they are colliding
        const distanceSquared = distanceX**2 + distanceY**2;
        if(distanceSquared < obj.radiusTiles**2) {
            return this;
        } else {
            return null;
        }
    }

    hit(obj = Player.player) {
        if(!Render.checkEveryFrame.includes(this)) {
            Render.checkEveryFrame.push(this);
        }
        if(obj < 0) {
            this.health = Math.min(this.constructor.stats[this.level-1].health, this.health + this.constructor.stats[this.level-1].health*Math.abs(obj));
        } else {
            this.hitInfo = {
                time: 0,
                dx: this.x - obj.x,
                dy: this.y - obj.y
            };
            if(obj.buildingDamage > 0) {
                this.healthBar.timeSinceLastCall = 0;
                this.health -= obj.buildingDamage;
                if(this.health <= 0) {
                    board[this.i][this.j] = null;
                    Render.checkEveryFrame.splice(Render.checkEveryFrame.indexOf(this), 1);
                    Building.buildings.splice(Building.buildings.indexOf(this), 1);
                    this.constructor.count--;
                    return true;
                }
            }
        }
        return false;
    }

    update() {
        if(this.hitInfo !== undefined) {

            this.hitInfo.time += deltaTime;

            //Terminates the animation if the 100ms is up 
            if(this.hitInfo.time > 150) {
                this.hitInfo = undefined;
                if(!Building.everyFrameArr.includes(this.constructor.role) && this.health >= this.constructor.stats[this.level-1].health) {
                    Render.checkEveryFrame.splice(Render.checkEveryFrame.indexOf(this), 1);
                }
            } else {
                let c = 72/tilesHigh*Math.sin(Math.PI * this.hitInfo.time/150); //150 is `ms` count, graphed in desmos to make smooth curve
                let arr = normalizeSum(this.hitInfo.dx, this.hitInfo.dy, c);
                this.hitInfo.dx = arr[0];
                this.hitInfo.dy = arr[1];
            }
        }
        if(this.healthBar.timeSinceLastCall < 3500) {
            this.healthBar.update();
        }
        if(this.healthBar.timeSinceLastCall > 2500 && this.health < this.constructor.stats[this.level-1].health) {
            this.health = Math.min(this.constructor.stats[this.level-1].health, this.health + this.constructor.stats[this.level-1].health/(5*deltaFrames));
        }
        if(this.constructor.role == 'Production') {
            if(nowTime%1000 < previousTime%1000) {
                Player.player.materials[this.constructor.productionType] += this.constructor.stats[this.level-1][`${this.constructor.productionType}Production`];
            }
        }
        if(this.constructor.role == 'Combat') {
            this.timeSinceLastAttack += deltaTime;
            if(this.constructor.name == "Aura") {
                if(this.timeSinceLastAttack >= this.constructor.stats[this.level-1].attackRate*1000) {
                    this.attack();
                }
                return;
            }
            if(this.target != null && this.target.health <= 0 && this.constructor.projectileType == 'Projectile') {
                this.target = null;
            }
            if(this.constructor.name == 'Beacon' && this.target != null && this.target.health <= 0 && this.timeSinceLastAttack > 200) {
                this.target == null;
            } 
            if(this.target == null && this.constructor.searchForTarget == 'pre') {
                this.target = Enemy.search(this, this.constructor.stats[this.level-1].range);
            }
            if(this.target != null || this.constructor.searchForTarget == 'post') {
                if(this.timeSinceLastAttack > this.constructor.stats[this.level-1].attackRate*1000) {
                    if(this.target == null && this.constructor.searchForTarget == 'post') {
                        this.target = Enemy.search(this, this.constructor.stats[this.level-1].range);
                    }
                    if(this.target != null) {
                        this.timeSinceLastAttack = 0;
                        if(this.constructor.projectileType == 'Projectile') {
                            new Projectile(this.x, this.y, this.constructor.stats[this.level-1].speed, this.target, this);
                        } else if(this.constructor.projectileType == 'Individual') {
                            this.attack();
                        }
                    }
                }
            }
        }
    }

    draw(x, y) {
        if(this.hitInfo !== undefined) {
            x += this.hitInfo.dx;
            y += this.hitInfo.dy;
        }
        ctx.drawImage(this.constructor.images[this.level-1].Base, x-tileWidth/2, y-tileWidth/2, tileWidth, tileWidth);
        return [x, y];
    }

    updateAngle() {
        if(this.target == null) {
            let lastTime = this.behavior.current[1];
            let lastDirection = this.behavior.direction;
            let behaviorChanged = false;
            this.behavior.current[1] += deltaTime;

            if(this.behavior.current[1] > this.behavior[this.behavior.current[0]]) {
                behaviorChanged = true;
                this.behavior.current[1] %= this.behavior[this.behavior.current[0]];
                Math.random() < 0.5 ? this.behavior.direction = 1 : this.behavior.direction = -1;

                if(this.behavior.current[0] == 'off') {
                    this.behavior.current[0] = 'on';
                } else {
                    this.behavior.current[0] = 'off';
                    this.behavior.angle += ((this.behavior.on-lastTime)/this.behavior.on)*lastDirection;
                }
            }
            if(this.behavior.current[0] == 'on') {
                if(!behaviorChanged) {
                    let dt = this.behavior.current[1] - lastTime;
                    this.behavior.angle += dt/this.behavior.on * this.behavior.rotationPerOn * this.behavior.direction;
                } else {
                    this.behavior.angle += this.behavior.current[1]/this.behavior.on * this.behavior.rotationPerOn * this.behavior.direction;
                }
            }
        } else {
            this.behavior.current = ["off", 0];
            this.behavior.angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        }
    }
}