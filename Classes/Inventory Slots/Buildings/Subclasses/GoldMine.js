class GoldMine extends Building {

    static description = "Generates gold over time.";
    static role = 'Production';
    static productionType = 'gold';
    static images = [];
    static buildLimit = 8;
    static count = 0;

    static cost = [
        {
            stone: 1000,
            wood: 1000
        },
        {
            stone: 1200,
            wood: 1200
        },
        {
            stone: 1750,
            wood: 1750
        }
    ];

    static stats = [
        {
            health: 150,
            goldProduction: 2
        },
        {
            health: 225,
            goldProduction: 3
        },
        {
            health: 350,
            goldProduction: 5
        }
    ];

    constructor(j, i) {
        super(j, i);
    }

    static createSlot(inventoryIndex) {
        InventorySlot.createSlot(GoldMine, inventoryIndex);
    }

    draw(x, y) {
        super.draw(x, y);
    }
}