class Tree extends Resource{

    static buildLimit = 2;
    static count = 0;
    static image;
    static drawRadiusTiles;

    static cost = {
        wood: 200,
        stone: 0,
        food: 0
    };
    
    constructor(x, y, playerMade = false) {
        super(x, y, playerMade);
        this.type = 'wood';
    }

    static createSlot(inventoryIndex) {
        InventorySlot.createSlot(Tree, inventoryIndex);
    }
}