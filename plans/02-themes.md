Plan: Add Theme System with Always-Visible Switcher
Add a dynamic theme system allowing users to switch between 5 color/style themes (Dark, Light, Retro, Ocean, High Contrast) at any time via an always-visible UI control. Themes affect both Canvas rendering (snake, food, grid) and DOM styling (buttons, overlays, typography, borders, shadows). No localStorage persistence—resets to Dark theme on page load.

Key Decisions:

Use CSS custom properties for DOM theming (modern, performant)
Create ThemeManager following observer pattern (consistent with StateManager)
Refactor Renderer.ts to accept colors dynamically rather than reading static config
Themes include styling beyond colors: fonts (Retro uses monospace), borders, shadows, visual effects
Theme selector placed as floating button in top-right corner (always visible, not just in menu)
Steps

Create theme definitions in new src/config/themes.ts

Define Theme interface with canvas (background, grid, snake colors, food, etc.) and css (CSS custom properties object: --color-bg, --color-text, --color-accent, --font-family, --border-style, etc.)
Export THEMES registry with 5 themes: 'dark', 'light', 'retro', 'ocean', 'highContrast'
Dark theme uses current palette from gameConfig.ts:35-41
Light theme: light backgrounds, dark text, softer accents
Retro theme: CRT green/amber on black, monospace font, scanline effects via CSS
Ocean theme: blues/teals/aqua palette
High contrast theme: pure black/white with high visibility colors for accessibility
Include CSS properties for: colors, font-family, border-radius, box-shadow styles, overlay opacity
Create ThemeManager in new src/core/ThemeManager.ts

Constructor accepts default theme name (default: 'dark')
Store currentTheme: Theme and currentThemeName: string
Method: setTheme(themeName: string): void - validates name, updates state, applies theme, notifies listeners
Method: applyTheme(theme: Theme): void - sets CSS custom properties on document.documentElement.style, returns canvas colors
Method: getCanvasColors() - returns current theme's canvas color object for Renderer
Method: onThemeChange(callback: (themeName: string) => void) - observer pattern for subscribers
Method: getCurrentThemeName(): string - getter for current theme
Refactor Renderer to accept dynamic colors in Renderer.ts

Modify constructor or add updateColors(colors: Theme['canvas']) method
Replace all GAME_CONFIG.COLORS.* references with instance properties (e.g., this.colors.background)
Fix hardcoded colors: stem color (line 118) and dim overlay (line 130) now come from theme
Ensure render methods use this.colors throughout
Refactor CSS to use custom properties in style.css

Add :root CSS custom properties declaration block with default values (Dark theme)
Replace all hardcoded color values with var(--color-*) references
Replace font-family where needed with var(--font-family, sans-serif)
Replace border-radius with var(--border-radius, 4px)
Replace box-shadow with var(--shadow-*)
Ensure feedback colors (correct/wrong) also themeable: var(--color-success), var(--color-error)
Add support for optional --font-mono for retro theme
Consider --overlay-opacity for overlay backgrounds
Add theme selector UI in UIManager.ts and index.html

Add theme selector button/dropdown in HTML: floating positioned element (top-right, position: fixed)
Button shows palette icon (🎨) or current theme name
Clicking opens dropdown/modal with 5 theme options (with preview colors or icons)
Wire click handlers to call themeManager.setTheme(themeName)
UIManager method: initThemeSelector(themeManager: ThemeManager) to set up listeners
Update selector UI when theme changes (subscribe to onThemeChange)
Ensure selector stays visible during all game states (MENU, PLAYING, MATH_QUESTION, GAME_OVER)
Wire ThemeManager into Game in Game.ts

Instantiate ThemeManager with default 'dark' theme
Pass themeManager to Renderer (or call renderer.updateColors(themeManager.getCanvasColors()) initially)
Subscribe to theme changes: when theme changes, call renderer.updateColors(themeManager.getCanvasColors())
Pass themeManager to UIManager.initThemeSelector()
Consider initialization order: ThemeManager → apply theme → create Renderer
Update types in index.ts

Add ThemeChangeCallback type: (themeName: string) => void
Add ThemeName type: 'dark' | 'light' | 'retro' | 'ocean' | 'highContrast'
Export from types module for reuse
Remove old color config from gameConfig.ts

Remove COLORS object (now managed by themes)
Or keep as comment/deprecated for reference
Verification

Run npm run dev and verify Dark theme renders correctly (should look identical to current)
Use theme selector UI to switch between all 5 themes
Verify canvas colors change (snake, food, grid, background)
Verify DOM colors change (overlays, buttons, text, borders)
Verify Retro theme uses monospace font and distinctive styling
Test theme switching during different game states: MENU, PLAYING, MATH_QUESTION, GAME_OVER
Verify no console errors
Run npm run build to ensure TypeScript compiles with strict mode
Check High Contrast theme for accessibility (text contrast ratios)
Refresh page and verify it defaults back to Dark theme (no persistence)
Decisions

CSS custom properties over class swapping: More flexible, allows sub-property changes, better for gradual transitions
Observer pattern for ThemeManager: Consistent with existing StateManager architecture
No localStorage: Per user requirement, theme resets on page reload
Always-visible UI: Fixed position button, not hidden in menu per user preference
5 themes: Dark (current), Light, Retro, Ocean, High Contrast per user selection
Styling beyond colors: Fonts, borders, shadows vary by theme per user preference
Retro theme specifics: Monospace font, CRT-style colors (green/amber on black), potential scanline CSS effect
This plan is ready for implementation. Let me know if you'd like any adjustments or if I should clarify any steps!