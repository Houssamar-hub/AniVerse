// components/Hero.jsx
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaFire } from 'react-icons/fa';
import '../styles/HeroSection.css'; 

function Hero() {
    const navigate = useNavigate();

    return (
        <section className="hero-section">
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <div className="hero-badge">
                    <FaFire className="hero-badge-icon" />
                    <span>Trending Now</span>
                </div>
                <h1 className="hero-title">
                    Discover Your
                    <span className="hero-title-highlight"> Anime Universe</span>
                </h1>
                <p className="hero-description">
                    Explore thousands of anime, track your favorites, 
                    and build your personal collection. Your journey starts here.
                </p>
                <div className="hero-buttons">
                    <button 
                        onClick={() => navigate('/anime')}
                        className="hero-btn-primary"
                    >
                        Explore Anime
                        <FaArrowRight className="hero-btn-icon" />
                    </button>
                    <button 
                        onClick={() => navigate('/favorites')}
                        className="hero-btn-secondary"
                    >
                        My Favorites
                    </button>
                </div>
                <div className="hero-stats">
                    <div className="hero-stat">
                        <span className="hero-stat-number">10K+</span>
                        <span className="hero-stat-label">Anime</span>
                    </div>
                    <div className="hero-stat-divider"></div>
                    <div className="hero-stat">
                        <span className="hero-stat-number">500+</span>
                        <span className="hero-stat-label">Genres</span>
                    </div>
                    <div className="hero-stat-divider"></div>
                    <div className="hero-stat">
                        <span className="hero-stat-number">1M+</span>
                        <span className="hero-stat-label">Fans</span>
                    </div>
                </div>
            </div>
            <div className="hero-image">
                <div className="hero-image-placeholder">
                    <span>🎌</span>
                </div>
            </div>
        </section>
    );
}

export default Hero;