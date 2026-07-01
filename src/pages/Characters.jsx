// pages/Characters.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaArrowLeft, FaArrowRight, FaUser } from 'react-icons/fa';
import { useCharacterContext } from '../context/CharacterContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Characters.css';

function Characters() {
    const navigate = useNavigate();
    const {
        characters,
        loading,
        error,
        searchQuery,
        currentPage,
        totalPages,
        searchCharactersList,
        goToPage,
        clearSearch
    } = useCharacterContext();

    const [localSearch, setLocalSearch] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (localSearch.trim()) {
            searchCharactersList(localSearch.trim());
        } else {
            clearSearch();
        }
    };

    const handleClearSearch = () => {
        setLocalSearch('');
        clearSearch();
    };

    if (loading && characters.length === 0) {
        return <LoadingSpinner message="Loading characters..." size="large" />;
    }

    if (error && characters.length === 0) {
        return (
            <div className="characters-error-container">
                <div className="characters-error-icon">⚠️</div>
                <h2>{error}</h2>
                <button onClick={() => searchCharactersList('')} className="characters-retry-btn">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="characters-page">
            <div className="characters-header">
                <h1 className="characters-title">
                    <FaUser className="characters-icon" />
                    Characters
                </h1>
                <p className="characters-subtitle">
                    Explore your favorite anime characters
                </p>
            </div>

            <div className="characters-search-bar">
                <form onSubmit={handleSearch} className="characters-search-form">
                    <FaSearch className="characters-search-icon" />
                    <input
                        type="text"
                        placeholder="Search characters by name..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="characters-search-input"
                    />
                    {localSearch && (
                        <button type="button" onClick={handleClearSearch} className="characters-search-clear">
                            <FaTimes />
                        </button>
                    )}
                    <button type="submit" className="characters-search-btn">
                        Search
                    </button>
                </form>
            </div>

            <div className="characters-results-info">
                <span className="characters-results-count">
                    {characters.length} characters found
                </span>
                {searchQuery && (
                    <span className="characters-results-query">
                        for "{searchQuery}"
                    </span>
                )}
            </div>

            {characters.length > 0 ? (
                <>
                    <div className="characters-grid">
                        {characters.map((character) => (
                            <div 
                                key={character.mal_id}
                                onClick={() => navigate(`/characters/${character.mal_id}`)}
                                className="character-card"
                            >
                                <div className="character-card-image">
                                    <img 
                                        src={character.images?.jpg?.image_url} 
                                        alt={character.name}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/200x200/1a1a2e/666?text=No+Image';
                                        }}
                                    />
                                    <div className="character-card-favorites">
                                        ❤️ {character.favorites || 0}
                                    </div>
                                </div>
                                <div className="character-card-content">
                                    <h3 className="character-card-name">{character.name}</h3>
                                    {character.name_kanji && (
                                        <span className="character-card-kanji">{character.name_kanji}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="characters-pagination">
                            <button 
                                className={`characters-page-btn ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <FaArrowLeft /> Previous
                            </button>
                            
                            <div className="characters-page-numbers">
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    
                                    if (pageNum > 0 && pageNum <= totalPages) {
                                        return (
                                            <button
                                                key={pageNum}
                                                className={`characters-page-number ${currentPage === pageNum ? 'active' : ''}`}
                                                onClick={() => goToPage(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            
                            <button 
                                className={`characters-page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next <FaArrowRight />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="characters-empty-state">
                    <span className="characters-empty-icon">🔍</span>
                    <h3>No characters found</h3>
                    <p>Try adjusting your search or clear filters</p>
                    <button onClick={clearSearch} className="characters-empty-btn">
                        Clear Search
                    </button>
                </div>
            )}
        </div>
    );
}

export default Characters;