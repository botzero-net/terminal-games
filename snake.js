#!/usr/bin/env node

/**
 * Terminal Snake Game
 * 
 * A classic snake game that runs in your terminal!
 * 
 * HOW TO PLAY:
 * - Use WASD or Arrow Keys to control the snake
 * - Eat the red apples (🍎) to grow and score points
 * - Avoid hitting walls or your own tail
 * - Press 'Q' or 'ESC' to quit
 * - Press 'P' to pause
 * 
 * TO RUN:
 *   node snake.js
 * 
 * REQUIREMENTS:
 *   npm install keypress
 * 
 * HIGH SCORE:
 *   Your high score is saved to .snake_highscore
 */

const keypress = require('keypress');
const fs = require('fs');
const path = require('path');

// Game configuration
const WIDTH = 40;
const HEIGHT = 20;
const TICK_RATE = 100; // milliseconds per frame

// High score file
const HIGH_SCORE_FILE = path.join(__dirname, '.snake_highscore');

// Game state
let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let highScore = 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop = null;

// Unicode characters for rendering
const CHARS = {
    SNAKE_HEAD: '▣',
    SNAKE_BODY: '■',
    FOOD: '🍎',
    WALL_H: '═',
    WALL_V: '║',
    WALL_TL: '╔',
    WALL_TR: '╗',
    WALL_BL: '╚',
    WALL_BR: '╝',
    EMPTY: ' '
};

// ANSI color codes
const COLORS = {
    RESET: '\x1b[0m',
    BRIGHT: '\x1b[1m',
    GREEN: '\x1b[32m',
    BRIGHT_GREEN: '\x1b[92m',
    RED: '\x1b[31m',
    BRIGHT_RED: '\x1b[91m',
    YELLOW: '\x1b[33m',
    BRIGHT_YELLOW: '\x1b[93m',
    CYAN: '\x1b[36m',
    WHITE: '\x1b[37m',
    GRAY: '\x1b[90m'
};

// Load high score
function loadHighScore() {
    try {
        if (fs.existsSync(HIGH_SCORE_FILE)) {
            const data = fs.readFileSync(HIGH_SCORE_FILE, 'utf8');
            highScore = parseInt(data) || 0;
        }
    } catch (e) {
        highScore = 0;
    }
}

// Save high score
function saveHighScore() {
    try {
        fs.writeFileSync(HIGH_SCORE_FILE, score.toString());
    } catch (e) {
        // Ignore save errors
    }
}

