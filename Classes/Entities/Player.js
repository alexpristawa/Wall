class Player extends Entity {

    static player;
    static maxVelocity = 5;
    static radius;
    static radiusTiles;
    static ageText = document.querySelector('#main > #ageHolder > #ageCount');
    static ageBar = document.querySelector("#main > #ageHolder > #ageBar");
    
    constructor(x, y) {
        super(x, y);

        this.materials = {
            stone: 0,
            wood: 0,
            food: 0,
            gold: 0
        };
        this.age = 1;
        this.ageRewards = 0;
        Player.radiusTiles = 0.5;
        Player.player = this;
        this.radiusTiles = Player.radiusTiles;
        this.autoAttack = false;
        this.fixedSight = false;
    }

    updatePlayer() {
        this.timeSinceLastAttack += deltaTime;
        let maxVelocity = Player.maxVelocity;

        if(keyboard.w) {
            this.vVelocity -= maxVelocity * 6/deltaFrames;
        }
        if(keyboard.s) {
            this.vVelocity += maxVelocity * 6/deltaFrames;
        }
        if(keyboard.a) {
            this.hVelocity -= maxVelocity * 6/deltaFrames;
        }
        if(keyboard.d) {
            this.hVelocity += maxVelocity * 6/deltaFrames;
        }

        if(Math.abs(this.vVelocity) > maxVelocity) {
            this.vVelocity = Math.abs(this.vVelocity)/this.vVelocity * maxVelocity;
        }
        if(Math.abs(this.hVelocity) > maxVelocity) {
            this.hVelocity = Math.abs(this.hVelocity)/this.hVelocity * maxVelocity;
        }

        if((!keyboard.w && !keyboard.s) || (keyboard.w && keyboard.s)) {
            if(this.vVelocity > 0) {
                this.vVelocity = Math.max(0, this.vVelocity - maxVelocity*3/deltaFrames);
            } else {
                this.vVelocity = Math.min(0, this.vVelocity + maxVelocity*3/deltaFrames);
            }
        }
        if((!keyboard.a && !keyboard.d) || (keyboard.a && keyboard.d)) {
            if(this.hVelocity > 0) {
                this.hVelocity = Math.max(0, this.hVelocity - maxVelocity*3/deltaFrames);
            } else {
                this.hVelocity = Math.min(0, this.hVelocity + maxVelocity*3/deltaFrames);
            }
        }

        this.frameHVelocity = this.hVelocity;
        this.frameVVelocity = this.vVelocity;

        let collidedObjects = this.getCollisions();
        collidedObjects.forEach(obj => this.adjustVelocity(obj));
        
        let startNum = Player.radiusTiles+Rock.radiusTiles;
        if(this.x < Player.radiusTiles) {
            this.frameHVelocity += getVelocityAdjust(startNum-(Player.radiusTiles - this.x));
        } else if(this.x > board[0].length - Player.radiusTiles) {
            this.frameHVelocity -= getVelocityAdjust(startNum-(this.x-Player.radiusTiles));
        }
        if(this.y < Player.radiusTiles) {
            this.frameVVelocity += getVelocityAdjust(startNum-(Player.radiusTiles - this.y));
        } else if(this.y > board.length - Player.radiusTiles) {
            this.frameVVelocity -= getVelocityAdjust(startNum-(this.y - Player.radiusTiles));
        }

        if((this.frameHVelocity**2 + this.frameVVelocity**2)**0.5 > Player.maxVelocity) {
            let arr = normalizeSum(this.frameHVelocity, this.frameVVelocity, Player.maxVelocity);
            this.x += arr[0]/deltaFrames;
            this.y += arr[1]/deltaFrames;
        } else {
            this.x += this.frameHVelocity/deltaFrames;
            this.y += this.frameVVelocity/deltaFrames;
        }
        
        if(keyboard[' '] || this.autoAttack) {
            if(Inventory.active.type == 'Weapon') {
                this.attack();
            }
        } else if(cursor.mousedown) {
            let i = Math.floor(frame.sx + cursor.x/tileWidth);
            let j = Math.floor(frame.sy + cursor.y/tileWidth);
            
            if(Inventory.active.type == 'Weapon') {
                if(i < 0 || i >= board[0].length || j < 0 || j >= board.length) {
                    this.attack();
                } else if(board[j][i] == null || board[j][i].classType == "Resource") {
                    this.attack();
                }
            }
        }
    }

    attack() {
        if(this.timeSinceLastAttack > this.tba) {
            this.timeSinceLastAttack = 0;
        } else {
            return;
        }

        if(Weapon.activeWeapon.style == "Range") {
            Weapon.activeWeapon.attack();
        } else {
            this.swingDegrees = 160;
            let squaresClicked = this.getOverlappingTiles();
            squaresClicked.forEach(square => {
                if(square.x >= 0 && square.x < board[0].length && square.y >= 0 && square.y < board.length) {
                    let obj = board[square.y][square.x];
                    if(obj != null) {
                        if(obj.classType == "Resource") {
                            this.materials[obj.type] += Player.player.materialMultiplier;
                            this.increaseAge(Player.player.materialMultiplier);
                        }
                        obj.hit();
                        this.swingDegrees = 110;
                    }
                }
            });

            let possibleEnemies = Enemy.searchForAll(this, this.attackRadius);
            possibleEnemies.forEach(enemy => {
                let direction = Math.atan2(window.innerHeight/2 - cursor.y, window.innerWidth/2 - cursor.x);
                let enemyDirection = Math.atan2(this.y - enemy.y, this.x - enemy.x);
                
                // Normalize directions to be between 0 and 2*Math.PI
                if (direction < 0) direction += 2 * Math.PI;
                if (enemyDirection < 0) enemyDirection += 2 * Math.PI;
            
                // Calculate the absolute difference and adjust for angles near the wrap-around point
                let angularDifference = Math.abs(direction - enemyDirection);
                if (angularDifference > Math.PI) {
                    angularDifference = 2 * Math.PI - angularDifference;
                }
            
                // Check if the enemy is within the attack range
                if (angularDifference < (this.attackDegrees / 180 * Math.PI) / 2) {
                    enemy.hit(this);
                    this.swingDegrees = 110;
                }
            });
        }
    }

    increaseAge(num) {
        const OG = this.age;
        this.age += num/(50 + 3*Math.floor(this.age-1)**2); //Graphed in Desmos for a good curve 50+3floor(x)^2
        if(Math.ceil(this.age)-this.age < 0.00000000001) {
            this.age = Math.ceil(this.age);
        }
        if(this.age > Math.ceil(OG+0.00000000001)) {
            this.age = Math.ceil(OG+0.00000000001);
        }
        this.ageRewards += Math.floor(this.age)-Math.floor(OG);
        Player.ageText.innerHTML = `Age ${Math.floor(this.age)}`;
        Player.ageBar.querySelector('div').style.width = `${(this.age-Math.floor(this.age))*100}%`;
        if(this.ageRewards > 0) {
            if(this.age == 2) {
                House.createSlot(9);
                this.ageRewards--;
            }
            if(this.ageRewards > 0) {
                InventorySlot.displayOptions();
            }
        }
    }

    draw() {
        //Makes body
        Render.queue[1].push(() => {
            ctx.fillStyle = 'rgb(104, 74, 62)';
            ctx.strokeStyle = 'rgb(20, 20, 20)';
            ctx.lineWidth = tileWidth/20;
            Canvas.circle(frame.windowWidth/2, frame.windowHeight/2, Player.radius, true);
        });

        let dy = frame.windowHeight/2-cursor.y;
        let dx = cursor.x - frame.windowWidth/2;
        let firstAngle = Math.atan2(dy, dx);
        if(this.timeSinceLastAttack < this.tba) {
            firstAngle += this.swingDegrees*(Math.PI/180)*Math.sin((this.timeSinceLastAttack*(Math.PI**2.5/this.tba))**0.4); //Graphed in desmos based on sin(sqrt(x))
            let hyp = (dy**2+dx**2)**0.5;

            dy = hyp*Math.sin(firstAngle);
            dx = hyp*Math.cos(firstAngle);
        }

        let hypotenuse = (dx**2 + dy**2)**0.5;
        let scale = hypotenuse/Player.radius;
        let distX = dx/scale;
        let distY = -dy/scale;
        
        let x = window.innerWidth/2+distX*0.85;
        let y = window.innerHeight/2+distY*0.85;

        let angle = Math.atan2(dy, dx);

        let sFactor = tileWidth/6;
        let p1 = {
            x: x+sFactor*Math.cos(angle+Math.PI/2),
            y: y+sFactor*Math.sin(angle-Math.PI/2)
        };
        let p2 = {
            x: x+sFactor*Math.cos(angle-Math.PI/2),
            y: y+sFactor*Math.sin(angle+Math.PI/2)
        };

        Render.queue[1].push(() => {
            ctx.fillStyle = 'rgb(104, 74, 62)';
            ctx.strokeStyle = 'rgb(20, 20, 20)';
            ctx.lineWidth = tileWidth/30;
            Canvas.circle(p1.x, p1.y, tileWidth/7, true);
            Canvas.circle(p2.x, p2.y, tileWidth/7, true);
        });
    
        Render.queue[0].push(() => {
            Canvas.drawWithAngle(x, y, -angle, Weapon.activeWeapon.images[Weapon.activeWeapon.level-1], tileWidth*Weapon.activeWeapon.radiusTiles);
        });
    }
}