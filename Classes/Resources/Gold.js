class Gold extends Resource {

    static description = "Gold that can be harvested for gold.";
    static image = new Image();
    static drawRadiusTiles;

    constructor(x, y) {
        super(x, y, false);
        this.angle = Math.random()*2*Math.PI;
        this.type = 'gold';
    }
}