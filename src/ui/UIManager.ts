/**
 * UI Manager
 * Manages all DOM-based UI elements and overlays
 */

import { GameOverReason, GameState } from '../types';
import { GAME_CONFIG } from '../config/gameConfig';

export class UIManager {
  // Screen elements
  private menuScreen: HTMLElement;
  private mathOverlay: HTMLElement;
  private gameOverScreen: HTMLElement;
  
  // Math question elements
  private mathQuestion: HTMLElement;
  private mathInput: HTMLInputElement;
  private mathSubmit: HTMLButtonElement;
  private mathFeedback: HTMLElement;
  
  // Score elements
  private currentScoreDisplay: HTMLElement;
  private finalScoreDisplay: HTMLElement;
  
  // Game over elements
  private gameOverReason: HTMLElement;

  // Callbacks
  private submitAnswerCallback: ((answer: string) => void) | null = null;

  constructor() {
    this.menuScreen = this.getElement('menu-screen');
    this.mathOverlay = this.getElement('math-overlay');
    this.gameOverScreen = this.getElement('gameover-screen');
    
    this.mathQuestion = this.getElement('math-question');
    this.mathInput = this.getElement('math-input') as HTMLInputElement;
    this.mathSubmit = this.getElement('math-submit') as HTMLButtonElement;
    this.mathFeedback = this.getElement('math-feedback');
    
    this.currentScoreDisplay = this.getElement('current-score');
    this.finalScoreDisplay = this.getElement('final-score');
    
    this.gameOverReason = this.getElement('gameover-reason');

    this.setupEventListeners();
  }

  /**
   * Get DOM element by ID
   */
  private getElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Element with id "${id}" not found`);
    }
    return element;
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Submit answer on button click
    this.mathSubmit.addEventListener('click', () => {
      this.handleSubmitAnswer();
    });

    // Submit answer on Enter key
    this.mathInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.handleSubmitAnswer();
      }
    });
  }

  /**
   * Handle answer submission
   */
  private handleSubmitAnswer(): void {
    const answer = this.mathInput.value.trim();
    if (answer) {
      this.submitAnswerCallback?.(answer);
    }
  }

  /**
   * Show menu screen
   */
  showMenu(): void {
    this.menuScreen.classList.remove('hidden');
    this.mathOverlay.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
  }

  /**
   * Hide all screens (playing state)
   */
  hideAllScreens(): void {
    this.menuScreen.classList.add('hidden');
    this.mathOverlay.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
  }

  /**
   * Show math question overlay
   */
  showMathQuestion(questionText: string): void {
    this.mathQuestion.textContent = `What is ${questionText}?`;
    this.mathInput.value = '';
    this.mathFeedback.textContent = '';
    this.mathFeedback.className = 'feedback';
    
    this.mathOverlay.classList.remove('hidden');
    
    // Focus input for immediate typing
    setTimeout(() => this.mathInput.focus(), 100);
  }

  /**
   * Show feedback for answer
   */
  showFeedback(isCorrect: boolean, points: number): void {
    const sign = isCorrect ? '+' : '-';
    const text = isCorrect
      ? `Correct! ${sign}${points} points`
      : `Wrong! ${sign}${points} points`;
    
    this.mathFeedback.textContent = text;
    this.mathFeedback.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;
    
    // Disable input after answer
    this.mathInput.disabled = true;
    this.mathSubmit.disabled = true;

    // Auto-hide after delay
    setTimeout(() => {
      this.hideMathQuestion();
    }, GAME_CONFIG.FEEDBACK_DURATION);
  }

  /**
   * Hide math question overlay
   */
  hideMathQuestion(): void {
    this.mathOverlay.classList.add('hidden');
    this.mathInput.disabled = false;
    this.mathSubmit.disabled = false;
  }

  /**
   * Show game over screen
   */
  showGameOver(reason: GameOverReason, finalScore: number): void {
    this.gameOverReason.textContent = reason;
    this.finalScoreDisplay.textContent = finalScore.toString();
    this.gameOverScreen.classList.remove('hidden');
  }

  /**
   * Update score display
   */
  updateScore(score: number): void {
    this.currentScoreDisplay.textContent = score.toString();
  }

  /**
   * Set submit answer callback
   */
  onSubmitAnswer(callback: (answer: string) => void): void {
    this.submitAnswerCallback = callback;
  }

  /**
   * Update UI based on game state
   */
  updateForState(state: GameState): void {
    switch (state) {
      case GameState.MENU:
        this.showMenu();
        break;
      case GameState.PLAYING:
        this.hideAllScreens();
        break;
      case GameState.MATH_QUESTION:
        // Math overlay shown separately via showMathQuestion
        break;
      case GameState.GAME_OVER:
        // Game over shown separately via showGameOver
        break;
    }
  }
}
