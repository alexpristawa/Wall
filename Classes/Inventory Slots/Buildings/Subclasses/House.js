class House extends Building {

    static description = "Game ends when your house breaks.<br>House level determines max building level.";
    static role = 'House';
    static images = [];
    static house = null;
    static buildLimit = 1;
    static count = 0;

    static cost = [
        {
            stone: 25,
            wood: 25
        },
        {
            stone: 2500,
            wood: 2500
        },
        {
            stone: 15000,
            wood: 15000
        }
    ];

    constructor(j, i) {
        super(j, i);
        if(j != -1) {
            House.house = this;
            gameTime = 0;
            for(let k = Math.max(0, i-1); k <= Math.min(board.length-1, i+1); k++) {
                for(let l = Math.max(0, j-1); l <= Math.min(board[0].length-1, j+1); l++) {
                    if(board[k][l] != null && board[k][l].classType == 'Resource') {
                        board[k][l] = null;
                    }
                }
            }
        }
    }

    static stats = [
        {
            health: 500
        },
        {
            health: 750
        },
        {
            health: 1100
        }
    ]

    static createSlot(inventoryIndex) {
        InventorySlot.createSlot(House, inventoryIndex);
    }

    hit(obj = Player.player) {
        let broke = super.hit(obj);
        if(broke) {
            Game.defeat();
        }
    }

    draw(x, y) {
        super.draw(x, y);
    }
}