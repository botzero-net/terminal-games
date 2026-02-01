# 🎮 Terminal Games Collection

> A curated collection of addictive mini games that run in your terminal and browser. Built for developers who need a break, teams who want icebreakers, and anyone who appreciates clean, well-crafted code.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0-brightgreen.svg)

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/botzero-net/terminal-games.git
cd terminal-games

# Install dependencies (for terminal games)
npm install

# Play a game
node snake.js
```

## 🎯 What's Included

### Terminal Games (Node.js)

#### 🐍 Snake
The classic. Eat apples, grow longer, don't hit walls or yourself.

```bash
node snake.js
```

**Controls:**
- `WASD` or Arrow Keys - Move
- `P` - Pause
- `Q` or `ESC` - Quit

**Features:**
- Colorful ASCII graphics
- Score tracking with high score persistence
- Increasing difficulty as you grow
- Smooth terminal rendering

**Screenshot:**
```
Score: 42  High Score: 128

╔══════════════════════════════════════╗
║                                      ║
║     🍎                               ║
║            ▓▓▓▓▓▓                  ║
║            ▓                        ║
║            ▓                        ║
║            ▓                        ║
║            ▓                        ║
║                                      ║
╚══════════════════════════════════════╝
```

---

#### 🧱 Tetris
The Soviet mind-bender that defined a genre. Clear lines, survive as long as you can.

```bash
node tetris.js
```

**Controls:**
- `← →` - Move piece
- `↑` or `Z` - Rotate
- `↓` - Soft drop
- `Space` - Hard drop
- `P` - Pause
- `Q` - Quit

**Features:**
- All 7 classic tetrominoes
- Next piece preview
- Score, lines, level tracking
- Increasing speed per level
- Colorful block rendering

---

### Browser Games (HTML/JavaScript)

Open these directly in your browser - no server needed!

#### 🤖 Guess Number AI
Think of a number between 1 and 100. The AI will guess it using binary search, showing its reasoning process.

**Why it's cool:**
- Watch AI logic in real-time
- Educational (demonstrates binary search)
- Surprisingly addictive

**How to play:**
1. Open `guess-number.html` in your browser
2. Think of a number (1-100)
3. Click "Higher" or "Lower" based on AI guesses
4. See how few guesses it takes!

---

#### ⚡ Reaction Time Test
Test your reflexes. Click when the screen changes from red to green.

**Features:**
- Measures reaction time in milliseconds
- Compares to human averages (shows your percentile)
- Tracks your best times
- Anti-cheat (clicking early penalizes you)

**Why it matters:**
Reaction time correlates with cognitive function. Track yours over time!

---

#### 🧠 Memory Pattern Game
Simon Says style pattern repetition. The pattern gets longer each round.

**Features:**
- Visual and audio feedback
- Progressive difficulty
- Score tracking
- Mobile-friendly

**How to play:**
1. Watch the pattern
2. Repeat it by clicking the colored buttons
3. Survive as many rounds as possible

---

#### ⌨️ Typing Speed Test
Measure your WPM (words per minute) and accuracy with real-time stats.

**Features:**
- Multiple passages (tech, literature, code)
- Real-time WPM calculation
- Accuracy percentage
- Error highlighting
- Mobile-responsive

**Why it matters:**
Typing speed affects developer productivity. 60+ WPM is considered professional level.

---

## 📦 Installation

### Prerequisites
- Node.js 14+ (for terminal games)
- Modern web browser (for HTML games)

### Setup
```bash
# Clone repository
git clone https://github.com/botzero-net/terminal-games.git

# Enter directory
cd terminal-games

# Install dependencies (terminal games only)
npm install
```

## 🎮 Usage

### Terminal Games
```bash
# Snake
node snake.js

# Tetris  
node tetris.js
```

### Browser Games
Simply open the HTML files in your browser:
```bash
# On macOS
open guess-number.html

# On Linux
xdg-open guess-number.html

# On Windows
start guess-number.html
```

Or serve them locally:
```bash
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## 🛠️ Technical Details

### Terminal Games
- **Library:** `keypress` for keyboard input
- **Rendering:** ANSI escape codes for colors and cursor control
- **State Management:** Simple game loops with setInterval

### Browser Games
- **Pure JavaScript** - no frameworks, no dependencies
- **Canvas API** for graphics where needed
- **Web Audio API** for sound effects
- **CSS3** for styling and animations

## 🎯 Why These Games?

### For Developers
- **Quick breaks:** 5-minute games perfect for Pomodoro breaks
- **Terminal-based:** Stay in your workflow
- **Clean code:** Read the source, learn from it

### For Teams
- **Icebreakers:** Start meetings with a quick reaction time competition
- **Team building:** Tetris tournaments, typing races
- **Interview tool:** See how candidates think (Guess Number AI)

### For Learning
- **Binary search:** Visualized in Guess Number AI
- **Event loops:** Terminal games demonstrate async patterns
- **Canvas API:** Browser games show HTML5 capabilities

## 🔮 Future Plans

### Short Term
- [ ] Add sound effects to terminal games (using `play-sound`)
- [ ] Multiplayer Snake (WebSocket)
- [ ] High score server (REST API)
- [ ] Mobile app wrapper (React Native)

### Long Term
- [ ] 20+ game collection
- [ ] Tournament mode
- [ ] AI opponents for all games
- [ ] VR versions (why not?)

## 🤝 Contributing

Found a bug? Want to add a game?

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-game`)
3. Commit your changes (`git commit -am 'Add amazing game'`)
4. Push to the branch (`git push origin feature/amazing-game`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- Snake and Tetris designs inspired by classic implementations
- ASCII art rendering techniques from [ttygames](https://ttygames.wordpress.com/)
- Color schemes optimized for accessibility

---

**Made with 💜 by developers, for developers.**

*Star ⭐ this repo if you enjoy the games!*
