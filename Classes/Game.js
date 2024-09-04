class Game {

    static isDay = true;
    static dayLength = 120;
    static nightCount = 0;
    static shader = document.querySelector('div#main');
    static nightDisplay = document.querySelector("#nightDisplayHolder > #nightDisplay");
    static nightCountDisplay = document.querySelector("#nightDisplayHolder > #nightCount");
    static trapArr;

    static updateGame() {
        if(gameTime != undefined) {
            gameTime += deltaTime/1000;
            Game.nightDisplay.style.transform = `rotate(${360*(gameTime/Game.dayLength)}deg)`;
            Game.nightDisplay.querySelector('i.fa-moon').style.transform = `rotate(${-360*(gameTime/Game.dayLength)}deg)`;
            Game.nightDisplay.querySelector('i.fa-sun').style.transform = `rotate(${-360*(gameTime/Game.dayLength)}deg)`;
            if(gameTime > Game.dayLength) {
                gameTime %= Game.dayLength;
                Game.setDay();

            } else if(gameTime > Game.dayLength/2) {
                if(Game.isDay) {
                    Game.setNight();
                } else {
                    if(gameTime - Game.dayLength/2 > 1.5) {
                        let oldCount = Math.floor(Game.wave.count);
                        Game.wave.count = Math.min((gameTime - Game.dayLength/2)/Game.wave.spreadTime*Game.wave.total, Game.wave.total);
                        while(oldCount < Math.floor(Game.wave.count)) {
                            let remainingNum = randomNumber(1, Game.wave.total-oldCount);
                            let i = 0;
                            for(; remainingNum > 0; i++) {
                                remainingNum -= Game.wave.types[i].total;
                            }
                            i--;
                            Game.wave.types[i].total--;
                            let angle = Math.random()*Math.PI*2;
                            let x = House.house.x+Math.cos(angle)*(Game.maxDistance+4);
                            let y = House.house.y+Math.sin(angle)*(Game.maxDistance+4);
                            new Enemy(x, y, Game.wave.types[i].radiusTiles, Game.wave.types[i].health, Game.wave.types[i].buildingDamage, Game.wave.types[i].maxVelocity, Game.wave.types[i].color, Game.wave.types[i].obj);
                            oldCount++;
                        }
                    }
                }
            }
        }
    }

    static setDay() {
        for(let i = 0; i < Game.trapArr.length; i++) {
            let obj = Game.trapArr[i];
            if(board[obj.i][obj.j] == null || (board[obj.i][obj.j].constructor.name == 'Trap' && board[obj.i][obj.j].level < obj.level)) {
                board[obj.i][obj.j] = null;
                let trap = new Trap(obj.j, obj.i);
                trap.level = obj.level;
            }
        }
        Game.isDay = true;
        Game.shader.style.backgroundColor = 'transparent';
    }

    static setNight() {
        Game.trapArr = [...Trap.traps];
        Game.nightCount++;
        Game.isDay = false;
        Game.shader.style.backgroundColor = 'rgba(5, 12, 20, 0.5)';
        let maxDistance = 0;
        for(let i = 0; i < Building.buildings.length; i++) {
            let newDistance = (Building.buildings[i].x-House.house.x)**2 + (Building.buildings[i].y - House.house.y)**2;
            if(newDistance > maxDistance) {
                maxDistance = newDistance;
            }
        }
        Game.maxDistance = maxDistance**0.5;
        Game.wave = {
            total: 50 * Game.nightCount,
            count: 0,
            spreadTime: Game.dayLength/4,
            types: []
        }
        if(Game.nightCount%5 == 0) {
            Game.wave.types.push({
                type: "Boss",
                total: Math.floor(Game.nightCount/5),
                radiusTiles: 1,
                color: 'red',
                health: Game.nightCount*200,
                buildingDamage: Game.nightCount*10,
                maxVelocity: 2,
                obj: {special: "Spawner"}
            });
        }
        let remaining = Game.wave.total;
        if(Game.nightCount/5 < 1) {
            Game.wave.types = [{
                total: Game.wave.total
            }];
        } else {
            for(let i = Math.floor(Game.nightCount/5); i >= 0; i--) {
                let total = Math.floor(remaining/(i+1));
                if(i == Math.floor(Game.nightCount)) {
                    total *= Game.nightCount%5/4;
                } else if(i == 0) {
                    total = remaining;
                }

                let object = Enemy.getProperties(i, total);
                object.total = total;
                Game.wave.types.push(object);
                remaining -= total;
            }
        }
        Game.nightCountDisplay.innerHTML = `Night ${Game.nightCount}`;
    }

    static defeat() {
        deathDisplay.fadeIn(1000, 'flex');
    }

    static newGame(first = false) {
        if(!first) {
            deathDisplay.fadeOut(200, false);
        }
        let predefinedObjects = {
            rock: 1000,
            tree: 1500,
            bush: 1000,
            gold: 500
        }
        
        //Makes the board
        board = Array(tileCount).fill().map(() => Array(tileCount).fill().map(() => null));
        
        {
            let keys = Object.keys(predefinedObjects);
            keys.forEach(key => {
                while(predefinedObjects[key] > 0) {
                    let i = randomNumber(0, board.length);
                    let j = randomNumber(0, board[0].length);
                    while(board[i][j] !== null) {
                        i = randomNumber(0, board.length);
                        j = randomNumber(0, board[0].length);
                    }
                    if(key == 'rock') {
                        board[i][j] = new Rock(j, i);
                    } else if(key == 'tree') {
                        board[i][j] = new Tree(j, i);
                    } else if(key == 'bush') {
                        board[i][j] = new Bush(j, i);
                    } else if(key == 'gold') {
                        board[i][j] = new Gold(j, i);
                    }
                    
        
                    predefinedObjects[key]--;
                }
            });
        }
        
        new Player(249.5, 249.5);
        for(let i = 0; i < Inventory.slots.length; i++) {
            for(let j = 0; j < Inventory.slots[i].length; j++) {
                Inventory.slots[i][j] = null
            }
        }
        previousTime = undefined;
        gameTime = undefined;
        gameTime=undefined;
        Inventory.buttons = [];
        Inventory.activeIndexes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        Game.nightDisplay.style.transform = 'rotate(0deg)';
        Game.nightDisplay.querySelector('i.fa-moon').style.transform = `rotate(0deg)`;
        Game.nightDisplay.querySelector('i.fa-sun').style.transform = `rotate(0deg)`;
        Game.nightCountDisplay.innerHTML = "Night 0";
        Inventory.initializeInventory();
        if(first) {
            Shop.initializeShop();
        } else {
            Shop.updateShop(Shop.tabs[0]);
        }
        Game.nightCount=0;
        Enemy.enemies = [];
        Game.shader.style.backgroundColor='transparent';
        Render.checkEveryFrame=[];
        if(first) requestAnimationFrame(animationFunction);
    }
}