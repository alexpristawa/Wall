class Inventory {

    static slots =       [[null, null, null], [null], [null], [null], [null, null], [null], [null], [null], [null, null, null, null], [null]];
    static slotOptions = [[Sword, Sledgehammer, Machete], [Tranquilizer], [Wall], [Trap], [Cannon, Bow], [BombTower], [Beacon], [Aura], [Farm, Lumberyard, Quarry, GoldMine], [House, Bush, Tree, Rock]];
    static buttons = [];
    static activeIndexes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    static active;

    static initializeInventory() {
        for(let i = 0; i < Inventory.slots.length; i++) {
            Inventory.buttons.push([...document.querySelectorAll(`#main > #inventory > div:nth-child(${i+1}) > div`)]);
            for(let j = 0; j < Inventory.slotOptions[i].length; j++) {
                let Class = Inventory.slotOptions[i][j];
                if(Class != null && Class.type == 'Building') {
                    for(let k = 0; k < Class.stats.length; k++) {
                        if(Class.imageExtensions != undefined) {
                            let obj = {};
                            for(let l = 0; l < Class.imageExtensions.length; l++) {
                                let img = new Image();
                                img.src = `Images/${Class.name}/${Class.name}_${k+1}_${Class.imageExtensions[l]}.png`;
                                obj[Class.imageExtensions[l]] = img;
                            }
                            Class.images.push(obj);
                        } else {
                            let img = new Image();
                            img.src = `Images/${Class.name}/${Class.name}_${k+1}.png`;
                            Class.images.push({Base: img});
                        }
                    }
                }
                if(Class != null && Class.type == 'Weapon') {
                    for(let k = 0; k < Class.stats.length; k++) {
                        let img = new Image();
                        img.src = `Images/${Class.name}/${Class.name}_${k+1}.png`;
                        Class.images.push(img);
                    }
                }
                if(Class != null && Class.type == "Resource") {
                    let img = new Image();
                    img.src = `Images/${Class.name}/${Class.name}.png`;
                    Class.image = img;
                }
            }
        }

        for(let i = 0; i < Inventory.buttons.length; i++) {
            for(let j = 0; j < Inventory.buttons[i].length; j++) {
                const button = Inventory.buttons[i][j];
                button.innerHTML = '<img>'
                if(Inventory.slotOptions[i][j] != undefined) {
                    let Class = Inventory.slotOptions[i][j];
                    let img = button.querySelector('img');
                    if(Class.type == "Weapon") {
                        img.style.width = '80%';
                        img.style.height = '80%';
                        img.src = `Images/${Class.name}/${Class.name}_1_Display.png`;
                    } else if(Class.type == "Resource") {
                        img.src = `Images/${Class.name}/${Class.name}.png`;
                    } else {
                        img.src = `Images/${Class.name}/${Class.name}_1.png`;
                    }
                    img.style.opacity = '0';
                    Class.img = img;
                    Class.button = button;
                    button.addEventListener('mouseenter', () => {
                        if(Class.i != undefined || Player.player.ageRewards > 0) {
                            InventorySlot.mouseenterHandler(Class);
                        }
                    });
                    button.addEventListener('mouseout', (event) => {
                        if(Class.i != undefined || Player.player.ageRewards > 0) {
                            InventorySlot.mouseoutHandler(event, Class)
                        }
                    });
                }
                button.addEventListener('click', () => {
                    j = Inventory.buttons[i].indexOf(button);
                    if(Inventory.slots[i][j] != null) {
                        InventorySlot.setActive(Inventory.slots[i][j]);
                    } else {
                        if(Player.player.ageRewards >= 1) {
                            Player.player.ageRewards--;
                            Inventory.slotOptions[i][j].createSlot(i);
                            if(Player.player.ageRewards == 0) {
                                InventorySlot.removeOptions();
                            }
                        }
                    }
                });
            }
        }

        Sword.createSlot(0);
        Wall.createSlot(2);
        setTimeout(() => {
            InventorySlot.setActive(Inventory.slots[0][0]);
        });
    }
}