class Map {

    static person = document.querySelector('#main > #leftSideHolder > #map > #mapPlayer');

    static updateMap() {
        Map.person.style.top = `${Player.player.y/board.length*100}%`;
        Map.person.style.left = `${Player.player.x/board[0].length*100}%`;
    }
}