class InfoBox {

    static div = document.querySelector('#infoBoxHolder');
    static title = document.querySelector('#infoBox > .titleHolder');
    static description = document.querySelector('#infoBox > .content > div:nth-child(1) > .descriptionDiv');
    static stats = document.querySelector('#infoBox > .content > div:nth-child(1) > .statsDiv');
    static upgradeButton = document.querySelector('#infoBox > .content > div:nth-child(2) > .upgradeButton');
    static upgradeMaterials = document.querySelector('#infoBox > .content > div:nth-child(2) > .upgradeButton > .upgradeMaterials');
    static moveButton = document.querySelector('#infoBox > .content > div:nth-child(2) > .moveButton');
    static moveMaterials = document.querySelector('#infoBox > .content > div:nth-child(2) > .moveButton > .moveMaterials');
    static obj = null;

    static newInfoBox(obj) {
        if(InfoBox.obj != obj) {
            if(InfoBox.obj != null) {
                InfoBox.getRidOfBox();
            }
            InfoBox.div.fadeIn(100, 'flex');
            InfoBox.obj = obj;
            InfoBox.updateProperties();
            InfoBox.updateCoordinates();
        } else {
            InfoBox.getRidOfBox();
        }
    }

    static updateCoordinates() {
        InfoBox.div.style.top = `${(InfoBox.obj.y-frame.sy+0.5)*tileWidth}px`;
        InfoBox.div.style.left = `${(InfoBox.obj.x-frame.sx)*tileWidth-window.innerWidth*0.085}px`;
        let range = InfoBox.obj.constructor.stats[InfoBox.obj.level-1].range;
        if(range != undefined) {
            let x = InfoBox.obj.x;
            let y = InfoBox.obj.y;
            Render.queue[9].push(() => {
                ctx.fillStyle = 'transparent';
                ctx.strokeStyle = 'rgb(255, 255, 255)';
                ctx.lineWidth = tileWidth/14;
                Canvas.circle((x-frame.sx)*tileWidth, (y-frame.sy)*tileWidth, range*tileWidth, true);
            });
        }
    }

    static updateProperties() {
        InfoBox.title.innerHTML = `${InfoBox.obj.constructor.name} (Level ${InfoBox.obj.level})`;
        InfoBox.description.innerHTML = InfoBox.obj.constructor.description;
        InfoBox.stats.innerHTML = '';
        InfoBox.upgradeMaterials.innerHTML = '';
        InfoBox.moveMaterials.innerHTML = '';

        let icons = {
            health: '<i class = "fas fa-heart-circle-plus fa-lg" style="color: red; font-size: 1rem;"></i>',
            damage: '<i class = "fas fa-gun" style="color: rgb(96, 102, 92); font-size: 1rem;"></i>',
            attackRate: '<i class = "fas fa-stopwatch" style="color: rgb(150, 150, 150); font-size: 1.2rem;"></i>',
            range: '<i class = "fas fa-crosshairs" style="color: rgb(200, 200, 200); font-size: 1rem;"></i>',
            foodProduction: '<i class = "fas fa-cookie-bite fa-lg" style="color: rgb(170, 119, 51); font-size: 1rem;"></i>',
            healPercentage: '<i class = "fas fa-briefcase-medical" style="color: white; font-size: 1rem;"></i>'
        };

        let adjusters = {
            health: "",
            damage: "",
            attackRate: "s",
            range: " tiles",
            foodProduction: "/s",
            healPercentage: '%'
        }

        let ignoreArr = ['speed']

        Object.keys(InfoBox.obj.constructor.stats[InfoBox.obj.level-1]).forEach(key => {
            if(!ignoreArr.includes(key)) {
                let stats = InfoBox.obj.constructor.stats;
                InfoBox.stats.innerHTML += `<div>${icons[key]}<span>${stats[InfoBox.obj.level-1][key]}${adjusters[key]}</span></div>`;
            }
        });

        if(InfoBox.obj.level > InfoBox.obj.constructor.stats.length-1) {
            InfoBox.upgradeButton.style.backgroundColor = "rgb(29, 99, 92)";
            InfoBox.upgradeButton.style.cursor = 'not-allowed';
        } else { //If there is a level to upgrade to
            InfoBox.upgradeButton.style.backgroundColor = 'var(--upgradeColor)';
            InfoBox.upgradeButton.style.cursor = 'pointer';
            let object = {
                wood: "Tree",
                stone: "Rock",
                food: "Bush",
                gold: "Gold"
            }
            Object.keys(Player.player.materials).forEach(key => {
                if(InfoBox.obj.constructor.cost[InfoBox.obj.level][key] != 0) {
                    InfoBox.upgradeMaterials.innerHTML += `<div><img src="Images/${object[key]}/${object[key]}.png"><div>${InfoBox.obj.constructor.cost[InfoBox.obj.level][key]}</div></div>`;
                }
            });
            
            let i = 1;
            Object.keys(InfoBox.obj.constructor.stats[InfoBox.obj.level]).forEach(key => {
                if(!ignoreArr.includes(key)) {
                    let stats = InfoBox.obj.constructor.stats;
                    if(stats[InfoBox.obj.level][key] != stats[InfoBox.obj.level-1][key]) {
                        let div = document.querySelector(`#infoBox > .content > div:nth-child(1) > .statsDiv > div:nth-child(${i})`);
                        div.innerHTML += `<i class = 'fas fa-caret-right' ></i><span style = 'color: var(--upgradeColor); font-weight: 600;'>${stats[InfoBox.obj.level][key]}${adjusters[key]}</span></div>`;
                    }
                    i++;
                }
            });
        }
    }

    static upgradeHandler(event) {
        let adj = 0;
        if(InfoBox.obj.upgrade()) {
            InfoBox.updateProperties();
            adj = 1;
        }

        if(event.shiftKey) {
            for(let x = Math.max(InfoBox.obj.j-6, 0); x <= Math.min(InfoBox.obj.j+6, board[0].length-1); x++) {
                for(let y = Math.max(InfoBox.obj.i-6, 0); y <= Math.min(InfoBox.obj.i+6, board.length-1); y++) {
                    if(board[y][x] != null && board[y][x].constructor == InfoBox.obj.constructor && board[y][x].level == InfoBox.obj.level-adj) {
                        board[y][x].upgrade();
                    }
                }
            }
        }
    }

    static getRidOfBox() {
        InfoBox.obj = null;
        InfoBox.div.style.display = 'none';
    }
}