/**
 * FaseUp Theme System
 * Dark Mode Toggle with localStorage persistence
 * Version: 2.0.0 - Navbar Integration
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
        
        // Add rotation animation
        const btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.classList.add('rotating');
            setTimeout(() => btn.classList.remove('rotating'), 500);
        }
        
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

    // Create toggle button in navbar
    function createToggleButton() {
        // Check if button already exists
        if (document.getElementById('theme-toggle')) return;

        // Try to find navbar container
        const navbarContainers = [
            document.querySelector('nav .flex.items-center.space-x-6'), // index.html pattern
            document.querySelector('nav .flex.items-center.space-x-4'),
            document.querySelector('nav .flex.items-center'),
            document.querySelector('nav .nav-right'),
            document.querySelector('.navbar .nav-actions')
        ];

        let navbar = null;
        for (const container of navbarContainers) {
            if (container) {
                navbar = container;
                break;
            }
        }

        const button = document.createElement('button');
        button.id = 'theme-toggle';
        button.setAttribute('aria-label', 'Alternar tema');
        button.innerHTML = '<i class="fas fa-moon"></i>';
        button.addEventListener('click', toggleTheme);

        if (navbar) {
            // Navbar found - insert toggle before last button (CTA)
            button.className = 'theme-toggle-nav';

            // Find the CTA button (usually the last button in navbar)
            const ctaSelectors = [
                'button.bg-accent',
                'button.bg-primary',
                'button[onclick*="openApoiador"]',
                'button[onclick*="Apoiador"]',
                'a.bg-accent',
                'a.bg-primary'
            ];

            let ctaButton = null;
            for (const selector of ctaSelectors) {
                ctaButton = navbar.querySelector(selector);
                if (ctaButton) break;
            }

            if (ctaButton) {
                // Insert before CTA button
                navbar.insertBefore(button, ctaButton);
            } else {
                // No CTA found, append to end
                navbar.appendChild(button);
            }

            console.log('✓ Theme toggle added to navbar');
        } else {
            // Fallback: Create floating button
            button.className = 'theme-toggle-floating';

            if (document.body) {
                document.body.appendChild(button);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    document.body.appendChild(button);
                });
            }

            console.warn('⚠ Navbar not found - using floating toggle');
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
