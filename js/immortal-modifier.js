import Utils from './utils';

export default class ImmortalModifier {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.x = canvas.width + 200 + Math.random() * 200;
        this.y = Math.random() * canvas.height * 0.75 + canvas.height/10;
        this.radius = 20;
        this.canBeRemoved = false;
        this.speed = 10;

        this.img = new Image();
        this.img.src = 'heart.png';
    }

    update() {
        this.x -= this.speed;

        if (this.x < 0) {
            this.canBeRemoved = true;
        }
    }

    draw() {
        this.context.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }

    collideBird(bird) {
        return Utils.circleIntersectsCircle(this, bird);
    }
}