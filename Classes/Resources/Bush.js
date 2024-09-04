class Bush extends Resource {

    static buildLimit = 2;
    static count = 0;
    static image;
    static drawRadiusTiles;

    static cost = {
        wood: 0,
        stone: 0,
        food: 200
    };

    constructor(x, y, playerMade = false) {
        super(x, y, playerMade);
        this.angle = Math.random()*2*Math.PI;
        this.type = 'food';
    }

    static createSlot(inventoryIndex) {
        InventorySlot.createSlot(Bush, inventoryIndex);
    }
}