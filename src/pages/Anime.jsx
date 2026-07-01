// pages/Anime.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaStar, FaSearch, FaFilter, FaTimes, FaArrowLeft, FaArrowRight, FaFire } from 'react-icons/fa';
import { searchAnime, getTopAnime, getGenres } from '../api/homeApi';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/AnimeList.css';

function Anime() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [genres, setGenres] = useState([]);
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('score');

    const types = ['TV', 'Movie', 'OVA', 'Special', 'ONA', 'Music'];

    useEffect(() => {
        const page = parseInt(searchParams.get('page')) || 1;
        const query = searchParams.get('q') || '';
        const genre = searchParams.get('genre') || '';
        const type = searchParams.get('type') || '';
        const sort = searchParams.get('sort') || 'score';
        
        setCurrentPage(page);
        setSearchQuery(query);
        setSelectedGenre(genre);
        setSelectedType(type);
        setSortBy(sort);
        
        fetchAnime(page, query, genre, type, sort);
        fetchGenres();
    }, [searchParams]);

    const fetchAnime = async (page, query, genre, type, sort) => {
        try {
            setLoading(true);
            
            let response;
            if (query) {
                response = await searchAnime(query, page, 20);
            } else {
                // Use top anime as default
                response = await getTopAnime(page, 20);
            }
            
            // Filter by genre if selected
            let data = response.data || [];
            if (genre) {
                data = data.filter(anime => 
                    anime.genres?.some(g => g.mal_id === parseInt(genre))
                );
            }
            
            // Filter by type if selected
            if (type) {
                data = data.filter(anime => anime.type === type);
            }
            
            // Sort
            data.sort((a, b) => {
                if (sort === 'score') return (b.score || 0) - (a.score || 0);
                if (sort === 'popularity') return (a.popularity || 999999) - (b.popularity || 999999);
                if (sort === 'title') return (a.title || '').localeCompare(b.title || '');
                if (sort === 'recent') return (b.year || 0) - (a.year || 0);
                return 0;
            });
            
            setAnimeList(data);
            setTotalPages(Math.ceil((response.pagination?.items?.total || 0) / 20) || 1);
            setError(null);
        } catch (err) {
            setError('Failed to load anime. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchGenres = async () => {
        try {
            const response = await getGenres();
            setGenres(response.data);
        } catch (err) {
            console.error('Error fetching genres:', err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        updateFilters({ q: searchQuery, page: 1 });
    };

    const handleGenreChange = (genreId) => {
        setSelectedGenre(genreId);
        updateFilters({ genre: genreId, page: 1 });
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
        updateFilters({ type: type, page: 1 });
    };

    const handleSortChange = (sort) => {
        setSortBy(sort);
        updateFilters({ sort: sort, page: 1 });
    };

    const updateFilters = (updates) => {
        const params = new URLSearchParams(searchParams);
        Object.keys(updates).forEach(key => {
            if (updates[key]) {
                params.set(key, updates[key]);
            } else {
                params.delete(key);
            }
        });
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedGenre('');
        setSelectedType('');
        setSortBy('score');
        setSearchParams({});
    };

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        updateFilters({ page });
    };

    if (loading) {
        return <LoadingSpinner message="Loading anime..." size="large" />;
    }

    if (error) {
        return (
            <div className="anime-error-container">
                <h2>😕 {error}</h2>
                <button onClick={() => fetchAnime(currentPage, searchQuery, selectedGenre, selectedType, sortBy)} 
                        className="anime-retry-btn">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="anime-list-page">
            <div className="anime-list-header">
                <h1 className="anime-list-title">
                    <FaFire className="anime-list-icon" />
                    Anime Collection
                </h1>
                <p className="anime-list-subtitle">
                    Discover and explore thousands of anime
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="anime-search-bar">
                <form onSubmit={handleSearch} className="anime-search-form">
                    <FaSearch className="anime-search-icon" />
                    <input
                        type="text"
                        placeholder="Search anime by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="anime-search-input"
                    />
                    <button type="submit" className="anime-search-btn">
                        Search
                    </button>
                </form>
                
                <button 
                    className={`anime-filter-toggle ${showFilters ? 'active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <FaFilter />
                    Filters
                    {showFilters && <FaTimes />}
                </button>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="anime-filters">
                    <div className="anime-filter-group">
                        <label className="anime-filter-label">Genre</label>
                        <div className="anime-filter-options">
                            <button
                                className={`anime-filter-option ${!selectedGenre ? 'active' : ''}`}
                                onClick={() => handleGenreChange('')}
                            >
                                All
                            </button>
                            {genres.slice(0, 20).map((genre) => (
                                <button
                                    key={genre.mal_id}
                                    className={`anime-filter-option ${selectedGenre == genre.mal_id ? 'active' : ''}`}
                                    onClick={() => handleGenreChange(genre.mal_id)}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="anime-filter-group">
                        <label className="anime-filter-label">Type</label>
                        <div className="anime-filter-options">
                            <button
                                className={`anime-filter-option ${!selectedType ? 'active' : ''}`}
                                onClick={() => handleTypeChange('')}
                            >
                                All
                            </button>
                            {types.map((type) => (
                                <button
                                    key={type}
                                    className={`anime-filter-option ${selectedType === type ? 'active' : ''}`}
                                    onClick={() => handleTypeChange(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="anime-filter-group">
                        <label className="anime-filter-label">Sort By</label>
                        <div className="anime-filter-options">
                            <button
                                className={`anime-filter-option ${sortBy === 'score' ? 'active' : ''}`}
                                onClick={() => handleSortChange('score')}
                            >
                                Rating
                            </button>
                            <button
                                className={`anime-filter-option ${sortBy === 'popularity' ? 'active' : ''}`}
                                onClick={() => handleSortChange('popularity')}
                            >
                                Popularity
                            </button>
                            <button
                                className={`anime-filter-option ${sortBy === 'title' ? 'active' : ''}`}
                                onClick={() => handleSortChange('title')}
                            >
                                Title
                            </button>
                            <button
                                className={`anime-filter-option ${sortBy === 'recent' ? 'active' : ''}`}
                                onClick={() => handleSortChange('recent')}
                            >
                                Recent
                            </button>
                        </div>
                    </div>

                    <button className="anime-clear-filters" onClick={clearFilters}>
                        <FaTimes /> Clear All Filters
                    </button>
                </div>
            )}

            {/* Results Info */}
            <div className="anime-results-info">
                <span className="anime-results-count">
                    {animeList.length} anime found
                </span>
                {searchQuery && (
                    <span className="anime-results-query">
                        for "{searchQuery}"
                    </span>
                )}
            </div>

            {/* Anime Grid */}
            {animeList.length > 0 ? (
                <>
                    <div className="anime-grid">
                        {animeList.map((anime) => (
                            <div 
                                key={anime.mal_id}
                                onClick={() => navigate(`/anime/${anime.mal_id}`)}
                                className="anime-card"
                            >
                                <div className="anime-card-image">
                                    <img 
                                        src={anime.images?.jpg?.image_url || anime.images?.jpg?.large_image_url} 
                                        alt={anime.title}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x400/1a1a2e/666?text=No+Image';
                                        }}
                                    />
                                    <div className="anime-card-score">
                                        <FaStar className="star-icon" />
                                        <span>{anime.score?.toFixed(1) || 'N/A'}</span>
                                    </div>
                                    {anime.type && (
                                        <div className="anime-card-type">{anime.type}</div>
                                    )}
                                </div>
                                <div className="anime-card-content">
                                    <h3 className="anime-card-title">{anime.title}</h3>
                                    <div className="anime-card-info">
                                        <span className="anime-card-episodes">
                                            {anime.episodes || '?'} eps
                                        </span>
                                        <span className="anime-card-year">
                                            {anime.year || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="anime-pagination">
                        <button 
                            className={`anime-page-btn ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <FaArrowLeft /> Previous
                        </button>
                        
                        <div className="anime-page-numbers">
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
                                            className={`anime-page-number ${currentPage === pageNum ? 'active' : ''}`}
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
                            className={`anime-page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next <FaArrowRight />
                        </button>
                    </div>
                </>
            ) : (
                <div className="anime-empty-state">
                    <span className="anime-empty-icon">🔍</span>
                    <h3>No anime found</h3>
                    <p>Try adjusting your search or filters</p>
                    <button onClick={clearFilters} className="anime-empty-btn">
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}

export default Anime;