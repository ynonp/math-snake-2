# Architecture Documentation

## Overview

Math Snake is built with a modular architecture emphasizing separation of concerns, testability, and long-term maintainability. The codebase follows industry best practices including SOLID principles, design patterns, and clean code guidelines.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Main Game                          │
│  (Orchestrates all systems and manages game flow)      │
└──────────────┬──────────────────────────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
┌─────▼──────┐   ┌─────▼──────┐
│   Core     │   │  Entities  │
│  Systems   │   │ (Snake,    │
│            │   │  Food)     │
└─────┬──────┘   └────────────┘
      │
      │
┌─────▼──────────────────────────────┐
│         Game Systems               │
│  ┌──────────┬──────────────────┐  │
│  │Collision │  Math  │ Score   │  │
│  │Renderer  │  UI    │         │  │
│  └──────────┴──────────────────┘  │
└────────────────────────────────────┘
```

## Module Breakdown

### Core Systems (`src/core/`)

#### GameLoop.ts
**Responsibility**: Manages the main game loop with fixed time-step updates

**Key Features**:
- Uses `requestAnimationFrame` for smooth rendering
- Fixed time-step update for consistent game logic across frame rates
- Accumulator pattern for deterministic physics
- Separate update and render callbacks

**Design Pattern**: Game Loop Pattern

**Dependencies**: None (pure game loop implementation)

```typescript
// Pseudocode flow:
while (running) {
  deltaTime = currentTime - lastTime
  accumulator += deltaTime
  
  while (accumulator >= fixedTimeStep) {
    update(fixedTimeStep)
    accumulator -= fixedTimeStep
  }
  
  render()
}
```

---

#### StateManager.ts
**Responsibility**: Manages game state transitions using State Machine pattern

**States**:
- `MENU`: Initial screen, waiting to start
- `PLAYING`: Active gameplay
- `MATH_QUESTION`: Paused for math exercise
- `GAME_OVER`: Game ended

**Design Pattern**: State Machine + Observer Pattern

**Key Features**:
- Prevents invalid state transitions
- Notifies listeners on state changes
- Type-safe state management

**State Transitions**:
```
MENU → PLAYING → MATH_QUESTION → PLAYING → GAME_OVER
  ↑                                            ↓
  └────────────────────────────────────────────┘
           (restart)
```

---

#### InputHandler.ts
**Responsibility**: Captures and routes keyboard input based on game state

**Features**:
- State-aware input routing
- Direction queueing (prevents 180° turns)
- Debouncing to prevent multiple inputs per frame
- Separate handling for game controls vs. menu actions

**Design Pattern**: Command Pattern (implicitly)

**Input Flow**:
```
KeyboardEvent → InputHandler → 
  ├─ MENU state → Start callback
  ├─ PLAYING state → Direction change callback
  └─ MATH_QUESTION state → Ignored (handled by UI)
```

---

### Entities (`src/entities/`)

#### Snake.ts
**Responsibility**: Manages snake body, movement, and self-collision

**Data Structure**: Array of positions (head at index 0)

**Key Methods**:
- `move()`: Move snake in current direction
- `grow()`: Mark snake to grow on next move
- `checkSelfCollision()`: Detect head-body collision
- `reset()`: Return to initial state

**Movement Algorithm**:
```typescript
1. Calculate new head position based on direction
2. Add new head to front of body array
3. If not growing, remove tail
4. If growing, keep tail (reset grow flag)
```

---

#### Food.ts
**Responsibility**: Manages food position and spawning

**Features**:
- Random position generation
- Collision-free spawning (avoids snake body)
- Bounded retries to prevent infinite loops

**Spawn Algorithm**:
```typescript
do {
  position = randomPosition()
  attempts++
} while (overlapsSnake && attempts < maxAttempts)
```

---

### Systems (`src/systems/`)

#### CollisionSystem.ts
**Responsibility**: Pure functions for collision detection

**Design**: Functional programming approach (no state, pure functions)

**Collision Types**:
1. **Food Collision**: Snake head == food position
2. **Wall Collision**: Head outside grid bounds
3. **Self Collision**: Head overlaps any body segment

**Why Pure Functions?**
- Easier to test (no mocking required)
- No side effects
- Deterministic results
- Composable

---

#### MathSystem.ts
**Responsibility**: Generate and validate multiplication and division exercises

**Features**:
- Configurable difficulty range (1-10 by default)
- Configurable allowed operations (`MATH_OPERATIONS`: `'multiply'` and/or `'divide'`)
- Answer validation with type checking
- Current question state management

**Math Generation**:
```typescript
// Multiplication
num1 = random(MATH_MIN, MATH_MAX)
num2 = random(MATH_MIN, MATH_MAX)
answer = num1 × num2
// Range: 1×1=1 to 10×10=100

