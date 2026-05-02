const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('overlay');

let score = 0;
let level = 1;
let gameActive = false;
let playerX = 280;
let playerY = 740;
const playerSpeed = 7;
const pointsPerLevel = 10;
let spawnInterval = 1000;
const keys = {};

document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

function movePlayer() {
    if (keys['ArrowLeft'] || keys['a']) playerX -= playerSpeed;
    if (keys['ArrowRight'] || keys['d']) playerX += playerSpeed;
    if (keys['ArrowUp'] || keys['w']) playerY -= playerSpeed;
    if (keys['ArrowDown'] || keys['s']) playerY += playerSpeed;

    playerX = Math.max(0, Math.min(560, playerX));
    playerY = Math.max(0, Math.min(760, playerY));

    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';
}

function createAsteroid() {
    if (!gameActive) return;
    const asteroid = document.createElement('div');
    asteroid.className = 'asteroid';

    const maxSize = 40 + (level * 2);
    const size = Math.random() * maxSize + 20;
    asteroid.style.width = size + 'px';
    asteroid.style.height = size + 'px';
    asteroid.style.left = Math.random() * 560 + 'px';
    asteroid.style.top = '-50px';
    gameContainer.appendChild(asteroid);

    let pos = -50;
    const baseSpeed = 2 + (level * 0.5);
    const speed = (Math.random() * 3) + baseSpeed;

    const interval = setInterval(() => {
        if (!gameActive) {
            clearInterval(interval);
            asteroid.remove();
            return;
        }
        pos += speed;
        asteroid.style.top = pos + 'px';

        if (pos > 800) {
            clearInterval(interval);
            asteroid.remove();
            score++;

            if (score > 0 && score % pointsPerLevel === 0) {
                level++;
                spawnInterval = Math.max(300, 1000 - (level * 50));
            }

            scoreElement.innerText = `Score: ${score} | Level: ${level}`;
        }

        const pRect = player.getBoundingClientRect();
        const aRect = asteroid.getBoundingClientRect();

        if (!(pRect.right < aRect.left ||
              pRect.left > aRect.right ||
              pRect.bottom < aRect.top ||
              pRect.top > aRect.bottom)) {
            gameOver();
        }
    }, 20);
}

function scheduleNextAsteroid() {
    if (!gameActive) return;
    setTimeout(() => {
        createAsteroid();
        scheduleNextAsteroid();
    }, spawnInterval);
}

function gameOver() {
    gameActive = false;
    overlay.style.display = 'flex';
    overlay.querySelector('h1').innerText = 'Game Over!';
    overlay.querySelector('p').innerText = `Final Score: ${score} | Level: ${level}`;
    startBtn.innerText = 'Try Again';
}

function startGame() {
    score = 0;
    level = 1;
    spawnInterval = 1000;
    scoreElement.innerText = `Score: 0 | Level: 1`;
    gameActive = true;
    overlay.style.display = 'none';
    playerX = 280;
    playerY = 740;

    document.querySelectorAll('.asteroid').forEach(a => a.remove());
    scheduleNextAsteroid();
}

startBtn.addEventListener('click', startGame);

function gameLoop() {
    if (gameActive) {
        movePlayer();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
