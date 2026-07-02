// src/context/FavoritesContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const FavoritesContext = createContext();
const JSON_SERVER_URL = 'http://localhost:5000';

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load favorites from JSON Server
    const loadFavorites = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${JSON_SERVER_URL}/favorites`);
            setFavorites(response.data || []);
        } catch (err) {
            console.error('Error loading favorites:', err);
            setError('Failed to load favorites. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Add to favorites
    const addToFavorites = async (anime) => {
        try {
            // Check if already in favorites
            const exists = favorites.some(item => item.mal_id === anime.mal_id);
            if (exists) {
                return { success: false, message: 'Already in favorites' };
            }

            const response = await axios.post(`${JSON_SERVER_URL}/favorites`, {
                ...anime,
                addedAt: new Date().toISOString()
            });
            setFavorites([...favorites, response.data]);
            return { success: true, message: 'Added to favorites' };
        } catch (err) {
            console.error('Error adding to favorites:', err);
            return { success: false, message: 'Failed to add to favorites' };
        }
    };

    // Remove from favorites
    const removeFromFavorites = async (id) => {
        try {
            await axios.delete(`${JSON_SERVER_URL}/favorites/${id}`);
            setFavorites(favorites.filter(item => item.id !== id));
            return { success: true, message: 'Removed from favorites' };
        } catch (err) {
            console.error('Error removing from favorites:', err);
            return { success: false, message: 'Failed to remove from favorites' };
        }
    };

    // Check if anime is in favorites
    const isFavorite = (mal_id) => {
        return favorites.some(item => item.mal_id === mal_id);
    };

    // Get favorite by anime ID
    const getFavorite = (mal_id) => {
        return favorites.find(item => item.mal_id === mal_id);
    };

    // Clear all favorites
    const clearFavorites = async () => {
        try {
            await Promise.all(favorites.map(item => 
                axios.delete(`${JSON_SERVER_URL}/favorites/${item.id}`)
            ));
            setFavorites([]);
            return { success: true, message: 'All favorites cleared' };
        } catch (err) {
            console.error('Error clearing favorites:', err);
            return { success: false, message: 'Failed to clear favorites' };
        }
    };

    // Load favorites on mount
    useEffect(() => {
        loadFavorites();
    }, []);

    const value = {
        favorites,
        loading,
        error,
        loadFavorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        getFavorite,
        clearFavorites
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavoritesContext() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavoritesContext must be used within FavoritesProvider');
    }
    return context;
}