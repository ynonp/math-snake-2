# Math Snake Project Guidelines

## Project Overview

Math Snake is a browser-based educational game combining classic Snake gameplay with multiplication exercises. Built with TypeScript, Vite, and Canvas API, it pauses when the snake eats food to present math questions (1-10 multiplication). Players earn +10 points for correct answers, lose -5 for wrong answers, and game ends on wall/self-collision.

## Architecture

**Core Pattern**: State Machine with Observer pattern
- Five states: `MENU` → `PLAYING` → `MATH_QUESTION` → `PLAYING` → `GAME_OVER`
- [StateManager](src/core/StateManager.ts) manages transitions and notifies listeners
- [GameLoop](src/core/GameLoop.ts) uses `requestAnimationFrame` with fixed time step (60 FPS)
- During `MATH_QUESTION` state, game logic pauses but rendering continues

**Module Structure**:
- `core/`: Game loop, state management, input handling
- `entities/`: Snake and Food classes with encapsulated behavior
- `systems/`: Pure collision detection, math generation, rendering, scoring
- `config/`: Single source of truth for all game constants ([gameConfig.ts](src/config/gameConfig.ts))
- `types/`: Shared TypeScript enums, interfaces ([index.ts](src/types/index.ts))
- `ui/`: DOM overlay management for math questions and screens

**Key Design Decisions**:
- Canvas for game rendering, DOM overlay for user input (hybrid approach)
- Entity methods mutate state; system functions are pure for testability
- No game framework—vanilla TypeScript with ES6 modules

## Code Style

Reference implementation: [Snake.ts](src/entities/Snake.ts), [StateManager.ts](src/core/StateManager.ts)

Don't put function comment unless it adds something to the function name and parameters (ie when the comment is obvious)

**TypeScript Standards**:
- **Strict mode enabled**: All compiler strictness flags on (see [tsconfig.json](tsconfig.json))
- **TSDoc comments**: Required for all exported classes, methods, interfaces
- **Visibility**: Explicit `private`/`public` modifiers; prefix private methods with `private`
- **Types over any**: Never use `any`; leverage `noUncheckedIndexedAccess` for array safety
- **Readonly configs**: Mark config objects with `as const` (see [gameConfig.ts](src/config/gameConfig.ts))

**Naming Conventions**:
- Enums: `PascalCase` with UPPER_CASE values (`GameState.PLAYING`)
- Interfaces: `PascalCase` (`Position`, `MathQuestion`)
- Classes: `PascalCase` (`Snake`, `StateManager`)
- Files: Match class/export name exactly

**Patterns**:
- Use enums for fixed constants (Direction, GameState)
- Use interfaces for object shapes
- Factory/initialization methods: `private initializeBody()` pattern
- State queries: Provide `is(state)`, `getState()` methods on managers
- Callbacks: Type with specific function types (`DirectionChangeCallback`)

## Build and Test

**Development**:
```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # TypeScript compile + production build
npm run preview      # Preview production build
```

**Testing** (Vitest with jsdom):
```bash
npm test             # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

Tests go in [src/tests/](src/tests/) (currently empty). Use descriptive test names: `should prevent 180-degree turn when changing direction`.

## Project Conventions

**Configuration Pattern**:
- All magic numbers live in `GAME_CONFIG` constant ([gameConfig.ts](src/config/gameConfig.ts))
- Access via `import { GAME_CONFIG } from '../config/gameConfig'`
- Never hardcode grid size, colors, speeds, or scoring values

**State Management**:
- Check state before actions: `if (!this.stateManager.is(GameState.PLAYING)) return`
- Subscribe to changes: `stateManager.onStateChange((event) => {...})`
- State transitions trigger side effects (see [InputHandler](src/core/InputHandler.ts#L40))

**Position & Grid**:
- Grid coordinates are 0-indexed: `(0,0)` to `(GRID_WIDTH-1, GRID_HEIGHT-1)`
- Position interface: `{ x: number, y: number }` ([types/index.ts](src/types/index.ts))
- Collision checks compare exact coordinates: `pos1.x === pos2.x && pos1.y === pos2.y`

**Direction Handling Special Case**:
- Must prevent 180-degree turns (snake can't reverse into itself)
- See `isValidDirectionChange()` in [InputHandler](src/core/InputHandler.ts#L75) for reference
- Maintain `currentDirection` and `nextDirection` queue

**Pure Functions for Systems**:
- Collision, score calculation should be pure functions returning results
- Testable without instantiating game state
- Example: `checkCollision(snake, food, gridSize): CollisionResult`

**Event Listener Cleanup**:
- Arrow functions for class methods used as listeners (`private handleKeyDown = (event) => {...}`)
- Prevents `this` binding issues and allows cleanup

## Integration Points

**Canvas Rendering**:
- Get context once: `canvas.getContext('2d')!`
- Clear before each render: `ctx.clearRect(0, 0, width, height)`
- Convert grid to pixels: `x * CELL_SIZE`, `y * CELL_SIZE`

**DOM Overlays**:
- Use `classList.add/remove('hidden')` for show/hide
- Math input should auto-focus when overlay appears
- Feedback displays briefly before hiding (controlled by `FEEDBACK_DURATION`)

**No External Game Dependencies**:
- No Phaser, PixiJS, or game frameworks
- Direct Canvas API manipulation
- DOM for UI overlays

## Development Workflow

**Adding New Features**:
1. Update types in [types/index.ts](src/types/index.ts) if needed
2. Add constants to [gameConfig.ts](src/config/gameConfig.ts)
3. Implement entity/system logic
4. Add TSDoc comments
5. Write tests in `src/tests/`
6. Ensure strict TypeScript passes: `npm run build`

**Current Status**:
- Core architecture in place (game loop, state machine, input, entities)
- Systems partially implemented (check [src/systems/](src/systems/))
- No tests written yet (tests directory empty)
- Follow patterns in existing files when extending functionality
