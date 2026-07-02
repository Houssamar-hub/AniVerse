// pages/Favorites.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaStar, FaTrash, FaArrowLeft, FaBookmark, FaClock, FaCheck, FaPlay } from 'react-icons/fa';
import { useFavoritesContext } from '../context/FavoritesContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Favorites.css';

function Favorites() {
    const navigate = useNavigate();
    const { favorites, loading, error, removeFromFavorites, clearFavorites, loadFavorites } = useFavoritesContext();
    const [removingId, setRemovingId] = useState(null);
    const [showClearModal, setShowClearModal] = useState(false);

    const handleRemove = async (id, mal_id) => {
        setRemovingId(id);
        const result = await removeFromFavorites(id);
        setRemovingId(null);
        if (!result.success) {
            alert(result.message);
        }
    };

    const handleClearAll = async () => {
        const result = await clearFavorites();
        setShowClearModal(false);
        if (!result.success) {
            alert(result.message);
        }
    };

    const handleRetry = () => {
        loadFavorites();
    };

    if (loading) {
        return <LoadingSpinner message="Loading favorites..." size="large" />;
    }

    if (error) {
        return (
            <div className="favorites-error-container">
                <div className="favorites-error-icon">⚠️</div>
                <h2>{error}</h2>
                <button onClick={handleRetry} className="favorites-retry-btn">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="favorites-page">
            <div className="favorites-header">
                <div className="favorites-header-left">
                    <h1 className="favorites-title">
                        <FaHeart className="favorites-icon" />
                        My Favorites
                    </h1>
                    <span className="favorites-count">{favorites.length} anime</span>
                </div>
                {favorites.length > 0 && (
                    <button 
                        className="favorites-clear-btn"
                        onClick={() => setShowClearModal(true)}
                    >
                        <FaTrash /> Clear All
                    </button>
                )}
            </div>

            {favorites.length === 0 ? (
                <div className="favorites-empty-state">
                    <div className="favorites-empty-icon">💔</div>
                    <h3>No favorites yet</h3>
                    <p>Start adding your favorite anime to keep track of them.</p>
                    <button onClick={() => navigate('/anime')} className="favorites-empty-btn">
                        Browse Anime
                    </button>
                </div>
            ) : (
                <div className="favorites-grid">
                    {favorites.map((anime) => (
                        <div key={anime.id} className="favorite-card">
                            <div 
                                className="favorite-card-image"
                                onClick={() => navigate(`/anime/${anime.mal_id}`)}
                            >
                                <img 
                                    src={anime.images?.jpg?.image_url} 
                                    alt={anime.title}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x400/1a1a2e/666?text=No+Image';
                                    }}
                                />
                                <div className="favorite-card-overlay">
                                    <button 
                                        className="favorite-card-view"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/anime/${anime.mal_id}`);
                                        }}
                                    >
                                        <FaPlay /> View Details
                                    </button>
                                </div>
                                <div className="favorite-card-score">
                                    <FaStar className="favorite-star" />
                                    <span>{anime.score || 'N/A'}</span>
                                </div>
                            </div>
                            
                            <div className="favorite-card-content">
                                <h3 
                                    className="favorite-card-title"
                                    onClick={() => navigate(`/anime/${anime.mal_id}`)}
                                >
                                    {anime.title}
                                </h3>
                                
                                <div className="favorite-card-info">
                                    <span className="favorite-card-episodes">
                                        {anime.episodes || '?'} eps
                                    </span>
                                    <span className="favorite-card-year">
                                        {anime.year || 'N/A'}
                                    </span>
                                </div>

                                <div className="favorite-card-actions">
                                    <button 
                                        className="favorite-card-remove"
                                        onClick={() => handleRemove(anime.id, anime.mal_id)}
                                        disabled={removingId === anime.id}
                                    >
                                        {removingId === anime.id ? (
                                            <span className="favorite-removing">Removing...</span>
                                        ) : (
                                            <>
                                                <FaTrash /> Remove
                                            </>
                                        )}
                                    </button>
                                    <span className="favorite-card-added">
                                        <FaClock /> {new Date(anime.addedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Clear All Modal */}
            {showClearModal && (
                <div className="favorites-modal-overlay" onClick={() => setShowClearModal(false)}>
                    <div className="favorites-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="favorites-modal-icon">⚠️</div>
                        <h3>Clear All Favorites?</h3>
                        <p>This will remove all anime from your favorites list. This action cannot be undone.</p>
                        <div className="favorites-modal-actions">
                            <button 
                                className="favorites-modal-cancel"
                                onClick={() => setShowClearModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="favorites-modal-confirm"
                                onClick={handleClearAll}
                            >
                                Yes, Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Favorites;