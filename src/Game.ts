/**
 * Main Game Controller
 * Orchestrates all game systems and manages game flow
 */

import { GameLoop } from './core/GameLoop';
import { StateManager } from './core/StateManager';
import { InputHandler } from './core/InputHandler';
import { ThemeManager } from './core/ThemeManager';
import { Snake } from './entities/Snake';
import { Food } from './entities/Food';
import { Renderer } from './systems/Renderer';
import { MathSystem } from './systems/MathSystem';
import { ScoreSystem } from './systems/ScoreSystem';
import { UIManager } from './ui/UIManager';
import { checkCollisions } from './systems/CollisionSystem';
import { GameState, GameOverReason } from './types';
import { GAME_CONFIG } from './config/gameConfig';

export class Game {
  // Core systems
  private gameLoop: GameLoop;
  private stateManager: StateManager;
  private inputHandler: InputHandler;
  private themeManager: ThemeManager;
  
  // Entities
  private snake: Snake;
  private food: Food;
  
  // Systems
  private renderer: Renderer;
  private mathSystem: MathSystem;
  private scoreSystem: ScoreSystem;
  private uiManager: UIManager;
  
  // Game state
  private moveTimer = 0;

  constructor(canvas: HTMLCanvasElement) {
    // Initialize core systems
    this.stateManager = new StateManager(GameState.MENU);
    this.inputHandler = new InputHandler(this.stateManager);
    this.themeManager = new ThemeManager(); // Initialize with default 'dark' theme
    this.gameLoop = new GameLoop(
      (deltaTime) => this.update(deltaTime),
      () => this.render()
    );

    // Initialize entities
    this.snake = new Snake();
    this.food = new Food();

    // Initialize systems
    this.renderer = new Renderer(canvas, this.themeManager.getCanvasColors());
    this.mathSystem = new MathSystem();
    this.scoreSystem = new ScoreSystem();
    this.uiManager = new UIManager();

    this.setupEventHandlers();
    this.setupStateListeners();
    this.setupThemeHandlers();
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    // Input handlers
    this.inputHandler.onStart(() => this.handleStart());
    this.inputHandler.onDirectionChange((direction) => {
      this.snake.setDirection(direction);
    });

    // UI handlers
    this.uiManager.onSubmitAnswer((answer) => this.handleAnswerSubmit(answer));

    // Score updates
    this.scoreSystem.onScoreChange((event) => {
      this.uiManager.updateScore(event.newScore);
    });
  }

  /**
   * Setup state change listeners
   */
  private setupStateListeners(): void {
    this.stateManager.onStateChange((event) => {
      this.uiManager.updateForState(event.to);
    });
  }

  /**
   * Setup theme handlers
   */
  private setupThemeHandlers(): void {
    // Initialize theme selector UI
    this.uiManager.initThemeSelector(this.themeManager);

    // Update renderer when theme changes
    this.themeManager.onThemeChange(() => {
      this.renderer.updateColors(this.themeManager.getCanvasColors());
    });
  }

  /**
   * Handle start/restart action
   */
  private handleStart(): void {
    if (
      this.stateManager.is(GameState.MENU) ||
      this.stateManager.is(GameState.GAME_OVER)
    ) {
      this.resetGame();
      this.stateManager.setState(GameState.PLAYING);
    }
  }

  /**
   * Reset game to initial state
   */
  private resetGame(): void {
    this.snake.reset();
    this.food.reset();
    this.scoreSystem.reset();
    this.inputHandler.reset();
    this.moveTimer = 0;
    this.mathSystem.clearQuestion();
  }

  /**
   * Main update loop
   */
  private update(deltaTime: number): void {
    // Only update game logic when playing
    if (!this.stateManager.is(GameState.PLAYING)) {
      return;
    }

    // Update input
    this.inputHandler.updateDirection();

    // Update move timer
    this.moveTimer += deltaTime;

    if (this.moveTimer >= GAME_CONFIG.SNAKE_SPEED) {
      this.moveTimer = 0;
      this.updateGameLogic();
    }
  }

  /**
   * Update game logic (called at fixed intervals)
   */
  private updateGameLogic(): void {
    // Move snake
    this.snake.move();

    // Check collisions
    const collisions = checkCollisions(
      this.snake.getHead(),
      this.snake.getBodyWithoutHead(),
      this.food.getPosition()
    );

    // Handle food collision
    if (collisions.withFood) {
      this.handleFoodCollision();
    }

    // Handle wall collision
    if (collisions.withWall) {
      this.handleGameOver(GameOverReason.WALL_COLLISION);
      return;
    }

    // Handle self collision
    if (collisions.withSelf) {
      this.handleGameOver(GameOverReason.SELF_COLLISION);
      return;
    }
  }

  /**
   * Handle food collision
   */
  private handleFoodCollision(): void {
    // Grow snake
    this.snake.grow();

    // Generate math question
    this.mathSystem.generateQuestion();

    // Spawn new food
    this.food.spawn(this.snake.getBody());

    // Show math question and pause game
    this.stateManager.setState(GameState.MATH_QUESTION);
    this.uiManager.showMathQuestion(this.mathSystem.getQuestionText());
  }

  /**
   * Handle answer submission
   */
  private handleAnswerSubmit(answer: string): void {
    const isCorrect = this.mathSystem.checkAnswer(answer);

    if (isCorrect) {
      this.scoreSystem.addCorrectPoints();
      this.uiManager.showFeedback(true, GAME_CONFIG.CORRECT_POINTS);
    } else {
      this.scoreSystem.deductWrongPoints();
      this.uiManager.showFeedback(false, GAME_CONFIG.WRONG_PENALTY);
    }

    // Resume game after feedback delay
    setTimeout(() => {
      this.stateManager.setState(GameState.PLAYING);
    }, GAME_CONFIG.FEEDBACK_DURATION);
  }

  /**
   * Handle game over
   */
  private handleGameOver(reason: GameOverReason): void {
    this.stateManager.setState(GameState.GAME_OVER);
    this.uiManager.showGameOver(reason, this.scoreSystem.getScore());
  }

  /**
   * Render game
   */
  private render(): void {
    const isDimmed = this.stateManager.is(GameState.MATH_QUESTION);
    
    this.renderer.render(
      this.snake.getBody(),
      this.food.getPosition(),
      isDimmed
    );
  }

  /**
   * Start the game
   */
  start(): void {
    this.gameLoop.start();
    this.uiManager.updateScore(this.scoreSystem.getScore());
  }

  /**
   * Stop the game
   */
  stop(): void {
    this.gameLoop.stop();
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stop();
    this.inputHandler.destroy();
  }
}
