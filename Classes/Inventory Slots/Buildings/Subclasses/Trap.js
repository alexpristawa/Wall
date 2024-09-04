class Trap extends Building {

    static description = "Stops enemy movement when they enter the trap.";
    static role = 'Defense';
    static images = [];
    static count = 0;
    static traps = [];

    static cost = [
        {
            stone: 15,
            wood: 20
        },
        {
            stone: 50,
            wood: 70
        },
        {
            stone: 150,
            wood: 200
        }
    ];

    static stats = [
        {
            health: 100
        },
        {
            health: 175
        },
        {
            health: 275
        }
    ]

    constructor(j, i) {
        super(j, i);
        if(j != -1) {
            Trap.traps.push(this);
        }
        this.solid = false;
    }

    static createSlot(inventoryIndex) {
        InventorySlot.createSlot(Trap, inventoryIndex);
        Inventory.buttons[Trap.i][Trap.j].querySelector('img').style.opacity = 0.5;
    }

    draw(x, y) {
        if(ctx.globalAlpha == 0.5) {
            ctx.globalAlpha = 0.25;
        } else {
            ctx.globalAlpha = 0.5;
        }
        super.draw(x, y);
        ctx.globalAlpha = 1.0;
    }

    hit(obj=Player.player) {
        if(super.hit(obj)) {
            Trap.traps.splice(Trap.traps.indexOf(this), 1);
        }
    }
}