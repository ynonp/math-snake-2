/**
 * ThemeManager
 * Manages theme selection, application, and change notifications
 */

import { Theme, ThemeName, ThemeChangeCallback, CanvasColors } from '../types';
import { THEMES, DEFAULT_THEME } from '../config/themes';
import { EventEmitter } from '../utils/EventEmitter';

export class ThemeManager {
  private currentTheme: Theme;
  private currentThemeName: ThemeName;
  private emitter = new EventEmitter<ThemeName>();

  /**
   * Create a new ThemeManager
   * @param defaultTheme - Initial theme name (defaults to 'dark')
   */
  constructor(defaultTheme: ThemeName = DEFAULT_THEME) {
    if (!THEMES[defaultTheme]) {
      console.warn(`Theme "${defaultTheme}" not found, using "${DEFAULT_THEME}"`);
      defaultTheme = DEFAULT_THEME;
    }
    
    this.currentThemeName = defaultTheme;
    this.currentTheme = THEMES[defaultTheme];
    this.applyTheme(this.currentTheme);
  }

  /**
   * Set a new theme by name
   * @param themeName - Theme to activate
   */
  public setTheme(themeName: ThemeName): void {
    if (!THEMES[themeName]) {
      console.error(`Theme "${themeName}" not found`);
      return;
    }

    if (themeName === this.currentThemeName) {
      return; // Already active
    }

    const previousTheme = this.currentThemeName;
    this.currentThemeName = themeName;
    this.currentTheme = THEMES[themeName];
    
    this.applyTheme(this.currentTheme);
    this.emitter.emit(themeName);
    
    console.log(`Theme changed: ${previousTheme} → ${themeName}`);
  }

  /**
   * Apply theme by setting CSS custom properties on document root
   * @param theme - Theme to apply
   */
  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    // Apply all CSS custom properties
    Object.entries(theme.css).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  /**
   * Get current theme's canvas colors for Renderer
   */
  public getCanvasColors(): CanvasColors {
    return this.currentTheme.canvas;
  }

  /**
   * Get current theme name
   */
  public getCurrentThemeName(): ThemeName {
    return this.currentThemeName;
  }

  /**
   * Get current theme object
   */
  public getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Subscribe to theme change events.
   * @param callback - Function to call when theme changes
   * @returns Unsubscribe function
   */
  public onThemeChange(callback: ThemeChangeCallback): () => void {
    return this.emitter.subscribe(callback);
  }

  /**
   * Get all available theme names
   */
  public getAvailableThemes(): ThemeName[] {
    return Object.keys(THEMES) as ThemeName[];
  }
}
