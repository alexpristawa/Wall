class Machete extends Weapon {

    static description = "Great for gathering resources.";
    static i;
    static button;
    static stats;
    static style = 'Melee';
    static stats = [
        {
            attackDegrees: 165,
            attackRadius: 1.7,
            damage: 5,
            buildingDamage: 5,
            resourceDamage: 0,
            tba: 500,
            materialMultiplier: 5
        },
        {
            attackDegrees: 165,
            attackRadius: 1.7,
            damage: 20,
            buildingDamage: 5,
            resourceDamage: 0,
            tba: 400,
            materialMultiplier: 15
        }
    ];
    static cost = [
        {
            gold: 4000
        }
    ];
    static radiusTiles = 2.7;
    static images = [];

    static createSlot(inventoryIndex) {
        Machete.level = 1;
        InventorySlot.createSlot(Machete, inventoryIndex);
    }
}