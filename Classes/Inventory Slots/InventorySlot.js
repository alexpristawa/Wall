class InventorySlot {
    
    static createSlot(Class, inventoryIndex) {
        Class.i = inventoryIndex;
        Class.j = Inventory.slotOptions[Class.i].indexOf(Class);
        //Class.button = Inventory.buttons[Class.i][Class.j];
        //Class.img = Class.button.querySelector('img');
        Class.img.style.opacity = '0.8';
        if(Class.projectileImage !== undefined) {
            let img = new Image();
            img.src = `Images/${Class.name}/${Class.name}_Projectile.png`;
            Class.projectileImage = img;
        }
        Inventory.slots[Class.i][Class.j] = Class;

        //Fixes cost array by filling undefined keys with 0 instead
        if(Class.cost != undefined) {
            for(let i = 0; i < Class.cost.length; i++) {
                Object.keys(Player.player.materials).forEach(key => {
                    if(Class.cost[i][key] == undefined) {
                        Class.cost[i][key] = 0;
                    }
                });
            }
        }
        Shop.updateShop();
    }

    static setActive = (Class) => {
        Inventory.active = Class;
        Inventory.activeIndexes[Class.i] = Class.j;
        Class.button.style.backgroundColor = 'rgba(200, 200, 200, 0.5)';
        try {
        Class.button.querySelector('img').style.opacity = '0.8';
        }catch{}
        if(Class.type == "Weapon") {
            Class.setActive();
        }

        for(let i = 0; i < Inventory.buttons.length; i++) {
            for(let j = 0; j < Inventory.buttons[i].length; j++) {
                if(Inventory.slots[i][j] != Class) {
                    Inventory.buttons[i][j].style.backgroundColor = 'rgba(200, 200, 200, 0.2)';
                    if(i==Class.i) {
                        Inventory.buttons[i][j].classList.remove('activeTile');
                    }
                } else {
                    Inventory.buttons[i][j].classList.add('activeTile');
                }
            }
        }
    }

    static displayOptions() {
        for(let i = 0; i < Inventory.slotOptions.length; i++) {
            for(let j = 0; j < Inventory.slotOptions[i].length; j++) {
                if(Inventory.slots[i][j] == null) {
                    if(Inventory.slotOptions[i][j] != null) { //Removable
                        Inventory.slotOptions[i][j].img.style.opacity = '0.25';
                    }
                }
            }
        }
    }

    static removeOptions() {
        for(let i = 0; i < Inventory.slotOptions.length; i++) {
            for(let j = 0; j < Inventory.slotOptions[i].length; j++) {
                if(Inventory.slots[i][j] == null) {
                    if(Inventory.slotOptions[i][j] != null) { //Removable
                        Inventory.slotOptions[i][j].img.style.opacity = '0';
                    }
                }
            }
        }
    }

    static mouseenterHandler(Class) {
        HoverBox.newHoverBox(Class);
    }

    static mouseoutHandler(event, Class) {
        if(event.relatedTarget.tagName!="IMG" && event.relatedTarget != Class.button) {
            if(HoverBox.obj != null && HoverBox.obj == Class) {
                HoverBox.getRidOfBox();
            }
        }
    }
}