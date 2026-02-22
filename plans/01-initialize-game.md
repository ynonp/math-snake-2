Plan: Math Snake Game with TypeScript & Canvas
Overview: Build a browser-based snake game where eating apples triggers multiplication exercises (1-100). TypeScript + Vite ensures long-term maintainability with type safety, fast builds, and modern tooling. Canvas handles game rendering while a DOM overlay captures math answers. Game pauses during questions; correct answers earn +10 points, wrong answers deduct -5 points. Traditional snake rules: game over on wall/self-collision.

Key Decisions: TypeScript + Vite (maintainability), Canvas + DOM (performance), State Machine pattern (clean state transitions), modular architecture (ES6 modules with separation of concerns), Vitest for unit testing.

Steps

Project initialization

Run npm create vite@latest . -- --template vanilla-ts to scaffold TypeScript + Vite project
Configure tsconfig.json with strict mode for maximum type safety
Add Vitest: npm install -D vitest and configure in vite.config.ts
Create folder structure: src/core, src/entities, src/systems, src/utils, src/config, src/types, src/tests
Configuration setup - src/config/gameConfig.ts

Define all game constants: GRID_SIZE (20x20), CELL_SIZE (20px), SNAKE_SPEED (150ms per move), colors
Math configuration: MATH_MIN: 1, MATH_MAX: 10 (for 1-100 range: 10×10)
Scoring: CORRECT_POINTS: 10, WRONG_PENALTY: 5, STARTING_SCORE: 0
Controls: WASD key mappings
Type definitions - src/types/index.ts

Define core types: Position, Direction, GameState enum (MENU, PLAYING, PAUSED, MATH_QUESTION, GAME_OVER)
Entity interfaces: Snake, Food, MathQuestion
Event types for state transitions
Core game engine - src/core/GameLoop.ts

Implement game loop with requestAnimationFrame
Delta-time based updates for consistent speed across frame rates
Call update() and render() methods each frame
Handle state-based loop behavior (don't update snake in MATH_QUESTION state)
State management - src/core/StateManager.ts

Implement State Machine pattern with transitions: MENU → PLAYING → MATH_QUESTION → PLAYING → GAME_OVER
State-specific behaviors: MATH_QUESTION pauses game logic, PLAYING processes input
Observer pattern for state change notifications
Input handling - src/core/InputHandler.ts

Capture WASD keyboard input
Queue direction changes (prevent reversing into self)
State-aware: route input to game controls in PLAYING state, ignore during MATH_QUESTION
Debounce to prevent multiple inputs per frame
Snake entity - src/entities/Snake.ts

Snake body as array of Position[]
Methods: move(), grow(), checkSelfCollision(), changeDirection()
Start with length 3 at center of grid
Movement logic: add new head, remove tail (or keep tail when growing)
Food entity - src/entities/Food.ts

Random position generation avoiding snake body
Respawn logic after being eaten
No expiration or movement (static apple)
Collision detection - src/systems/CollisionSystem.ts

Check snake-food collision (head matches food position)
Check wall collision (head x/y outside grid bounds)
Check self-collision (head position in body array)
Pure functions for testability: checkCollision(snake, food, gridSize): CollisionResult
Math exercise system - src/systems/MathSystem.ts

Generate multiplication problems: two random numbers 1-10
Store current question: { num1: number, num2: number, correctAnswer: number }
Validate user input: checkAnswer(userInput: string): boolean
Unit tests for validation edge cases (non-numeric input, empty, etc.)
Score management - src/systems/ScoreSystem.ts

Track current score (starts at 0)
Methods: addCorrectPoints(), deductWrongPoints(), getScore(), resetScore()
Prevent negative scores (clamp at 0)
Pure functions for testing: calculateScore(current, delta): number
Canvas renderer - src/systems/Renderer.ts

Initialize canvas, get 2D context
render() method: clear canvas, draw grid, draw snake (head different color), draw food
Coordinate conversion: grid position → pixel position
Draw score display in corner
State-aware rendering: dim background during MATH_QUESTION state
UI overlay - src/ui/MathQuestionOverlay.ts

DOM element with semi-transparent backdrop
Show math question: "What is 7 × 8?"
Number input field (type="number") for answer
Submit button or Enter key to submit
Show feedback: "Correct! +10 points" or "Wrong! -5 points"
Auto-hide after 1.5 seconds, return to PLAYING state
Menu screen - src/ui/MenuScreen.ts

Simple start screen with game title, instructions, "Press SPACE to Start"
Instructions: WASD controls, math exercise on eating apples, game over on collision
Keyboard listener for SPACE to transition MENU → PLAYING
Game over screen - src/ui/GameOverScreen.ts

Display final score
"Game Over" message with reason (hit wall / hit self)
"Press SPACE to Restart" functionality
Reset game state and transition to MENU
Main game controller - src/Game.ts

Orchestrate all systems: instantiate StateManager, InputHandler, Snake, Food, Renderer, etc.
Wire up event listeners: collision → trigger math question, answer → update score
Handle game flow: apple eaten → pause → show math → process answer → resume/gameOver
Dependency injection: pass config and canvas to constructors
Entry point - src/main.ts

Load config
Create canvas element in DOM (800×600px)
Instantiate Game with canvas
Call game.start() to begin loop
Add basic CSS for canvas centering and overlay styling
HTML structure - index.html

Canvas element with id gameCanvas
Container divs for overlays (math question, menu, game over)
Load main.ts as module script
Meta tags for responsive viewport (even without mobile support)
CSS styling - src/style.css

Center canvas on page
Style overlays: backdrop-filter blur, centered content, styled input field
Retro/modern game aesthetic with clean fonts
Responsive layout (desktop-focused but scalable)
Unit tests - src/tests/

Test MathSystem: question generation, answer validation, edge cases
Test ScoreSystem: point calculations, negative score prevention
Test CollisionSystem: wall, self, food collision detection
Test Snake: movement, growth, direction changes
Mock requestAnimationFrame for game loop tests
Run with npm test, configure coverage threshold (70%+)
Documentation - Root level files

README.md: Setup instructions (npm install, npm run dev, npm test), game rules, controls
ARCHITECTURE.md: System diagram, module responsibilities, state flow, design patterns used
Add JSDoc comments to all public methods and classes
Verification

Development: Run npm run dev, open browser to localhost, verify game loads
Manual testing: Play game, eat apples, verify math questions appear, test both correct/wrong answers, verify scoring, crash into wall/self to test game over
Unit tests: Run npm test, verify all tests pass with >70% coverage
Browser compatibility: Test in Chrome, Firefox, Safari (modern versions only)
Code quality: Run tsc --noEmit to verify no TypeScript errors
Build: Run npm run build, verify production bundle works
Decisions

TypeScript over JavaScript: Type safety prevents bugs, better IDE support, essential for long-term maintenance
Vite over Webpack/no build tools: Modern, fast, minimal config, industry standard for new projects
Canvas over DOM manipulation: Better performance, industry standard for games, smoother animations
DOM overlay for math input: Canvas can't handle native text input; hybrid approach combines performance with UX
State Machine pattern: Clean separation of game states, easy to reason about transitions
Modular architecture: ES6 modules with clear separation of concerns (entities, systems, core) prevents monolithic code
No localStorage persistence: Simplicity first; feature can be added later without architectural changes
Fixed difficulty: All multiplications 1-10 (results 1-100); progressive difficulty deferred to future iteration
Vitest over Jest: Better Vite integration, faster, modern API
WASD only: User preference; arrow keys support trivial to add later