// Division (always integer result)
divisor  = random(MATH_MIN, MATH_MAX)
quotient = random(MATH_MIN, MATH_MAX)
dividend = divisor × quotient   // exact division guaranteed
answer = quotient
```

---

#### ScoreSystem.ts
**Responsibility**: Track and update player score

**Design Pattern**: Observer Pattern

**Features**:
- Score change notifications
- Prevents negative scores
- Pure calculation functions
- Multiple listener support

**Events**:
```typescript
interface ScoreChangeEvent {
  oldScore: number
  newScore: number
  delta: number
}
```

---

#### Renderer.ts
**Responsibility**: Canvas-based game rendering

**Rendering Pipeline**:
```
1. Clear canvas
2. Draw grid
3. Draw snake (head with eyes, body segments)
4. Draw food (apple with stem)
5. Optional: Dim overlay
```

**Design Decisions**:
- Canvas API for performance
- Pixel-perfect rendering
- Coordinate conversion (grid → pixels)
- Visual distinction (head has eyes)

---

### UI Components (`src/ui/`)

#### UIManager.ts
**Responsibility**: Manage all DOM-based UI overlays

**Screens Managed**:
- Menu screen
- Math question overlay
- Game over screen
- Score display

**Interaction Pattern**:
```
User Input → UI Event → Callback → Game Logic → UI Update
```

**Features**:
- Auto-focus input field
- Feedback animations
- Timed auto-hide
- State-synchronized visibility

---

### Main Game Controller (`src/Game.ts`)

**Responsibility**: Orchestrate all systems and manage game flow

**Initialization Flow**:
```typescript
1. Create core systems (StateManager, InputHandler, GameLoop)
2. Create entities (Snake, Food)
3. Create game systems (Renderer, MathSystem, ScoreSystem)
4. Create UI manager
5. Wire up event handlers
6. Start game loop
```

**Event Flow Example (Food Collision)**:
```
Snake moves → Collision detected → 
  ├─ Snake grows
  ├─ Math question generated
  ├─ New food spawned
  ├─ State → MATH_QUESTION
  └─ UI shows question overlay

User submits answer →
  ├─ Answer validated
  ├─ Score updated (±points)
  ├─ UI shows feedback
  ├─ Wait (feedback duration)
  └─ State → PLAYING
```

---

## Design Patterns Used

### 1. **Game Loop Pattern**
- **Where**: `GameLoop.ts`
- **Why**: Standard pattern for game engines
- **Benefit**: Smooth, frame-rate-independent gameplay

### 2. **State Machine Pattern**
- **Where**: `StateManager.ts`
- **Why**: Clean state transitions, predictable behavior
- **Benefit**: Easy to reason about, prevents invalid states

### 3. **Observer Pattern**
- **Where**: `StateManager`, `ScoreSystem`
- **Why**: Decouple event sources from handlers
- **Benefit**: Flexible, extensible event system

### 4. **Dependency Injection**
- **Where**: All classes (constructor parameters)
- **Why**: Testability, loose coupling
- **Benefit**: Easy to mock, swap implementations

### 5. **Strategy Pattern** (implicit)
- **Where**: State-specific behaviors
- **Why**: Different logic per game state
- **Benefit**: Cleaner than large if/else blocks

### 6. **Factory Pattern** (minimal)
- **Where**: Entity initialization
- **Why**: Consistent object creation
- **Benefit**: Encapsulated construction logic

---

## Data Flow

### Typical Game Loop Iteration

```
┌─────────────────────────────────────────────┐
│ 1. GameLoop fires update(deltaTime)        │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ 2. Game.update() checks state               │
│    If PLAYING: continue, else skip          │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ 3. InputHandler updates direction           │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ 4. Check move timer                         │
│    accumulator >= SNAKE_SPEED?              │
└──────────────┬──────────────────────────────┘
               │ YES
               ▼
