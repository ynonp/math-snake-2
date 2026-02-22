/**
 * State Manager
 * Implements State Machine pattern for game state transitions
 * Manages state transitions and notifies listeners
 */

import { GameState, StateChangeEvent } from '../types';

type StateChangeListener = (event: StateChangeEvent) => void;

export class StateManager {
  private currentState: GameState;
  private listeners: StateChangeListener[] = [];

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
    this.notifyListeners(event);
  }

  /**
   * Subscribe to state changes
   */
  onStateChange(listener: StateChangeListener): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(event: StateChangeEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  /**
   * Reset to initial state
   */
  reset(initialState: GameState = GameState.MENU): void {
    this.setState(initialState);
  }
}
