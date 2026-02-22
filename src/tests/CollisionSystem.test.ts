/**
 * Collision System Tests
 */

import { describe, it, expect } from 'vitest';
import {
  checkFoodCollision,
  checkWallCollision,
  checkSelfCollision,
  checkCollisions,
} from '../systems/CollisionSystem';
import { Position } from '../types';

describe('CollisionSystem', () => {
  describe('checkFoodCollision', () => {
    it('should return true when snake head is at food position', () => {
      const snakeHead: Position = { x: 5, y: 5 };
      const foodPosition: Position = { x: 5, y: 5 };
      
      expect(checkFoodCollision(snakeHead, foodPosition)).toBe(true);
    });

    it('should return false when snake head is not at food position', () => {
      const snakeHead: Position = { x: 5, y: 5 };
      const foodPosition: Position = { x: 6, y: 5 };
      
      expect(checkFoodCollision(snakeHead, foodPosition)).toBe(false);
    });
  });

  describe('checkWallCollision', () => {
    it('should return true when x is negative', () => {
      const snakeHead: Position = { x: -1, y: 5 };
      expect(checkWallCollision(snakeHead)).toBe(true);
    });

    it('should return true when x is >= grid width', () => {
      const snakeHead: Position = { x: 20, y: 5 };
      expect(checkWallCollision(snakeHead)).toBe(true);
    });

    it('should return true when y is negative', () => {
      const snakeHead: Position = { x: 5, y: -1 };
      expect(checkWallCollision(snakeHead)).toBe(true);
    });

    it('should return true when y is >= grid height', () => {
      const snakeHead: Position = { x: 5, y: 20 };
      expect(checkWallCollision(snakeHead)).toBe(true);
    });

    it('should return false when position is within bounds', () => {
      const snakeHead: Position = { x: 10, y: 10 };
      expect(checkWallCollision(snakeHead)).toBe(false);
    });
  });

  describe('checkSelfCollision', () => {
    it('should return true when head collides with body segment', () => {
      const snakeHead: Position = { x: 5, y: 5 };
      const snakeBody: Position[] = [
        { x: 6, y: 5 },
        { x: 5, y: 5 }, // Collision here
        { x: 4, y: 5 },
      ];
      
      expect(checkSelfCollision(snakeHead, snakeBody)).toBe(true);
    });

    it('should return false when head does not collide with body', () => {
      const snakeHead: Position = { x: 5, y: 5 };
      const snakeBody: Position[] = [
        { x: 6, y: 5 },
        { x: 7, y: 5 },
        { x: 8, y: 5 },
      ];
      
      expect(checkSelfCollision(snakeHead, snakeBody)).toBe(false);
    });

    it('should return false for empty body', () => {
      const snakeHead: Position = { x: 5, y: 5 };
      const snakeBody: Position[] = [];
      
      expect(checkSelfCollision(snakeHead, snakeBody)).toBe(false);
    });
  });

  describe('checkCollisions', () => {
    it('should detect food collision', () => {
      const snakeHead: Position = { x: 5, y: 5 };
      const snakeBody: Position[] = [];
      const foodPosition: Position = { x: 5, y: 5 };
      
      const result = checkCollisions(snakeHead, snakeBody, foodPosition);
      
      expect(result.withFood).toBe(true);
      expect(result.withWall).toBe(false);
      expect(result.withSelf).toBe(false);
    });

    it('should detect wall collision', () => {
      const snakeHead: Position = { x: -1, y: 5 };
      const snakeBody: Position[] = [];
      const foodPosition: Position = { x: 10, y: 10 };
      
      const result = checkCollisions(snakeHead, snakeBody, foodPosition);
      
      expect(result.withFood).toBe(false);
      expect(result.withWall).toBe(true);
      expect(result.withSelf).toBe(false);
    });

    it('should detect self collision', () => {
      const snakeHead: Position = { x: 5, y: 5 };
      const snakeBody: Position[] = [{ x: 5, y: 5 }];
      const foodPosition: Position = { x: 10, y: 10 };
      
      const result = checkCollisions(snakeHead, snakeBody, foodPosition);
      
      expect(result.withFood).toBe(false);
      expect(result.withWall).toBe(false);
      expect(result.withSelf).toBe(true);
    });
  });
});
