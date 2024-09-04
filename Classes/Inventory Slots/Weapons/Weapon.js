class Weapon {
    
    static type = 'Weapon';
    static activeWeapon;

    constructor(inventoryIndex) {
        
    }

    static setActive() {
        let obj = this.stats[this.level-1];
        Object.keys(obj).forEach(key => {
            Player.player[key] = obj[key];
        });
        Weapon.activeWeapon = this;
        Player.player.swingDegrees = 160;
    }

    static upgrade() {
        if(Player.player.materials.gold >= this.cost[this.level-1].gold) {
            Player.player.materials.gold -= this.cost[this.level-1].gold;
            this.level++;
            this.setActive();
            Shop.updateShop();
        }
    }
}