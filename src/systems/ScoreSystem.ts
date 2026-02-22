/**
 * Score System
 * Manages game score with pure calculation functions
 */

import { GAME_CONFIG } from '../config/gameConfig';
import { ScoreChangeEvent } from '../types';
import { EventEmitter } from '../utils/EventEmitter';

export class ScoreSystem {
  private score: number;
  private emitter = new EventEmitter<ScoreChangeEvent>();

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

    this.emitter.emit(event);
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

  /** Subscribe to score changes. Returns an unsubscribe function. */
  onScoreChange(listener: (event: ScoreChangeEvent) => void): () => void {
    return this.emitter.subscribe(listener);
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
