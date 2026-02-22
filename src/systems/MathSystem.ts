/**
 * Math System
 * Generates and validates multiplication exercises
 */

import { MathQuestion } from '../types';
import { GAME_CONFIG } from '../config/gameConfig';

export class MathSystem {
  private currentQuestion: MathQuestion | null = null;

  /**
   * Generate a new multiplication question
   */
  generateQuestion(): MathQuestion {
    const num1 = this.getRandomNumber();
    const num2 = this.getRandomNumber();

    this.currentQuestion = {
      num1,
      num2,
      correctAnswer: num1 * num2,
    };

    return this.currentQuestion;
  }

  /**
   * Get random number in configured range
   */
  private getRandomNumber(): number {
    const min = GAME_CONFIG.MATH_MIN;
    const max = GAME_CONFIG.MATH_MAX;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Check if user's answer is correct
   */
  checkAnswer(userAnswer: string): boolean {
    if (!this.currentQuestion) {
      return false;
    }

    // Parse user input
    const parsedAnswer = parseInt(userAnswer, 10);

    // Check if valid number
    if (isNaN(parsedAnswer)) {
      return false;
    }

    return parsedAnswer === this.currentQuestion.correctAnswer;
  }

  /**
   * Get current question
   */
  getCurrentQuestion(): MathQuestion | null {
    return this.currentQuestion;
  }

  /**
   * Get question as string
   */
  getQuestionText(): string {
    if (!this.currentQuestion) {
      return '';
    }

    return `${this.currentQuestion.num1} × ${this.currentQuestion.num2}`;
  }

  /**
   * Clear current question
   */
  clearQuestion(): void {
    this.currentQuestion = null;
  }
}
