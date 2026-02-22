/**
 * Math System Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MathSystem } from '../systems/MathSystem';
import { GAME_CONFIG } from '../config/gameConfig';

describe('MathSystem', () => {
  let mathSystem: MathSystem;

  beforeEach(() => {
    mathSystem = new MathSystem();
  });

  describe('generateQuestion', () => {
    it('should generate a question with numbers in valid range', () => {
      const question = mathSystem.generateQuestion();
      
      expect(question.num1).toBeGreaterThanOrEqual(GAME_CONFIG.MATH_MIN);
      expect(question.num1).toBeLessThanOrEqual(GAME_CONFIG.MATH_MAX);
      expect(question.num2).toBeGreaterThanOrEqual(GAME_CONFIG.MATH_MIN);
      expect(question.num2).toBeLessThanOrEqual(GAME_CONFIG.MATH_MAX);
    });

    it('should calculate correct answer', () => {
      const question = mathSystem.generateQuestion();
      
      expect(question.correctAnswer).toBe(question.num1 * question.num2);
    });

    it('should store current question', () => {
      const question = mathSystem.generateQuestion();
      const current = mathSystem.getCurrentQuestion();
      
      expect(current).toEqual(question);
    });
  });

  describe('checkAnswer', () => {
    beforeEach(() => {
      mathSystem.generateQuestion();
    });

    it('should return true for correct answer', () => {
      const question = mathSystem.getCurrentQuestion()!;
      const answer = question.correctAnswer.toString();
      
      expect(mathSystem.checkAnswer(answer)).toBe(true);
    });

    it('should return false for wrong answer', () => {
      const question = mathSystem.getCurrentQuestion()!;
      const wrongAnswer = (question.correctAnswer + 1).toString();
      
      expect(mathSystem.checkAnswer(wrongAnswer)).toBe(false);
    });

    it('should return false for non-numeric input', () => {
      expect(mathSystem.checkAnswer('abc')).toBe(false);
      expect(mathSystem.checkAnswer('')).toBe(false);
      expect(mathSystem.checkAnswer('12.5')).toBe(false); // Should accept only integers
    });

    it('should return false when no question exists', () => {
      const emptyMathSystem = new MathSystem();
      expect(emptyMathSystem.checkAnswer('42')).toBe(false);
    });
  });

  describe('getQuestionText', () => {
    it('should return formatted question text', () => {
      mathSystem.generateQuestion();
      const text = mathSystem.getQuestionText();
      
      expect(text).toMatch(/^\d+ × \d+$/);
    });

    it('should return empty string when no question exists', () => {
      const text = mathSystem.getQuestionText();
      expect(text).toBe('');
    });
  });

  describe('clearQuestion', () => {
    it('should clear current question', () => {
      mathSystem.generateQuestion();
      mathSystem.clearQuestion();
      
      expect(mathSystem.getCurrentQuestion()).toBeNull();
    });
  });
});
