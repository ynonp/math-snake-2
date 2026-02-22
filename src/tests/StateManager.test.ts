/**
 * State Manager Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StateManager } from '../core/StateManager';
import { GameState } from '../types';

describe('StateManager', () => {
  let stateManager: StateManager;

  beforeEach(() => {
    stateManager = new StateManager();
  });

  describe('initialization', () => {
    it('should start in MENU state by default', () => {
      expect(stateManager.getState()).toBe(GameState.MENU);
    });

    it('should allow custom initial state', () => {
      const customStateManager = new StateManager(GameState.PLAYING);
      expect(customStateManager.getState()).toBe(GameState.PLAYING);
    });
  });

  describe('setState', () => {
    it('should change state', () => {
      stateManager.setState(GameState.PLAYING);
      expect(stateManager.getState()).toBe(GameState.PLAYING);
    });

    it('should not change if setting same state', () => {
      const listener = vi.fn();
      stateManager.onStateChange(listener);
      
      stateManager.setState(GameState.MENU);
      
      expect(listener).not.toHaveBeenCalled();
    });

    it('should notify listeners on state change', () => {
      const listener = vi.fn();
      stateManager.onStateChange(listener);
      
      stateManager.setState(GameState.PLAYING);
      
      expect(listener).toHaveBeenCalledWith({
        from: GameState.MENU,
        to: GameState.PLAYING,
      });
    });
  });

  describe('is', () => {
    it('should return true for current state', () => {
      expect(stateManager.is(GameState.MENU)).toBe(true);
    });

    it('should return false for different state', () => {
      expect(stateManager.is(GameState.PLAYING)).toBe(false);
    });
  });

  describe('onStateChange', () => {
    it('should support multiple listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      
      stateManager.onStateChange(listener1);
      stateManager.onStateChange(listener2);
      
      stateManager.setState(GameState.PLAYING);
      
      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('should allow unsubscribing', () => {
      const listener = vi.fn();
      const unsubscribe = stateManager.onStateChange(listener);
      
      unsubscribe();
      stateManager.setState(GameState.PLAYING);
      
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset to MENU by default', () => {
      stateManager.setState(GameState.GAME_OVER);
      stateManager.reset();
      
      expect(stateManager.getState()).toBe(GameState.MENU);
    });

    it('should allow custom reset state', () => {
      stateManager.setState(GameState.GAME_OVER);
      stateManager.reset(GameState.PLAYING);
      
      expect(stateManager.getState()).toBe(GameState.PLAYING);
    });
  });
});
