// src/context/LibraryContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const LibraryContext = createContext();
const JSON_SERVER_URL = 'http://localhost:5000';

export function LibraryProvider({ children }) {
    const [library, setLibrary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, watching, completed, plan_to_watch

    // Load from localStorage (fallback)
    const loadFromLocalStorage = () => {
        try {
            const saved = localStorage.getItem('library');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {}
        return [];
    };

    // Save to localStorage
    const saveToLocalStorage = (data) => {
        try {
            localStorage.setItem('library', JSON.stringify(data));
        } catch (e) {}
    };

    // Load library from JSON Server
    const loadLibrary = async () => {
        try {
            setLoading(true);
            setError(null);
            
            try {
                const response = await axios.get(`${JSON_SERVER_URL}/library`, {
                    timeout: 3000
                });
                if (response.data) {
                    setLibrary(response.data);
                    saveToLocalStorage(response.data);
                }
            } catch (err) {
                console.error('Error loading from server:', err);
                const localData = loadFromLocalStorage();
                if (localData.length > 0) {
                    setLibrary(localData);
                    setError('Using cached library (server unavailable)');
                } else {
                    setError('Failed to load library. Please check if JSON Server is running.');
                }
            }
        } catch (err) {
            console.error('Error loading library:', err);
            setError('Failed to load library');
        } finally {
            setLoading(false);
        }
    };

    // Add to library
    const addToLibrary = async (anime, status = 'plan_to_watch') => {
        try {
            const exists = library.some(item => item.mal_id === anime.mal_id);
            if (exists) {
                return { success: false, message: 'Already in library' };
            }

            const newItem = {
                ...anime,
                id: Date.now(),
                status: status,
                addedAt: new Date().toISOString()
            };

            try {
                const response = await axios.post(`${JSON_SERVER_URL}/library`, newItem);
                const updated = [...library, response.data];
                setLibrary(updated);
                saveToLocalStorage(updated);
                return { success: true, message: 'Added to library' };
            } catch (err) {
                const updated = [...library, newItem];
                setLibrary(updated);
                saveToLocalStorage(updated);
                return { success: true, message: 'Added to library (offline mode)' };
            }
        } catch (err) {
            console.error('Error adding to library:', err);
            return { success: false, message: 'Failed to add to library' };
        }
    };

    // Update library status
    const updateLibraryStatus = async (id, newStatus) => {
        try {
            const item = library.find(item => item.id === id);
            if (!item) {
                return { success: false, message: 'Item not found' };
            }

            const updatedItem = { ...item, status: newStatus };

            try {
                await axios.put(`${JSON_SERVER_URL}/library/${id}`, updatedItem);
            } catch (err) {
                console.log('Server update failed, using local only');
            }

            const updated = library.map(item => 
                item.id === id ? updatedItem : item
            );
            setLibrary(updated);
            saveToLocalStorage(updated);
            return { success: true, message: 'Status updated' };
        } catch (err) {
            console.error('Error updating library:', err);
            return { success: false, message: 'Failed to update status' };
        }
    };

    // Remove from library
    const removeFromLibrary = async (id) => {
        try {
            try {
                await axios.delete(`${JSON_SERVER_URL}/library/${id}`);
            } catch (err) {
                console.log('Server delete failed, using local only');
            }

            const updated = library.filter(item => item.id !== id);
            setLibrary(updated);
            saveToLocalStorage(updated);
            return { success: true, message: 'Removed from library' };
        } catch (err) {
            console.error('Error removing from library:', err);
            return { success: false, message: 'Failed to remove from library' };
        }
    };

    // Get library status for an anime
    const getLibraryStatus = (mal_id) => {
        const item = library.find(item => item.mal_id === mal_id);
        return item ? item.status : null;
    };

    // Check if anime is in library
    const isInLibrary = (mal_id) => {
        return library.some(item => item.mal_id === mal_id);
    };

    // Get library item by anime ID
    const getLibraryItem = (mal_id) => {
        return library.find(item => item.mal_id === mal_id);
    };

    // Filter library by status
    const getFilteredLibrary = () => {
        if (filter === 'all') return library;
        return library.filter(item => item.status === filter);
    };

    // Get counts by status
    const getStatusCounts = () => {
        const counts = {
            all: library.length,
            plan_to_watch: 0,
            watching: 0,
            completed: 0
        };
        library.forEach(item => {
            if (counts[item.status] !== undefined) {
                counts[item.status]++;
            }
        });
        return counts;
    };

    useEffect(() => {
        loadLibrary();
    }, []);

    const value = {
        library,
        loading,
        error,
        filter,
        setFilter,
        loadLibrary,
        addToLibrary,
        updateLibraryStatus,
        removeFromLibrary,
        getLibraryStatus,
        isInLibrary,
        getLibraryItem,
        getFilteredLibrary,
        getStatusCounts
    };

    return (
        <LibraryContext.Provider value={value}>
            {children}
        </LibraryContext.Provider>
    );
}

export function useLibraryContext() {
    const context = useContext(LibraryContext);
    if (!context) {
        throw new Error('useLibraryContext must be used within LibraryProvider');
    }
    return context;
}