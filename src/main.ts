/**
 * Main Entry Point
 * Initializes and starts the game
 */

import './style.css';
import { Game } from './Game';

/**
 * Initialize the game when DOM is loaded
 */
function initGame(): void {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  // Create and start game
  const game = new Game(canvas);
  game.start();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    game.destroy();
  });
}

// Start game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
