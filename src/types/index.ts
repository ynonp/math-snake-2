/**
 * Core Type Definitions
 * Shared types used throughout the application
 */

/**
 * 2D Position on the game grid
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Direction of movement
 */
export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

/**
 * Game state machine states
 */
export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  MATH_QUESTION = 'MATH_QUESTION',
  GAME_OVER = 'GAME_OVER',
}

/**
 * Math question data
 */
export interface MathQuestion {
  num1: number;
  num2: number;
  correctAnswer: number;
}

/**
 * Collision detection result
 */
export interface CollisionResult {
  withFood: boolean;
  withWall: boolean;
  withSelf: boolean;
}

/**
 * Game over reason
 */
export enum GameOverReason {
  WALL_COLLISION = 'Hit the wall!',
  SELF_COLLISION = 'Hit yourself!',
}

/**
 * Event types for state changes
 */
export type StateChangeEvent = {
  from: GameState;
  to: GameState;
};

/**
 * Score change event
 */
export interface ScoreChangeEvent {
  oldScore: number;
  newScore: number;
  delta: number;
}