// Initialize game
function initGame() {
    // Start snake in the middle
    const startX = Math.floor(WIDTH / 2);
    const startY = Math.floor(HEIGHT / 2);
    snake = [
        { x: startX, y: startY },
        { x: startX - 1, y: startY },
        { x: startX - 2, y: startY }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    gameRunning = true;
    gamePaused = false;
    spawnFood();
}

// Spawn food at random location
function spawnFood() {
    do {
        food = {
            x: Math.floor(Math.random() * WIDTH),
            y: Math.floor(Math.random() * HEIGHT)
        };
    } while (isSnakeAt(food.x, food.y));
}

// Check if snake occupies position
function isSnakeAt(x, y) {
    return snake.some(segment => segment.x === x && segment.y === y);
}

// Clear screen
function clearScreen() {
    process.stdout.write('\x1b[2J\x1b[H');
}

// Hide cursor
function hideCursor() {
    process.stdout.write('\x1b[?25l');
}

// Show cursor
function showCursor() {
    process.stdout.write('\x1b[?25h');
}

// Render game
function render() {
    let output = '';
    
    // Title
    output += `${COLORS.BRIGHT}${COLORS.BRIGHT_GREEN}  🐍 TERMINAL SNAKE 🐍${COLORS.RESET}\n\n`;
    
    // Score
    const scoreColor = score > 0 ? COLORS.BRIGHT_YELLOW : COLORS.WHITE;
    const highScoreColor = COLORS.CYAN;
    output += `  ${COLORS.BRIGHT}Score:${COLORS.RESET} ${scoreColor}${score}${COLORS.RESET}  `;
    output += `${COLORS.BRIGHT}High Score:${COLORS.RESET} ${highScoreColor}${highScore}${COLORS.RESET}\n\n`;
    
    // Top border
    output += `  ${COLORS.GRAY}${CHARS.WALL_TL}${CHARS.WALL_H.repeat(WIDTH)}${CHARS.WALL_TR}${COLORS.RESET}\n`;
    
    // Game area
    for (let y = 0; y < HEIGHT; y++) {
        output += `  ${COLORS.GRAY}${CHARS.WALL_V}${COLORS.RESET}`;
        for (let x = 0; x < WIDTH; x++) {
            if (x === food.x && y === food.y) {
                output += CHARS.FOOD;
            } else if (snake[0].x === x && snake[0].y === y) {
                output += `${COLORS.BRIGHT_GREEN}${CHARS.SNAKE_HEAD}${COLORS.RESET}`;
            } else if (isSnakeAt(x, y)) {
                output += `${COLORS.GREEN}${CHARS.SNAKE_BODY}${COLORS.RESET}`;
            } else {
                output += CHARS.EMPTY;
            }
        }
        output += `${COLORS.GRAY}${CHARS.WALL_V}${COLORS.RESET}\n`;
    }
    
    // Bottom border
    output += `  ${COLORS.GRAY}${CHARS.WALL_BL}${CHARS.WALL_H.repeat(WIDTH)}${CHARS.WALL_BR}${COLORS.RESET}\n`;
    
    // Controls
    output += `\n  ${COLORS.GRAY}Controls: WASD/Arrows = Move | P = Pause | Q/ESC = Quit${COLORS.RESET}\n`;
    
    if (gamePaused) {
        output += `\n  ${COLORS.BRIGHT_YELLOW}*** PAUSED - Press P to resume ***${COLORS.RESET}\n`;
    }
    
    clearScreen();
    process.stdout.write(output);
}

// Update game state
function update() {
    if (gamePaused) return;
    
    // Update direction
    direction = nextDirection;
    
    // Calculate new head position
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };
    
    // Check wall collision
    if (newHead.x < 0 || newHead.x >= WIDTH || newHead.y < 0 || newHead.y >= HEIGHT) {
        gameOver();
        return;
    }
    
    // Check self collision
    if (isSnakeAt(newHead.x, newHead.y)) {
        gameOver();
        return;
    }
    
    // Move snake
    snake.unshift(newHead);
    
    // Check food collision
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        if (score > highScore) {
            highScore = score;
        }
        spawnFood();
        // Speed up slightly as score increases
        if (TICK_RATE - Math.floor(score / 50) > 50) {
            clearInterval(gameLoop);
            gameLoop = setInterval(gameTick, Math.max(50, TICK_RATE - Math.floor(score / 50)));
        }
    } else {
        snake.pop();
    }
}

// Game over
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    saveHighScore();
    
    clearScreen();
    console.log(`
${COLORS.BRIGHT_RED}  ╔══════════════════════════════════════╗${COLORS.RESET}
${COLORS.BRIGHT_RED}  ║           GAME OVER! 💀              ║${COLORS.RESET}
${COLORS.BRIGHT_RED}  ╠══════════════════════════════════════╣${COLORS.RESET}
${COLORS.BRIGHT_RED}  ║${COLORS.RESET}  Final Score: ${COLORS.BRIGHT_YELLOW}${score}${COLORS.RESET}                    ${COLORS.BRIGHT_RED}║${COLORS.RESET}
${COLORS.BRIGHT_RED}  ║${COLORS.RESET}  High Score:  ${COLORS.CYAN}${highScore}${COLORS.RESET}                    ${COLORS.BRIGHT_RED}║${COLORS.RESET}
${COLORS.BRIGHT_RED}  ║${COLORS.RESET}  Snake Length: ${COLORS.GREEN}${snake.length}${COLORS.RESET}                   ${COLORS.BRIGHT_RED}║${COLORS.RESET}
${COLORS.BRIGHT_RED}  ╠══════════════════════════════════════╣${COLORS.RESET}
${COLORS.BRIGHT_RED}  ║${COLORS.RESET}  Press ${COLORS.BRIGHT_GREEN}R${COLORS.RESET} to restart                  ${COLORS.BRIGHT_RED}║${COLORS.RESET}
${COLORS.BRIGHT_RED}  ║${COLORS.RESET}  Press ${COLORS.BRIGHT_YELLOW}Q${COLORS.RESET} to quit                    ${COLORS.BRIGHT_RED}║${COLORS.RESET}
${COLORS.BRIGHT_RED}  ╚══════════════════════════════════════╝${COLORS.RESET}
`);
}

// Game tick
function gameTick() {
    if (gameRunning) {
        update();
        render();
    }
}

