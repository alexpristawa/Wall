class Cannon extends Building {

    static description = "Strong damage against zombies with medium attack rate.";
    static role = 'Combat';
    static images = [];
    static count = 0;
    static projectileRadiusTiles = 0.15;
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
            stone: 30,
            wood: 50
        },
        {
            stone: 110,
            wood: 80
        },
        {
            stone: 250,
            wood: 200
        }
    ];

    static stats = [
        {
            health: 400,
            damage: 20,
            attackRate: 1.5,
            range: 7,
            speed: 10
        },
        {
            health: 600,
            damage: 40,
            attackRate: 1.3,
            range: 7,
            speed: 10 
        },
        {
            health: 850,
            damage: 70,
            attackRate: 1.1,
            range: 8,
            speed: 10 
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
        InventorySlot.createSlot(Cannon, inventoryIndex);
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