/**
 * State Manager
 * Implements State Machine pattern for game state transitions
 * Manages state transitions and notifies listeners
 */

import { GameState, StateChangeEvent } from '../types';
import { EventEmitter } from '../utils/EventEmitter';

export class StateManager {
  private currentState: GameState;
  private emitter = new EventEmitter<StateChangeEvent>();

  constructor(initialState: GameState = GameState.MENU) {
    this.currentState = initialState;
  }

  /**
   * Get current game state
   */
  getState(): GameState {
    return this.currentState;
  }

  /**
   * Check if in a specific state
   */
  is(state: GameState): boolean {
    return this.currentState === state;
  }

  /**
   * Transition to a new state
   */
  setState(newState: GameState): void {
    if (this.currentState === newState) return;

    const event: StateChangeEvent = {
      from: this.currentState,
      to: newState,
    };

    this.currentState = newState;
    this.emitter.emit(event);
  }

  /** Subscribe to state changes. Returns an unsubscribe function. */
  onStateChange(listener: (event: StateChangeEvent) => void): () => void {
    return this.emitter.subscribe(listener);
  }

  /**
   * Reset to initial state
   */
  reset(initialState: GameState = GameState.MENU): void {
    this.setState(initialState);
  }
}
