const root = document.querySelector(':root');
const body = document.querySelector('body');
Gold.image.src="Images/Gold/Gold.png";
let cursor = {x: 0, y: 0, mousedown: false};
let deltaFrames;
let deltaTime;
let nowTime;
let previousTime;
let gameTime;
let tileWidth;
let tilesLong;
let tilesHigh;
let frame = {};
let board;
let interactDiv = document.querySelector("#main > #interact");
let previousScrollHeight = window.innerHeight*5;
interactDiv.scrollTop = previousScrollHeight;
let scrollDiv = document.querySelector('#main > #interact > #scrollCount');
let deathDisplay = document.querySelector("#main > #deathDisplay");
let beginFunctionQueue = [];
let paused = false;

window.addEventListener('wheel', (event) => {
    if(event.ctrlKey) { //Checks if the player is zooming
        event.preventDefault();
    }
}, { passive: false });

let resizeWindow = (repaint = true) => {
    previousScrollHeight = interactDiv.scrollTop;
    tilesHigh = (6-interactDiv.scrollTop/window.innerHeight+1)*6;
    tileWidth = window.innerHeight/tilesHigh;
    Rock.radius = tileWidth * 0.75;
    Rock.radiusTiles = 0.75;
    Resource.radius = tileWidth*0.75;
    Resource.radiusTiles = 0.75;
    Tree.drawRadiusTiles = Resource.radiusTiles * 2;
    Rock.drawRadiusTiles = Resource.radiusTiles * 1.15;
    Bush.drawRadiusTiles = Resource.radiusTiles * 1.30;
    Gold.drawRadiusTiles = Resource.radiusTiles * 1.15;
    Player.radius = tileWidth*Player.radiusTiles;
    tilesLong = window.innerWidth/tileWidth;
    frame.windowWidth = window.innerWidth;
    frame.windowHeight = window.innerHeight;

    if(repaint) {
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
    }

    document.documentElement.style.fontSize = `${Math.min(window.innerHeight/45.9375, window.innerWidth/90)}px`;
}
window.addEventListener("DOMContentLoaded", resizeWindow);


interactDiv.addEventListener('scroll', () => {beginFunctionQueue.push(() => {resizeWindow(false)})});

let canvas = document.getElementById("canvas");
let ctx;
let tileCount = 500;
let materialElements = {
    gold: document.querySelector('#main > #materials > #goldCount'),
    stone: document.querySelector('#main > #materials > #stoneCount'),
    wood: document.querySelector('#main > #materials > #woodCount'),
    food: document.querySelector('#main > #materials > #foodCount')
}

let keyboard = {
    w: false,
    a: false,
    s: false,
    d: false,
    ' ': false
}

let keyboardCorrections = {
    arrowup: 'w',
    arrowdown: 's',
    arrowleft: 'a',
    arrowright: 'd'
}

//Initializes the canvas stuff
window.onload = function() {
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    function resizeCanvas() {
        var ratio = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.scale(ratio, ratio);
    }
    


    window.addEventListener('resize', resizeCanvas);

    Game.newGame(true);
    resizeCanvas();
    resizeWindow();

    document.addEventListener('mousemove', (event) => {
        if(!Player.player.fixedSight) {
            cursor.x = event.clientX;
            cursor.y = event.clientY;
        }
        cursor.px = event.clientX;
        cursor.py = event.clientY;
    });
}

window.addEventListener('resize', resizeWindow);

document.addEventListener('keydown', (event) => {
    let key = event.key.toLowerCase();
    if(keyboardCorrections[key] !== undefined) {
        key = keyboardCorrections[key];
    }
    if(Object.keys(keyboard).includes(key)) keyboard[key] = true;
    if(key == ' ') {
        event.preventDefault();
        documentMousedownHandler('keydown');
    }
    if(key == 'e') {
        Player.player.autoAttack = !Player.player.autoAttack;
    }
    if(key == 'x') {
        Player.player.fixedSight = !Player.player.fixedSight;
        if(!Player.player.fixedSight) {
            cursor.x = cursor.px;
            cursor.y = cursor.py;
        }
    }
    if(key == 'm') {
        interactDiv.scrollTop = window.innerHeight*5;
    }
    if(key == 'p') {
        paused = !paused;
        let pauseButton = document.querySelector('#pauseHolder');
        let interact = document.querySelector('div#interact');
        if(!paused) {
            animationFunction();
            pauseButton.style.display = 'none';
            interact.style.backgroundColor = 'transparent';
        } else {
            previousTime = undefined;
            pauseButton.style.display = 'flex';
            interact.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        }
    }
    if('1234567890'.indexOf(key) != -1) {
        let index = parseInt(key)-1;
        if(index == -1) index = 9;
        let Class = Inventory.slotOptions[index][Inventory.activeIndexes[index]];
        Class.button.click();
    }
    if('!@#$%^&*()'.indexOf(key) != -1) {
        let index = '!@#$%^&*()'.indexOf(key);
        if(index < Inventory.slots[Inventory.active.i].length) {
            Inventory.slotOptions[Inventory.active.i][index].button.click();
        }
    }
});

document.addEventListener('keyup', (event) => {
    let key = event.key.toLowerCase();
    if(keyboardCorrections[key] !== undefined) {
        key = keyboardCorrections[key];
    }
    if(Object.keys(keyboard).includes(key)) keyboard[key] = false;
});

let documentMousedownHandler = (event) => {
    if(event != "keydown" && (event.target.matches(".noClick *") || event.target.matches(".noClick"))) {
        return;
    }
    if(typeof event == 'object') {
        cursor.mousedown = true;
        let x = Math.floor(frame.sx + cursor.px/tileWidth);
        let y = Math.floor(frame.sy + cursor.py/tileWidth);
        if(y >= 0 && y < board.length && x >= 0 && x < board[0].length) {
            if(board[y][x] == null && InfoBox.obj != null) {
                InfoBox.getRidOfBox();
            } else if(board[y][x] != null && board[y][x].classType == "Building") {
                InfoBox.newInfoBox(board[y][x]);
                return;
            }
        }
    }

    if(['Building', 'Resource'].includes(Inventory.active.type)) {
        let x = Math.floor(frame.sx + cursor.px/tileWidth);
        let y = Math.floor(frame.sy + cursor.py/tileWidth);
        if(board[y][x] == null) {
            Inventory.active.build(x, y);
        }
    }
}
document.querySelector('#main').addEventListener('mousedown', documentMousedownHandler);

document.addEventListener('mouseup', (event) => {
    cursor.mousedown = false;
});

let infiniteResources = (makeInfinite = true) => {
    if(makeInfinite) {
        Sword.stats[0].materialMultiplier = 1000000;
    } else {
        Sword.stats[0].materialMultiplier = 1;
    }
}
infiniteResources(true);

let animationFunction = () => {
    if(paused) return;
    let rememberPreviousTime;
    if(previousTime == undefined) {
        previousTime = Date.now();
        requestAnimationFrame(animationFunction);
        return;
    } else {
        nowTime = Date.now();
        deltaTime = Date.now() - previousTime;
        deltaFrames = 1000/deltaTime;
        rememberPreviousTime = Date.now();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < beginFunctionQueue.length; i++) {
        beginFunctionQueue[i]();
    }

    Game.updateGame();

    Player.player.updatePlayer();
    Enemy.updateEnemies();

    Object.keys(materialElements).forEach(key => materialElements[key].querySelector('.numHolder').innerHTML = Player.player.materials[key]);

    Map.updateMap();
    Render.board();

    previousTime = rememberPreviousTime;
    
    requestAnimationFrame(animationFunction);

    Enemy.sort();
}