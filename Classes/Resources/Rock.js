class Rock extends Resource{

    static radius;
    static buildLimit = 2;
    static count = 0;
    static image;
    static drawRadiusTiles;

    static cost = {
        wood: 0,
        stone: 200,
        food: 0
    };

    constructor(x, y, playerMade = false) {
        super(x, y, playerMade);
        this.type = "stone";
    }

    static createSlot(inventoryIndex) {
        InventorySlot.createSlot(Rock, inventoryIndex);
    }
}