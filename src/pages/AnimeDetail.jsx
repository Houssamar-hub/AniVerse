// pages/AnimeDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FaArrowLeft, FaStar, FaHeart, FaBookmark, FaCalendar, 
    FaClock, FaPlay, FaUsers, FaTv, FaFilm, FaList, 
    FaInfoCircle, FaFilter
} from 'react-icons/fa';
import { getAnimeById, getAnimeCharacters } from '../api/homeApi';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useLibraryContext } from '../context/LibraryContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/AnimeDetail.css';

function AnimeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToFavorites, removeFromFavorites, isFavorite, getFavorite } = useFavoritesContext();
    const { addToLibrary, isInLibrary, getLibraryItem, updateLibraryStatus, removeFromLibrary } = useLibraryContext();
    
    const [anime, setAnime] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const [showTrailer, setShowTrailer] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [libraryLoading, setLibraryLoading] = useState(false);
    const [showLibraryModal, setShowLibraryModal] = useState(false);

    useEffect(() => {
        fetchAnimeData();
    }, [id]);

    const fetchAnimeData = async () => {
        try {
            setLoading(true);
            const animeRes = await getAnimeById(id);
            setAnime(animeRes.data);
            
            setTimeout(async () => {
                try {
                    const charRes = await getAnimeCharacters(id);
                    setCharacters(charRes.data.slice(0, 6));
                } catch (err) {
                    console.error('Error fetching characters:', err);
                }
                setLoading(false);
            }, 300);
            
            setError(null);
        } catch (err) {
            setError('Failed to load anime details. Please try again.');
            console.error(err);
            setLoading(false);
        }
    };

    const handleFavoriteToggle = async () => {
        if (!anime) return;
        
        setFavoriteLoading(true);
        
        if (isFavorite(anime.mal_id)) {
            const fav = getFavorite(anime.mal_id);
            if (fav) {
                await removeFromFavorites(fav.id);
            }
        } else {
            await addToFavorites(anime);
        }
        
        setFavoriteLoading(false);
    };

    const handleLibraryToggle = async () => {
        if (!anime) return;
        
        if (isInLibrary(anime.mal_id)) {
            setShowLibraryModal(true);
        } else {
            setLibraryLoading(true);
            await addToLibrary(anime, 'plan_to_watch');
            setLibraryLoading(false);
        }
    };

    const handleLibraryStatusChange = async (status) => {
        const item = getLibraryItem(anime.mal_id);
        if (item) {
            setLibraryLoading(true);
            await updateLibraryStatus(item.id, status);
            setLibraryLoading(false);
        }
        setShowLibraryModal(false);
    };

    const handleRemoveFromLibrary = async () => {
        const item = getLibraryItem(anime.mal_id);
        if (item) {
            setLibraryLoading(true);
            await removeFromLibrary(item.id);
            setLibraryLoading(false);
        }
        setShowLibraryModal(false);
    };

    const handleRating = (rating) => {
        setUserRating(rating);
    };

    if (loading) {
        return <LoadingSpinner message="Loading anime details..." size="large" />;
    }

    if (error || !anime) {
        return (
            <div className="detail-error-container">
                <h2>😕 {error || 'Anime not found'}</h2>
                <button onClick={() => navigate('/anime')} className="detail-back-btn">
                    <FaArrowLeft /> Back to Anime
                </button>
            </div>
        );
    }

    const libraryItem = getLibraryItem(anime.mal_id);
    const libraryStatus = libraryItem?.status || null;

    const statusLabels = {
        plan_to_watch: '📅 Plan to Watch',
        watching: '▶️ Watching',
        completed: '✅ Completed'
    };

    return (
        <div className="anime-detail-page">
            <button onClick={() => navigate(-1)} className="detail-back-btn top">
                <FaArrowLeft /> Back
            </button>

            {/* Hero Section */}
            <div className="detail-hero">
                <div 
                    className="detail-hero-background"
                    style={{
                        backgroundImage: `url(${anime.images.jpg.large_image_url || anime.images.jpg.image_url})`
                    }}
                ></div>
                <div className="detail-hero-overlay"></div>
                
                <div className="detail-hero-content">
                    <div className="detail-hero-left">
                        <img 
                            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url} 
                            alt={anime.title}
                            className="detail-poster"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x400/1a1a2e/666?text=No+Image';
                            }}
                        />
                    </div>
                    
                    <div className="detail-hero-right">
                        <h1 className="detail-title">{anime.title}</h1>
                        {anime.title_english && anime.title_english !== anime.title && (
                            <h2 className="detail-title-english">{anime.title_english}</h2>
                        )}
                        {anime.title_japanese && (
                            <h3 className="detail-title-japanese">{anime.title_japanese}</h3>
                        )}
                        
                        <div className="detail-meta">
                            <span className="detail-score">
                                <FaStar className="detail-star" />
                                {anime.score || 'N/A'} 
                                <span className="detail-score-by">({anime.scored_by?.toLocaleString() || 0} users)</span>
                            </span>
                            <span className="detail-meta-divider">•</span>
                            <span className="detail-rank">Rank #{anime.rank || 'N/A'}</span>
                            <span className="detail-meta-divider">•</span>
                            <span className="detail-popularity">Popularity #{anime.popularity || 'N/A'}</span>
                        </div>
                        
                        <div className="detail-info-grid">
                            <div className="detail-info-item">
                                <FaTv className="detail-info-icon" />
                                <span>{anime.type || 'Unknown'}</span>
                            </div>
                            <div className="detail-info-item">
                                <FaFilm className="detail-info-icon" />
                                <span>{anime.episodes || '?'} Episodes</span>
                            </div>
                            <div className="detail-info-item">
                                <FaClock className="detail-info-icon" />
                                <span>{anime.duration || 'Unknown'}</span>
                            </div>
                            <div className="detail-info-item">
                                <FaCalendar className="detail-info-icon" />
                                <span>{anime.year || 'N/A'}</span>
                            </div>
                            <div className="detail-info-item">
                                <FaUsers className="detail-info-icon" />
                                <span>{anime.members?.toLocaleString() || 0} Members</span>
                            </div>
                            <div className="detail-info-item">
                                <FaList className="detail-info-icon" />
                                <span className="detail-status">{anime.status || 'Unknown'}</span>
                            </div>
                        </div>
                        
                        <div className="detail-genres">
                            {anime.genres?.map((genre) => (
                                <span key={genre.mal_id} className="detail-genre-tag">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                        
                        <div className="detail-actions">
                            {/* Favorite Button */}
                            <button 
                                className={`detail-action-btn favorite ${isFavorite(anime.mal_id) ? 'active' : ''}`}
                                onClick={handleFavoriteToggle}
                                disabled={favoriteLoading}
                            >
                                <FaHeart />
                                {favoriteLoading ? 'Loading...' : (isFavorite(anime.mal_id) ? 'Remove from Favorites' : 'Add to Favorites')}
                            </button>
                            
                            {/* Library Button */}
                            <button 
                                className={`detail-action-btn library ${isInLibrary(anime.mal_id) ? 'active' : ''}`}
                                onClick={handleLibraryToggle}
                                disabled={libraryLoading}
                            >
                                <FaBookmark />
                                {libraryLoading ? 'Loading...' : (isInLibrary(anime.mal_id) ? 'In Library' : 'Add to Library')}
                            </button>
                            
                            {anime.trailer?.url && (
                                <button 
                                    className="detail-action-btn trailer"
                                    onClick={() => setShowTrailer(true)}
                                >
                                    <FaPlay />
                                    Watch Trailer
                                </button>
                            )}
                        </div>

                        {/* Library Status Display */}
                        {isInLibrary(anime.mal_id) && libraryStatus && (
                            <div className="detail-library-status">
                                <span className="detail-library-status-label">Status:</span>
                                <span className={`detail-library-status-badge ${libraryStatus}`}>
                                    {statusLabels[libraryStatus] || libraryStatus}
                                </span>
                            </div>
                        )}
                        
                        <div className="detail-rating">
                            <span className="detail-rating-label">Your Rating:</span>
                            <div className="detail-rating-stars">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                    <span
                                        key={star}
                                        className={`detail-rating-star ${userRating >= star ? 'active' : ''}`}
                                        onClick={() => handleRating(star)}
                                    >
                                        {userRating >= star ? '⭐' : '☆'}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Synopsis Section */}
            <div className="detail-section">
                <h2 className="detail-section-title">
                    <FaInfoCircle className="detail-section-icon" />
                    Synopsis
                </h2>
                <p className="detail-synopsis">{anime.synopsis || 'No synopsis available.'}</p>
            </div>

            {/* Studio & Producers */}
            <div className="detail-section">
                <h2 className="detail-section-title">
                    <FaUsers className="detail-section-icon" />
                    Studio & Producers
                </h2>
                <div className="detail-studio-grid">
                    {anime.studios?.map((studio) => (
                        <span key={studio.mal_id} className="detail-studio-tag">
                            {studio.name}
                        </span>
                    ))}
                    {anime.producers?.map((producer) => (
                        <span key={producer.mal_id} className="detail-producer-tag">
                            {producer.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Characters Section */}
            {characters.length > 0 && (
                <div className="detail-section">
                    <h2 className="detail-section-title">
                        <FaUsers className="detail-section-icon" />
                        Characters
                    </h2>
                    <div className="detail-characters-grid">
                        {characters.map((char) => (
                            <div 
                                key={char.character.mal_id}
                                className="detail-character-card"
                                onClick={() => navigate(`/characters/${char.character.mal_id}`)}
                            >
                                <img 
                                    src={char.character.images.jpg.image_url} 
                                    alt={char.character.name}
                                    className="detail-character-image"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/100x140/1a1a2e/666?text=No+Image';
                                    }}
                                />
                                <div className="detail-character-info">
                                    <h4 className="detail-character-name">{char.character.name}</h4>
                                    <span className="detail-character-role">{char.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={() => navigate(`/anime/${id}/characters`)}
                        className="detail-view-all-btn"
                    >
                        View All Characters
                    </button>
                </div>
            )}

            {/* Trailer Modal */}
            {showTrailer && anime.trailer?.url && (
                <div className="detail-trailer-modal" onClick={() => setShowTrailer(false)}>
                    <div className="detail-trailer-content" onClick={(e) => e.stopPropagation()}>
                        <button className="detail-trailer-close" onClick={() => setShowTrailer(false)}>
                            ✕
                        </button>
                        <iframe
                            src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                            title="Trailer"
                            className="detail-trailer-iframe"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            {/* Library Status Modal */}
            {showLibraryModal && (
                <div className="detail-modal-overlay" onClick={() => setShowLibraryModal(false)}>
                    <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Update Library Status</h3>
                        <p>Change status for "{anime.title}"</p>
                        <div className="detail-modal-options">
                            <button
                                className={`detail-modal-option ${libraryStatus === 'plan_to_watch' ? 'active' : ''}`}
                                onClick={() => handleLibraryStatusChange('plan_to_watch')}
                            >
                                📅 Plan to Watch
                                {libraryStatus === 'plan_to_watch' && <span className="detail-modal-check">✓</span>}
                            </button>
                            <button
                                className={`detail-modal-option ${libraryStatus === 'watching' ? 'active' : ''}`}
                                onClick={() => handleLibraryStatusChange('watching')}
                            >
                                ▶️ Watching
                                {libraryStatus === 'watching' && <span className="detail-modal-check">✓</span>}
                            </button>
                            <button
                                className={`detail-modal-option ${libraryStatus === 'completed' ? 'active' : ''}`}
                                onClick={() => handleLibraryStatusChange('completed')}
                            >
                                ✅ Completed
                                {libraryStatus === 'completed' && <span className="detail-modal-check">✓</span>}
                            </button>
                            <button
                                className="detail-modal-option remove"
                                onClick={handleRemoveFromLibrary}
                            >
                                🗑️ Remove from Library
                            </button>
                        </div>
                        <button 
                            className="detail-modal-cancel"
                            onClick={() => setShowLibraryModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnimeDetail;