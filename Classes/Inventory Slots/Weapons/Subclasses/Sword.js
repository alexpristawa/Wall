class Sword extends Weapon {

    static description = 'Used to fight enemies.';
    static i;
    static button;
    static stats;
    static style = 'Melee';
    static stats = [
        {
            attackDegrees: 150,
            attackRadius: 1.8,
            damage: 50,
            buildingDamage: 10,
            resourceDamage: 0,
            tba: 500,
            materialMultiplier: 1
        },
        {
            attackDegrees: 150,
            attackRadius: 1.8,
            damage: 100,
            buildingDamage: 20,
            resourceDamage: 0,
            tba: 500,
            materialMultiplier: 2
        }
    ];
    static cost = [
        {
            gold: 4000
        }
    ];
    static radiusTiles = 4;
    static images = [];

    static createSlot(inventoryIndex) {
        Sword.level = 1;
        InventorySlot.createSlot(Sword, inventoryIndex);
        Sword.setActive();
    }
}