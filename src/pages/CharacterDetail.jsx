// pages/CharacterDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaUsers, FaStar, FaCalendar, FaInfoCircle, FaLink } from 'react-icons/fa';
import { getCharacterById } from '../api/homeApi';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/CharacterDetail.css';

function CharacterDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCharacter();
    }, [id]);

    const fetchCharacter = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getCharacterById(id);
            setCharacter(response.data);
        } catch (err) {
            console.error('Error fetching character:', err);
            setError('Failed to load character details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading character..." size="large" />;
    }

    if (error || !character) {
        return (
            <div className="char-detail-error">
                <div className="char-detail-error-icon">⚠️</div>
                <h2>{error || 'Character not found'}</h2>
                <button onClick={() => navigate('/characters')} className="char-detail-back-btn">
                    <FaArrowLeft /> Back to Characters
                </button>
            </div>
        );
    }

    return (
        <div className="character-detail-page">
            {/* Back Button */}
            <button onClick={() => navigate(-1)} className="char-detail-back-btn top">
                <FaArrowLeft /> Back
            </button>

            {/* Hero Section */}
            <div className="char-detail-hero">
                <div 
                    className="char-detail-hero-bg"
                    style={{
                        backgroundImage: `url(${character.images?.jpg?.image_url})`
                    }}
                ></div>
                <div className="char-detail-hero-overlay"></div>
                
                <div className="char-detail-hero-content">
                    <div className="char-detail-image">
                        <img 
                            src={character.images?.jpg?.image_url} 
                            alt={character.name}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x300/1a1a2e/666?text=No+Image';
                            }}
                        />
                    </div>
                    
                    <div className="char-detail-info">
                        <h1 className="char-detail-name">{character.name}</h1>
                        {character.name_kanji && (
                            <h2 className="char-detail-kanji">{character.name_kanji}</h2>
                        )}
                        
                        <div className="char-detail-meta">
                            <span className="char-detail-favorites">
                                <FaHeart className="char-detail-heart" />
                                {character.favorites || 0} Favorites
                            </span>
                            {character.nicknames && character.nicknames.length > 0 && (
                                <>
                                    <span className="char-detail-meta-divider">•</span>
                                    <span className="char-detail-nicknames">
                                        {character.nicknames.join(', ')}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* About Section */}
                        {character.about && (
                            <div className="char-detail-about">
                                <h3>
                                    <FaInfoCircle className="char-detail-section-icon" />
                                    About
                                </h3>
                                <p>{character.about}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Anime Appears In */}
            {character.anime && character.anime.length > 0 && (
                <div className="char-detail-section">
                    <h3 className="char-detail-section-title">
                        <FaUsers className="char-detail-section-icon" />
                        Appears In
                    </h3>
                    <div className="char-detail-anime-grid">
                        {character.anime.map((item) => (
                            <div 
                                key={item.anime.mal_id}
                                className="char-detail-anime-card"
                                onClick={() => navigate(`/anime/${item.anime.mal_id}`)}
                            >
                                <img 
                                    src={item.anime.images?.jpg?.image_url} 
                                    alt={item.anime.title}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/100x140/1a1a2e/666?text=No+Image';
                                    }}
                                />
                                <div className="char-detail-anime-info">
                                    <h4>{item.anime.title}</h4>
                                    <span className="char-detail-anime-role">{item.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Voice Actors */}
            {character.voices && character.voices.length > 0 && (
                <div className="char-detail-section">
                    <h3 className="char-detail-section-title">
                        <FaUsers className="char-detail-section-icon" />
                        Voice Actors
                    </h3>
                    <div className="char-detail-voices-grid">
                        {character.voices.map((voice) => (
                            <div key={voice.person.mal_id} className="char-detail-voice-card">
                                <img 
                                    src={voice.person.images?.jpg?.image_url} 
                                    alt={voice.person.name}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/60x60/1a1a2e/666?text=No+Image';
                                    }}
                                />
                                <div className="char-detail-voice-info">
                                    <h4>{voice.person.name}</h4>
                                    <span className="char-detail-voice-language">{voice.language}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Related Manga */}
            {character.manga && character.manga.length > 0 && (
                <div className="char-detail-section">
                    <h3 className="char-detail-section-title">
                        <FaLink className="char-detail-section-icon" />
                        Related Manga
                    </h3>
                    <div className="char-detail-manga-grid">
                        {character.manga.map((item) => (
                            <div key={item.manga.mal_id} className="char-detail-manga-card">
                                <img 
                                    src={item.manga.images?.jpg?.image_url} 
                                    alt={item.manga.title}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/80x100/1a1a2e/666?text=No+Image';
                                    }}
                                />
                                <div className="char-detail-manga-info">
                                    <h4>{item.manga.title}</h4>
                                    <span className="char-detail-manga-role">{item.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CharacterDetail;