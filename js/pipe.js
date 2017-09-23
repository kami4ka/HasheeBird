import Utils from "./utils";

export default class Pipe {
    constructor(canvas) {
        this.startDistance = 150;
        this.width = 100;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.x = canvas.width;
        this.yTop = Math.random() * canvas.height / 2 + canvas.height / 8;
        this.yBot = this.yTop + this.startDistance;
        this.speed = 10;

        this.botRect = {
            x: this.x,
            y: this.yBot,
            width: this.width,
            height: this.canvas.height - this.yBot
        };

        this.topRect = {
            x: this.x,
            y: 0,
            width: this.width,
            height: this.yTop
        };

        this.fillStyle = 'white';
        this.canBeRemoved = false;
    }

    update() {
        this.x -= this.speed;
        this.topRect.x = this.x;
        this.botRect.x = this.x;

        if (this.x + this.width < 0) {
            this.canBeRemoved = true;
        }
    }

    draw() {
        this.context.fillStyle = this.fillStyle;
        this.context.fillRect(this.x, this.yBot, this.width, this.canvas.height - this.yBot);
        this.context.fillRect(this.x, 0, this.width, this.yTop);
    }

    collideBird(bird) {
        return Utils.circleIntersectsRectangle(bird, this.botRect) || Utils.circleIntersectsRectangle(bird, this.topRect);
    }
}