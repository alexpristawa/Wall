class Sledgehammer extends Weapon {

    static description = 'Extreme damage against buildings.';
    static i;
    static button;
    static stats;
    static style = 'Melee';
    static stats = [
        {
            attackDegrees: 70,
            attackRadius: 1,
            damage: 10,
            buildingDamage: 100,
            resourceDamage: 1,
            tba: 500,
            materialMultiplier: 1
        },
        {
            attackDegrees: 70,
            attackRadius: 1,
            damage: 20,
            buildingDamage: 300,
            resourceDamage: 1,
            tba: 400,
            materialMultiplier: 1
        }
    ];
    static cost = [
        {
            gold: 4000
        }
    ];
    static radiusTiles = 2;
    static images = [];

    static createSlot(inventoryIndex) {
        Sledgehammer.level = 1;
        InventorySlot.createSlot(Sledgehammer, inventoryIndex);
    }
}