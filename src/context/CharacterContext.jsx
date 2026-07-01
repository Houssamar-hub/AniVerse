// src/context/CharacterContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getCharacters, searchCharacters, getCharacterById } from '../api/homeApi';

const CharacterContext = createContext();

export function CharacterProvider({ children }) {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    const fetchCharacters = async (page = 1, query = '') => {
        try {
            setLoading(true);
            setError(null);
            
            let response;
            if (query) {
                response = await searchCharacters(query, page);
            } else {
                response = await getCharacters(page);
            }
            
            setCharacters(response.data || []);
            setTotalPages(Math.ceil((response.pagination?.items?.total || 0) / 25) || 1);
            setCurrentPage(page);
        } catch (err) {
            console.error('Error fetching characters:', err);
            setError('Failed to load characters. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCharacterById = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getCharacterById(id);
            setSelectedCharacter(response.data);
            return response.data;
        } catch (err) {
            console.error('Error fetching character:', err);
            setError('Failed to load character details.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const searchCharactersList = async (query) => {
        setSearchQuery(query);
        await fetchCharacters(1, query);
    };

    const goToPage = async (page) => {
        if (page < 1 || page > totalPages) return;
        await fetchCharacters(page, searchQuery);
    };

    const clearSearch = () => {
        setSearchQuery('');
        fetchCharacters(1, '');
    };

    useEffect(() => {
        fetchCharacters(1, '');
    }, []);

    const value = {
        characters,
        loading,
        error,
        searchQuery,
        currentPage,
        totalPages,
        selectedCharacter,
        fetchCharacters,
        fetchCharacterById,
        searchCharactersList,
        goToPage,
        clearSearch,
        setSelectedCharacter
    };

    return (
        <CharacterContext.Provider value={value}>
            {children}
        </CharacterContext.Provider>
    );
}

export function useCharacterContext() {
    const context = useContext(CharacterContext);
    if (!context) {
        throw new Error('useCharacterContext must be used within CharacterProvider');
    }
    return context;
}