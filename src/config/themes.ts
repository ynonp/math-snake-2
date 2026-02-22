/**
 * Theme Definitions
 * Complete theme configurations including canvas colors and CSS custom properties
 */

import { Theme, ThemeName } from '../types';

/**
 * Dark Theme (Default - Current palette)
 */
const darkTheme: Theme = {
  name: 'dark',
  displayName: 'Dark',
  canvas: {
    background: '#1a1a2e',
    grid: '#16213e',
    snakeHead: '#0f3460',
    snakeBody: '#16537e',
    food: '#e94560',
    foodStem: '#4a4a4a',
    dimOverlay: 'rgba(0, 0, 0, 0.5)',
  },
  css: {
    '--color-bg': '#1a1a2e',
    '--color-text': '#eee',
    '--color-accent-primary': '#e94560',
    '--color-accent-secondary': '#0f3460',
    '--color-accent-tertiary': '#16537e',
    '--color-success': '#4ecca3',
    '--color-error': '#e94560',
    '--color-border': '#0f3460',
    '--overlay-bg': 'rgba(0, 0, 0, 0.85)',
    '--overlay-bg-alt': 'rgba(26, 26, 46, 0.95)',
    '--shadow-color': 'rgba(0, 0, 0, 0.3)',
    '--font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    '--border-radius': '8px',
    '--input-focus-color': '#4ecca3',
  },
};

/**
 * Light Theme
 */
const lightTheme: Theme = {
  name: 'light',
  displayName: 'Light',
  canvas: {
    background: '#f5f5f5',
    grid: '#e0e0e0',
    snakeHead: '#2c5f7f',
    snakeBody: '#4a8fb8',
    food: '#d63447',
    foodStem: '#8b8b8b',
    dimOverlay: 'rgba(255, 255, 255, 0.6)',
  },
  css: {
    '--color-bg': '#f5f5f5',
    '--color-text': '#2c2c2c',
    '--color-accent-primary': '#d63447',
    '--color-accent-secondary': '#2c5f7f',
    '--color-accent-tertiary': '#4a8fb8',
    '--color-success': '#27ae60',
    '--color-error': '#d63447',
    '--color-border': '#4a8fb8',
    '--overlay-bg': 'rgba(255, 255, 255, 0.95)',
    '--overlay-bg-alt': 'rgba(245, 245, 245, 0.98)',
    '--shadow-color': 'rgba(0, 0, 0, 0.15)',
    '--font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    '--border-radius': '8px',
    '--input-focus-color': '#27ae60',
  },
};

/**
 * Retro Theme (CRT/Arcade style)
 */
const retroTheme: Theme = {
  name: 'retro',
  displayName: 'Retro',
  canvas: {
    background: '#0d0208',
    grid: '#1a1a1a',
    snakeHead: '#00ff41',
    snakeBody: '#00cc33',
    food: '#ffaa00',
    foodStem: '#885500',
    dimOverlay: 'rgba(0, 0, 0, 0.7)',
  },
  css: {
    '--color-bg': '#0d0208',
    '--color-text': '#00ff41',
    '--color-accent-primary': '#ffaa00',
    '--color-accent-secondary': '#00ff41',
    '--color-accent-tertiary': '#00cc33',
    '--color-success': '#00ff41',
    '--color-error': '#ff0055',
    '--color-border': '#00ff41',
    '--overlay-bg': 'rgba(13, 2, 8, 0.95)',
    '--overlay-bg-alt': 'rgba(26, 26, 26, 0.95)',
    '--shadow-color': 'rgba(0, 255, 65, 0.3)',
    '--font-family': '"Courier New", "Consolas", monospace',
    '--border-radius': '2px',
    '--input-focus-color': '#ffaa00',
  },
};

/**
 * Ocean Theme
 */
const oceanTheme: Theme = {
  name: 'ocean',
  displayName: 'Ocean',
  canvas: {
    background: '#0a1828',
    grid: '#1a2f42',
    snakeHead: '#178582',
    snakeBody: '#23a89a',
    food: '#ff6b6b',
    foodStem: '#994444',
    dimOverlay: 'rgba(10, 24, 40, 0.6)',
  },
  css: {
    '--color-bg': '#0a1828',
    '--color-text': '#bfd7ea',
    '--color-accent-primary': '#ff6b6b',
    '--color-accent-secondary': '#178582',
    '--color-accent-tertiary': '#23a89a',
    '--color-success': '#51cf66',
    '--color-error': '#ff6b6b',
    '--color-border': '#178582',
    '--overlay-bg': 'rgba(10, 24, 40, 0.92)',
    '--overlay-bg-alt': 'rgba(26, 47, 66, 0.95)',
    '--shadow-color': 'rgba(23, 133, 130, 0.25)',
    '--font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    '--border-radius': '8px',
    '--input-focus-color': '#23a89a',
  },
};

/**
 * High Contrast Theme (Accessibility)
 */
const highContrastTheme: Theme = {
  name: 'highContrast',
  displayName: 'High Contrast',
  canvas: {
    background: '#000000',
    grid: '#1a1a1a',
    snakeHead: '#ffff00',
    snakeBody: '#ffff00',
    food: '#00ffff',
    foodStem: '#008888',
    dimOverlay: 'rgba(0, 0, 0, 0.8)',
  },
  css: {
    '--color-bg': '#000000',
    '--color-text': '#ffffff',
    '--color-accent-primary': '#00ffff',
    '--color-accent-secondary': '#ffff00',
    '--color-accent-tertiary': '#ffff00',
    '--color-success': '#00ff00',
    '--color-error': '#ff0000',
    '--color-border': '#ffffff',
    '--overlay-bg': 'rgba(0, 0, 0, 0.95)',
    '--overlay-bg-alt': 'rgba(0, 0, 0, 0.98)',
    '--shadow-color': 'rgba(255, 255, 255, 0.3)',
    '--font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    '--border-radius': '4px',
    '--input-focus-color': '#00ff00',
  },
};

/**
 * Theme registry - maps theme names to theme objects
 */
export const THEMES: Record<ThemeName, Theme> = {
  dark: darkTheme,
  light: lightTheme,
  retro: retroTheme,
  ocean: oceanTheme,
  highContrast: highContrastTheme,
};

/**
 * Default theme
 */
export const DEFAULT_THEME: ThemeName = 'dark';

/**
 * Get all available theme names
 */
export function getThemeNames(): ThemeName[] {
  return Object.keys(THEMES) as ThemeName[];
}
