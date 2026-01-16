import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private readonly STORAGE_KEY = 'app-theme';

    theme = signal<Theme>(this.getStoredTheme());
    activeTheme = signal<'light' | 'dark'>('light');

    constructor() {
        // Apply initial theme
        this.applyTheme();

        // Watch for theme changes
        effect(() => {
            this.applyTheme();
        });

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (this.theme() === 'auto') {
                    this.activeTheme.set(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    setTheme(theme: Theme): void {
        this.theme.set(theme);
        localStorage.setItem(this.STORAGE_KEY, theme);
    }

    toggleTheme(): void {
        const current = this.activeTheme();
        const newTheme: Theme = current === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    private getStoredTheme(): Theme {
        const stored = localStorage.getItem(this.STORAGE_KEY) as Theme;
        return stored || 'auto';
    }

    private applyTheme(): void {
        const theme = this.theme();
        let activeTheme: 'light' | 'dark' = 'light';

        if (theme === 'auto') {
            activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
            activeTheme = theme;
        }

        this.activeTheme.set(activeTheme);
        document.documentElement.setAttribute('data-theme', activeTheme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(activeTheme);
    }
}
