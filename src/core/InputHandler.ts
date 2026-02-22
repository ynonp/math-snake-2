/**
 * Input Handler
 * Manages keyboard input with state-aware routing
 * Prevents invalid inputs and handles direction queueing
 */

import { Direction, GameState } from '../types';
import { GAME_CONFIG } from '../config/gameConfig';
import type { StateManager } from './StateManager';

type DirectionChangeCallback = (direction: Direction) => void;
type ActionCallback = () => void;

export class InputHandler {
  private currentDirection: Direction = Direction.RIGHT;
  private nextDirection: Direction = Direction.RIGHT;
  private directionChangeCallback: DirectionChangeCallback | null = null;
  private startCallback: ActionCallback | null = null;

  constructor(private stateManager: StateManager) {
    this.setupKeyboardListeners();
  }

  /**
   * Setup keyboard event listeners
   */
  private setupKeyboardListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    const key = event.key;

    // Handle start/restart action (Space bar)
    if ((GAME_CONFIG.CONTROLS.START as readonly string[]).includes(key)) {
      event.preventDefault();
      if (
        this.stateManager.is(GameState.MENU) ||
        this.stateManager.is(GameState.GAME_OVER)
      ) {
        this.startCallback?.();
      }
      return;
    }

    // Only process direction inputs during PLAYING state
    if (!this.stateManager.is(GameState.PLAYING)) {
      return;
    }

    // Determine new direction from key press
    let newDirection: Direction | null = null;

    if ((GAME_CONFIG.CONTROLS.UP as readonly string[]).includes(key)) {
      newDirection = Direction.UP;
    } else if ((GAME_CONFIG.CONTROLS.DOWN as readonly string[]).includes(key)) {
      newDirection = Direction.DOWN;
    } else if ((GAME_CONFIG.CONTROLS.LEFT as readonly string[]).includes(key)) {
      newDirection = Direction.LEFT;
    } else if ((GAME_CONFIG.CONTROLS.RIGHT as readonly string[]).includes(key)) {
      newDirection = Direction.RIGHT;
    }

    if (newDirection && this.isValidDirectionChange(newDirection)) {
      event.preventDefault();
      this.nextDirection = newDirection;
    }
  };

  /**
   * Check if direction change is valid (no 180-degree turns)
   */
  private isValidDirectionChange(newDirection: Direction): boolean {
    const opposites: Record<Direction, Direction> = {
      [Direction.UP]: Direction.DOWN,
      [Direction.DOWN]: Direction.UP,
      [Direction.LEFT]: Direction.RIGHT,
      [Direction.RIGHT]: Direction.LEFT,
    };

    return opposites[this.currentDirection] !== newDirection;
  }

  /**
   * Update current direction (called each game tick)
   */
  updateDirection(): void {
    if (this.nextDirection !== this.currentDirection) {
      this.currentDirection = this.nextDirection;
      this.directionChangeCallback?.(this.currentDirection);
    }
  }

  /**
   * Get current direction
   */
  getDirection(): Direction {
    return this.currentDirection;
  }

  /**
   * Set direction change callback
   */
  onDirectionChange(callback: DirectionChangeCallback): void {
    this.directionChangeCallback = callback;
  }

  /**
   * Set start action callback
   */
  onStart(callback: ActionCallback): void {
    this.startCallback = callback;
  }

  /**
   * Reset to initial direction
   */
  reset(): void {
    this.currentDirection = Direction.RIGHT;
    this.nextDirection = Direction.RIGHT;
  }

  /**
   * Cleanup event listeners
   */
  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}
