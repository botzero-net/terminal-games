#!/usr/bin/env node

/**
 * ASCII Tetris
 * 
 * A colorful Tetris clone that runs in your terminal!
 * 
 * HOW TO PLAY:
 * - Left/Right Arrows or A/D: Move piece
 * - Up Arrow or W: Rotate piece
 * - Down Arrow or S: Soft drop (faster)
 * - Space: Hard drop (instant)
 * - P: Pause game
 * - Q or ESC: Quit
 * 
 * TO RUN:
 *   node tetris.js
 * 
 * REQUIREMENTS:
 *   npm install keypress
 * 
 * SCORING:
 *   1 line  = 100 points
 *   2 lines = 300 points
 *   3 lines = 600 points
 *   4 lines = 1000 points (Tetris!)
 * 
 * HIGH SCORE is saved to .tetris_highscore
 */

const keypress = require('keypress');
const fs = require('fs');
const path = require('path');

// Game configuration
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 800; // Starting milliseconds per tick
const MIN_SPEED = 100;

// High score file
const HIGH_SCORE_FILE = path.join(__dirname, '.tetris_highscore');

// Tetromino pieces (I, O, T, S, Z, J, L)
const PIECES = [
    { // I-piece (Cyan)
        shape: [[1, 1, 1, 1]],
        color: '\x1b[96m',
        char: '█'
    },
    { // O-piece (Yellow)
        shape: [[1, 1], [1, 1]],
        color: '\x1b[93m',
        char: '█'
    },
    { // T-piece (Purple)
        shape: [[0, 1, 0], [1, 1, 1]],
        color: '\x1b[95m',
        char: '█'
    },
    { // S-piece (Green)
        shape: [[0, 1, 1], [1, 1, 0]],
        color: '\x1b[92m',
        char: '█'
    },
    { // Z-piece (Red)
        shape: [[1, 1, 0], [0, 1, 1]],
        color: '\x1b[91m',
        char: '█'
    },
    { // J-piece (Blue)
        shape: [[1, 0, 0], [1, 1, 1]],
        color: '\x1b[94m',
        char: '█'
    },
    { // L-piece (Orange)
        shape: [[0, 0, 1], [1, 1, 1]],
        color: '\x1b[38;5;208m',
        char: '█'
    }
];

// ANSI color codes
const COLORS = {
    RESET: '\x1b[0m',
    BRIGHT: '\x1b[1m',
    WHITE: '\x1b[37m',
    GRAY: '\x1b[90m',
    DARK_GRAY: '\x1b[38;5;240m',
    BORDER: '\x1b[38;5;245m'
};

// Border characters
const BORDER = {
    TL: '╔',
    TR: '╗',
    BL: '╚',
    BR: '╝',
    H: '═',
    V: '║'
};

// Game state
let board = [];
let currentPiece = null;
let currentX = 0;
let currentY = 0;
let score = 0;
let lines = 0;
let level = 1;
let highScore = 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop = null;
let nextPieceIndex = -1;

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
        if (score > highScore) {
            fs.writeFileSync(HIGH_SCORE_FILE, score.toString());
        }
    } catch (e) {
        // Ignore save errors
    }
}

// Initialize board
function initBoard() {
    board = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
}

// Create new piece
function spawnPiece() {
    if (nextPieceIndex === -1) {
        nextPieceIndex = Math.floor(Math.random() * PIECES.length);
    }
    
    const pieceIndex = nextPieceIndex;
    nextPieceIndex = Math.floor(Math.random() * PIECES.length);
    
    currentPiece = PIECES[pieceIndex];
    currentX = Math.floor((BOARD_WIDTH - currentPiece.shape[0].length) / 2);
    currentY = 0;
    
    // Check if piece can be placed
    if (!isValidPosition(currentPiece.shape, currentX, currentY)) {
        gameOver();
        return false;
    }
    return true;
}

// Check if position is valid
function isValidPosition(shape, x, y) {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const newX = x + col;
                const newY = y + row;
                
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                    return false;
                }
                
                if (newY >= 0 && board[newY][newX]) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Rotate piece
