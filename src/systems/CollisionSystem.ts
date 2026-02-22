/**
 * Collision System
 * Pure functions for collision detection
 */

import { Position, CollisionResult } from '../types';
import { GAME_CONFIG } from '../config/gameConfig';

/**
 * Check all collision types for the snake
 */
export function checkCollisions(
  snakeHead: Position,
  snakeBody: Position[],
  foodPosition: Position
): CollisionResult {
  return {
    withFood: checkFoodCollision(snakeHead, foodPosition),
    withWall: checkWallCollision(snakeHead),
    withSelf: checkSelfCollision(snakeHead, snakeBody),
  };
}

/**
 * Check if snake head collides with food
 */
export function checkFoodCollision(
  snakeHead: Position,
  foodPosition: Position
): boolean {
  return snakeHead.x === foodPosition.x && snakeHead.y === foodPosition.y;
}

/**
 * Check if snake head collides with wall
 */
export function checkWallCollision(snakeHead: Position): boolean {
  return (
    snakeHead.x < 0 ||
    snakeHead.x >= GAME_CONFIG.GRID_WIDTH ||
    snakeHead.y < 0 ||
    snakeHead.y >= GAME_CONFIG.GRID_HEIGHT
  );
}

/**
 * Check if snake head collides with its own body
 */
export function checkSelfCollision(
  snakeHead: Position,
  snakeBodyWithoutHead: Position[]
): boolean {
  return snakeBodyWithoutHead.some(
    (segment) => segment.x === snakeHead.x && segment.y === snakeHead.y
  );
}