// Handle input
function handleInput(key) {
    if (!gameRunning) {
        if (key.name === 'r' || key.name === 'R') {
            initGame();
            gameLoop = setInterval(gameTick, TICK_RATE);
            render();
        }
        return;
    }
    
    switch (key.name) {
        case 'w':
        case 'up':
            if (direction.y !== 1) {
                nextDirection = { x: 0, y: -1 };
            }
            break;
        case 's':
        case 'down':
            if (direction.y !== -1) {
                nextDirection = { x: 0, y: 1 };
            }
            break;
        case 'a':
        case 'left':
            if (direction.x !== 1) {
                nextDirection = { x: -1, y: 0 };
            }
            break;
        case 'd':
        case 'right':
            if (direction.x !== -1) {
                nextDirection = { x: 1, y: 0 };
            }
            break;
        case 'p':
        case 'P':
            gamePaused = !gamePaused;
            render();
            break;
        case 'q':
        case 'Q':
        case 'escape':
            quitGame();
            break;
    }
}

// Quit game
function quitGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    saveHighScore();
    showCursor();
    clearScreen();
    console.log(`${COLORS.BRIGHT_GREEN}Thanks for playing Snake! 🐍${COLORS.RESET}\n`);
    process.exit(0);
}

// Main
function main() {
    // Setup keypress
    keypress(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    
    // Handle keypress events
    process.stdin.on('keypress', (ch, key) => {
        if (key) {
            handleInput(key);
        }
    });
    
    // Handle Ctrl+C
    process.on('SIGINT', quitGame);
    
    // Load high score
    loadHighScore();
    
    // Hide cursor
    hideCursor();
    
    // Show start screen
    clearScreen();
    console.log(`
${COLORS.BRIGHT_GREEN}  ╔══════════════════════════════════════╗${COLORS.RESET}
${COLORS.BRIGHT_GREEN}  ║        🐍 TERMINAL SNAKE 🐍          ║${COLORS.RESET}
${COLORS.BRIGHT_GREEN}  ╠══════════════════════════════════════╣${COLORS.RESET}
${COLORS.BRIGHT_GREEN}  ║${COLORS.RESET}                                      ${COLORS.BRIGHT_GREEN}║${COLORS.RESET}
${COLORS.BRIGHT_GREEN}  ║${COLORS.RESET}  ${COLORS.BRIGHT}How to Play:${COLORS.RESET}                        ${COLORS.BRIGHT_GREEN}║${COLORS.RESET}
${COLORS.BRIGHT_GREEN}  ║${COLORS.RESET}  • Use ${COLORS.CYAN}WASD${COLORS.RESET} or ${COLORS.CYAN}Arrow Keys${COLORS.RESET} to move    ${COLORS.BRIGHT_GREEN}║${COLORS.RESET}
${COLORS.BRIGHT_GREEN}  ║${COLORS.RESET}  • Eat ${CHARS.FOOD} to grow and score points     ${COLORS.BRIGHT_GREEN}║${COLORS.RESET}
${COLORS.BRIGHT_GREEN}  ║${COLORS.RESET}  • Avoid walls and your own tail      ${COLORS.BRIGHT_GREEN}║${COLORS.RESET}
${COLORS.BRIGHT_GREEN}  ║${COLORS.RESET}  • Press ${COLORS.YELLOW}P${COLORS.RESET} to pause                ${COLORS.BRIGHT_GREEN}║${COLORS.RESET}
${COLORS.BRIGHT_GREEN}  ║${COLORS.RESET}  • Press ${COLORS.YELLOW}Q${COLORS.RESET} or ${COLORS.YELLOW}ESC${COLORS.RESET} to quit           ${COLORS.BRIGHT_GREEN}║${COLORS.RESET}
${COLORS.BRIGHT_GREEN}  ║${COLORS.RESET}                                      ${COLORS.BRIGHT_GREEN}║${COLORS.RESET}
${COLORS.BRIGHT_GREEN}  ║${COLORS.RESET}  ${COLORS.BRIGHT}High Score:${COLORS.RESET} ${COLORS.CYAN}${highScore}${COLORS.RESET}                      ${COLORS.BRIGHT_GREEN}║${COLORS.RESET}
${COLORS.BRIGHT_GREEN}  ║${COLORS.RESET}                                      ${COLORS.BRIGHT_GREEN}║${COLORS.RESET}
${COLORS.BRIGHT_GREEN}  ╠══════════════════════════════════════╣${COLORS.RESET}
${COLORS.BRIGHT_GREEN}  ║${COLORS.RESET}     Press ${COLORS.BRIGHT_GREEN}ANY KEY${COLORS.RESET} to start...        ${COLORS.BRIGHT_GREEN}║${COLORS.RESET}
${COLORS.BRIGHT_GREEN}  ╚══════════════════════════════════════╝${COLORS.RESET}
`);
    
    // Wait for any key to start
    process.stdin.once('keypress', () => {
        initGame();
        gameLoop = setInterval(gameTick, TICK_RATE);
        render();
    });
}

// Start game
main();
