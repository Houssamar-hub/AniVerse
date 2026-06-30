// components/Hero.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaFire, FaStar } from 'react-icons/fa';
import { getTopAnime } from '../api/homeApi';
import LoadingSpinner from './LoadingSpinner';
import '../styles/HeroSection.css';

function Hero() {
    const navigate = useNavigate();
    const [topAnime, setTopAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTopAnime();
    }, []);

    const fetchTopAnime = async () => {
        try {
            setLoading(true);
            const response = await getTopAnime(1, 1);
            if (response.data && response.data.length > 0) {
                setTopAnime(response.data[0]);
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching top anime:', err);
            setError('Failed to load featured anime');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading featured anime..." size="medium" />;
    }

    if (error || !topAnime) {
        return (
            <section className="hero-section">
                <div className="hero-error">
                    <p>{error || 'No anime found'}</p>
                    <button onClick={fetchTopAnime} className="hero-retry-btn">
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="hero-section">
            <div className="hero-overlay"></div>
            
            <div 
                className="hero-background"
                style={{
                    backgroundImage: `url(${topAnime.images.jpg.large_image_url || topAnime.images.jpg.image_url})`
                }}
            ></div>
            
            <div className="hero-content">
                <div className="hero-badge">
                    <FaFire className="hero-badge-icon" />
                    <span>#1 Top Anime</span>
                </div>
                
                <h1 className="hero-title">
                    {topAnime.title}
                </h1>
                
                <div className="hero-meta">
                    <span className="hero-score">
                        <FaStar className="hero-star" />
                        {topAnime.score || 'N/A'}
                    </span>
                    <span className="hero-meta-divider">•</span>
                    <span>{topAnime.episodes || '?'} Episodes</span>
                    <span className="hero-meta-divider">•</span>
                    <span>{topAnime.year || 'N/A'}</span>
                    <span className="hero-meta-divider">•</span>
                    <span className="hero-status">{topAnime.status || 'Unknown'}</span>
                </div>
                
                <p className="hero-description">
                    {topAnime.synopsis 
                        ? topAnime.synopsis.length > 200 
                            ? topAnime.synopsis.substring(0, 200) + '...' 
                            : topAnime.synopsis
                        : 'No synopsis available.'
                    }
                </p>
                
                <div className="hero-genres">
                    {topAnime.genres && topAnime.genres.slice(0, 4).map((genre) => (
                        <span key={genre.mal_id} className="hero-genre-tag">
                            {genre.name}
                        </span>
                    ))}
                </div>
                
                <div className="hero-buttons">
                    <button 
                        onClick={() => navigate(`/anime/${topAnime.mal_id}`)}
                        className="hero-btn-primary"
                    >
                        View Details
                        <FaArrowRight className="hero-btn-icon" />
                    </button>
                    <button 
                        onClick={() => navigate('/anime')}
                        className="hero-btn-secondary"
                    >
                        Explore All Anime
                    </button>
                </div>
            </div>
            
            <div className="hero-image">
                <img 
                    src={topAnime.images.jpg.large_image_url || topAnime.images.jpg.image_url} 
                    alt={topAnime.title}
                    className="hero-anime-image"
                />
                <div className="hero-image-glow"></div>
            </div>
        </section>
    );
}

export default Hero;