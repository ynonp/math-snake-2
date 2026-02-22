/**
 * Renderer
 * Handles all canvas rendering
 */

import { Position, CanvasColors } from '../types';
import { GAME_CONFIG } from '../config/gameConfig';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private readonly canvasWidth: number;
  private readonly canvasHeight: number;
  private colors: CanvasColors;

  constructor(private canvas: HTMLCanvasElement, initialColors: CanvasColors) {
    this.colors = initialColors;
    // Set canvas size
    this.canvasWidth = GAME_CONFIG.GRID_WIDTH * GAME_CONFIG.CELL_SIZE;
    this.canvasHeight = GAME_CONFIG.GRID_HEIGHT * GAME_CONFIG.CELL_SIZE;
    
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = context;
  }

  /**
   * Update theme colors
   * @param colors - New canvas colors to use
   */
  public updateColors(colors: CanvasColors): void {
    this.colors = colors;
  }

  /**
   * Clear the canvas
   */
  clear(): void {
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  /**
   * Draw grid lines
   */
  drawGrid(): void {
    this.ctx.strokeStyle = this.colors.grid;
    this.ctx.lineWidth = 0.5;

    // Vertical lines
    for (let x = 0; x <= GAME_CONFIG.GRID_WIDTH; x++) {
      const xPos = x * GAME_CONFIG.CELL_SIZE;
      this.ctx.beginPath();
      this.ctx.moveTo(xPos, 0);
      this.ctx.lineTo(xPos, this.canvasHeight);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= GAME_CONFIG.GRID_HEIGHT; y++) {
      const yPos = y * GAME_CONFIG.CELL_SIZE;
      this.ctx.beginPath();
      this.ctx.moveTo(0, yPos);
      this.ctx.lineTo(this.canvasWidth, yPos);
      this.ctx.stroke();
    }
  }

  /**
   * Draw snake
   */
  drawSnake(body: Position[]): void {
    body.forEach((segment, index) => {
      const isHead = index === 0;
      this.ctx.fillStyle = isHead
        ? this.colors.snakeHead
        : this.colors.snakeBody;

      const x = segment.x * GAME_CONFIG.CELL_SIZE;
      const y = segment.y * GAME_CONFIG.CELL_SIZE;

      // Draw with slight border
      this.ctx.fillRect(
        x + 1,
        y + 1,
        GAME_CONFIG.CELL_SIZE - 2,
        GAME_CONFIG.CELL_SIZE - 2
      );

      // Draw eyes on head
      if (isHead) {
        this.ctx.fillStyle = this.colors.background;
        const eyeSize = 3;
        const eyeOffset = 7;
        this.ctx.fillRect(x + eyeOffset, y + eyeOffset, eyeSize, eyeSize);
        this.ctx.fillRect(
          x + GAME_CONFIG.CELL_SIZE - eyeOffset - eyeSize,
          y + eyeOffset,
          eyeSize,
          eyeSize
        );
      }
    });
  }

  /**
   * Draw food
   */
  drawFood(position: Position): void {
    this.ctx.fillStyle = this.colors.food;
    
    const x = position.x * GAME_CONFIG.CELL_SIZE;
    const y = position.y * GAME_CONFIG.CELL_SIZE;
    const centerX = x + GAME_CONFIG.CELL_SIZE / 2;
    const centerY = y + GAME_CONFIG.CELL_SIZE / 2;
    const radius = GAME_CONFIG.CELL_SIZE / 2 - 2;

    // Draw apple as circle
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw stem
    this.ctx.strokeStyle = this.colors.foodStem;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, y + 3);
    this.ctx.lineTo(centerX - 3, y);
    this.ctx.stroke();
  }

  /**
   * Dim the background (for overlays)
   */
  dimBackground(): void {
    this.ctx.fillStyle = this.colors.dimOverlay;
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  /**
   * Render complete frame
   */
  render(snakeBody: Position[], foodPosition: Position, dimmed = false): void {
    this.clear();
    this.drawGrid();
    this.drawSnake(snakeBody);
    this.drawFood(foodPosition);
    
    if (dimmed) {
      this.dimBackground();
    }
  }
}
