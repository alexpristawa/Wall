class Wall extends Building {

    static description = "Strong barrier that the enemies must break.";
    static role = 'Defense';
    static images = [];
    static count = 0;

    static cost = [
        {
            wood: 10
        },
        {
            stone: 30,
            wood: 50
        },
        {
            stone: 125,
            wood: 100
        }
    ];

    static stats = [
        {
            health: 600
        },
        {
            health: 1000
        },
        {
            health: 1650
        }
    ];

    constructor(j, i) {
        super(j, i);
    }

    static createSlot(inventoryIndex) {
        InventorySlot.createSlot(Wall, inventoryIndex);
    }

    draw(x, y) {
        super.draw(x, y);
    }
}