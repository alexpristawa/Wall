class HealthBar {

    constructor(i, j, parent) {
        if(parent.classType != "Enemy") {
            this.timeSinceLastCall = 3500;
            this.x = i+0.75;
            this.y = j+1.25;
        }
        this.parent = parent;
    }

    update() {
        if(['Resource', 'Building'].includes(this.parent.classType)) {
            Render.queue[10].push(() => {
                let aFix = '';
                let alphaFix = '';

                if(this.timeSinceLastCall > 3000) {
                    aFix = 'a';
                    alphaFix = `, ${1-(this.timeSinceLastCall-3000)/500}`;
                }

                ctx.fillStyle = 'transparent';
                ctx.strokeStyle = `rgb${aFix}(60, 60, 60${alphaFix})`;
                ctx.lineWidth = 0.05*tileWidth;
                Canvas.rect((this.x-frame.sx-1)*tileWidth, (this.y-frame.sy-0.1)*tileWidth, 1.5*tileWidth, 0.2*tileWidth, 0, true);

                ctx.fillStyle = `rgb${aFix}(32, 82, 43${alphaFix})`;

                let healthPercent;
                if(this.parent.classType == 'Resource') {
                    healthPercent = this.parent.health/Resource.health;
                } else if(this.parent.classType == 'Building') {
                    healthPercent = this.parent.health/this.parent.constructor.stats[this.parent.level-1].health;
                } else if(this.parent.classType == 'Enemy') {
                    healthPercent = this.parent.health/this.parent.maxHealth;
                }
                
                Canvas.rect((this.x-frame.sx-0.975)*tileWidth, (this.y-frame.sy-0.075)*tileWidth, 1.45*tileWidth*healthPercent, 0.15*tileWidth, 0, false);

                this.timeSinceLastCall += deltaTime;
            });
        } else if(this.parent.classType == 'Enemy') {
            Render.queue[10].push(() => {
                this.x = this.parent.x;
                this.y = this.parent.y+0.5;

                ctx.fillStyle = 'transparent';
                ctx.strokeStyle = 'rgb(60, 60, 60)';
                ctx.lineWidth = 0.05*tileWidth;
                Canvas.rect((this.x-frame.sx-0.5)*tileWidth, (this.y-frame.sy-0.07)*tileWidth, tileWidth, 0.14*tileWidth, 0, true);

                ctx.fillStyle = 'rgb(94, 31, 31)';
                let healthPercent = this.parent.health/this.parent.maxHealth;
                
                Canvas.rect((this.x-frame.sx-0.475)*tileWidth, (this.y-frame.sy-0.05)*tileWidth, 0.95*tileWidth*healthPercent, 0.1*tileWidth, 0, false);
            });
        }
    }
}