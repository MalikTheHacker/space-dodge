const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('overlay');

let score = 0;
let gameActive = false;
let playerX = 280;
let playerY = 760;
const playerSpeed = 7;
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
    player.style.bottom = (800 - playerY - 40) + 'px'; // Adjusted for CSS coordinates
    // Fix: The player is relative to bottom, let's just use top
    player.style.top = playerY + 'px';
    player.style.bottom = 'auto';
}

function createAsteroid() {
    if (!gameActive) return;
    const asteroid = document.createElement('div');
    asteroid.className = 'asteroid';
    const size = Math.random() * 40 + 20;
    asteroid.style.width = size + 'px';
    asteroid.style.height = size + 'px';
    asteroid.style.left = Math.random() * 560 + 'px';
    asteroid.style.top = '-50px';
    gameContainer.appendChild(asteroid);

    let pos = -50;
    const speed = Math.random() * 3 + 2;

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
            scoreElement.innerText = `Score: ${score}`;
        }

        // Collision detection
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

function gameOver() {
    gameActive = false;
    overlay.style.display = 'flex';
    overlay.querySelector('h1').innerText = 'Game Over!';
    overlay.querySelector('p').innerText = `Final Score: ${score}`;
    startBtn.innerText = 'Try Again';
}

function startGame() {
    score = 0;
    scoreElement.innerText = `Score: 0`;
    gameActive = true;
    overlay.style.display = 'none';
    playerX = 280;
    playerY = 740;

    // Clear existing asteroids
    document.querySelectorAll('.asteroid').forEach(a => a.remove());
}

startBtn.addEventListener('click', startGame);

function gameLoop() {
    if (gameActive) {
        movePlayer();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
setInterval(createAsteroid, 1000);
