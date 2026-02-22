/**
 * Score System
 * Manages game score with pure calculation functions
 */

import { GAME_CONFIG } from '../config/gameConfig';
import { ScoreChangeEvent } from '../types';

type ScoreChangeListener = (event: ScoreChangeEvent) => void;

export class ScoreSystem {
  private score: number;
  private listeners: ScoreChangeListener[] = [];

  constructor() {
    this.score = GAME_CONFIG.STARTING_SCORE;
  }

  /**
   * Add points for correct answer
   */
  addCorrectPoints(): void {
    this.updateScore(this.score + GAME_CONFIG.CORRECT_POINTS);
  }

  /**
   * Deduct points for wrong answer
   */
  deductWrongPoints(): void {
    const newScore = this.score - GAME_CONFIG.WRONG_PENALTY;
    // Prevent negative scores
    this.updateScore(Math.max(0, newScore));
  }

  /**
   * Update score and notify listeners
   */
  private updateScore(newScore: number): void {
    const oldScore = this.score;
    this.score = newScore;

    const event: ScoreChangeEvent = {
      oldScore,
      newScore,
      delta: newScore - oldScore,
    };

    this.notifyListeners(event);
  }

  /**
   * Get current score
   */
  getScore(): number {
    return this.score;
  }

  /**
   * Reset score to initial value
   */
  reset(): void {
    this.updateScore(GAME_CONFIG.STARTING_SCORE);
  }

  /**
   * Subscribe to score changes
   */
  onScoreChange(listener: ScoreChangeListener): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Notify all listeners of score change
   */
  private notifyListeners(event: ScoreChangeEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }
}

/**
 * Pure function to calculate score change
 */
export function calculateScore(
  currentScore: number,
  delta: number
): number {
  return Math.max(0, currentScore + delta);
}
