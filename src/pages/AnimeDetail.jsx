// pages/AnimeDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaHeart, FaBookmark, FaCalendar, FaClock, FaPlay, FaUsers, FaTv, FaFilm, FaList, FaInfoCircle } from 'react-icons/fa';
import { getAnimeById, getAnimeCharacters } from '../api/homeApi';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/AnimeDetail.css';

function AnimeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [anime, setAnime] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isInLibrary, setIsInLibrary] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [showTrailer, setShowTrailer] = useState(false);

    useEffect(() => {
        fetchAnimeData();
    }, [id]);

    const fetchAnimeData = async () => {
        try {
            setLoading(true);
            
            // Fetch anime details
            const animeRes = await getAnimeById(id);
            setAnime(animeRes.data);
            
            // Fetch characters
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

    const handleAddToFavorites = () => {
        setIsFavorite(!isFavorite);
        // TODO: Add to JSON Server
    };

    const handleAddToLibrary = () => {
        setIsInLibrary(!isInLibrary);
        // TODO: Add to JSON Server
    };

    const handleRating = (rating) => {
        setUserRating(rating);
        // TODO: Save to JSON Server
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

    return (
        <div className="anime-detail-page">
            {/* Back Button */}
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
                            <button 
                                className={`detail-action-btn ${isFavorite ? 'active' : ''}`}
                                onClick={handleAddToFavorites}
                            >
                                <FaHeart />
                                {isFavorite ? 'Favorited' : 'Add to Favorites'}
                            </button>
                            <button 
                                className={`detail-action-btn ${isInLibrary ? 'active' : ''}`}
                                onClick={handleAddToLibrary}
                            >
                                <FaBookmark />
                                {isInLibrary ? 'In Library' : 'Add to Library'}
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
        </div>
    );
}

export default AnimeDetail;