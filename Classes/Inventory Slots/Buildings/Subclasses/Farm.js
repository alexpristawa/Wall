class Farm extends Building {

    static appleRadius = 1/12;
    static description = "Generates food over time.";
    static role = 'Production';
    static productionType = 'food';
    static images = [];
    static buildLimit = 8;
    static count = 0;

    static cost = [
        {
            stone: 100,
            wood: 200,
            food: 500
        },
        {
            stone: 150,
            wood: 200,
            food: 600
        },
        {
            stone: 500,
            wood: 700,
            food: 1300
        }
    ];

    static stats = [
        {
            health: 100,
            foodProduction: 10
        },
        {
            health: 150,
            foodProduction: 15
        },
        {
            health: 225,
            foodProduction: 20
        }
    ]

    constructor(j, i) {
        super(j, i);

        this.apples = [];
        for(let y = 0.25; y <= 3/4; y += 1/4) {
            for(let x = 0; x < 3; x++) {
                this.apples.push({
                    x: Math.random()*(1/3-2*Farm.appleRadius)+x/3+Farm.appleRadius,
                    y: y+Math.random()*Farm.appleRadius-Farm.appleRadius/2
                });
            }
        }
    }

    static createSlot(inventoryIndex) {
        InventorySlot.createSlot(Farm, inventoryIndex);
    }

    draw(x, y) {
        super.draw(x, y);
    }
}