class Bow extends Building {

    static description = "Medium damage against zombies with high attack rate and range.";
    static role = 'Combat';
    static images = [];
    static count = 0;
    static projectileRadiusTiles = 0.30;
    static imageExtensions = [
        "Base",
        "Top"
    ];
    static aoe = false;
    static projectileImage = null;
    static projectileType = "Projectile";
    static searchForTarget = 'pre';

    static cost = [
        {
            stone: 50,
            wood: 50
        },
        {
            stone: 300,
            wood: 200
        },
        {
            stone: 700,
            wood: 700
        }
    ];

    static stats = [
        {
            health: 550,
            damage: 9,
            attackRate: 0.4,
            range: 10,
            speed: 15
        },
        {
            health: 700,
            damage: 20,
            attackRate: 0.3,
            range: 11,
            speed: 15 
        },
        {
            health: 850,
            damage: 35,
            attackRate: 0.25,
            range: 12,
            speed: 15 
        }
    ];

    constructor(j, i) {
        super(j, i);
        if(j != -1) {
            this.target = null;
            this.timeSinceLastAttack = 15000;
            this.behavior = {
                off: 2000,
                on: 2000,
                rotationPerOn: Math.PI/3,
                direction: 1,
                angle: 0,
                current: ["off", 0]
            }
        }
    }

    static createSlot(inventoryIndex) {
        InventorySlot.createSlot(Bow, inventoryIndex);
    }

    draw(x, y) {
        [x, y] = super.draw(x, y);
        let angle;
        if(this.j != -1) {
            super.updateAngle();
            angle = this.behavior.angle;
        } else {
            angle = 0;
        }
        Canvas.drawWithAngle(x, y, angle, this.constructor.images[this.level-1].Top, tileWidth);
    }
}