function rotatePiece() {
    const shape = currentPiece.shape;
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            rotated[col][rows - 1 - row] = shape[row][col];
        }
    }
    
    // Try to rotate, with wall kicks
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
        if (isValidPosition(rotated, currentX + kick, currentY)) {
            currentPiece = { ...currentPiece, shape: rotated };
            currentX += kick;
            return;
        }
    }
}

// Lock piece to board
function lockPiece() {
    const shape = currentPiece.shape;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const boardY = currentY + row;
                const boardX = currentX + col;
                if (boardY >= 0) {
                    board[boardY][boardX] = currentPiece;
                }
            }
        }
    }
}

// Clear completed lines
function clearLines() {
    let linesCleared = 0;
    
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== null)) {
            board.splice(row, 1);
            board.unshift(Array(BOARD_WIDTH).fill(null));
            linesCleared++;
            row++; // Check same row again
        }
    }
    
    if (linesCleared > 0) {
        const points = [0, 100, 300, 600, 1000];
        score += points[linesCleared] * level;
        lines += linesCleared;
        level = Math.floor(lines / 10) + 1;
    }
}

// Get current speed based on level
function getSpeed() {
    return Math.max(MIN_SPEED, INITIAL_SPEED - (level - 1) * 80);
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

// Render next piece preview
function renderNextPiece() {
    const piece = PIECES[nextPieceIndex];
    let output = '';
    
    output += `  ${COLORS.BRIGHT}Next:${COLORS.RESET}\n`;
    output += `  ${COLORS.BORDER}╔══════╗${COLORS.RESET}\n`;
    
    for (let row = 0; row < 4; row++) {
        output += `  ${COLORS.BORDER}║${COLORS.RESET}`;
        for (let col = 0; col < 6; col++) {
            const pieceRow = row - 1;
            const pieceCol = col - 1;
            
            if (pieceRow >= 0 && pieceRow < piece.shape.length &&
                pieceCol >= 0 && pieceCol < piece.shape[0].length &&
                piece.shape[pieceRow][pieceCol]) {
                output += piece.color + piece.char + COLORS.RESET;
            } else {
                output += ' ';
            }
        }
        output += `${COLORS.BORDER}║${COLORS.RESET}\n`;
    }
    
    output += `  ${COLORS.BORDER}╚══════╝${COLORS.RESET}\n`;
    return output;
}

// Render game
function render() {
    let output = '';
    
    // Title
    output += `${COLORS.BRIGHT}\x1b[96m  🎮 ASCII TETRIS 🎮${COLORS.RESET}\n\n`;
    
    // Stats
    const scoreStr = score.toString().padStart(8, ' ');
    const highStr = Math.max(score, highScore).toString().padStart(8, ' ');
    const linesStr = lines.toString().padStart(4, ' ');
    const levelStr = level.toString().padStart(2, ' ');
    
    output += `  ${COLORS.BRIGHT}Score:${COLORS.RESET}  ${COLORS.BRIGHT_YELLOW || '\x1b[93m'}${scoreStr}${COLORS.RESET}\n`;
    output += `  ${COLORS.BRIGHT}High:${COLORS.RESET}   ${COLORS.CYAN || '\x1b[96m'}${highStr}${COLORS.RESET}\n`;
    output += `  ${COLORS.BRIGHT}Lines:${COLORS.RESET}  ${COLORS.GREEN || '\x1b[92m'}${linesStr}${COLORS.RESET}  `;
    output += `${COLORS.BRIGHT}Level:${COLORS.RESET} ${COLORS.RED || '\x1b[91m'}${levelStr}${COLORS.RESET}\n\n`;
    
    // Main game area with next piece
    output += `  ${COLORS.BORDER}${BORDER.TL}${BORDER.H.repeat(BOARD_WIDTH * 2)}${BORDER.TR}${COLORS.RESET}  `;
    output += renderNextPiece().split('\n')[0];
    
    for (let row = 0; row < BOARD_HEIGHT; row++) {
        output += `  ${COLORS.BORDER}${BORDER.V}${COLORS.RESET}`;
        for (let col = 0; col < BOARD_WIDTH; col++) {
            let cell = board[row][col];
            
            // Check if current piece occupies this cell
            const pieceRow = row - currentY;
            const pieceCol = col - currentX;
            if (pieceRow >= 0 && pieceRow < currentPiece.shape.length &&
                pieceCol >= 0 && pieceCol < currentPiece.shape[0].length &&
                currentPiece.shape[pieceRow][pieceCol]) {
                cell = currentPiece;
            }
            
            if (cell) {
                output += cell.color + cell.char + cell.char + COLORS.RESET;
            } else {
                output += COLORS.DARK_GRAY + '··' + COLORS.RESET;
            }
        }
        output += `${COLORS.BORDER}${BORDER.V}${COLORS.RESET}  `;
        
        // Add next piece preview lines
        const nextLines = renderNextPiece().split('\n');
        if (row + 1 < nextLines.length && row < 6) {
            output += nextLines[row + 1];
        } else {
            output += '';
        }
        output += '\n';
    }
    
    output += `  ${COLORS.BORDER}${BORDER.BL}${BORDER.H.repeat(BOARD_WIDTH * 2)}${BORDER.BR}${COLORS.RESET}\n`;
    
    // Controls
    output += `\n  ${COLORS.GRAY}←→/AD=Move  ↑/W=Rotate  ↓/S=Drop  Space=Hard  P=Pause  Q=Quit${COLORS.RESET}\n`;
    
    if (gamePaused) {
        output += `\n  ${COLORS.BRIGHT}\x1b[93m*** PAUSED - Press P to resume ***${COLORS.RESET}\n`;
    }
    
    clearScreen();
    process.stdout.write(output);
}

// Move piece
function movePiece(dx, dy) {
    if (isValidPosition(currentPiece.shape, currentX + dx, currentY + dy)) {
        currentX += dx;
        currentY += dy;
        return true;
    }
    return false;
}

// Hard drop
function hardDrop() {
    while (movePiece(0, 1)) {}
    lockPiece();
    clearLines();
    spawnPiece();
}

// Game tick
function gameTick() {
    if (!gameRunning || gamePaused) return;
    
    if (!movePiece(0, 1)) {
        lockPiece();
        clearLines();
        if (!spawnPiece()) return;
    }
    
    render();
}

// Game over
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    saveHighScore();
    
    clearScreen();
    console.log(`
${COLORS.BRIGHT}\x1b[91m  ╔══════════════════════════════════════╗${COLORS.RESET}
${COLORS.BRIGHT}\x1b[91m  ║          GAME OVER! 💀               ║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[91m  ╠══════════════════════════════════════╣${COLORS.RESET}
${COLORS.BRIGHT}\x1b[91m  ║${COLORS.RESET}  Final Score: ${COLORS.BRIGHT_YELLOW || '\x1b[93m'}${score}${COLORS.RESET}                    ${COLORS.BRIGHT}\x1b[91m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[91m  ║${COLORS.RESET}  Lines Cleared: ${COLORS.GREEN || '\x1b[92m'}${lines}${COLORS.RESET}                  ${COLORS.BRIGHT}\x1b[91m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[91m  ║${COLORS.RESET}  Level Reached: ${COLORS.RED || '\x1b[91m'}${level}${COLORS.RESET}                  ${COLORS.BRIGHT}\x1b[91m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[91m  ╠══════════════════════════════════════╣${COLORS.RESET}
${COLORS.BRIGHT}\x1b[91m  ║${COLORS.RESET}  Press ${COLORS.BRIGHT}\x1b[92mR${COLORS.RESET} to restart                 ${COLORS.BRIGHT}\x1b[91m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[91m  ║${COLORS.RESET}  Press ${COLORS.BRIGHT}\x1b[93mQ${COLORS.RESET} to quit                    ${COLORS.BRIGHT}\x1b[91m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[91m  ╚══════════════════════════════════════╝${COLORS.RESET}
`);
}

