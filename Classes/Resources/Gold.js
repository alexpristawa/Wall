class Gold extends Resource {

    static image = new Image();
    static drawRadiusTiles;

    constructor(x, y) {
        super(x, y, false);
        this.angle = Math.random()*2*Math.PI;
        this.type = 'gold';
    }
}