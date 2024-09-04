class Aura extends Building {

    static description = "Shockwave heals surrounding buildings";
    static role = 'Combat';
    static images = [];
    static count = 0;
    static projectileRadiusTiles = 0.15;
    static imageExtensions = [
        "Base"
    ];
    static projectileImage = undefined;

    static cost = [
        {
            stone: 300,
            wood: 500
        },
        {
            stone: 1400,
            wood: 1900
        },
        {
            stone: 2500,
            wood: 3000
        }
    ];

    static stats = [
        {
            health: 400,
            healPercentage: 15,
            attackRate: 3,
            range: 2
        },
        {
            health: 650,
            healPercentage: 20,
            attackRate: 2.6,
            range: 2
        },
        {
            health: 815,
            healPercentage: 25,
            attackRate: 2.2,
            range: 2.5
        }
    ];
    
    constructor(i, j) {
        super(i, j);
        if(j != -1) {
            this.timeSinceLastAttack = 15000;
        }
    }

    static createSlot(inventoryIndex) {
        InventorySlot.createSlot(Aura, inventoryIndex);
    }

    update() {
        super.update();
        let bound1 = Math.min(500, this.constructor.stats[this.level-1].attackRate*500);
        let bound2 = Math.min(850, this.constructor.stats[this.level-1].attackRate*850);
        let bound3 = Math.min(1000, this.constructor.stats[this.level-1].attackRate*1000);
        if(this.timeSinceLastAttack < bound1) {
            Render.queue[10].push(() => {
                ctx.fillStyle = 'rgba(135, 206, 235, 0.5)';
                ctx.lineWidth = 0;
                Canvas.circle((this.x-frame.sx)*tileWidth, (this.y-frame.sy)*tileWidth, 30*Math.sin(this.timeSinceLastAttack/bound1*Math.PI), false);
            });
        } else if(this.timeSinceLastAttack < bound2) {
            ctx.fillStyle = 'rgba(135, 206, 235, 0.5)';
            ctx.lineWidth = 0;
            Canvas.circle((this.x-frame.sx)*tileWidth, (this.y-frame.sy)*tileWidth, Aura.stats[this.level-1].range*tileWidth*Math.sin((this.timeSinceLastAttack-bound1)/(bound2-bound1)*Math.PI/2), false);
        } else if(this.timeSinceLastAttack < bound3) {
            if(this.firstBound3) {
                this.firstBound3 = false;

                //Heals everything around it
                let range = Math.ceil(Aura.stats[this.level-1].range);
                for(let i = Math.max(0, this.i-range); i < Math.min(this.i+range, board.length); i++) {
                    for(let j = Math.max(0, this.j-range); j < Math.min(this.j+range, board[0].length); j++) {
                        if(board[i][j] != null && (i - this.i)**2 + (j - this.j)**2 <= Aura.stats[this.level-1].range**2) {
                            let obj = board[i][j];
                            if(obj.constructor.type == "Building" && obj.health < obj.constructor.stats[obj.level-1].health) {
                                obj.hit(-Aura.stats[this.level-1].healPercentage/100);
                            }
                        }
                    }
                }
            }
            ctx.fillStyle = `rgba(135, 206, 235, ${0.5-0.5*(this.timeSinceLastAttack-bound2)/(bound3-bound2)})`;
            Canvas.circle((this.x-frame.sx)*tileWidth, (this.y-frame.sy)*tileWidth, Aura.stats[this.level-1].range*tileWidth, false);
        }
    }

    attack() {
        let range = Math.ceil(Aura.stats[this.level-1].range);
        let oneWasntMax = false;
        for(let i = Math.max(0, this.i-range); i < Math.min(this.i+range, board.length); i++) {
            if(oneWasntMax) break;
            for(let j = Math.max(0, this.j-range); j < Math.min(this.j+range, board[0].length); j++) {
                if(board[i][j] != null && (i - this.i)**2 + (j - this.j)**2 <= Aura.stats[this.level-1].range**2) {
                    if(board[i][j].constructor.type == "Building" && board[i][j].health < board[i][j].constructor.stats[board[i][j].level-1].health) {
                        oneWasntMax=true;
                        break;
                    }
                }
            }
        }
        if(oneWasntMax) {
            this.firstBound3 = true;
            this.timeSinceLastAttack = 0;
        }
    }

    draw(x, y) {
        [x, y] = super.draw(x, y);
    }
}