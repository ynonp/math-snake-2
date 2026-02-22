/**
 * Score System Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ScoreSystem, calculateScore } from '../systems/ScoreSystem';
import { GAME_CONFIG } from '../config/gameConfig';

describe('ScoreSystem', () => {
  let scoreSystem: ScoreSystem;

  beforeEach(() => {
    scoreSystem = new ScoreSystem();
  });

  describe('initial state', () => {
    it('should start with configured starting score', () => {
      expect(scoreSystem.getScore()).toBe(GAME_CONFIG.STARTING_SCORE);
    });
  });

  describe('addCorrectPoints', () => {
    it('should add correct points to score', () => {
      scoreSystem.addCorrectPoints();
      
      expect(scoreSystem.getScore()).toBe(
        GAME_CONFIG.STARTING_SCORE + GAME_CONFIG.CORRECT_POINTS
      );
    });

    it('should notify listeners of score change', () => {
      const listener = vi.fn();
      scoreSystem.onScoreChange(listener);
      
      scoreSystem.addCorrectPoints();
      
      expect(listener).toHaveBeenCalledWith({
        oldScore: GAME_CONFIG.STARTING_SCORE,
        newScore: GAME_CONFIG.STARTING_SCORE + GAME_CONFIG.CORRECT_POINTS,
        delta: GAME_CONFIG.CORRECT_POINTS,
      });
    });
  });

  describe('deductWrongPoints', () => {
    it('should deduct penalty points from score', () => {
      // First add some points
      scoreSystem.addCorrectPoints();
      const currentScore = scoreSystem.getScore();
      
      scoreSystem.deductWrongPoints();
      
      expect(scoreSystem.getScore()).toBe(
        currentScore - GAME_CONFIG.WRONG_PENALTY
      );
    });

    it('should not go below zero', () => {
      scoreSystem.deductWrongPoints();
      
      expect(scoreSystem.getScore()).toBe(0);
    });

    it('should notify listeners of score change', () => {
      const listener = vi.fn();
      scoreSystem.onScoreChange(listener);
      
      scoreSystem.deductWrongPoints();
      
      expect(listener).toHaveBeenCalledWith({
        oldScore: GAME_CONFIG.STARTING_SCORE,
        newScore: 0,
        delta: 0, // Delta is 0 when clamped at 0
      });
    });
  });

  describe('reset', () => {
    it('should reset score to starting value', () => {
      scoreSystem.addCorrectPoints();
      scoreSystem.reset();
      
      expect(scoreSystem.getScore()).toBe(GAME_CONFIG.STARTING_SCORE);
    });

    it('should notify listeners of reset', () => {
      const listener = vi.fn();
      scoreSystem.addCorrectPoints();
      scoreSystem.onScoreChange(listener);
      
      scoreSystem.reset();
      
      expect(listener).toHaveBeenCalled();
    });
  });

  describe('onScoreChange', () => {
    it('should allow multiple listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      
      scoreSystem.onScoreChange(listener1);
      scoreSystem.onScoreChange(listener2);
      
      scoreSystem.addCorrectPoints();
      
      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('should allow unsubscribing', () => {
      const listener = vi.fn();
      const unsubscribe = scoreSystem.onScoreChange(listener);
      
      unsubscribe();
      scoreSystem.addCorrectPoints();
      
      expect(listener).not.toHaveBeenCalled();
    });
  });
});

describe('calculateScore', () => {
  it('should add positive delta correctly', () => {
    expect(calculateScore(10, 5)).toBe(15);
  });

  it('should subtract negative delta correctly', () => {
    expect(calculateScore(10, -5)).toBe(5);
  });

  it('should not return negative scores', () => {
    expect(calculateScore(5, -10)).toBe(0);
  });

  it('should handle zero delta', () => {
    expect(calculateScore(10, 0)).toBe(10);
  });
});
