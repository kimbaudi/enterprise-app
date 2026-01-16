import { Injectable } from '@angular/core';

/**
 * Service for managing browser storage (localStorage and sessionStorage)
 * Provides type-safe storage operations with error handling
 */
@Injectable({
    providedIn: 'root',
})
export class StorageService {
    /**
     * Get item from localStorage
     */
    get<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error getting item from localStorage: ${key}`, error);
            return null;
        }
    }

    /**
     * Set item in localStorage
     */
    set<T>(key: string, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting item in localStorage: ${key}`, error);
        }
    }

    /**
     * Remove item from localStorage
     */
    remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing item from localStorage: ${key}`, error);
        }
    }

    /**
     * Clear all items from localStorage
     */
    clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage', error);
        }
    }

    /**
     * Check if key exists in localStorage
     */
    has(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    /**
     * Get item from sessionStorage
     */
    getSession<T>(key: string): T | null {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error getting item from sessionStorage: ${key}`, error);
            return null;
        }
    }

    /**
     * Set item in sessionStorage
     */
    setSession<T>(key: string, value: T): void {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting item in sessionStorage: ${key}`, error);
        }
    }

    /**
     * Remove item from sessionStorage
     */
    removeSession(key: string): void {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing item from sessionStorage: ${key}`, error);
        }
    }

    /**
     * Clear all items from sessionStorage
     */
    clearSession(): void {
        try {
            sessionStorage.clear();
        } catch (error) {
            console.error('Error clearing sessionStorage', error);
        }
    }

    /**
     * Get storage size in bytes (approximate)
     */
    getStorageSize(): number {
        let size = 0;
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                size += localStorage[key].length + key.length;
            }
        }
        return size;
    }

    /**
     * Check if storage is available
     */
    isStorageAvailable(type: 'localStorage' | 'sessionStorage' = 'localStorage'): boolean {
        try {
            const storage = type === 'localStorage' ? localStorage : sessionStorage;
            const testKey = '__storage_test__';
            storage.setItem(testKey, 'test');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }
}
