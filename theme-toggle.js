/**
 * FaseUp Theme System
 * Dark Mode Toggle with localStorage persistence
 * Version: 1.0.0
 */

(function() {
    'use strict';

    const THEME_KEY = 'faseup-theme';
    const THEME_LIGHT = 'light';
    const THEME_DARK = 'dark';

    // Detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Get saved theme or use system preference
    function getInitialTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) return saved;
        return prefersDark.matches ? THEME_DARK : THEME_LIGHT;
    }

    // Apply theme
    function setTheme(theme) {
        const root = document.documentElement;
        const isDark = theme === THEME_DARK;

        root.classList.toggle('dark-mode', isDark);
        localStorage.setItem(THEME_KEY, theme);

        // Update toggle button icon
        updateToggleIcon(isDark);

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChange', {
            detail: { theme }
        }));
    }

    // Toggle between themes
    function toggleTheme() {
        const current = document.documentElement.classList.contains('dark-mode')
            ? THEME_DARK
            : THEME_LIGHT;
        const newTheme = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
        setTheme(newTheme);
    }

    // Update toggle button icon
    function updateToggleIcon(isDark) {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;

        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }

        btn.setAttribute('aria-label', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
        btn.setAttribute('title', isDark ? 'Modo Claro' : 'Modo Escuro');
    }

    // Create toggle button
    function createToggleButton() {
        // Check if button already exists
        if (document.getElementById('theme-toggle')) return;

        const button = document.createElement('button');
        button.id = 'theme-toggle';
        button.className = 'theme-toggle-btn';
        button.setAttribute('aria-label', 'Alternar tema');
        button.innerHTML = '<i class="fas fa-moon"></i>';

        button.addEventListener('click', toggleTheme);

        // Add to body when DOM is ready
        if (document.body) {
            document.body.appendChild(button);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(button);
            });
        }
    }

    // Initialize theme immediately (prevent flash)
    const initialTheme = getInitialTheme();
    document.documentElement.classList.toggle('dark-mode', initialTheme === THEME_DARK);

    // Create button and finalize when DOM loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createToggleButton();
            updateToggleIcon(initialTheme === THEME_DARK);
        });
    } else {
        createToggleButton();
        updateToggleIcon(initialTheme === THEME_DARK);
    }

    // Listen to system theme changes
    prefersDark.addEventListener('change', (e) => {
        const saved = localStorage.getItem(THEME_KEY);
        if (!saved) {
            setTheme(e.matches ? THEME_DARK : THEME_LIGHT);
        }
    });

    // Public API
    window.FaseUpTheme = {
        toggle: toggleTheme,
        setTheme: setTheme,
        getCurrentTheme: () => document.documentElement.classList.contains('dark-mode')
            ? THEME_DARK
            : THEME_LIGHT
    };
})();