// Initialize game
function initGame() {
    initBoard();
    score = 0;
    lines = 0;
    level = 1;
    nextPieceIndex = -1;
    gameRunning = true;
    gamePaused = false;
    spawnPiece();
}

// Handle input
function handleInput(key) {
    if (!gameRunning) {
        if (key.name === 'r' || key.name === 'R') {
            initGame();
            gameLoop = setInterval(gameTick, getSpeed());
            render();
        }
        return;
    }
    
    if (key.name === 'p' || key.name === 'P') {
        gamePaused = !gamePaused;
        render();
        return;
    }
    
    if (gamePaused) return;
    
    switch (key.name) {
        case 'left':
        case 'a':
            movePiece(-1, 0);
            break;
        case 'right':
        case 'd':
            movePiece(1, 0);
            break;
        case 'up':
        case 'w':
            rotatePiece();
            break;
        case 'down':
        case 's':
            if (!movePiece(0, 1)) {
                lockPiece();
                clearLines();
                spawnPiece();
            }
            break;
        case 'space':
            hardDrop();
            break;
        case 'q':
        case 'Q':
        case 'escape':
            quitGame();
            return;
    }
    
    render();
}

// Quit game
function quitGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    saveHighScore();
    showCursor();
    clearScreen();
    console.log(`${COLORS.BRIGHT}\x1b[96mThanks for playing Tetris! 🎮${COLORS.RESET}\n`);
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
${COLORS.BRIGHT}\x1b[96m  ╔══════════════════════════════════════╗${COLORS.RESET}
${COLORS.BRIGHT}\x1b[96m  ║        🎮 ASCII TETRIS 🎮            ║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[96m  ╠══════════════════════════════════════╣${COLORS.RESET}
${COLORS.BRIGHT}\x1b[96m  ║${COLORS.RESET}                                      ${COLORS.BRIGHT}\x1b[96m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[96m  ║${COLORS.RESET}  ${COLORS.BRIGHT}Controls:${COLORS.RESET}                          ${COLORS.BRIGHT}\x1b[96m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[96m  ║${COLORS.RESET}  • ←→ or A/D = Move left/right       ${COLORS.BRIGHT}\x1b[96m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[96m  ║${COLORS.RESET}  • ↑ or W = Rotate piece             ${COLORS.BRIGHT}\x1b[96m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[96m  ║${COLORS.RESET}  • ↓ or S = Soft drop (faster)       ${COLORS.BRIGHT}\x1b[96m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[96m  ║${COLORS.RESET}  • Space = Hard drop (instant)       ${COLORS.BRIGHT}\x1b[96m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[96m  ║${COLORS.RESET}  • P = Pause                         ${COLORS.BRIGHT}\x1b[96m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[96m  ║${COLORS.RESET}  • Q or ESC = Quit                   ${COLORS.BRIGHT}\x1b[96m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[96m  ║${COLORS.RESET}                                      ${COLORS.BRIGHT}\x1b[96m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[96m  ║${COLORS.RESET}  ${COLORS.BRIGHT}High Score:${COLORS.RESET} ${COLORS.CYAN || '\x1b[96m'}${highScore}${COLORS.RESET}                     ${COLORS.BRIGHT}\x1b[96m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[96m  ║${COLORS.RESET}                                      ${COLORS.BRIGHT}\x1b[96m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[96m  ╠══════════════════════════════════════╣${COLORS.RESET}
${COLORS.BRIGHT}\x1b[96m  ║${COLORS.RESET}     Press ${COLORS.BRIGHT}\x1b[92mANY KEY${COLORS.RESET} to start...         ${COLORS.BRIGHT}\x1b[96m║${COLORS.RESET}
${COLORS.BRIGHT}\x1b[96m  ╚══════════════════════════════════════╝${COLORS.RESET}
`);
    
    // Wait for any key to start
    process.stdin.once('keypress', () => {
        initGame();
        gameLoop = setInterval(gameTick, getSpeed());
        render();
    });
}

// Start game
main();
