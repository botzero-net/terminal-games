# 🎮 Mini Games Portfolio

A collection of 6 addictive, self-contained mini games built with JavaScript. Play in your terminal or browser!

## 📦 Installation

```bash
# Clone or download this repository
cd games

# Install dependencies (for terminal games)
npm install
```

## 🎯 Games Included

### 🐍 Game 1: Terminal Snake
**File:** `snake.js`  
**Platform:** Terminal (Node.js)

The classic snake game with colorful ASCII graphics!

**Features:**
- Smooth keyboard controls (WASD or Arrow keys)
- Score tracking with persistent high score
- Speed increases as you eat more
- Pause functionality
- Beautiful box-drawing characters

**How to Run:**
```bash
node snake.js
# or
npm run snake
```

**Controls:**
- `WASD` or `Arrow Keys` - Move the snake
- `P` - Pause game
- `Q` or `ESC` - Quit
- `R` - Restart (after game over)

---

### 🎮 Game 2: ASCII Tetris
**File:** `tetris.js`  
**Platform:** Terminal (Node.js)

A fully-featured Tetris clone with 7 classic pieces, rotation, and line clearing!

**Features:**
- All 7 tetromino pieces (I, O, T, S, Z, J, L)
- Piece rotation with wall kicks
- Soft drop and hard drop
- Next piece preview
- Scoring system with level progression
- Speed increases each level
- Persistent high score

**How to Run:**
```bash
node tetris.js
# or
npm run tetris
```

**Controls:**
- `← →` or `A D` - Move piece
- `↑` or `W` - Rotate piece
- `↓` or `S` - Soft drop (faster)
- `Space` - Hard drop (instant)
- `P` - Pause
- `Q` or `ESC` - Quit

---

### 🤖 Game 3: Number Guessing AI
**File:** `guess-number.html`  
**Platform:** Web Browser

Think of a number between 1-100 and watch the AI guess it using binary search!

**Features:**
- AI uses optimal binary search algorithm
- Shows reasoning process in real-time
- Educational - learn how binary search works
- Guaranteed to find number in 7 guesses or less
- Beautiful gradient UI

**How to Run:**
```bash
# Open in any web browser
open guess-number.html
# or
firefox guess-number.html
# or simply double-click the file
```

**How to Play:**
1. Think of a number between 1 and 100
2. The AI will guess your number
3. Tell it if the guess is Too High, Too Low, or Correct
4. Watch the AI thinking process on the right!

---

### ⚡ Game 4: Reaction Time Tester
**File:** `reaction-test.html`  
**Platform:** Web Browser

Test your reflexes and see how you compare to human averages!

**Features:**
- Measures reaction time in milliseconds
- Shows percentile ranking vs human averages
- Tracks best time, average, and history
- Visual percentile chart
- Keyboard support (Space bar)
- Prevents false starts

**How to Run:**
```bash
open reaction-test.html
```

**How to Play:**
1. Click the box or press Space to start
2. Wait for it to turn **BLUE**
3. Click immediately when it changes!
4. See your reaction time and percentile

**Reaction Time Scale:**
- 0-150ms: Superhuman (top 1%)
- 150-200ms: Excellent (top 10%)
- 200-250ms: Good (above average)
- 250-300ms: Average (most people)
- 300-400ms: Below average
- 400ms+: You might be tired 😉

---

### 🧠 Game 5: Memory Pattern Game
**File:** `memory-game.html`  
**Platform:** Web Browser

A Simon Says style memory game with sound and visual feedback!

**Features:**
- Classic 4-color pattern game
- Sound feedback using Web Audio API
- Visual flash effects
- Progressive difficulty (speeds up)
- Score tracking with persistent high score
- Difficulty indicator
- Responsive design

**How to Run:**
```bash
open memory-game.html
```

**How to Play:**
1. Press **Start** to begin
2. Watch the pattern of colors
3. Repeat the pattern by clicking colors
4. Each round adds one more step
5. How far can you go?

**Tips:**
- Take your time - no time limit
- Try to chunk the pattern (group colors)
- Say the colors out loud to help remember

---

### ⌨️ Game 6: Typing Speed Test
**File:** `typing-test.html`  
**Platform:** Web Browser

Test your typing speed (WPM) and accuracy with real-time feedback!

**Features:**
- Real-time WPM calculation
- Character-by-character accuracy tracking
- Multiple text passages
- Visual progress bar
- Mistake highlighting
- Keyboard shortcuts (Tab+Enter to restart)
- Performance rating system

**How to Run:**
```bash
open typing-test.html
```

**How to Play:**
1. Click "New Test" or press any key to begin
2. Type the text shown as fast and accurately as possible
3. Your WPM updates in real-time
4. Complete the text to see final results

**Typing Speed Scale:**
- 0-20 WPM: Beginner 🌱
- 20-40 WPM: Average 📈
- 40-60 WPM: Good ⚡
- 60-80 WPM: Professional 🚀
- 80+ WPM: Expert 👑

---

## 🛠️ Technical Details

### Terminal Games Requirements
- Node.js 14.0 or higher
- `keypress` package (installed via npm)

### Browser Games
- All modern browsers supported
- No installation required
- Works offline
- Uses localStorage for high score persistence

## 📁 File Structure

```
games/
├── snake.js              # Terminal Snake game
├── tetris.js             # Terminal Tetris game
├── guess-number.html     # Number Guessing AI
├── reaction-test.html    # Reaction Time Tester
├── memory-game.html      # Memory Pattern Game
├── typing-test.html      # Typing Speed Test
├── package.json          # Node.js dependencies
└── README.md            # This file
```

## 🎨 Design Philosophy

Each game follows these principles:
- ✅ **Self-contained** - Single file per game
- ✅ **Easy to run** - No complex setup
- ✅ **Visually appealing** - Even in terminal!
- ✅ **Addictive gameplay** - "Just one more try"
- ✅ **Well documented** - Clear instructions included

## 🏆 High Scores

Terminal games save high scores to hidden files:
- `.snake_highscore`
- `.tetris_highscore`

Browser games use localStorage for persistence.

## 🤝 Contributing

Feel free to fork and improve! Some ideas:
- Add more color themes
- Implement multiplayer
- Create additional game modes
- Add sound effects to terminal games

## 📜 License

MIT License - feel free to use these games anywhere!

## 🎉 Enjoy!

Challenge your friends and see who gets the highest scores! 🏆
