class Quarry extends Building {

    static description = "Generates stone over time.";
    static role = 'Production';
    static productionType = 'stone';
    static images = [];
    static buildLimit = 8;
    static count = 0;

    static cost = [
        {
            stone: 500,
            wood: 300
        },
        {
            stone: 800,
            wood: 800
        },
        {
            stone: 1500,
            wood: 1300
        }
    ];

    static stats = [
        {
            health: 150,
            stoneProduction: 5
        },
        {
            health: 250,
            stoneProduction: 8
        },
        {
            health: 400,
            stoneProduction: 11
        }
    ];

    constructor(j, i) {
        super(j, i);
    }

    static createSlot(inventoryIndex) {
        InventorySlot.createSlot(Quarry, inventoryIndex);
    }

    draw(x, y) {
        super.draw(x, y);
    }
}