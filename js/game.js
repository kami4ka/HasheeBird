import Pipe from "./pipe";
import Bird from "./bird";
import ImmortalModifier from "./immortal-modifier";

export default class Game {
    constructor(canvas, miner) {
        this.frameCount = 0;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.miner = miner;
        this.score = 0;
        this.highScore = 0;
        this.pipes = [];
        this.started = false;

        this.immortalModifiers = [];
        this.bird = new Bird(canvas, this.miner);

        this.interval = 1000/60;

        this.heartImage = new Image();
        this.heartImage.src = 'heart.png';

        this.intervalFunction = () => {
            this.frameCount++;
            this.update();
            this.draw();
            setTimeout(this.intervalFunction, this.interval);
        };
        setTimeout(this.intervalFunction, this.interval);
    }

    update() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }

        if (!this.bird.lose && this.started) {
            if (this.frameCount % 60 === 0) {
                this.pipes.push(new Pipe(this.canvas));

                if (Math.floor(Math.random() * 20) % 3 === 0) {
                    this.immortalModifiers.push(new ImmortalModifier(this.canvas));
                }
            }

            this.bird.update();

            this.immortalModifiers.forEach((modifier, i) => {
                if (modifier.canBeRemoved) {
                    delete this.immortalModifiers[i];
                } else {
                    modifier.update();

                    if (modifier.collideBird(this.bird)) {
                        this.bird.lives++;
                        delete this.immortalModifiers[i];
                    }
                }
            });

            this.pipes.forEach((pipe, i) => {
                if (pipe.canBeRemoved) {
                    delete this.pipes[i];
                    this.score++;
                } else {
                    pipe.update();

                    if (pipe.collideBird(this.bird)) {
                        this.bird.startImmortal();
                    }
                }
            });
        }
    }

    draw() {
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.bird.lose) {
            endGame(this);
        } else {
            this.bird.draw();

            if (this.started) {
                this.pipes.forEach(pipe => {
                    pipe.draw();
                });
                this.immortalModifiers.forEach(modifier => {
                    modifier.draw();
                });

                drawScore(this);

                drawLives(this);
            }
        }
    }

    keyPush(evt) {
        if (evt.keyCode === 32) {
            if (!this.started) {
                this.started = true;
            }
            this.bird.push();
        }
    }

    click() {
        if (this.bird.lose) {
            this.immortalModifiers = [];
            this.pipes = [];
            this.score = 0;
            this.started = false;
            this.bird = new Bird(this.canvas, this.miner);
        }
    }
}

function drawLives(gameObj) {
    gameObj.context.drawImage(gameObj.heartImage, 30, 50, 45, 45);
    gameObj.context.font = "25px Comic Sans MS";
    gameObj.context.fillStyle = "rgba(255, 255, 255, 0.95)";
    gameObj.context.textAlign = "left";
    gameObj.context.fillText(gameObj.bird.lives.toString(), 45, 80);
}

function drawScore(gameObj) {
    gameObj.context.font = "30px Comic Sans MS";
    gameObj.context.fillStyle = "rgba(255, 255, 255, 0.5)";
    gameObj.context.textAlign = "right";
    gameObj.context.fillText('Score: ' + gameObj.score, gameObj.canvas.width - 30, 30);
    gameObj.context.textAlign = "left";
    gameObj.context.fillText('HighScore: ' + gameObj.highScore, 30, 30);
}

function endGame(gameObj) {
    gameObj.context.font = "30px Comic Sans MS";
    gameObj.context.fillStyle = "red";
    gameObj.context.textAlign = "center";
    gameObj.context.fillText('OUPS! Your score: ' + gameObj.score + '. Click to try again.', gameObj.canvas.width/2, gameObj.canvas.height/2);
}