/**
 * Game Configuration
 * Centralized game constants for easy tuning and maintenance
 */

export const GAME_CONFIG = {
  // Grid settings
  GRID_WIDTH: 20,
  GRID_HEIGHT: 20,
  CELL_SIZE: 25,

  // Game speed (milliseconds per move)
  SNAKE_SPEED: 150,

  // Math exercise settings
  MATH_MIN: 1,
  MATH_MAX: 10, // Results in multiplication problems 1-100

  // Scoring
  CORRECT_POINTS: 10,
  WRONG_PENALTY: 5,
  STARTING_SCORE: 0,

  // Controls
  CONTROLS: {
    UP: ['w', 'W'],
    DOWN: ['s', 'S'],
    LEFT: ['a', 'A'],
    RIGHT: ['d', 'D'],
    START: [' '], // Space bar
  },

  // Visual settings
  COLORS: {
    BACKGROUND: '#1a1a2e',
    GRID: '#16213e',
    SNAKE_HEAD: '#0f3460',
    SNAKE_BODY: '#16537e',
    FOOD: '#e94560',
    TEXT: '#eee',
    OVERLAY_BG: 'rgba(0, 0, 0, 0.85)',
  },

  // Feedback display time (ms)
  FEEDBACK_DURATION: 1500,

  // Initial snake settings
  INITIAL_SNAKE_LENGTH: 3,
} as const;

export type GameConfig = typeof GAME_CONFIG;
