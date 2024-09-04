class BombTower extends Building {
    static description = "Area damage that knocks back zombies.";
    static role = 'Combat';
    static images = [];
    static count = 0;
    static projectileRadiusTiles = 0.25;
    static imageExtensions = [
        "Base"
    ];
    static aoe = true;
    static projectileImage = null;
    static projectileType = "Projectile";
    static searchForTarget = 'post';

    static cost = [
        {
            stone: 300,
            wood: 200
        },
        {
            stone: 300,
            wood: 300
        },
        {
            stone: 700,
            wood: 600
        }
    ];

    static stats = [
        {
            health: 500,
            damage: 5,
            attackRate: 1.5,
            range: 9,
            speed: 5,
            splashRange: 1
        },
        {
            health: 650,
            damage: 12,
            attackRate: 1.4,
            range: 9,
            speed: 6,
            splashRange: 1
        },
        {
            health: 800,
            damage: 17,
            attackRate: 1.2,
            range: 9,
            speed: 7,
            splashRange: 1
        }
    ];

    constructor(j, i) {
        super(j, i);
        if(j != -1) {
            this.target = null;
            this.timeSinceLastAttack = 15000;
        }
    }

    static createSlot(inventoryIndex) {
        InventorySlot.createSlot(BombTower, inventoryIndex);
    }

    draw(x, y) {
        super.draw(x, y);
    }
}