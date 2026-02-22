/**
 * Math System
 * Generates and validates multiplication and division exercises
 */

import { MathOperation, MathQuestion } from '../types';
import { GAME_CONFIG } from '../config/gameConfig';

export class MathSystem {
  private currentQuestion: MathQuestion | null = null;

  /**
   * Generate a new math question (multiply or divide, chosen randomly from configured operations)
   */
  generateQuestion(): MathQuestion {
    const operations = GAME_CONFIG.MATH_OPERATIONS;
    const operation = operations[Math.floor(Math.random() * operations.length)];

    if (operation === 'divide') {
      this.currentQuestion = this.generateDivisionQuestion();
    } else {
      this.currentQuestion = this.generateMultiplicationQuestion();
    }

    return this.currentQuestion;
  }

  /**
   * Generate a multiplication question
   */
  private generateMultiplicationQuestion(): MathQuestion {
    const num1 = this.getRandomNumber();
    const num2 = this.getRandomNumber();
    return {
      num1,
      num2,
      operation: MathOperation.MULTIPLY,
      correctAnswer: num1 * num2,
    };
  }

  /**
   * Generate a division question with an integer answer.
   * Picks a divisor and quotient from the configured range, then computes
   * the dividend so that dividend ÷ divisor = quotient exactly.
   */
  private generateDivisionQuestion(): MathQuestion {
    const divisor = this.getRandomNumber();
    const quotient = this.getRandomNumber();
    const dividend = divisor * quotient;
    return {
      num1: dividend,
      num2: divisor,
      operation: MathOperation.DIVIDE,
      correctAnswer: quotient,
    };
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

    const { num1, num2, operation } = this.currentQuestion;
    const symbol = operation === MathOperation.DIVIDE ? '÷' : '×';
    return `${num1} ${symbol} ${num2}`;
  }

  /**
   * Clear current question
   */
  clearQuestion(): void {
    this.currentQuestion = null;
  }
}
