export default class Bird {
    constructor(canvas, miner) {
        this.x = 100;
        this.y = canvas.height / 2;
        this.radius = 20;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.gravity = 0.6;
        this.forceLift = 15;
        this.velocity = 0;
        this.lose = false;

        this.miner = miner;

        this.immortalHashes = 0;
        this.allHashes = 0;

        this.lives = 3;

        this.img = new Image();
        this.img.src = 'bird.png';
    }

    update() {
        const totalHashes = this.miner.getTotalHashes();
        if (totalHashes > this.allHashes + this.immortalHashes) {
            this.immortalHashes = 0;
            this.allHashes = totalHashes;
            this.miner.stop();
        }


        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y + this.radius >= this.canvas.height) {
            this.y = this.canvas.height - this.radius;
            this.startImmortal();
        }

        if (this.y - this.radius <= 0) {
            this.y = this.radius;
            this.velocity = 0;
        }
    }

    draw() {
        if (this.immortalHashes > 0) {
            this.context.save();
            this.context.globalAlpha = Math.random();
        }

        this.context.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);

        if (this.immortalHashes > 0) {
            this.context.restore();
        }
    }

    push() {
        this.velocity += - this.forceLift;
    }

    startImmortal() {
        if (this.immortalHashes <= 0) {
            if (this.lives <= 0) {
                this.lose = true;
            } else {
                this.lives--;
                this.immortalHashes += 50;
                this.miner.start();
            }
        }
    }
}