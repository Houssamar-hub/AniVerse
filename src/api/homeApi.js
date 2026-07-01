// src/api/homeApi.js
import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4/";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Save data to localStorage
const saveToCache = (key, data) => {
    try {
        localStorage.setItem(`anime_${key}`, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (e) {}
};

// Get data from localStorage
const getFromCache = (key) => {
    try {
        const cached = localStorage.getItem(`anime_${key}`);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < 3600000) {
                return parsed.data;
            }
        }
        return null;
    } catch (e) {
        return null;
    }
};

// ============================================
// ANIME API
// ============================================

export const getTopAnime = async () => {
    const cacheKey = `topAnime`;
    
    const cached = getFromCache(cacheKey);
    if (cached) {
        return cached;
    }
    
    try {
        await delay(500);
        const response = await axios.get(`${BASE_URL}top/anime`, {
            timeout: 30000
        });
        saveToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        const cachedAgain = getFromCache(cacheKey);
        if (cachedAgain) return cachedAgain;
        throw error;
    }
};

export const getUpcomingAnime = async () => {
    const cacheKey = `upcomingAnime`;
    
    const cached = getFromCache(cacheKey);
    if (cached) {
        return cached;
    }
    
    try {
        await delay(500);
        const response = await axios.get(`${BASE_URL}seasons/upcoming`, {
          
            timeout: 30000
        });
        saveToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        const cachedAgain = getFromCache(cacheKey);
        if (cachedAgain) return cachedAgain;
        throw error;
    }
};

export const getAnimeById = async (id) => {
    const cacheKey = `anime_${id}`;
    
    const cached = getFromCache(cacheKey);
    if (cached) {
        return cached;
    }
    
    try {
        await delay(300);
        const response = await axios.get(`${BASE_URL}anime/${id}`, {
            timeout: 30000
        });
        saveToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        const cachedAgain = getFromCache(cacheKey);
        if (cachedAgain) return cachedAgain;
        throw error;
    }
};

export const getAnimeCharacters = async (id) => {
    const cacheKey = `animeCharacters_${id}`;
    
    const cached = getFromCache(cacheKey);
    if (cached) {
        return cached;
    }
    
    try {
        await delay(300);
        const response = await axios.get(`${BASE_URL}anime/${id}/characters`, {
            timeout: 30000
        });
        saveToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        const cachedAgain = getFromCache(cacheKey);
        if (cachedAgain) return cachedAgain;
        throw error;
    }
};

export const searchAnime = async (query) => {
    const cacheKey = `search_${query}`;
    
    const cached = getFromCache(cacheKey);
    if (cached) {
        return cached;
    }
    
    try {
        await delay(500);
        const response = await axios.get(`${BASE_URL}anime`, {
            params: { q: query},
            timeout: 30000
        });
        saveToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        const cachedAgain = getFromCache(cacheKey);
        if (cachedAgain) return cachedAgain;
        throw error;
    }
};

export const getGenres = async () => {
    const cacheKey = 'genres';
    
    const cached = getFromCache(cacheKey);
    if (cached) {
        return cached;
    }
    
    try {
        await delay(300);
        const response = await axios.get(`${BASE_URL}genres/anime`, {
            timeout: 30000
        });
        saveToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        const cachedAgain = getFromCache(cacheKey);
        if (cachedAgain) return cachedAgain;
        throw error;
    }
};

// ============================================
// CHARACTERS API
// ============================================

export const getCharacters = async () => {
    const cacheKey = `characters`;
    
    const cached = getFromCache(cacheKey);
    if (cached) {
        return cached;
    }
    
    try {
        await delay(500);
        const response = await axios.get(`${BASE_URL}characters`, {
            timeout: 30000
        });
        saveToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        const cachedAgain = getFromCache(cacheKey);
        if (cachedAgain) return cachedAgain;
        throw error;
    }
};

export const searchCharacters = async (query, ) => {
    const cacheKey = `searchCharacters_${query}`;
    
    const cached = getFromCache(cacheKey);
    if (cached) {
        return cached;
    }
    
    try {
        await delay(500);
        const response = await axios.get(`${BASE_URL}characters`, {
            params: { q: query },
            timeout: 30000
        });
        saveToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        const cachedAgain = getFromCache(cacheKey);
        if (cachedAgain) return cachedAgain;
        throw error;
    }
};

export const getCharacterById = async (id) => {
    const cacheKey = `character_${id}`;
    
    const cached = getFromCache(cacheKey);
    if (cached) {
        console.log('✅ Using cached character:', id);
        return cached;
    }
    
    try {
        await delay(300);
        const response = await axios.get(`${BASE_URL}characters/${id}`, {
            timeout: 30000
        });
        saveToCache(cacheKey, response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching character:', error.message);
        const cachedAgain = getFromCache(cacheKey);
        if (cachedAgain) {
            console.log('✅ Using cached character (fallback):', id);
            return cachedAgain;
        }
        throw error;
    }
};

// ============================================
// UTILITY
// ============================================

export const clearAnimeCache = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith('anime_')) {
            localStorage.removeItem(key);
        }
    });
    console.log('🗑️ Cache cleared');
};