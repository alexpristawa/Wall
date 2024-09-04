class Lumberyard extends Building {

    static description = "Generates wood over time.";
    static role = 'Production';
    static productionType = 'wood';
    static treeRadius = 1/12;
    static images = [];
    static buildLimit = 8;
    static count = 0;

    static cost = [
        {
            stone: 200,
            wood: 600,
        },
        {
            stone: 400,
            wood: 900,
        },
        {
            stone: 1000,
            wood: 1700
        }
    ];

    static stats = [
        {
            health: 100,
            woodProduction: 5
        },
        {
            health: 160,
            woodProduction: 8
        },
        {
            health: 240,
            woodProduction: 11
        }
    ]

    constructor(j, i) {
        super(j, i);
    }

    static createSlot(inventoryIndex) {
        InventorySlot.createSlot(Lumberyard, inventoryIndex);
    }

    draw(x, y) {
        super.draw(x, y);
    }
}