/**
 * Snake Entity
 * Manages snake position, movement, and collision with itself
 */

import { Position, Direction } from '../types';
import { GAME_CONFIG } from '../config/gameConfig';

export class Snake {
  private body: Position[];
  private direction: Direction;
  private shouldGrow = false;

  constructor() {
    this.direction = Direction.RIGHT;
    this.body = this.initializeBody();
  }

  /**
   * Initialize snake body at center of grid
   */
  private initializeBody(): Position[] {
    const centerX = Math.floor(GAME_CONFIG.GRID_WIDTH / 2);
    const centerY = Math.floor(GAME_CONFIG.GRID_HEIGHT / 2);

    const body: Position[] = [];
    for (let i = 0; i < GAME_CONFIG.INITIAL_SNAKE_LENGTH; i++) {
      body.push({ x: centerX - i, y: centerY });
    }
    return body;
  }

  /**
   * Move snake in current direction
   */
  move(): void {
    const head = this.getHead();
    const newHead = this.getNextHeadPosition(head);

    // Add new head
    this.body.unshift(newHead);

    // Remove tail unless growing
    if (!this.shouldGrow) {
      this.body.pop();
    } else {
      this.shouldGrow = false;
    }
  }

  /**
   * Calculate next head position based on direction
   */
  private getNextHeadPosition(currentHead: Position): Position {
    const newHead = { ...currentHead };

    switch (this.direction) {
      case Direction.UP:
        newHead.y -= 1;
        break;
      case Direction.DOWN:
        newHead.y += 1;
        break;
      case Direction.LEFT:
        newHead.x -= 1;
        break;
      case Direction.RIGHT:
        newHead.x += 1;
        break;
    }

    return newHead;
  }

  /**
   * Mark snake to grow on next move
   */
  grow(): void {
    this.shouldGrow = true;
  }

  /**
   * Change snake direction
   */
  setDirection(newDirection: Direction): void {
    this.direction = newDirection;
  }

  /**
   * Get snake head position
   */
  getHead(): Position {
    return this.body[0]!;
  }

  /**
   * Get entire snake body
   */
  getBody(): Position[] {
    return this.body;
  }

  /**
   * Get snake body without head (for self-collision check)
   */
  getBodyWithoutHead(): Position[] {
    return this.body.slice(1);
  }

  /**
   * Check if snake collides with itself
   */
  checkSelfCollision(): boolean {
    const head = this.getHead();
    return this.getBodyWithoutHead().some(
      (segment) => segment.x === head.x && segment.y === head.y
    );
  }

  /**
   * Get current direction
   */
  getDirection(): Direction {
    return this.direction;
  }

  /**
   * Get snake length
   */
  getLength(): number {
    return this.body.length;
  }

  /**
   * Reset snake to initial state
   */
  reset(): void {
    this.body = this.initializeBody();
    this.direction = Direction.RIGHT;
    this.shouldGrow = false;
  }
}
