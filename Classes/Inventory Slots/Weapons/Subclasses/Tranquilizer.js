class Tranquilizer extends Weapon {

    static description = 'Stops enemies from moving';
    static i;
    static button;
    static stats;
    static style = 'Range';
    static projectileImage = null;
    static projectileRadiusTiles = 0.5;
    static stats = [
        {
            damage: 10,
            buildingDamage: 0,
            resourceDamage: 0,
            tba: 500,
            materialMultiplier: 0,
            speed: 30,
            range: 20,
            stunTime: 500
        }/*,
        {
            damage: 20,
            buildingDamage: 0,
            resourceDamage: 0,
            tba: 3000,
            materialMultiplier: 0,
            speed: 30,
            range: 20,
            stunTime: 600
        }*/
    ];
    static cost = [
        /*{
            gold: 4000
        }*/
    ];
    static radiusTiles = 3;
    static images = [];

    static createSlot(inventoryIndex) {
        Tranquilizer.level = 1;
        InventorySlot.createSlot(Tranquilizer, inventoryIndex);
    }

    static setActive() {
        super.setActive();
        Player.player.swingDegrees = 0;
    }
    
    static attack() {
        new UntargetedProjectile(Player.player.x, Player.player.y, Tranquilizer.stats[Tranquilizer.level-1].speed, cursor.y-frame.windowHeight/2, cursor.x-frame.windowWidth/2, this);
    }
}