┌─────────────────────────────────────────────┐
│ 5. Snake.move()                             │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ 6. CollisionSystem.checkCollisions()        │
└──────────────┬──────────────────────────────┘
               │
         ┌─────┴─────┬──────────┬─────────┐
         │           │          │         │
         ▼           ▼          ▼         ▼
      Food       Wall       Self      None
         │           │          │         │
         ▼           ▼          ▼         └──> Continue
  Show Math    Game Over  Game Over
  Question
         │
         ▼
  Wait for answer → Update score → Resume
```

---

## Testing Strategy

### Test Coverage

| Module | Coverage Target | Test Type |
|--------|----------------|-----------|
| CollisionSystem | 100% | Unit |
| MathSystem | 100% | Unit |
| ScoreSystem | 100% | Unit |
| Snake | 90% | Unit |
| StateManager | 100% | Unit |
| Food | 80% | Unit |
| Game | 60% | Integration |
| UI | 50% | Integration |

### Testing Approach

**Unit Tests**: Pure functions, classes with mocked dependencies
- Focus: Business logic correctness
- Tools: Vitest, vi.fn() for mocks

**Integration Tests** (future):
- Focus: System interactions
- Example: Input → State change → Render

**E2E Tests** (future, optional):
- Focus: Full game playthrough
- Tools: Playwright or Cypress

---

## Configuration Management

### Centralized Configuration
All game constants in `src/config/gameConfig.ts`

**Benefits**:
- Single source of truth
- Easy tuning without code changes
- Type-safe configuration object

**Configuration Categories**:
1. **Grid**: Size, cell dimensions
2. **Gameplay**: Speed, initial snake length
3. **Math**: Difficulty range
4. **Scoring**: Points, penalties
5. **Controls**: Key mappings
6. **Visual**: Colors, styles

---

## Extension Points

The architecture is designed for easy extension:

### Adding New Features

**Power-ups** (e.g., speed boost):
1. Create `PowerUp` entity in `entities/`
2. Add power-up collision check
3. Update `ScoreSystem` or create `PowerUpSystem`
4. Render in `Renderer.ts`

**Difficulty Progression**:
1. Add difficulty state to `Game.ts`
2. Modify `SNAKE_SPEED` based on score
3. Adjust `MATH_MIN/MAX` based on level

**Sound Effects**:
1. Create `SoundSystem.ts` in `systems/`
2. Subscribe to game events (collision, score change)
3. Play sounds on events

**Leaderboard**:
1. Create `LeaderboardSystem.ts`
2. Use localStorage or API for persistence
3. Add UI in `UIManager.ts`

---

## Performance Considerations

### Optimizations Implemented

1. **Fixed Time-Step**: Consistent performance across devices
2. **Pure Functions**: Easier for JS engines to optimize
3. **Minimal DOM Access**: UI updates only on state changes
4. **Canvas Rendering**: Hardware-accelerated graphics
5. **Event Delegation**: Single keyboard listener

### Performance Budget

- Target: 60 FPS (16.67ms per frame)
- Update: <2ms
- Render: <5ms
- Headroom: ~9ms for browser overhead

---

## Security & Safety

### Input Validation
- Math answers parsed as integers only
- Non-numeric input rejected
- Boundary checking on all grid positions

### Error Handling
- Canvas context null checks
- DOM element existence validation
- Max retry limits (food spawning)

### Type Safety
- Strict TypeScript mode enabled
- `noImplicitAny`, `strictNullChecks`
- Comprehensive type definitions

---

## Future Improvements

### Planned Enhancements
1. Add difficulty levels (easy/medium/hard)
2. Progressive speed increase
3. Additional math operations (+, -)
4. Mobile touch support
5. Sound effects and music
6. High score persistence (localStorage)
7. Animations and particle effects

### Architectural Improvements
1. Consider ECS framework for complex entities
2. Add service layer for future backend integration
3. Implement replay system using Command pattern
4. Add debug mode with visualization

---

## Conclusion

This architecture prioritizes:
- **Maintainability**: Clear structure, modular design
- **Testability**: Dependency injection, pure functions
- **Extensibility**: Easy to add features without rewriting
- **Performance**: Optimized game loop, minimal overhead
- **Type Safety**: Strict TypeScript prevents bugs

The result is a codebase built to last for years with minimal technical debt.
