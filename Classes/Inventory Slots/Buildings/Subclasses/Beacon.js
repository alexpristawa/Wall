class Beacon extends Building {

    static description = "Strong lazer that attacks single enemies.";
    static role = 'Combat';
    static images = [];
    static count = 0;
    static projectileRadiusTiles = 0.15;
    static imageExtensions = [
        "Base",
        "Top"
    ];
    static aoe = false;
    static projectileImage = undefined;
    static projectileType = 'Individual';
    static searchForTarget = 'post';

    static cost = [
        {
            stone: 500,
            wood: 500
        },
        {
            stone: 1350,
            wood: 1200
        },
        {
            stone: 2200,
            wood: 1800
        }
    ];

    static stats = [
        {
            health: 600,
            damage: 100,
            attackRate: 3,
            range: 7
        },
        {
            health: 900,
            damage: 225,
            attackRate: 2.7,
            range: 7
        },
        {
            health: 1350,
            damage: 340,
            attackRate: 2.4,
            range: 8
        }
    ];
    
    constructor(i, j) {
        super(i, j);
        if(j != -1) {
            this.target = null;
            this.timeSinceLastAttack = 15000;
        }
    }

    static createSlot(inventoryIndex) {
        InventorySlot.createSlot(Beacon, inventoryIndex);
    }

    update() {
        super.update();
        if(this.target == null) return;
        let arr1 = [184, 63, 63];
        let arr2 = [230, 101, 101];
        let r1;
        let r2;
        let bound = Math.min(100, this.constructor.stats[this.level-1].attackRate*500);
        if(this.timeSinceLastAttack < bound) {
            r2 = this.timeSinceLastAttack/bound;
            r1 = 1-r2;
        } else if(this.timeSinceLastAttack < bound*2) {
            r1 = (this.timeSinceLastAttack-bound)/bound;
            r2 = 1-r1;
        } else {
            if(this.target.health < 0) {
                this.target = null;
            }
            return;
        }
        let x = this.target.x;
        let y = this.target.y;
        Render.queue[10].push(() => {
            ctx.strokeStyle = `rgb(${arr1[0]*r1+arr2[0]*r2},${arr1[1]*r1+arr2[1]*r2},${arr1[2]*r1+arr2[2]*r2})`;
            ctx.lineWidth = 7;
            Canvas.line((x-frame.sx)*tileWidth, (y-frame.sy)*tileWidth, (this.x-frame.sx)*tileWidth, (this.y-frame.sy)*tileWidth, 5);
        });
    }

    attack() {
        this.target.hit(this.constructor.stats[this.level-1]);
    }

    draw(x, y) {
        [x, y] = super.draw(x, y);
        let fraction = Math.min(1, this.timeSinceLastAttack/(this.constructor.stats[this.level-1].attackRate*1000));
        ctx.drawImage(this.constructor.images[this.level-1].Top, x-tileWidth/2*fraction, y-tileWidth/2*fraction, tileWidth*fraction, tileWidth*fraction);
    }
}