# 🐍 Math Snake

A browser-based snake game that combines classic gameplay with multiplication practice. Built with TypeScript, Canvas API, and Vite for long-term maintainability.

## 🎮 Game Rules

- Use **WASD** keys to control the snake
- Eat apples to trigger math exercises (multiplication and division)
- **Correct answer**: +10 points, continue playing
- **Wrong answer**: -5 points, continue playing
- Avoid hitting walls or your own body
- Game pauses when math questions appear

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
math-snake/
├── src/
│   ├── core/           # Game engine (loop, state, input)
│   ├── entities/       # Game entities (Snake, Food)
│   ├── systems/        # Game systems (collision, math, score, rendering)
│   ├── ui/             # UI components (overlays, menus)
│   ├── config/         # Configuration constants
│   ├── types/          # TypeScript type definitions
│   ├── tests/          # Unit tests
│   ├── Game.ts         # Main game controller
│   ├── main.ts         # Entry point
│   └── style.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite & Vitest configuration
```

## 🎯 Controls

| Key | Action |
|-----|--------|
| **W** | Move Up |
| **A** | Move Left |
| **S** | Move Down |
| **D** | Move Right |
| **Space** | Start/Restart Game |

## 🏗️ Architecture

The game follows a modular architecture with clear separation of concerns:

- **Game Loop**: Fixed time-step updates using `requestAnimationFrame`
- **State Machine**: Clean state transitions (Menu → Playing → Math Question → Game Over)
- **Entity-Component**: Separate entities (Snake, Food) from systems (Collision, Rendering)
- **Observer Pattern**: Event-driven communication between systems
- **Dependency Injection**: All dependencies passed explicitly for testability

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed design documentation.

## 🛠️ Technology Stack

- **TypeScript**: Type-safe code with strict compiler settings
- **Vite**: Fast build tool with HMR
- **Canvas API**: High-performance game rendering
- **Vitest**: Modern testing framework
- **Vanilla JS**: No framework dependencies for maximum control

## ⚙️ Configuration

Game settings can be modified in `src/config/gameConfig.ts`:

```typescript
export const GAME_CONFIG = {
  GRID_WIDTH: 20,           // Grid columns
  GRID_HEIGHT: 20,          // Grid rows
  CELL_SIZE: 25,            // Cell size in pixels
  SNAKE_SPEED: 150,         // Speed in ms per move
  MATH_MIN: 1,              // Min number used in math exercises
  MATH_MAX: 10,             // Max number used in math exercises
  MATH_OPERATIONS: ['multiply', 'divide'], // Allowed operations
  CORRECT_POINTS: 10,       // Points for correct answer
  WRONG_PENALTY: 5,         // Points lost for wrong answer
  // ... more settings
};
```

## 🧩 Key Features

- **Type Safety**: Strict TypeScript configuration prevents runtime errors
- **Modular Design**: Each module has a single responsibility
- **Pure Functions**: Game logic uses pure functions for testability
- **Comprehensive Tests**: Unit tests for all core systems (>70% coverage)
- **Clean Code**: Consistent naming, clear structure, extensive comments
- **Maintainable**: Built to last for years with minimal technical debt

## 📊 Score System

- Starting score: **0 points**
- Correct answer: **+10 points**
- Wrong answer: **-5 points**
- Score cannot go below 0

## 🎨 Customization

### Change Colors

Edit `GAME_CONFIG.COLORS` in `src/config/gameConfig.ts`

### Adjust Difficulty

- Increase `SNAKE_SPEED` for faster gameplay
- Modify `MATH_MIN` and `MATH_MAX` for harder math problems
- Set `MATH_OPERATIONS` to `['multiply']` or `['divide']` to restrict to a single operation
- Adjust point values for different scoring balance

### Grid Size

Change `GRID_WIDTH` and `GRID_HEIGHT` for different play areas

## 🐛 Troubleshooting

**Game not starting?**
- Check browser console for errors
- Ensure canvas element exists in DOM
- Verify JavaScript is enabled

**Tests failing?**
- Run `npm install` to ensure dependencies are installed
- Check Node.js version (requires v18+)

**Build errors?**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript version compatibility

## 📝 License

MIT License - feel free to use and modify for your own projects

## 🤝 Contributing

This is an educational project. Feel free to fork and enhance it!

### Development Guidelines

1. Write tests for new features
2. Follow existing code style
3. Update documentation when adding features
4. Keep dependencies minimal

## 📚 Learning Resources

This project demonstrates:
- Game loop architecture
- State machine pattern
- Canvas rendering
- TypeScript best practices
- Modular code organization
- Unit testing strategies

Perfect for learning modern web game development!

---

**Enjoy the game and practice your multiplication and division tables!** 🎯🧮
