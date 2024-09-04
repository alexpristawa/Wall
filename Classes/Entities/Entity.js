class Entity {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.hVelocity = 0;
        this.vVelocity = 0;
        this.timeSinceLastAttack = 10000;
    }

    getCollisions() {
        let arr = [];
        for(let x = Math.max(0, Math.floor(this.x)-3); x < Math.min(board[0].length, Math.ceil(this.x)+3); x++) {
            for(let y = Math.max(0, Math.floor(this.y)-3); y < Math.min(board.length, Math.ceil(this.y)+3); y++) {
                if(board[y][x] != null) {
                    let object = board[y][x].checkEntityCollision(this);
                    if(object !== null) {
                        arr.push(object);
                    }
                }
            }
        }
        return arr;
    }

    adjustVelocity(obj) {
        if(obj.solid === false) {
            return;
        }
        let rt = this.radiusTiles; //radiusTiles
        if(obj.classType == 'Resource') {
            let dx = this.x-obj.x;
            let dy = this.y-obj.y;
            let dist = ((dx)**2 + (dy)**2)**0.5;
            let velocityAdjust = getVelocityAdjust(dist, rt + Resource.radiusTiles); //Graphed in Desmos to get a smooth curve
            let angle = Math.abs(Math.atan(dy/dx));
            
            if(dx < 0) {
                this.frameHVelocity += -velocityAdjust * Math.cos(angle);
            } else {
                this.frameHVelocity += velocityAdjust * Math.cos(angle);
            }

            if(dy < 0) {
                this.frameVVelocity += -velocityAdjust * Math.sin(angle);
            } else {
                this.frameVVelocity += velocityAdjust * Math.sin(angle);
            }
        } else {
            //If the circle's center is in line with the left and right boundaries of the square
            if(this.x >= obj.x - 0.5 && this.x <= obj.x + 0.5) {
                this.frameVVelocity += 1.7*getVelocityAdjust(this.y - obj.y, rt + 0.5); //Multiplied by 1.7 so you don't go in as much
            //If the circle's center is in line with the top and bottom boundaries of the square
            } else if(this.y >= obj.y - 0.5 && this.y <= obj.y + 0.5) {
                this.frameHVelocity += 1.7*getVelocityAdjust(this.x - obj.x, rt + 0.5); //Multiplied by 1.7 so you don't go in as much
            } else {
                let correcters = {
                    t: {x: obj.x-0.5, y: obj.y-1.5},
                    l: {x: obj.x-1.5, y: obj.y-0.5},
                    b: {x: obj.x-0.5, y: obj.y+0.5},
                    r: {x: obj.x+0.5, y: obj.y-0.5}
                }
                let corners = {
                    tl: {x: obj.x-0.5, y: obj.y-0.5},
                    tr: {x: obj.x+0.5, y: obj.y-0.5},
                    bl: {x: obj.x-0.5, y: obj.y+0.5},
                    br: {x: obj.x+0.5, y: obj.y+0.5}
                }

                let closestCorner = corners.tl;
                let closestKey = 'tl';
                closestCorner.dx = (this.x - closestCorner.x);
                closestCorner.dy = (this.y - closestCorner.y);
                Object.keys(corners).forEach(key => {
                    let corner = corners[key];
                    corner.dx = (this.x - corner.x);
                    corner.dy = (this.y - corner.y);
                    if(corner.dx**2 + corner.dy**2 < closestCorner.dx**2 + closestCorner.dy**2) {
                        closestCorner = corner;
                        closestKey = key;
                    }
                });

                let verifiedCorner = true;
                for(let i = 0; i < 2; i++) {
                    let object = correcters[closestKey[i]];
                    if(object.x >= 0 && object.x < board[0].length && object.y >= 0 && object.y < board.length) {
                        if(board[object.y][object.x] != null && board[object.y][object.x].solid !== false) {
                            verifiedCorner = false;
                        }
                    }
                }

                if(verifiedCorner) {
                    let velocityAdjust = 0.7*getVelocityAdjust(((closestCorner.x-this.x)**2 + (closestCorner.y-this.y)**2)**0.5, rt);
                    let angle = Math.abs(Math.atan((closestCorner.y-this.y)/(closestCorner.x-this.x)));
                    this.frameVVelocity += (closestCorner.dy/Math.abs(closestCorner.dy)) * velocityAdjust * Math.sin(angle);
                    this.frameHVelocity += (closestCorner.dx/Math.abs(closestCorner.dx)) * velocityAdjust * Math.cos(angle);
                }
            }
        }
    }

    getOverlappingTiles() {
        let x = this.x;
        let y = this.y;
        let radius = this.attackRadius;
        const squares = [];
        const minX = Math.floor(x - radius);
        const maxX = Math.ceil(x + radius);
        const minY = Math.floor(y - radius);
        const maxY = Math.ceil(y + radius);
    
        const isPointInsideCircle = (px, py) => {
            const dx = px - x;
            const dy = py - y;
            return dx * dx + dy * dy <= radius * radius;
        };
    
        let dx = cursor.x - window.innerWidth / 2;
        let dy = cursor.y - window.innerHeight / 2;
        if(this.constructor.name != "Player") {
            dx = House.house.x - this.x;
            dy = House.house.y - this.y;
        }
        let attackDirection = Math.atan2(dy, dx); // Direction player is facing, in radians
        let attackDegrees = this.attackDegrees; // Arc of the attack in degrees
        let attackRadiansHalf = (attackDegrees * Math.PI / 180) / 2; // Half the arc in radians
    
        // Normalize the attackDirection to be within -π to π
        attackDirection = (attackDirection + Math.PI) % (2 * Math.PI) - Math.PI;
    
        for (let i = minX; i <= maxX; i++) {
            for (let j = minY; j <= maxY; j++) {
                const corners = [
                    { x: i, y: j },
                    { x: i + 1, y: j },
                    { x: i, y: j + 1 },
                    { x: i + 1, y: j + 1 }
                ];
                const centerInside = isPointInsideCircle(i + 0.5, j + 0.5);
                const anyCornerInside = corners.some(corner => isPointInsideCircle(corner.x, corner.y));
    
                if (centerInside || anyCornerInside) {
                    let tileDx = (i + 0.5) - x;
                    let tileDy = (j + 0.5) - y;
                    let tileDirection = Math.atan2(tileDy, tileDx); // Direction from player to tile center
    
                    // Normalize tileDirection to be within -π to π
                    tileDirection = (tileDirection + Math.PI) % (2 * Math.PI) - Math.PI;
    
                    // Calculate the difference in the two angles and adjust for the shortest path
                    let angleDifference = tileDirection - attackDirection;
                    if (angleDifference > Math.PI) {
                        angleDifference -= 2 * Math.PI;
                    } else if (angleDifference < -Math.PI) {
                        angleDifference += 2 * Math.PI;
                    }
    
                    // Check if the tile is within the attack arc
                    if (Math.abs(angleDifference) <= attackRadiansHalf) {
                        squares.push({ x: i, y: j });
                    }
                }
            }
        }
    
        return squares;
    }
}