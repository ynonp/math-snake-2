/**
 * Food Entity
 * Manages food (apple) position and spawning
 */

import { Position } from '../types';
import { GAME_CONFIG } from '../config/gameConfig';

export class Food {
  private position: Position;

  constructor() {
    this.position = this.generateRandomPosition();
  }

  /**
   * Generate random position on grid
   */
  private generateRandomPosition(): Position {
    return {
      x: Math.floor(Math.random() * GAME_CONFIG.GRID_WIDTH),
      y: Math.floor(Math.random() * GAME_CONFIG.GRID_HEIGHT),
    };
  }

  /**
   * Spawn food at random position avoiding snake body
   */
  spawn(snakeBody: Position[]): void {
    let newPosition: Position;
    let isValidPosition: boolean;

    // Try to find position not occupied by snake
    // Max attempts to avoid infinite loop
    const maxAttempts = 100;
    let attempts = 0;

    do {
      newPosition = this.generateRandomPosition();
      isValidPosition = !snakeBody.some(
        (segment) => segment.x === newPosition.x && segment.y === newPosition.y
      );
      attempts++;
    } while (!isValidPosition && attempts < maxAttempts);

    this.position = newPosition;
  }

  /**
   * Get current food position
   */
  getPosition(): Position {
    return this.position;
  }

  /**
   * Reset food position
   */
  reset(): void {
    this.position = this.generateRandomPosition();
  }
}
