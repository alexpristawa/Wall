class Enemy extends Entity {

    static enemies = [];
    static maxVelocity = 5;
    static radiusTiles = 0.25;
    static maxHealth = 40;
    static buildingDamage = 10;

    constructor(x, y, radiusTiles = Enemy.radiusTiles, maxHealth = Enemy.maxHealth, buildingDamage = Enemy.buildingDamage, maxVelocity = Enemy.maxVelocity, color = 'rgb(100, 100, 100)', obj = {}) {
        super(x, y);
        this.attackDegrees = 150;
        this.radiusTiles = radiusTiles;
        this.attackRadius = this.radiusTiles+0.5;
        this.buildingDamage = buildingDamage;
        this.resourceDamage = 0;
        this.classType = 'Enemy';
        this.health = maxHealth;
        this.maxHealth = maxHealth;
        this.maxVelocity = maxVelocity;
        this.healthBar = new HealthBar(x-0.5, y-0.5, this);
        this.color = color;
        Object.keys(obj).forEach(key => {this[key] = obj[key]});
        this.timeSinceLastStun = 0;
        this.lastStunTime = 0;
        if(this.special == 'Spawner') {
            this.timeSinceLastSpawn = 0;
        }
        Enemy.enemies.push(this);
    }

    static updateEnemies() {
        for(let i = Enemy.enemies.length-1; i >= 0; i--) {
            Enemy.enemies[i].update();
        }
    }

    static drawEnemies() {
        for(let i = 0; i < Enemy.enemies.length; i++) {
            Enemy.enemies[i].draw();
        }
    }

    static sort() {
        for(let i = 1; i < Enemy.enemies.length-1; i++) {
            let obj = Enemy.enemies[i];
            let j = i-1;
            while(j >= 0 && obj.x < Enemy.enemies[j].x) {
                Enemy.enemies[j+1] = Enemy.enemies[j];
                j--;
            }
            Enemy.enemies[j+1] = obj;
        }
    }

    static search(building, range) {
        let minX = building.x - range;
        let left = 0;
        let right = Enemy.enemies.length - 1;
    
        // Find the first index where enemy.x >= minX
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (Enemy.enemies[mid].x >= minX) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
    
        let startIndex = left; 
    
        let minSquare = range ** 2;
        let minObj = null;
        for (let i = startIndex; i < Enemy.enemies.length; i++) {
            let obj = Enemy.enemies[i];
            if (obj.x > building.x + range) {
                break; 
            }
            if (Math.abs(obj.y - building.y) <= range) { 
                let sd = (obj.x - building.x) ** 2 + (obj.y - building.y) ** 2;
                if (sd <= minSquare) {
                    minSquare = sd;
                    minObj = obj;
                }
            }
        }
    
        return minObj;
    }

    static searchForAll(point, range) {
        let minX = point.x - range;
        let left = 0;
        let right = Enemy.enemies.length - 1;
    
        // Find the first index where enemy.x >= minX
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (Enemy.enemies[mid].x+Enemy.enemies[mid].radiusTiles >= minX) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
    
        let startIndex = left; 
    
        let arr = [];
        for (let i = startIndex; i < Enemy.enemies.length; i++) {
            let obj = Enemy.enemies[i];
            if (obj.x > point.x + range + obj.radiusTiles) {
                break; 
            }
            if (Math.abs(obj.y - point.y) <= range+obj.radiusTiles) { 
                let sd = (obj.x - point.x) ** 2 + (obj.y - point.y) ** 2;
                if (sd <= (range+obj.radiusTiles)**2) {
                    arr.push(obj);
                }
            }
        }
    
        return arr;
    }

    static getProperties = (i) => {
        return {
            health: 40 + i*20,
            buildingDamage: 10 + i*5,
            radiusTiles: Enemy.getRadiusTiles(i),
            color: Enemy.getColor(i),
            maxVelocity: Enemy.getMaxVelocity(i)
        };
    }
    
    static getRadiusTiles(num) {
        return 0.35+Math.sin(13.4*num)*0.2;
    }
    
    static getColor(num) {
        let b1 = Math.sin(num*101)*50+80;
        let b2 = Math.sin(num*249)*50+90
        let b3 = Math.sin(num*439)*50+65;

        return `rgb(${b1}, ${b2}, ${b3})`;
    }

    static getMaxVelocity(num) {
        return Math.sin(17.75*num)*2+5
    }

    update() {
        this.timeSinceLastAttack += deltaTime;
        this.timeSinceLastStun += deltaTime;
        this.updateCoordinates();
        if(this.special == 'Spawner') {
            this.timeSinceLastSpawn += deltaTime;
            if(this.timeSinceLastSpawn > 4000) {
                for(let i = 0; i <= 3*Math.floor(Game.nightCount/5); i++) {
                    let A = Math.random()-0.5;
                    let B = Math.random()-0.5;
                    [A, B] = normalizeSum(A, B, this.maxVelocity*4);
                    new Enemy(this.x, this.y, this.radiusTiles/2, this.health/5, this.buildingDamage/5, this.maxVelocity*2, this.color, {hVelocity: A, vVelocity: B, animationTime: 500});
                }
                this.timeSinceLastSpawn=0;
            }
        }
        this.healthBar.update();
    }

    updateCoordinates() {
        let dh = House.house.x - this.x;
        let dv = House.house.y - this.y;
        let maxH;
        let maxV;
        [maxV, maxH] = normalizeSum(Math.abs(dv), Math.abs(dh), this.maxVelocity);
        [dv, dh] = normalizeSum(dv, dh, this.maxVelocity * 6/deltaFrames);

        this.hVelocity += dh;
        this.vVelocity += dv;
        if(this.animationTime == undefined) {
            if(Math.abs(this.hVelocity) > maxH) {
                this.hVelocity = this.hVelocity/Math.abs(this.hVelocity)*maxH;
            }
            if(Math.abs(this.vVelocity) > maxV) {
                this.vVelocity = this.vVelocity/Math.abs(this.vVelocity)*maxV;
            }
        }

        this.frameHVelocity = this.hVelocity;
        this.frameVVelocity = this.vVelocity;

        
        let collidedObjects = this.getCollisions();
        collidedObjects.forEach(obj => this.adjustVelocity(obj));

        if(this.y >= 0 && this.x >= 0 && this.y < board.length && this.x < board[0].length) {
            let tile = board[Math.floor(this.y)][Math.floor(this.x)];
            if(tile != null && tile.constructor.name == 'Trap') {
                this.frameHVelocity = 0;
                this.frameVVelocity = 0;
                this.vVelocity = 0;
                this.hVelocity = 0;
            }
        }
        if(this.timeSinceLastStun < this.lastStunTime) {
            this.frameHVelocity = 0;
            this.frameVVelocity = 0;
            this.vVelocity = 0;
            this.hVelocity = 0;
        }

        if(this.animationTime != undefined) {
            this.animationTime -= deltaTime;
            if(this.animationTime<=0) {
                this.animationTime = undefined;
            }
        } else if(Math.abs(this.hVelocity/this.frameHVelocity) > Math.abs(this.vVelocity/this.frameVVelocity) && this.frameVVelocity == this.vVelocity) {
            this.frameVVelocity = this.vVelocity/Math.min(Math.abs(this.hVelocity/this.frameHVelocity), 5);
            this.attack();
        } else if(Math.abs(this.hVelocity/this.frameHVelocity) < Math.abs(this.vVelocity/this.frameVVelocity) && this.frameHVelocity == this.hVelocity) {
            this.frameHVelocity = this.hVelocity/Math.min(Math.abs(this.vVelocity/this.frameVVelocity), 5);
            this.attack();
        } else if(this.frameHVelocity**2 + this.frameVVelocity**2 < this.maxVelocity**2) {
            this.attack();
        }

        this.x += this.frameHVelocity/deltaFrames;
        this.y += this.frameVVelocity/deltaFrames;
    }

    hit(obj) {
        this.health -= obj.damage;
        if(this.health <= 0) {
            Enemy.enemies.splice(Enemy.enemies.indexOf(this), 1);

            return true;
        }
        return false;
    }

    attack() {
        if(this.timeSinceLastAttack > 800) {
            this.timeSinceLastAttack = 0;
        } else {
            return;
        }
        let squaresClicked = this.getOverlappingTiles();
        squaresClicked.forEach(square => {
            if(square.x >= 0 && square.x < board[0].length && square.y >= 0 && square.y < board.length) {
                let obj = board[square.y][square.x];
                if(obj != null) {
                    obj.hit(this);
                }
            }
        });
    }

    draw() {
        let x = (this.x-frame.sx)*tileWidth;
        let y = (this.y-frame.sy)*tileWidth;
        ctx.fillStyle = this.color;
        Canvas.circle(x, y, this.radiusTiles*tileWidth, 5);
    }
}