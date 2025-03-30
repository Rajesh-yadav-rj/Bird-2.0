const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.5;
const FLAP_STRENGTH = -10;
const SPAWN_RATE = 90; // frames per pipe spawn
const PIPE_WIDTH = 50;
const PIPE_SPACING = 300;
const PIPE_HEIGHT = canvas.height / 2;
const BIRD_SIZE = 20;

canvas.width = 320;
canvas.height = 480;

let birdY = canvas.height / 2;
let birdVelocity = 0;
let birdFlapping = false;
let score = 0;

let pipes = [];
let frameCount = 0;
let gameInterval;
let isPaused = false;

function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(50, birdY, BIRD_SIZE, BIRD_SIZE); // The bird is yellow
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = 'red'; // The pipes are red
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + PIPE_SPACING, PIPE_WIDTH, canvas.height - pipe.top - PIPE_SPACING);
    });
}

function updatePipes() {
    pipes.forEach((pipe, index) => {
        pipe.x -= 2; // Move pipes to the left
        if (pipe.x + PIPE_WIDTH <= 0) {
            pipes.splice(index, 1); // Remove pipes that go off-screen
        }
    });

    if (frameCount % SPAWN_RATE === 0) {
        let pipeHeight = Math.random() * (canvas.height - PIPE_SPACING);
        pipes.push({
            x: canvas.width,
            top: pipeHeight,
        });
    }
}

function checkCollisions() {
    // Check for collisions with pipes
    for (let pipe of pipes) {
        if (50 + BIRD_SIZE > pipe.x && 50 < pipe.x + PIPE_WIDTH) {
            if (birdY < pipe.top || birdY + BIRD_SIZE > pipe.top + PIPE_SPACING) {
                return true;
            }
        }
    }

    // Check for collision with the ground
    if (birdY + BIRD_SIZE >= canvas.height) {
        return true;
    }

    return false;
}

function updateBird() {
    if (birdFlapping) {
        birdVelocity = FLAP_STRENGTH;
        birdFlapping = false;
    }

    birdVelocity += GRAVITY;
    birdY += birdVelocity;

    if (birdY < 0) birdY = 0;
    if (birdY + BIRD_SIZE > canvas.height) birdY = canvas.height - BIRD_SIZE;
}

function drawScore() {
    ctx.fillStyle = 'white'; // The score text is white to contrast with the black background
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
    if (isPaused) return; // If game is paused, don't update anything

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updateBird();
    drawBird();
    
    updatePipes();
    drawPipes();

    if (checkCollisions()) {
        alert('Game Over!');
        stopGame();
    }

    drawScore();

    score += 1;

    frameCount++;
}

function startGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    frameCount = 0;
    isPaused = false;
    gameInterval = setInterval(gameLoop, 1000 / 60);
}

function stopGame() {
    clearInterval(gameInterval);
}

function pauseGame() {
    isPaused = true;
    document.getElementById('pauseButton').style.display = 'none';
    document.getElementById('resumeButton').style.display = 'inline-block';
}

function resumeGame() {
    isPaused = false;
    gameInterval = setInterval(gameLoop, 1000 / 60);
    document.getElementById('resumeButton').style.display = 'none';
    document.getElementById('pauseButton').style.display = 'inline-block';
}

document.addEventListener('keydown', () => {
    if (!isPaused) birdFlapping = true;
});

document.getElementById('restartButton').addEventListener('click', () => {
    stopGame();
    startGame();
});

document.getElementById('pauseButton').addEventListener('click', pauseGame);

document.getElementById('resumeButton').addEventListener('click', resumeGame);

startGame();
