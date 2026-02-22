/**
 * Game Loop
 * Manages the main game loop using requestAnimationFrame
 * Provides consistent timing across different frame rates
 */

export class GameLoop {
  private isRunning = false;
  private lastTime = 0;
  private accumulator = 0;
  private readonly fixedTimeStep: number;
  private animationFrameId: number | null = null;

  constructor(
    private updateCallback: (deltaTime: number) => void,
    private renderCallback: () => void,
    fixedTimeStep: number = 1000 / 60 // 60 FPS
  ) {
    this.fixedTimeStep = fixedTimeStep;
  }

  /**
   * Start the game loop
   */
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.loop(this.lastTime);
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main loop function
   */
  private loop = (currentTime: number): void => {
    if (!this.isRunning) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    // Fixed time step updates for consistent game logic
    while (this.accumulator >= this.fixedTimeStep) {
      this.updateCallback(this.fixedTimeStep);
      this.accumulator -= this.fixedTimeStep;
    }

    // Render at display refresh rate
    this.renderCallback();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  /**
   * Check if loop is running
   */
  get running(): boolean {
    return this.isRunning;
  }
}
