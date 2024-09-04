class Shop {

    static activeTab;
    static active = false;
    static div = document.querySelector("#shop");
    static list = document.querySelector('#shop > .listHolder');

    static initializeShop() {
        Shop.tabs = document.querySelectorAll('#shop > .sectionHolder > div');
        Shop.tabs.forEach(element => {
            element.addEventListener('click', () => {
                Shop.updateShop(element);
            });
        });
        Shop.updateShop(Shop.tabs[0]);
        document.querySelector('#leftSideHolder > .iconsHolder > #shopButton').addEventListener('click', () => {
            Shop.active = !Shop.active;
            if(!Shop.active) {
                Shop.div.style.display = 'none';
            } else {
                Shop.div.style.display = 'flex';
            }
        });
    }

    static updateShop(element) {
        Shop.list.innerHTML = '';
        if(element != undefined) {
            Shop.activeTab = element.innerHTML;
            
            element.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            Shop.tabs.forEach(el => {
                if(el != element) {
                    el.style.backgroundColor = 'transparent';
                }
            });
        }

        if(Shop.activeTab == 'Weapons') {
            let icons = {
                health: '<i class = "fas fa-heart-circle-plus fa-lg" style="color: red; font-size: 1rem;"></i>',
                damage: '<i class = "fas fa-gun" style="color: rgb(96, 102, 92); font-size: 1rem;"></i>',
                tba: '<i class = "fas fa-stopwatch" style="color: rgb(150, 150, 150); font-size: 1.2rem;"></i>',
                range: '<i class = "fas fa-crosshairs" style="color: rgb(200, 200, 200); font-size: 1rem;"></i>',
                buildingDamage: '<i class = "fas fa-house-chimney-crack" style="color: rgb(150,150,150); font-size: 1rem"></i>',
                materialMultiplier: '<i class = "fas fa-coins" style="color: rgb(179, 162, 82); font-size: 1rem"></i>',
                stunTime: '<i class = "fas fa-clock" style="color: rgb(150, 150, 150); font-size: 1.2rem;"></i>'
            };
    
            let adjusters = {
                health: "",
                damage: "",
                tba: "s",
                range: " tiles",
                buildingDamage: "",
                materialMultiplier: "",
                stunTime: "ms"
            }

            let OGIgnoreArr = ['attackDegrees', 'attackRadius', 'resourceDamage', 'speed'];

            for(let i = 0; i < Inventory.slots.length; i++) {
                for(let j = 0; j < Inventory.slots[i].length; j++) {
                    let ignoreArr = [];
                    OGIgnoreArr.forEach(element => {
                        ignoreArr.push(element);
                    });
                    if(Inventory.slots[i][j] != null) {
                        if(Inventory.slots[i][j].name == 'Tranquilizer') {
                            ignoreArr.push('buildingDamage');
                            ignoreArr.push('materialMultiplier');
                        }
                    }
                    let obj = Inventory.slots[i][j];
                    if(obj != null && obj.type == "Weapon") {
                        let statsDiv = '<div>';
                        Object.keys(obj.stats[obj.level-1]).forEach(key => {
                            let num = obj.stats[obj.level-1][key];
                            if(key == 'tba') {
                                num /= 1000;
                            }
                            if(!ignoreArr.includes(key)) {
                                statsDiv += `<div>${icons[key]}<span>${num}${adjusters[key]}</span></div>`;
                            }
                        });
                        statsDiv += '</div>';
                        let ifUpgrade = '';
                        if(obj.stats.length > obj.level) {
                            ifUpgrade += "<div><i class = 'fas fa-caret-right'></i></div><div>";
                            Object.keys(obj.stats[obj.level]).forEach(key => {
                                let num = obj.stats[obj.level][key];
                                if(key == 'tba') {
                                    num /= 1000;
                                }
                                if(!ignoreArr.includes(key)) {
                                    ifUpgrade += `<div><span style="color: var(--upgradeColor)">${num}${adjusters[key]}</span></div>`;
                                }
                            });
                            ifUpgrade += `</div><div class = "upgradeButton"><div>Upgrade</div><div><img src="Images/Gold/Gold.png"><span>${obj.cost[obj.level-1].gold}</span></div>`;
                        }
                        let div = document.createElement('div');
                        div.innerHTML = `<div><img src="Images/${obj.name}/${obj.name}_${obj.level}_Display.png"></div>${statsDiv}${ifUpgrade}`;
                        Shop.list.appendChild(div);
                        let createdDiv = document.querySelector('#shop > .listHolder > div:last-child');
                        if(createdDiv.querySelector('.upgradeButton') != null) {
                            createdDiv.querySelector('.upgradeButton').addEventListener('click', () => {
                                console.log(Inventory.slots[i][j]);
                                Inventory.slots[i][j].upgrade();
                            });
                        }
                    }
                }
            }
        }
    }
}