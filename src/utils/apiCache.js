// src/utils/apiCache.js
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class ApiCache {
    constructor() {
        this.cache = new Map();
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        const now = Date.now();
        if (now - item.timestamp > CACHE_DURATION) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    }

    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clear() {
        this.cache.clear();
    }

    // Save to localStorage for persistence
    saveToStorage() {
        try {
            const data = {};
            for (const [key, value] of this.cache.entries()) {
                data[key] = value;
            }
            localStorage.setItem('animeCache', JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save cache:', e);
        }
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('animeCache');
            if (stored) {
                const data = JSON.parse(stored);
                const now = Date.now();
                for (const [key, value] of Object.entries(data)) {
                    if (now - value.timestamp <= CACHE_DURATION) {
                        this.cache.set(key, value);
                    }
                }
            }
        } catch (e) {
            console.error('Failed to load cache:', e);
        }
    }
}

export const apiCache = new ApiCache();

// Load cache on startup
apiCache.loadFromStorage();

// Save cache periodically
setInterval(() => {
    apiCache.saveToStorage();
}, 60000); // Every minute