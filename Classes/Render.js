class Render {

    static queue = [[],[],[],[],[],[],[],[],[],[],[]];
    static checkEveryFrame = [];

    static board() {

        Render.makeGrid();

        //Goes through Render.checkEveryFrame
        Render.updateElements();

        for(let i = Math.max(0, Math.floor(frame.sx)-2); i < Math.ceil(frame.ex)+2; i++) {
            for(let j = Math.max(0, Math.floor(frame.sy)-2); j < Math.ceil(frame.ey)+2; j++) {
                if(board[j] !== undefined) {
                    if(board[j][i] != null) {
                        if(!Render.checkEveryFrame.includes(board[j][i])) {
                            board[j][i].update();
                        }
                        ctx.lineWidth = 3;
                        board[j][i].draw((i-frame.sx+0.5)*tileWidth, (j-frame.sy+0.5)*tileWidth);
                    }
                }
            }
        }

        //Renders the player
        Player.player.draw();

        Enemy.drawEnemies();

        Projectile.updateProjectiles();

        //Puts the half-transparent template on the board
        if(['Building', 'Resource'].includes(Inventory.active.type)) {
            let i = Math.floor(frame.sx + cursor.px/tileWidth);
            let j = Math.floor(frame.sy + cursor.py/tileWidth);
            if(j >= 0 && j < board.length && board[j][i] === null) {
                ctx.lineWidth = 3;
                let built = false;
                if(cursor.mousedown) {
                    built = Inventory.active.build(i, j);
                }
                if(!built) {
                    let obj = new Inventory.active(-1, [i, j]);
                    if(obj.classType == 'Resource') {
                        obj.angle = 0;
                    }
                    ctx.globalAlpha = 0.5;
                    obj.draw((i-frame.sx+0.5)*tileWidth, (j-frame.sy+0.5)*tileWidth);
                    ctx.globalAlpha = 1.0;
                }
            }
        }

        for(let i = 0; i < Render.queue.length; i++) {
            while(Render.queue[i].length > 0) {
                Render.queue[i][0]();
                Render.queue[i].splice(0, 1);
            }
        }

        if(InfoBox.obj != null) {
            InfoBox.updateCoordinates();
        }
    }

    static makeGrid() {
        //Renders the grid
        let x = Player.player.x;
        let y = Player.player.y;

        const startXCoordinate = x-tilesLong/2;
        const startYCoordinate = y-tilesHigh/2;

        ctx.lineWidth = Math.max(36/tilesHigh, 0.5);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';

        frame.sx = startXCoordinate;
        frame.sy = startYCoordinate;
        frame.ex = startXCoordinate + tilesLong;
        frame.ey = startYCoordinate + tilesHigh;

        let startX = 0;
        let startY = 0;

        frame.xOffset = startXCoordinate-Math.floor(startXCoordinate);
        frame.yOffset = startYCoordinate-Math.floor(startYCoordinate);

        let xAdjust;
        let yAdjust;
        startXCoordinate < 0 ? xAdjust = -startXCoordinate : xAdjust = -frame.xOffset;
        startYCoordinate < 0 ? yAdjust = -startYCoordinate : yAdjust = -frame.yOffset;

        let fxAdjust;
        let fyAdjust;
        frame.ex > board[0].length ? fxAdjust = frame.ex-board[0].length : fxAdjust = 0;
        frame.ey > board.length ? fyAdjust = frame.ey-board.length : fyAdjust = 0;

        for(startX += xAdjust; startX <= Math.ceil(tilesLong) - fxAdjust; startX++) {
            ctx.beginPath();
            ctx.moveTo(startX * tileWidth, yAdjust * tileWidth);
            ctx.lineTo(startX * tileWidth, (tilesHigh - fyAdjust)*tileWidth);
            ctx.stroke();
        }

        for(startY += yAdjust; startY <= tilesHigh - fyAdjust; startY++) {
            ctx.beginPath();
            ctx.moveTo(xAdjust * tileWidth, startY * tileWidth);
            ctx.lineTo((tilesLong-fxAdjust) * tileWidth, startY * tileWidth);
            ctx.stroke();
        }
    }

    static updateElements() {
        const arr = [...Render.checkEveryFrame];
        arr.forEach(obj => obj.update());
    }
}